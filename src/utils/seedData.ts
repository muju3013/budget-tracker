import { Transaction, SavingsGoal, RecurringTransaction, UserProfile } from '../types/finance';

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'usr_fintrack_default',
  fullName: 'Alex Morgan',
  email: 'alex.morgan@fintrack.app',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  currency: 'INR',
  monthlyIncome: 160000,
  monthlySavingsGoal: 40000,
  overallBudgetLimit: 100000,
  budgetResetDate: 1,
  isOnboarded: true,
  isDemoMode: true
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-101',
    title: 'Monthly Tech Salary Deposit',
    amount: 125000.00,
    category: 'Salary',
    type: 'income',
    date: '2026-09-01',
    paymentMethod: 'Bank Transfer',
    note: 'Base salary compensation & performance incentive'
  },
  {
    id: 'tx-102',
    title: 'Apartment Monthly Rent',
    amount: 28000.00,
    category: 'Rent',
    type: 'expense',
    date: '2026-09-02',
    paymentMethod: 'Bank Transfer',
    note: 'September apartment rental payment'
  },
  {
    id: 'tx-103',
    title: 'Supermarket Monthly Groceries',
    amount: 12450.00,
    category: 'Groceries',
    type: 'expense',
    date: '2026-09-04',
    paymentMethod: 'UPI',
    note: 'Monthly organic produce, kitchen essentials & pantry'
  },
  {
    id: 'tx-104',
    title: 'UI/UX Mobile App Consulting',
    amount: 35000.00,
    category: 'Freelancing',
    type: 'income',
    date: '2026-09-06',
    paymentMethod: 'Bank Transfer',
    note: 'Fintech mobile interface milestone 2 completion'
  },
  {
    id: 'tx-105',
    title: 'Power Electricity & Water Utility',
    amount: 3850.00,
    category: 'Utilities',
    type: 'expense',
    date: '2026-09-07',
    paymentMethod: 'Net Banking',
    note: 'State electricity board & municipal water bill'
  },
  {
    id: 'tx-106',
    title: 'Roundtrip Flight to Tech Summit',
    amount: 12800.00,
    category: 'Travel',
    type: 'expense',
    date: '2026-09-10',
    paymentMethod: 'Credit Card',
    note: 'Airfare ticket for annual developer conference'
  },
  {
    id: 'tx-107',
    title: 'Mutual Fund Dividend Payout',
    amount: 8500.00,
    category: 'Investments',
    type: 'income',
    date: '2026-09-12',
    paymentMethod: 'Bank Transfer',
    note: 'Quarterly equity index dividend distribution'
  },
  {
    id: 'tx-108',
    title: 'Fine Dining & Team Celebration',
    amount: 4800.00,
    category: 'Food',
    type: 'expense',
    date: '2026-09-14',
    paymentMethod: 'Credit Card',
    note: 'Weekend dinner with product team'
  },
  {
    id: 'tx-109',
    title: 'High-speed Fiber & OTT Bundle',
    amount: 2199.00,
    category: 'Subscriptions',
    type: 'expense',
    date: '2026-09-15',
    paymentMethod: 'UPI',
    note: '1Gbps fiber internet + Netflix premium bundle'
  },
  {
    id: 'tx-110',
    title: 'Annual Health Checkup & Meds',
    amount: 3200.00,
    category: 'Healthcare',
    type: 'expense',
    date: '2026-09-18',
    paymentMethod: 'Debit Card',
    note: 'Comprehensive blood test and preventive wellness'
  },
  {
    id: 'tx-111',
    title: 'Zara Apparel & Shoes',
    amount: 8900.00,
    category: 'Shopping',
    type: 'expense',
    date: '2026-09-20',
    paymentMethod: 'Credit Card',
    note: 'Autumn wardrobe refresh & work casual shoes'
  },
  {
    id: 'tx-112',
    title: 'Vehicle Fuel & Toll Charges',
    amount: 5400.00,
    category: 'Transport',
    type: 'expense',
    date: '2026-09-23',
    paymentMethod: 'UPI',
    note: 'Car tank refill & Fastag toll auto-recharge'
  },
  {
    id: 'tx-113',
    title: 'Online Tech Certification Course',
    amount: 6500.00,
    category: 'Education',
    type: 'expense',
    date: '2026-09-25',
    paymentMethod: 'Credit Card',
    note: 'Advanced Cloud Architecture Certification'
  },
  {
    id: 'tx-114',
    title: 'Gourmet Coffee & Artisanal Bakery',
    amount: 1850.00,
    category: 'Food',
    type: 'expense',
    date: '2026-09-27',
    paymentMethod: 'UPI',
    note: 'Weekly espresso & breakfast meetings'
  }
];

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'goal-1',
    name: 'Emergency Reserve Fund',
    targetAmount: 300000,
    currentAmount: 185000,
    targetDate: '2026-12-31',
    color: '#10B981',
    notes: '6 months of living expenses reserve'
  },
  {
    id: 'goal-2',
    name: 'M3 MacBook Pro 16"',
    targetAmount: 220000,
    currentAmount: 165000,
    targetDate: '2026-11-15',
    color: '#3B82F6',
    notes: 'Workstation upgrade for high performance development'
  },
  {
    id: 'goal-3',
    name: 'Japan Autumn Trip',
    targetAmount: 250000,
    currentAmount: 110000,
    targetDate: '2027-04-10',
    color: '#8B5CF6',
    notes: 'Tokyo & Kyoto 10-day vacation'
  },
  {
    id: 'goal-4',
    name: 'Ather Electric Scooter',
    targetAmount: 140000,
    currentAmount: 140000,
    targetDate: '2026-09-30',
    color: '#EC4899',
    notes: 'Fully funded EV commute scooter!',
    isCompleted: true
  }
];

export const INITIAL_RECURRING_TRANSACTIONS: RecurringTransaction[] = [
  {
    id: 'rec-1',
    title: 'Monthly Base Salary',
    amount: 125000,
    type: 'income',
    category: 'Salary',
    frequency: 'monthly',
    startDate: '2026-01-01',
    nextDueDate: '2026-10-01',
    paymentMethod: 'Bank Transfer',
    note: 'Direct deposit salary payment',
    isActive: true
  },
  {
    id: 'rec-2',
    title: 'Apartment Rental Payment',
    amount: 28000,
    type: 'expense',
    category: 'Rent',
    frequency: 'monthly',
    startDate: '2026-01-01',
    nextDueDate: '2026-10-01',
    paymentMethod: 'Bank Transfer',
    note: 'Auto bank transfer for apartment',
    isActive: true
  },
  {
    id: 'rec-3',
    title: 'Fiber Broadband Connection',
    amount: 1199,
    type: 'expense',
    category: 'Utilities',
    frequency: 'monthly',
    startDate: '2026-01-15',
    nextDueDate: '2026-10-15',
    paymentMethod: 'UPI',
    note: 'High-speed internet recurring bill',
    isActive: true
  },
  {
    id: 'rec-4',
    title: 'Netflix 4K Ultra HD',
    amount: 649,
    type: 'expense',
    category: 'Subscriptions',
    frequency: 'monthly',
    startDate: '2026-02-10',
    nextDueDate: '2026-10-10',
    paymentMethod: 'Credit Card',
    note: 'Family streaming subscription',
    isActive: true
  }
];
