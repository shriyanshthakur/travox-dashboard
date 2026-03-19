"use client";

import { useState } from "react";
import { Settings2, BellRing, Webhook, Save, CheckCircle2 } from "lucide-react";

type Tab = "general" | "thresholds" | "api";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [isToastVisible, setIsToastVisible] = useState(false);

  // Form States
  const [rideScore, setRideScore] = useState(70);
  const [speedLimit, setSpeedLimit] = useState("80");
  const [autoSos, setAutoSos] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [managerName, setManagerName] = useState("Admin User");
  const [email, setEmail] = useState("admin@travox.com");

  const handleSave = () => {
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 3000);
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-slate-50 p-8 custom-scrollbar relative z-10 flex flex-col md:flex-row gap-8">
      
      {/* Settings Inner Sidebar */}
      <aside className="w-full md:w-64 shrink-0 mt-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-6 px-2">Settings</h1>
        <nav className="space-y-1">
          <button 
            onClick={() => setActiveTab("general")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg font-medium transition-colors ${
              activeTab === 'general' ? 'bg-white shadow-sm border border-slate-200 text-blue-700' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 border border-transparent'
            }`}
          >
            <Settings2 size={18} className={activeTab === 'general' ? 'text-blue-600' : 'text-slate-400'} />
            General
          </button>
          <button 
            onClick={() => setActiveTab("thresholds")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg font-medium transition-colors ${
              activeTab === 'thresholds' ? 'bg-white shadow-sm border border-slate-200 text-blue-700' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 border border-transparent'
            }`}
          >
            <BellRing size={18} className={activeTab === 'thresholds' ? 'text-blue-600' : 'text-slate-400'} />
            Alert Thresholds
          </button>
          <button 
            onClick={() => setActiveTab("api")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg font-medium transition-colors ${
              activeTab === 'api' ? 'bg-white shadow-sm border border-slate-200 text-blue-700' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 border border-transparent'
            }`}
          >
            <Webhook size={18} className={activeTab === 'api' ? 'text-blue-600' : 'text-slate-400'} />
            API & Integrations
          </button>
        </nav>
      </aside>

      {/* Main Settings Content */}
      <div className="flex-1 max-w-3xl pb-24 mt-4">
        
        {/* TAB: General */}
        {activeTab === "general" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-xl font-bold text-slate-800">General Preferences</h2>
              <p className="text-sm text-slate-500 mt-1 mb-6">Manage your primary account and UI display settings.</p>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <div>
                  <label className="font-bold text-slate-800 block text-sm">Dark Mode UI</label>
                  <span className="text-xs text-slate-500">Switch the dashboard to a darker color palette (Preview only).</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-bold text-slate-800 block text-sm mb-1.5">Fleet Manager Name</label>
                  <input 
                    type="text" 
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="w-full sm:max-w-md px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block text-sm mb-1.5">Emergency Contact Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full sm:max-w-md px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                    placeholder="manager@company.com"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Alert Thresholds */}
        {activeTab === "thresholds" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Alert Thresholds & Triggers</h2>
              <p className="text-sm text-slate-500 mt-1 mb-6">Configure the exact telemetry thresholds that trigger global warnings.</p>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-8">
              
              {/* Ride Score Slider */}
              <div className="border-b border-slate-100 pb-8">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <label className="font-bold text-slate-800 block text-sm">Minimum Smooth Ride Score</label>
                    <span className="text-xs text-slate-500 block">Scores falling below this number will flag the vehicle in the leaderboard.</span>
                  </div>
                  <div className="px-3 py-1 bg-blue-50 text-blue-700 font-mono font-bold rounded shadow-sm border border-blue-100 shrink-0">
                    {rideScore}
                  </div>
                </div>
                
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={rideScore} 
                  onChange={(e) => setRideScore(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                  <span>0 (Critical)</span>
                  <span>50</span>
                  <span>100 (Perfect)</span>
                </div>
              </div>

              {/* Speed Limit Input */}
              <div className="border-b border-slate-100 pb-8">
                  <label className="font-bold text-slate-800 block text-sm mb-1">Speed Limit Warning (km/h)</label>
                  <span className="text-xs text-slate-500 block mb-3">Triggers a hard visual alert if a vehicle exceeds this speed limit.</span>
                  <div className="relative w-full sm:max-w-[200px]">
                    <input 
                      type="number" 
                      value={speedLimit}
                      onChange={(e) => setSpeedLimit(e.target.value)}
                      className="w-full pl-4 pr-12 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                    />
                    <span className="absolute right-3 top-2 text-slate-400 text-sm font-medium">km/h</span>
                  </div>
              </div>

              {/* Auto SOS Toggle */}
              <div className="flex items-center justify-between pb-2">
                <div>
                  <label className="font-bold text-slate-800 block text-sm">Enable Auto-SOS Dispatch</label>
                  <span className="text-xs text-slate-500 w-4/5 block mt-1">Automatically send payload logic to emergency APIs when the IMU triggers a 'CRASH' event.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={autoSos} onChange={() => setAutoSos(!autoSos)} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>

            </div>
          </div>
        )}

        {/* TAB: API */}
        {activeTab === "api" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-xl font-bold text-slate-800">API & Integrations</h2>
              <p className="text-sm text-slate-500 mt-1 mb-6">Manage external connectivity and Webhooks.</p>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center py-12">
               <Webhook className="text-slate-300 w-16 h-16 mb-4" />
               <h3 className="font-bold text-slate-700 text-lg">Webhooks Unavailable</h3>
               <p className="text-sm text-slate-500 max-w-sm mt-2">API connections are currently disabled in the prototype stage. Please check back later when backend servers are configured.</p>
            </div>
          </div>
        )}

        {/* Bottom Save Action */}
        <div className="mt-8 flex justify-end">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-md transition-all active:scale-95"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {isToastVisible && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-8 duration-300 z-50">
          <CheckCircle2 className="text-emerald-400" size={24} />
          <div>
            <p className="font-bold text-sm">Settings Saved</p>
            <p className="text-xs text-slate-300">Your configuration has been updated.</p>
          </div>
        </div>
      )}

      {/* Global CSS Overrides for slider styles */}
      <style dangerouslySetInnerHTML={{__html: `
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 0 5px rgba(0,0,0,0.2);
        }
      `}} />

    </div>
  );
}
