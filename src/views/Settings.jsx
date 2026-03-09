import React, { useState, useEffect } from 'react';
import { db } from "../firebase/Firebase";
import { useAuth } from "../provider/AuthProvider";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { 
  FaUserSecret, FaBell, FaGlobe, FaPalette, 
  FaSave, FaShieldAlt, FaServer, FaCloudUploadAlt 
} from "react-icons/fa";

const Settings = ({ isDarkMode }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // 1. State for all settings
  const [config, setConfig] = useState({
    biometric: true,
    stealth: false,
    orderNotifications: true,
    systemAlerts: false,
    brandName: "AT-mart",
    language: "English (Global)",
    region: "North America",
    twoFactor: false
  });

  // 2. Load Settings from Firebase on Mount
  useEffect(() => {
    if (!currentUser) return;

    const userRef = doc(db, "userSettings", currentUser.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setConfig(docSnap.data());
      } else {
        // Initialize default settings in Firebase if first time
        setDoc(userRef, config);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 3. Universal Toggle/Update Handler
  const updateSetting = async (key, value) => {
    if (!currentUser) return;
    setIsSyncing(true);
    
    const userRef = doc(db, "userSettings", currentUser.uid);
    try {
      await updateDoc(userRef, { [key]: value });
      // Logic for specific actions (e.g., changing brand name globally)
    } catch (err) {
      console.error("Master Sync Error:", err);
    } finally {
      setTimeout(() => setIsSyncing(false), 800);
    }
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse uppercase tracking-[0.5em] opacity-20">Accessing Data Nodes...</div>;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16">
      
      {/* STATUS BAR */}
      <div className="xl:col-span-2 flex items-center justify-between px-6 py-3 rounded-2xl bg-amber-500/5 border border-amber-500/10">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isSyncing ? "bg-amber-500 animate-ping" : "bg-emerald-500"}`} />
          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
            {isSyncing ? "Syncing with Master Database..." : "System Synced & Secure"}
          </span>
        </div>
        <span className="text-[9px] font-mono opacity-40 uppercase">Node: {currentUser?.uid.slice(0, 8)}</span>
      </div>

      {/* SECTION 1: SECURITY PROTOCOLS */}
      <div className={`p-8 sm:p-10 rounded-[2.5rem] border transition-all ${isDarkMode ? "bg-[#0d1117] border-slate-800 text-white" : "bg-white shadow-xl text-slate-900"}`}>
        <div className="flex items-center gap-4 mb-10 text-amber-500">
          <div className="p-3 bg-amber-500/10 rounded-2xl"><FaShieldAlt size={22} /></div>
          <h3 className="text-xl font-black italic tracking-tighter uppercase leading-none">Security Nodes</h3>
        </div>
        <div className="space-y-8">
          <ToggleItem 
            label="Biometric Bypass" 
            desc="Enable fingerprint/face ID for rapid login"
            active={config.biometric} 
            onToggle={() => updateSetting('biometric', !config.biometric)}
          />
          <ToggleItem 
            label="Stealth Mode" 
            desc="Hide sensitive revenue data in overview"
            active={config.stealth} 
            onToggle={() => updateSetting('stealth', !config.stealth)}
          />
          <ToggleItem 
            label="Two-Factor Auth" 
            desc="Require mobile confirmation for orders"
            active={config.twoFactor} 
            onToggle={() => updateSetting('twoFactor', !config.twoFactor)}
          />
          <button className="w-full py-5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all cursor-pointer">
            Regenerate Encryption Keys
          </button>
        </div>
      </div>

      {/* SECTION 2: ALERT SYSTEM */}
      <div className={`p-8 sm:p-10 rounded-[2.5rem] border transition-all ${isDarkMode ? "bg-[#0d1117] border-slate-800 text-white" : "bg-white shadow-xl text-slate-900"}`}>
        <div className="flex items-center gap-4 mb-10 text-blue-500">
          <div className="p-3 bg-blue-500/10 rounded-2xl"><FaBell size={22} /></div>
          <h3 className="text-xl font-black italic tracking-tighter uppercase leading-none">Alert System</h3>
        </div>
        <div className="space-y-8">
          <ToggleItem 
            label="Order Webhooks" 
            desc="Push notifications for new transactions"
            active={config.orderNotifications} 
            onToggle={() => updateSetting('orderNotifications', !config.orderNotifications)}
          />
          <ToggleItem 
            label="Server Heartbeat" 
            desc="Alert when system load exceeds 80%"
            active={config.systemAlerts} 
            onToggle={() => updateSetting('systemAlerts', !config.systemAlerts)}
          />
          <div className="p-6 rounded-2xl border border-dashed border-slate-800/20 flex items-center justify-between bg-slate-500/5">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-500 mb-1 leading-none">Connection</p>
              <p className="text-xs font-bold text-emerald-500">Encrypted AES-256</p>
            </div>
            <FaGlobe className="text-slate-800 opacity-20 animate-spin-slow" size={30} />
          </div>
        </div>
      </div>

      {/* SECTION 3: GLOBAL BRANDING */}
      <div className={`xl:col-span-2 p-8 sm:p-10 rounded-[2.5rem] border transition-all ${isDarkMode ? "bg-[#0d1117] border-slate-800 text-white" : "bg-white shadow-xl text-slate-900"}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4 text-emerald-500">
            <div className="p-3 bg-emerald-500/10 rounded-2xl"><FaPalette size={22} /></div>
            <h3 className="text-xl font-black italic tracking-tighter uppercase leading-none">Global Identity</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2 mb-2 block">Terminal Name</label>
            <input 
              type="text" 
              value={config.brandName}
              onChange={(e) => updateSetting('brandName', e.target.value)}
              placeholder="e.g. AT-MART"
              className={`w-full p-5 rounded-2xl font-black italic text-lg border outline-none transition-all ${isDarkMode ? "bg-slate-900 border-slate-800 text-amber-500 focus:border-amber-500/50" : "bg-slate-50 border-slate-200"}`}
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2 mb-2 block">Interface Language</label>
            <select 
              value={config.language}
              onChange={(e) => updateSetting('language', e.target.value)}
              className={`w-full p-5 rounded-2xl font-black uppercase text-xs border outline-none cursor-pointer ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200"}`}
            >
              <option>English (Global)</option>
              <option>Bengali (Region)</option>
              <option>Arabic (Middle East)</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2 mb-2 block">Data Region</label>
            <select 
              value={config.region}
              onChange={(e) => updateSetting('region', e.target.value)}
              className={`w-full p-5 rounded-2xl font-black uppercase text-xs border outline-none cursor-pointer ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200"}`}
            >
              <option>North America</option>
              <option>Europe (Frankfurt)</option>
              <option>Asia (Singapore)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- MINI COMPONENTS --- */

const ToggleItem = ({ label, desc, active, onToggle }) => (
  <div className="flex justify-between items-center group">
    <div className="cursor-default">
      <p className="font-black group-hover:text-amber-500 transition-colors text-sm uppercase tracking-tighter leading-none mb-1">{label}</p>
      <p className="text-[10px] text-slate-500 font-bold opacity-60 leading-tight">{desc}</p>
    </div>
    <div 
      onClick={onToggle}
      className={`w-14 h-7 rounded-full relative cursor-pointer transition-all duration-300 ${active ? 'bg-emerald-500' : 'bg-slate-800'}`}
    >
      <div className={`absolute top-1.5 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-500 ${active ? 'right-1.5 bg-white' : 'left-1.5 bg-slate-400'}`} />
    </div>
  </div>
);

export default Settings;