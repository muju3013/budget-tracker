import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, ShieldCheck, Globe, DollarSign, Target, Wallet } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { CurrencyCode } from '../../types/finance';
import { CURRENCY_MAP } from '../../utils/formatters';

export const OnboardingWizard: React.FC = () => {
  const { userProfile, updateUserProfile, addSavingsGoal, setActiveTab } = useFinance();
  const [step, setStep] = useState(1);

  // Form states
  const [name, setName] = useState(userProfile.fullName || 'Alex Morgan');
  const [curr, setCurr] = useState<CurrencyCode>(userProfile.currency || 'INR');
  const [income, setIncome] = useState(userProfile.monthlyIncome?.toString() || '160000');
  const [budget, setBudget] = useState(userProfile.overallBudgetLimit?.toString() || '100000');
  const [goalName, setGoalName] = useState('Emergency Reserve Fund');
  const [goalTarget, setGoalTarget] = useState('200000');

  // If already onboarded, don't show
  if (userProfile.isOnboarded) return null;

  const handleNext = async () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      const incVal = parseFloat(income) || 160000;
      const budgetVal = parseFloat(budget) || 100000;
      const gTarget = parseFloat(goalTarget) || 200000;

      await updateUserProfile({
        fullName: name,
        currency: curr,
        monthlyIncome: incVal,
        overallBudgetLimit: budgetVal,
        isOnboarded: true
      });

      if (goalName && gTarget > 0) {
        await addSavingsGoal({
          name: goalName,
          targetAmount: gTarget,
          currentAmount: 0,
          targetDate: new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString().split('T')[0],
          color: '#10B981',
          notes: 'Created during onboarding wizard'
        });
      }

      setActiveTab('dashboard');
    }
  };

  const handleSkip = async () => {
    await updateUserProfile({ isOnboarded: true });
    setActiveTab('dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Progress Bar */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Welcome to FinTrack</span>
          </span>
          <span>Step {step} of 5</span>
        </div>

        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
          <div 
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Step 1: Name */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold text-slate-100 tracking-tight">What should we call you?</h3>
            <p className="text-xs text-slate-400">Personalize your FinTrack financial workspace experience.</p>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none font-medium"
              placeholder="Your Full Name"
            />
          </div>
        )}

        {/* Step 2: Currency */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold text-slate-100 tracking-tight">Select Preferred Currency</h3>
            <p className="text-xs text-slate-400">FinTrack supports Indian Rupee (INR ₹), USD, EUR, and GBP formatting.</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {(Object.keys(CURRENCY_MAP) as CurrencyCode[]).map(code => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setCurr(code)}
                  className={`p-3.5 rounded-xl border text-left flex items-center justify-between font-bold ${
                    curr === code ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <span>{CURRENCY_MAP[code].name}</span>
                  {curr === code && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Monthly Income */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold text-slate-100 tracking-tight">Enter Monthly Income</h3>
            <p className="text-xs text-slate-400">Your total expected monthly salary and earning streams.</p>
            <input
              type="number"
              value={income}
              onChange={e => setIncome(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none font-bold"
              placeholder="e.g., 160000"
            />
          </div>
        )}

        {/* Step 4: Monthly Budget */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold text-slate-100 tracking-tight">Set Monthly Spending Budget Limit</h3>
            <p className="text-xs text-slate-400">Cap your overall monthly expenses to stay on track.</p>
            <input
              type="number"
              value={budget}
              onChange={e => setBudget(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-slate-100 outline-none font-bold"
              placeholder="e.g., 100000"
            />
          </div>
        )}

        {/* Step 5: Primary Savings Goal */}
        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold text-slate-100 tracking-tight">Set Primary Savings Goal</h3>
            <p className="text-xs text-slate-400">What major milestone are you saving toward?</p>
            <div className="space-y-3 text-xs">
              <input
                type="text"
                value={goalName}
                onChange={e => setGoalName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-100 outline-none"
                placeholder="Goal Title (e.g. Emergency Fund)"
              />
              <input
                type="number"
                value={goalTarget}
                onChange={e => setGoalTarget(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-slate-100 outline-none font-bold"
                placeholder="Target Amount (e.g. 200000)"
              />
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleSkip}
            className="text-xs text-slate-400 hover:text-white font-semibold"
          >
            Skip Setup
          </button>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
          >
            <span>{step === 5 ? 'Open FinTrack Dashboard' : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

      </div>
    </div>
  );
};
