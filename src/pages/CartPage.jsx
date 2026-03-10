// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Link, useNavigate } from "react-router-dom";
// import { useTheme } from "../context/ThemeContext";
// import { useCart } from "../context/CartContext";
// import { 
//   FaTrash, FaPlus, FaMinus, FaArrowLeft, FaShieldAlt, 
//   FaTruck, FaFileInvoiceDollar, FaShoppingCart, FaCheckCircle, FaTicketAlt 
// } from "react-icons/fa";

// const CartPage = () => {
//   const { isDarkMode } = useTheme();
// // Top of CartPage.jsx
// const { cartItems, removeFromCart, addToCart, clearCart, discount, applyCoupon } = useCart();
//   const navigate = useNavigate();

//   // Local state for coupon input
//   const [couponInput, setCouponInput] = useState("");
//   const [couponStatus, setCouponStatus] = useState({ msg: "", isError: false });

//   // ─── CALCULATIONS ──────────────────────────────────────────
//   const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  
//   // Apply discount from context
//   const discountAmount = subtotal * (discount || 0); 
//   const discountedSubtotal = subtotal - discountAmount;
  
//   const tax = discountedSubtotal * 0.08; // 8% Tax
//   const shipping = subtotal > 500 ? 0 : 25; // Shipping based on original subtotal
//   const total = discountedSubtotal + tax + shipping;

//   const handleApplyCoupon = () => {
//     if (!couponInput) return;
//     const result = applyCoupon(couponInput); // Calls function in your CartContext
//     setCouponStatus({ 
//       msg: result.success ? "PROTOCOL ACCEPTED: -15%" : "INVALID ACCESS KEY", 
//       isError: !result.success 
//     });
//   };

//   if (cartItems.length === 0) {
//     return (
//       <div className={`min-h-screen pt-40 flex flex-col items-center justify-center px-6 transition-colors ${
//         isDarkMode ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900"
//       }`}>
//         <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
//           <div className="text-9xl opacity-10 mb-8">🛒</div>
//           <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Arsenal Empty</h2>
//           <p className="opacity-40 font-bold uppercase text-[10px] tracking-[0.3em] mb-8">No hardware nodes detected in current loadout.</p>
//           <Link to="/categories" className="bg-amber-500 text-black px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform inline-block cursor-pointer">
//             Return to Directory
//           </Link>
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className={`min-h-screen pt-28 pb-20 transition-colors ${
//       isDarkMode ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900"
//     }`}>
//       <div className="max-w-7xl mx-auto px-6">
        
//         {/* HEADER */}
//         <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-slate-800/10 pb-10">
//           <div>
//             <div className="flex items-center gap-3 text-amber-500 mb-2 font-black uppercase text-[10px] tracking-[0.4em]">
//               <FaShoppingCart /> Transaction Terminal
//             </div>
//             <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">Review <span className="text-amber-500">Order</span></h1>
//           </div>
//           <button 
//             onClick={clearCart} 
//             className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-rose-500 transition-all flex items-center gap-2 cursor-pointer"
//           >
//             <FaTrash /> Purge All Nodes
//           </button>
//         </header>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
//           {/* LEFT: ITEM LIST */}
//           <div className="lg:col-span-2 space-y-4">
//             <AnimatePresence>
//               {cartItems.map((item) => (
//                 <motion.div 
//                   key={item.cartId}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, scale: 0.95 }}
//                   className={`flex flex-col sm:flex-row items-center gap-6 p-6 rounded-[2.5rem] border transition-all ${
//                     isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white border-slate-200 shadow-lg"
//                   }`}
//                 >
//                   <div className="text-6xl bg-slate-500/5 p-6 rounded-3xl">{item.img}</div>
                  
//                   <div className="flex-1 text-center sm:text-left">
//                     <h3 className="text-lg font-black uppercase italic tracking-tighter">{item.name}</h3>
//                     <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">{item.tech || "Premium Node"}</p>
//                     <div className="mt-4 flex items-center justify-center sm:justify-start gap-4">
//                        <span className="text-amber-500 font-black italic text-xl">${item.price}</span>
//                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase rounded-full">Secure Node</span>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-6 border-l border-slate-800/10 pl-6">
//                     <div className="flex items-center gap-4 bg-slate-500/10 rounded-xl p-2">
//                       <button 
//                         onClick={() => removeFromCart(item.cartId)} 
//                         className="p-2 hover:text-rose-500 transition-colors cursor-pointer"
//                       >
//                         <FaMinus size={10} />
//                       </button>
//                       <span className="font-black text-xs">01</span>
//                       <button 
//                         onClick={() => addToCart(item)} 
//                         className="p-2 hover:text-amber-500 transition-colors cursor-pointer"
//                       >
//                         <FaPlus size={10} />
//                       </button>
//                     </div>
//                     <button 
//                       onClick={() => removeFromCart(item.cartId)} 
//                       className="text-rose-500/30 hover:text-rose-500 transition-all p-2 cursor-pointer"
//                     >
//                       <FaTrash />
//                     </button>
//                   </div>
//                 </motion.div>
//               ))}
//             </AnimatePresence>
            
//             <Link to="/categories" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all mt-6 cursor-pointer">
//               <FaArrowLeft /> Continue Acquisition
//             </Link>
//           </div>

//           {/* RIGHT: SUMMARY CARD */}
//           <div className="lg:col-span-1">
//             <div className={`sticky top-32 p-10 rounded-[3rem] border ${
//               isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-2xl"
//             }`}>
//               <h3 className="text-2xl font-black italic uppercase mb-8 flex items-center gap-3">
//                 <FaFileInvoiceDollar className="text-amber-500" /> Summary
//               </h3>

//               {/* COUPON SECTION */}
//               <div className="mb-8 p-5 rounded-2xl bg-black/20 border border-slate-800/50">
//                 <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest opacity-40 mb-3">
//                   <FaTicketAlt /> Security Override
//                 </div>
//                 <div className="flex gap-2">
//                   <input 
//                     type="text"
//                     placeholder="ENTER CODE"
//                     value={couponInput}
//                     onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
//                     className="bg-transparent border-b border-amber-500/30 outline-none text-[10px] font-black w-full p-2 placeholder:opacity-20"
//                   />
//                   <button 
//                     onClick={handleApplyCoupon}
//                     className="bg-amber-500 text-black px-4 py-2 rounded-xl text-[9px] font-black uppercase hover:bg-amber-600 transition-colors cursor-pointer"
//                   >
//                     Apply
//                   </button>
//                 </div>
//                 {couponStatus.msg && (
//                   <motion.p 
//                     initial={{ opacity: 0, y: 5 }} 
//                     animate={{ opacity: 1, y: 0 }}
//                     className={`text-[8px] font-black mt-2 uppercase tracking-tighter ${couponStatus.isError ? "text-rose-500" : "text-emerald-500"}`}
//                   >
//                     {couponStatus.msg}
//                   </motion.p>
//                 )}
//               </div>

//               {/* PRICE BREAKDOWN */}
//               <div className="space-y-4 mb-10">
//                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
//                   <span className="opacity-40">Subtotal</span>
//                   <span>${subtotal.toFixed(2)}</span>
//                 </div>

//                 {discount > 0 && (
//                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-emerald-500">
//                     <span>Discount Applied</span>
//                     <span>-${discountAmount.toFixed(2)}</span>
//                   </div>
//                 )}

//                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
//                   <span className="opacity-40">Thermal Surcharge (Tax)</span>
//                   <span>${tax.toFixed(2)}</span>
//                 </div>
                
//                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
//                   <span className="opacity-40">Freight Logistics</span>
//                   <span className={shipping === 0 ? "text-emerald-500" : ""}>
//                     {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
//                   </span>
//                 </div>

//                 <div className="pt-6 border-t border-slate-800/20 flex justify-between items-end">
//                   <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Total Credits</span>
//                   <span className="text-4xl font-black italic text-amber-500 leading-none">${total.toFixed(2)}</span>
//                 </div>
//               </div>

//               <button 
//                 onClick={() => navigate("/paymentpage")}
//                 className="w-full py-5 bg-amber-500 text-black font-black uppercase text-xs rounded-2xl shadow-lg hover:bg-amber-600 transition-all cursor-pointer"
//               >
//                 PLACE ORDER
//               </button>

//               <div className="flex items-center justify-center gap-4 py-4 opacity-30">
//                 <FaShieldAlt /> <FaTruck /> <FaCheckCircle />
//               </div>
//               <p className="text-[8px] text-center font-black uppercase opacity-20 tracking-tighter leading-tight">
//                 By executing, you authorize the decentralized transfer of credits for the selected hardware nodes.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartPage;




import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../provider/AuthProvider"; 
import { 
  FaTrash, FaShieldAlt, FaFileInvoiceDollar, 
  FaShoppingCart, FaLock, FaCloudUploadAlt, FaArrowRight
} from "react-icons/fa";

const CartPage = () => {
  const { isDarkMode } = useTheme();
  const { cartItems, removeFromCart, clearCart, discount } = useCart();
  const { currentUser } = useAuth();
  const isLoggedIn = !!currentUser;

  const navigate = useNavigate();
  const location = useLocation();

  // --- CALCULATIONS ---
  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
  const discountAmount = subtotal * (discount || 0); 
  const discountedSubtotal = subtotal - discountAmount;
  const tax = discountedSubtotal * 0.08; 
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 25; 
  const total = discountedSubtotal + tax + shipping;

  // --- NAVIGATION HANDOFF (NO FIRESTORE HERE) ---
  const handleCheckout = () => {
    if (!isLoggedIn) {
      // Redirect to login if not authenticated
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    // Package data to pass to Payment Page
    const orderPayload = {
      userId: currentUser.uid,
      userEmail: currentUser.email || "anonymous",
      userName: currentUser.displayName || "Agent",
      items: cartItems.map(item => ({
        id: item.id || item.cartId || "unidentified_node",
        name: item.name || "Unknown Hardware",
        price: Number(item.price) || 0,
        img: item.img || "📦",
        tech: item.tech || "Standard Specs",
        quantity: 1
      })),
      summary: {
        subtotal: Number(subtotal.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        shipping: Number(shipping.toFixed(2)),
        total: Number(total.toFixed(2))
      }
    };

    // Move to Payment Page with the data
    navigate("/paymentpage", { 
      state: { orderData: orderPayload } 
    });
  };

  // --- EMPTY CART VIEW ---
  if (cartItems.length === 0) {
    return (
      <div className={`min-h-screen pt-40 flex flex-col items-center justify-center px-6 transition-colors ${
        isDarkMode ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900"
      }`}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="text-9xl opacity-10 mb-8">🛒</div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Arsenal Empty</h2>
          <p className="opacity-40 font-bold uppercase text-[10px] tracking-[0.3em] mb-8">No hardware nodes detected in current loadout.</p>
          <Link to="/" className="bg-amber-500 text-black px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform inline-block">
            Return to Directory
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-28 pb-20 transition-colors ${
      isDarkMode ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900"
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-slate-800/10 pb-10">
          <div>
            <div className="flex items-center gap-3 text-amber-500 mb-2 font-black uppercase text-[10px] tracking-[0.4em]">
              <FaShoppingCart /> Transaction Terminal
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">Review <span className="text-amber-500">Order</span></h1>
          </div>
          <button 
            onClick={clearCart} 
            className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-rose-500 transition-all flex items-center gap-2 cursor-pointer"
          >
            <FaTrash /> Purge All Nodes
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT: ITEM LIST */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div 
                  key={item.cartId}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`flex flex-col sm:flex-row items-center gap-6 p-6 rounded-[2.5rem] border transition-all ${
                    isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white border-slate-200 shadow-lg"
                  }`}
                >
                  <div className="text-6xl bg-slate-500/5 p-6 rounded-3xl h-24 w-24 flex items-center justify-center">
                    {item.img || "📦"}
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-black uppercase italic tracking-tighter">{item.name}</h3>
                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">{item.tech || "Premium Node"}</p>
                    <div className="mt-4 flex items-center justify-center sm:justify-start gap-4">
                       <span className="text-amber-500 font-black italic text-xl">${Number(item.price).toFixed(2)}</span>
                       <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase rounded-full flex items-center gap-1">
                         <FaShieldAlt size={8}/> Verified Node
                       </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 border-l border-slate-800/10 pl-6">
                    <button onClick={() => removeFromCart(item.cartId)} className="text-rose-500/30 hover:text-rose-500 p-2 cursor-pointer transition-colors"><FaTrash /></button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* RIGHT: SUMMARY CARD */}
          <div className="lg:col-span-1">
            <div className={`sticky top-32 p-10 rounded-[3rem] border ${
              isDarkMode ? "bg-[#0d1117] border-slate-800 shadow-2xl" : "bg-white border-slate-200 shadow-2xl"
            }`}>
              <h3 className="text-2xl font-black italic uppercase mb-8 flex items-center gap-3">
                <FaFileInvoiceDollar className="text-amber-500" /> Summary
              </h3>

              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-50">
                  <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-50">
                  <span>Tax (8%)</span><span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-50">
                  <span>Freight</span><span>${shipping.toFixed(2)}</span>
                </div>
                <div className="pt-6 border-t border-slate-800/20 flex justify-between items-end">
                  <span className="text-4xl font-black italic text-amber-500 leading-none tracking-tighter">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* AUTH INDICATOR */}
              <div className="mb-6 p-4 rounded-2xl bg-slate-500/5 border border-slate-800/10 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isLoggedIn ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">
                  {isLoggedIn ? `Linked: ${currentUser.email.split('@')[0]}` : "Auth Required"}
                </span>
              </div>

              <button 
                onClick={handleCheckout}
                className={`w-full py-5 font-black uppercase text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer group ${
                  isLoggedIn 
                    ? "bg-amber-500 text-black hover:bg-amber-400 active:scale-95" 
                    : "bg-rose-600 text-white hover:bg-rose-700"
                }`}
              >
                {!isLoggedIn ? (
                  <>
                    <FaLock /> Login to Checkout
                  </>
                ) : (
                  <>
                    <FaCloudUploadAlt className="group-hover:-translate-y-1 transition-transform" /> 
                    Deploy Order
                    <FaArrowRight className="text-[8px] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;