import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import type {
    DepositDto,
    WalletTransaction,
    PaginatedResponse,
    User,
} from '../types';
import { toast } from 'react-toastify';

interface ListResponse<T> {
    data: T[];
    meta: { page: number; limit: number; total: number; totalPages: number };
}

export function useUsersList(page = 1, limit = 20, search?: string) {
    return useQuery({
        queryKey: ['admin', 'users', page, limit, search],
        queryFn: async () => {
            const params: Record<string, string | number> = { page, limit };
            if (search) params.search = search;
            const res = await api.get<ListResponse<User>>(ENDPOINTS.USERS, {
                params,
            });
            return {
                items: res.data.data,
                page: res.data.meta.page,
                limit: res.data.meta.limit,
                total: res.data.meta.total,
            } satisfies PaginatedResponse<User>;
        },
    });
}

export function useUserBalance(userId: string) {
    return useQuery({
        queryKey: ['admin', 'wallet', userId],
        queryFn: () =>
            api
                .get(`${ENDPOINTS.WALLET}/admin/users/${userId}`)
                .then((res) => res.data),
        enabled: !!userId,
    });
}

interface WalletTxResponse {
    data: WalletTransaction[];
    meta: { page: number; limit: number; total: number; totalPages: number };
}

export function useUserTransactions(userId: string, page = 1, limit = 20) {
    return useQuery({
        queryKey: ['admin', 'wallet', userId, 'transactions', page, limit],
        queryFn: async () => {
            const res = await api.get<WalletTxResponse>(
                `${ENDPOINTS.WALLET}/admin/users/${userId}/transactions`,
                { params: { page, limit } },
            );
            return {
                items: res.data.data,
                page: res.data.meta.page,
                limit: res.data.meta.limit,
                total: res.data.meta.total,
            } satisfies PaginatedResponse<WalletTransaction>;
        },
        enabled: !!userId,
    });
}

export function useDeposit() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, dto }: { userId: string; dto: DepositDto }) =>
            api.post(`${ENDPOINTS.WALLET}/admin/users/${userId}/deposit`, dto),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['admin', 'wallet'] });
            toast.success('Deposit successful');
        },
    });
}
