import React from 'react';
import { FaBars, FaSun, FaMoon, FaCircle } from "react-icons/fa";

const Header = ({ activeView, setSidebarOpen, isDarkMode, toggleTheme }) => {
  return (
    <header className={`h-20 lg:h-24 px-6 lg:px-8 border-b flex items-center justify-between sticky top-0 z-40 backdrop-blur-md ${isDarkMode ? "bg-[#05070a]/70 border-slate-800" : "bg-white/70 border-slate-200"}`}>
      <div className="flex items-center gap-4 lg:gap-6">
        <button className="lg:hidden p-2 text-2xl cursor-pointer" onClick={() => setSidebarOpen(true)}><FaBars /></button>
        <h2 className="text-lg lg:text-xl font-black italic tracking-tight capitalize">{activeView}</h2>
      </div>
      
      <div className="flex items-center gap-3 lg:gap-4">
        <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-100 text-emerald-700'}`}>
          <FaCircle className="animate-pulse text-[8px]" /> Server: Online
        </div>
        <button onClick={toggleTheme} className={`p-2.5 lg:p-3 rounded-2xl transition-all cursor-pointer ${isDarkMode ? "bg-slate-800 text-amber-400 hover:bg-slate-700" : "bg-slate-100 text-slate-500 shadow-sm hover:bg-slate-200"}`}>
          {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
        </button>
        <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center font-black text-white shadow-xl cursor-pointer hover:rotate-6 transition-transform">A</div>
      </div>
    </header>
  );
};

export default Header;