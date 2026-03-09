import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../provider/AuthProvider";
import { db } from "../firebase/Firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { 
  FaCheckCircle, FaArrowLeft, FaShieldAlt, FaSync, 
  FaMapMarkerAlt, FaCreditCard, FaMobileAlt, FaBitcoin, FaGlobe, FaChartLine,
  FaTicketAlt, FaLock
} from "react-icons/fa";

const PaymentPage = () => {
  const { isDarkMode } = useTheme();
  const { clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // FIX: Safely extract orderData with fallbacks to prevent "undefined" crashes
  const orderData = location.state?.orderData || null;

  // --- STATES ---
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponStatus, setCouponStatus] = useState(null);

  const [shippingDetails, setShippingDetails] = useState({
    fullName: currentUser?.displayName || "",
    phone: "",
    address: "",
    district: "",
    upazila: "",
    city: ""
  });

  // Redirect if accessed directly without cart data
  useEffect(() => {
    if (!orderData && !orderConfirmed) {
      navigate("/cartpage");
    }
  }, [orderData, navigate, orderConfirmed]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [name]: value }));
  };

  const applyCoupon = () => {
    setIsApplyingCoupon(true);
    setCouponStatus(null);
    setTimeout(() => {
      if (couponCode.toUpperCase() === "NEO2026") {
        setDiscount(25); 
        setCouponStatus("success");
      } else {
        setCouponStatus("error");
        setDiscount(0);
      }
      setIsApplyingCoupon(false);
    }, 800);
  };

  const subtotalFromCart = Number(orderData?.summary?.total) || 0;
  const finalTotal = Math.max(0, subtotalFromCart - discount);

  // --- FIREBASE SUBMISSION ---
  const handleFinalCommit = async () => {
    const { fullName, phone, address, district, upazila, city } = shippingDetails;
    
    if (!fullName || !phone || !address || !district || !upazila || !city) {
      alert("FIELD ERROR: All logistics coordinates required.");
      return;
    }

    setIsProcessing(true);
    const generatedId = `AT-${Math.floor(100000 + Math.random() * 900000)}`;

    const finalOrder = {
      displayId: generatedId,
      userId: currentUser?.uid || "guest_user",
      customerName: fullName,
      customerEmail: currentUser?.email || "anonymous",
      customerPhone: phone,
      deliveryAddress: { address, district, upazila, city },
      items: (orderData.items || []).map(item => ({
        id: item.id || "unknown",
        name: item.name || "Hardware Node",
        price: Number(item.price) || 0,
        img: item.img || "📦",
        quantity: item.quantity || 1
      })),
      totalAmount: Number(finalTotal.toFixed(2)),
      paymentMethod: paymentMethod.toUpperCase(),
      status: "Confirmed",
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "orders"), finalOrder);
      setOrderId(generatedId);
      setIsProcessing(false);
      setOrderConfirmed(true);
      clearCart();
    } catch (error) {
      console.error("Sync Error:", error);
      alert("CLOUD SYNC ERROR: " + error.message);
      setIsProcessing(false);
    }
  };

  // SUCCESS VIEW
if (orderConfirmed) {
  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${isDarkMode ? "bg-[#05070a]" : "bg-slate-50"}`}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        className={`max-w-md w-full rounded-[3rem] p-12 text-center border relative overflow-hidden ${
          isDarkMode 
          ? "bg-[#0d1117] border-emerald-500/20 shadow-[0_0_60px_-15px_rgba(16,185,129,0.15)]" 
          : "bg-white border-slate-200 shadow-2xl"
        }`}
      >
        {/* SUCCESS ICON */}
        <motion.div 
          initial={{ rotate: -20, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", damping: 12, delay: 0.2 }}
          className="w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-emerald-500/20"
        >
          <FaCheckCircle className="text-5xl text-emerald-500" />
        </motion.div>
        
        {/* HEADER */}
        <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-2">
          Order <span className="text-emerald-500">Confermed</span>
        </h1>
        <p className="text-[10px] font-mono opacity-40 mb-10 uppercase tracking-[0.4em]">
          NODE_ID: {orderId}
        </p>

        {/* ACTION BUTTONS */}
        <div className="space-y-4">
          {/* PRIMARY: TRACKING */}
          <button 
            onClick={() => navigate(`/ordertracking/${orderId}`)} 
            className="w-full py-5 bg-emerald-500 text-black font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-emerald-400 hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20"
          >
            <FaChartLine /> Order Tracking
          </button>

          {/* SECONDARY: RETURN */}
          <button 
            onClick={() => navigate("/")} 
            className={`w-full py-5 font-black rounded-2xl uppercase text-[10px] tracking-widest transition-all cursor-pointer flex items-center justify-center gap-3 border ${
              isDarkMode 
              ? "bg-white/5 border-white/10 text-white hover:bg-white/10" 
              : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <FaArrowLeft size={10} /> Return to Home
          </button>
        </div>

        {/* SUBTLE DECORATION */}
        {isDarkMode && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-30" />
        )}
      </motion.div>
    </div>
  );
}

  return (
    <div className={`min-h-screen pt-28 pb-20 transition-colors ${isDarkMode ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900"}`}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT: INPUTS */}
        <div className="lg:col-span-7 space-y-8">
          <header>
             <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-amber-500 font-black text-[10px] uppercase tracking-widest mb-6 cursor-pointer opacity-60 hover:opacity-100">
               <FaArrowLeft /> Abort Transaction
             </button>
             <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">Checkout <span className="text-amber-500">Portal</span></h1>
          </header>

          {/* SHIPPING FORM */}
          <div className={`p-10 rounded-[3rem] border ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white shadow-xl border-slate-100"}`}>
            <h3 className="text-[10px] font-black uppercase text-amber-500 mb-8 flex items-center gap-2 tracking-widest">
              <FaMapMarkerAlt /> 01. Logistics Coordinates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input name="fullName" placeholder="RECIPIENT_NAME" value={shippingDetails.fullName} onChange={handleInputChange} className={`w-full p-5 rounded-2xl outline-none text-[10px] font-black border tracking-widest ${isDarkMode ? "bg-black/40 border-slate-800 focus:border-amber-500" : "bg-slate-50 border-slate-200"}`} />
              <input name="phone" placeholder="PHONE_NUMBER" value={shippingDetails.phone} onChange={handleInputChange} className={`w-full p-5 rounded-2xl outline-none text-[10px] font-black border tracking-widest ${isDarkMode ? "bg-black/40 border-slate-800 focus:border-amber-500" : "bg-slate-50 border-slate-200"}`} />
            </div>
            <textarea name="address" placeholder="PHYSICAL_LOCATION_STREET" value={shippingDetails.address} onChange={handleInputChange} rows="2" className={`w-full p-5 rounded-2xl outline-none text-[10px] font-black border tracking-widest resize-none mb-4 ${isDarkMode ? "bg-black/40 border-slate-800" : "bg-slate-50 border-slate-200"}`} />
            <div className="grid grid-cols-3 gap-3">
              {['district', 'upazila', 'city'].map((field) => (
                <input key={field} name={field} placeholder={field.toUpperCase()} value={shippingDetails[field]} onChange={handleInputChange} className={`p-4 rounded-xl outline-none text-[9px] font-black border tracking-widest ${isDarkMode ? "bg-black/40 border-slate-800" : "bg-slate-50"}`} />
              ))}
            </div>
          </div>

          {/* PAYMENT METHODS */}
        <section className={`p-10 rounded-[3rem] border transition-all duration-500 ${
  isDarkMode ? "bg-[#0d1117] border-slate-800 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]" : "bg-white shadow-xl border-slate-100"
}`}>
  {/* SECTION HEADER */}
  <div className="flex justify-between items-center mb-8">
    <h3 className="text-[10px] font-black uppercase text-amber-500 flex items-center gap-2 tracking-[0.3em]">
      <FaCreditCard className="animate-pulse" /> 02. Payment Protocol
    </h3>
    <div className="flex items-center gap-2">
      <span className="text-[8px] font-bold opacity-40 uppercase tracking-widest">Security: AES-256</span>
      <FaLock size={8} className="text-emerald-500" />
    </div>
  </div>
  
  {/* METHOD GRID */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    {[
      { id: "card", icon: <FaCreditCard />, label: "CREDIT", desc: "Visa / Master" },
      { id: "mobile", icon: <FaMobileAlt />, label: "MOBILE", desc: "MFS / eWallet" },
      { id: "crypto", icon: <FaBitcoin />, label: "CRYPTO", desc: "STP / Nodes" },
      { id: "bank", icon: <FaGlobe />, label: "BANK", desc: "Direct Wire" }
    ].map((m) => (
      <button 
        key={m.id} 
        onClick={() => setPaymentMethod(m.id)} 
        className={`group relative p-6 rounded-3xl border flex flex-col items-start gap-1 transition-all duration-300 cursor-pointer overflow-hidden ${
          paymentMethod === m.id 
          ? "border-amber-500 bg-amber-500/5 text-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.1)]" 
          : `opacity-50 grayscale hover:grayscale-0 hover:opacity-100 ${isDarkMode ? "border-slate-800 bg-black/20" : "border-slate-200 bg-slate-50"}`
        }`}
      >
        <span className={`text-2xl mb-2 transition-transform duration-500 ${paymentMethod === m.id ? "scale-110" : "group-hover:scale-110"}`}>
          {m.icon}
        </span>
        <span className="text-[10px] font-black tracking-widest leading-none">{m.label}</span>
        <span className="text-[7px] font-bold opacity-40 uppercase tracking-tighter">{m.desc}</span>

        {/* ACTIVE INDICATOR DOT */}
        {paymentMethod === m.id && (
          <motion.div layoutId="activeDot" className="absolute top-4 right-4 w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_10px_#f59e0b]" />
        )}
      </button>
    ))}
  </div>

  {/* DYNAMIC INPUT TERMINAL */}
  <AnimatePresence mode="wait">
    <motion.div
      key={paymentMethod}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`p-6 rounded-2xl border ${isDarkMode ? "bg-black/40 border-slate-800" : "bg-slate-50 border-slate-200"}`}
    >
      {paymentMethod === 'card' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Secure Card Entry</span>
            <div className="flex gap-2 opacity-30 italic text-[10px] font-black">VISA / MASTERCARD</div>
          </div>
          <input type="text" placeholder="XXXX XXXX XXXX XXXX" className={`w-full p-4 rounded-xl text-[10px] font-black border outline-none focus:border-amber-500 transition-colors ${isDarkMode ? "bg-black border-slate-800" : "bg-white"}`} />
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="MM / YY" className={`p-4 rounded-xl text-[10px] font-black border outline-none focus:border-amber-500 transition-colors ${isDarkMode ? "bg-black border-slate-800" : "bg-white"}`} />
            <input type="password" placeholder="CVC" className={`p-4 rounded-xl text-[10px] font-black border outline-none focus:border-amber-500 transition-colors ${isDarkMode ? "bg-black border-slate-800" : "bg-white"}`} />
          </div>
        </div>
      )}

      {paymentMethod === 'mobile' && (
        <div className="space-y-4">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">MFS Provider Selection</span>
          <div className="flex gap-4">
            <select className={`flex-1 p-4 rounded-xl text-[10px] font-black border outline-none ${isDarkMode ? "bg-black border-slate-800" : "bg-white"}`}>
              <option>BKASH_TERMINAL</option>
              <option>NAGAD_NODE</option>
              <option>ROCKET_PAY</option>
            </select>
            <input type="text" placeholder="01XXX XXXXXX" className={`flex-[2] p-4 rounded-xl text-[10px] font-black border outline-none focus:border-amber-500 ${isDarkMode ? "bg-black border-slate-800" : "bg-white"}`} />
          </div>
        </div>
      )}

      {paymentMethod === 'crypto' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
             <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Wallet Address (ERC-20/BEP-20)</span>
             <span className="text-[8px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold">LIVE FEED</span>
          </div>
          <input readOnly value="0x71C7656EC7ab88b098defB751B7401B5f6d8976F" className={`w-full p-4 rounded-xl text-[9px] font-mono border outline-none opacity-60 ${isDarkMode ? "bg-black border-slate-800" : "bg-white"}`} />
          <p className="text-[8px] font-bold opacity-30 text-center uppercase tracking-widest italic">Send exact amount to the node address above to initialize sync.</p>
        </div>
      )}

      {paymentMethod === 'bank' && (
        <div className="text-center py-4">
          <FaGlobe className="mx-auto text-amber-500 mb-2 animate-spin-slow" />
          <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Connecting to Global Banking Swift...</p>
        </div>
      )}
    </motion.div>
  </AnimatePresence>
</section>


        </div>

        {/* RIGHT: SUMMARY */}
        <div className="lg:col-span-5">
          <div className={`sticky top-32 p-10 rounded-[3rem] border ${isDarkMode ? "bg-[#0d1117] border-slate-800 shadow-2xl" : "bg-white shadow-2xl"}`}>
            <h3 className="text-xl font-black italic uppercase mb-8 flex items-center gap-3">
              <FaGlobe className="text-amber-500" /> Summary
            </h3>
            
            <div className="space-y-4 mb-8 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
               {orderData?.items.map((item, idx) => (
                 <div key={idx} className="flex justify-between text-[10px] font-bold uppercase opacity-60">
                   <span>{item.name} <span className="text-[8px] opacity-40">x{item.quantity || 1}</span></span>
                   <span>${Number(item.price).toFixed(2)}</span>
                 </div>
               ))}
            </div>

            {/* VOUCHER PROTOCOL */}
            <div className="mb-10 pt-8 border-t border-slate-800/20">
              <div className="flex gap-2">
                <input placeholder="VOUCHER_CODE" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className={`flex-1 p-4 rounded-xl text-[10px] font-black border outline-none ${couponStatus === 'success' ? 'border-emerald-500' : isDarkMode ? 'bg-black border-slate-800' : 'bg-slate-50'}`} />
                <button onClick={applyCoupon} className="px-6 bg-amber-500 text-black rounded-xl text-[9px] font-black uppercase hover:scale-105 transition-transform cursor-pointer">Apply</button>
              </div>
            </div>

            <div className="space-y-3 mb-10">
              <div className="flex justify-between text-[10px] font-black uppercase opacity-40"><span>Subtotal</span><span>${subtotalFromCart.toFixed(2)}</span></div>
              {discount > 0 && <div className="flex justify-between text-[10px] font-black uppercase text-emerald-500"><span>Voucher</span><span>-${discount.toFixed(2)}</span></div>}
              <div className="flex justify-between items-end pt-4 border-t border-slate-800/10">
                <span className="text-[10px] font-black uppercase tracking-widest">Final Auth</span>
                <span className="text-5xl font-black text-amber-500 italic tracking-tighter">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={handleFinalCommit} disabled={isProcessing} className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all cursor-pointer ${isProcessing ? "bg-slate-800 opacity-50" : "bg-emerald-500 text-black hover:bg-emerald-400 shadow-xl shadow-emerald-500/20"}`}>
              {isProcessing ? <FaSync className="animate-spin" /> : <FaLock />}
              {isProcessing ? "INITIALIZING SYNC..." : "Deploy Transaction"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;