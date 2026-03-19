"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, ShieldAlert, Cpu, Settings } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full text-slate-700 shadow-sm z-30 relative">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-wider text-slate-900 flex items-center gap-2">
          <Activity className="text-blue-600" />
          TRAVOX
        </h1>
        <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Fleet Control Center</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <Link 
          href="/" 
          className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${pathname === '/' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}
        >
          <Activity size={20} />
          Live Radar
        </Link>
        <Link 
          href="/leaderboard" 
          className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${pathname === '/leaderboard' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}
        >
          <ShieldAlert size={20} />
          Safety Leaderboard
        </Link>
        <Link 
          href="/hardware" 
          className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${pathname === '/hardware' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}
        >
          <Cpu size={20} />
          Hardware Health
        </Link>
        <Link 
          href="/settings" 
          className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${pathname === '/settings' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}
        >
          <Settings size={20} />
          Settings
        </Link>
      </nav>
      
      <div className="p-4 border-t border-slate-200 text-xs text-slate-500">
        System Status: <span className="text-green-600 font-medium">Online</span>
      </div>
    </aside>
  );
}
