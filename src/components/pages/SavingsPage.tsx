import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Trash2, 
  Edit3,
  PiggyBank,
  PartyPopper
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { SavingsGoal } from '../../types/finance';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const SavingsPage: React.FC = () => {
  const { savingsGoals, currency, addSavingsGoal, deleteSavingsGoal, contributeToGoal, triggerConfetti } = useFinance();
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [contributeGoal, setContributeGoal] = useState<{ goal: SavingsGoal; type: 'deposit' | 'withdraw' } | null>(null);

  // New Goal Form
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [notes, setNotes] = useState('');
  const [color, setColor] = useState('#10B981');

  // Contribution Form
  const [contribAmount, setContribAmount] = useState('');

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const tAmt = parseFloat(targetAmount);
    const cAmt = parseFloat(currentAmount) || 0;
    if (!name || isNaN(tAmt) || tAmt <= 0 || !targetDate) return;

    await addSavingsGoal({
      name,
      targetAmount: tAmt,
      currentAmount: cAmt,
      targetDate,
      color,
      notes,
      isCompleted: cAmt >= tAmt
    });

    if (cAmt >= tAmt) {
      triggerConfetti();
    }

    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setTargetDate('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const handleContributionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributeGoal) return;
    const amt = parseFloat(contribAmount);
    if (isNaN(amt) || amt <= 0) return;

    await contributeToGoal(contributeGoal.goal.id, amt, contributeGoal.type);
    setContribAmount('');
    setContributeGoal(null);
  };

  const totalSavedAllGoals = savingsGoals.reduce((acc, g) => acc + g.currentAmount, 0);
  const totalTargetAllGoals = savingsGoals.reduce((acc, g) => acc + g.targetAmount, 0);

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Savings Goals</h2>
          <p className="text-xs text-slate-400">Plan and track your emergency fund, vacation trips, and major purchases</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Savings Goal</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-slate-900/90 dark:bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <span className="text-xs font-medium text-slate-400">Total Funds Saved</span>
          <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">
            {formatCurrency(totalSavedAllGoals, currency)}
          </h3>
        </div>
        <div>
          <span className="text-xs font-medium text-slate-400">Combined Target Goal</span>
          <h3 className="text-2xl font-extrabold text-slate-100 mt-1">
            {formatCurrency(totalTargetAllGoals, currency)}
          </h3>
        </div>
        <div>
          <span className="text-xs font-medium text-slate-400">Active Goals</span>
          <h3 className="text-2xl font-extrabold text-indigo-400 mt-1">
            {savingsGoals.length} Goals
          </h3>
        </div>
      </div>

      {/* Savings Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {savingsGoals.map(goal => {
          const pct = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
          const isCompleted = goal.isCompleted || goal.currentAmount >= goal.targetAmount;
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

          return (
            <div 
              key={goal.id}
              className={`bg-slate-900/90 dark:bg-slate-900 border rounded-2xl p-5 shadow-lg space-y-4 transition-all relative overflow-hidden ${
                isCompleted ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Top Row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-950 font-bold shadow-md"
                    style={{ backgroundColor: goal.color || '#10B981' }}
                  >
                    {isCompleted ? <PartyPopper className="w-5 h-5 text-slate-950" /> : <Target className="w-5 h-5 text-slate-950" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">{goal.name}</h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>Target: {formatDate(goal.targetDate)}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => deleteSavingsGoal(goal.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition-colors"
                  title="Delete Goal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Numbers */}
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-[11px] text-slate-400 font-medium">Saved</span>
                  <p className="text-lg font-extrabold text-emerald-400">
                    {formatCurrency(goal.currentAmount, currency)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 font-medium">Target</span>
                  <p className="text-sm font-bold text-slate-200">
                    {formatCurrency(goal.targetAmount, currency)}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: goal.color || '#10B981' }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-emerald-400">{Math.round(pct)}% Completed</span>
                  <span className="text-slate-400">{formatCurrency(remaining, currency)} remaining</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => setContributeGoal({ goal, type: 'deposit' })}
                  className="flex-1 py-1.5 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Deposit</span>
                </button>
                <button
                  onClick={() => setContributeGoal({ goal, type: 'withdraw' })}
                  className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors"
                >
                  Withdraw
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Goal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <form onSubmit={handleCreateGoal} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100">Create Savings Goal</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Goal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Emergency Reserve, New Laptop"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Amount</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="150000"
                    value={targetAmount}
                    onChange={e => setTargetAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Initial Saved Amount</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={currentAmount}
                    onChange={e => setCurrentAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Date</label>
                <input
                  type="date"
                  required
                  value={targetDate}
                  onChange={e => setTargetDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notes & Description</label>
                <input
                  type="text"
                  placeholder="Optional details..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-100 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl"
              >
                Create Goal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Deposit / Withdraw Modal */}
      {contributeGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <form onSubmit={handleContributionSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100 capitalize">
              {contributeGoal.type} to {contributeGoal.goal.name}
            </h3>
            <p className="text-xs text-slate-400">
              Current saved: <strong className="text-emerald-400">{formatCurrency(contributeGoal.goal.currentAmount, currency)}</strong>
            </p>

            <div className="text-xs">
              <label className="block text-slate-300 font-semibold mb-1">Amount</label>
              <input
                type="number"
                required
                min="1"
                placeholder="5000"
                value={contribAmount}
                onChange={e => setContribAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-100 outline-none font-bold text-sm"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setContributeGoal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl"
              >
                Confirm {contributeGoal.type}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
