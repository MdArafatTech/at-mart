import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaBox, FaTruck, FaCheckCircle, FaMapMarkerAlt, 
  FaCalendarAlt, FaSearch, FaHeadset, FaFileInvoiceDollar,
  FaShieldAlt, FaSync, FaArrowLeft, FaShoppingBasket
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

// --- FIREBASE IMPORTS ---
import { db } from "../firebase/Firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

// --- PDF IMPORTS ---
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 

const OrderTracking = () => {
  const { isDarkMode } = useTheme();
  const { orderId: urlOrderId } = useParams();
  const navigate = useNavigate();
  
  const [searchId, setSearchId] = useState(urlOrderId || "");
  const [isSearching, setIsSearching] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe = () => {};

    if (urlOrderId) {
      setIsSearching(true);
      setError(null);

      // We query displayId to match your user-facing IDs
      const q = query(collection(db, "orders"), where("displayId", "==", urlOrderId));

      unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const foundData = snapshot.docs[0].data();
          
          const statusMap = { "Pending": 25, "Verified": 50, "Shipped": 75, "Delivered": 100 };
          const currentStatus = foundData.status || "Pending";

          setOrder({
            ...foundData,
            progress: statusMap[currentStatus] || 20,
            timeline: [
              { step: "Order Placed", desc: "Digital manifest created", time: "T-0", status: "complete" },
              { step: "Verified", desc: "Security & Payment check", time: "T-1", status: currentStatus !== "Pending" ? "complete" : "active" },
              { step: "Shipped", desc: "Package left warehouse", time: "Transit", status: currentStatus === "Shipped" ? "active" : currentStatus === "Delivered" ? "complete" : "pending" },
              { step: "Delivered", desc: "Handover complete", time: "Final", status: currentStatus === "Delivered" ? "complete" : "pending" },
            ]
          });
        } else {
          setOrder(null);
          setError("Protocol ID Not Recognized");
        }
        setIsSearching(false);
      });
    }
    return () => unsubscribe();
  }, [urlOrderId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    navigate(`/ordertracking/${searchId.trim()}`);
  };

  const downloadInvoice = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Product', 'Qty', 'Price', 'Subtotal']],
      body: order.items.map(item => [item.name, item.quantity || 1, `$${item.price}`, `$${(item.quantity || 1) * item.price}`]),
      headStyles: { fillColor: [245, 158, 11] }
    });
    doc.save(`Invoice_${order.displayId}.pdf`);
  };

  return (
    <div className={`min-h-screen pb-20 transition-all duration-500 ${isDarkMode ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900"}`}>
      
      {/* NAVIGATION HEADER */}
      <div className={`sticky top-0 z-50 backdrop-blur-md border-b p-6 ${isDarkMode ? "bg-black/80 border-slate-800" : "bg-white/80 border-slate-200"}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
            <FaArrowLeft /> Back
          </button>
          
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
            <div className={`flex rounded-xl border ${isDarkMode ? "bg-slate-900 border-slate-700" : "bg-slate-100 border-slate-200"}`}>
              <input 
                type="text" value={searchId} onChange={(e) => setSearchId(e.target.value)}
                placeholder="TRACK ID..."
                className="w-full bg-transparent p-3 text-[10px] font-black uppercase outline-none px-6"
              />
              <button type="submit" className="bg-amber-500 text-black px-6 rounded-r-xl font-black text-[10px]">SYNC</button>
            </div>
          </form>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!urlOrderId ? (
            /* EMPTY STATE */
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
               <FaSearch className="text-9xl mx-auto opacity-10 mb-8" />
               <h2 className="text-4xl font-black italic uppercase italic">Awaiting <span className="text-amber-500">Signal</span></h2>
               <p className="opacity-40 text-[10px] font-bold mt-4 tracking-[0.4em]">ENTER TRACKING ID TO BEGIN</p>
            </motion.div>
          ) : isSearching ? (
             <div className="text-center py-20 animate-pulse">Establishing Node Link...</div>
          ) : order ? (
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* LEFT: STATUS & ITEMS */}
              <div className="lg:col-span-2 space-y-8">
                <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white shadow-xl border-transparent"}`}>
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">Live Progress</h3>
                    <p className="text-4xl font-black text-amber-500 italic">{order.progress}%</p>
                  </div>
                  
                  <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden mb-12">
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${order.progress}%` }}
                      className="h-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                    />
                  </div>

                  {/* DARAZ STYLE TIMELINE */}
                  <div className="space-y-12 pl-6 border-l-2 border-slate-800">
                    {order.timeline.map((item, idx) => (
                      <div key={idx} className="relative">
                         <div className={`absolute -left-[35px] w-5 h-5 rounded-full border-4 ${
                           item.status === 'complete' ? "bg-amber-500 border-amber-500" : 
                           item.status === 'active' ? "bg-slate-900 border-amber-500 animate-pulse" : "bg-slate-900 border-slate-800"
                         }`} />
                         <h4 className={`text-xs font-black uppercase ${item.status === 'pending' ? 'opacity-20' : ''}`}>{item.step}</h4>
                         <p className="text-[10px] opacity-40 uppercase font-bold">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PRODUCT MANIFEST */}
                <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white shadow-xl border-transparent"}`}>
                  <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <FaShoppingBasket className="text-amber-500" /> Package Contents
                  </h3>
                  <div className="space-y-4">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-black/20 border border-white/5">
                        <p className="text-[11px] font-black uppercase italic">{item.name} <span className="text-amber-500 ml-2">x{item.quantity}</span></p>
                        <p className="text-[11px] font-black italic">${item.price * (item.quantity || 1)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: SHIPPING DETAILS & ACTIONS */}
              <div className="space-y-8">
                <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white shadow-xl text-black"}`}>
                   <FaMapMarkerAlt className="text-amber-500 mb-4" size={20} />
                   <h4 className="text-[10px] font-black uppercase opacity-40 mb-2">Delivery Node</h4>
                   <p className="text-sm font-black uppercase italic leading-tight mb-4">{order.customerName}</p>
                   <p className="text-[11px] font-bold opacity-60 uppercase italic">
                     {order.deliveryAddress?.address}, {order.deliveryAddress?.city}
                   </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <button onClick={downloadInvoice} className="w-full py-5 bg-amber-500 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-95 transition-all">
                    Generate PDF Invoice
                  </button>
                  <button className={`w-full py-5 rounded-2xl border font-black text-[10px] uppercase tracking-widest ${isDarkMode ? "border-slate-800 bg-slate-900" : "bg-white border-slate-200 shadow-lg"}`}>
                    Report Issue
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-20 text-rose-500 font-black uppercase">ERROR: {error}</div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default OrderTracking;