import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaBox, FaTruck, FaCheckCircle, FaMapMarkerAlt, 
  FaCalendarAlt, FaSearch, FaHeadset, FaPrint, FaFileInvoiceDollar,
  FaShieldAlt
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

// --- UPDATED IMPORTS ---
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 

const OrderTracking = () => {
  const { isDarkMode } = useTheme();
  const { orderId: urlOrderId } = useParams();
  
  const [searchId, setSearchId] = useState(urlOrderId || "");
  const [isSearching, setIsSearching] = useState(false);
  const [order, setOrder] = useState(null);

  const syncOrderData = (idToFind) => {
    if (!idToFind) return;
    const allOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");
    const foundOrder = allOrders.find(o => o.orderId.toLowerCase() === idToFind.toLowerCase());
    
    if (foundOrder) {
      const statusMap = { "Pending": 20, "Verified": 45, "Shipped": 75, "Delivered": 100 };
      setOrder({
        ...foundOrder,
        progress: statusMap[foundOrder.status] || 15,
        timeline: [
          { step: "Order Placed", desc: "System Confirmed", time: "Day 0", status: "complete" },
          { step: "Verified", desc: "Payment & Stock Checked", time: "Day 1", status: foundOrder.status !== "Pending" ? "complete" : "active" },
          { step: "Shipped", desc: "In transit to Destination", time: "Day 2", status: foundOrder.status === "Shipped" ? "active" : foundOrder.status === "Delivered" ? "complete" : "pending" },
          { step: "Delivered", desc: "Package Received", time: "Final", status: foundOrder.status === "Delivered" ? "complete" : "pending" },
        ]
      });
    } else {
      setOrder(null);
    }
  };

  useEffect(() => { if (urlOrderId) syncOrderData(urlOrderId); }, [urlOrderId]);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      syncOrderData(searchId);
      setIsSearching(false);
    }, 1000);
  };

  // --- UPDATED INVOICE GENERATION ---
  const downloadInvoice = () => {
    try {
      const doc = new jsPDF();
      const brand = "AT-mart";
      
      // Branding Header
      doc.setFontSize(22);
      doc.setTextColor(245, 158, 11); 
      doc.text(brand, 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Invoice ID: ${order.orderId || 'N/A'}`, 14, 30);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 35);

      // Shipping Info
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("Shipping Details:", 14, 50);
      doc.setFontSize(10);
      doc.text([
     `Customer: ${order.customer?.fullName || "Guest User"}`,
`Address: ${order.customer?.address || "No Address Provided"}`,
`Location: ${order.customer?.upazila ? order.customer.upazila + ", " : ""}${order.customer?.district || "No District"}`,
`City: ${order.customer?.city || "Bangladesh"}`,
`Phone: ${order.customer?.phone || "N/A"}`
      ], 14, 57);

      const tableData = (order.cartItems && order.cartItems.length > 0) 
        ? order.cartItems.map(item => [item.name, item.qty || 1, `$${item.price}`, `$${(item.qty || 1) * item.price}`])
        : [["Order Items", "1", `$${order.total}`, `$${order.total}`]];

      // --- CRITICAL FIX: Use autoTable(doc, { ... }) instead of doc.autoTable ---
      autoTable(doc, {
        startY: 85,
        head: [['Product Description', 'Qty', 'Unit Price', 'Total']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [245, 158, 11], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [250, 250, 250] },
      });

      const finalY = doc.lastAutoTable.finalY || 120;
      doc.setFontSize(14);
      doc.text(`Grand Total: $${order.total}`, 14, finalY + 15);
      
      doc.save(`AN_SHOP_${order.orderId}.pdf`);
      
    } catch (error) {
      console.error("Invoice Error:", error);
      alert("Error generating PDF. Please ensure jspdf-autotable is installed.");
    }
  };

  return (
    <div className={`min-h-screen pb-20 transition-all duration-500 ${isDarkMode ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900"}`}>
      
      <div className={`sticky top-0 z-50 backdrop-blur-2xl border-b py-6 px-6 ${isDarkMode ? "bg-[#0a0a0a]/90 border-slate-700" : "bg-white/90 border-slate-200 shadow-sm"}`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setOrder(null)}>
            <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-900 font-black text-xl shadow-lg shadow-amber-500/20">AN</div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">Arsenal Track</h1>
          </div>

          <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <div className={`flex items-center rounded-2xl border overflow-hidden transition-all ${isDarkMode ? "bg-[#0d1117] border-slate-700 focus-within:border-amber-500" : "bg-white border-slate-200 focus-within:border-amber-500"}`}>
              <FaSearch className="ml-4 text-slate-500" />
              <input 
                type="text"
                placeholder="Paste Order ID (e.g. ORD-1234)"
                className="flex-1 bg-transparent px-4 py-3 outline-none text-xs font-bold"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
              <button type="submit" className="bg-amber-500 text-slate-900 font-black px-6 py-3 text-[10px] uppercase hover:bg-amber-400 transition-colors">Locate</button>
            </div>
          </form>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 pt-12">
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-40">
              <div className="w-14 h-14 border-4 border-t-amber-500 border-slate-800 rounded-full animate-spin" />
              <p className="mt-6 text-[10px] font-black tracking-widest text-amber-500 uppercase">Connecting to AN-SHOP Global Nodes...</p>
            </motion.div>
          ) : order ? (
            <motion.div key="active" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              
              <div className={`p-10 rounded-[2.5rem] border relative overflow-hidden ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white border-transparent shadow-2xl"}`}>
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <FaTruck size={120} />
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
                   <div>
                      <div className="flex items-center gap-3 mb-6">
                        <span className="px-5 py-1.5 bg-amber-500 text-slate-900 text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-amber-500/30">
                          {order.status}
                        </span>
                        <span className="text-xs font-mono opacity-40">#{order.orderId}</span>
                      </div>
                      <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
                        Est: <span className="text-amber-500">{order.date}</span>
                      </h2>
                   </div>
                   <div className="text-left md:text-right">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Global Progress</p>
                      <div className="text-7xl font-black text-amber-500 italic leading-none">{order.progress}%</div>
                   </div>
                </div>

                <div className="h-3 bg-slate-800/50 rounded-full mt-12 overflow-hidden border border-slate-800/50">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${order.progress}%` }} 
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.5)]" 
                  />
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                  <h3 className="font-black text-xl flex items-center gap-3 italic uppercase tracking-tighter">
                    <FaCalendarAlt className="text-amber-500" /> Tracking History
                  </h3>
                  <div className="space-y-10 relative pl-8 border-l-2 border-slate-800/50">
                    {order.timeline.map((step, i) => (
                      <div key={i} className="relative">
                        <div className={`absolute -left-[41px] w-5 h-5 rounded-full border-4 ${
                          step.status === "complete" ? "bg-amber-500 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" : 
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
                    <h4 className="font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2 text-rose-500">
                      <FaMapMarkerAlt /> Delivery Hub
                    </h4>



                 <div className="space-y-1">
  <p className="text-sm font-black uppercase text-amber-500">
    {order.customer?.fullName || "Arafat User"}
  </p>
  
  {/* STREET ADDRESS */}
  <p className="text-xs font-bold leading-relaxed opacity-60 italic">
    {order.customer?.address || "Street Not Provided"}
  </p>

  {/* LOGISTICS LOCATION: UPAZILA, DISTRICT */}
  <p className="text-[11px] font-black uppercase tracking-wider opacity-80">
    {order.customer?.upazila && `${order.customer.upazila}, `}
    {order.customer?.district || "District Not Set"}
  </p>

  {/* PRIMARY HUB: CITY */}
  <p className="text-xs font-bold opacity-60 italic">
    {order.customer?.city || "City Not Set"}
  </p>

  <div className="mt-4 pt-4 border-t border-slate-800/50">
    <p className="text-[10px] font-black uppercase opacity-30">Contact Line</p>
    <p className="text-[11px] font-bold tracking-widest">
      {order.customer?.phone || "N/A"}
    </p>
  </div>
</div>


                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={downloadInvoice}
                      className="py-5 cursor-pointer rounded-2xl bg-amber-500 text-slate-900 font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex flex-col items-center gap-2"
                    >
                      <FaFileInvoiceDollar size={16} /> Invoice
                    </button>
                    <button 
                      onClick={() => window.location.href = `mailto:support@anshop.com?subject=Inquiry: ${order.orderId}`}
                      className={`py-5 cursor-pointer rounded-2xl border font-black text-[10px] uppercase tracking-widest hover:bg-amber-500 hover:text-slate-900 transition-all flex flex-col items-center gap-2 ${isDarkMode ? "border-slate-800 bg-slate-900/50" : "bg-white text-slate-900"}`}
                    >
                      <FaHeadset size={16} /> Support
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 flex flex-col items-center text-center">
              <div className="relative mb-12">
                <div className="absolute inset-0 bg-amber-500/20 blur-[80px] rounded-full" />
                <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
                  <FaBox className="text-9xl text-amber-500 relative" />
                </motion.div>
              </div>
              
              <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter mb-6 uppercase">
                Track Your <span className="text-amber-500 underline decoration-4 underline-offset-8">Packages</span>
              </h2>
              <p className="max-w-md text-xs font-bold opacity-40 uppercase tracking-[0.2em] leading-loose mb-12">
                Secure Logistics Monitoring for <span className="text-amber-500">AN-SHOP</span> Customers.
              </p>

              <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl opacity-50">
                 {[
                   { icon: <FaShieldAlt />, label: "Secure Link" },
                   { icon: <FaTruck />, label: "Live Transit" },
                   { icon: <FaPrint />, label: "PDF Invoice" }
                 ].map((item, idx) => (
                   <div key={idx} className={`p-8 rounded-[2rem] border flex flex-col items-center gap-4 ${isDarkMode ? "border-slate-800 bg-slate-900/30" : "bg-white border-slate-100"}`}>
                      <span className="text-2xl text-amber-500">{item.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                   </div>
                 ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default OrderTracking;