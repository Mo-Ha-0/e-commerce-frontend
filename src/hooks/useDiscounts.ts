import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import type { Discount, CreateDiscountDto, UpdateDiscountDto } from '../types';
import { toast } from 'react-toastify';

export function useDiscounts() {
    return useQuery({
        queryKey: ['discounts'],
        queryFn: () =>
            api.get<Discount[]>(ENDPOINTS.DISCOUNTS).then((res) => res.data),
    });
}

export function useDiscount(id: string) {
    return useQuery({
        queryKey: ['discount', id],
        queryFn: () =>
            api
                .get<Discount>(`${ENDPOINTS.DISCOUNTS}/${id}`)
                .then((res) => res.data),
        enabled: !!id,
    });
}

export function useCreateDiscount() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (dto: CreateDiscountDto) =>
            api.post(ENDPOINTS.DISCOUNTS, dto),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['discounts'] });
            toast.success('Discount created');
        },
    });
}

export function useUpdateDiscount() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateDiscountDto }) =>
            api.patch(`${ENDPOINTS.DISCOUNTS}/${id}`, dto),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['discounts'] });
            toast.success('Discount updated');
        },
    });
}

export function useDeleteDiscount() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api.delete(`${ENDPOINTS.DISCOUNTS}/${id}`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['discounts'] });
            toast.success('Discount deleted');
        },
    });
}
