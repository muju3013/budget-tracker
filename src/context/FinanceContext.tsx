import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { 
  Transaction, 
  BudgetLimit, 
  SavingsGoal,
  RecurringTransaction,
  CategoryItem,
  NotificationItem,
  FilterOptions, 
  FinanceSummary, 
  CategorySpending, 
  MonthlyCashFlow,
  CurrencyCode,
  UserProfile
} from '../types/finance';
import { apiService } from '../services/api';
import { CATEGORY_COLORS, DEFAULT_BUDGETS } from '../utils/constants';
import { INITIAL_TRANSACTIONS, INITIAL_SAVINGS_GOALS, INITIAL_RECURRING_TRANSACTIONS, DEFAULT_USER_PROFILE } from '../utils/seedData';

export type NavTab = 
  | 'dashboard' 
  | 'transactions' 
  | 'budgets' 
  | 'savings' 
  | 'analytics' 
  | 'recurring' 
  | 'notifications' 
  | 'settings';

interface FinanceContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  budgets: BudgetLimit[];
  savingsGoals: SavingsGoal[];
  recurringTxs: RecurringTransaction[];
  categories: CategoryItem[];
  notifications: NotificationItem[];
  userProfile: UserProfile;
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isLoading: boolean;
  summary: FinanceSummary;
  categorySpending: CategorySpending[];
  monthlyCashFlow: MonthlyCashFlow[];
  currency: CurrencyCode;
  setCurrency: (curr: CurrencyCode) => void;
  
  // Transaction CRUD
  addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (tx: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  importTransactions: (txs: Transaction[]) => Promise<void>;
  
  // Budget CRUD
  updateBudgets: (budgets: BudgetLimit[]) => Promise<void>;
  
  // Savings Goal CRUD
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => Promise<void>;
  updateSavingsGoal: (goal: SavingsGoal) => Promise<void>;
  deleteSavingsGoal: (id: string) => Promise<void>;
  contributeToGoal: (goalId: string, amount: number, type: 'deposit' | 'withdraw') => Promise<void>;
  
  // Recurring CRUD
  addRecurringTransaction: (rec: Omit<RecurringTransaction, 'id'>) => Promise<void>;
  updateRecurringTransaction: (rec: RecurringTransaction) => Promise<void>;
  deleteRecurringTransaction: (id: string) => Promise<void>;
  processDueRecurring: () => Promise<number>;

  // Category CRUD
  addCategory: (cat: Omit<CategoryItem, 'id'>) => Promise<void>;
  updateCategory: (cat: CategoryItem) => Promise<void>;
  deleteCategory: (id: string, reassignToCategory?: string) => Promise<boolean>;

  // Notifications
  markNotificationRead: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;

  // Profile & System
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  resetToSeedData: () => Promise<void>;
  clearAllData: () => Promise<void>;
  toggleDemoMode: (enabled: boolean) => Promise<void>;
  triggerConfetti: () => void;
}

const defaultFilters: FilterOptions = {
  search: '',
  category: 'all',
  type: 'all',
  startDate: '',
  endDate: '',
  sortBy: 'date-desc'
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<BudgetLimit[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [recurringTxs, setRecurringTxs] = useState<RecurringTransaction[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [txData, budgetData, goalsData, recData, catData, profData, notesData] = await Promise.all([
          apiService.getTransactions(),
          apiService.getBudgets(),
          apiService.getSavingsGoals(),
          apiService.getRecurringTransactions(),
          apiService.getCategories(),
          apiService.getUserProfile(),
          apiService.getNotifications()
        ]);

        setTransactions(txData);
        setBudgets(budgetData);
        setSavingsGoals(goalsData);
        setRecurringTxs(recData);
        setCategories(catData);
        setUserProfile(profData);
        setNotifications(notesData);
      } catch (err) {
        console.error('Error initializing finance data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Filter & Sort Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchTitle = tx.title.toLowerCase().includes(query);
        const matchNote = tx.note ? tx.note.toLowerCase().includes(query) : false;
        const matchCategory = tx.category.toLowerCase().includes(query);
        if (!matchTitle && !matchNote && !matchCategory) return false;
      }

      if (filters.category && filters.category !== 'all' && tx.category !== filters.category) {
        return false;
      }

      if (filters.type && filters.type !== 'all' && tx.type !== filters.type) {
        return false;
      }

      if (filters.paymentMethod && filters.paymentMethod !== 'all' && tx.paymentMethod !== filters.paymentMethod) {
        return false;
      }

      if (filters.startDate && tx.date < filters.startDate) {
        return false;
      }

      if (filters.endDate && tx.date > filters.endDate) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'date-desc') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (filters.sortBy === 'date-asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (filters.sortBy === 'amount-desc') {
        return b.amount - a.amount;
      }
      if (filters.sortBy === 'amount-asc') {
        return a.amount - b.amount;
      }
      return 0;
    });
  }, [transactions, filters]);

  // Executive Summary Metrics with MoM (Month over Month) calculations
  const summary = useMemo<FinanceSummary>(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
    const prevYear = prevMonthDate.getFullYear();
    const prevMonth = prevMonthDate.getMonth();

    let totalIncome = 0;
    let totalExpense = 0;

    let currentMonthIncome = 0;
    let currentMonthExpense = 0;

    let prevMonthIncome = 0;
    let prevMonthExpense = 0;

    transactions.forEach(tx => {
      if (!tx.date) return;
      const d = new Date(tx.date + 'T00:00:00');
      const y = d.getFullYear();
      const m = d.getMonth();

      if (tx.type === 'income') {
        totalIncome += tx.amount;
        if (y === currentYear && m === currentMonth) {
          currentMonthIncome += tx.amount;
        } else if (y === prevYear && m === prevMonth) {
          prevMonthIncome += tx.amount;
        }
      } else {
        totalExpense += tx.amount;
        if (y === currentYear && m === currentMonth) {
          currentMonthExpense += tx.amount;
        } else if (y === prevYear && m === prevMonth) {
          prevMonthExpense += tx.amount;
        }
      }
    });

    const totalBalance = totalIncome - totalExpense;
    const totalBudgetLimit = userProfile.overallBudgetLimit || budgets.reduce((acc, b) => acc + b.limit, 0);
    const remainingBudget = Math.max(0, totalBudgetLimit - currentMonthExpense);
    const spendingPercentage = totalBudgetLimit > 0 ? (currentMonthExpense / totalBudgetLimit) * 100 : 0;
    const savingsThisMonth = Math.max(0, currentMonthIncome - currentMonthExpense);
    const prevMonthSavings = Math.max(0, prevMonthIncome - prevMonthExpense);

    const calcMoM = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return ((curr - prev) / prev) * 100;
    };

    return {
      totalBalance,
      totalIncome: currentMonthIncome || totalIncome,
      totalExpense: currentMonthExpense || totalExpense,
      remainingBudget,
      totalBudgetLimit,
      spendingPercentage,
      savingsThisMonth,
      incomeMoMPercent: calcMoM(currentMonthIncome, prevMonthIncome),
      expenseMoMPercent: calcMoM(currentMonthExpense, prevMonthExpense),
      savingsMoMPercent: calcMoM(savingsThisMonth, prevMonthSavings)
    };
  }, [transactions, budgets, userProfile]);

  // Category Spending & Budget Caps
  const categorySpending = useMemo<CategorySpending[]>(() => {
    const catMap: Record<string, number> = {};
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    transactions.forEach(tx => {
      if (tx.type === 'expense' && tx.date) {
        const d = new Date(tx.date + 'T00:00:00');
        if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
          catMap[tx.category] = (catMap[tx.category] || 0) + tx.amount;
        }
      }
    });

    // Extract unique categories from budgets & transactions
    const uniqueCats = Array.from(new Set([
      ...budgets.map(b => b.category),
      ...Object.keys(catMap)
    ]));

    return uniqueCats.map(cat => {
      const spent = catMap[cat] || 0;
      const budgetObj = budgets.find(b => b.category.toLowerCase() === cat.toLowerCase());
      const limit = budgetObj ? budgetObj.limit : 10000;
      const percentage = limit > 0 ? (spent / limit) * 100 : 0;
      const color = CATEGORY_COLORS[cat] || '#64748B';

      return {
        category: cat,
        spent,
        limit,
        percentage,
        color
      };
    }).sort((a, b) => b.spent - a.spent);
  }, [transactions, budgets]);

  // Monthly Cash Flow
  const monthlyCashFlow = useMemo<MonthlyCashFlow[]>(() => {
    const monthMap: Record<string, { income: number; expense: number }> = {};

    transactions.forEach(tx => {
      if (!tx.date) return;
      const parts = tx.date.split('-');
      if (parts.length < 2) return;
      const [year, month] = parts;
      const dateObj = new Date(parseInt(year), parseInt(month) - 1, 1);
      const monthLabel = dateObj.toLocaleString('en-US', { month: 'short' });

      if (!monthMap[monthLabel]) {
        monthMap[monthLabel] = { income: 0, expense: 0 };
      }

      if (tx.type === 'income') {
        monthMap[monthLabel].income += tx.amount;
      } else {
        monthMap[monthLabel].expense += tx.amount;
      }
    });

    return Object.entries(monthMap).map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
      net: data.income - data.expense,
      savings: Math.max(0, data.income - data.expense)
    }));
  }, [transactions]);

  // Trigger Confetti Celebration
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  // Transaction Actions
  const addTransaction = async (txData: Omit<Transaction, 'id'>) => {
    const created = await apiService.addTransaction(txData);
    setTransactions(prev => [created, ...prev]);

    // Check budget limit alert
    if (txData.type === 'expense') {
      const catBudget = budgets.find(b => b.category.toLowerCase() === txData.category.toLowerCase());
      if (catBudget) {
        const spent = categorySpending.find(c => c.category === txData.category)?.spent || 0;
        const totalNow = spent + txData.amount;
        const pct = (totalNow / catBudget.limit) * 100;
        if (pct >= 100) {
          addNotification({
            title: `Budget Exceeded: ${txData.category}`,
            message: `You have spent ${Math.round(pct)}% of your ${txData.category} budget.`,
            type: 'budget_exceeded'
          });
        } else if (pct >= 75) {
          addNotification({
            title: `Budget Warning: ${txData.category}`,
            message: `You are approaching your limit (${Math.round(pct)}% used).`,
            type: 'budget_warning'
          });
        }
      }
    }
  };

  const updateTransaction = async (tx: Transaction) => {
    const updated = await apiService.updateTransaction(tx);
    setTransactions(prev => prev.map(t => (t.id === updated.id ? updated : t)));
  };

  const deleteTransaction = async (id: string) => {
    await apiService.deleteTransaction(id);
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const importTransactions = async (importedTxs: Transaction[]) => {
    const updatedList = await apiService.importBulk(importedTxs);
    setTransactions(updatedList);
  };

  // Budget Actions
  const updateBudgets = async (newBudgets: BudgetLimit[]) => {
    const saved = await apiService.saveBudgets(newBudgets);
    setBudgets(saved);
  };

  // Savings Goal Actions
  const addSavingsGoal = async (goalData: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = {
      ...goalData,
      id: `goal-${Date.now()}`
    };
    const updated = [...savingsGoals, newGoal];
    await apiService.saveSavingsGoals(updated);
    setSavingsGoals(updated);
  };

  const updateSavingsGoal = async (goal: SavingsGoal) => {
    const updated = savingsGoals.map(g => (g.id === goal.id ? goal : g));
    await apiService.saveSavingsGoals(updated);
    setSavingsGoals(updated);
  };

  const deleteSavingsGoal = async (id: string) => {
    const updated = savingsGoals.filter(g => g.id !== id);
    await apiService.saveSavingsGoals(updated);
    setSavingsGoals(updated);
  };

  const contributeToGoal = async (goalId: string, amount: number, type: 'deposit' | 'withdraw') => {
    const targetGoal = savingsGoals.find(g => g.id === goalId);
    if (!targetGoal) return;

    const newAmount = type === 'deposit' 
      ? targetGoal.currentAmount + amount 
      : Math.max(0, targetGoal.currentAmount - amount);

    const isNowCompleted = newAmount >= targetGoal.targetAmount;
    if (isNowCompleted && !targetGoal.isCompleted) {
      triggerConfetti();
      addNotification({
        title: `Goal Accomplished! 🎉`,
        message: `Congratulations! You reached 100% of your savings goal: "${targetGoal.name}".`,
        type: 'savings_milestone'
      });
    }

    const updatedGoal: SavingsGoal = {
      ...targetGoal,
      currentAmount: newAmount,
      isCompleted: isNowCompleted
    };

    const updated = savingsGoals.map(g => (g.id === goalId ? updatedGoal : g));
    await apiService.saveSavingsGoals(updated);
    setSavingsGoals(updated);
  };

  // Recurring Actions
  const addRecurringTransaction = async (recData: Omit<RecurringTransaction, 'id'>) => {
    const newRec: RecurringTransaction = {
      ...recData,
      id: `rec-${Date.now()}`
    };
    const updated = [...recurringTxs, newRec];
    await apiService.saveRecurringTransactions(updated);
    setRecurringTxs(updated);
  };

  const updateRecurringTransaction = async (rec: RecurringTransaction) => {
    const updated = recurringTxs.map(r => (r.id === rec.id ? rec : r));
    await apiService.saveRecurringTransactions(updated);
    setRecurringTxs(updated);
  };

  const deleteRecurringTransaction = async (id: string) => {
    const updated = recurringTxs.filter(r => r.id !== id);
    await apiService.saveRecurringTransactions(updated);
    setRecurringTxs(updated);
  };

  const processDueRecurring = async (): Promise<number> => {
    const today = new Date().toISOString().split('T')[0];
    let count = 0;
    const updatedRecs = [...recurringTxs];
    const newTxs: Transaction[] = [];

    for (let i = 0; i < updatedRecs.length; i++) {
      const item = updatedRecs[i];
      if (item.isActive && item.nextDueDate <= today && item.lastProcessedDate !== today) {
        // Create transaction
        const tx: Omit<Transaction, 'id'> = {
          title: item.title,
          amount: item.amount,
          type: item.type,
          category: item.category,
          date: today,
          paymentMethod: item.paymentMethod,
          note: `Auto-generated recurring (${item.frequency})`
        };
        const created = await apiService.addTransaction(tx);
        newTxs.push(created);

        // Calculate next due date
        const currentDueDate = new Date(item.nextDueDate);
        if (item.frequency === 'daily') currentDueDate.setDate(currentDueDate.getDate() + 1);
        else if (item.frequency === 'weekly') currentDueDate.setDate(currentDueDate.getDate() + 7);
        else if (item.frequency === 'monthly') currentDueDate.setMonth(currentDueDate.getMonth() + 1);
        else if (item.frequency === 'yearly') currentDueDate.setFullYear(currentDueDate.getFullYear() + 1);

        updatedRecs[i] = {
          ...item,
          nextDueDate: currentDueDate.toISOString().split('T')[0],
          lastProcessedDate: today
        };
        count++;
      }
    }

    if (count > 0) {
      setTransactions(prev => [...newTxs, ...prev]);
      await apiService.saveRecurringTransactions(updatedRecs);
      setRecurringTxs(updatedRecs);
      addNotification({
        title: 'Recurring Bills Processed',
        message: `Successfully processed ${count} upcoming recurring transactions for today.`,
        type: 'recurring_due'
      });
    }

    return count;
  };

  // Category Actions
  const addCategory = async (catData: Omit<CategoryItem, 'id'>) => {
    const newCat: CategoryItem = {
      ...catData,
      id: `cat-${Date.now()}`
    };
    const updated = [...categories, newCat];
    await apiService.saveCategories(updated);
    setCategories(updated);
  };

  const updateCategory = async (cat: CategoryItem) => {
    const updated = categories.map(c => (c.id === cat.id ? cat : c));
    await apiService.saveCategories(updated);
    setCategories(updated);
  };

  const deleteCategory = async (id: string, reassignToCategory?: string): Promise<boolean> => {
    const catToDelete = categories.find(c => c.id === id);
    if (!catToDelete) return false;

    // Check if transactions exist with this category
    const hasTransactions = transactions.some(t => t.category.toLowerCase() === catToDelete.name.toLowerCase());

    if (hasTransactions) {
      if (!reassignToCategory) {
        return false; // Requires reassignment
      }
      // Reassign transactions to new category
      const updatedTxs = transactions.map(t => 
        t.category.toLowerCase() === catToDelete.name.toLowerCase()
          ? { ...t, category: reassignToCategory }
          : t
      );
      setTransactions(updatedTxs);
      localStorage.setItem('fintrack_transactions', JSON.stringify(updatedTxs));
    }

    const updatedCats = categories.filter(c => c.id !== id);
    await apiService.saveCategories(updatedCats);
    setCategories(updatedCats);
    return true;
  };

  // Notification Helpers
  const addNotification = async (item: Omit<NotificationItem, 'id' | 'date' | 'isRead'>) => {
    const newNote: NotificationItem = {
      ...item,
      id: `note-${Date.now()}`,
      date: new Date().toISOString(),
      isRead: false
    };
    const updated = [newNote, ...notifications];
    await apiService.saveNotifications(updated);
    setNotifications(updated);
  };

  const markNotificationRead = async (id: string) => {
    const updated = notifications.map(n => (n.id === id ? { ...n, isRead: true } : n));
    await apiService.saveNotifications(updated);
    setNotifications(updated);
  };

  const clearAllNotifications = async () => {
    await apiService.saveNotifications([]);
    setNotifications([]);
  };

  // Profile Actions
  const updateUserProfile = async (partial: Partial<UserProfile>) => {
    const updated = { ...userProfile, ...partial };
    await apiService.saveUserProfile(updated);
    setUserProfile(updated);
  };

  const setCurrency = (curr: CurrencyCode) => {
    updateUserProfile({ currency: curr });
  };

  const resetToSeedData = async () => {
    localStorage.clear();
    setTransactions(INITIAL_TRANSACTIONS);
    setBudgets(DEFAULT_BUDGETS);
    setSavingsGoals(INITIAL_SAVINGS_GOALS);
    setRecurringTxs(INITIAL_RECURRING_TRANSACTIONS);
    setUserProfile({ ...DEFAULT_USER_PROFILE, isDemoMode: true });
    await apiService.saveUserProfile({ ...DEFAULT_USER_PROFILE, isDemoMode: true });
    await apiService.importBulk(INITIAL_TRANSACTIONS);
    await apiService.saveSavingsGoals(INITIAL_SAVINGS_GOALS);
    await apiService.saveRecurringTransactions(INITIAL_RECURRING_TRANSACTIONS);
  };

  const clearAllData = async () => {
    localStorage.clear();
    setTransactions([]);
    setBudgets(DEFAULT_BUDGETS);
    setSavingsGoals([]);
    setRecurringTxs([]);
    setNotifications([]);
    const cleanProfile = {
      id: 'usr_clean',
      fullName: 'User Account',
      email: 'user@fintrack.app',
      currency: 'INR' as CurrencyCode,
      monthlyIncome: 100000,
      monthlySavingsGoal: 20000,
      overallBudgetLimit: 80000,
      budgetResetDate: 1,
      isOnboarded: false,
      isDemoMode: false
    };
    setUserProfile(cleanProfile);
    await apiService.saveUserProfile(cleanProfile);
  };

  const toggleDemoMode = async (enabled: boolean) => {
    if (enabled) {
      await resetToSeedData();
    } else {
      await clearAllData();
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        activeTab,
        setActiveTab,
        transactions,
        filteredTransactions,
        budgets,
        savingsGoals,
        recurringTxs,
        categories,
        notifications,
        userProfile,
        filters,
        setFilters,
        theme,
        toggleTheme,
        isLoading,
        summary,
        categorySpending,
        monthlyCashFlow,
        currency: userProfile.currency || 'INR',
        setCurrency,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        importTransactions,
        updateBudgets,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        contributeToGoal,
        addRecurringTransaction,
        updateRecurringTransaction,
        deleteRecurringTransaction,
        processDueRecurring,
        addCategory,
        updateCategory,
        deleteCategory,
        markNotificationRead,
        clearAllNotifications,
        updateUserProfile,
        resetToSeedData,
        clearAllData,
        toggleDemoMode,
        triggerConfetti
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
};
