import React from 'react';

export default function GodmodeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] w-full">
      {children}
    </div>
  );
}