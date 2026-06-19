import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { useProducts } from '../../hooks/useProducts';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import Badge from '../../components/ui/Badge';
import { formatCurrency } from '../../lib/utils';

export default function Products() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const { data, isLoading } = useProducts(page, 20);

    const products = data?.items ?? [];
    const filtered = search
        ? products.filter((p) =>
              p.name.toLowerCase().includes(search.toLowerCase()),
          )
        : products;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <div className="relative">
                    <FiSearch
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                    />
                </div>
            </div>

            {isLoading ? (
                <LoadingSpinner />
            ) : filtered.length === 0 ? (
                <EmptyState
                    message={
                        search
                            ? 'No products match your search'
                            : 'No products yet'
                    }
                />
            ) : (
                <>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map((product) => (
                            <Link
                                key={product.id}
                                to={`/products/${product.id}`}
                                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                    <span className="text-4xl text-gray-300">
                                        {product.name[0]}
                                    </span>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                        {product.description}
                                    </p>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="text-lg font-bold text-indigo-600">
                                            {formatCurrency(product.price)}
                                        </span>
                                        <Badge
                                            label={
                                                product.stock > 0
                                                    ? 'In Stock'
                                                    : 'Out of Stock'
                                            }
                                            color={
                                                product.stock > 0
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }
                                        />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {data && (
                        <Pagination
                            page={data.page}
                            limit={data.limit}
                            total={data.total}
                            onPageChange={setPage}
                        />
                    )}
                </>
            )}
        </div>
    );
}
