"use client";

import { useFleetStore } from "@/store/useFleetStore";
import { Gauge, ShieldAlert, UserSquare2, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function FleetFeed() {
  const { vehicles } = useFleetStore();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-96 bg-white border-l border-slate-200 p-4" />;

  const vehiclesWithAlerts = vehicles.filter((v) => v.alertFlag !== "none");
  const sortedVehicles = [...vehicles].sort((a, b) => {
    if (a.alertFlag !== "none" && b.alertFlag === "none") return -1;
    if (b.alertFlag !== "none" && a.alertFlag === "none") return 1;
    return 0;
  });

  const filteredVehicles = sortedVehicles.filter(v => 
    v.driverName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="w-[400px] h-full bg-slate-50 border-l border-slate-200 flex flex-col overflow-hidden relative z-20 shadow-[-4px_0_15px_rgba(0,0,0,0.02)]">
      
      {/* Sticky Header */}
      <div className="bg-slate-50 pt-4 px-5 pb-3 sticky top-0 z-30">
        <div className="flex justify-between items-end mb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-wide">Fleet Feed</h2>
            <p className="text-xs text-slate-500 font-mono mt-1 font-medium">STREAM: MOCK_SYNC_ENGINE</p>
          </div>
          <div className="text-xs font-mono font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded border border-blue-200">
            WS: CONNECTED
          </div>
        </div>
        
        {/* Search Input */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Filter by Driver or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-slate-800"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 custom-scrollbar relative">
        
        {/* Active Alerts Header */}
        {vehiclesWithAlerts.length > 0 && searchQuery === "" && (
          <h3 className="text-xs font-bold text-red-600 uppercase tracking-widest pl-1 flex items-center gap-2 mb-2 mt-2 sticky top-0 bg-slate-50 py-1 z-20">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Active Incidents ({vehiclesWithAlerts.length})
          </h3>
        )}

        {filteredVehicles.length === 0 && (
           <div className="text-center text-slate-400 py-10 text-sm">No vehicles found.</div>
        )}

        {/* Vehicles List */}
        {filteredVehicles.map((v) => {
           const hasAlert = v.alertFlag !== 'none';
           const isCritical = v.alertFlag === 'Harsh Braking';
           const isStopped = v.status === 'stopped';
           
           return (
            <div 
              key={v.id}
              className={`p-3.5 rounded-xl border-2 bg-white shadow-sm transition-all duration-300 relative overflow-hidden ${
                 hasAlert 
                 ? (isCritical ? 'border-red-500 shadow-red-200 shadow-md' : 'border-red-400 bg-red-50/30') 
                 : 'border-slate-100 hover:border-slate-300'
              }`}
            >
              {/* Alert Background glow */}
              {hasAlert && (
                 <div className="absolute top-0 right-0 w-24 h-24 bg-red-100 rounded-bl-full blur-2xl animate-pulse pointer-events-none"></div>
              )}

              <div className="relative z-10">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-col">
                        <span className={`font-bold text-sm flex items-center gap-1.5 ${hasAlert ? 'text-red-700' : 'text-slate-800'}`}>
                            <UserSquare2 size={16} className={hasAlert ? "text-red-500" : "text-blue-500"} />
                            {v.driverName}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400 mt-0.5 pointer-events-none">ID: {v.id}</span>
                    </div>

                    {hasAlert ? (
                      <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded shadow-sm animate-pulse">
                        CRITICAL: {v.alertFlag.toUpperCase()}
                      </span>
                    ) : (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                          isStopped ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      }`}>
                        {v.status}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    
                    {/* Speed Box */}
                    <div className={`flex items-start gap-2 p-2 rounded-lg border ${hasAlert ? 'bg-red-50/80 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                      <Gauge size={16} className={`${hasAlert ? 'text-red-500' : 'text-blue-500'} mt-0.5`} />
                      <div className="flex flex-col">
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${hasAlert ? 'text-red-600/70' : 'text-slate-500'}`}>Speed</span>
                        <span className={`font-mono text-xl font-bold tracking-tighter transition-all duration-2000 ease-linear ${hasAlert ? 'text-red-700' : 'text-slate-900'}`}>
                          {v.speedKmh} <span className={`text-[10px] font-sans font-medium ${hasAlert ? 'text-red-500' : 'text-slate-400'}`}>km/h</span>
                        </span>
                      </div>
                    </div>
                    
                    {/* Ride Score Box */}
                    <div className={`flex items-center gap-3 p-2 rounded-lg border bg-white ${hasAlert ? 'border-red-100' : 'border-slate-100'}`}>
                      {/* Circular Progress simulating score */}
                      <div className="relative flex items-center justify-center w-10 h-10 shrink-0">
                         <svg className="w-full h-full transform -rotate-90">
                            <circle cx="20" cy="20" r="16" className="stroke-slate-100" strokeWidth="4" fill="none" />
                            <circle 
                                cx="20" cy="20" r="16" 
                                className={`transition-all duration-1000 ease-out fill-none ${
                                    v.smoothRideScore > 80 ? 'stroke-emerald-500' : 
                                    v.smoothRideScore >= 50 ? 'stroke-amber-500' : 'stroke-red-500'
                                }`} 
                                strokeWidth="4" 
                                strokeDasharray="100" 
                                strokeDashoffset={100 - v.smoothRideScore} 
                                strokeLinecap="round"
                            />
                         </svg>
                         <span className="absolute text-[10px] font-bold font-mono text-slate-700">{Math.round(v.smoothRideScore)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-[9px] uppercase font-bold tracking-wider ${hasAlert ? 'text-red-600/70' : 'text-slate-500'}`}>Safety</span>
                        <span className={`text-xs font-semibold ${
                            v.smoothRideScore > 80 ? 'text-emerald-700' : 
                            v.smoothRideScore >= 50 ? 'text-amber-700' : 'text-red-700'
                        }`}>
                          {v.smoothRideScore > 80 ? 'Optimal' : v.smoothRideScore >= 50 ? 'Warning' : 'Critical'}
                        </span>
                      </div>
                    </div>
                    
                  </div>
              </div>
            </div>
           );
        })}
      </div>
      
      {/* Scrollbar hide styling */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
      `}} />
    </div>
  );
}
