import { Transaction, TransactionType, Category } from '../types/finance';

export const exportToCSV = (transactions: Transaction[], filename = 'finance_export.csv') => {
  const headers = ['ID', 'Title', 'Amount', 'Category', 'Type', 'Date', 'Note'];
  
  const rows = transactions.map(t => [
    `"${t.id}"`,
    `"${t.title.replace(/"/g, '""')}"`,
    t.amount.toFixed(2),
    `"${t.category}"`,
    `"${t.type}"`,
    `"${t.date}"`,
    `"${(t.note || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const parseCSV = (csvText: string): Transaction[] => {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length <= 1) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"(.*)"$/, '$1').toLowerCase());
  const transactions: Transaction[] = [];

  const findIdx = (names: string[]) => headers.findIndex(h => names.includes(h));

  const titleIdx = findIdx(['title', 'merchant', 'description', 'name']);
  const amountIdx = findIdx(['amount', 'price', 'value', 'cost']);
  const categoryIdx = findIdx(['category', 'cat']);
  const typeIdx = findIdx(['type', 'kind']);
  const dateIdx = findIdx(['date', 'created_at', 'timestamp']);
  const noteIdx = findIdx(['note', 'notes', 'memo']);

  for (let i = 1; i < lines.length; i++) {
    // Regex for CSV splitting respecting quotes
    const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
    const cleanValues = values.map(v => v.trim().replace(/^"(.*)"$/, '$1').replace(/""/g, '"'));

    if (cleanValues.length === 0) continue;

    const rawTitle = titleIdx !== -1 ? cleanValues[titleIdx] : cleanValues[0] || 'Imported Transaction';
    const rawAmount = amountIdx !== -1 ? parseFloat(cleanValues[amountIdx]) : parseFloat(cleanValues[1] || '0');
    const rawCategory = (categoryIdx !== -1 ? cleanValues[categoryIdx] : 'Other') as Category;
    const rawType = (typeIdx !== -1 ? cleanValues[typeIdx].toLowerCase() : (rawAmount < 0 ? 'expense' : 'expense')) as TransactionType;
    const rawDate = dateIdx !== -1 ? cleanValues[dateIdx] : new Date().toISOString().split('T')[0];
    const rawNote = noteIdx !== -1 ? cleanValues[noteIdx] : '';

    if (!isNaN(rawAmount) && rawTitle) {
      transactions.push({
        id: `csv-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
        title: rawTitle,
        amount: Math.abs(rawAmount),
        category: rawCategory || 'Other',
        type: rawType === 'income' ? 'income' : 'expense',
        date: rawDate,
        note: rawNote
      });
    }
  }

  return transactions;
};
