import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'
import { ENDPOINTS } from '../api/endpoints'
import type { WalletTransaction, PaginatedResponse } from '../types'

export function useWallet() {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: () => api.get(ENDPOINTS.WALLET).then((res) => res.data),
  })
}

export function useWalletTransactions(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['wallet-transactions', page, limit],
    queryFn: () =>
      api.get<PaginatedResponse<WalletTransaction>>(`${ENDPOINTS.WALLET}/transactions`, {
        params: { page, limit },
      }).then((res) => res.data),
  })
}
