import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Bell, 
  Sun, 
  Moon, 
  User, 
  LogOut, 
  RotateCcw, 
  Globe, 
  Menu,
  ChevronDown,
  Check,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { CurrencyCode } from '../../types/finance';
import { CURRENCY_MAP, formatRelativeTime } from '../../utils/formatters';

interface HeaderProps {
  onOpenQuickAdd: () => void;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuickAdd, onOpenMobileMenu }) => {
  const { 
    activeTab, 
    setActiveTab, 
    theme, 
    toggleTheme, 
    currency, 
    setCurrency, 
    notifications, 
    markNotificationRead,
    filters,
    setFilters,
    userProfile,
    resetToSeedData
  } = useFinance();

  const { openAuthModal } = useAuth();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Financial Overview', subtitle: 'Real-time metrics & cash flow analytics' },
    transactions: { title: 'Transactions Ledger', subtitle: 'Search, filter, and audit all incoming & outgoing funds' },
    budgets: { title: 'Monthly Budget Planner', subtitle: 'Category limits, remaining balances & proactive alert caps' },
    savings: { title: 'Savings Goals', subtitle: 'Track target milestones and deposit contributions' },
    analytics: { title: 'Analytics & Financial Reports', subtitle: 'Detailed spending breakdowns, trends & CSV exports' },
    recurring: { title: 'Recurring Subscriptions & Bills', subtitle: 'Automated repeating income & scheduled payments' },
    notifications: { title: 'Notification Center', subtitle: 'Alerts, budget warnings & system reminders' },
    settings: { title: 'Settings & Preferences', subtitle: 'Manage profile, currency, theme, categories & data' }
  };

  const currentTabInfo = tabTitles[activeTab] || tabTitles.dashboard;

  return (
    <header className="sticky top-0 z-20 bg-slate-950/80 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Mobile Menu + Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Open mobile navigation"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="lg:hidden flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">FinTrack</span>
          </div>

          <div className="hidden lg:block">
            <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
              {currentTabInfo.title}
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              {currentTabInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Center: Search input */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={e => {
                setFilters(prev => ({ ...prev, search: e.target.value }));
                if (activeTab !== 'transactions' && e.target.value) {
                  setActiveTab('transactions');
                }
              }}
              placeholder="Search transactions, notes, categories..."
              className="w-full bg-slate-900/80 dark:bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Add Transaction Button */}
          <button
            onClick={onOpenQuickAdd}
            className="hidden sm:flex items-center gap-1.5 py-1.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Transaction</span>
          </button>

          {/* Currency Selector */}
          <div className="relative">
            <button
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currency} ({CURRENCY_MAP[currency]?.symbol})</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isCurrencyOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-50">
                <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Display Currency
                </div>
                {(Object.keys(CURRENCY_MAP) as CurrencyCode[]).map(code => (
                  <button
                    key={code}
                    onClick={() => {
                      setCurrency(code);
                      setIsCurrencyOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    <span>{CURRENCY_MAP[code].name}</span>
                    {currency === code && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors"
            aria-label="Toggle dark/light mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-slate-950 font-extrabold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Notifications</span>
                  <button
                    onClick={() => {
                      setIsNotifOpen(false);
                      setActiveTab('notifications');
                    }}
                    className="text-[11px] text-emerald-400 hover:underline font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">No new notifications</div>
                  ) : (
                    notifications.slice(0, 5).map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 text-xs cursor-pointer hover:bg-slate-800/60 transition-colors ${
                          !n.isRead ? 'bg-emerald-500/5' : ''
                        }`}
                      >
                        <p className="font-semibold text-slate-200">{n.title}</p>
                        <p className="text-slate-400 mt-0.5 text-[11px] leading-relaxed">{n.message}</p>
                        <p className="text-[10px] text-slate-500 mt-1">{formatRelativeTime(n.date)}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-800/60 transition-colors"
            >
              <img
                src={userProfile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt="Profile"
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-emerald-500/30"
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-50">
                <div className="px-4 py-3 border-b border-slate-800">
                  <p className="text-xs font-bold text-slate-100">{userProfile.fullName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{userProfile.email}</p>
                </div>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setActiveTab('settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Profile & Settings</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    resetToSeedData();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reset Demo Sample Data</span>
                </button>

                <div className="border-t border-slate-800 my-1"></div>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    openAuthModal('login');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-emerald-400 hover:bg-slate-800 font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign In / Auth Account</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
