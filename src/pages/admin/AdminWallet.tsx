import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    useUsersList,
    useUserBalance,
    useUserTransactions,
    useDeposit,
} from '../../hooks/useUsers';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import { formatCurrency, formatDate } from '../../lib/utils';
import type { WalletTransaction, User } from '../../types';

const depositSchema = z.object({
    amount: z.coerce.number().min(0.01, 'Minimum deposit is 0.01'),
    note: z.string().optional(),
});

const roleColor: Record<string, 'blue' | 'green' | 'purple'> = {
    customer: 'blue',
    admin: 'green',
    superadmin: 'purple',
};

export default function AdminWallet() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [txPage, setTxPage] = useState(1);
    const [depositOpen, setDepositOpen] = useState(false);

    const { data: usersData, isLoading: usersLoading } = useUsersList(
        page,
        20,
        search || undefined,
    );

    const { data: balance, isLoading: balanceLoading } = useUserBalance(
        selectedUser?.id ?? '',
    );
    const { data: txData, isLoading: txLoading } = useUserTransactions(
        selectedUser?.id ?? '',
        txPage,
        20,
    );

    const deposit = useDeposit();

    const form = useForm<{ amount: number; note?: string }>({
        resolver: zodResolver(depositSchema),
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
    };

    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
        setTxPage(1);
    };

    if (selectedUser) {
        return (
            <div>
                <button
                    onClick={() => setSelectedUser(null)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 mb-4"
                >
                    &larr; Back to users
                </button>

                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    User: {selectedUser.email}
                </h1>

                {balanceLoading ? (
                    <LoadingSpinner />
                ) : !balance ? (
                    <EmptyState message="User not found" />
                ) : (
                    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">User ID</p>
                                <p className="font-mono text-sm text-gray-900">
                                    {selectedUser.id}
                                </p>
                                <Badge
                                    variant={
                                        roleColor[selectedUser.role] ?? 'blue'
                                    }
                                >
                                    {selectedUser.role}
                                </Badge>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Balance</p>
                                <p className="text-2xl font-bold text-indigo-600">
                                    {formatCurrency(balance.balance)}
                                </p>
                            </div>
                            <Button onClick={() => setDepositOpen(true)}>
                                Deposit
                            </Button>
                        </div>
                    </div>
                )}

                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Transactions
                </h2>
                {txLoading ? (
                    <LoadingSpinner />
                ) : !txData || txData.items.length === 0 ? (
                    <EmptyState message="No transactions" />
                ) : (
                    <>
                        <div className="space-y-3">
                            {txData.items.map((tx: WalletTransaction) => (
                                <div
                                    key={tx.id}
                                    className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 capitalize">
                                            {tx.reason.replace('_', ' ')}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatDate(tx.createdAt)}
                                        </p>
                                        {tx.note && (
                                            <p className="text-xs text-gray-400">
                                                {tx.note}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p
                                            className={`text-sm font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}
                                        >
                                            {tx.type === 'credit'
                                                ? '+'
                                                : '-'}
                                            {formatCurrency(tx.amount)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Pagination
                            page={txData.page}
                            limit={txData.limit}
                            total={txData.total}
                            onPageChange={setTxPage}
                        />
                    </>
                )}

                <Modal
                    open={depositOpen}
                    onClose={() => setDepositOpen(false)}
                    title="Deposit"
                >
                    <form
                        onSubmit={form.handleSubmit((dto) => {
                            deposit.mutate(
                                { userId: selectedUser.id, dto },
                                { onSuccess: () => setDepositOpen(false) },
                            );
                        })}
                        className="space-y-4"
                    >
                        <Input
                            label="Amount"
                            type="number"
                            step="0.01"
                            {...form.register('amount')}
                        />
                        <Input
                            label="Note (optional)"
                            {...form.register('note')}
                        />
                        <Button
                            type="submit"
                            loading={deposit.isPending}
                            className="w-full"
                        >
                            Deposit
                        </Button>
                    </form>
                </Modal>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Wallet Management
            </h1>

            <form onSubmit={handleSearch} className="flex gap-4 mb-8">
                <Input
                    placeholder="Search by email..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="max-w-sm"
                />
            </form>

            {usersLoading ? (
                <LoadingSpinner />
            ) : !usersData || usersData.items.length === 0 ? (
                <EmptyState message="No users found" />
            ) : (
                <>
                    <Table
                        columns={[
                            {
                                key: 'email',
                                header: 'Email',
                                render: (row: User) => row.email,
                            },
                            {
                                key: 'role',
                                header: 'Role',
                                render: (row: User) => (
                                    <Badge
                                        variant={
                                            roleColor[row.role] ?? 'blue'
                                        }
                                    >
                                        {row.role}
                                    </Badge>
                                ),
                            },
                            {
                                key: 'balance',
                                header: 'Balance',
                                render: (row: User) =>
                                    formatCurrency(row.balance),
                            },
                            {
                                key: 'createdAt',
                                header: 'Joined',
                                render: (row: User) =>
                                    formatDate(row.createdAt),
                            },
                        ]}
                        data={usersData.items}
                        onRowClick={handleSelectUser}
                    />
                    <Pagination
                        page={usersData.page}
                        limit={usersData.limit}
                        total={usersData.total}
                        onPageChange={setPage}
                    />
                </>
            )}
        </div>
    );
}
