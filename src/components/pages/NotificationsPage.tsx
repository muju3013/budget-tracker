import React from 'react';
import { 
  Bell, 
  Check, 
  Trash2, 
  AlertTriangle, 
  ShieldAlert, 
  PartyPopper, 
  Repeat, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatRelativeTime } from '../../utils/formatters';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, clearAllNotifications } = useFinance();

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Notification Center</h2>
          <p className="text-xs text-slate-400">Budget alerts, milestone achievements, and recurring bill notifications</p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-rose-400 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Notifications</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-slate-900/90 dark:bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        {notifications.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Bell className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">You are all caught up! No active notifications.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {notifications.map(n => {
              const getIcon = () => {
                if (n.type === 'budget_exceeded') return <ShieldAlert className="w-5 h-5 text-rose-400" />;
                if (n.type === 'budget_warning') return <AlertTriangle className="w-5 h-5 text-amber-400" />;
                if (n.type === 'savings_milestone') return <PartyPopper className="w-5 h-5 text-emerald-400" />;
                if (n.type === 'recurring_due') return <Repeat className="w-5 h-5 text-indigo-400" />;
                return <Sparkles className="w-5 h-5 text-teal-400" />;
              };

              return (
                <div 
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-800/40 transition-colors ${
                    !n.isRead ? 'bg-emerald-500/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl shrink-0">
                      {getIcon()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-bold ${!n.isRead ? 'text-slate-100' : 'text-slate-300'}`}>
                          {n.title}
                        </h4>
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                      <p className="text-[10px] text-slate-500 font-medium mt-2">{formatRelativeTime(n.date)}</p>
                    </div>
                  </div>

                  {!n.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markNotificationRead(n.id);
                      }}
                      className="text-xs text-slate-500 hover:text-emerald-400 p-1 rounded-lg"
                      title="Mark as Read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
