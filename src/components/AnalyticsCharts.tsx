import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as RechartsTooltip, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { PieChart as PieIcon, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const AnalyticsCharts: React.FC = () => {
  const { categorySpending, monthlyCashFlow, theme, summary, currency } = useFinance();
  const [activeChartType, setActiveChartType] = useState<'area' | 'bar'>('area');

  const isDark = theme === 'dark';

  // Format dataset for Donut Chart (filter out zero spent categories)
  const donutData = categorySpending
    .filter(c => c.spent > 0)
    .map(c => ({
      name: c.category,
      value: c.spent,
      color: c.color
    }));

  // Custom Glass Tooltip for Pie Chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = summary.totalExpense > 0 ? ((data.value / summary.totalExpense) * 100).toFixed(1) : '0';
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-white">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.payload.color }} />
            {data.name}
          </div>
          <div className="text-slate-300">
            Amount: <span className="font-semibold text-white">{formatCurrency(data.value, currency)}</span>
          </div>
          <div className="text-emerald-400 font-semibold">
            {percentage}% of total spending
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Glass Tooltip for Area Chart
  const CustomAreaTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3.5 rounded-xl shadow-xl text-xs space-y-2">
          <div className="font-bold text-white text-sm border-b border-slate-700/50 pb-1">
            {label} Cash Flow
          </div>
          {payload.map((entry: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 capitalize font-medium text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-bold text-white">
                {formatCurrency(entry.value, currency)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Category Breakdown Donut Chart (5 cols) */}
      <div className="lg:col-span-5 bg-slate-900/90 dark:bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 my-0 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-400" />
              Category Breakdown
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Expense distribution across categories
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            {donutData.length} Active Categories
          </div>
        </div>

        {donutData.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs">
            No expense data available for chart visualization
          </div>
        ) : (
          <div className="relative h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  stroke={isDark ? '#0f172a' : '#ffffff'}
                  strokeWidth={2}
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[11px] text-slate-400 font-medium">Total Spent</span>
              <span className="text-base font-extrabold text-slate-100">
                {formatCurrency(summary.totalExpense, currency)}
              </span>
            </div>
          </div>
        )}

        {/* Legend pills */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-slate-800">
          {categorySpending.slice(0, 6).map(cat => (
            <div 
              key={cat.category}
              className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800"
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
              <span className="text-slate-300">{cat.category}:</span>
              <span className="text-slate-100 font-bold">{formatCurrency(cat.spent, currency)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cash Flow Trends Area Chart (7 cols) */}
      <div className="lg:col-span-7 bg-slate-900/90 dark:bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 my-0 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Cash Flow & Trends
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Monthly income vs expense timeline
            </p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyCashFlow} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
              <RechartsTooltip content={<CustomAreaTooltip />} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
              <Area 
                type="monotone" 
                dataKey="income" 
                name="Income" 
                stroke="#10B981" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#incomeGradient)" 
              />
              <Area 
                type="monotone" 
                dataKey="expense" 
                name="Expense" 
                stroke="#F43F5E" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#expenseGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
