import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';

// Pages
import { DashboardPage } from './components/pages/DashboardPage';
import { TransactionsPage } from './components/pages/TransactionsPage';
import { BudgetsPage } from './components/pages/BudgetsPage';
import { SavingsPage } from './components/pages/SavingsPage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { RecurringPage } from './components/pages/RecurringPage';
import { NotificationsPage } from './components/pages/NotificationsPage';
import { SettingsPage } from './components/pages/SettingsPage';

// Modals
import { QuickAddModal } from './components/QuickAddModal';
import { BudgetModal } from './components/BudgetModal';
import { CSVModal } from './components/CSVModal';
import { AuthModal } from './components/modals/AuthModal';
import { OnboardingWizard } from './components/modals/OnboardingWizard';
import { Transaction } from './types/finance';

const MainLayout: React.FC = () => {
  const { activeTab, isLoading } = useFinance();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setIsQuickAddOpen(true);
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsQuickAddOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Loading FinTrack Engine...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-300">
      
      {/* Desktop Navigation Sidebar */}
      <Sidebar onOpenQuickAdd={handleOpenAddModal} />

      {/* Mobile Drawer & Bottom Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenQuickAdd={handleOpenAddModal}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        
        {/* Header Bar */}
        <Header
          onOpenQuickAdd={handleOpenAddModal}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Page Content Viewport */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {activeTab === 'dashboard' && (
            <DashboardPage
              onOpenQuickAdd={handleOpenAddModal}
              onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
              onEditTransaction={handleEditTransaction}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsPage
              onOpenQuickAdd={handleOpenAddModal}
              onEditTransaction={handleEditTransaction}
              onOpenCSVModal={() => setIsCSVModalOpen(true)}
            />
          )}

          {activeTab === 'budgets' && (
            <BudgetsPage
              onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
            />
          )}

          {activeTab === 'savings' && (
            <SavingsPage />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsPage />
          )}

          {activeTab === 'recurring' && (
            <RecurringPage />
          )}

          {activeTab === 'notifications' && (
            <NotificationsPage />
          )}

          {activeTab === 'settings' && (
            <SettingsPage />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950/80 py-4 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>&copy; {new Date().getFullYear()} FinTrack. Take Control. Track Smarter.</span>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                FinTrack Engine Online
              </span>
            </div>
          </div>
        </footer>

      </div>

      {/* Global Modals */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => {
          setIsQuickAddOpen(false);
          setEditingTransaction(null);
        }}
        editTransaction={editingTransaction}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
      />

      <CSVModal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
      />

      <AuthModal />
      <OnboardingWizard />

    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <MainLayout />
      </FinanceProvider>
    </AuthProvider>
  );
}

export default App;
