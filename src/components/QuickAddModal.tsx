import React, { useState, useEffect } from 'react';
import { X, Plus, Save, AlertCircle } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Transaction, TransactionType, PaymentMethod } from '../types/finance';
import { PAYMENT_METHODS } from '../utils/constants';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTransaction?: Transaction | null;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  editTransaction
}) => {
  const { addTransaction, updateTransaction, categories, currency } = useFinance();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  // Populate form if editing
  useEffect(() => {
    if (editTransaction) {
      setTitle(editTransaction.title);
      setAmount(editTransaction.amount.toString());
      setType(editTransaction.type);
      setCategory(editTransaction.category);
      setDate(editTransaction.date);
      setPaymentMethod(editTransaction.paymentMethod || 'UPI');
      setNote(editTransaction.note || '');
    } else {
      setTitle('');
      setAmount('');
      setType('expense');
      setCategory(categories[0]?.name || 'Food');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('UPI');
      setNote('');
    }
    setError('');
  }, [editTransaction, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numAmount = parseFloat(amount);
    if (!title.trim()) {
      setError('Transaction title is required.');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Amount must be a positive number greater than zero.');
      return;
    }
    if (!date) {
      setError('Please select a valid date.');
      return;
    }

    try {
      if (editTransaction) {
        await updateTransaction({
          ...editTransaction,
          title: title.trim(),
          amount: numAmount,
          type,
          category: category || (type === 'income' ? 'Salary' : 'Food'),
          date,
          paymentMethod,
          note: note.trim()
        });
      } else {
        await addTransaction({
          title: title.trim(),
          amount: numAmount,
          type,
          category: category || (type === 'income' ? 'Salary' : 'Food'),
          date,
          paymentMethod,
          note: note.trim()
        });
      }

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed saving transaction.');
    }
  };

  const availableCategories = categories.filter(c => c.type === type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-slate-100">
            {editTransaction ? 'Edit Transaction' : 'Record New Transaction'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Income vs Expense Selector */}
          <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl font-bold">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                if (categories.filter(c => c.type === 'expense').length > 0) {
                  setCategory(categories.filter(c => c.type === 'expense')[0].name);
                }
              }}
              className={`py-2.5 rounded-lg transition-all ${
                type === 'expense' ? 'bg-rose-500 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                if (categories.filter(c => c.type === 'income').length > 0) {
                  setCategory(categories.filter(c => c.type === 'income')[0].name);
                }
              }}
              className={`py-2.5 rounded-lg transition-all ${
                type === 'income' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Income (+)
            </button>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Title / Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Supermarket Groceries, Salary Deposit"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Amount ({currency})</label>
              <input
                type="number"
                step="0.01"
                required
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none"
              >
                {availableCategories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Transaction Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none"
              >
                {PAYMENT_METHODS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Notes / Tags (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Weekly organic produce & kitchen supplies"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-500/20"
            >
              {editTransaction ? 'Update Transaction' : 'Save Transaction'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
