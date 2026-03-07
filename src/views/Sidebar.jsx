import React from 'react';
import { FaShieldAlt, FaChartLine, FaShoppingBag, FaBox, FaUser, FaCog, FaDownload, FaPowerOff, FaTimes } from "react-icons/fa";

const NavItem = ({ icon, label, id, active, onClick, isDarkMode }) => (
  <div onClick={() => onClick(id)} className={`flex items-center gap-5 px-6 py-4 rounded-[1.5rem] cursor-pointer transition-all duration-300 ${
      active ? "bg-amber-500 text-slate-900 font-black shadow-2xl shadow-amber-500/30 translate-x-2" : isDarkMode ? "hover:bg-slate-800 text-slate-500 hover:text-white" : "hover:bg-slate-100 text-slate-400 hover:text-slate-900"
    }`}>
    <span className="text-xl">{icon}</span>
    <span className="text-[10px] uppercase font-black tracking-widest">{label}</span>
  </div>
);

const Sidebar = ({ isOpen, setOpen, activeView, setActiveView, isDarkMode, logout }) => {
  const menu = [
    { id: "overview", label: "Overview", icon: <FaChartLine /> },
    { id: "orders", label: "Orders", icon: <FaShoppingBag /> },

    { id: "customers", label: "Customers", icon: <FaUser /> },
    { id: "settings", label: "Settings", icon: <FaCog /> },
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-[70] w-72 transform transition-transform duration-300 lg:translate-x-0 lg:static ${isOpen ? "translate-x-0" : "-translate-x-full"} ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white border-slate-200"} border-r flex flex-col shadow-2xl`}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-amber-500 p-2.5 rounded-2xl text-slate-900 shadow-lg shadow-amber-500/20"><FaShieldAlt size={22}/></div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase">AT-mart</h1>
          </div>
          <button className="lg:hidden p-2 text-slate-500" onClick={() => setOpen(false)}><FaTimes /></button>
        </div>
        
        <nav className="flex-1 px-6 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          {menu.map(item => (
            <NavItem key={item.id} {...item} active={activeView === item.id} onClick={(id) => {setActiveView(id); setOpen(false);}} isDarkMode={isDarkMode} />
          ))}
        </nav>

        <div className="p-6 mt-auto space-y-3">
          <button className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-amber-500 text-slate-900 font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all cursor-pointer shadow-lg shadow-amber-500/20">
            <FaDownload /> Export PDF
          </button>
          <button onClick={logout} className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-rose-500/10 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 cursor-pointer">
            <FaPowerOff /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;