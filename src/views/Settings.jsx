import React, { useState } from 'react';
import { FaUserSecret, FaBell, FaGlobe, FaPalette, FaSave } from "react-icons/fa";

const Settings = ({ isDarkMode }) => {
  // 1. State for various settings
  const [security, setSecurity] = useState({ biometric: true, stealth: false });
  const [notifications, setNotifications] = useState({ orders: true, system: false });
  const [brandName, setBrandName] = useState("AN-SHOP");

  // Toggle Handler
  const handleToggle = (section, key) => {
    if (section === 'security') setSecurity(prev => ({ ...prev, [key]: !prev[key] }));
    if (section === 'notifications') setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const saveSettings = () => {
    // Logic to save to localStorage or Backend
    alert("Settings Synced to Master Database");
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in fade-in duration-700 pb-16">
      
      {/* SECTION 1: SECURITY PROTOCOLS */}
      <div className={`p-8 sm:p-10 rounded-[2.5rem] border ${isDarkMode ? "bg-[#0d1117] border-slate-800 text-white" : "bg-white shadow-xl text-slate-900"}`}>
        <div className="flex items-center gap-4 mb-10 text-amber-500">
          <div className="p-3 bg-amber-500/10 rounded-2xl"><FaUserSecret size={22} /></div>
          <h3 className="text-xl font-black italic tracking-tighter uppercase">Security Nodes</h3>
        </div>
        <div className="space-y-8">
          <ToggleItem 
            label="Biometric Bypass" 
            desc="Enable fingerprint/face ID for rapid login"
            active={security.biometric} 
            onToggle={() => handleToggle('security', 'biometric')}
          />
          <ToggleItem 
            label="Stealth Mode" 
            desc="Hide sensitive revenue data in overview"
            active={security.stealth} 
            onToggle={() => handleToggle('security', 'stealth')}
          />
          <button className="w-full py-5 bg-amber-500 text-slate-900 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer">
            Regenerate Master Key
          </button>
        </div>
      </div>

      {/* SECTION 2: SYSTEM NOTIFICATIONS */}
      <div className={`p-8 sm:p-10 rounded-[2.5rem] border ${isDarkMode ? "bg-[#0d1117] border-slate-800 text-white" : "bg-white shadow-xl text-slate-900"}`}>
        <div className="flex items-center gap-4 mb-10 text-blue-500">
          <div className="p-3 bg-blue-500/10 rounded-2xl"><FaBell size={22} /></div>
          <h3 className="text-xl font-black italic tracking-tighter uppercase">Alert System</h3>
        </div>
        <div className="space-y-8">
          <ToggleItem 
            label="Order Webhooks" 
            desc="Push notifications for new transactions"
            active={notifications.orders} 
            onToggle={() => handleToggle('notifications', 'orders')}
          />
          <ToggleItem 
            label="Server Heartbeat" 
            desc="Alert when system load exceeds 80%"
            active={notifications.system} 
            onToggle={() => handleToggle('notifications', 'system')}
          />
          <div className="p-6 rounded-2xl border border-dashed border-slate-800/20 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-500">Connection Status</p>
              <p className="text-xs font-bold text-emerald-500">Encrypted / Stable</p>
            </div>
            <FaGlobe className="text-slate-800 opacity-20" size={30} />
          </div>
        </div>
      </div>

      {/* SECTION 3: BRANDING & UI (Full Width) */}
      <div className={`xl:col-span-2 p-8 sm:p-10 rounded-[2.5rem] border ${isDarkMode ? "bg-[#0d1117] border-slate-800 text-white" : "bg-white shadow-xl text-slate-900"}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4 text-emerald-500">
            <div className="p-3 bg-emerald-500/10 rounded-2xl"><FaPalette size={22} /></div>
            <h3 className="text-xl font-black italic tracking-tighter uppercase">Global Branding</h3>
          </div>
          <button 
            onClick={saveSettings}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest cursor-pointer hover:bg-emerald-400 transition-colors"
          >
            <FaSave /> Save Configuration
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2 mb-2 block">Terminal Brand Name</label>
            <input 
              type="text" 
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className={`w-full p-5 rounded-2xl font-black italic text-lg border outline-none transition-all ${isDarkMode ? "bg-slate-900 border-slate-800 text-amber-500 focus:border-amber-500/50" : "bg-slate-50 border-slate-200"}`}
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2 mb-2 block">Interface Language</label>
            <select className={`w-full p-5 rounded-2xl font-black uppercase text-xs border outline-none transition-all ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200"}`}>
              <option>English (Global)</option>
              <option>Bengali (Region)</option>
              <option>Arabic (Middle East)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

// Toggle Sub-Component
const ToggleItem = ({ label, desc, active, onToggle }) => (
  <div className="flex justify-between items-center group">
    <div className="cursor-default">
      <p className="font-black group-hover:text-amber-500 transition-colors text-sm uppercase tracking-tighter">{label}</p>
      <p className="text-[10px] text-slate-500 font-bold opacity-60">{desc}</p>
    </div>
    <div 
      onClick={onToggle}
      className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${active ? 'bg-amber-500' : 'bg-slate-800'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 ${active ? 'right-1' : 'left-1'}`} />
    </div>
  </div>
);

export default Settings;