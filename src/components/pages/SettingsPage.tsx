import React, { useState } from 'react';
import { 
  User, 
  Globe, 
  Sun, 
  Moon, 
  Layers, 
  RotateCcw, 
  Trash2, 
  Plus, 
  Save, 
  Check, 
  Database,
  Sparkles,
  AlertTriangle,
  Download
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { CurrencyCode, CategoryItem } from '../../types/finance';
import { CURRENCY_MAP, formatCurrency } from '../../utils/formatters';
import { exportToCSV } from '../../utils/csvHelpers';

export const SettingsPage: React.FC = () => {
  const { 
    userProfile, 
    updateUserProfile, 
    currency, 
    setCurrency, 
    theme, 
    toggleTheme,
    categories,
    addCategory,
    deleteCategory,
    resetToSeedData,
    clearAllData,
    transactions
  } = useFinance();

  const { openAuthModal } = useAuth();

  // Profile Form State
  const [fullName, setFullName] = useState(userProfile.fullName || '');
  const [email, setEmail] = useState(userProfile.email || '');
  const [monthlyIncome, setMonthlyIncome] = useState(userProfile.monthlyIncome?.toString() || '160000');
  const [monthlySavingsGoal, setMonthlySavingsGoal] = useState(userProfile.monthlySavingsGoal?.toString() || '40000');
  const [budgetResetDate, setBudgetResetDate] = useState(userProfile.budgetResetDate?.toString() || '1');
  const [profileSaved, setProfileSaved] = useState(false);

  // Category State
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<'income' | 'expense'>('expense');
  const [deletingCatId, setDeletingCatId] = useState<string | null>(null);
  const [reassignTargetCat, setReassignTargetCat] = useState<string>('Other Expenses');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const inc = parseFloat(monthlyIncome) || 0;
    const sav = parseFloat(monthlySavingsGoal) || 0;
    const rDay = parseInt(budgetResetDate) || 1;

    await updateUserProfile({
      fullName,
      email,
      monthlyIncome: inc,
      monthlySavingsGoal: sav,
      budgetResetDate: rDay
    });

    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    await addCategory({
      name: newCatName.trim(),
      type: newCatType,
      icon: newCatType === 'income' ? 'Coins' : 'Tag',
      color: newCatType === 'income' ? '#10B981' : '#3B82F6'
    });

    setNewCatName('');
  };

  const handleDeleteCategoryConfirm = async () => {
    if (!deletingCatId) return;
    const success = await deleteCategory(deletingCatId, reassignTargetCat);
    if (success) {
      setDeletingCatId(null);
    }
  };

  const handleExportData = () => {
    exportToCSV(transactions, 'fintrack-all-transactions.csv');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">Settings & Preferences</h2>
        <p className="text-xs text-slate-400">Manage user profile, preferred currency, theme, categories, and dataset</p>
      </div>

      {/* 1. User Profile Section */}
      <section className="bg-slate-900/90 dark:bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Personal Profile & Preferences</h3>
              <p className="text-xs text-slate-400">Configure income, savings goals, and reset cycle</p>
            </div>
          </div>

          <button
            onClick={() => openAuthModal('login')}
            className="text-xs text-emerald-400 font-semibold hover:underline"
          >
            Authentication Setup
          </button>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Monthly Income ({currency})</label>
              <input
                type="number"
                value={monthlyIncome}
                onChange={e => setMonthlyIncome(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Monthly Savings Goal ({currency})</label>
              <input
                type="number"
                value={monthlySavingsGoal}
                onChange={e => setMonthlySavingsGoal(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Budget Reset Day of Month</label>
              <input
                type="number"
                min="1"
                max="31"
                value={budgetResetDate}
                onChange={e => setBudgetResetDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {profileSaved && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" />
                Profile preferences saved successfully!
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </section>

      {/* 2. Currency & Visual Theme */}
      <section className="bg-slate-900/90 dark:bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Currency & Visual Appearance</h3>
            <p className="text-xs text-slate-400">Select currency formatting and toggle light/dark theme</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          
          {/* Preferred Currency */}
          <div className="space-y-2">
            <label className="block text-slate-300 font-semibold">Preferred Currency</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(CURRENCY_MAP) as CurrencyCode[]).map(code => (
                <button
                  key={code}
                  onClick={() => setCurrency(code)}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    currency === code 
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold' 
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{CURRENCY_MAP[code].name}</span>
                  {currency === code && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Note: Changing currency formatting updates numbers display (e.g. ₹1,25,000.00 for INR).
            </p>
          </div>

          {/* Theme Selector */}
          <div className="space-y-2">
            <label className="block text-slate-300 font-semibold">Appearance Theme</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { if (theme !== 'dark') toggleTheme(); }}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  theme === 'dark' 
                    ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 font-bold' 
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>Dark Mode</span>
                </div>
                {theme === 'dark' && <Check className="w-4 h-4 text-indigo-400" />}
              </button>

              <button
                onClick={() => { if (theme !== 'light') toggleTheme(); }}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                  theme === 'light' 
                    ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 font-bold' 
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Light Mode</span>
                </div>
                {theme === 'light' && <Check className="w-4 h-4 text-indigo-400" />}
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Customizable Categories */}
      <section className="bg-slate-900/90 dark:bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Category Management</h3>
            <p className="text-xs text-slate-400">Add custom income/expense categories and rename or delete existing ones</p>
          </div>
        </div>

        {/* Add Category Form */}
        <form onSubmit={handleCreateCategory} className="flex flex-col sm:flex-row items-center gap-3 text-xs">
          <input
            type="text"
            placeholder="New Category Name (e.g. Gym, Subscriptions)"
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            className="flex-1 w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
          />

          <select
            value={newCatType}
            onChange={e => setNewCatType(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none"
          >
            <option value="expense">Expense Category</option>
            <option value="income">Income Category</option>
          </select>

          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Category</span>
          </button>
        </form>

        {/* Category List Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map(c => (
            <div 
              key={c.id}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs flex items-center gap-2"
            >
              <span 
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: c.color || '#10B981' }}
              />
              <span className="font-semibold text-slate-200">{c.name}</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold">({c.type})</span>

              {!c.isDefault && (
                <button
                  onClick={() => setDeletingCatId(c.id)}
                  className="text-slate-500 hover:text-rose-400 ml-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 4. Data Management & Sample Data */}
      <section className="bg-slate-900/90 dark:bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Data Management & Sample Mode</h3>
            <p className="text-xs text-slate-400">Export your dataset, reload realistic INR sample demo data, or clear local storage</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <button
            onClick={handleExportData}
            className="p-4 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl text-left space-y-2 transition-all"
          >
            <Download className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-slate-100">Export Full CSV</h4>
            <p className="text-slate-400 text-[11px]">Download all transactions in standard CSV format.</p>
          </button>

          <button
            onClick={resetToSeedData}
            className="p-4 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl text-left space-y-2 transition-all"
          >
            <RotateCcw className="w-5 h-5 text-amber-400" />
            <h4 className="font-bold text-slate-100">Reload Sample Demo Data</h4>
            <p className="text-slate-400 text-[11px]">Reset ledger with realistic Indian Rupee (INR) transactions.</p>
          </button>

          <button
            onClick={clearAllData}
            className="p-4 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl text-left space-y-2 transition-all"
          >
            <Trash2 className="w-5 h-5 text-rose-400" />
            <h4 className="font-bold text-rose-400">Clear All User Data</h4>
            <p className="text-slate-400 text-[11px]">Purge local storage records and start with a fresh blank ledger.</p>
          </button>
        </div>
      </section>

      {/* Delete Category Modal */}
      {deletingCatId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100">Delete Category</h3>
            <p className="text-xs text-slate-400">If any transactions currently use this category, select a fallback category to reassign them to:</p>
            
            <div className="text-xs">
              <label className="block text-slate-300 font-semibold mb-1">Reassign Existing Transactions To:</label>
              <select
                value={reassignTargetCat}
                onChange={e => setReassignTargetCat(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 outline-none"
              >
                {categories.filter(c => c.id !== deletingCatId).map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingCatId(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategoryConfirm}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
