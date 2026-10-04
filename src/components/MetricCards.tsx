import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  PiggyBank, 
  AlertTriangle,
  ShieldAlert
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const MetricCards: React.FC = () => {
  const { summary, categorySpending, currency } = useFinance();

  const warningCategories = categorySpending.filter(c => c.percentage >= 75);
  const exceededCategories = categorySpending.filter(c => c.percentage >= 100);

  return (
    <div className="space-y-4">
      {/* Global Warning Banner */}
      {warningCategories.length > 0 && (
        <div className="rounded-xl p-3.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-3 shadow-sm">
          {exceededCategories.length > 0 ? (
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div className="text-xs">
            <span className="font-bold">
              {exceededCategories.length > 0
                ? `Budget Limit Exceeded in: ${exceededCategories.map(c => c.category).join(', ')}!`
                : `Budget Warning: ${warningCategories.map(c => c.category).join(', ')} used over 75% capacity.`}
            </span>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Check your category caps in Budget Planner to keep spending under control.
            </p>
          </div>
        </div>
      )}

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Net Balance</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-100 tracking-tight">
              {formatCurrency(summary.totalBalance, currency)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Lifetime total funds balance</p>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Monthly Income</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-emerald-400 tracking-tight">
              {formatCurrency(summary.totalIncome, currency)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Total earnings this month</p>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Monthly Expenses</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-rose-400 tracking-tight">
              {formatCurrency(summary.totalExpense, currency)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Total spending this month</p>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Remaining Budget</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-100 tracking-tight">
              {formatCurrency(summary.remainingBudget, currency)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">{Math.round(100 - summary.spendingPercentage)}% budget remaining</p>
          </div>
        </div>
      </div>
    </div>
  );
};
