import React from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  PieChart as PieChartIcon,
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles,
  Calendar,
  ChevronRight,
  Zap,
  AlertTriangle,
  Receipt
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { AnalyticsCharts } from '../AnalyticsCharts';

interface DashboardPageProps {
  onOpenQuickAdd: () => void;
  onOpenBudgetModal: () => void;
  onEditTransaction: (tx: any) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ 
  onOpenQuickAdd, 
  onOpenBudgetModal,
  onEditTransaction 
}) => {
  const { 
    summary, 
    currency, 
    transactions, 
    categorySpending, 
    setActiveTab, 
    deleteTransaction,
    userProfile
  } = useFinance();

  const latestTransactions = transactions.slice(0, 7);

  // Generate Smart Dynamic Insights
  const insights = React.useMemo(() => {
    const list: { text: string; type: 'info' | 'warning' | 'success'; icon: React.ReactNode }[] = [];

    // Food spending insight
    const foodCat = categorySpending.find(c => c.category === 'Food');
    if (foodCat && foodCat.spent > 0) {
      if (foodCat.percentage >= 90) {
        list.push({
          text: `You have consumed ${Math.round(foodCat.percentage)}% of your Food budget (${formatCurrency(foodCat.spent, currency)} spent).`,
          type: 'warning',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />
        });
      } else {
        list.push({
          text: `Food spending currently stands at ${formatCurrency(foodCat.spent, currency)} (${Math.round(foodCat.percentage)}% of limit).`,
          type: 'info',
          icon: <Zap className="w-4 h-4 text-emerald-400" />
        });
      }
    }

    // Savings insight
    if (summary.savingsThisMonth > 0) {
      list.push({
        text: `Great progress! You saved ${formatCurrency(summary.savingsThisMonth, currency)} this month.`,
        type: 'success',
        icon: <PiggyBank className="w-4 h-4 text-emerald-400" />
      });
    }

    // Highest expense insight
    const expenseTxs = transactions.filter(t => t.type === 'expense');
    if (expenseTxs.length > 0) {
      const highest = expenseTxs.reduce((prev, curr) => curr.amount > prev.amount ? curr : prev, expenseTxs[0]);
      list.push({
        text: `Your highest expense this month was "${highest.title}" for ${formatCurrency(highest.amount, currency)} (${highest.category}).`,
        type: 'info',
        icon: <Receipt className="w-4 h-4 text-indigo-400" />
      });
    }

    if (list.length === 0) {
      list.push({
        text: 'Add more transactions to generate customized AI financial observations.',
        type: 'info',
        icon: <Sparkles className="w-4 h-4 text-teal-400" />
      });
    }

    return list;
  }, [summary, categorySpending, transactions, currency]);

  return (
    <div className="space-y-6">
      
      {/* 5 Executive Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Total Balance */}
        <div className="bg-slate-900/90 dark:bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Net Balance</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
              {formatCurrency(summary.totalBalance, currency)}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span>Lifetime accumulated net worth</span>
            </p>
          </div>
        </div>

        {/* Card 2: Income this month */}
        <div className="bg-slate-900/90 dark:bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Income This Month</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-400 tracking-tight">
              {formatCurrency(summary.totalIncome, currency)}
            </h3>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold">
              <span className={`flex items-center ${summary.incomeMoMPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {summary.incomeMoMPercent >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {Math.abs(Math.round(summary.incomeMoMPercent))}%
              </span>
              <span className="text-slate-500">vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 3: Expenses this month */}
        <div className="bg-slate-900/90 dark:bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Expenses This Month</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl sm:text-2xl font-extrabold text-rose-400 tracking-tight">
              {formatCurrency(summary.totalExpense, currency)}
            </h3>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold">
              <span className={`flex items-center ${summary.expenseMoMPercent <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {summary.expenseMoMPercent >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {Math.abs(Math.round(summary.expenseMoMPercent))}%
              </span>
              <span className="text-slate-500">vs last month</span>
            </div>
          </div>
        </div>

        {/* Card 4: Remaining Monthly Budget */}
        <div className="bg-slate-900/90 dark:bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Remaining Budget</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <PieChartIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
              {formatCurrency(summary.remainingBudget, currency)}
            </h3>
            <div className="mt-1 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">
                Limit: {formatCurrency(summary.totalBudgetLimit, currency)}
              </span>
              <span className="text-emerald-400 font-bold">
                {Math.round(100 - summary.spendingPercentage)}% Left
              </span>
            </div>
          </div>
        </div>

        {/* Card 5: Savings This Month */}
        <div className="bg-slate-900/90 dark:bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg hover:border-slate-700 transition-all sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Savings This Month</span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-xl sm:text-2xl font-extrabold text-teal-400 tracking-tight">
              {formatCurrency(summary.savingsThisMonth, currency)}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Target: {formatCurrency(userProfile.monthlySavingsGoal || 40000, currency)}
            </p>
          </div>
        </div>

      </div>

      {/* Smart Insights Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100 tracking-tight">Smart Financial Insights</h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Real-time Data Analysis</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {insights.map((item, idx) => (
            <div key={idx} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex items-start gap-2.5">
              <div className="mt-0.5">{item.icon}</div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics & Charts */}
      <AnalyticsCharts />

      {/* Recent Transactions Widget */}
      <div className="bg-slate-900/90 dark:bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 tracking-tight">Recent Transactions</h3>
            <p className="text-xs text-slate-400">Latest financial activities and payments</p>
          </div>
          <button
            onClick={() => setActiveTab('transactions')}
            className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
          >
            <span>View All Transactions</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {latestTransactions.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No transactions recorded yet. Click "Add Transaction" to start tracking.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80 overflow-x-auto">
            {latestTransactions.map(tx => (
              <div key={tx.id} className="py-3 flex items-center justify-between gap-4 hover:bg-slate-800/30 px-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                    tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {tx.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-200 truncate">{tx.title}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="font-medium text-slate-300">{tx.category}</span>
                      <span>•</span>
                      <span>{formatDate(tx.date)}</span>
                      {tx.paymentMethod && (
                        <>
                          <span>•</span>
                          <span className="text-slate-500">{tx.paymentMethod}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs sm:text-sm font-extrabold whitespace-nowrap ${
                    tx.type === 'income' ? 'text-emerald-400' : 'text-slate-100'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                  </span>
                  <button
                    onClick={() => onEditTransaction(tx)}
                    className="text-[11px] text-slate-400 hover:text-emerald-400 font-semibold px-2 py-1 bg-slate-800/60 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
