import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    useProducts,
    useCreateProduct,
    useUpdateProduct,
} from '../../hooks/useProducts';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { formatCurrency } from '../../lib/utils';
import type { Product } from '../../types';

const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    price: z.coerce.number().min(0.01, 'Price must be at least 0.01'),
    stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
});

type ProductForm = z.infer<typeof productSchema>;

export default function AdminProducts() {
    const [page, setPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);
    const { data, isLoading } = useProducts(page, 20);
    const createProduct = useCreateProduct();
    const updateProduct = useUpdateProduct();

    const form = useForm<ProductForm>({
        resolver: zodResolver(productSchema),
        defaultValues: { name: '', description: '', price: 0, stock: 0 },
    });

    const openCreate = () => {
        setEditing(null);
        form.reset({ name: '', description: '', price: 0, stock: 0 });
        setModalOpen(true);
    };

    const openEdit = (product: Product) => {
        setEditing(product);
        form.reset({
            name: product.name,
            description: product.description,
            price: parseFloat(product.price),
            stock: product.stock,
        });
        setModalOpen(true);
    };

    const onSubmit = (dto: ProductForm) => {
        if (editing) {
            updateProduct.mutate(
                { id: editing.id, dto },
                { onSuccess: () => setModalOpen(false) },
            );
        } else {
            createProduct.mutate(dto, { onSuccess: () => setModalOpen(false) });
        }
    };

    const products = data?.items ?? [];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <Button onClick={openCreate}>Add Product</Button>
            </div>

            {isLoading ? (
                <LoadingSpinner />
            ) : products.length === 0 ? (
                <EmptyState message="No products yet" />
            ) : (
                <>
                    <Table
                        columns={[
                            {
                                key: 'name',
                                header: 'Name',
                                render: (p: Product) => p.name,
                            },
                            {
                                key: 'price',
                                header: 'Price',
                                render: (p: Product) => formatCurrency(p.price),
                            },
                            {
                                key: 'stock',
                                header: 'Stock',
                                render: (p: Product) => p.stock,
                            },
                        ]}
                        data={products}
                        onRowClick={(p) => openEdit(p)}
                    />
                    <Pagination
                        page={data!.page}
                        limit={data!.limit}
                        total={data!.total}
                        onPageChange={setPage}
                    />
                </>
            )}

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editing ? 'Edit Product' : 'Create Product'}
            >
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <Input
                        label="Name"
                        {...form.register('name')}
                        error={form.formState.errors.name?.message}
                    />
                    <Input
                        label="Description"
                        {...form.register('description')}
                        error={form.formState.errors.description?.message}
                    />
                    <Input
                        label="Price"
                        type="number"
                        step="0.01"
                        {...form.register('price')}
                        error={form.formState.errors.price?.message}
                    />
                    <Input
                        label="Stock"
                        type="number"
                        {...form.register('stock')}
                        error={form.formState.errors.stock?.message}
                    />
                    <Button
                        type="submit"
                        loading={
                            createProduct.isPending || updateProduct.isPending
                        }
                        className="w-full"
                    >
                        {editing ? 'Update' : 'Create'}
                    </Button>
                </form>
            </Modal>
        </div>
    );
}
