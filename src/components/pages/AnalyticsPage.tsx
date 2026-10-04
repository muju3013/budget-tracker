import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  PieChart as PieIcon,
  Sparkles,
  Zap,
  Check
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  LineChart, 
  Line,
  CartesianGrid
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportToCSV } from '../../utils/csvHelpers';

type DateFilterRange = 'this_week' | 'this_month' | 'last_month' | 'last_3_months' | 'this_year' | 'all';

export const AnalyticsPage: React.FC = () => {
  const { transactions, categorySpending, currency, monthlyCashFlow } = useFinance();
  const [range, setRange] = useState<DateFilterRange>('this_month');

  // Filter transactions based on date range selection
  const filteredTxs = React.useMemo(() => {
    const now = new Date();
    return transactions.filter(t => {
      if (!t.date) return false;
      const d = new Date(t.date + 'T00:00:00');

      if (range === 'this_week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
        return d >= weekAgo;
      }
      if (range === 'this_month') {
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }
      if (range === 'last_month') {
        const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear();
      }
      if (range === 'last_3_months') {
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        return d >= threeMonthsAgo;
      }
      if (range === 'this_year') {
        return d.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [transactions, range]);

  // Derived Calculations
  const analyticsSummary = React.useMemo(() => {
    let income = 0;
    let expense = 0;
    let highestExpense = { title: 'N/A', amount: 0, category: 'N/A' };

    filteredTxs.forEach(t => {
      if (t.type === 'income') {
        income += t.amount;
      } else {
        expense += t.amount;
        if (t.amount > highestExpense.amount) {
          highestExpense = { title: t.title, amount: t.amount, category: t.category };
        }
      }
    });

    const netSavings = Math.max(0, income - expense);
    const savingsRate = income > 0 ? (netSavings / income) * 100 : 0;
    const daysInPeriod = range === 'this_week' ? 7 : range === 'this_month' ? 30 : range === 'last_3_months' ? 90 : 365;
    const avgDailySpending = expense / (daysInPeriod || 30);

    return {
      income,
      expense,
      netSavings,
      savingsRate,
      avgDailySpending,
      highestExpense
    };
  }, [filteredTxs, range]);

  // Category Breakdown for Pie Chart
  const pieData = React.useMemo(() => {
    const catMap: Record<string, { spent: number; color: string }> = {};
    filteredTxs.forEach(t => {
      if (t.type === 'expense') {
        if (!catMap[t.category]) {
          catMap[t.category] = { spent: 0, color: '#10B981' };
        }
        catMap[t.category].spent += t.amount;
      }
    });

    const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#64748B'];
    return Object.entries(catMap).map(([name, data], idx) => ({
      name,
      value: data.spent,
      color: colors[idx % colors.length]
    })).sort((a, b) => b.value - a.value);
  }, [filteredTxs]);

  const handleExportCSV = () => {
    exportToCSV(filteredTxs, `fintrack-report-${range}.csv`);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar & Exporters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Analytics & Financial Reports</h2>
          <p className="text-xs text-slate-400">Deep dive insights, spending distribution, daily averages, and report downloads</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4 text-indigo-400" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Date Range Selector Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-bold text-slate-400 px-2 flex items-center gap-1.5 shrink-0">
          <Calendar className="w-4 h-4 text-emerald-400" />
          Time Period:
        </span>

        {[
          { id: 'this_week', label: 'This Week' },
          { id: 'this_month', label: 'This Month' },
          { id: 'last_month', label: 'Last Month' },
          { id: 'last_3_months', label: 'Last 3 Months' },
          { id: 'this_year', label: 'This Year' },
          { id: 'all', label: 'All Time' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setRange(item.id as DateFilterRange)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              range === item.id 
                ? 'bg-emerald-500 text-slate-950 shadow-md' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-semibold text-slate-400">Total Income</span>
          <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">
            {formatCurrency(analyticsSummary.income, currency)}
          </h3>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-semibold text-slate-400">Total Expenses</span>
          <h3 className="text-2xl font-extrabold text-rose-400 mt-1">
            {formatCurrency(analyticsSummary.expense, currency)}
          </h3>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-semibold text-slate-400">Savings Rate</span>
          <h3 className="text-2xl font-extrabold text-indigo-400 mt-1">
            {Math.round(analyticsSummary.savingsRate)}%
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Net saved: {formatCurrency(analyticsSummary.netSavings, currency)}</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-semibold text-slate-400">Avg Daily Spending</span>
          <h3 className="text-2xl font-extrabold text-amber-400 mt-1">
            {formatCurrency(analyticsSummary.avgDailySpending, currency)}
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5 truncate">Highest: {analyticsSummary.highestExpense.title}</p>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Income vs Expenses Cashflow */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h3 className="text-base font-bold text-slate-100">Monthly Cash Flow Comparison</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyCashFlow}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} 
                  formatter={(val: any) => [formatCurrency(Number(val) || 0, currency), '']}
                />
                <Bar dataKey="income" name="Income" fill="#10B981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#F43F5E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h3 className="text-base font-bold text-slate-100">Category Spending Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            {pieData.length === 0 ? (
              <span className="text-xs text-slate-500">No expense records in this time period</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    formatter={(val: any) => [formatCurrency(Number(val) || 0, currency), 'Spent']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
