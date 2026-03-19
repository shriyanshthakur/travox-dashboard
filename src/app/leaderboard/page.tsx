"use client";

import { useFleetStore } from "@/store/useFleetStore";
import { useEffect, useState } from "react";
import { Trophy, Medal, Award, MapPin, ShieldAlert } from "lucide-react";

export default function LeaderboardPage() {
  const { vehicles } = useFleetStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="p-10 w-full h-full bg-slate-50 animate-pulse" />;

  const sortedVehicles = [...vehicles].sort((a, b) => b.smoothRideScore - a.smoothRideScore);
  const top3 = sortedVehicles.slice(0, 3);
  const tableData = sortedVehicles;

  return (
    <div className="h-full w-full overflow-y-auto bg-slate-50 p-8 custom-scrollbar relative z-10">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="border-b border-slate-200 pb-6">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Driver Safety Rankings</h1>
          <p className="text-slate-500 mt-2 text-lg">
            Scores are calculated via real-time IMU telemetry. Higher scores indicate safer driving patterns.
          </p>
        </div>

        {/* Top 3 Podium */}
        <div>
           <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
             <Trophy className="text-amber-500" />
             Top Performers
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mt-12 md:mt-0">
             
             {/* 2nd Place */}
             {top3[1] && (
               <div className="bg-white rounded-t-xl rounded-b-md border-2 border-slate-200 shadow-md p-6 flex flex-col items-center relative transform md:translate-y-8">
                 <div className="absolute -top-6 w-12 h-12 bg-slate-100 border-4 border-slate-300 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-slate-500 font-black text-xl">2</span>
                 </div>
                 <h3 className="text-lg font-bold text-slate-900 mt-4">{top3[1].driverName}</h3>
                 <p className="text-xs text-slate-400 font-mono mb-4">{top3[1].id}</p>
                 <div className="text-3xl font-black text-slate-700 bg-slate-100 w-full py-4 text-center rounded ring-1 ring-slate-200">
                    {top3[1].smoothRideScore} <span className="text-sm text-slate-400 block mt-1 font-medium font-sans uppercase tracking-widest">Score</span>
                 </div>
               </div>
             )}
             
             {/* 1st Place */}
             {top3[0] && (
               <div className="bg-white rounded-t-2xl rounded-b-md border-2 border-amber-300 shadow-xl p-8 flex flex-col items-center relative transform z-10">
                 <div className="absolute -top-8 w-16 h-16 bg-amber-100 border-4 border-amber-400 rounded-full flex items-center justify-center shadow-lg">
                    <Trophy className="text-amber-500 w-8 h-8" />
                 </div>
                 <h3 className="text-xl font-black text-slate-900 mt-4">{top3[0].driverName}</h3>
                 <p className="text-xs text-slate-400 font-mono mb-6">{top3[0].id}</p>
                 <div className="text-4xl font-black text-amber-600 bg-amber-50 w-full py-6 text-center rounded border border-amber-200 shadow-inner">
                    {top3[0].smoothRideScore} <span className="text-sm text-amber-500/70 block mt-1 font-bold font-sans uppercase tracking-widest">Score</span>
                 </div>
               </div>
             )}
             
             {/* 3rd Place */}
             {top3[2] && (
               <div className="bg-white rounded-t-xl rounded-b-md border-2 border-orange-200/50 shadow-sm p-6 flex flex-col items-center relative transform md:translate-y-12">
                 <div className="absolute -top-6 w-12 h-12 bg-orange-50 border-4 border-orange-300 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-orange-500 font-black text-xl">3</span>
                 </div>
                 <h3 className="text-lg font-bold text-slate-900 mt-4">{top3[2].driverName}</h3>
                 <p className="text-xs text-slate-400 font-mono mb-4">{top3[2].id}</p>
                 <div className="text-3xl font-black text-orange-600 bg-orange-50/50 w-full py-4 text-center rounded ring-1 ring-orange-200/50">
                    {top3[2].smoothRideScore} <span className="text-sm text-orange-400/80 block mt-1 font-medium font-sans uppercase tracking-widest">Score</span>
                 </div>
               </div>
             )}
             
           </div>
        </div>

        {/* Full Rankings Table */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
           <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                 <th className="py-4 px-6 font-bold w-16 text-center">Rank</th>
                 <th className="py-4 px-6 font-bold">Driver Name</th>
                 <th className="py-4 px-6 font-bold">Vehicle ID</th>
                 <th className="py-4 px-6 font-bold">Current Status</th>
                 <th className="py-4 px-6 font-bold text-right">Smooth Ride Score</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100 text-sm">
               {tableData.map((v, index) => {
                 const rank = index + 1;
                 const isWarning = v.smoothRideScore < 70;
                 return (
                   <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                     <td className="py-4 px-6 text-center font-mono font-bold text-slate-400">#{rank}</td>
                     <td className="py-4 px-6 font-bold text-slate-800">{v.driverName}</td>
                     <td className="py-4 px-6 font-mono text-slate-500">{v.id}</td>
                     <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            v.status === 'online' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                            v.status === 'stopped' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-red-50 text-red-600 border-red-200'
                        }`}>
                          {v.status}
                        </span>
                     </td>
                     <td className="py-4 px-6 text-right font-mono font-bold text-lg">
                        <div className={`flex justify-end items-center gap-2 ${isWarning ? 'text-red-500' : 'text-slate-800'}`}>
                          {isWarning && <ShieldAlert size={16} className="text-red-500 animate-pulse" />}
                          {v.smoothRideScore}
                        </div>
                     </td>
                   </tr>
                 );
               })}
             </tbody>
           </table>
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
