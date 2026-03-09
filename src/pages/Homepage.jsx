


import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Firebase
import { db } from "../firebase/Firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

// Styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Contexts & Icons
import { useTheme } from "../context/ThemeContext";
import { useSearch } from "../context/SearchContext";
import { useCart } from "../context/CartContext";
import {
  FaArrowRight,
  FaTimes,
  FaTrash,
  FaMicrochip,
  FaServer,
  FaShieldAlt,
  FaBolt,
  FaWind,
  FaBoxOpen,
  FaShoppingCart,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";   // ← ADD THIS

// --- STOCK COLOR ---
const getStockColor = (qty) => {
  if (qty <= 3) return "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]";
  if (qty <= 10) return "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]";
  return "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]";
};

const Homepage = () => {
  const { isDarkMode } = useTheme();
  const { searchQuery } = useSearch();
  const { cartItems, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();   // ← Now we have navigate here

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // 1. Real-time Firestore
  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      if (items.length === 0) {
        setProducts([
          { id: "d1", name: "Neural Link i11", price: 1299, cat: "Computing", img: "🧠", tech: "8.4 GHz", tag: "Hot", discount: 15, quantity: 2 },
          { id: "d2", name: "Vortex RTX 6090", price: 2100, cat: "Gaming", img: "🎮", tech: "64GB VRAM", tag: "Elite", discount: 0, quantity: 25 },
          { id: "d3", name: "Quantum Drive", price: 850, cat: "Storage", img: "💾", tech: "20GB/s", tag: "Sale", discount: 10, quantity: 8 },
        ]);
      } else {
        setProducts(items);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // 2. Filtering
  useEffect(() => {
    const filtered = products.filter((p) => {
      const matchesCat = activeCategory === "All" || p.cat === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.cat?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
    setFilteredProducts(filtered);
  }, [searchQuery, activeCategory, products]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center font-black animate-pulse opacity-20 uppercase tracking-[1em]">
        Syncing Arsenal...
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDarkMode ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900"}`}>
      {/* HERO CAROUSEL */}


   {/* ==================== ULTRA SMOOTH PREMIUM HERO CAROUSEL ==================== */}
<section className="pt-6 pb-10 px-4">
  <Swiper
    modules={[Autoplay, Pagination, Navigation]}
    loop={true}
    autoplay={{ 
      delay: 4500, 
      disableOnInteraction: false 
    }}
    speed={1200}                    // ← Super smooth slide speed
    effect="fade"                   // ← Beautiful fade transition
    fadeEffect={{ crossFade: true }}
    pagination={{ 
      clickable: true, 
      el: ".swiper-pagination",
      dynamicBullets: true 
    }}
    navigation
    className="max-w-7xl h-[420px] md:h-[680px] rounded-[3rem] overflow-hidden shadow-2xl mx-auto relative"
  >
    {/* SLIDE 1 - QUANTUM COMPUTING */}
    <SwiperSlide>
      <motion.div 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-full h-full bg-gradient-to-br from-blue-600 via-indigo-700 to-violet-900 flex items-center p-8 md:p-24 relative overflow-hidden"
      >
        <div className="z-10 max-w-lg">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-2xl px-8 py-3 rounded-full mb-8 text-white text-sm font-black tracking-[0.2em]">
            NEXT-GEN ARCHITECTURE
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-8xl font-black italic uppercase leading-[0.9] mb-10 text-white drop-shadow-2xl">
            Quantum<br />Computing
          </h2>
          <a 
            href="/shop" 
            className="inline-block px-9 py-4 bg-white hover:bg-amber-500 text-black hover:text-white font-black uppercase text-sm rounded-full transition-all duration-300 shadow-2xl hover:shadow-amber-500/40"
          >
            Explore Quantum Arsenal →
          </a>
        </div>

        {/* Floating Element with smooth animation */}
        <motion.div 
          initial={{ opacity: 0.15, scale: 0.8, rotate: -12 }}
          animate={{ opacity: 0.25, scale: 1.1, rotate: 8 }}
          transition={{ duration: 18, repeat: Infinity, repeatType: "reverse" }}
          className="absolute right-10 md:right-20 bottom-10 md:bottom-16 text-[220px] md:text-[380px] pointer-events-none"
        >
          🌀
        </motion.div>
      </motion.div>
    </SwiperSlide>

    {/* SLIDE 2 - NEURAL RTX */}
    <SwiperSlide>
      <motion.div 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-full h-full bg-gradient-to-br from-rose-600 via-purple-700 to-violet-900 flex items-center p-8 md:p-24 relative overflow-hidden"
      >
        <div className="z-10 max-w-lg">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-2xl px-8 py-3 rounded-full mb-8 text-white text-sm font-black tracking-[0.2em]">
            FLAGSHIP GAMING SERIES
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-8xl font-black italic uppercase leading-[0.9] mb-10 text-white drop-shadow-2xl">
            Neural<br />RTX 7090
          </h2>
          <a 
            href="/newarivals" 
            className="inline-block px-12 py-5 bg-white hover:bg-amber-500 text-black hover:text-white font-black uppercase text-sm rounded-full transition-all duration-300 shadow-2xl hover:shadow-amber-500/40"
          >
            Grab Elite Series →
          </a>
        </div>

        <motion.div 
          initial={{ opacity: 0.15, y: 40 }}
          animate={{ opacity: 0.25, y: -20 }}
          transition={{ duration: 14, repeat: Infinity, repeatType: "reverse" }}
          className="absolute right-10 md:right-20 bottom-10 md:bottom-16 text-[220px] md:text-[380px] pointer-events-none"
        >
          🎮
        </motion.div>
      </motion.div>
    </SwiperSlide>

    {/* SLIDE 3 - QUANTUM STORAGE */}
    <SwiperSlide>
      <motion.div 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-full h-full bg-gradient-to-br from-emerald-600 via-cyan-700 to-teal-900 flex items-center p-8 md:p-24 relative overflow-hidden"
      >
        <div className="z-10 max-w-lg">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-2xl px-8 py-3 rounded-full mb-8 text-white text-sm font-black tracking-[0.2em]">
            LIGHTSPEED STORAGE
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-8xl font-black italic uppercase leading-[0.9] mb-10 text-white drop-shadow-2xl">
            20GB/s<br />Quantum SSD
          </h2>
          <a 
            href="/sale" 
            className="inline-block px-12 py-5 bg-white hover:bg-amber-500 text-black hover:text-white font-black uppercase text-sm rounded-full transition-all duration-300 shadow-2xl hover:shadow-amber-500/40"
          >
            Unlock Hyperspeed →
          </a>
        </div>

        <motion.div 
          initial={{ opacity: 0.15, rotate: 0 }}
          animate={{ opacity: 0.25, rotate: 25 }}
          transition={{ duration: 22, repeat: Infinity, repeatType: "reverse" }}
          className="absolute right-10 md:right-20 bottom-10 md:bottom-16 text-[220px] md:text-[380px] pointer-events-none"
        >
          💾
        </motion.div>
      </motion.div>
    </SwiperSlide>

    {/* SLIDE 4 - NEURAL LINK */}
    <SwiperSlide>
      <motion.div 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-full h-full bg-gradient-to-br from-amber-600 via-orange-700 to-red-900 flex items-center p-8 md:p-24 relative overflow-hidden"
      >
        <div className="z-10 max-w-lg">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-2xl px-8 py-3 rounded-full mb-8 text-white text-sm font-black tracking-[0.2em]">
            BRAIN-MACHINE INTERFACE
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-8xl font-black italic uppercase leading-[0.9] mb-10 text-white drop-shadow-2xl">
            Neural<br />Link i11
          </h2>
          <a 
            href="/category" 
            className="inline-block px-12 py-5 bg-white hover:bg-amber-500 text-black hover:text-white font-black uppercase text-sm rounded-full transition-all duration-300 shadow-2xl hover:shadow-amber-500/40"
          >
            Enter The Mind Grid →
          </a>
        </div>

        <motion.div 
          initial={{ opacity: 0.15, scale: 0.9 }}
          animate={{ opacity: 0.25, scale: 1.15 }}
          transition={{ duration: 16, repeat: Infinity, repeatType: "reverse" }}
          className="absolute right-10 md:right-20 bottom-10 md:bottom-16 text-[220px] md:text-[380px] pointer-events-none"
        >
          🧠
        </motion.div>
      </motion.div>
    </SwiperSlide>
  </Swiper>

  {/* Custom Pagination */}
  <div className="swiper-pagination !bottom-10 !left-1/2 !translate-x-1/2 z-30" />
</section>

      

      {/* TRUST BADGES */}
      <section className="py-12 border-y border-slate-800/10 bg-slate-500/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <TrustItem icon={<FaShieldAlt />} title="Encrypted" desc="Secure Link" />
          <TrustItem icon={<FaBolt />} title="Warp Speed" desc="Fast Delivery" />
          <TrustItem icon={<FaServer />} title="Verified" desc="Authentic" />
          <TrustItem icon={<FaWind />} title="Thermal" desc="Optimized" />
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <h2 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-4">
            <FaBoxOpen className="text-amber-500" /> Hardware Arsenal
          </h2>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {["All", "Computing", "Gaming", "Mobile", "Storage"].map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === c
                    ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                    : "bg-slate-800/10 text-slate-500"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((p) => (
              <EnhancedProductCard
                key={p.id}
                product={p}
                onAdd={() => {
                  addToCart({ ...p, cartId: Date.now() });
                  setIsCartOpen(true);
                }}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </AnimatePresence>
      </section>

      {/* CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        remove={removeFromCart}
        isDarkMode={isDarkMode}
        navigate={navigate}   
      />
    </div>
  );
};

// ──────────────────────────────────────────────
// ENHANCED PRODUCT CARD (unchanged)
// ──────────────────────────────────────────────
const EnhancedProductCard = ({ product, onAdd, isDarkMode }) => {
  const discountAmount = (product.price * (product.discount || 0)) / 100;
  const finalPrice = product.price - discountAmount;
  const maxStockVisual = 40;
  const stockPercentage = Math.min((product.quantity / maxStockVisual) * 100, 100);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -10 }}
      className={`group p-4 rounded-[2.5rem] border transition-all duration-500 ${
        isDarkMode
          ? "bg-[#0d1117]/80 backdrop-blur-xl border-slate-800 hover:border-amber-500/40"
          : "bg-white border-slate-200 shadow-xl"
      }`}
    >
      <div className="aspect-square bg-slate-500/5 rounded-[2rem] flex items-center justify-center relative overflow-hidden mb-6">
        {product.image ? (
          <img
            src={product.image}
            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
            alt={product.name}
          />
        ) : (
          <span className="text-7xl group-hover:scale-110 transition-transform">{product.img || "📦"}</span>
        )}

        {product.discount > 0 && (
          <div className="absolute top-4 left-4 bg-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
            -{product.discount}%
          </div>
        )}

        <button
          onClick={onAdd}
          className="absolute bottom-4 left-4 w-[calc(100%-2rem)] py-4 bg-amber-500 text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-xl shadow-amber-500/20 hover:bg-amber-400 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer z-10"
        >
          Add To Cart
        </button>
      </div>

      <div className="px-2 space-y-4">
        <div>
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{product.cat}</span>
          <h3 className="text-lg font-black uppercase truncate group-hover:text-amber-500 transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-[9px] font-black uppercase opacity-60">
            <span>{product.quantity <= 3 ? "Low Stock" : "Availability"}</span>
            <span>{product.quantity} Units</span>
          </div>
          <div className="w-full h-1 bg-slate-800/10 rounded-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stockPercentage}%` }}
              className={`h-full rounded-full ${getStockColor(product.quantity)}`}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-2xl font-black italic text-amber-500">${finalPrice.toFixed(0)}</span>
          {product.discount > 0 && (
            <span className="text-xs line-through opacity-30 font-bold text-slate-400">${product.price}</span>
          )}
        </div>

        <div className="pt-4 border-t border-slate-800/10 flex items-center justify-between opacity-60">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
            <FaMicrochip className="text-amber-500" /> {product.tech}
          </div>
          <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};

// TrustItem unchanged
const TrustItem = ({ icon, title, desc }) => (
  <div className="text-center group">
    <div className="text-3xl text-amber-500 mb-3 flex justify-center group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h4 className="font-black text-sm uppercase mb-1">{title}</h4>
    <p className="text-[10px] font-bold opacity-40 uppercase">{desc}</p>
  </div>
);

// ──────────────────────────────────────────────
// UPDATED CART DRAWER (with navigate prop)
// ──────────────────────────────────────────────
const CartDrawer = ({ isOpen, onClose, cartItems, remove, isDarkMode, navigate }) => {
  const subtotal = cartItems.reduce((s, i) => s + i.price * (i.quantity || 1), 0);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`fixed inset-y-0 right-0 z-[1000] w-full max-w-[400px] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col transition-colors duration-500 ${
          isDarkMode ? "bg-[#0d1117] text-white border-l border-white/5" : "bg-white text-slate-900"
        }`}
      >
        {/* HEADER */}
        <div className="p-8 pb-6 border-b border-white/5">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
              <FaShoppingCart className="text-amber-500 text-xl" /> Cart <span className="text-amber-500">Bay</span>
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-500/10 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
            >
              <FaTimes size={18} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: cartItems.length > 0 ? "40%" : "0%" }}
                className="h-full bg-amber-500"
              />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Load Status</span>
          </div>
        </div>

        {/* ITEMS (unchanged) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          <AnimatePresence mode="popLayout">
            {cartItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center opacity-20 text-center"
              >
                <FaShoppingCart size={60} className="mb-4" />
                <p className="font-black uppercase tracking-[0.3em] text-xs">Manifest Empty</p>
                <p className="text-[10px] mt-2">No hardware detected in buffer.</p>
              </motion.div>
            ) : (
              cartItems.map((item) => (
                <motion.div
                  layout
                  key={item.cartId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`group flex gap-4 items-center p-4 rounded-[1.5rem] border transition-all ${
                    isDarkMode ? "bg-white/5 border-white/5 hover:border-amber-500/30" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="h-16 w-16 bg-black/20 rounded-xl flex items-center justify-center overflow-hidden border border-white/5">
                    {item.image ? (
                      <img src={item.image} className="object-cover w-full h-full group-hover:scale-110 transition-transform" alt="" />
                    ) : (
                      <span className="text-2xl group-hover:scale-110 transition-transform">{item.img}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-[10px] font-black uppercase truncate tracking-widest">{item.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-amber-500 font-black italic text-sm">${item.price}</p>
                      <span className="text-[8px] font-bold opacity-30 uppercase tracking-tighter">Unit_Node_01</span>
                    </div>
                  </div>

                  <button
                    onClick={() => remove(item.cartId)}
                    className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
                  >
                    <FaTrash size={12} />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* FOOTER – FIXED BUTTON */}
        <div className={`p-8 border-t transition-colors ${isDarkMode ? "bg-black/40 border-white/5" : "bg-slate-50 border-slate-200"}`}>
          <div className="space-y-3 mb-8">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase opacity-40 tracking-widest">
              <span>Security Protocol</span>
              <span className="flex items-center gap-1 text-emerald-500">
                <FaShieldAlt /> Active
              </span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <span className="block text-[10px] font-black uppercase opacity-40 tracking-widest leading-none mb-1">
                  Total Valuation
                </span>
                <span className="text-3xl font-black text-amber-500 italic tracking-tighter leading-none">
                  ${subtotal.toLocaleString()}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-[8px] font-black opacity-30 uppercase tracking-tighter mb-1 italic">
                  Incl. Service Nodes
                </span>
                <span className="text-[10px] font-black uppercase">$0.00</span>
              </div>
            </div>
          </div>

          {/* FIXED CHECKOUT BUTTON */}
          <button
            disabled={cartItems.length === 0}
            onClick={() => {
              onClose();
              navigate("/cartpage");
            }}
            className="group relative w-full py-5 bg-amber-500 text-black font-black rounded-2xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(245,158,11,0.3)] hover:bg-amber-400 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center justify-center gap-3 uppercase text-[11px] tracking-[0.2em]">
              CHECKOUT <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </span>
            <motion.div
              className="absolute inset-0 bg-white/20 translate-x-[-100%]"
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            />
          </button>

          <p className="text-center text-[8px] font-bold opacity-30 mt-6 uppercase tracking-widest">
            By authorizing, you agree to encrypted node-to-node terms.
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default Homepage;