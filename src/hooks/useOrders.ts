import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import type { Order } from '../types';
import { toast } from 'react-toastify';

export function useOrders() {
    return useQuery({
        queryKey: ['orders'],
        queryFn: () =>
            api.get<Order[]>(ENDPOINTS.ORDERS).then((res) => res.data),
    });
}

export function useOrder(id: string) {
    return useQuery({
        queryKey: ['order', id],
        queryFn: () =>
            api.get<Order>(`${ENDPOINTS.ORDERS}/${id}`).then((res) => res.data),
        enabled: !!id,
    });
}

export function useCheckout() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: () => api.post(ENDPOINTS.ORDERS),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['orders'] });
            qc.invalidateQueries({ queryKey: ['cart'] });
            qc.invalidateQueries({ queryKey: ['wallet'] });
            toast.success('Order placed successfully!');
        },
    });
}

export function useAdminOrders() {
    return useQuery({
        queryKey: ['orders', 'admin'],
        queryFn: () =>
            api
                .get<Order[]>(`${ENDPOINTS.ORDERS}/admin`)
                .then((res) => res.data),
    });
}
