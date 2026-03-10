import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaChevronRight, FaTrash, FaExclamationTriangle, FaCloud, FaUser, FaTag, FaCalendarAlt } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
// FIREBASE TOOLS
import { db } from '../firebase/Firebase'; 
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";

const Orders = ({ isDarkMode }) => {
  const [allOrders, setAllOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All Orders");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // --- 1. REAL-TIME CLOUD LISTENER ---
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id, // This is the unique Firebase Document ID
        ...doc.data()
      }));
      setAllOrders(ordersData);
    });
    return () => unsubscribe(); 
  }, []);

  // --- 2. LOGIC: DERIVED FILTERING ---
  const filteredOrders = allOrders.filter(o => {
    const matchesStatus = filterStatus === "All Orders" || o.status === filterStatus;
    const queryText = searchQuery.toLowerCase().trim();
    const orderId = (o.orderId || "").toLowerCase();
    const customerName = (o.customerName || o.customer?.fullName || "").toLowerCase();
    const matchesSearch = orderId.includes(queryText) || customerName.includes(queryText);
    return matchesStatus && matchesSearch;
  });

  // --- 3. CLOUD ACTIONS ---
  const updateStatus = async (firebaseId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", firebaseId);
      await updateDoc(orderRef, { status: newStatus });
    } catch (err) {
      console.error("Transmission Error:", err);
    }
  };

  const deleteOrder = async (firebaseId) => {
    if (window.confirm("PERMANENTLY purge this record?")) {
      try {
        await deleteDoc(doc(db, "orders", firebaseId));
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const statusStyles = {
    Pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Verified: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    Shipped: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    Delivered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 space-y-8 pb-20 max-w-[1600px] mx-auto transition-colors duration-500 ${isDarkMode ? "bg-black text-white" : "bg-slate-50 text-slate-900"}`}>
      
      {/* HEADER SECTION */}
      <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">
            Fleet <span className="text-amber-500">Records</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
            <FaCloud className="text-sky-500 animate-pulse" /> Global Transmission Feed Active
          </p>
        </div>

        <div className="relative group w-full xl:w-96">
          <input 
            type="text"
            placeholder="Search Protocol ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full p-4 pl-12 rounded-2xl text-[11px] font-black outline-none border transition-all tracking-widest uppercase ${
              isDarkMode ? "bg-[#0d1117] border-slate-800 text-white focus:border-amber-500" : "bg-white border-slate-200 shadow-lg focus:border-amber-500"
            }`}
          />
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
        </div>
      </header>

      {/* FILTER TABS */}
      <nav className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
        {['All Orders', 'Pending', 'Verified', 'Shipped', 'Delivered'].map((status) => (
          <button 
            key={status} 
            onClick={() => setFilterStatus(status)}
            className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border-2 flex-shrink-0 ${
              filterStatus === status ? 'bg-amber-500 border-amber-500 text-black shadow-lg scale-95' : isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-white border-slate-100 text-slate-400'
            }`}
          >
            {status}
          </button>
        ))}
      </nav>

      {/* RESPONSIVE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        <AnimatePresence mode='popLayout'>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={order.id}
                className={`relative group p-6 rounded-[2rem] border transition-all hover:shadow-2xl ${
                  isDarkMode ? "bg-[#0d1117] border-slate-800 hover:border-amber-500/50" : "bg-white border-slate-100 shadow-sm hover:border-amber-200"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold opacity-40 uppercase tracking-tighter flex items-center gap-1 mb-1">
                      <FaTag size={8}/> Transmission ID
                    </span>
                    <h3 className="text-xl font-black text-amber-500 italic tracking-tighter uppercase">
                      {order.orderId}
                    </h3>
                  </div>
                  <div className={`text-[10px] px-3 py-1 rounded-full font-black uppercase ${statusStyles[order.status || "Pending"]}`}>
                    {order.status || "Pending"}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-500/10 flex items-center justify-center text-slate-500">
                      <FaUser size={12} />
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase leading-none">{order.customerName}</p>
                      <p className="text-[9px] font-medium opacity-40 truncate max-w-[150px]">{order.customerEmail}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-3xl font-black italic text-amber-500 tracking-tighter">
                    ${order.totalAmount || order.total}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-500/10 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <select 
                      value={order.status || "Pending"}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`flex-1 text-[9px] cursor-pointer font-black uppercase p-3 rounded-xl border-2 outline-none transition-all ${statusStyles[order.status || "Pending"]}`}
                    >
                      {Object.keys(statusStyles).map(s => <option key={s} value={s} className="bg-slate-900 text-white">{s}</option>)}
                    </select>
                    <button onClick={() => deleteOrder(order.id)} className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all cursor-pointer">
                      <FaTrash size={12} />
                    </button>
                  </div>

                  <button 
                    onClick={() => navigate(`/orderdetails/${order.id}`)} // FIXED: Sending Firebase ID
                    className="w-full py-3 cursor-pointer flex items-center justify-center gap-2 rounded-xl bg-slate-800 text-white hover:bg-amber-500 hover:text-black font-black text-[10px] uppercase tracking-widest transition-all"
                  >
                    View Details <FaChevronRight size={10} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center opacity-20">
              <FaExclamationTriangle className="mx-auto mb-6" size={50} />
              <p className="text-[10px] font-black uppercase tracking-[0.5em]">Zero cloud records in frequency</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Orders;