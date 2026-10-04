import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  Wallet, 
  Plus, 
  Sun, 
  Moon, 
  Download, 
  Upload, 
  RotateCcw,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { exportToCSV } from '../utils/csvHelpers';

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenBudgetModal: () => void;
  onOpenCSVModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onOpenBudgetModal,
  onOpenCSVModal,
}) => {
  const { theme, toggleTheme, transactions, resetToSeedData } = useFinance();

  const handleExport = () => {
    const today = new Date().toISOString().split('T')[0];
    exportToCSV(transactions, `budget_tracker_${today}.csv`);
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-200 dark:border-slate-800 backdrop-blur-md px-4 sm:px-6 py-3.5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <Wallet className="h-5.5 w-5.5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white my-0">
                  ApexFinance
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="w-3 h-3" /> Pro
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Personal Expense & Budget Dashboard
              </p>
            </div>
          </div>

          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="md:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap justify-end w-full md:w-auto">
          {/* Reset Demo Data Button */}
          <button
            onClick={resetToSeedData}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-lg border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
            title="Reset to seed demo data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Demo Data</span>
          </button>

          {/* Manage Budgets Button */}
          <button
            onClick={onOpenBudgetModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-lg border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
            title="Configure Budget Limits"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500" />
            <span>Budgets</span>
          </button>

          {/* CSV Import */}
          <button
            onClick={onOpenCSVModal}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-lg border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
            title="Import from CSV"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Import CSV</span>
          </button>

          {/* CSV Export */}
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-lg border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
            title="Export transactions to CSV"
          >
            <Download className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* Theme Toggle (Desktop) */}
          <button
            onClick={toggleTheme}
            className="hidden md:flex items-center justify-center p-2 rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="Toggle Light / Dark mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Primary Quick Add CTA Button */}
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg shadow-md shadow-indigo-600/25 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>
    </header>
  );
};
