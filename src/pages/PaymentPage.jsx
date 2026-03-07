import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider"; 
import { 
  FaPaypal, FaGoogle, FaApple, 
  FaCheckCircle, FaArrowLeft, FaEnvelope, FaLock,
  FaUser, FaPhoneAlt, FaMapMarkerAlt,
  FaGlobe, FaMapPin, FaCity // Added new icons
} from "react-icons/fa";

const PaymentPage = () => {
  const { isDarkMode } = useTheme();
  const { cartItems, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [confirmedOrderDetails, setConfirmedOrderDetails] = useState({
    items: [],
    total: 0
  });

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState("");
  
  const [email, setEmail] = useState(currentUser?.email || "");
  const [shippingDetails, setShippingDetails] = useState({
    fullName: currentUser?.displayName || "",
    phone: "",
    address: "",
    district: "", // Added
    upazila: "",  // Added
    city: ""      // Added
  });
  const [emailVerified, setEmailVerified] = useState(false);

  const paymentMethods = [
    { id: "visa", name: "Visa", icon: "💳" },
    { id: "mastercard", name: "Mastercard", icon: "💳" },
    { id: "paypal", name: "PayPal", icon: <FaPaypal className="text-blue-500" /> },
    { id: "googlepay", name: "Google Pay", icon: <FaGoogle className="text-red-500" /> },
    { id: "applepay", name: "Apple Pay", icon: <FaApple /> },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleEmailVerify = () => {
    // Updated Validation to include new fields
    if (
      !email.includes("@") || 
      !shippingDetails.fullName || 
      !shippingDetails.phone || 
      !shippingDetails.address ||
      !shippingDetails.district ||
      !shippingDetails.upazila ||
      !shippingDetails.city
    ) {
        alert("Please complete all delivery fields, including District, Upazila, and City.");
        return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setEmailVerified(true);
      setIsProcessing(false);
    }, 1200);
  };

  const handleConfirmOrder = () => {
    if (!selectedMethod || !emailVerified) return;
    setIsProcessing(true);

    setTimeout(() => {
      const newOrderId = `AT-${Math.floor(10000000 + Math.random() * 90000000)}`;
      
      const finalOrder = {
        orderId: newOrderId,
        userId: currentUser?.uid || "guest",
        date: new Date().toISOString(),
        total: totalAmount,
        status: "Processing",
        items: [...cartItems],
        paymentMethod: selectedMethod,
        customer: {
          email: email,
          ...shippingDetails
        },
      };

      setConfirmedOrderDetails({
        items: [...cartItems],
        total: totalAmount
      });
      setOrderId(newOrderId);

      const existingOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");
      localStorage.setItem("myOrders", JSON.stringify([finalOrder, ...existingOrders]));

      setIsProcessing(false);
      setOrderConfirmed(true);
      clearCart();
    }, 2500);
  };

  if (orderConfirmed) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${isDarkMode ? "bg-[#05070a]" : "bg-slate-50"}`}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`max-w-lg w-full rounded-[3rem] p-8 text-center border ${
            isDarkMode ? "bg-[#0d1117] border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.1)]" : "bg-white border-emerald-500/30 shadow-2xl"
          }`}
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }}>
            <FaCheckCircle className="text-6xl text-emerald-500 mx-auto mb-4" />
          </motion.div>
          
          <h1 className="text-3xl font-black mb-1 italic uppercase tracking-tighter text-emerald-500">Transfer Successful</h1>
          <p className="text-slate-500 font-mono text-xs mb-8 uppercase tracking-[0.3em]">AUTH-ID: {orderId}</p>

          <div className={`${isDarkMode ? "bg-black/40" : "bg-slate-50"} rounded-[2rem] p-6 mb-8 border ${isDarkMode ? "border-slate-800" : "border-slate-200"} text-left`}>
            <h3 className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-4 border-b border-slate-700/30 pb-2">Acquisition Manifest</h3>
            
            <div className="space-y-4 mb-6">
              {confirmedOrderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start text-[11px] font-bold uppercase tracking-wider">
                  <div className="flex flex-col">
                    <span className={isDarkMode ? "text-white" : "text-slate-900"}>{item.name}</span>
                    <span className="text-[9px] opacity-50 italic">Verified Asset</span>
                  </div>
                  <span className="text-amber-500 font-black">${item.price}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-700/30 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-[0.2em]">Total Credits Transferred</span>
                <span className="text-3xl font-black text-amber-500 italic tracking-tighter">${confirmedOrderDetails.total}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center px-6 mb-10 text-left border-l-2 border-amber-500/30">
            <div>
              <p className="text-[8px] font-black opacity-40 uppercase tracking-tighter">Target Recipient</p>
              <p className="text-[10px] font-bold uppercase">{shippingDetails.fullName}</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-black opacity-40 uppercase tracking-tighter">Signal Code</p>
              <p className="text-[10px] font-bold uppercase">{shippingDetails.phone}</p>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => navigate(`/ordertracking/${orderId}`)} 
              className="w-full py-5 bg-amber-500 hover:bg-amber-600 text-black font-black rounded-2xl transition-all cursor-pointer uppercase text-[10px] tracking-widest shadow-lg shadow-amber-500/20"
            >
              Track Order
            </button>
            <button 
              onClick={() => navigate("/")} 
              className={`w-full py-5 border font-black rounded-2xl cursor-pointer transition-all uppercase text-[10px] tracking-widest ${
                isDarkMode ? "border-slate-700 hover:bg-slate-800 text-white" : "border-slate-300 hover:bg-slate-100 text-slate-700"
              }`}
            >
              Return to Base
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-28 pb-20 transition-colors duration-500 ${isDarkMode ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900"}`}>
      <div className="max-w-2xl mx-auto px-6">
        <button onClick={() => navigate("/cartpage")} className="flex items-center gap-2 text-amber-500 mb-8 font-black cursor-pointer hover:text-amber-400 transition-colors text-xs uppercase tracking-widest">
          <FaArrowLeft /> Back to Home
        </button>

        <h1 className="text-5xl font-black italic tracking-tighter mb-2 uppercase leading-none">Secure <span className="text-amber-500">Checkout</span></h1>
        <p className="text-[10px] opacity-40 mb-10 tracking-[0.3em] uppercase font-bold">Protocol: End-to-End Encryption</p>

        <div className={`rounded-[2.5rem] p-8 mb-8 border ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white shadow-xl border-slate-100"}`}>
          <h3 className="font-black text-sm mb-6 uppercase italic tracking-widest text-amber-500">Summary</h3>
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={item.cartId} className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="opacity-50">{item.name}</span>
                <span>${item.price}</span>
              </div>
            ))}
            {cartItems.length === 0 && <p className="text-xs opacity-50">MANIFEST EMPTY</p>}
          </div>
          <div className="border-t border-slate-800/50 pt-6 flex justify-between font-black text-3xl italic tracking-tighter">
            <span>TOTAL</span>
            <span className="text-amber-500">${totalAmount}</span>
          </div>
        </div>

        {!emailVerified ? (
          <div className={`rounded-[2.5rem] p-8 border ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white shadow-xl border-slate-100"}`}>
            <div className="flex items-center gap-3 mb-8 text-amber-500">
              <FaMapMarkerAlt />
              <h3 className="font-black text-sm uppercase italic tracking-widest">Delivery Protocol</h3>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                <input
                  name="fullName"
                  type="text"
                  placeholder="RECIPIENT FULL NAME"
                  value={shippingDetails.fullName}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-6 py-5 rounded-2xl outline-none text-[10px] font-black tracking-widest border transition-all ${
                    isDarkMode ? "bg-black/30 border-slate-800 focus:border-amber-500" : "bg-slate-50 border-slate-200 focus:border-amber-500 text-black"
                  }`}
                />
              </div>

              <div className="relative">
                <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                <input
                  type="email"
                  placeholder="COMMUNICATION EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-12 pr-6 py-5 rounded-2xl outline-none text-[10px] font-black tracking-widest border transition-all ${
                    isDarkMode ? "bg-black/30 border-slate-800 focus:border-amber-500" : "bg-slate-50 border-slate-200 focus:border-amber-500 text-black"
                  }`}
                />
              </div>

              <div className="relative">
                <FaPhoneAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                <input
                  name="phone"
                  type="tel"
                  placeholder="CONTACT SIGNAL (PHONE)"
                  value={shippingDetails.phone}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-6 py-5 rounded-2xl outline-none text-[10px] font-black tracking-widest border transition-all ${
                    isDarkMode ? "bg-black/30 border-slate-800 focus:border-amber-500" : "bg-slate-50 border-slate-200 focus:border-amber-500 text-black"
                  }`}
                />
              </div>

              <div className="relative">
                <FaMapMarkerAlt className="absolute left-5 top-6 text-slate-500 text-xs" />
                <textarea
                  name="address"
                  placeholder="PHYSICAL DROP-OFF COORDINATES (STREET/HOUSE)"
                  value={shippingDetails.address}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full pl-12 pr-6 py-5 rounded-2xl outline-none text-[10px] font-black tracking-widest border resize-none transition-all ${
                    isDarkMode ? "bg-black/30 border-slate-800 focus:border-amber-500" : "bg-slate-50 border-slate-200 focus:border-amber-500 text-black"
                  }`}
                />
              </div>

              {/* NEW: Logistics Grid (District, Upazila, City) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <FaGlobe className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                  <input
                    name="district"
                    type="text"
                    placeholder="DISTRICT"
                    value={shippingDetails.district}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-6 py-5 rounded-2xl outline-none text-[10px] font-black tracking-widest border transition-all ${
                      isDarkMode ? "bg-black/30 border-slate-800 focus:border-amber-500" : "bg-slate-50 border-slate-200 focus:border-amber-500 text-black"
                    }`}
                  />
                </div>

                <div className="relative">
                  <FaMapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                  <input
                    name="upazila"
                    type="text"
                    placeholder="UPAZILA"
                    value={shippingDetails.upazila}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-6 py-5 rounded-2xl outline-none text-[10px] font-black tracking-widest border transition-all ${
                      isDarkMode ? "bg-black/30 border-slate-800 focus:border-amber-500" : "bg-slate-50 border-slate-200 focus:border-amber-500 text-black"
                    }`}
                  />
                </div>

                <div className="relative">
                  <FaCity className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
                  <input
                    name="city"
                    type="text"
                    placeholder="CITY / HUB"
                    value={shippingDetails.city}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-6 py-5 rounded-2xl outline-none text-[10px] font-black tracking-widest border transition-all ${
                      isDarkMode ? "bg-black/30 border-slate-800 focus:border-amber-500" : "bg-slate-50 border-slate-200 focus:border-amber-500 text-black"
                    }`}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleEmailVerify}
              disabled={isProcessing}
              className="w-full mt-8 py-5 rounded-2xl bg-amber-500 text-black font-black text-[10px] tracking-[0.3em] uppercase transition-all cursor-pointer hover:bg-amber-400 disabled:opacity-50"
            >
              {isProcessing ? "VALIDATING..." : "AUTHORIZE DELIVERY DATA"}
            </button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="font-black text-sm mb-6 flex items-center gap-3 italic uppercase tracking-widest">
              <FaLock className="text-emerald-500" /> Transfer Method
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex flex-col items-center gap-4 hover:scale-105 ${
                    selectedMethod === method.id
                      ? "border-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                      : isDarkMode
                      ? "border-slate-800 bg-black/20"
                      : "border-slate-100 bg-white shadow-sm text-black"
                  }`}
                >
                  <div className="text-3xl">{method.icon}</div>
                  <div className="font-black text-[9px] tracking-widest uppercase">{method.name}</div>
                </div>
              ))}
            </div>

            <button
              onClick={handleConfirmOrder}
              disabled={!selectedMethod || isProcessing}
              className={`w-full py-6 rounded-[2rem] font-black text-xl italic transition-all cursor-pointer uppercase tracking-tighter ${
                selectedMethod && !isProcessing
                  ? "bg-amber-500 hover:bg-amber-600 text-black shadow-2xl"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              {isProcessing ? "PROCESSING..." : `TRANSFER $${totalAmount} CREDITS`}
            </button>
            
            <button 
              onClick={() => setEmailVerified(false)}
              className="w-full mt-4 text-[9px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity"
            >
              Modify Delivery Intel
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;