import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data.json');

// Initial seed data
const initialData = {
  transactions: [
    {
      id: 'tx-101',
      title: 'TechCorp Salary Deposit',
      amount: 5400.00,
      category: 'Salary',
      type: 'income',
      date: '2026-08-01',
      note: 'Monthly base compensation + performance bonus'
    },
    {
      id: 'tx-102',
      title: 'Whole Foods Market',
      amount: 184.50,
      category: 'Food',
      type: 'expense',
      date: '2026-08-03',
      note: 'Weekly organic groceries & kitchen essentials'
    },
    {
      id: 'tx-103',
      title: 'City Power & Utilities',
      amount: 145.20,
      category: 'Bills',
      type: 'expense',
      date: '2026-08-04',
      note: 'Monthly electricity and water service'
    },
    {
      id: 'tx-104',
      title: 'UI/UX Freelance Client',
      amount: 1250.00,
      category: 'Freelance',
      type: 'income',
      date: '2026-08-05',
      note: 'Fintech Mobile App Prototype milestone 2'
    },
    {
      id: 'tx-105',
      title: 'Apple Store NYC',
      amount: 329.00,
      category: 'Shopping',
      type: 'expense',
      date: '2026-08-07',
      note: 'AirPods Pro 2nd Gen & Magsafe charger'
    },
    {
      id: 'tx-106',
      title: 'Delta Air Lines',
      amount: 380.00,
      category: 'Travel',
      type: 'expense',
      date: '2026-08-09',
      note: 'Roundtrip flight ticket for tech conference'
    },
    {
      id: 'tx-107',
      title: 'Trader Joe\'s Grocery',
      amount: 112.40,
      category: 'Food',
      type: 'expense',
      date: '2026-08-11',
      note: 'Snacks, coffee beans, and fresh produce'
    },
    {
      id: 'tx-108',
      title: 'Netflix & Spotify Premium',
      amount: 28.99,
      category: 'Entertainment',
      type: 'expense',
      date: '2026-08-12',
      note: 'Family plan monthly subscription auto-renew'
    },
    {
      id: 'tx-109',
      title: 'Apex Pharmacy & Health',
      amount: 85.00,
      category: 'Health',
      type: 'expense',
      date: '2026-08-14',
      note: 'Prescription refills & vitamin supplements'
    },
    {
      id: 'tx-110',
      title: 'Uber Rides & Eats',
      amount: 64.30,
      category: 'Travel',
      type: 'expense',
      date: '2026-08-15',
      note: 'Airport shuttle and evening ride home'
    },
    {
      id: 'tx-111',
      title: 'Starlight Bistro Dining',
      amount: 142.80,
      category: 'Food',
      type: 'expense',
      date: '2026-08-16',
      note: 'Dinner celebration with engineering team'
    },
    {
      id: 'tx-112',
      title: 'Dividend Payout',
      amount: 310.50,
      category: 'Investment',
      type: 'income',
      date: '2026-08-17',
      note: 'Quarterly index fund dividend return'
    },
    {
      id: 'tx-113',
      title: 'High-speed Fiber Internet',
      amount: 89.99,
      category: 'Bills',
      type: 'expense',
      date: '2026-08-18',
      note: '1 Gbps symmetrical connection'
    },
    {
      id: 'tx-114',
      title: 'Nike Outlet Apparel',
      amount: 165.00,
      category: 'Shopping',
      type: 'expense',
      date: '2026-08-19',
      note: 'Running shoes & athletic clothing'
    },
    {
      id: 'tx-115',
      title: 'Sweetgreen Salad',
      amount: 22.50,
      category: 'Food',
      type: 'expense',
      date: '2026-08-20',
      note: 'Quick healthy lunch'
    }
  ],
  budgets: [
    { category: 'Food', limit: 600 },
    { category: 'Shopping', limit: 450 },
    { category: 'Bills', limit: 700 },
    { category: 'Entertainment', limit: 300 },
    { category: 'Travel', limit: 500 },
    { category: 'Health', limit: 250 },
    { category: 'Other', limit: 200 }
  ]
};

// Ensure JSON storage file exists
function loadData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Failed to read data file:', err);
    return initialData;
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write data file:', err);
  }
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/transactions', (req, res) => {
  const data = loadData();
  res.json(data.transactions);
});

app.post('/api/transactions', (req, res) => {
  const data = loadData();
  const newTx = req.body;
  if (!newTx.id) {
    newTx.id = `tx-${Date.now()}`;
  }
  data.transactions.unshift(newTx);
  saveData(data);
  res.status(201).json(newTx);
});

app.post('/api/transactions/bulk', (req, res) => {
  const data = loadData();
  const newItems = req.body;
  if (Array.isArray(newItems)) {
    data.transactions = [...newItems, ...data.transactions];
    saveData(data);
  }
  res.status(201).json(data.transactions);
});

app.put('/api/transactions/:id', (req, res) => {
  const { id } = req.params;
  const data = loadData();
  const index = data.transactions.findIndex(t => t.id === id);
  if (index !== -1) {
    data.transactions[index] = { ...data.transactions[index], ...req.body };
    saveData(data);
    return res.json(data.transactions[index]);
  }
  res.status(404).json({ error: 'Transaction not found' });
});

app.delete('/api/transactions/:id', (req, res) => {
  const { id } = req.params;
  const data = loadData();
  data.transactions = data.transactions.filter(t => t.id !== id);
  saveData(data);
  res.json({ success: true, id });
});

app.get('/api/budgets', (req, res) => {
  const data = loadData();
  res.json(data.budgets);
});

app.post('/api/budgets', (req, res) => {
  const data = loadData();
  const updatedBudgets = req.body;
  data.budgets = updatedBudgets;
  saveData(data);
  res.json(data.budgets);
});

app.listen(PORT, () => {
  console.log(`Backend Finance Tracker Server running at http://localhost:${PORT}`);
});
