import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaGlobe, FaSearch, FaFilter, FaStar, FaShoppingBasket } from "react-icons/fa";

const Customers = ({ isDarkMode }) => {
  const [customerData, setCustomerData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // 1. Get orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");

    // 2. Group data by Customer Name
    const customerMap = savedOrders.reduce((acc, order) => {
      const name = order.customer?.fullName || "Guest User";
      
      if (!acc[name]) {
        acc[name] = {
          name,
          totalSpent: 0,
          orderCount: 0,
          lastOrder: order.date,
          email: order.customer?.email || "No Email Provided"
        };
      }

      acc[name].totalSpent += Number(order.total) || 0;
      acc[name].orderCount += 1;
      // Keep the most recent date
      if (new Date(order.date) > new Date(acc[name].lastOrder)) {
        acc[name].lastOrder = order.date;
      }

      return acc;
    }, {});

    // 3. Convert map to array and assign Status based on spending
    const finalData = Object.values(customerMap).map(c => ({
      ...c,
      status: c.totalSpent > 5000 ? "Premium" : c.orderCount > 2 ? "Regular" : "New Client"
    }));

    setCustomerData(finalData);
  }, []);

  // Filter logic
  const filteredCustomers = customerData.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in slide-in-from-right-10 duration-500 pb-12">
      
      {/* DYNAMIC CUSTOMER LIST */}
      <div className="xl:col-span-2 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Live Client Database</h3>
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search clients..." 
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full p-3 pl-10 rounded-2xl text-[10px] font-black outline-none border transition-all ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-white focus:border-amber-500" : "bg-white border-slate-200"
              }`}
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
          </div>
        </div>

        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((user, idx) => (
            <div 
              key={idx} 
              className={`p-5 rounded-[2rem] border flex flex-col sm:flex-row sm:items-center justify-between group transition-all hover:translate-x-2 gap-4 ${
                isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white shadow-md border-transparent hover:shadow-xl"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center font-black text-white shadow-lg ${
                   user.status === 'Premium' ? 'bg-gradient-to-tr from-amber-500 to-orange-600' : 'bg-slate-700'
                }`}>
                  {user.name[0]}
                </div>
                <div>
                  <p className="font-black group-hover:text-amber-500 transition-colors uppercase text-sm tracking-tight flex items-center gap-2">
                    {user.name} 
                    {user.status === 'Premium' && <FaStar className="text-amber-500 text-[10px]" />}
                  </p>
                  <p className="text-[9px] text-slate-500 font-bold lowercase opacity-60 mb-1">{user.email}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] px-2 py-0.5 rounded font-black uppercase ${
                      user.status === 'Premium' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {user.status}
                    </span>
                    <span className="text-[8px] text-slate-500 font-black uppercase">Last Active: {new Date(user.lastOrder).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-800/10">
                <div className="text-left sm:text-right">
                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Total Value</p>
                   <p className="text-lg font-black italic text-amber-500 leading-tight">${user.totalSpent.toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                   <button className="p-3 bg-amber-500/10 text-amber-500 rounded-xl hover:bg-amber-500 hover:text-white transition-all cursor-pointer">
                     <FaEdit size={12} />
                   </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center opacity-20 font-black uppercase tracking-[0.4em]">No matching clients found</div>
        )}
      </div>

      {/* DYNAMIC SIDEBAR STATS */}
      <div className="space-y-6">
        <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-[#0d1117] border-slate-800' : 'bg-white shadow-xl'}`}>
           <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500"><FaGlobe size={24} /></div>
              <h3 className="text-xl font-black italic tracking-tighter">Market Penetration</h3>
           </div>
           
           <div className="space-y-8">
              <RegionStat label="Active Retention" val="78%" color="amber" />
              <RegionStat label="New Acquisition" val="22%" color="emerald" />
              <RegionStat label="Churn Rate" val="4%" color="rose" />
           </div>
        </div>

        <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? 'bg-amber-500 text-slate-900 border-transparent' : 'bg-slate-900 text-white'}`}>
           <FaShoppingBasket size={30} className="mb-4 opacity-50" />
           <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Database Capacity</p>
           <h4 className="text-2xl font-black italic mb-4">{customerData.length} Registered Nodes</h4>
           <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
             <div className="h-full bg-white w-2/3" />
           </div>
        </div>
      </div>
    </div>
  );
};

const RegionStat = ({ label, val, color }) => (
  <div className="cursor-pointer group">
    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
      <span className="text-slate-500">{label}</span>
      <span className={`text-${color}-500`}>{val}</span>
    </div>
    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <div 
        className={`h-full bg-${color}-500 transition-all duration-1000 group-hover:opacity-80`} 
        style={{ width: val }} 
      />
    </div>
  </div>
);

export default Customers;