import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="min-h-screen bg-[#0F172A] flex justify-center items-start md:items-center py-0 md:py-8 font-['Plus_Jakarta_Sans',_sans-serif]">
      <div className="w-full max-w-[430px] h-screen md:h-[844px] bg-[#F8FAFC] shadow-2xl relative flex flex-col overflow-hidden md:rounded-[40px] border-[8px] border-[#0F172A] md:border-[#1E293B]">
        {/* Status Bar Mockup */}
        <div className="h-10 w-full flex justify-between items-center px-8 shrink-0 bg-white md:bg-[#F8FAFC]">
          <span className="text-xs font-semibold">9:41</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded-full border border-black/20" />
            <div className="w-4 h-4 rounded-full border border-black/20" />
            <div className="w-4 h-4 rounded-full border border-black/20" />
          </div>
        </div>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
          {children}
        </main>

        {/* Home Indicator */}
        <div className="h-6 w-full flex justify-center items-center shrink-0 bg-white md:bg-[#F8FAFC]">
          <div className="w-32 h-1 rounded-full bg-black/10" />
        </div>
      </div>
    </div>
  );
}
