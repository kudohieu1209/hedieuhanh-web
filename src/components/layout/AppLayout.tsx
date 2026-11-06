import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { BottomNav } from './BottomNav';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden apple-drafting-canvas text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar />
      </div>

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
        <BottomNav />
      </div>
    </div>
  );
};
