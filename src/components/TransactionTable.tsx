import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Transaction } from '../types/finance';
import { CATEGORY_COLORS } from '../utils/constants';
import { 
  Search, 
  Receipt,
  Check,
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Trash2
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface TransactionTableProps {
  onEditTransaction: (tx: Transaction) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ onEditTransaction }) => {
  const { 
    filteredTransactions, 
    filters, 
    setFilters, 
    deleteTransaction,
    categories,
    currency
  } = useFinance();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const totalPages = Math.ceil(filteredTransactions.length / pageSize) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDelete = async (id: string) => {
    await deleteTransaction(id);
    setDeleteConfirmId(null);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      type: 'all',
      startDate: '',
      endDate: '',
      sortBy: 'date-desc'
    });
    setCurrentPage(1);
  };

  return (
    <div className="bg-slate-900/90 dark:bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 my-0 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-400" />
            Transaction Records
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Search, filter, edit, and audit income & expense entries ({filteredTransactions.length} items)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, note..."
              value={filters.search}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, search: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 text-slate-100 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={filters.category}
            onChange={(e) => {
              setFilters(prev => ({ ...prev, category: e.target.value }));
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 text-xs bg-slate-950 text-slate-200 rounded-xl border border-slate-800 outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          <select
            value={filters.type}
            onChange={(e) => {
              setFilters(prev => ({ ...prev, type: e.target.value }));
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 text-xs bg-slate-950 text-slate-200 rounded-xl border border-slate-800 outline-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="income">Income (+)</option>
            <option value="expense">Expense (-)</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200 font-medium">
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  No transaction records found matching your filters.
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((tx) => {
                const categoryColor = CATEGORY_COLORS[tx.category] || '#64748B';
                const isDeleting = deleteConfirmId === tx.id;

                return (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                      {tx.date}
                    </td>

                    <td className="py-3 px-4 text-slate-100 font-bold whitespace-nowrap">
                      {tx.title}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border"
                        style={{
                          backgroundColor: `${categoryColor}15`,
                          borderColor: `${categoryColor}40`,
                          color: categoryColor
                        }}
                      >
                        {tx.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                        tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {tx.type}
                      </span>
                    </td>

                    <td className={`py-3 px-4 text-right font-extrabold whitespace-nowrap ${
                      tx.type === 'income' ? 'text-emerald-400' : 'text-slate-100'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-center">
                      {isDeleting ? (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleDelete(tx.id)}
                            className="p-1 rounded bg-rose-600 text-white"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="p-1 rounded bg-slate-800 text-slate-300"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onEditTransaction(tx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(tx.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs">
        <div className="text-slate-400">
          Showing <span className="font-semibold text-slate-100">
            {filteredTransactions.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          </span> to <span className="font-semibold text-slate-100">
            {Math.min(currentPage * pageSize, filteredTransactions.length)}
          </span> of <span className="font-semibold text-slate-100">{filteredTransactions.length}</span> entries
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-slate-950 text-slate-300 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold px-2 text-slate-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-slate-950 text-slate-300 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
