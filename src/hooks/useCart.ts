import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import type { CartResponse, AddCartItemDto, UpdateCartItemDto } from '../types';
import { toast } from 'react-toastify';

export function useCart() {
    return useQuery({
        queryKey: ['cart'],
        queryFn: () =>
            api.get<CartResponse>(ENDPOINTS.CART).then((res) => res.data),
    });
}

export function useAddCartItem() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (dto: AddCartItemDto) =>
            api.post(`${ENDPOINTS.CART}/items`, dto),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['cart'] });
            toast.success('Added to cart');
        },
    });
}

export function useUpdateCartItem() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({
            productId,
            dto,
        }: {
            productId: string;
            dto: UpdateCartItemDto;
        }) => api.patch(`${ENDPOINTS.CART}/items/${productId}`, dto),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
    });
}

export function useRemoveCartItem() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (productId: string) =>
            api.delete(`${ENDPOINTS.CART}/items/${productId}`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['cart'] });
            toast.success('Removed from cart');
        },
    });
}

export function useClearCart() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: () => api.delete(ENDPOINTS.CART),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
    });
}
