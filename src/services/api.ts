import { 
  Transaction, 
  BudgetLimit, 
  SavingsGoal, 
  GoalContribution, 
  RecurringTransaction, 
  CategoryItem, 
  UserProfile, 
  NotificationItem 
} from '../types/finance';
import { DEFAULT_BUDGETS, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '../utils/constants';
import { supabase, isSupabaseConfigured } from './supabase';

const KEYS = {
  TRANSACTIONS: 'fintrack_transactions',
  BUDGETS: 'fintrack_budgets',
  SAVINGS_GOALS: 'fintrack_savings_goals',
  CONTRIBUTIONS: 'fintrack_goal_contributions',
  RECURRING: 'fintrack_recurring_txs',
  CATEGORIES: 'fintrack_categories',
  PROFILE: 'fintrack_user_profile',
  NOTIFICATIONS: 'fintrack_notifications'
};

export const CLEAN_USER_PROFILE: UserProfile = {
  id: 'usr_fintrack_clean',
  fullName: 'User Account',
  email: 'user@fintrack.app',
  currency: 'INR',
  monthlyIncome: 100000,
  monthlySavingsGoal: 20000,
  overallBudgetLimit: 80000,
  budgetResetDate: 1,
  isOnboarded: false,
  isDemoMode: false
};

export const apiService = {
  // --- TRANSACTIONS ---
  async getTransactions(): Promise<Transaction[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false });
        if (!error && data) return data as Transaction[];
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to localStorage:', err);
      }
    }

    const local = localStorage.getItem(KEYS.TRANSACTIONS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error('Failed parsing local transactions', e);
      }
    }
    
    // Default clean state: no fake transactions
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify([]));
    return [];
  },

  async addTransaction(tx: Omit<Transaction, 'id'>): Promise<Transaction> {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .insert([newTx])
          .select()
          .single();
        if (!error && data) return data as Transaction;
      } catch (err) {
        console.warn('Supabase add failed, fallback to local', err);
      }
    }

    const current = await this.getTransactions();
    const updated = [newTx, ...current];
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(updated));
    return newTx;
  },

  async updateTransaction(tx: Transaction): Promise<Transaction> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('transactions')
          .update(tx)
          .eq('id', tx.id)
          .select()
          .single();
        if (!error && data) return data as Transaction;
      } catch (err) {
        console.warn('Supabase update failed, fallback to local', err);
      }
    }

    const current = await this.getTransactions();
    const updated = current.map(t => (t.id === tx.id ? tx : t));
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(updated));
    return tx;
  },

  async deleteTransaction(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('transactions').delete().eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase delete failed, fallback to local', err);
      }
    }

    const current = await this.getTransactions();
    const updated = current.filter(t => t.id !== id);
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(updated));
    return true;
  },

  async importBulk(txs: Transaction[]): Promise<Transaction[]> {
    const current = await this.getTransactions();
    const merged = [...txs, ...current];
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(merged));
    return merged;
  },

  async clearAllTransactions(): Promise<void> {
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify([]));
  },

  // --- BUDGETS ---
  async getBudgets(): Promise<BudgetLimit[]> {
    const local = localStorage.getItem(KEYS.BUDGETS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error('Failed parsing local budgets', e);
      }
    }
    localStorage.setItem(KEYS.BUDGETS, JSON.stringify(DEFAULT_BUDGETS));
    return DEFAULT_BUDGETS;
  },

  async saveBudgets(budgets: BudgetLimit[]): Promise<BudgetLimit[]> {
    localStorage.setItem(KEYS.BUDGETS, JSON.stringify(budgets));
    return budgets;
  },

  // --- SAVINGS GOALS ---
  async getSavingsGoals(): Promise<SavingsGoal[]> {
    const local = localStorage.getItem(KEYS.SAVINGS_GOALS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error('Failed parsing local savings goals', e);
      }
    }
    localStorage.setItem(KEYS.SAVINGS_GOALS, JSON.stringify([]));
    return [];
  },

  async saveSavingsGoals(goals: SavingsGoal[]): Promise<SavingsGoal[]> {
    localStorage.setItem(KEYS.SAVINGS_GOALS, JSON.stringify(goals));
    return goals;
  },

  // --- RECURRING TRANSACTIONS ---
  async getRecurringTransactions(): Promise<RecurringTransaction[]> {
    const local = localStorage.getItem(KEYS.RECURRING);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error('Failed parsing local recurring', e);
      }
    }
    localStorage.setItem(KEYS.RECURRING, JSON.stringify([]));
    return [];
  },

  async saveRecurringTransactions(items: RecurringTransaction[]): Promise<RecurringTransaction[]> {
    localStorage.setItem(KEYS.RECURRING, JSON.stringify(items));
    return items;
  },

  // --- CATEGORIES ---
  async getCategories(): Promise<CategoryItem[]> {
    const local = localStorage.getItem(KEYS.CATEGORIES);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error('Failed parsing categories', e);
      }
    }
    const combined = [...DEFAULT_INCOME_CATEGORIES, ...DEFAULT_EXPENSE_CATEGORIES];
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(combined));
    return combined;
  },

  async saveCategories(cats: CategoryItem[]): Promise<CategoryItem[]> {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(cats));
    return cats;
  },

  // --- USER PROFILE ---
  async getUserProfile(): Promise<UserProfile> {
    const local = localStorage.getItem(KEYS.PROFILE);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error('Failed parsing profile', e);
      }
    }
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(CLEAN_USER_PROFILE));
    return CLEAN_USER_PROFILE;
  },

  async saveUserProfile(profile: UserProfile): Promise<UserProfile> {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    return profile;
  },

  // --- NOTIFICATIONS ---
  async getNotifications(): Promise<NotificationItem[]> {
    const local = localStorage.getItem(KEYS.NOTIFICATIONS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error('Failed parsing notifications', e);
      }
    }
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify([]));
    return [];
  },

  async saveNotifications(notes: NotificationItem[]): Promise<NotificationItem[]> {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notes));
    return notes;
  }
};
