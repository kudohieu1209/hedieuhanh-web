import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { BottomNav } from './BottomNav';
import { X } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden apple-drafting-canvas text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-72 max-w-[85vw] h-full shadow-2xl flex flex-col bg-white dark:bg-[#0d131f] animate-in slide-in-from-left duration-250">
            {/* Mobile close button floating */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 z-20 shadow-xs"
              aria-label="Đóng menu"
            >
              <X className="w-4 h-4" />
            </button>
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Topbar />
        
        {/* Dynamic Page Content with Smooth Drafting Canvas Backdrop */}
        <main className="flex-1 overflow-y-auto px-3.5 pb-3.5 pt-16 sm:px-6 sm:pb-6 md:pt-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full pb-24 md:pb-12">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation Styled like iOS Glass Dock */}
        <BottomNav onOpenMenu={() => setMobileMenuOpen(true)} />
      </div>
    </div>
  );
};
