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
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        <Topbar />
        
        {/* Lớp mờ chuyển tiếp đỉnh trên di động giúp nội dung cuộn mượt dưới 2 pill nổi */}
        <div 
          aria-hidden="true" 
          className="md:hidden fixed top-0 inset-x-0 h-16 z-30 pointer-events-none bg-gradient-to-b from-[#eae2d5]/95 via-[#eae2d5]/70 to-transparent dark:from-[#0b0f19]/95 dark:via-[#0b0f19]/70 backdrop-blur-[2px]" 
        />

        {/* Dynamic Page Content with Smooth Drafting Canvas Backdrop */}
        <main className="flex-1 overflow-y-auto px-3.5 pb-3.5 pt-[calc(3.75rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pb-6 md:pt-6 lg:p-8 overscroll-contain">
          <div className="max-w-7xl mx-auto w-full pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] md:pb-12">
            <Outlet />
          </div>
        </main>

        {/* Lớp mờ chuyển tiếp đáy trên di động giúp nội dung cuộn mềm mại sau thanh dock nổi */}
        <div 
          aria-hidden="true" 
          className="md:hidden fixed bottom-0 inset-x-0 h-24 z-30 pointer-events-none bg-gradient-to-t from-[#eae2d5]/95 via-[#eae2d5]/60 to-transparent dark:from-[#0b0f19]/95 dark:via-[#0b0f19]/60" 
        />

        {/* Mobile Bottom Navigation Styled like iOS Glass Dock */}
        <BottomNav />
      </div>
    </div>
  );
};
