import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Target, 
  BarChart3, 
  Repeat, 
  Bell, 
  Settings, 
  PlusCircle, 
  TrendingUp, 
  Sparkles,
  Zap,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useFinance, NavTab } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  onOpenQuickAdd: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenQuickAdd }) => {
  const { activeTab, setActiveTab, notifications, recurringTxs, userProfile } = useFinance();
  const { openAuthModal, isAuthenticated } = useAuth();

  const unreadNotesCount = notifications.filter(n => !n.isRead).length;
  const activeRecurringCount = recurringTxs.filter(r => r.isActive).length;

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'transactions', label: 'Transactions', icon: <Receipt className="w-5 h-5" /> },
    { id: 'budgets', label: 'Budget Planner', icon: <PieChart className="w-5 h-5" /> },
    { id: 'savings', label: 'Savings Goals', icon: <Target className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics & Reports', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'recurring', label: 'Recurring Bills', icon: <Repeat className="w-5 h-5" />, badge: activeRecurringCount },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, badge: unreadNotesCount },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900/90 dark:bg-slate-900 border-r border-slate-800/80 sticky top-0 h-screen z-30 transition-all duration-300">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-bold">
            <TrendingUp className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              FinTrack
            </span>
            <p className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
              Track Smarter
            </p>
          </div>
        </div>
      </div>

      {/* Quick Add CTA */}
      <div className="p-4">
        <button
          onClick={onOpenQuickAdd}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <PlusCircle className="w-5 h-5 stroke-[2.5]" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-emerald-400' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile / Account Status */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <img
            src={userProfile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt="User avatar"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/40"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">{userProfile.fullName}</p>
            <p className="text-[11px] text-slate-400 truncate">{userProfile.email}</p>
          </div>
          <button
            onClick={() => openAuthModal('login')}
            className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition-colors"
            title="Account & Auth"
          >
            <UserCheck className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
