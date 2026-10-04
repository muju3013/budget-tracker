import React, { useState, useEffect } from 'react';
import { X, Save, Sliders } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { BudgetLimit } from '../types/finance';
import { formatCurrency } from '../utils/formatters';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose }) => {
  const { budgets, updateBudgets, categories, currency } = useFinance();
  const [localLimits, setLocalLimits] = useState<Record<string, number>>({});

  useEffect(() => {
    const map: Record<string, number> = {};
    budgets.forEach(b => {
      map[b.category] = b.limit;
    });

    // Ensure all expense categories exist
    categories.filter(c => c.type === 'expense').forEach(c => {
      if (map[c.name] === undefined) {
        map[c.name] = 10000;
      }
    });

    setLocalLimits(map);
  }, [budgets, categories, isOpen]);

  if (!isOpen) return null;

  const handleChange = (category: string, value: string) => {
    const val = parseFloat(value) || 0;
    setLocalLimits(prev => ({
      ...prev,
      [category]: val
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newBudgets: BudgetLimit[] = Object.entries(localLimits).map(([category, limit]) => ({
      category,
      limit
    }));

    await updateBudgets(newBudgets);
    onClose();
  };

  const expenseCats = categories.filter(c => c.type === 'expense');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-100">Category Budget Limits</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 space-y-4 text-xs">
          <p className="text-slate-400">
            Define monthly spending limit caps for each expense category in {currency}.
          </p>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 divide-y divide-slate-800/60">
            {expenseCats.map(cat => (
              <div key={cat.id} className="pt-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <span 
                    className="w-3 h-3 rounded-full shrink-0" 
                    style={{ backgroundColor: cat.color || '#10B981' }} 
                  />
                  <span className="font-semibold text-slate-200 truncate">{cat.name}</span>
                </div>

                <div className="w-36">
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={localLimits[cat.name] ?? 10000}
                    onChange={e => handleChange(cat.name, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-1.5 text-slate-100 font-bold outline-none text-right"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Budget Caps</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
