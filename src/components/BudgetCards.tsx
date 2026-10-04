import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Sliders, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface BudgetCardsProps {
  onOpenBudgetModal: () => void;
}

export const BudgetCards: React.FC<BudgetCardsProps> = ({ onOpenBudgetModal }) => {
  const { categorySpending, currency } = useFinance();

  return (
    <div className="bg-slate-900/90 dark:bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100 my-0 flex items-center gap-2">
            Monthly Category Budgets
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Visual limits and warning thresholds (Amber at 75%, Red at 90%+)
          </p>
        </div>
        <button
          onClick={onOpenBudgetModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl border border-emerald-500/20 transition-all cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Edit Limits</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {categorySpending.map(cat => {
          const isDanger = cat.percentage >= 90;
          const isWarning = cat.percentage >= 75 && cat.percentage < 90;

          return (
            <div
              key={cat.category}
              className={`rounded-xl p-3.5 border transition-all duration-200 ${
                isDanger
                  ? 'bg-rose-500/10 border-rose-500/40 shadow-sm'
                  : isWarning
                  ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-xs font-bold text-slate-200 truncate max-w-[110px]">
                    {cat.category}
                  </span>
                </div>

                {isDanger ? (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                ) : isWarning ? (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 opacity-60" />
                )}
              </div>

              <div className="mt-2 space-y-1">
                <div className="flex justify-between items-baseline text-[11px]">
                  <span className="font-bold text-slate-100">
                    {formatCurrency(cat.spent, currency, 0)}
                  </span>
                  <span className="text-slate-400">
                    / {formatCurrency(cat.limit, currency, 0)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isDanger
                        ? 'bg-rose-500'
                        : isWarning
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] font-medium pt-0.5">
                  <span className={isDanger ? 'text-rose-400 font-bold' : isWarning ? 'text-amber-400 font-semibold' : 'text-slate-400'}>
                    {cat.percentage.toFixed(0)}% used
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
