import React, { useState, useEffect } from 'react';
import { 
  FaEdit, FaGlobe, FaSearch, FaStar, 
  FaShoppingBasket, FaUserShield, FaChartPie, FaSync 
} from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

// --- FIREBASE IMPORTS ---
import { db } from "../firebase/Firebase"; 
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

// --- SUB-COMPONENTS (Internal Helpers) ---

const StatusBadge = ({ type }) => {
  const styles = {
    VIP: "bg-amber-500 text-slate-900 border-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.2)]",
    Regular: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "New Client": "bg-slate-500/10 text-slate-500 border-slate-500/20",
  };
  return (
    <span className={`text-[8px] px-2 py-0.5 rounded-lg font-black uppercase border-2 tracking-tighter ${styles[type] || styles["New Client"]}`}>
      {type}
    </span>
  );
};

const InsightBar = ({ label, val, color }) => {
  // Map color names to Tailwind classes
  const colorMap = {
    amber: "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]",
    emerald: "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]",
    rose: "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
  };

  const textColorMap = {
    amber: "text-amber-500",
    emerald: "text-emerald-500",
    rose: "text-rose-500"
  };

  return (
    <div className="group cursor-default">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
        <span className="text-slate-500 group-hover:text-amber-500 transition-colors">{label}</span>
        <span className={`${textColorMap[color]}`}>{val}</span>
      </div>
      <div className="w-full h-2 bg-slate-800/20 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: val }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full ${colorMap[color]}`} 
        />
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const Customers = ({ isDarkMode }) => {
  const [customerData, setCustomerData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reference the Firestore 'orders' collection
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("createdAt", "desc"));

    // Real-time Cloud Synchronizer
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Grouping orders by unique email to form "Customer Nodes"
      const customerMap = allOrders.reduce((acc, order) => {
        const email = order.customerEmail || "guest@nexus.local";
        const name = order.customerName || "Unknown Entity";
        
        if (!acc[email]) {
          acc[email] = {
            name,
            email,
            totalSpent: 0,
            orderCount: 0,
            lastOrder: order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000) : new Date(),
            joinDate: order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000) : new Date()
          };
        }

        acc[email].totalSpent += Number(order.totalAmount) || 0;
        acc[email].orderCount += 1;
        
        // Track the most recent activity
        const orderDate = order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000) : new Date();
        if (orderDate > acc[email].lastOrder) {
          acc[email].lastOrder = orderDate;
        }
        return acc;
      }, {});

      // Final logic: Assign Rank and Sort by High-Value Clients
      const finalData = Object.values(customerMap)
        .map(c => ({
          ...c,
          status: c.totalSpent > 3000 ? "VIP" : c.orderCount >= 5 ? "Regular" : "New Client"
        }))
        .sort((a, b) => b.totalSpent - a.totalSpent);

      setCustomerData(finalData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredCustomers = customerData.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <FaSync className="animate-spin text-amber-500 text-3xl" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Accessing Cloud Database...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-12">
      
      {/* COLUMN 1: CLIENT DIRECTORY */}
      <div className="xl:col-span-2 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
          <div>
            <h2 className={`text-3xl font-black italic tracking-tighter uppercase ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              Client <span className="text-amber-500">Nodes</span>
            </h2>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">
              {customerData.length} Live Connections Identified
            </p>
          </div>
          
          <div className="relative w-full md:w-72">
            <input 
              type="text" 
              placeholder="Search Identities..." 
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full p-4 pl-12 rounded-[1.5rem] text-[11px] font-black outline-none border transition-all ${
                isDarkMode 
                ? "bg-slate-900/50 border-slate-800 text-white focus:border-amber-500" 
                : "bg-white border-slate-200 shadow-sm focus:border-amber-500"
              }`}
            />
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode='popLayout'>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((user) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={user.email} 
                  className={`p-6 rounded-[2.5rem] border flex flex-col md:flex-row md:items-center justify-between group transition-all hover:border-amber-500/50 ${
                    isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white shadow-xl border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-5">
                    {/* AVATAR GENERATOR */}
                    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-2xl relative overflow-hidden transition-transform group-hover:rotate-3 ${
                       user.status === 'VIP' ? 'bg-gradient-to-tr from-amber-600 to-orange-400' : 'bg-slate-800'
                    }`}>
                      {user.name[0]}
                      {user.status === 'VIP' && (
                        <div className="absolute top-0 right-0 p-1 bg-white/20 rounded-bl-lg">
                          <FaStar size={8}/>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-black uppercase text-sm tracking-tight group-hover:text-amber-500 transition-colors">
                          {user.name}
                        </p>
                        <StatusBadge type={user.status} />
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold lowercase opacity-60 mb-2">{user.email}</p>
                      <p className="text-[8px] text-slate-500 font-black uppercase tracking-tighter">
                        Synchronized: {user.joinDate.toLocaleDateString()} | Logs: {user.orderCount}
                      </p>
                    </div>
                  </div>

                  {/* VALUE METRICS */}
                  <div className="flex items-center justify-between md:justify-end gap-10 mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-slate-800/10">
                    <div className="text-left md:text-right">
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Asset flow</p>
                       <p className="text-2xl font-black italic text-amber-500 leading-none mt-1 tracking-tighter">
                         ${user.totalSpent.toFixed(2)}
                       </p>
                    </div>
                    <button className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl hover:bg-amber-500 hover:text-white transition-all shadow-lg shadow-amber-500/5 cursor-pointer">
                      <FaEdit size={14} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-24 text-center">
                <FaUserShield className="mx-auto text-slate-800 mb-4 opacity-10" size={50} />
                <p className="text-[10px] font-black uppercase opacity-20 tracking-[0.5em]">Zero Identified Entities</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* COLUMN 2: CLOUD INSIGHTS */}
      <div className="space-y-8">
        {/* RETENTION METRICS */}
        <div className={`p-10 rounded-[3rem] border ${isDarkMode ? 'bg-[#0d1117] border-slate-800' : 'bg-white shadow-2xl border-transparent'}`}>
           <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-500 shadow-xl shadow-amber-500/10"><FaChartPie size={20} /></div>
              <h3 className="text-xl font-black italic tracking-tighter uppercase">Cloud Metrics</h3>
           </div>
           
           <div className="space-y-8">
              <InsightBar 
                label="VIP Concentration" 
                val={`${Math.round((customerData.filter(c => c.status === 'VIP').length / (customerData.length || 1)) * 100)}%`} 
                color="amber" 
              />
              <InsightBar label="Loyalty Index" val="88%" color="emerald" />
              <InsightBar label="Churn Risk" val="12%" color="rose" />
           </div>
        </div>

        {/* DATABASE STATUS BOX */}
        <div className={`p-10 rounded-[3rem] border relative overflow-hidden transition-transform hover:scale-[1.02] ${isDarkMode ? 'bg-amber-500 text-slate-900 border-transparent' : 'bg-slate-900 text-white shadow-2xl shadow-slate-900/40'}`}>
           <FaGlobe size={120} className="absolute -right-10 -bottom-10 opacity-10 rotate-12" />
           <FaShoppingBasket size={40} className="mb-6 opacity-30" />
           <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Network Reach</p>
           <h4 className="text-3xl font-black italic tracking-tighter mb-6">{customerData.length} Cloud Nodes</h4>
           
           <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: 0 }} 
               animate={{ width: "100%" }} 
               className={`h-full ${isDarkMode ? "bg-slate-900" : "bg-amber-500"}`} 
             />
           </div>
           <p className="text-[9px] font-bold mt-4 opacity-60 uppercase tracking-widest">Global Sector Synchronized</p>
        </div>
      </div>
    </div>
  );
};

// CRITICAL: Default export for Dashboard.jsx to find this file
export default Customers;