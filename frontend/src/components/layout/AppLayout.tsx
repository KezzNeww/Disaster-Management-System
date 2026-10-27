import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavbar } from '../enterprise/TopNavbar';
import { AppSidebar } from './AppSidebar';
import { StatusBar } from './StatusBar';

export function AppLayout() {
  return (
    <div className="flex flex-col h-screen w-screen bg-[#0F172A] text-slate-100 overflow-hidden font-sans">
      {/* Top Navbar */}
      <TopNavbar />

      {/* Main Workspace Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <AppSidebar />

        {/* Scrollable Main Tactical Area */}
        <main className="flex-1 overflow-y-auto bg-[#0B0F17] relative p-4 lg:p-6 enterprise-grid">
          <Outlet />
        </main>
      </div>

      {/* Bottom Telemetry Status Bar */}
      <StatusBar />
    </div>
  );
}
