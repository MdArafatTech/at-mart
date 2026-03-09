import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaChevronRight, FaTrash, FaExclamationTriangle, FaCloud } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
// FIREBASE TOOLS
import { db } from '../firebase/Firebase'; 
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";

const Orders = ({ isDarkMode }) => {
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All Orders");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // --- 1. REAL-TIME CLOUD LISTENER ---
  useEffect(() => {
    // Reference 'orders' collection (matching PaymentPage commitment)
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id, // Firebase Internal ID for updates
        ...doc.data()
      }));
      setAllOrders(ordersData);
    });

    return () => unsubscribe(); 
  }, []);

  // --- 2. SEARCH & FILTER LOGIC ---
  useEffect(() => {
    let result = [...allOrders];

    if (filterStatus !== "All Orders") {
      result = result.filter(o => o.status === filterStatus);
    }

    if (searchQuery.trim() !== "") {
      const queryText = searchQuery.toLowerCase().trim();
      result = result.filter(o => {
        const orderId = o.orderId?.toLowerCase() || "";
        const customerName = (o.customerName || o.customer?.fullName || "").toLowerCase();
        return orderId.includes(queryText) || customerName.includes(queryText);
      });
    }

    setFilteredOrders(result);
  }, [filterStatus, searchQuery, allOrders]);

  // --- 3. CLOUD UPDATE STATUS ---
  const updateStatus = async (firebaseId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", firebaseId);
      await updateDoc(orderRef, { status: newStatus });
      // UI updates automatically via onSnapshot!
    } catch (err) {
      console.error("Transmission Error:", err);
      alert("Terminal Error: Cloud update failed.");
    }
  };

  // --- 4. CLOUD DELETE ---
  const deleteOrder = async (firebaseId) => {
    if (window.confirm("PERMANENTLY purge this record from Cloud Storage?")) {
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
    <div className="space-y-8 pb-20 max-w-[1600px] mx-auto p-6 animate-in fade-in duration-700">
      
      {/* HEADER & SEARCH */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className={`text-4xl font-black uppercase tracking-tighter italic ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Fleet <span className="text-amber-500">Records</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
            <FaCloud className="text-sky-500 animate-pulse" /> Global Transmission Feed Active
          </p>
        </div>

        <div className="relative group w-full lg:w-96">
          <input 
            type="text"
            placeholder="Search Protocol ID or Client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full p-5 pl-14 rounded-2xl text-[11px] font-black outline-none border transition-all tracking-widest uppercase ${
              isDarkMode 
              ? "bg-[#0d1117] border-slate-800 text-white focus:border-amber-500" 
              : "bg-white border-slate-200 shadow-xl focus:border-amber-500"
            }`}
          />
          <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
        {['All Orders', 'Pending', 'Verified', 'Shipped', 'Delivered'].map((status) => (
          <button 
            key={status} 
            onClick={() => setFilterStatus(status)}
            className={`px-8 py-4 cursor-pointer rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 flex-shrink-0 ${
              filterStatus === status 
              ? 'bg-amber-500 border-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]' 
              : isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700' : 'bg-white border-slate-100 text-slate-400'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className={`rounded-[3rem] border overflow-hidden ${
        isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white shadow-2xl border-transparent"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead className={`text-[10px] font-black uppercase text-slate-500 border-b ${
              isDarkMode ? "bg-black/20 border-slate-800" : "bg-slate-50 border-slate-100"
            }`}>
              <tr>
                <th className="px-10 py-8 tracking-[0.2em]">Transmission ID</th>
                <th className="px-10 py-8 tracking-[0.2em]">Client Node</th>
                <th className="px-10 py-8 tracking-[0.2em]">Value</th>
                <th className="px-10 py-8 tracking-[0.2em]">Status Protocol</th>
                <th className="px-10 py-8 text-center tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/10">
              <AnimatePresence mode='popLayout'>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      key={order.id}
                      className="hover:bg-amber-500/5 transition-all group"
                    >
                      <td className="px-10 py-8">
                        <p className="font-black text-amber-500 italic uppercase text-lg tracking-tighter group-hover:scale-105 transition-transform origin-left">{order.orderId}</p>
                        <p className="text-[8px] font-black opacity-30 mt-1 uppercase tracking-widest">
                          {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleString() : 'Processing...'}
                        </p>
                      </td>
                      <td className="px-10 py-8">
                        <p className="text-[11px] font-black uppercase italic">{order.customerName}</p>
                        <p className="text-[9px] font-bold opacity-40 mt-1">{order.customerEmail}</p>
                      </td>
                      <td className="px-10 py-8 font-black text-2xl italic text-amber-500 tracking-tighter">
                        ${order.totalAmount || order.total}
                      </td>
                      <td className="px-10 py-8">
                        <select 
                          value={order.status || "Pending"}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className={`text-[9px] cursor-pointer font-black uppercase px-5 py-3 rounded-xl border-2 outline-none transition-all ${statusStyles[order.status || "Pending"]}`}
                        >
                          {Object.keys(statusStyles).map(s => <option key={s} value={s} className="bg-slate-900 text-white">{s}</option>)}
                        </select>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center justify-center gap-4">
                          <button 
                            onClick={() => navigate(`/ordertracking/${order.orderId}`)} 
                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-800 text-white hover:bg-amber-500 hover:text-black transition-all cursor-pointer"
                          >
                            <FaChevronRight size={14} />
                          </button>
                          <button 
                            onClick={() => deleteOrder(order.id)} 
                            className="w-12 h-12 flex items-center justify-center bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-40 text-center">
                       <FaExclamationTriangle className="mx-auto text-slate-800/20 mb-6" size={50} />
                       <p className="text-[10px] font-black uppercase opacity-20 tracking-[0.5em]">Zero cloud records detected in this frequency</p>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;