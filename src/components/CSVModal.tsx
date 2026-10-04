import React, { useState } from 'react';
import { X, Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { parseCSV, exportToCSV } from '../utils/csvHelpers';
import { Transaction } from '../types/finance';

interface CSVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CSVModal: React.FC<CSVModalProps> = ({ isOpen, onClose }) => {
  const { transactions, importTransactions } = useFinance();
  const [csvText, setCsvText] = useState('');
  const [importStatus, setImportStatus] = useState<{ count: number; error?: string } | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) setCsvText(text);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    setImportStatus(null);
    if (!csvText.trim()) return;

    try {
      const parsed = parseCSV(csvText);
      if (parsed.length === 0) {
        setImportStatus({ count: 0, error: 'No valid transaction records found in CSV.' });
        return;
      }

      await importTransactions(parsed);
      setImportStatus({ count: parsed.length });
      setCsvText('');
    } catch (err: any) {
      setImportStatus({ count: 0, error: err.message || 'Failed parsing CSV.' });
    }
  };

  const handleExport = () => {
    exportToCSV(transactions, 'fintrack-export.csv');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-100">Import / Export CSV Data</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {importStatus?.error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{importStatus.error}</span>
          </div>
        )}

        {importStatus?.count && importStatus.count > 0 ? (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Successfully imported {importStatus.count} transactions!</span>
          </div>
        ) : null}

        <div className="space-y-5 text-xs">
          
          {/* Export Section */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <h4 className="font-bold text-slate-100 flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export Ledger to CSV</span>
            </h4>
            <p className="text-slate-400">Download all your current transaction records for Excel, Google Sheets, or backup.</p>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV File</span>
            </button>
          </div>

          {/* Import Section */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
            <h4 className="font-bold text-slate-100 flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-400" />
              <span>Import CSV File</span>
            </h4>
            <p className="text-slate-400">Upload a CSV file containing columns: Title, Amount, Category, Type, Date.</p>

            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
            />

            <textarea
              rows={3}
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
              placeholder="Or paste CSV text content directly here..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 font-mono text-[11px] outline-none"
            />

            <button
              onClick={handleImport}
              disabled={!csvText.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
            >
              <Upload className="w-4 h-4" />
              <span>Import Transactions</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
