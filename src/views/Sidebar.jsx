import React, { useState, useEffect } from 'react';
import { db, auth } from "../firebase/Firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { 
  FaShieldAlt, FaChartLine, FaShoppingBag, 
  FaUser, FaCog, FaPowerOff, FaTimes, 
  FaProductHunt,
  FaHdd
} from "react-icons/fa";
import { FaMessage } from 'react-icons/fa6';
import { AiFillProduct } from 'react-icons/ai';
import { GiReturnArrow } from 'react-icons/gi';

const NavItem = ({ icon, label, id, active, onClick, isDarkMode }) => (
  <div 
    onClick={() => onClick(id)} 
    className={`flex items-center gap-5 px-6 py-4 rounded-[1.5rem] cursor-pointer transition-all duration-300 group ${
      active 
        ? "bg-amber-500 text-slate-900 font-black shadow-2xl shadow-amber-500/30 translate-x-2" 
        : isDarkMode ? "hover:bg-slate-800 text-slate-500 hover:text-white" : "hover:bg-slate-100 text-slate-400 hover:text-slate-900"
    }`}
  >
    <span className={`text-xl transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`}>{icon}</span>
    <span className="text-[10px] uppercase font-black tracking-widest">{label}</span>
  </div>
);

const Sidebar = ({ isOpen, setOpen, activeView, setActiveView, isDarkMode, onLogout }) => {
  const [brandName, setBrandName] = useState("AT-MART");

  // --- 1. SYNC BRAND NAME FROM FIREBASE ---
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const settingsRef = doc(db, "userSettings", user.uid);
    const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        setBrandName(docSnap.data().brandName || "AT-MART");
      }
    });

    return () => unsubscribe();
  }, []);

  const menu = [
    { id: "overview", label: "Overview", icon: <FaChartLine /> },
    { id: "orders", label: "Orders", icon: <FaShoppingBag /> },
     { id: "return", label: "Return", icon: <GiReturnArrow/> },
    { id: "customers", label: "Customers", icon: <FaUser /> },
    { id: "adminchat", label: "Admin Chat", icon: <FaMessage /> },
    { id: "products", label: "Add Product", icon: <AiFillProduct /> },
    { id: "settings", label: "Settings", icon: <FaCog /> },
     
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm animate-in fade-in duration-300" 
          onClick={() => setOpen(false)} 
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed inset-y-0 left-0 z-[70] w-72 h-screen transform transition-all duration-500 ease-in-out lg:translate-x-0 lg:sticky top-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        ${isDarkMode ? "bg-[#0d1117] border-slate-800 text-white" : "bg-white border-slate-200"} 
        border-r flex flex-col shadow-2xl`}>
        
        {/* Brand Header */}
        <div className="p-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="bg-amber-500 w-12 h-12 flex items-center justify-center rounded-2xl text-slate-900 shadow-lg shadow-amber-500/20 font-black text-xl">
              {brandName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">{brandName}</h1>
              <span className="text-[8px] font-bold text-amber-500 uppercase tracking-[0.2em] opacity-80">Admin Terminal</span>
            </div>
          </div>
          <button className="lg:hidden p-2 text-slate-500 hover:text-amber-500 transition-colors" onClick={() => setOpen(false)}>
            <FaTimes />
          </button>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 px-6 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          <div className="mb-4 px-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] opacity-50">Main Menu</div>
          {menu.map(item => (
            <NavItem 
              key={item.id} 
              {...item} 
              active={activeView === item.id} 
              onClick={(id) => {
                setActiveView(id); 
                setOpen(false);
              }} 
              isDarkMode={isDarkMode} 
            />
          ))}
        </nav>

        {/* Footer Area / Profile Snapshot */}
        <div className="p-6 mt-auto shrink-0 space-y-4">
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100'} flex items-center gap-3`}>
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600" />
             <div className="overflow-hidden">
                <p className="text-[10px] font-black truncate uppercase">{auth.currentUser?.email?.split('@')[0] || 'Admin'}</p>
                <p className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest">Online</p>
             </div>
          </div>

          <button 
            onClick={() => {
              if(window.confirm("TERMINATE SESSION: Are you sure?")) onLogout();
            }} 
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-rose-500/10 text-rose-500 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 cursor-pointer shadow-lg shadow-rose-500/5"
          >
            <FaPowerOff /> Logout Session
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;