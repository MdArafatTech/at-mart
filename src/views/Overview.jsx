import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowUp, FaShoppingBag, FaUsers, FaChartLine, FaWallet, FaChevronRight } from "react-icons/fa";

const Overview = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeOrders: 0,
    customerCount: 0,
    recentActivity: [],
    rawOrders: []
  });

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");
    
    const revenue = savedOrders.reduce((acc, order) => acc + (Number(order.total) || 0), 0);
    const active = savedOrders.filter(o => o.status === "Pending" || o.status === "Verified").length;
    const uniqueCustomers = [...new Set(savedOrders.map(o => o.customer?.fullName))].filter(Boolean).length;

    const maxOrderValue = Math.max(...savedOrders.map(o => Number(o.total)), 1000);
    const graphData = savedOrders.slice(-12).map(o => ({
      height: (Number(o.total) / maxOrderValue) * 100,
      val: o.total
    }));

    setStats({
      totalRevenue: revenue.toLocaleString(),
      activeOrders: active,
      customerCount: uniqueCustomers,
      recentActivity: graphData,
      rawOrders: savedOrders.slice(-5).reverse() // Show last 5 orders, newest first
    });
  }, []);

  return (
    <div className="animate-in fade-in duration-700 space-y-8 pb-12">
      
      {/* 1. DYNAMIC STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
         <StatCard label="Total Revenue" val={`$${stats.totalRevenue}`} trend="Live" icon={<FaWallet />} color="amber" isDarkMode={isDarkMode} />
         <StatCard label="Active Orders" val={stats.activeOrders} trend="Process" icon={<FaShoppingBag />} color="blue" isDarkMode={isDarkMode} />
         <StatCard label="Unique Clients" val={stats.customerCount} trend="Total" icon={<FaUsers />} color="emerald" isDarkMode={isDarkMode} />
         <StatCard label="Conversion" val="12.4%" trend="+2%" icon={<FaChartLine />} color="rose" isDarkMode={isDarkMode} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* 2. DYNAMIC GRAPH SECTION (Main Column) */}
        <div className={`xl:col-span-2 p-10 rounded-[2.5rem] border ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white shadow-xl border-transparent"}`}>
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Revenue Flow (Recent Orders)</h3>
              <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full uppercase">Real-time</span>
            </div>

            <div className="flex items-end gap-2 lg:gap-4 h-64">
              {stats.recentActivity.map((data, i) => (
                <div key={i} style={{ height: `${Math.max(data.height, 10)}%` }} className="flex-1 bg-gradient-to-t from-amber-600 to-amber-300 rounded-t-xl opacity-80 hover:opacity-100 transition-all cursor-pointer relative group">
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-black p-2 bg-slate-900 text-white rounded-lg opacity-0 group-hover:opacity-100 z-10">${data.val}</div>
                </div>
              ))}
            </div>
        </div>

        {/* 3. RECENT ORDERS TABLE (Side Column) */}
        <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white shadow-xl border-transparent"}`}>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Latest Logs</h3>
            <button onClick={() => navigate('/orders')} className="text-amber-500 hover:underline text-[9px] font-black uppercase italic">View All</button>
          </div>

          <div className="space-y-4">
            {stats.rawOrders.length > 0 ? (
              stats.rawOrders.map((order, idx) => (
                <div key={idx} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-8 rounded-full ${order.status === 'Shipped' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <div>
                      <p className="text-[10px] font-black uppercase italic leading-none">{order.orderId}</p>
                      <p className="text-[8px] text-slate-500 font-bold mt-1 uppercase truncate w-24">{order.customer?.fullName || "Guest"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black tracking-tighter text-amber-500">${order.total}</p>
                    <p className="text-[7px] text-slate-500 uppercase font-black">{order.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-10 text-[10px] font-black opacity-20 uppercase tracking-widest">No recent logs</p>
            )}
          </div>

          <button 
            onClick={() => navigate('/orders')}
            className="w-full mt-8 py-4 bg-slate-800/50 hover:bg-amber-500 hover:text-slate-900 transition-all rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 group"
          >
            Launch Terminal <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Internal StatCard Helper
const StatCard = ({ label, val, trend, color, icon, isDarkMode }) => (
  <div className={`p-8 rounded-[2.5rem] border transition-all hover:-translate-y-2 group ${isDarkMode ? "bg-[#0d1117] border-slate-800 hover:border-amber-500/50" : "bg-white shadow-xl hover:shadow-2xl"}`}>
    <div className="flex justify-between items-start mb-4">
      <span className={`text-[9px] font-black px-3 py-1 rounded-lg bg-${color}-500/10 text-${color}-500 group-hover:bg-amber-500 group-hover:text-white transition-colors uppercase`}>{trend}</span>
      <div className={`text-${color}-500 opacity-40 group-hover:opacity-100 transition-opacity`}>{icon}</div>
    </div>
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
    <h3 className="text-3xl font-black tracking-tighter mt-1">{val}</h3>
  </div>
);

export default Overview;