import React, { useState, useEffect } from 'react';
import { auth, db } from "../firebase/Firebase";
import { useAuth } from "../provider/AuthProvider";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { 
  reauthenticateWithCredential, 
  EmailAuthProvider, 
  updatePassword 
} from "firebase/auth";
import { 
  FaShieldAlt, FaKey, FaSpinner, FaCheckCircle, 
  FaExclamationTriangle, FaPalette, FaFingerprint, FaGlobe
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Settings = ({ isDarkMode }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // 1. Unified State for Settings (Loaded from Firestore)
  const [config, setConfig] = useState({
    customUserID: "ADMIN_ALPHA", 
    biometric: true,
    stealth: false,
    orderNotifications: true,
    systemAlerts: false,
    brandName: "AtShop Terminal",
    language: "English (Global)",
    region: "Asia (Singapore)",
    twoFactor: false
  });

  // 2. State for Security Protocol Updates
  const [securityForm, setSecurityForm] = useState({ 
    currentKey: '', 
    newKey: '', 
    newAdminID: '' 
  });
  const [securityStatus, setSecurityStatus] = useState({ type: '', msg: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  // Load Settings from Firebase
  useEffect(() => {
    if (!currentUser) return;
    const userRef = doc(db, "userSettings", currentUser.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setConfig(docSnap.data());
      } else {
        // Initialize if first time
        setDoc(userRef, config);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentUser]);

  // Universal Toggle/Update Handler for general settings
  const updateSetting = async (key, value) => {
    if (!currentUser) return;
    setIsSyncing(true);
    const userRef = doc(db, "userSettings", currentUser.uid);
    try {
      await updateDoc(userRef, { [key]: value });
    } catch (err) {
      console.error("Sync Error:", err);
    } finally {
      setTimeout(() => setIsSyncing(false), 800);
    }
  };

  // --- MASTER SECURITY PROTOCOL HANDLER ---
  const handleGlobalSecurityUpdate = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setSecurityStatus({ type: '', msg: '' });

    // 1. Re-authentication Credential
    const credential = EmailAuthProvider.credential(currentUser.email, securityForm.currentKey);

    try {
      // Step A: Re-authenticate current session
      await reauthenticateWithCredential(currentUser, credential);
      
      const userRef = doc(db, "userSettings", currentUser.uid);
      const updatePayload = {};

      // Step B: Update Custom Admin ID if changed
      if (securityForm.newAdminID && securityForm.newAdminID !== config.customUserID) {
        updatePayload.customUserID = securityForm.newAdminID;
      }

      // Step C: Update Master Key (Password) if provided
      if (securityForm.newKey) {
        await updatePassword(currentUser, securityForm.newKey);
      }

      // Final Step: Push ID changes to Firestore
      if (Object.keys(updatePayload).length > 0) {
        await updateDoc(userRef, updatePayload);
      }
      
      setSecurityStatus({ type: 'success', msg: 'SECURITY PROTOCOLS UPDATED' });
      setSecurityForm({ currentKey: '', newKey: '', newAdminID: '' });
    } catch (err) {
      let errorMsg = "PROTOCOL REJECTED";
      if (err.code === 'auth/wrong-password') errorMsg = "INVALID CURRENT KEY";
      setSecurityStatus({ type: 'error', msg: errorMsg });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="p-20 text-center font-black animate-pulse uppercase tracking-[0.5em] opacity-20">
      Accessing Secure Nodes...
    </div>
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16">
      
      {/* STATUS HEADER */}
      <div className="xl:col-span-2 flex items-center justify-between px-6 py-4 rounded-3xl bg-amber-500/5 border border-amber-500/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isSyncing ? "bg-amber-500 animate-ping" : "bg-emerald-500"}`} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
            {isSyncing ? "Writing to Master Database..." : "Encrypted Connection Stable"}
          </span>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-[9px] font-mono opacity-40 uppercase bg-slate-500/10 px-3 py-1 rounded-full">ID: {config.customUserID}</span>
        </div>
      </div>

      {/* ACCESS CONTROL SECTION (ID & Password) */}
      <div className={`p-8 sm:p-10 rounded-[2.5rem] border transition-all ${isDarkMode ? "bg-[#0d1117] border-white/5 text-white" : "bg-white shadow-xl text-slate-900"}`}>
        <div className="flex items-center gap-4 mb-10 text-rose-500">
          <div className="p-3 bg-rose-500/10 rounded-2xl"><FaShieldAlt size={22} /></div>
          <h3 className="text-xl font-black italic tracking-tighter uppercase leading-none">Access Control</h3>
        </div>
        
        <form onSubmit={handleGlobalSecurityUpdate} className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2 mb-2 block">Current Master Key</label>
            <input 
              type="password" required
              value={securityForm.currentKey}
              onChange={(e) => setSecurityForm({...securityForm, currentKey: e.target.value})}
              className={`w-full p-4 rounded-xl border outline-none font-bold text-sm transition-all ${isDarkMode ? "bg-black/40 border-slate-800 focus:border-rose-500/40" : "bg-slate-50 border-slate-200"}`}
              placeholder="Confirm identity"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2 mb-2 block">New Admin ID</label>
              <div className="relative">
                <FaFingerprint className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" />
                <input 
                  type="text" 
                  value={securityForm.newAdminID}
                  onChange={(e) => setSecurityForm({...securityForm, newAdminID: e.target.value})}
                  className={`w-full p-4 pl-10 rounded-xl border outline-none font-bold text-sm transition-all ${isDarkMode ? "bg-black/40 border-slate-800 text-amber-500 focus:border-amber-500/40" : "bg-slate-50 border-slate-200"}`}
                  placeholder={config.customUserID}
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2 mb-2 block">New Master Key</label>
              <div className="relative">
                <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" />
                <input 
                  type="password" 
                  value={securityForm.newKey}
                  onChange={(e) => setSecurityForm({...securityForm, newKey: e.target.value})}
                  className={`w-full p-4 pl-10 rounded-xl border outline-none font-bold text-sm transition-all ${isDarkMode ? "bg-black/40 border-slate-800 text-emerald-500 focus:border-emerald-500/40" : "bg-slate-50 border-slate-200"}`}
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>
          
          <button 
            disabled={isProcessing}
            className={`w-full py-5 rounded-2xl cursor-pointer font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg ${
              isDarkMode ? "bg-white text-black hover:bg-amber-500" : "bg-slate-900 text-white hover:bg-blue-600 shadow-blue-500/20"
            }`}
          >
            {isProcessing ? <FaSpinner className="animate-spin" /> : "Authorize Change"}
          </button>

          <AnimatePresence>
            {securityStatus.msg && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className={`flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest mt-2 ${securityStatus.type === 'error' ? 'text-rose-500' : 'text-emerald-500'}`}>
                {securityStatus.type === 'error' ? <FaExclamationTriangle /> : <FaCheckCircle />}
                {securityStatus.msg}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* SECURITY NODES SECTION */}
      <div className={`p-8 sm:p-10 rounded-[2.5rem] border transition-all ${isDarkMode ? "bg-[#0d1117] border-white/5 text-white" : "bg-white shadow-xl text-slate-900"}`}>
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
        </div>
      </div>

      {/* GLOBAL IDENTITY SECTION */}
      <div className={`xl:col-span-2 p-8 sm:p-10 rounded-[2.5rem] border transition-all ${isDarkMode ? "bg-[#0d1117] border-white/5 text-white" : "bg-white shadow-xl text-slate-900"}`}>
        <div className="flex items-center gap-4 text-emerald-500 mb-10">
          <div className="p-3 bg-emerald-500/10 rounded-2xl"><FaPalette size={22} /></div>
          <h3 className="text-xl font-black italic tracking-tighter uppercase leading-none">Global Identity</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2 mb-2 block">Terminal Name</label>
            <input 
              type="text" 
              value={config.brandName}
              onChange={(e) => setConfig({...config, brandName: e.target.value})}
              onBlur={(e) => updateSetting('brandName', e.target.value)}
              className={`w-full p-5 rounded-2xl font-black italic text-lg border outline-none transition-all ${isDarkMode ? "bg-black/40 border-slate-800 text-amber-500 focus:border-amber-500/50" : "bg-slate-50 border-slate-200"}`}
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2 mb-2 block">Language</label>
            <select 
              value={config.language}
              onChange={(e) => updateSetting('language', e.target.value)}
              className={`w-full p-5 rounded-2xl font-black uppercase text-xs border outline-none appearance-none cursor-pointer ${isDarkMode ? "bg-black/40 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200"}`}
            >
              <option>English (Global)</option>
              <option>Bengali (Region)</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2 mb-2 block">Data Region</label>
            <select 
              value={config.region}
              onChange={(e) => updateSetting('region', e.target.value)}
              className={`w-full p-5 rounded-2xl font-black uppercase text-xs border outline-none appearance-none cursor-pointer ${isDarkMode ? "bg-black/40 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200"}`}
            >
              <option>Asia (Singapore)</option>
              <option>North America</option>
              <option>Europe (Frankfurt)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- REUSABLE TOGGLE COMPONENT --- */
const ToggleItem = ({ label, desc, active, onToggle }) => (
  <div className="flex justify-between items-center group">
    <div>
      <p className="font-black group-hover:text-amber-500 transition-colors text-sm uppercase tracking-tighter leading-none mb-1">{label}</p>
      <p className="text-[10px] text-slate-500 font-bold opacity-60 leading-tight">{desc}</p>
    </div>
    <div 
      onClick={onToggle}
      className={`w-14 h-7 rounded-full relative cursor-pointer transition-all duration-300 ${active ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-800'}`}
    >
      <motion.div 
        animate={{ x: active ? 28 : 4 }}
        className={`absolute top-1.5 w-4 h-4 bg-white rounded-full shadow-lg`} 
      />
    </div>
  </div>
);

export default Settings;