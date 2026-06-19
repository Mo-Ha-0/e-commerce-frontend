import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import type {
    WalletTransaction,
    WalletResponse,
    PaginatedResponse,
} from '../types';

export function useWallet() {
    return useQuery({
        queryKey: ['wallet'],
        queryFn: () =>
            api.get<WalletResponse>(ENDPOINTS.WALLET).then((res) => res.data),
    });
}

interface WalletTxResponse {
    data: WalletTransaction[];
    meta: { page: number; limit: number; total: number; totalPages: number };
}

export function useWalletTransactions(page = 1, limit = 20) {
    return useQuery({
        queryKey: ['wallet-transactions', page, limit],
        queryFn: async () => {
            const res = await api.get<WalletTxResponse>(
                `${ENDPOINTS.WALLET}/transactions`,
                {
                    params: { page, limit },
                },
            );
            return {
                items: res.data.data,
                page: res.data.meta.page,
                limit: res.data.meta.limit,
                total: res.data.meta.total,
            } satisfies PaginatedResponse<WalletTransaction>;
        },
    });
}
