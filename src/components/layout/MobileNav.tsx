import React from 'react';
import { 
  X, 
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
  Globe
} from 'lucide-react';
import { useFinance, NavTab } from '../../context/FinanceContext';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuickAdd: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, onOpenQuickAdd }) => {
  const { activeTab, setActiveTab, notifications } = useFinance();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'transactions', label: 'Transactions', icon: <Receipt className="w-5 h-5" /> },
    { id: 'budgets', label: 'Budgets', icon: <PieChart className="w-5 h-5" /> },
    { id: 'savings', label: 'Savings', icon: <Target className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'recurring', label: 'Recurring', icon: <Repeat className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ];

  if (!isOpen) {
    return (
      /* Fixed Mobile Bottom Bar */
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-2 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-semibold ${
            activeTab === 'dashboard' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-semibold ${
            activeTab === 'transactions' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Receipt className="w-5 h-5" />
          <span>Transactions</span>
        </button>

        <button
          onClick={onOpenQuickAdd}
          className="w-11 h-11 bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 transform -translate-y-3 border-2 border-slate-950 font-bold"
          aria-label="Quick Add Transaction"
        >
          <PlusCircle className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          onClick={() => setActiveTab('budgets')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-semibold ${
            activeTab === 'budgets' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <PieChart className="w-5 h-5" />
          <span>Budgets</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-semibold ${
            activeTab === 'analytics' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span>Analytics</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-full bg-slate-900 border-r border-slate-800 flex flex-col h-full z-10 shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">FinTrack</span>
              <p className="text-[10px] text-emerald-400 font-semibold uppercase">Smart Budget</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={() => {
              onClose();
              onOpenQuickAdd();
            }}
            className="w-full py-2.5 bg-emerald-500 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Transaction</span>
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.id === 'notifications' && unreadCount > 0 && (
                  <span className="bg-emerald-500 text-slate-950 font-bold text-xs px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
