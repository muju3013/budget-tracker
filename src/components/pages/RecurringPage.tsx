import React, { useState } from 'react';
import { 
  Repeat, 
  Plus, 
  Play, 
  Trash2, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  Clock,
  Zap
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { RecurringTransaction, TransactionType, RecurringFrequency } from '../../types/finance';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { PAYMENT_METHODS } from '../../utils/constants';

export const RecurringPage: React.FC = () => {
  const { 
    recurringTxs, 
    currency, 
    addRecurringTransaction, 
    deleteRecurringTransaction, 
    processDueRecurring,
    categories 
  } = useFinance();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState('Bills');
  const [frequency, setFrequency] = useState<RecurringFrequency>('monthly');
  const [nextDueDate, setNextDueDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [note, setNote] = useState('');

  const handleProcessDue = async () => {
    setIsProcessing(true);
    await processDueRecurring();
    setIsProcessing(false);
  };

  const handleCreateRecurring = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!title || isNaN(amt) || amt <= 0 || !nextDueDate) return;

    await addRecurringTransaction({
      title,
      amount: amt,
      type,
      category,
      frequency,
      startDate: new Date().toISOString().split('T')[0],
      nextDueDate,
      paymentMethod: paymentMethod as any,
      note,
      isActive: true
    });

    setTitle('');
    setAmount('');
    setNextDueDate('');
    setNote('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Recurring Subscriptions & Bills</h2>
          <p className="text-xs text-slate-400">Automate your monthly rent, subscriptions, salary deposits, and utility bills</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleProcessDue}
            disabled={isProcessing}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isProcessing ? 'Processing...' : 'Process Due Bills'}</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Recurring Item</span>
          </button>
        </div>
      </div>

      {/* Recurring Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {recurringTxs.map(item => (
          <div 
            key={item.id}
            className="bg-slate-900/90 dark:bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 hover:border-slate-700 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  item.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                }`}>
                  {item.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">{item.title}</h4>
                  <span className="text-[11px] text-slate-400 font-medium">{item.category}</span>
                </div>
              </div>

              <button
                onClick={() => deleteRecurringTransaction(item.id)}
                className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition-colors"
                title="Delete Recurring Item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-xs text-slate-400">Amount ({item.frequency})</span>
              <span className={`text-base font-extrabold ${item.type === 'income' ? 'text-emerald-400' : 'text-slate-100'}`}>
                {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount, currency)}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Next Due: <strong className="text-slate-200">{formatDate(item.nextDueDate)}</strong>
              </span>
              <span className="capitalize px-2 py-0.5 bg-slate-800 rounded-md text-slate-300 font-semibold">
                {item.frequency}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <form onSubmit={handleCreateRecurring} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100">Add Recurring Transaction</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Monthly Rent, Internet Broadband"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Amount</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="25000"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as TransactionType)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Frequency</label>
                  <select
                    value={frequency}
                    onChange={e => setFrequency(e.target.value as RecurringFrequency)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">First / Next Due Date</label>
                <input
                  type="date"
                  required
                  value={nextDueDate}
                  onChange={e => setNextDueDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                >
                  {PAYMENT_METHODS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl"
              >
                Save Recurring Item
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
