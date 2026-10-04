import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  Edit2, 
  Trash2, 
  FileText, 
  Calendar,
  CreditCard,
  X,
  TrendingUp,
  TrendingDown,
  Download,
  AlertCircle
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { Transaction } from '../../types/finance';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { PAYMENT_METHODS } from '../../utils/constants';

interface TransactionsPageProps {
  onOpenQuickAdd: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onOpenCSVModal: () => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ 
  onOpenQuickAdd, 
  onEditTransaction,
  onOpenCSVModal 
}) => {
  const { 
    filteredTransactions, 
    filters, 
    setFilters, 
    currency, 
    deleteTransaction,
    categories 
  } = useFinance();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Calculate stats for current filtered list
  const stats = React.useMemo(() => {
    let income = 0;
    let expense = 0;
    filteredTransactions.forEach(t => {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    });
    return {
      count: filteredTransactions.length,
      income,
      expense,
      net: income - expense
    };
  }, [filteredTransactions]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      type: 'all',
      startDate: '',
      endDate: '',
      sortBy: 'date-desc'
    });
  };

  const handleDeleteConfirm = async (id: string) => {
    await deleteTransaction(id);
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Transactions Ledger</h2>
          <p className="text-xs text-slate-400">Complete record of your income deposits and expense transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCSVModal}
            className="px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Import / Export</span>
          </button>

          <button
            onClick={onOpenQuickAdd}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/90 dark:bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Input */}
          <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search title, note..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filters.type}
              onChange={e => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
            >
              <option value="all">All Types (Income & Expense)</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filters.category}
              onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name} ({c.type})</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={filters.sortBy}
              onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>

          {/* Date Range Inputs */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filters.startDate}
              onChange={e => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-2 py-1.5 text-[11px] outline-none"
              title="Start Date"
            />
            <span className="text-slate-500 text-xs">to</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={e => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-2 py-1.5 text-[11px] outline-none"
              title="End Date"
            />
          </div>

        </div>

        {/* Filter Stats Bar */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-slate-400">
            <span>Showing <strong className="text-slate-100">{stats.count}</strong> transactions</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-semibold">Income: {formatCurrency(stats.income, currency)}</span>
            <span className="text-slate-600">|</span>
            <span className="text-rose-400 font-semibold">Expenses: {formatCurrency(stats.expense, currency)}</span>
          </div>

          {(filters.search || filters.category !== 'all' || filters.type !== 'all' || filters.startDate || filters.endDate) && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Transactions Data Table */}
      <div className="bg-slate-900/90 dark:bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No transactions match your search or filter criteria.</p>
            <button
              onClick={handleResetFilters}
              className="text-xs text-emerald-400 hover:underline font-semibold"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Transaction</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {filteredTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-100">{tx.title}</p>
                          {tx.note && <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">{tx.note}</p>}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-slate-800/80 border border-slate-700 text-slate-300 font-medium rounded-lg text-[11px]">
                        {tx.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      {formatDate(tx.date)}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">
                      {tx.paymentMethod || 'Other'}
                    </td>

                    <td className={`py-3.5 px-4 text-right font-extrabold whitespace-nowrap ${
                      tx.type === 'income' ? 'text-emerald-400' : 'text-slate-100'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEditTransaction(tx)}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Edit Transaction"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeletingId(tx.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Delete Transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100">Confirm Delete</h3>
            <p className="text-xs text-slate-400">Are you sure you want to delete this transaction record? This action cannot be undone.</p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConfirm(deletingId)}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
