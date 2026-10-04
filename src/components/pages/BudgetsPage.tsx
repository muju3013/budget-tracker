import React, { useState } from 'react';
import { 
  PieChart, 
  Plus, 
  Edit3, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  TrendingDown, 
  Sliders,
  DollarSign
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';

interface BudgetsPageProps {
  onOpenBudgetModal: () => void;
}

export const BudgetsPage: React.FC<BudgetsPageProps> = ({ onOpenBudgetModal }) => {
  const { categorySpending, currency, summary, userProfile, updateUserProfile } = useFinance();
  const [isEditingOverall, setIsEditingOverall] = useState(false);
  const [overallLimitInput, setOverallLimitInput] = useState(userProfile.overallBudgetLimit?.toString() || '100000');

  const handleSaveOverallBudget = () => {
    const val = parseFloat(overallLimitInput);
    if (!isNaN(val) && val > 0) {
      updateUserProfile({ overallBudgetLimit: val });
      setIsEditingOverall(false);
    }
  };

  const totalSpent = summary.totalExpense;
  const totalLimit = summary.totalBudgetLimit;
  const totalRemaining = Math.max(0, totalLimit - totalSpent);
  const totalPercentage = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Monthly Budget Planner</h2>
          <p className="text-xs text-slate-400">Set spending caps, monitor category budgets, and prevent overspending</p>
        </div>
        <button
          onClick={onOpenBudgetModal}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
        >
          <Sliders className="w-4 h-4 stroke-[2.5]" />
          <span>Configure Category Caps</span>
        </button>
      </div>

      {/* Executive Overall Monthly Budget Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Overall Monthly Spending Limit</span>
              {!isEditingOverall && (
                <button 
                  onClick={() => setIsEditingOverall(true)}
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {isEditingOverall ? (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  value={overallLimitInput}
                  onChange={e => setOverallLimitInput(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-slate-100 font-bold px-3 py-1.5 rounded-xl text-lg outline-none w-44"
                />
                <button
                  onClick={handleSaveOverallBudget}
                  className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingOverall(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-xl"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight mt-1">
                {formatCurrency(totalLimit, currency)}
              </h3>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6">
            <div>
              <span className="text-slate-400 font-medium">Spent so far</span>
              <p className="text-base font-bold text-rose-400 mt-0.5">
                {formatCurrency(totalSpent, currency)}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Remaining balance</span>
              <p className="text-base font-bold text-emerald-400 mt-0.5">
                {formatCurrency(totalRemaining, currency)}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Budget utilized</span>
              <p className="text-base font-bold text-slate-100 mt-0.5">
                {Math.round(totalPercentage)}%
              </p>
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                totalPercentage >= 100 ? 'bg-rose-500' : totalPercentage >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, totalPercentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-100 tracking-tight">Category Spending vs Caps</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categorySpending.map(item => {
            const isExceeded = item.percentage >= 100;
            const isCritical = item.percentage >= 90 && item.percentage < 100;
            const isWarning = item.percentage >= 75 && item.percentage < 90;
            const remaining = Math.max(0, item.limit - item.spent);

            return (
              <div 
                key={item.category}
                className="bg-slate-900/90 dark:bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-bold text-sm text-slate-100">{item.category}</span>
                  </div>

                  {/* Status Badges */}
                  {isExceeded && (
                    <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold rounded-full flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" />
                      100% Exceeded
                    </span>
                  )}
                  {isCritical && (
                    <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      90% Critical
                    </span>
                  )}
                  {isWarning && (
                    <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      75% Warning
                    </span>
                  )}
                  {!isExceeded && !isCritical && !isWarning && (
                    <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      On Track
                    </span>
                  )}
                </div>

                {/* Amounts */}
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium">Spent</span>
                    <p className="text-base font-extrabold text-slate-100">
                      {formatCurrency(item.spent, currency)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 font-medium">Limit Cap</span>
                    <p className="text-sm font-bold text-slate-300">
                      {formatCurrency(item.limit, currency)}
                    </p>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="space-y-1.5">
                  <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isExceeded ? 'bg-rose-500' : isCritical ? 'bg-rose-400' : isWarning ? 'bg-amber-400' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, item.percentage)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className={isExceeded ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-slate-400'}>
                      {Math.round(item.percentage)}% used
                    </span>
                    <span className="text-emerald-400">
                      {formatCurrency(remaining, currency)} remaining
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
