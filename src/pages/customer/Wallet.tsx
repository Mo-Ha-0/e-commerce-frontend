import { useState } from 'react'
import { FiDollarSign } from 'react-icons/fi'
import { useWallet, useWalletTransactions } from '../../hooks/useWallet'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import Pagination from '../../components/ui/Pagination'
import Badge from '../../components/ui/Badge'
import { formatCurrency, formatDate } from '../../lib/utils'
import type { WalletTransaction } from '../../types'

export default function Wallet() {
  const [page, setPage] = useState(1)
  const { data: wallet, isLoading: walletLoading } = useWallet()
  const { data: txData, isLoading: txLoading } = useWalletTransactions(page, 20)

  if (walletLoading) return <LoadingSpinner />

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Wallet</h1>

      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white mb-8">
        <p className="text-indigo-100 text-sm mb-1">Current Balance</p>
        <p className="text-4xl font-bold">{formatCurrency(wallet?.balance ?? 0)}</p>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h2>

      {txLoading ? (
        <LoadingSpinner />
      ) : !txData || txData.data.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No transactions yet</p>
      ) : (
        <>
          <div className="space-y-3">
            {txData.data.map((tx: WalletTransaction) => (
              <div key={tx.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                    <FiDollarSign className={tx.type === 'credit' ? 'text-green-600' : 'text-red-600'} size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">{tx.reason.replace('_', ' ')}</p>
                    <p className="text-xs text-gray-500">{formatDate(tx.createdAt)}</p>
                    {tx.note && <p className="text-xs text-gray-400 mt-0.5">{tx.note}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                  <p className="text-xs text-gray-400">Balance: {formatCurrency(tx.balanceAfter)}</p>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            page={txData.page}
            limit={txData.limit}
            total={txData.total}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}
