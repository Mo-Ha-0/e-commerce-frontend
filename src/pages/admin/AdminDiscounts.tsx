import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiSearch, FiCheck, FiX } from 'react-icons/fi';
import {
    useDiscounts,
    useCreateDiscount,
    useUpdateDiscount,
    useDeleteDiscount,
} from '../../hooks/useDiscounts';
import { useProducts } from '../../hooks/useProducts';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../lib/utils';
import type { Discount, Product } from '../../types';

const discountSchema = z.object({
    name: z.string().min(1),
    type: z.enum(['PERCENTAGE', 'FIXED']),
    value: z.coerce.number().min(0.01),
    productId: z.string().optional(),
    isActive: z.boolean().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});

type DiscountForm = z.infer<typeof discountSchema>;

export default function AdminDiscounts() {
    const { data: discounts, isLoading } = useDiscounts();
    const { data: productsData } = useProducts(1, 200);
    const createDiscount = useCreateDiscount();
    const updateDiscount = useUpdateDiscount();
    const deleteDiscount = useDeleteDiscount();
    const products = productsData?.items ?? [];

    const [modalOpen, setModalOpen] = useState(false);
    const [productPickerOpen, setProductPickerOpen] = useState(false);
    const [productSearch, setProductSearch] = useState('');
    const [editing, setEditing] = useState<Discount | null>(null);

    const form = useForm<DiscountForm>({
        resolver: zodResolver(discountSchema),
        defaultValues: {
            name: '',
            type: 'PERCENTAGE',
            value: 0,
            isActive: true,
        },
    });

    const selectedProductId = form.watch('productId');
    const selectedProduct = products.find(
        (p: Product) => p.id === selectedProductId,
    );

    const openCreate = () => {
        setEditing(null);
        form.reset({ name: '', type: 'PERCENTAGE', value: 0, isActive: true });
        setModalOpen(true);
    };

    const toDatetimeLocal = (dateStr: string | null | undefined) => {
        if (!dateStr) return undefined;
        const d = new Date(dateStr);
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const openEdit = (d: Discount) => {
        setEditing(d);
        form.reset({
            name: d.name,
            type: d.type,
            value: parseFloat(d.value),
            productId: d.productId ?? undefined,
            isActive: d.isActive,
            startDate: toDatetimeLocal(d.startDate),
            endDate: toDatetimeLocal(d.endDate),
        });
        setModalOpen(true);
    };

    const onSubmit = (raw: DiscountForm) => {
        const dto = {
            ...raw,
            productId: raw.productId || undefined,
            startDate: raw.startDate
                ? new Date(raw.startDate).toISOString()
                : undefined,
            endDate: raw.endDate
                ? new Date(raw.endDate).toISOString()
                : undefined,
        };
        if (editing) {
            updateDiscount.mutate(
                { id: editing.id, dto },
                { onSuccess: () => setModalOpen(false) },
            );
        } else {
            createDiscount.mutate(dto, {
                onSuccess: () => setModalOpen(false),
            });
        }
    };

    const filteredProducts = productSearch
        ? products.filter((p: Product) =>
              p.name.toLowerCase().includes(productSearch.toLowerCase()),
          )
        : products;

    const list = discounts ?? [];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Discounts</h1>
                <Button onClick={openCreate}>Add Discount</Button>
            </div>

            {isLoading ? (
                <LoadingSpinner />
            ) : list.length === 0 ? (
                <EmptyState message="No discounts yet" />
            ) : (
                <Table
                    columns={[
                        {
                            key: 'name',
                            header: 'Name',
                            render: (d: Discount) => d.name,
                        },
                        {
                            key: 'type',
                            header: 'Type',
                            render: (d: Discount) => <Badge label={d.type} />,
                        },
                        {
                            key: 'value',
                            header: 'Value',
                            render: (d: Discount) =>
                                d.type === 'PERCENTAGE'
                                    ? `${d.value}%`
                                    : `$${d.value}`,
                        },
                        {
                            key: 'active',
                            header: 'Active',
                            render: (d: Discount) => (
                                <Badge
                                    label={d.isActive ? 'Active' : 'Inactive'}
                                    color={
                                        d.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }
                                />
                            ),
                        },
                        {
                            key: 'dates',
                            header: 'Dates',
                            render: (d: Discount) => (
                                <span className="text-xs text-gray-500">
                                    {d.startDate
                                        ? formatDate(d.startDate)
                                        : 'No start'}{' '}
                                    -{' '}
                                    {d.endDate
                                        ? formatDate(d.endDate)
                                        : 'No end'}
                                </span>
                            ),
                        },
                        {
                            key: 'actions',
                            header: '',
                            render: (d: Discount) => (
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => openEdit(d)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() =>
                                            deleteDiscount.mutate(d.id)
                                        }
                                    >
                                        Delete
                                    </Button>
                                </div>
                            ),
                        },
                    ]}
                    data={list}
                />
            )}

            {/* Discount form modal */}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editing ? 'Edit Discount' : 'Create Discount'}
            >
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <Input label="Name" {...form.register('name')} />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                        </label>
                        <select
                            {...form.register('type')}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        >
                            <option value="PERCENTAGE">Percentage</option>
                            <option value="FIXED">Fixed</option>
                        </select>
                    </div>
                    <Input
                        label="Value"
                        type="number"
                        step="0.01"
                        {...form.register('value')}
                    />

                    {/* Product selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product (optional)
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 min-h-[38px] flex items-center">
                                {selectedProduct ? (
                                    <span className="text-gray-900">
                                        {selectedProduct.name} —{' '}
                                        {formatCurrency(selectedProduct.price)}
                                    </span>
                                ) : (
                                    <span className="text-gray-400">
                                        Global Discount (all products)
                                    </span>
                                )}
                            </div>
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => setProductPickerOpen(true)}
                            >
                                Browse
                            </Button>
                            {selectedProduct && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        form.setValue('productId', undefined)
                                    }
                                    className="text-gray-400 hover:text-red-600"
                                >
                                    <FiX size={18} />
                                </button>
                            )}
                        </div>
                    </div>

                    <Input
                        label="Start Date (optional)"
                        type="datetime-local"
                        {...form.register('startDate')}
                    />
                    <Input
                        label="End Date (optional)"
                        type="datetime-local"
                        {...form.register('endDate')}
                    />
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            {...form.register('isActive')}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        Active
                    </label>
                    <Button
                        type="submit"
                        loading={
                            createDiscount.isPending || updateDiscount.isPending
                        }
                        className="w-full"
                    >
                        {editing ? 'Update' : 'Create'}
                    </Button>
                </form>
            </Modal>

            {/* Product picker modal */}
            <Modal
                open={productPickerOpen}
                onClose={() => {
                    setProductPickerOpen(false);
                    setProductSearch('');
                }}
                title="Select Product"
            >
                <div className="relative mb-4">
                    <FiSearch
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        autoFocus
                    />
                </div>

                <div className="space-y-1 max-h-80 overflow-y-auto">
                    <button
                        type="button"
                        onClick={() => {
                            form.setValue('productId', undefined);
                            setProductPickerOpen(false);
                            setProductSearch('');
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between ${
                            !selectedProductId
                                ? 'bg-indigo-50 text-indigo-700 font-medium'
                                : 'hover:bg-gray-50 text-gray-700'
                        }`}
                    >
                        <span>Global Discount (all products)</span>
                        {!selectedProductId && (
                            <FiCheck className="text-indigo-600" />
                        )}
                    </button>

                    <div className="border-t border-gray-100 my-1" />

                    {filteredProducts.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-4">
                            No products found
                        </p>
                    ) : (
                        filteredProducts.map((p: Product) => (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => {
                                    form.setValue('productId', p.id);
                                    setProductPickerOpen(false);
                                    setProductSearch('');
                                }}
                                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between ${
                                    selectedProductId === p.id
                                        ? 'bg-indigo-50 text-indigo-700 font-medium'
                                        : 'hover:bg-gray-50 text-gray-700'
                                }`}
                            >
                                <div>
                                    <span>{p.name}</span>
                                    <span className="text-gray-400 ml-2">
                                        {formatCurrency(p.price)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`text-xs ${p.stock > 0 ? 'text-green-600' : 'text-red-600'}`}
                                    >
                                        {p.stock} left
                                    </span>
                                    {selectedProductId === p.id && (
                                        <FiCheck className="text-indigo-600" />
                                    )}
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </Modal>
        </div>
    );
}
