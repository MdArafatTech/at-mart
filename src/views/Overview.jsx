import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingBag, FaUsers, FaChartLine, FaWallet, FaChevronRight, FaDatabase } from "react-icons/fa";
import { motion } from 'framer-motion';
// FIREBASE IMPORT
import { db } from '../firebase/Firebase'; 
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const Overview = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRevenue: "0",
    activeOrders: 0,
    customerCount: 0,
    recentActivity: [],
    rawOrders: [],
    isSyncing: true
  });

  // --- REAL-TIME CLOUD LISTENER ---
  useEffect(() => {
    // We point this to 'orders' to match your PaymentPage commitment logic
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const savedOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // 1. Calculate Revenue (Handles the totalAmount field from PaymentPage)
      const revenue = savedOrders.reduce((acc, order) => acc + (Number(order.totalAmount || order.total) || 0), 0);
      
      // 2. Active Orders (Filters for non-finalized states)
      const active = savedOrders.filter(o => ["Pending", "Verified", "Shipped"].includes(o.status)).length;
      
      // 3. Unique Customers based on Email
      const uniqueCustomers = [...new Set(savedOrders.map(o => o.customerEmail))].filter(Boolean).length;

      // 4. Graph Data Processing
      // We take the last 12 orders, calculate their relative height for the CSS bars
      const last12 = [...savedOrders].slice(0, 12).reverse();
      const maxVal = Math.max(...last12.map(o => Number(o.totalAmount || o.total)), 100);
      
      const graphData = last12.map(o => ({
        height: ((Number(o.totalAmount || o.total) || 0) / maxVal) * 100,
        val: (o.totalAmount || o.total),
        id: o.id
      }));

      setStats({
        totalRevenue: revenue.toLocaleString(),
        activeOrders: active,
        customerCount: uniqueCustomers,
        recentActivity: graphData,
        rawOrders: savedOrders.slice(0, 5), // Show top 5 newest
        isSyncing: false
      });
    }, (error) => {
      console.error("Pulse Error:", error);
      setStats(prev => ({ ...prev, isSyncing: false }));
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-4xl font-black italic tracking-tighter uppercase ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Admin <span className="text-amber-500">Pulse</span>
          </h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full animate-pulse ${stats.isSyncing ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            {stats.isSyncing ? "Establishing Link..." : "Cloud Infrastructure Live"}
          </p>
        </div>
        <div className={`hidden md:flex items-center gap-4 px-6 py-3 rounded-2xl border ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-100 shadow-sm"}`}>
            <FaDatabase className="text-amber-500 text-xs" />
            <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Firestore Node: Active</span>
        </div>
      </div>

      {/* 1. STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
         <StatCard label="Total Revenue" val={`$${stats.totalRevenue}`} trend="Global" icon={<FaWallet />} color="amber" isDarkMode={isDarkMode} />
         <StatCard label="Live Orders" val={stats.activeOrders} trend="Processing" icon={<FaShoppingBag />} color="blue" isDarkMode={isDarkMode} />
         <StatCard label="Total Clients" val={stats.customerCount} trend="Sync" icon={<FaUsers />} color="emerald" isDarkMode={isDarkMode} />
         <StatCard label="Uptime" val="99.9%" trend="Stable" icon={<FaChartLine />} color="rose" isDarkMode={isDarkMode} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* 2. REVENUE GRAPH */}
        <div className={`xl:col-span-2 p-10 rounded-[2.5rem] border ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white shadow-xl border-transparent"}`}>
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Transaction Stream (Live)</h3>
              <div className="flex gap-2 text-emerald-500">
                <span className="text-[9px] font-black uppercase italic animate-pulse">Receiving Data...</span>
              </div>
            </div>

            <div className="flex items-end gap-2 lg:gap-4 h-64 px-2">
              {stats.recentActivity.length > 0 ? stats.recentActivity.map((data, i) => (
                <motion.div 
                  key={data.id || i}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(data.height, 5)}%` }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="flex-1 bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-xl opacity-80 hover:opacity-100 transition-all cursor-crosshair relative group"
                >
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-[10px] font-black p-2 bg-black text-white rounded-xl opacity-0 group-hover:opacity-100 z-10 whitespace-nowrap shadow-2xl border border-amber-500/30">
                      ${data.val}
                    </div>
                </motion.div>
              )) : (
                <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-slate-800/20 rounded-3xl text-slate-500 font-black uppercase tracking-widest text-[10px]">
                  Waiting for Incoming Transmissions...
                </div>
              )}
            </div>
        </div>

        {/* 3. RECENT ORDERS LOG */}
        <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white shadow-xl border-transparent"}`}>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Latest Traffic</h3>
            <button onClick={() => navigate('/orders')} className="text-amber-500 hover:text-amber-400 text-[9px] font-black uppercase italic transition-colors">Manage All</button>
          </div>

          <div className="space-y-6">
            {stats.rawOrders.length > 0 ? (
              stats.rawOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between group cursor-pointer" onClick={() => navigate(`/ordertracking/${order.orderId}`)}>
                  <div className="flex items-center gap-4">
                    <div className={`w-1 h-10 rounded-full transition-all group-hover:w-2 ${
                      order.status === 'Delivered' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 
                      order.status === 'Shipped' ? 'bg-blue-500' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                    }`} />
                    <div className="max-w-[120px]">
                      <p className="text-[11px] font-black uppercase italic leading-none group-hover:text-amber-500 transition-colors truncate">{order.orderId}</p>
                      <p className="text-[9px] text-slate-500 font-bold mt-1.5 uppercase truncate">{order.customerName || "Agent"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black tracking-tighter text-amber-500">${order.totalAmount || order.total}</p>
                    <p className={`text-[7px] uppercase font-black px-2 py-0.5 rounded-md mt-1 inline-block ${
                      isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
                    }`}>{order.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center opacity-30 italic text-[10px] uppercase font-black">Scanning Frequency...</div>
            )}
          </div>

          <button 
            onClick={() => navigate('/orders')}
            className={`w-full mt-10 py-5 transition-all cursor-pointer rounded-[1.5rem] flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] group border-2 ${
              isDarkMode 
              ? "bg-slate-800/20 border-slate-800 text-slate-400 hover:bg-amber-500 hover:text-slate-900 hover:border-amber-500" 
              : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-amber-500 hover:text-white hover:border-amber-500"
            }`}
          >
            Terminal Access <FaChevronRight className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, val, trend, color, icon, isDarkMode }) => {
  const colorMap = {
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    rose: "text-rose-500 bg-rose-500/10 border-rose-500/20"
  };

  return (
    <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 group relative overflow-hidden ${
      isDarkMode 
      ? "bg-[#0d1117] border-slate-800 hover:border-amber-500/30" 
      : "bg-white shadow-xl hover:shadow-amber-500/10"
    }`}>
      <div className={`absolute -right-4 -bottom-4 text-7xl opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-110 transition-all duration-700 text-${color}-500`}>
        {icon}
      </div>
      <div className="flex justify-between items-start mb-6 relative z-10">
        <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl border uppercase tracking-tighter ${colorMap[color]}`}>
          {trend}
        </span>
        <div className={`p-3 rounded-xl bg-slate-800/10 ${isDarkMode ? "text-slate-500" : "text-slate-400"} group-hover:text-amber-500 transition-colors`}>
          {icon}
        </div>
      </div>
      <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] relative z-10">{label}</p>
      <h3 className="text-4xl font-black tracking-tighter mt-2 relative z-10">{val}</h3>
    </div>
  );
};

export default Overview;