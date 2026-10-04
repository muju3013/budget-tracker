export type TransactionType = 'income' | 'expense';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
}

export type CategoryType = 'income' | 'expense';

export interface CategoryItem {
  id: string;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  isDefault?: boolean;
}

// Default standard category string names for backward compatibility & easy lookup
export type Category = 
  | 'Food' 
  | 'Groceries'
  | 'Transport' 
  | 'Shopping' 
  | 'Education'
  | 'Healthcare'
  | 'Entertainment' 
  | 'Rent' 
  | 'Bills' 
  | 'Utilities'
  | 'Travel' 
  | 'Subscriptions'
  | 'Other'
  | 'Salary'
  | 'Freelancing'
  | 'Business'
  | 'Investments'
  | 'Gifts'
  | 'Other Income'
  | string;

export type PaymentMethod = 
  | 'Cash' 
  | 'Credit Card' 
  | 'Debit Card' 
  | 'UPI' 
  | 'Bank Transfer' 
  | 'Net Banking' 
  | 'Other';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: TransactionType;
  date: string; // YYYY-MM-DD
  paymentMethod?: PaymentMethod;
  note?: string;
  userId?: string;
  createdAt?: string;
}

export interface BudgetLimit {
  category: string;
  limit: number;
}

export interface FilterOptions {
  search: string;
  category: string;
  type: string;
  startDate: string;
  endDate: string;
  paymentMethod?: string;
  sortBy: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
}

export interface FinanceSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  remainingBudget: number;
  totalBudgetLimit: number;
  spendingPercentage: number;
  savingsThisMonth: number;
  incomeMoMPercent: number;
  expenseMoMPercent: number;
  savingsMoMPercent: number;
}

export interface CategorySpending {
  category: string;
  spent: number;
  limit: number;
  percentage: number;
  color: string;
}

export interface MonthlyCashFlow {
  month: string;
  income: number;
  expense: number;
  net: number;
  savings: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category?: string;
  color: string;
  icon?: string;
  notes?: string;
  isCompleted?: boolean;
}

export interface GoalContribution {
  id: string;
  goalId: string;
  amount: number;
  type: 'deposit' | 'withdraw';
  date: string;
  note?: string;
}

export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RecurringTransaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  frequency: RecurringFrequency;
  startDate: string; // YYYY-MM-DD
  nextDueDate: string; // YYYY-MM-DD
  paymentMethod?: PaymentMethod;
  note?: string;
  lastProcessedDate?: string;
  isActive: boolean;
}

export type NotificationType = 'budget_warning' | 'budget_exceeded' | 'savings_milestone' | 'recurring_due' | 'monthly_summary';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  date: string;
  isRead: boolean;
  link?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  currency: CurrencyCode;
  monthlyIncome: number;
  monthlySavingsGoal: number;
  overallBudgetLimit: number;
  budgetResetDate: number; // 1 to 31
  isOnboarded: boolean;
  isDemoMode: boolean;
}
