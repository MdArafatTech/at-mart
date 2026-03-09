import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaBox, FaTruck, FaCheckCircle, FaMapMarkerAlt, 
  FaCalendarAlt, FaSearch, FaHeadset, FaPrint, FaFileInvoiceDollar,
  FaShieldAlt, FaSync
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
  
  const [searchId, setSearchId] = useState(urlOrderId || "");
  const [isSearching, setIsSearching] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  // --- REAL-TIME FIREBASE SYNC ---
  useEffect(() => {
    let unsubscribe = () => {};

    if (urlOrderId) {
      setIsSearching(true);
      setError(null);

      // Query Firestore for the specific Order ID
    const q = query(collection(db, "orders"), where("displayId", "==", urlOrderId));

      unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const foundData = snapshot.docs[0].data();
          
          // Map Status to Progress Percentage
          const statusMap = { "Pending": 20, "Verified": 45, "Shipped": 75, "Delivered": 100 };
          const currentStatus = foundData.status || "Pending";

          setOrder({
            ...foundData,
            progress: statusMap[currentStatus] || 15,
            timeline: [
              { step: "Order Placed", desc: "System Confirmed", time: "T-0", status: "complete" },
              { step: "Verified", desc: "Logistics Checked", time: "T-1", status: currentStatus !== "Pending" ? "complete" : "active" },
              { step: "Shipped", desc: "In transit to Hub", time: "Transit", status: currentStatus === "Shipped" ? "active" : currentStatus === "Delivered" ? "complete" : "pending" },
              { step: "Delivered", desc: "Package Received", time: "Final", status: currentStatus === "Delivered" ? "complete" : "pending" },
            ]
          });
        } else {
          setOrder(null);
          if (urlOrderId) setError("Invalid Protocol ID");
        }
        setIsSearching(false);
      }, (err) => {
        console.error("Tracking Error:", err);
        setIsSearching(false);
      });
    }

    return () => unsubscribe();
  }, [urlOrderId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId) return;
    // We navigate to the URL to trigger the useEffect
    window.history.pushState({}, '', `/ordertracking/${searchId.trim()}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const downloadInvoice = () => {
    try {
      const doc = new jsPDF();
      const brand = "ARSENAL TRACK";
      
      doc.setFontSize(22);
      doc.setTextColor(245, 158, 11); 
      doc.text(brand, 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Invoice ID: ${order.orderId}`, 14, 30);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);

      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("Shipping Logistics:", 14, 50);
      doc.setFontSize(10);
      doc.text([
        `Recipient: ${order.customerName}`,
        `Address: ${order.deliveryAddress?.address}`,
        `Region: ${order.deliveryAddress?.upazila}, ${order.deliveryAddress?.district}`,
        `City: ${order.deliveryAddress?.city}`,
        `Phone: ${order.customerPhone}`
      ], 14, 57);

      const tableData = order.items.map(item => [
        item.name, 
        item.quantity || 1, 
        `$${item.price}`, 
        `$${(item.quantity || 1) * item.price}`
      ]);

      autoTable(doc, {
        startY: 85,
        head: [['Product Code', 'Qty', 'Unit Price', 'Total']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [245, 158, 11], textColor: [0, 0, 0] },
      });

      const finalY = doc.lastAutoTable.finalY || 120;
      doc.setFontSize(14);
      doc.text(`Total Authorized: $${order.totalAmount}`, 14, finalY + 15);
      
      doc.save(`INVOICE_${order.orderId}.pdf`);
    } catch (error) {
      alert("PDF Engine Error. Contact System Admin.");
    }
  };

  return (
    <div className={`min-h-screen pb-20 transition-all duration-500 ${isDarkMode ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900"}`}>
      
      {/* HEADER */}
      <div className={`sticky top-0 z-50 backdrop-blur-2xl border-b py-6 px-6 ${isDarkMode ? "bg-[#0a0a0a]/90 border-slate-800" : "bg-white/90 border-slate-200 shadow-sm"}`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-900 font-black text-xl">AT</div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">Arsenal <span className="text-amber-500">Track</span></h1>
          </div>

          <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <div className={`flex items-center rounded-2xl border overflow-hidden transition-all ${isDarkMode ? "bg-[#0d1117] border-slate-700 focus-within:border-amber-500" : "bg-white border-slate-200 focus-within:border-amber-500"}`}>
              <FaSearch className="ml-4 text-slate-500" />
              <input 
                type="text"
                placeholder="Enter Terminal Order ID..."
                className="flex-1 bg-transparent px-4 py-3 outline-none text-[10px] font-black tracking-widest uppercase"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
              <button type="submit" className="bg-amber-500 text-slate-900 font-black px-6 py-3 text-[10px] uppercase cursor-pointer">Sync</button>
            </div>
          </form>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 pt-12">
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-40">
              <FaSync className="text-4xl text-amber-500 animate-spin mb-6" />
              <p className="text-[10px] font-black tracking-widest text-amber-500 uppercase">Synchronizing with Global Node...</p>
            </motion.div>
          ) : order ? (
            <motion.div key="active" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
              {/* PROGRESS CARD */}
              <div className={`p-10 rounded-[3rem] border relative overflow-hidden ${isDarkMode ? "bg-[#0d1117] border-slate-800 shadow-[0_0_60px_-15px_rgba(245,158,11,0.1)]" : "bg-white border-transparent shadow-2xl"}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
                   <div>
                      <div className="flex items-center gap-3 mb-6">
                        <span className="px-5 py-2 bg-emerald-500 text-black text-[9px] font-black rounded-full uppercase tracking-widest">
                          {order.status}
                        </span>
                        <span className="text-[10px] font-mono opacity-40">PROTOCOL: {order.orderId}</span>
                      </div>
                      <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
                        Pulse: <span className="text-amber-500">{order.progress}%</span>
                      </h2>
                   </div>
                   <div className="text-left md:text-right">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Authorization Value</p>
                      <div className="text-5xl font-black text-amber-500 italic leading-none">${order.totalAmount}</div>
                   </div>
                </div>

                <div className="h-4 bg-slate-800/40 rounded-full mt-12 overflow-hidden border border-slate-700/30">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${order.progress}%` }} 
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-400" 
                  />
                </div>
              </div>

              {/* TIMELINE & DETAILS */}
              <div className="grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                  <h3 className="font-black text-xl flex items-center gap-3 italic uppercase tracking-tighter">
                    <FaCalendarAlt className="text-amber-500" /> Transit Log
                  </h3>
                  <div className="space-y-10 relative pl-8 border-l-2 border-slate-800/50">
                    {order.timeline.map((step, i) => (
                      <div key={i} className="relative">
                        <div className={`absolute -left-[41px] w-5 h-5 rounded-full border-4 transition-colors duration-500 ${
                          step.status === "complete" ? "bg-amber-500 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]" : 
                          step.status === "active" ? "bg-slate-900 border-amber-500 animate-pulse" : "bg-slate-900 border-slate-800"
                        }`} />
                        <div>
                          <div className="flex justify-between items-center">
                            <h4 className={`font-black uppercase text-xs tracking-widest ${step.status === "active" ? "text-amber-500" : "text-slate-400"}`}>{step.step}</h4>
                            <span className="text-[9px] font-bold opacity-30 italic">{step.time}</span>
                          </div>
                          <p className="text-[11px] opacity-60 mt-1 font-bold leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white shadow-xl"}`}>
                    <h4 className="font-black text-[10px] uppercase tracking-[0.2em] mb-6 flex items-center gap-2 text-rose-500">
                      <FaMapMarkerAlt /> Destination Node
                    </h4>
                    <div className="space-y-3">
                      <p className="text-sm font-black uppercase text-amber-500">{order.customerName}</p>
                      <p className="text-[11px] font-bold opacity-60 italic leading-relaxed">
                        {order.deliveryAddress?.address}<br/>
                        {order.deliveryAddress?.upazila}, {order.deliveryAddress?.district}<br/>
                        {order.deliveryAddress?.city}
                      </p>
                      <div className="pt-4 border-t border-slate-800/30">
                        <p className="text-[8px] font-black uppercase opacity-30">Comms Link</p>
                        <p className="text-[11px] font-bold tracking-widest">{order.customerPhone}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={downloadInvoice} className="py-5 cursor-pointer rounded-2xl bg-amber-500 text-black font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all flex flex-col items-center gap-2 shadow-lg shadow-amber-500/10">
                      <FaFileInvoiceDollar size={18} /> Download Invoice
                    </button>
                    <button className={`py-5 cursor-pointer rounded-2xl border font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all flex flex-col items-center gap-2 ${isDarkMode ? "border-slate-800 bg-slate-900/50" : "bg-white"}`}>
                      <FaHeadset size={18} /> Support
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 flex flex-col items-center text-center">
               {error ? (
                  <div className="text-rose-500 font-black uppercase tracking-[0.3em] mb-4 border border-rose-500/20 p-4 rounded-xl bg-rose-500/5">
                    {error}
                  </div>
               ) : (
                 <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
                   <FaBox className="text-[12rem] text-slate-800/20 mb-10" />
                 </motion.div>
               )}
               <h2 className="text-5xl font-black italic tracking-tighter uppercase mb-6">Terminal <span className="text-amber-500">Tracking</span></h2>
               <p className="max-w-md text-[10px] font-bold opacity-40 uppercase tracking-[0.3em] leading-loose">Enter your logistics ID above to initialize a real-time data link with the delivery fleet.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default OrderTracking;