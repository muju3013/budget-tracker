import { BudgetLimit, CategoryItem, PaymentMethod } from '../types/finance';

export const DEFAULT_INCOME_CATEGORIES: CategoryItem[] = [
  { id: 'cat-inc-1', name: 'Salary', type: 'income', icon: 'Briefcase', color: '#10B981', isDefault: true },
  { id: 'cat-inc-2', name: 'Freelancing', type: 'income', icon: 'Code', color: '#06B6D4', isDefault: true },
  { id: 'cat-inc-3', name: 'Business', type: 'income', icon: 'Building2', color: '#3B82F6', isDefault: true },
  { id: 'cat-inc-4', name: 'Investments', type: 'income', icon: 'TrendingUp', color: '#6366F1', isDefault: true },
  { id: 'cat-inc-5', name: 'Gifts', type: 'income', icon: 'Gift', color: '#8B5CF6', isDefault: true },
  { id: 'cat-inc-6', name: 'Other Income', type: 'income', icon: 'Coins', color: '#64748B', isDefault: true }
];

export const DEFAULT_EXPENSE_CATEGORIES: CategoryItem[] = [
  { id: 'cat-exp-1', name: 'Food', type: 'expense', icon: 'Utensils', color: '#F59E0B', isDefault: true },
  { id: 'cat-exp-2', name: 'Groceries', type: 'expense', icon: 'ShoppingBag', color: '#10B981', isDefault: true },
  { id: 'cat-exp-3', name: 'Transport', type: 'expense', icon: 'Car', color: '#3B82F6', isDefault: true },
  { id: 'cat-exp-4', name: 'Shopping', type: 'expense', icon: 'ShoppingBag', color: '#EC4899', isDefault: true },
  { id: 'cat-exp-5', name: 'Education', type: 'expense', icon: 'GraduationCap', color: '#8B5CF6', isDefault: true },
  { id: 'cat-exp-6', name: 'Healthcare', type: 'expense', icon: 'HeartPulse', color: '#EF4444', isDefault: true },
  { id: 'cat-exp-7', name: 'Entertainment', type: 'expense', icon: 'Film', color: '#A855F7', isDefault: true },
  { id: 'cat-exp-8', name: 'Rent', type: 'expense', icon: 'Home', color: '#F97316', isDefault: true },
  { id: 'cat-exp-9', name: 'Utilities', type: 'expense', icon: 'Zap', color: '#EAB308', isDefault: true },
  { id: 'cat-exp-10', name: 'Travel', type: 'expense', icon: 'Plane', color: '#06B6D4', isDefault: true },
  { id: 'cat-exp-11', name: 'Subscriptions', type: 'expense', icon: 'Tv', color: '#6366F1', isDefault: true },
  { id: 'cat-exp-12', name: 'Other Expenses', type: 'expense', icon: 'MoreHorizontal', color: '#64748B', isDefault: true }
];

export const CATEGORY_COLORS: Record<string, string> = {
  Food: '#F59E0B',
  Groceries: '#10B981',
  Transport: '#3B82F6',
  Shopping: '#EC4899',
  Education: '#8B5CF6',
  Healthcare: '#EF4444',
  Entertainment: '#A855F7',
  Rent: '#F97316',
  Utilities: '#EAB308',
  Travel: '#06B6D4',
  Subscriptions: '#6366F1',
  Salary: '#10B981',
  Freelancing: '#06B6D4',
  Business: '#3B82F6',
  Investments: '#6366F1',
  Gifts: '#8B5CF6',
  'Other Income': '#64748B',
  'Other Expenses': '#64748B',
  Other: '#64748B'
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  'UPI',
  'Credit Card',
  'Debit Card',
  'Net Banking',
  'Bank Transfer',
  'Cash',
  'Other'
];

export const DEFAULT_BUDGETS: BudgetLimit[] = [
  { category: 'Food', limit: 12000 },
  { category: 'Groceries', limit: 15000 },
  { category: 'Transport', limit: 8000 },
  { category: 'Shopping', limit: 10000 },
  { category: 'Rent', limit: 25000 },
  { category: 'Utilities', limit: 5000 },
  { category: 'Entertainment', limit: 6000 },
  { category: 'Healthcare', limit: 5000 },
  { category: 'Travel', limit: 10000 },
  { category: 'Subscriptions', limit: 3000 },
  { category: 'Other Expenses', limit: 5000 }
];
