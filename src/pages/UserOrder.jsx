import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBox, FaCheckCircle, FaTruck, FaHome, FaClock, 
  FaCloud, FaSearch, FaUser, FaShoppingBag, FaTrash, FaTimesCircle, FaExclamationTriangle 
} from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from "../context/ThemeContext"; 
import { db } from '../firebase/Firebase'; 
import { 
  collection, onSnapshot, query, orderBy, 
  where, deleteDoc, doc, updateDoc 
} from "firebase/firestore";

const UserOrders = ({ userEmail }) => {
  const { isDarkMode } = useTheme(); 
  const [myOrders, setMyOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // --- 1. REAL-TIME CLOUD SYNC ---
  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const q = userEmail 
      ? query(ordersRef, where("customerEmail", "==", userEmail), orderBy("createdAt", "desc"))
      : query(ordersRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMyOrders(ordersData);
    });

    return () => unsubscribe(); 
  }, [userEmail]);

  // --- 2. LOGIC: PURGE RECORD ---
  const purgeOrder = async (orderDocId) => {
    if (window.confirm("Purge this record from cloud history?")) {
      try {
        await deleteDoc(doc(db, "orders", orderDocId));
      } catch (err) {
        alert("Purge Failure.");
      }
    }
  };

  // --- 3. LOGIC: ABORT PROTOCOL ---
  const cancelOrder = async (orderDocId, currentStatus) => {
    const step = getStatusStep(currentStatus);
    // Only allow cancellation if in the first step (Pending/Confirmed)
    if (step === 1) {
      const reasons = ["Price issue", "Address error", "Changed mind", "Ordered by mistake"];
      const selection = window.prompt(`Reason for Abort?\n1. ${reasons[0]}\n2. ${reasons[1]}\n3. ${reasons[2]}\n4. ${reasons[3]}`);
      
      if (!selection) return;
      const finalReason = reasons[parseInt(selection) - 1] || selection;

      try {
        await updateDoc(doc(db, "orders", orderDocId), {
          status: "Cancelled",
          cancellationReason: finalReason,
          cancelledAt: new Date().toISOString()
        });
      } catch (err) {
        alert("Sync Error.");
      }
    } else {
      alert("Order has already been verified and cannot be aborted.");
    }
  };

  // --- 4. STEP CALCULATION (Fixed & Precise) ---
  const getStatusStep = (status) => {
    const s = status?.toLowerCase() || "";

    if (s === "cancelled") return 0;
    
    // Step 1: Default/Initial State
    // If it's pending, confirmed (meaning payment ok, but not checked), or processing
    if (s.includes("pending") || s.includes("confirmed") || s.includes("processing") || s === "") {
      return 1;
    }
    
    // Step 2: Admin has physically verified/accepted the order
    if (s === "verified" || s === "accepted" || s === "preparing") {
      return 2;
    }
    
    // Step 3: Logistics handoff
    if (s === "shipped" || s === "in transit" || s === "out for delivery") {
      return 3;
    }
    
    // Step 4: Final Closure
    if (s === "delivered" || s === "completed") {
      return 4;
    }

    return 1; // Default to step 1 for any new unknown status
  };

  const filteredOrders = myOrders.filter(o => 
    (o.displayId || o.orderId || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen p-4 md:p-10 transition-all duration-500 ${isDarkMode ? "bg-[#050505] text-white" : "bg-slate-50 text-slate-900"}`}>
      
      <div className="max-w-6xl mx-auto mb-10">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">Fleet <span className="text-amber-500 text-5xl">History</span></h1>
          <p className="text-[10px] font-bold opacity-40 tracking-[0.4em] uppercase mt-4 flex items-center gap-2">
            <FaCloud className="text-sky-500 animate-pulse" /> Active Transmission Feed
          </p>
        </motion.div>

        <div className="mt-8 relative max-w-md">
          <input 
            type="text" placeholder="Search Order ID..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full p-6 pl-14 rounded-3xl text-[10px] font-black outline-none border transition-all uppercase tracking-widest ${isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 shadow-xl"}`}
          />
          <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-10">
        <AnimatePresence mode="popLayout">
          {filteredOrders.map((order) => {
            const step = getStatusStep(order.status);
            const isCancelled = order.status === "Cancelled";
            const trackingId = order.displayId || order.orderId || order.id;

            return (
              <motion.div
                key={order.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className={`p-8 md:p-10 rounded-[3.5rem] border relative overflow-hidden transition-all ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white border-slate-100 shadow-2xl"}`}
              >
                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
                  <div className="flex items-center gap-6">
                    <div className={`w-20 h-20 rounded-[2.2rem] flex items-center justify-center text-4xl ${isDarkMode ? "bg-black" : "bg-slate-50 shadow-inner"}`}>
                        <FaShoppingBag className={isCancelled ? "text-slate-700" : "text-amber-500"} />
                    </div>
                    <div>
                        <h2 className={`text-3xl font-black italic uppercase tracking-tighter ${isCancelled ? "text-slate-700 line-through" : ""}`}>
                          {order.displayId || order.orderId}
                        </h2>
                        <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">
                          Logged: {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toDateString() : 'Syncing...'}
                        </p>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-4xl font-black italic tracking-tighter text-amber-500">${order.totalAmount || order.total}</p>
                    <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full ${isCancelled ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"}`}>
                      {order.status || "Pending"}
                    </span>
                  </div>
                </div>

                {/* --- PROGRESS TIMELINE --- */}
                {!isCancelled && (
                  <div className="relative flex justify-between items-center mb-12 max-w-3xl mx-auto px-6">
                    {/* Background Line */}
                    <div className={`absolute h-[2px] w-[88%] left-[6%] top-1/2 -translate-y-1/2 ${isDarkMode ? "bg-slate-800" : "bg-slate-200"}`} />
                    
                    {/* Active Progress Line */}
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${((step - 1) / 3) * 88}%` }} 
                      className="absolute h-[2px] bg-amber-500 top-1/2 left-[6%] -translate-y-1/2 shadow-[0_0_15px_#f59e0b]" 
                    />

                    {[{l:"Pending",i:<FaClock/>},{l:"Verified",i:<FaCheckCircle/>},{l:"Shipped",i:<FaTruck/>},{l:"Delivered",i:<FaHome/>}]
                    .map((s, idx) => (
                      <div key={idx} className="relative z-10 flex flex-col items-center">
                        <motion.div 
                          animate={{ scale: step > idx ? 1.1 : 1 }}
                          className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border-4 transition-all duration-700 ${
                            step > idx 
                            ? "bg-amber-500 border-amber-500 text-black shadow-lg" 
                            : isDarkMode ? "bg-slate-900 border-slate-800 text-slate-700" : "bg-white border-slate-200 text-slate-300"
                          }`}
                        >
                          {s.i}
                        </motion.div>
                        <span className={`text-[8px] font-black uppercase mt-3 tracking-tighter ${step > idx ? "opacity-100 text-amber-500" : "opacity-30"}`}>{s.l}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CANCELLATION BOX */}
                {isCancelled && (
                  <div className="mb-10 p-6 bg-rose-500/5 border border-rose-500/10 rounded-[2rem] flex gap-4">
                    <FaExclamationTriangle className="text-rose-500 mt-1" />
                    <div>
                      <p className="text-[9px] font-black uppercase text-rose-500 tracking-widest mb-1">cancel order</p>
                      <p className="text-xs font-bold italic opacity-60">Reason: {order.cancellationReason || "Manual Override"}</p>
                    </div>
                  </div>
                )}

                {/* FOOTER ACTIONS */}
                <div className="flex flex-wrap justify-end gap-4 border-t border-slate-500/10 pt-8">
                  <button onClick={() => purgeOrder(order.id)} className="p-4 rounded-2xl bg-slate-500/5 text-slate-500 hover:bg-rose-500 hover:text-white transition-all cursor-pointer">
                    <FaTrash size={14} />
                  </button>

                  {step === 1 && !isCancelled && (
                    <button onClick={() => cancelOrder(order.id, order.status)} className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-orange-600 text-white font-black text-[10px] uppercase hover:bg-orange-700 transition-all cursor-pointer shadow-lg shadow-orange-900/20">
                      <FaTimesCircle /> cancel order
                    </button>
                  )}

                  {!isCancelled && (
                    <button onClick={() => navigate(`/ordertracking/${trackingId}`)} className={`px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest cursor-pointer transition-all ${isDarkMode ? "bg-white text-black hover:bg-amber-500" : "bg-slate-900 text-white hover:bg-amber-500 hover:text-black"}`}>
                      Track order
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserOrders;