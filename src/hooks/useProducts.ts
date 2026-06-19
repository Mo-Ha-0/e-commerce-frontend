import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/axios'
import { ENDPOINTS } from '../api/endpoints'
import type { Product, PaginatedResponse, CreateProductDto, UpdateProductDto } from '../types'
import { toast } from 'react-toastify'

export function useProducts(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['products', page, limit],
    queryFn: () =>
      api.get<PaginatedResponse<Product>>(ENDPOINTS.PRODUCTS, { params: { page, limit } })
        .then((res) => res.data),
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () =>
      api.get<Product>(`${ENDPOINTS.PRODUCTS}/${id}`).then((res) => res.data),
    enabled: !!id,
  })
}

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateProductDto) => api.post(ENDPOINTS.PRODUCTS, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product created')
    },
  })
}

export function useUpdateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateProductDto }) =>
      api.patch(`${ENDPOINTS.PRODUCTS}/${id}`, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product updated')
    },
  })
}
