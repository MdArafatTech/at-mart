import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaBoxOpen, FaTruckLoading, FaSearch, FaCheckDouble, 
  FaCheckCircle, FaSpinner, FaMicrochip, FaHistory,
  FaSatellite, FaHashtag, FaEnvelope, FaLayerGroup, FaLock
} from "react-icons/fa";

import { useTheme } from "../context/ThemeContext";
import { db, auth } from "../firebase/Firebase"; 
import { onAuthStateChanged } from "firebase/auth";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  serverTimestamp, 
  query, 
  where, 
  orderBy 
} from "firebase/firestore";

const steps = [
  { id: "pending", label: "PENDING", icon: <FaBoxOpen /> },
  { id: "authorized", label: "SHIPPING", icon: <FaTruckLoading /> },
  { id: "inspected", label: "INSPECTION", icon: <FaSearch /> },
  { id: "resolved", label: "RESOLVED", icon: <FaCheckDouble /> },
];

const StatusIcons = ({ status }) => {
  const currentStepIndex = steps.findIndex(s => s.id === status);
  return (
    <div className="flex items-center justify-between w-full pt-4 relative">
      <div className="absolute top-[38px] left-0 w-full h-[2px] z-0 bg-gray-200 dark:bg-zinc-800" />
      {steps.map((step, index) => {
        const isActive = index <= currentStepIndex;
        const isCurrent = index === currentStepIndex;
        return (
          <div key={step.id} className="flex flex-col items-center relative z-10">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm transition-all duration-500 border-2 ${
              isActive 
                ? "bg-amber-500 border-amber-400 text-black shadow-lg shadow-amber-500/30" 
                : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-400 dark:text-zinc-600"
            } ${isCurrent && isActive ? "animate-pulse scale-110" : ""}`}>
              {isActive && index < currentStepIndex ? <FaCheckCircle className="text-base" /> : step.icon}
            </div>
            <span className={`text-[7px] font-black mt-2 tracking-widest uppercase ${
              isActive ? "text-amber-500" : "text-gray-400 dark:text-zinc-50"
            }`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const ReturnRequestPage = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeReturns, setActiveReturns] = useState([]);
  const [formData, setFormData] = useState({ 
    orderId: "", productName: "", reason: "", qty: "1", email: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        setFormData(prev => ({ ...prev, email: currentUser.email || "" }));
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Real-time Subscription to User's specific returns
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "returns"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setActiveReturns(docs);
    }, (error) => {
      console.error("Firestore Error:", error);
    });

    return () => unsub();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "returns"), {
        ...formData,
        userId: user.uid,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setFormData({ orderId: "", productName: "", reason: "", qty: "1", email: user.email || "" });
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- LOADING STATE ---
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <FaSpinner className="animate-spin text-amber-500 text-3xl" />
      </div>
    );
  }

  // --- UNAUTHORIZED STATE ---
  if (!user) return (
    <div className={`min-h-screen flex flex-col items-center justify-center font-mono p-6 overflow-hidden transition-all duration-700 ${
      darkMode 
        ? "bg-base-500 text-base-content" 
        : "bg-base-700 text-base-contentslate-900"
    }`}>
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20" 
        style={{ 
          backgroundImage: `radial-gradient(circle at 2px 2px, ${darkMode ? '#333' : '#ccc'} 1px, transparent 0)`, 
          backgroundSize: '40px 40px' 
        }}
      />

      {/* Central Console */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full">
        
        {/* Scanning Radar Effect */}
        <div className="relative mb-12">
          <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping"></div>
          <div className="absolute inset-0 rounded-full border border-amber-500/30 animate-pulse scale-150"></div>
          <div className={`relative p-10 rounded-full border-2 ${
            darkMode 
              ? "bg-[#0a0a0a] border-white/10 shadow-2xl shadow-white/5" 
              : "bg-white border-slate-200 shadow-2xl"
          }`}>
            <FaLock className={`text-6xl ${darkMode ? "text-amber-400" : "text-amber-500"}`} />
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="h-[2px] w-8 bg-amber-500/40"></span>
            <p className={`text-[10px] font-black uppercase tracking-[0.5em] ${
              darkMode ? "text-amber-400" : "text-amber-500"
            }`}>
              System Protected
            </p>
            <span className="h-[2px] w-8 bg-amber-500/40"></span>
          </div>
          
          <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none text-slate-900 dark:text-white">
            Access <span className="text-amber-500">Denied</span>
          </h2>
          
          <p className={`text-[11px] max-w-[280px] mx-auto uppercase font-bold leading-relaxed tracking-widest opacity-80 ${
            darkMode ? "text-zinc-400" : "text-gray-500"
          }`}>
            Unauthorized biometric signature detected. Please verify your identity via the main terminal gateway.
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-12 w-full flex flex-col items-center gap-6">
          <button 
            onClick={() => navigate('/login')}
            className="group relative w-full py-5 bg-amber-500 hover:bg-amber-600 text-black font-black uppercase text-xs tracking-[0.3em] rounded-2xl overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(245,158,11,0.3)]"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            <span className="relative z-10 flex items-center justify-center gap-3">
              login Terminal
            </span>
          </button>

          <div className="flex justify-between w-full px-2 opacity-70 text-[9px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
              <span className={darkMode ? "text-zinc-400" : "text-gray-500"}>Node: 09-DHAKA</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={darkMode ? "text-zinc-400" : "text-gray-500"}>SSL:</span>
              SECURE
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-amber-500/20 rounded-tl-3xl"></div>
      <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-amber-500/20 rounded-br-3xl"></div>
    </div>
  );

  // --- AUTHORIZED DASHBOARD (FIXED LAYOUT) ---
return (
  <div className="flex p-10  flex-col min-h-screen bg-white dark:bg-black font-mono">
    {/* Header - Now scrolls away with the page */}



<div className="w-full max-w-7xl mx-auto px-4 py-6">
  <div className="flex flex-col md:flex-row justify-between items-center gap-6">
    
    {/* Left Side: Logo and Status */}
    <div className="flex items-center gap-4 w-full md:w-auto">
      <div className="shrink-0 p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300">
        <FaSatellite className="text-black text-2xl" />
      </div>
      
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-black tracking-[-0.05em] uppercase italic leading-tight text-black dark:text-white">
          AT-mart
        </h1>
        <div className="flex flex-wrap items-center gap-3 mt-1">
          <span className="flex items-center gap-1.5 text-[9px] font-black text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg uppercase tracking-widest border border-amber-500/20 shadow-sm">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
            System Live
          </span>
          <span className="text-[9px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-[2px] truncate max-w-[150px]">
            USER: {user.email?.split('@')[0] || 'Loading...'}
          </span>
        </div>
      </div>
    </div>

    {/* Right Side: Active Logs Card */}
    <div className="w-full md:w-auto">
      <div className="relative overflow-hidden px-8 py-4 md:px-6 md:py-3 rounded-2xl border-2 border-gray-100 dark:border-zinc-800/60 bg-gradient-to-r from-gray-50/80 to-white/80 dark:from-zinc-900/60 dark:to-zinc-950/60 backdrop-blur-sm text-center shadow-sm hover:shadow-md transition-all duration-300 group">
        <p className="text-[10px] md:text-[8px] font-black text-amber-500 uppercase tracking-[2px] mb-1 group-hover:translate-y-[-1px] transition-transform">
          Active Return Logs
        </p>
        <p className="text-3xl md:text-xl font-black text-black dark:text-white leading-none group-hover:scale-105 transition-transform">
          {activeReturns.length}
        </p>
        {/* Decorative Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </div>

  </div>
</div>









    {/* Content Area - Removed overflow-auto so the whole window scrolls */}
    <div className="px-6 pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 pt-8">
          
          {/* Left Column: Form (Sticky to screen top) */}
          <div className="lg:col-span-4">
            <div className="p-8 rounded-[2.5rem] border transition-all duration-500 bg-gray-50 dark:bg-zinc-900/40 border-gray-200 dark:border-zinc-800 sticky top-10">
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-xs font-black tracking-[3px] uppercase text-gray-500 dark:text-zinc-400 flex items-center gap-2">
                  <FaHashtag className="text-amber-500" /> Request Entry
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-gray-400 dark:text-zinc-500 ml-1">Serial ID</label>
                    <input 
                      value={formData.orderId} 
                      onChange={(e) => setFormData({...formData, orderId: e.target.value})} 
                      required 
                      className="w-full px-4 py-3 rounded-xl border bg-white dark:bg-black border-gray-200 dark:border-zinc-800 text-black dark:text-amber-400 focus:border-amber-500 outline-none text-xs" 
                      placeholder="ORD-X" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-gray-400 dark:text-zinc-500 ml-1 flex items-center gap-1"><FaLayerGroup /> Qty</label>
                    <input 
                      type="number" 
                      value={formData.qty} 
                      onChange={(e) => setFormData({...formData, qty: e.target.value})} 
                      className="w-full px-4 py-3 rounded-xl border bg-white dark:bg-black border-gray-200 dark:border-zinc-800 text-black dark:text-white focus:border-amber-500 outline-none text-xs" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-gray-400 dark:text-zinc-500 ml-1">Hardware Model</label>
                  <input 
                    value={formData.productName} 
                    onChange={(e) => setFormData({...formData, productName: e.target.value})} 
                    required 
                    className="w-full px-5 py-4 rounded-xl border bg-white dark:bg-black border-gray-200 dark:border-zinc-800 text-black dark:text-white focus:border-amber-500 outline-none text-sm" 
                    placeholder="e.g. RTX 4090 GPU" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-gray-400 dark:text-zinc-500 ml-1 flex items-center gap-1"><FaEnvelope /> Contact Email</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    readOnly 
                    className="w-full px-5 py-4 rounded-xl border bg-gray-100 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-400 outline-none text-sm cursor-not-allowed" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-gray-400 dark:text-zinc-500 ml-1">Fault Description</label>
                  <textarea 
                    value={formData.reason} 
                    onChange={(e) => setFormData({...formData, reason: e.target.value})} 
                    rows={2} 
                    className="w-full px-5 py-4 rounded-xl border bg-white dark:bg-black border-gray-200 dark:border-zinc-800 text-black dark:text-white focus:border-amber-500 outline-none text-sm resize-none" 
                    placeholder="Provide technical details..." 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full py-4 cursor-pointer bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-[2px] rounded-2xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {isSubmitting ? <FaSpinner className="animate-spin" /> : "Send Request"}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: History List */}
          <div className="lg:col-span-8">
            <h3 className="flex items-center gap-3 text-2xl font-black mb-8 italic text-black dark:text-white">
              <FaHistory className="text-amber-500" /> My Return History
            </h3>

            <div className="grid gap-6">
              {activeReturns.length === 0 ? (
                <div className="border-2 border-dashed border-gray-100 dark:border-zinc-900 rounded-[2.5rem] py-20 flex flex-col items-center justify-center">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">No active hardware logs found</p>
                </div>
              ) : (
                activeReturns.map((item) => (
                  <div key={item.id} className="rounded-[2.5rem] p-8 border transition-all bg-white dark:bg-zinc-900/30 border-gray-200 dark:border-zinc-800 hover:border-amber-500/40 shadow-sm relative overflow-hidden group">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      <div className="w-24 h-24 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-black flex-shrink-0 flex items-center justify-center">
                        <FaMicrochip className="text-4xl text-gray-300 dark:text-zinc-800 group-hover:text-amber-500/40 transition-colors" />
                      </div>

                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-black text-xl uppercase italic text-black dark:text-white leading-none">{item.productName}</h4>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-[9px] font-bold text-gray-400 dark:text-zinc-600 uppercase">REF: {item.id.slice(0,8)}</span>
                              <span className="w-1 h-1 bg-gray-300 dark:bg-zinc-800 rounded-full" />
                              <span className="text-[9px] font-bold text-amber-500 uppercase">{item.qty} UNIT(S)</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                              <div className="px-4 py-1 rounded-lg text-[10px] font-black uppercase border border-amber-500/30 text-amber-500 bg-amber-500/5">
                                {item.status}
                              </div>
                              <span className="text-[8px] text-gray-400 font-bold uppercase">{new Date(item.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <StatusIcons status={item.status} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default ReturnRequestPage;