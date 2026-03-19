"use client";

import { useFleetStore } from '@/store/useFleetStore';
import { Bell, Car, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
  const { vehicles } = useFleetStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const activeVehicles = vehicles.filter((v) => v.status !== 'offline').length;
  const activeAlerts = vehicles.filter((v) => v.alertFlag !== 'none').length;

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 text-slate-600 shadow-sm z-20 relative">
      <div className="flex items-center">
         <div className="flex items-center gap-2 text-sm border border-slate-200 bg-slate-50 px-3 py-1.5 rounded-full shadow-sm">
           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
           Live Telemetry Feed
         </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Car size={18} className="text-slate-400" />
          <span className="text-sm font-medium">
            Active Fleet: <span className="text-slate-900 ml-1 font-mono transition-all">{mounted ? activeVehicles : 0}</span>
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className={activeAlerts > 0 ? "text-red-600 animate-pulse" : "text-slate-400"} />
          <span className="text-sm font-medium">
            Alerts: <span className={`ml-1 font-mono transition-colors ${activeAlerts > 0 ? "text-red-600 font-bold animate-pulse" : "text-slate-900"}`}>{mounted ? activeAlerts : 0}</span>
          </span>
        </div>

        <div className="h-6 w-px bg-slate-200 mx-2"></div>
        
        <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-900">
          <Bell size={20} className={activeAlerts > 0 ? "text-red-600 animate-pulse" : ""} />
          {mounted && activeAlerts > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] rounded-full border-2 border-white"></span>
          )}
        </button>
      </div>
    </header>
  );
}
