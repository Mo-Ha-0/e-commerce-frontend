import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import type {
    DepositDto,
    WalletTransaction,
    PaginatedResponse,
} from '../types';
import { toast } from 'react-toastify';

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

export function useUserTransactions(userId: string, page = 1, limit = 20) {
    return useQuery({
        queryKey: ['admin', 'wallet', userId, 'transactions', page, limit],
        queryFn: () =>
            api
                .get<
                    PaginatedResponse<WalletTransaction>
                >(`${ENDPOINTS.WALLET}/admin/users/${userId}/transactions`, { params: { page, limit } })
                .then((res) => res.data),
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
