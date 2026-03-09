import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Firebase Core
import { db } from "../firebase/Firebase"; 
import { collection, query, where, onSnapshot } from "firebase/firestore";
// Contexts
import { useTheme } from "../context/ThemeContext";
import { useSearch } from "../context/SearchContext";
import { useCart } from "../context/CartContext";
// Icons
import { 
  FaFire, FaArrowRight, FaMicrochip, FaCalendarAlt, 
  FaClock, FaTimes, FaBolt, FaExclamationTriangle, FaSearch 
} from "react-icons/fa";

const SalePage = () => {
  const { isDarkMode } = useTheme();
  const { searchQuery } = useSearch();
  const { addToCart } = useCart();
  
  // States
  const [products, setProducts] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 30, hours: 0, minutes: 0, seconds: 0 });

  // Sale end date persistence
  useEffect(() => {
    const saleEnd = localStorage.getItem('saleEnd');
    if (!saleEnd) {
      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).getTime();
      localStorage.setItem('saleEnd', endDate.toString());
    }
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateTimer = () => {
    const end = parseInt(localStorage.getItem('saleEnd') || Date.now());
    const now = Date.now();
    const diff = end - now;
    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    }
  };

  // Real-time Firestore (unchanged but with error boundary)
  useEffect(() => {
    const q = query(collection(db, "products"), where("isOnSale", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const saleData = snapshot.docs.map(doc => ({
        id: doc.id, ...doc.data(), originalPrice: doc.data().originalPrice || doc.data().price * 1.3
      }));
      setProducts(saleData);
      setLoading(false);
    }, (error) => {
      console.error("Sale Fetch Error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Memoized search filter
  const memoFiltered = useMemo(() => 
    products.filter(item => 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.techSpecs?.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchQuery, products]
  );

  useEffect(() => {
    setFilteredItems(memoFiltered);
  }, [memoFiltered]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#05070a]">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="text-rose-500 text-4xl sm:text-5xl lg:text-7xl"
        >
          <FaBolt />
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-16 -mt-20 sm:pt-20 pb-12 sm:pb-20 transition-colors duration-500 ${
      isDarkMode ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900"
    }`}>
      {/* Responsive Hero */}
      <section className="relative w-full px-2 sm:px-4 py-16 sm:py-24 bg-gradient-to-br from-rose-600 via-orange-500 to-amber-500 text-black overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 sm:gap-3 bg-white/20 backdrop-blur-2xl px-6 sm:px-10 py-3 sm:py-5 rounded-full sm:rounded-2xl mb-8 sm:mb-12 shadow-2xl border border-white/30"
          >
            <FaFire className="text-2xl sm:text-4xl animate-pulse" />
            <span className="text-lg sm:text-xl font-black uppercase tracking-[0.15em] sm:tracking-[0.25em]">SPRING MEGA SALE 2026</span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[110px] font-black italic uppercase leading-none mb-6 sm:mb-10 tracking-tighter drop-shadow-2xl">
            UP TO <span className="text-white">42% OFF</span>
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <div className="text-2xl sm:text-4xl md:text-5xl font-black uppercase italic tracking-tighter">Sale Ends In</div>
            <div className="flex gap-2 sm:gap-3 md:gap-6">
              {[
                { val: timeLeft.days, label: "DAYS" },
                { val: timeLeft.hours, label: "HRS" },
                { val: timeLeft.minutes, label: "MIN" },
                { val: timeLeft.seconds, label: "SEC" }
              ].map((t, i) => (
                <div key={i} className="bg-black/30 backdrop-blur-3xl px-4 sm:px-6 py-3 sm:py-5 rounded-2xl sm:rounded-3xl border border-white/30 min-w-[70px] sm:min-w-[85px] text-center">
                  <div className="text-3xl sm:text-5xl md:text-6xl font-black tabular-nums">{t.val.toString().padStart(2, '0')}</div>
                  <div className="text-[8px] sm:text-[10px] font-bold opacity-75 tracking-widest mt-1">{t.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Grid */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 -mt-16 sm:-mt-24 pb-12 sm:pb-20 relative z-20">
        <div className={`backdrop-blur-2xl rounded-[2rem] sm:rounded-[3rem] p-4 sm:p-8 lg:p-16 border shadow-2xl ${
          isDarkMode ? "bg-[#0d1117]/90 border-slate-700/50" : "bg-white/90 border-slate-200"
        }`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4 sm:gap-6">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black italic uppercase tracking-tighter flex items-center gap-2 sm:gap-4 flex-wrap">
              <span className="text-rose-500 text-xl sm:text-4xl">🔥</span> HOT DEALS 
              <span className="text-white/60 text-sm sm:text-base">({filteredItems.length})</span>
            </h2>
            <div className="px-4 sm:px-8 py-2 sm:py-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl sm:rounded-3xl text-rose-500 font-black uppercase tracking-widest text-xs sm:text-sm flex items-center gap-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-rose-500 rounded-full animate-pulse" />
              LIVE STOCK FEED
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
              {filteredItems.map((p, idx) => (
                <SaleItemCard
                  key={p.id}
                  item={p}
                  idx={idx}
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                  setSelectedProduct={setSelectedProduct}
                  addToCart={addToCart}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
          </AnimatePresence>

          {filteredItems.length === 0 && (
            <div className="text-center py-20 sm:py-32 opacity-30 col-span-full">
              <FaExclamationTriangle className="text-6xl sm:text-8xl mx-auto mb-6 sm:mb-8" />
              <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-widest mb-4">NO ACTIVE DEALS</h3>
              <p className="text-lg">Try searching "processor" or "RTX" <FaSearch className="inline ml-2" /></p>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedProduct && (
          <ProductModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            addToCart={addToCart}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Fixed Responsive SaleItemCard
const SaleItemCard = React.memo(({ item, idx, hoveredId, setHoveredId, setSelectedProduct, addToCart, isDarkMode }) => {
  const discountAmount = (item.price * (item.discount || 0)) / 100;
  const finalPrice = Math.round(item.price - discountAmount);
  const originalPrice = Math.round(item.originalPrice || item.price * 1.3);
  const stockPercentage = Math.min((item.quantity / (item.maxStock || 50)) * 100, 100);
  const isLowStock = item.quantity <= 5; // Reduced for urgency

  const handleHoverStart = useCallback(() => setHoveredId(item.id), [item.id, setHoveredId]);
  const handleHoverEnd = useCallback(() => setHoveredId(null), [setHoveredId]);
  const handleClick = useCallback(() => setSelectedProduct(item), [item, setSelectedProduct]);
  const handleAddToCart = useCallback((e) => {
    e.stopPropagation();
    addToCart({ ...item, cartId: Date.now(), finalPrice });
  }, [item, addToCart, finalPrice]);

  return (
   <motion.div
  layout
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: idx * 0.03 }}
  whileHover={{ y: -8, scale: 1.02 }}
  onHoverStart={handleHoverStart}
  onHoverEnd={handleHoverEnd}
  onClick={handleClick}
  className={`group relative rounded-2xl sm:rounded-[2.5rem] border overflow-hidden flex flex-col cursor-pointer transition-all duration-500 shadow-xl hover:shadow-3xl ${
    isDarkMode 
      ? "bg-[#0d1117]/90 border-slate-700 hover:border-rose-500/60" 
      : "bg-white border-slate-200 hover:border-rose-200"
  }`}
>
  {/* DISCOUNT BADGE - Adaptive Sizing */}
  {item.discount > 0 && (
    <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-30 bg-gradient-to-br from-rose-500 to-orange-500 text-white font-black px-4 sm:px-5 py-1 sm:py-1.5 rounded-xl shadow-2xl text-[10px] sm:text-xs tracking-wider rotate-[-12deg]">
      -{item.discount}% OFF
    </div>
  )}

  {/* VISUAL AREA - Responsive Heights */}
  <div className="relative h-48 sm:h-64 lg:h-72 bg-gradient-to-br from-slate-950 to-black flex items-center justify-center overflow-hidden">
    {item.image ? (
      <img 
        src={item.image} 
        alt={item.name} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
      />
    ) : (
      <span className="text-[100px] sm:text-[140px] opacity-20 transition-transform group-hover:scale-110">{item.img || "🔥"}</span>
    )}
    <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent transition-opacity duration-300 ${hoveredId === item.id ? "opacity-80" : "opacity-40"}`} />
  </div>

  {/* CONTENT AREA */}
  <div className="flex-1 p-5 sm:p-7 flex flex-col">
    <span className="text-rose-500 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">{item.category}</span>
    
    <h3 className="font-black text-lg sm:text-2xl leading-tight mt-2 mb-3 line-clamp-2 group-hover:text-rose-400 transition-colors">
      {item.name}
    </h3>

    <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono opacity-60 mb-6 sm:mb-8">
      <FaMicrochip className="text-rose-500" />
      <span className="truncate">{item.techSpecs || item.tech || "PREMIUM CORE"}</span>
    </div>

    {/* STOCK & PRICING - Smart Stacking */}
    <div className="mt-auto space-y-4">
      <div className="flex justify-between items-center text-[9px] sm:text-[11px] font-black uppercase tracking-widest">
        <span className={isLowStock ? "text-rose-500 animate-pulse" : "text-emerald-500"}>
          {isLowStock ? "LOW STOCK" : "IN STOCK"}
        </span>
        <span className="opacity-40">{item.quantity} UNITS</span>
      </div>

      <div className="h-1 bg-slate-800/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${stockPercentage}%` }}
          className={`h-full rounded-full ${isLowStock ? "bg-rose-500" : "bg-emerald-500"}`}
        />
      </div>

      <div className="flex flex-col xs:flex-row justify-between items-end xs:items-center gap-4 pt-2">
        <div className="w-full xs:w-auto">
          <span className="line-through text-[10px] sm:text-xs opacity-30 block">${originalPrice}</span>
          <span className="text-2xl sm:text-4xl font-black text-rose-500 tracking-tighter">${finalPrice}</span>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          className="w-full xs:w-auto cursor-pointer bg-white text-black px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl hover:bg-amber-500 hover:text-white transition-all duration-300"
        >
          ADD <FaArrowRight className="text-[10px]" />
        </motion.button>
      </div>
    </div>
  </div>
</motion.div>
  );
});

// Fully Responsive Modal
const ProductModal = ({ product, onClose, addToCart, isDarkMode }) => {
  const finalPrice = Math.round(product.price * (1 - (product.discount || 0) / 100));
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-2xl overscroll-none" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0"
      />

      <motion.div
        layoutId={product.id}
        className={`relative w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl rounded-2xl sm:rounded-3xl overflow-hidden border shadow-2xl mx-2 sm:mx-4 ${
          isDarkMode ? "bg-[#0d1117] border-slate-700" : "bg-white border-slate-200"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 sm:top-6 sm:right-6 right-4 z-50 text-2xl sm:text-4xl text-white/70 hover:text-white transition-all p-2"
          aria-label="Close modal"
        >
          <FaTimes />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-[70vh] sm:h-[80vh] max-h-[500px] lg:max-h-[420px]">
          {/* Image */}
          <div className="bg-black p-6 sm:p-8 lg:p-12 flex items-center justify-center min-h-[250px] lg:min-h-[420px] relative overflow-hidden">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <span className="text-[160px] sm:text-[200px] lg:text-[260px] opacity-30 drop-shadow-2xl">
                {product.img || "🔥"}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 lg:p-12 sm:p-16 flex flex-col">
            <div className="text-rose-500 font-black text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-2 sm:mb-3">{product.category}</div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-none mb-4 sm:mb-8 line-clamp-2">{product.name}</h2>

            <div className="flex items-baseline gap-4 sm:gap-6 mb-6 sm:mb-10 flex-wrap">
              <span className="text-4xl sm:text-5xl lg:text-7xl font-black text-rose-500">${finalPrice}</span>
              <span className="text-xl sm:text-2xl lg:text-3xl line-through opacity-40">${Math.round(product.originalPrice || product.price * 1.3)}</span>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-12 max-h-20 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between bg-slate-800/30 p-4 sm:p-5 rounded-xl sm:rounded-2xl">
                <span className="opacity-60 font-medium">Current Stock</span>
                <span className="font-mono text-emerald-500 font-bold">{product.quantity} Units</span>
              </div>
              <div className="flex justify-between bg-slate-800/30 p-4 sm:p-5 rounded-xl sm:rounded-2xl">
                <span className="opacity-60 font-medium">Warranty</span>
                <span className="font-bold text-emerald-500">2 Years Premium</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="w-full py-5 sm:py-6 lg:py-7 bg-gradient-to-r from-rose-500 to-orange-500 text-black font-black text-lg sm:text-xl rounded-2xl sm:rounded-3xl shadow-2xl shadow-rose-500/50 flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all duration-300"
            >
              <FaBolt className="text-xl sm:text-2xl" /> CLAIM THIS DEAL NOW
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SalePage;
