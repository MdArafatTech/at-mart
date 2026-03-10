import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaBox, FaCheckCircle, FaTruck, FaClock, 
  FaCloud, FaSearch, FaTrash, 
  FaTimesCircle, FaArrowRight, FaLock, FaSpinner
} from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from "../context/ThemeContext"; 
import { db, auth } from '../firebase/Firebase'; 
import { onAuthStateChanged } from "firebase/auth"; 
import { 
  collection, onSnapshot, query, orderBy, 
  where, deleteDoc, doc
} from "firebase/firestore";

const UserOrders = () => {
  const { isDarkMode } = useTheme(); 
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [myOrders, setMyOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // 1. MONITOR AUTH STATE (Crucial for persistence on refresh)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. FETCH ORDERS (Only runs when user is confirmed)
  useEffect(() => {
    // If we are still checking if the user is logged in, don't do anything yet
    if (authLoading) return;

    // If auth check finished and there is no user, clear orders
    if (!user) {
      setMyOrders([]);
      return;
    }

    // Now that we have a user.email, run the query
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef, 
      where("customerEmail", "==", user.email), 
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMyOrders(ordersData);
    }, (error) => {
      console.error("Firestore Error:", error);
    });

    return () => unsubscribe(); 
  }, [user, authLoading]); // Re-run when auth state changes or loading finishes

  // --- STATS CALCULATION ---
  const stats = {
    total: myOrders.length,
    pending: myOrders.filter(o => ["pending", "confirmed", "processing"].includes(o.status?.toLowerCase())).length,
    active: myOrders.filter(o => ["verified", "accepted", "preparing", "shipped", "in transit", "out for delivery"].includes(o.status?.toLowerCase())).length,
    completed: myOrders.filter(o => ["delivered", "completed"].includes(o.status?.toLowerCase())).length,
  };

  const getStatusStep = (status) => {
    const s = status?.toLowerCase() || "";
    if (s === "cancelled") return 0;
    if (s.includes("pending") || s.includes("confirmed") || s.includes("processing")) return 1;
    if (s === "verified" || s === "accepted" || s === "preparing") return 2;
    if (s === "shipped" || s === "in transit" || s === "out for delivery") return 3;
    if (s === "delivered" || s === "completed") return 4;
    return 1;
  };

  const purgeOrder = async (e, orderDocId) => {
    e.stopPropagation();
    if (window.confirm("Purge this record from cloud history?")) {
      try { await deleteDoc(doc(db, "orders", orderDocId)); } catch (err) { alert("Purge Failure."); }
    }
  };

  const filteredOrders = myOrders.filter(o => 
    (o.displayId || o.orderId || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- A. LOADING STATE ---
  if (authLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-[#050505]" : "bg-slate-50"}`}>
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="animate-spin text-amber-500 text-4xl" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Syncing Encryption...</p>
        </div>
      </div>
    );
  }

  // --- B. UNAUTHENTICATED STATE ---
  if (!user) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center font-mono p-6 ${isDarkMode ? "bg-[#050505] text-white" : "bg-slate-50 text-slate-900"}`}>
        <div className="p-8 bg-amber-500/10 rounded-full mb-6">
          <FaLock className="text-5xl text-amber-500" />
        </div>
        <h2 className="text-3xl font-black italic uppercase tracking-tighter">Access Denied</h2>
        <p className="text-gray-500 text-sm mt-2 max-w-xs text-center uppercase font-bold tracking-widest">
          Login required to access secure fleet records.
        </p>
        <button 
          onClick={() => navigate('/login')}
          className="mt-8 px-10 py-4 bg-amber-500 text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
        >
          Authenticate Terminal
        </button>
      </div>
    );
  }

  // --- C. AUTHORIZED DASHBOARD ---
  return (
    <div className={`min-h-screen p-6 md:p-12 transition-all duration-500 ${isDarkMode ? "bg-[#050505] text-white" : "bg-slate-50 text-slate-900"}`}>
      
      <div className="max-w-7xl mx-auto mb-16">
        <div className="flex flex-col xl:flex-row gap-10 items-start xl:items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none text-black dark:text-white">
             order <span className="text-amber-500">History</span>
            </h1>
            <p className="text-[10px] font-bold opacity-40 tracking-[0.5em] uppercase mt-4 flex items-center gap-3">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" /> Authorized: {user.email}
            </p>
          </motion.div>

          {/* STATS TILES */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full xl:w-auto">
            {[
              { label: "Live Nodes", val: stats.total, color: "text-amber-500", icon: <FaCloud /> },
              { label: "Pending", val: stats.pending, color: "text-sky-500", icon: <FaClock /> },
              { label: "In Transit", val: stats.active, color: "text-orange-500", icon: <FaTruck /> },
              { label: "Finished", val: stats.completed, color: "text-emerald-500", icon: <FaCheckCircle /> }
            ].map((stat, i) => (
              <div key={i} className={`p-6 rounded-[2rem] border min-w-[140px] ${isDarkMode ? "bg-white/5 border-white/5" : "bg-white border-slate-100 shadow-lg"}`}>
                <div className={`${stat.color} text-xl mb-2`}>{stat.icon}</div>
                <p className="text-3xl font-black italic tracking-tighter leading-none">{stat.val}</p>
                <p className="text-[8px] font-black uppercase tracking-widest opacity-40 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SEARCH */}
        <div className="mt-12 relative max-w-md group">
          <input 
            type="text" placeholder="TRACK_ID_SEARCH..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full p-6 pl-14 rounded-2xl text-[10px] font-black outline-none border transition-all uppercase tracking-widest ${
              isDarkMode ? "bg-white/5 border-white/10 focus:border-amber-500 text-white" : "bg-white border-slate-200 shadow-xl focus:border-amber-500"
            }`}
          />
          <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-500" />
        </div>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <AnimatePresence mode="popLayout">
          {filteredOrders.length === 0 ? (
            <div className="col-span-full py-20 text-center opacity-30 italic uppercase font-black tracking-widest text-sm">
              No nodes detected in this sector.
            </div>
          ) : (
            filteredOrders.map((order) => {
              const step = getStatusStep(order.status);
              const isCancelled = order.status?.toLowerCase() === "cancelled";
              const trackingId = order.displayId || order.id;

              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -8 }}
                  onClick={() => navigate(`/orderdetails/${order.id}`)}
                  className={`group cursor-pointer p-8 rounded-[2.5rem] border relative overflow-hidden transition-all duration-500 ${
                    isDarkMode 
                    ? "bg-[#0d1117] border-white/5 hover:border-amber-500/50 shadow-2xl" 
                    : "bg-white border-slate-100 shadow-xl hover:shadow-2xl hover:border-amber-500"
                  }`}
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                      isCancelled ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"
                    }`}>
                      {isCancelled ? <FaTimesCircle /> : <FaBox />}
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black italic tracking-tighter text-amber-500">${Number(order.totalAmount || 0).toFixed(2)}</p>
                      <p className="text-[7px] font-black uppercase opacity-30">
                        {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Syncing'}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className={`text-lg font-black uppercase italic tracking-tight ${isCancelled ? "opacity-30 line-through" : ""}`}>
                      {order.displayId || "NODE_UNSET"}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${isCancelled ? "bg-rose-500" : "bg-emerald-500 animate-pulse"}`} />
                      <span className={`text-[8px] font-black uppercase tracking-widest ${isCancelled ? "text-rose-500" : "text-emerald-500"}`}>
                        {order.status || "Initialized"}
                      </span>
                    </div>
                  </div>

                  {!isCancelled && (
                    <div className="mb-8">
                      <div className={`h-1 w-full rounded-full overflow-hidden ${isDarkMode ? "bg-white/5" : "bg-slate-100"}`}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(step / 4) * 100}%` }}
                          className="h-full bg-amber-500"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <button 
                      onClick={(e) => purgeOrder(e, order.id)}
                      className="w-9 h-9 rounded-lg bg-rose-500/5 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                    >
                      <FaTrash size={10} />
                    </button>
                    
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/ordertracking/${trackingId}`);
                      }}
                      className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-amber-500 hover:bg-amber-500/10 p-2 rounded-lg transition-all"
                    >
                      Track Node <FaArrowRight />
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserOrders;