import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import type { InventoryLog, UpdateStockDto, RestockDto } from '../types';
import { toast } from 'react-toastify';

export function useLowStock(threshold = 5) {
    return useQuery({
        queryKey: ['inventory', 'low-stock', threshold],
        queryFn: () =>
            api
                .get(`${ENDPOINTS.INVENTORY}/low-stock`, {
                    params: { threshold },
                })
                .then((res) => res.data),
    });
}

export function useInventoryLogs() {
    return useQuery({
        queryKey: ['inventory', 'logs'],
        queryFn: () =>
            api
                .get<InventoryLog[]>(`${ENDPOINTS.INVENTORY}/logs`)
                .then((res) => res.data),
    });
}

export function useUpdateStock() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({
            productId,
            dto,
        }: {
            productId: string;
            dto: UpdateStockDto;
        }) => api.patch(`${ENDPOINTS.INVENTORY}/${productId}`, dto),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['products'] });
            qc.invalidateQueries({ queryKey: ['inventory'] });
            toast.success('Stock updated');
        },
    });
}

export function useRestock() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({
            productId,
            dto,
        }: {
            productId: string;
            dto: RestockDto;
        }) => api.post(`${ENDPOINTS.INVENTORY}/${productId}/restock`, dto),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['products'] });
            qc.invalidateQueries({ queryKey: ['inventory'] });
            toast.success('Restocked successfully');
        },
    });
}
