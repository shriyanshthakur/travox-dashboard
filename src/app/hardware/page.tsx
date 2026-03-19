"use client";

import { useFleetStore } from "@/store/useFleetStore";
import { useEffect, useState, useMemo } from "react";
import { Cpu, Battery, BatteryWarning, HardDrive, Wifi, ShieldAlert, CpuIcon, CheckCircle2 } from "lucide-react";

export default function HardwareHealthPage() {
  const { vehicles } = useFleetStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate deterministic mock hardware data mapped to vehicles
  const hardwareData = useMemo(() => {
    return vehicles.map((v, i) => {
      // Hardcoded logical presets to demonstrate alert states
      const batteryLevels = [85, 12, 99, 45];
      const signals = ["Good", "Fair", "Good", "Poor"];
      const storageUsed = [4.2, 8.5, 15.2, 12.0]; // out of 16 GB

      return {
        ...v,
        hardware: {
          batteryLevel: batteryLevels[i % batteryLevels.length],
          signalStrength: signals[i % signals.length],
          sdCardStorage: storageUsed[i % storageUsed.length]
        }
      };
    });
  }, [vehicles]);

  if (!mounted) return <div className="p-10 w-full h-full bg-slate-50 animate-pulse" />;

  const onlineDevices = hardwareData.filter(v => v.status !== 'offline').length;
  const lowBatteryCount = hardwareData.filter(v => v.hardware.batteryLevel < 20).length;
  const criticalStorageCount = hardwareData.filter(v => (v.hardware.sdCardStorage / 16) > 0.9).length;

  return (
    <div className="h-full w-full overflow-y-auto bg-slate-50 p-8 custom-scrollbar relative z-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="border-b border-slate-200 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <CpuIcon className="text-blue-600" size={32} />
              Hardware Diagnostics
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Live Edge-Device Health Monitoring (ESP32 Telemetry)
            </p>
          </div>
          <div className="text-xs font-mono font-semibold text-slate-500 bg-white px-3 py-1.5 rounded border border-slate-200 shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse block"></span>
            DIAGNOSTICS: SYNCED
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Devices Online</p>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
                <Cpu size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-4xl font-black text-slate-800 tracking-tighter">{onlineDevices}</span>
              <span className="text-sm font-medium text-emerald-600 flex items-center gap-1 mb-1"><CheckCircle2 size={14}/> All Stable</span>
            </div>
          </div>

          <div className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-between ${lowBatteryCount > 0 ? 'border-red-200 bg-red-50/10' : 'border-slate-200'}`}>
            <div className="flex justify-between items-start">
              <p className={`text-sm font-bold uppercase tracking-wider ${lowBatteryCount > 0 ? 'text-red-500' : 'text-slate-500'}`}>Low Battery (&lt;20%)</p>
              <div className={`p-2 rounded-md ${lowBatteryCount > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
                <BatteryWarning size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <span className={`text-4xl font-black tracking-tighter ${lowBatteryCount > 0 ? 'text-red-600' : 'text-slate-800'}`}>{lowBatteryCount}</span>
              {lowBatteryCount > 0 && <span className="text-xs font-bold text-red-600 uppercase bg-red-100 px-2 py-0.5 rounded">Action Required</span>}
            </div>
          </div>

          <div className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col justify-between ${criticalStorageCount > 0 ? 'border-orange-200 bg-orange-50/10' : 'border-slate-200'}`}>
            <div className="flex justify-between items-start">
              <p className={`text-sm font-bold uppercase tracking-wider ${criticalStorageCount > 0 ? 'text-orange-500' : 'text-slate-500'}`}>Storage Critical</p>
              <div className={`p-2 rounded-md ${criticalStorageCount > 0 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
                <HardDrive size={20} className={criticalStorageCount > 0 ? "text-orange-600" : "text-slate-400"} />
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <span className={`text-4xl font-black tracking-tighter ${criticalStorageCount > 0 ? 'text-orange-600' : 'text-slate-800'}`}>{criticalStorageCount}</span>
              {criticalStorageCount > 0 && <span className="text-xs font-bold text-orange-600 uppercase bg-orange-100 px-2 py-0.5 rounded">Check SD Card</span>}
            </div>
          </div>
        </div>

        {/* Device Grid */}
        <h2 className="text-lg font-bold text-slate-800 mt-10 tracking-wide">Vehicle Diagnostics Grid</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {hardwareData.map((v) => {
            const isBatteryLow = v.hardware.batteryLevel < 20;
            const isStorageFull = (v.hardware.sdCardStorage / 16) > 0.9;
            const hasAlert = isBatteryLow || isStorageFull;
            const storagePercent = (v.hardware.sdCardStorage / 16) * 100;

            let signalColor = "text-emerald-500";
            if (v.hardware.signalStrength === "Fair") signalColor = "text-amber-500";
            if (v.hardware.signalStrength === "Poor") signalColor = "text-red-500";

            return (
              <div 
                key={v.id} 
                className={`flex flex-col rounded-xl border-2 bg-white shadow-sm overflow-hidden transition-all duration-300 relative ${
                  hasAlert ? 'border-red-400 ring-4 ring-red-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Card Header */}
                <div className={`p-4 border-b flex justify-between items-center ${hasAlert ? 'bg-red-50 border-red-100' : 'bg-slate-50/50 border-slate-100'}`}>
                  <div>
                    <h3 className={`font-bold text-lg ${hasAlert ? 'text-red-800' : 'text-slate-800'}`}>{v.driverName}</h3>
                    <p className="text-xs font-mono text-slate-500">{v.id}</p>
                  </div>
                  {hasAlert && (
                    <div className="flex items-center gap-1.5 bg-red-600 text-white px-2.5 py-1 rounded text-xs font-bold shadow-sm animate-pulse uppercase tracking-wider">
                      <ShieldAlert size={14} />
                      Action Required
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-6">
                  
                  {/* Battery Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                         <Battery size={16} className={isBatteryLow ? "text-red-500" : "text-slate-400"} />
                         Backup Battery
                       </span>
                       <span className={`text-sm font-bold font-mono ${isBatteryLow ? "text-red-600" : "text-slate-600"}`}>
                         {v.hardware.batteryLevel}%
                       </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                       <div 
                         className={`h-full rounded-full transition-all duration-1000 ${isBatteryLow ? 'bg-red-500' : 'bg-emerald-500'}`}
                         style={{ width: `${v.hardware.batteryLevel}%` }}
                       />
                    </div>
                  </div>

                  {/* Storage Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                         <HardDrive size={16} className={isStorageFull ? "text-orange-500" : "text-slate-400"} />
                         SD Card Storage
                       </span>
                       <span className={`text-[11px] font-bold uppercase tracking-wide ${isStorageFull ? "text-orange-600" : "text-slate-500"}`}>
                         <span className="font-mono text-sm">{v.hardware.sdCardStorage.toFixed(1)}</span> / 16 GB
                       </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                       <div 
                         className={`h-full rounded-full transition-all duration-1000 ${isStorageFull ? 'bg-orange-500' : 'bg-blue-500'}`}
                         style={{ width: `${storagePercent}%` }}
                       />
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px w-full bg-slate-100"></div>

                  {/* Signal Strength & Power */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <Wifi size={16} className={signalColor} />
                       <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Signal: <span className={signalColor}>{v.hardware.signalStrength}</span></span>
                    </div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                       Status: <span className={v.status === 'offline' ? 'text-red-500' : 'text-emerald-500'}>{v.status}</span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
      
      {/* Scrollbar styles for the page */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
      `}} />
    </div>
  );
}
