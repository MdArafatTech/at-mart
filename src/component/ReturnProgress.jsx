import React, { useState, useEffect } from "react";
import { 
  FaBoxOpen, FaTruckLoading, FaSearch, FaCheckDouble, 
  FaCheckCircle, FaSpinner, FaMicrochip, FaHistory,
  FaSatellite, FaSun, FaMoon, FaHashtag, FaEnvelope, FaLayerGroup
} from "react-icons/fa";

import { useTheme } from "../context/ThemeContext";
import { db, storage } from "../firebase/Firebase"; 
import { collection, addDoc, onSnapshot, serverTimestamp, query, where, documentId } from "firebase/firestore";

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
              isActive ? "text-amber-500" : "text-gray-400 dark:text-zinc-500"
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
  const { darkMode, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({ 
    orderId: "", 
    productName: "", 
    reason: "", 
    qty: "1", 
    email: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeReturns, setActiveReturns] = useState([]);
  const [rmaIds, setRmaIds] = useState(() => JSON.parse(localStorage.getItem("allRmaIds") || "[]"));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (rmaIds.length === 0) return;
    const q = query(collection(db, "returns"), where(documentId(), "in", rmaIds));
    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setActiveReturns(docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    });
    return () => unsub();
  }, [rmaIds]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, "returns"), {
        ...formData,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      const updatedIds = [...rmaIds, docRef.id];
      setRmaIds(updatedIds);
      localStorage.setItem("allRmaIds", JSON.stringify(updatedIds));
      setFormData({ orderId: "", productName: "", reason: "", qty: "1", email: "" });
    } catch (error) { console.error(error); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="min-h-screen transition-colors duration-500 font-mono py-10 px-6 bg-white dark:bg-black text-gray-900 dark:text-zinc-300">
      <div className="max-w-7xl mx-auto">
        
        {/* --- PROFESSIONAL HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b pb-8 border-gray-100 dark:border-zinc-900 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500 rounded-2xl shadow-lg shadow-amber-500/20">
                <FaSatellite className="text-black text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase italic text-black dark:text-white">AT-mart</h1>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[9px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" /> System Live
                </span>
                <span className="text-[9px] text-gray-400 dark:text-zinc-600 font-bold uppercase tracking-[2px]">Core v4.0</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex-1 md:flex-none px-6 py-2 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 text-center">
                <p className="text-[8px] font-black text-red-400 dark:text-green-300 uppercase mb-0.5">Active Logs</p>
                <p className="text-xl font-black text-red-500 dark:text-green-500 leading-none">{activeReturns.length}</p>
            </div>
            
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* --- ENHANCED INPUT TERMINAL --- */}
          <div className="lg:col-span-4">
            <div className="p-8 rounded-[2.5rem] border transition-all duration-500 bg-gray-50 dark:bg-zinc-900/40 border-gray-200 dark:border-zinc-800 sticky top-10">
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-xs font-black tracking-[3px] uppercase text-gray-500 dark:text-zinc-400 flex items-center gap-2">
                    <FaHashtag className="text-amber-500" /> Request Entry
                </h2>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase text-gray-400 dark:text-zinc-500 ml-1">Serial ID</label>
                        <input value={formData.orderId} onChange={(e) => setFormData({...formData, orderId: e.target.value})} required className="w-full px-4 py-3 rounded-xl border bg-white dark:bg-black border-gray-200 dark:border-zinc-800 text-black dark:text-amber-400 focus:border-amber-500 outline-none text-xs" placeholder="ORD-X" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase text-gray-400 dark:text-zinc-500 ml-1 flex items-center gap-1"><FaLayerGroup /> Qty</label>
                        <input type="number" value={formData.qty} onChange={(e) => setFormData({...formData, qty: e.target.value})} className="w-full px-4 py-3 rounded-xl border bg-white dark:bg-black border-gray-200 dark:border-zinc-800 text-black dark:text-white focus:border-amber-500 outline-none text-xs" />
                    </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-gray-400 dark:text-zinc-500 ml-1">Hardware Model</label>
                  <input value={formData.productName} onChange={(e) => setFormData({...formData, productName: e.target.value})} required className="w-full px-5 py-4 rounded-xl border bg-white dark:bg-black border-gray-200 dark:border-zinc-800 text-black dark:text-white focus:border-amber-500 outline-none text-sm" placeholder="e.g. RTX 4090 GPU" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-gray-400 dark:text-zinc-500 ml-1 flex items-center gap-1"><FaEnvelope /> Contact Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="w-full px-5 py-4 rounded-xl border bg-white dark:bg-black border-gray-200 dark:border-zinc-800 text-black dark:text-white focus:border-amber-500 outline-none text-sm" placeholder="support@user.com" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-gray-400 dark:text-zinc-500 ml-1">Fault Description</label>
                  <textarea value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} rows={2} className="w-full px-5 py-4 rounded-xl border bg-white dark:bg-black border-gray-200 dark:border-zinc-800 text-black dark:text-white focus:border-amber-500 outline-none text-sm resize-none" placeholder="Provide technical details..." />
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full py-4 cursor-pointer bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-[2px] rounded-2xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                  {isSubmitting ? <FaSpinner className="animate-spin" /> : "Send Request"}
                </button>
              </form>
            </div>
          </div>

          {/* --- DASHBOARD SECTION --- */}
          <div className="lg:col-span-8">
            <h3 className="flex items-center gap-3 text-2xl font-black mb-8 italic text-black dark:text-white">
              <FaHistory className="text-amber-500" /> Active Submissions
            </h3>

            <div className="grid gap-6">
              {activeReturns.map((item) => (
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
                            <span className="text-[8px] text-gray-400 font-bold uppercase">{item.email}</span>
                        </div>
                      </div>
                      <StatusIcons status={item.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReturnRequestPage;