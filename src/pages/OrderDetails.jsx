import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase/Firebase';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useTheme } from "../context/ThemeContext";
import { 
  FaUser, FaMapMarkerAlt, FaArrowLeft, 
  FaFilePdf, FaSpinner, FaPhoneAlt, FaEnvelope, FaLock
} from "react-icons/fa";

// 1. IMPORT YOUR LOGO
import logo from "../assets/arafatimage.png"; 

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const OrderDetails = () => {
  const { isDarkMode } = useTheme();
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // --- AUTH PERSISTENCE ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchOrder = async () => {
      if (authLoading || !user || !orderId) return;
      try {
        const docRef = doc(db, "orders", orderId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Security Check: Only allow owner to view
          if (data.customerEmail === user.email) {
            setOrder({ id: docSnap.id, ...data });
          }
        }
      } catch (err) {
        console.error("Cloud Access Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, user, authLoading]);

  // --- ADDRESS RESOLVER ---
  const resolveAddress = (data) => {
    if (!data?.deliveryAddress) return "No Physical Address Found";
    const { address, upazila, district, city } = data.deliveryAddress;
    return `${address}, ${upazila}, ${district}, ${city}`;
  };

  // --- PDF GENERATOR ---
  const generateInvoice = () => {
    if (!order) return;
    const doc = new jsPDF();
    const date = order.createdAt?.seconds 
      ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() 
      : new Date().toLocaleDateString();

    // 1. Header & Logo
    try {
      doc.addImage(logo, 'PNG', 14, 12, 25, 25);
    } catch (e) {
      console.warn("Logo failed to load.", e);
    }

    doc.setFontSize(22);
    doc.setTextColor(245, 158, 11); // AT-mart Amber
    doc.setFont("helvetica", "bold");
    doc.text("AT-mart OFFICIAL INVOICE", 45, 22);
    
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text(`TRANSACTION ID: ${order.displayId || order.id}`, 45, 28);
    doc.text(`DATE ISSUED: ${date}`, 45, 33);

    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(0.5);
    doc.line(14, 45, 196, 45);

    // 2. Client Information
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO / SHIP TO:", 14, 55);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    doc.text(`Customer Name: ${order.customerName}`, 14, 62);
    doc.text(`Email Address: ${order.customerEmail}`, 14, 67);
    doc.text(`Contact Phone: ${order.customerPhone}`, 14, 72);
    
    const address = resolveAddress(order);
    const splitAddress = doc.splitTextToSize(`Address: ${address}`, 100);
    doc.text(splitAddress, 14, 77);

    // 3. Items Table
    autoTable(doc, {
      startY: 95,
      head: [["ITEM DESCRIPTION", "UNIT PRICE", "QTY", "SUBTOTAL"]],
      body: (order.items || []).map(item => [
        item.name.toUpperCase(),
        `$${Number(item.price).toFixed(2)}`,
        item.quantity,
        `$${(Number(item.price) * item.quantity).toFixed(2)}`
      ]),
      headStyles: { fillColor: [245, 158, 11], textColor: [0, 0, 0], fontStyle: 'bold' },
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 }
    });

    // 4. Summary
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(245, 158, 11);
    doc.text(`TOTAL PAYABLE: $${Number(order.totalAmount).toFixed(2)}`, 196, finalY, { align: 'right' });

    // 5. Signature Section
    const sigY = finalY + 45; 
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.2);
    
    // Client Side
    doc.line(14, sigY, 74, sigY); 
    doc.setFontSize(9);
    doc.setTextColor(80);
    doc.text("CLIENT SIGNATURE", 14, sigY + 5);

    // Authorized Side
    doc.line(136, sigY, 196, sigY);
    doc.text("AUTHORIZED SIGNATORY", 136, sigY + 5);
    
    // Bottom Disclaimer
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("This is a system-generated invoice valid for AT-mart logistics.", 105, 285, { align: 'center' });

    doc.save(`AT_MART_INV_${order.displayId}.pdf`);
  };

  if (authLoading || loading) return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${isDarkMode ? "bg-black" : "bg-slate-50"}`}>
      <FaSpinner className="animate-spin text-4xl text-amber-500" />
      <p className="mt-4 text-[10px] font-black uppercase tracking-widest opacity-40">Decrypting Invoice...</p>
    </div>
  );

  if (!order) return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${isDarkMode ? "bg-black text-white" : "bg-white"}`}>
      <FaLock className="text-amber-500 text-4xl mb-4" />
      <h2 className="font-black uppercase italic">Access Restricted</h2>
      <button onClick={() => navigate(-1)} className="mt-4 text-amber-500 text-[10px] font-bold uppercase tracking-widest">Return to Dashboard</button>
    </div>
  );

  return (
    <div className={`min-h-screen pt-24 p-6 transition-colors duration-500 ${isDarkMode ? "bg-black text-white" : "bg-slate-50 text-slate-900"}`}>
      <div className="max-w-6xl mx-auto">
        
        {/* ACTION HEADER */}
        <div className="flex justify-between items-center mb-12">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-amber-500 font-black text-[10px] uppercase tracking-widest hover:opacity-70 transition-all">
            <FaArrowLeft /> Back
          </button>
          <button onClick={generateInvoice} className="px-8 py-4 cursor-pointer bg-amber-500 text-black rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-amber-500/30 hover:scale-105 transition-transform active:scale-95">
            <FaFilePdf /> Download invoice
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* MAIN RECEIPT COLUMN */}
          <div className="lg:col-span-8">
            <div className={`p-8 md:p-12 rounded-[3.5rem] border ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white border-slate-100 shadow-2xl"}`}>
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
                <div>
                  <img src={logo} alt="AT" className="w-20 h-20 mb-6 object-contain" />
                  <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">
                    Node: <span className="text-amber-500">{order.displayId}</span>
                  </h1>
                </div>
                <div className="px-5 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl text-[10px] font-black uppercase tracking-tighter">
                   Authenticated Status: {order.status}
                </div>
              </div>

              {/* ITEM LIST */}
              <div className="space-y-4">
                {(order.items || []).map((item, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-6 rounded-[2rem] border ${isDarkMode ? "bg-black/40 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white rounded-2xl p-1 shadow-inner">
                        <img src={item.img} className="w-full h-full object-contain" alt={item.name} />
                      </div>
                      <div>
                        <h4 className="font-black uppercase text-xs italic tracking-tight">{item.name}</h4>
                        <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest">{item.quantity} UNITS @ ${item.price}</p>
                      </div>
                    </div>
                    <p className="font-black text-amber-500 italic text-lg">${(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-10 border-t border-dashed border-slate-800/30 text-right">
                <p className="text-[10px] font-black uppercase opacity-30 tracking-widest">Final Valuation</p>
                <p className="text-6xl md:text-7xl font-black italic text-amber-500 tracking-tighter">${Number(order.totalAmount).toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* CUSTOMER SIDEBAR */}
          <div className="lg:col-span-4 space-y-6">
             <div className={`p-8 rounded-[3rem] border ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white shadow-xl"}`}>
               <h3 className="text-[10px] font-black uppercase text-amber-500 mb-6 flex items-center gap-2"><FaUser /> Client Profile</h3>
               <p className="text-lg font-black uppercase italic leading-none">{order.customerName}</p>
               <div className="mt-6 space-y-3 opacity-60 text-[11px] font-bold">
                 <p className="flex items-center gap-3"><FaEnvelope className="text-amber-500" /> {order.customerEmail}</p>
                 <p className="flex items-center gap-3"><FaPhoneAlt className="text-amber-500" /> {order.customerPhone}</p>
               </div>
             </div>
             
             <div className={`p-8 rounded-[3rem] border ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white shadow-xl"}`}>
               <h3 className="text-[10px] font-black uppercase text-rose-500 mb-6 flex items-center gap-2"><FaMapMarkerAlt /> Delivery Node</h3>
               <div className={`p-5 rounded-3xl border ${isDarkMode ? "bg-black/50 border-slate-800" : "bg-slate-50 border-slate-200 shadow-inner"}`}>
                 <p className="text-[11px] font-black uppercase italic leading-relaxed tracking-wide">
                   {resolveAddress(order)}
                 </p>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetails;