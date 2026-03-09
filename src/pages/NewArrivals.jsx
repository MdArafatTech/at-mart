import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { db } from "../firebase/Firebase";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { 
  FaRocket, FaCalendarAlt, FaMicrochip, FaArrowRight, 
  FaTimes, FaBolt, FaLayerGroup, FaFire, FaBox, FaInfoCircle
} from "react-icons/fa";

const NewArrivals = () => {
  const { isDarkMode } = useTheme();
  const { addToCart } = useCart();
  const [arrivals, setArrivals] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("arrivalDate", "desc"), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setArrivals(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Extract unique categories for the filter bar
  const categories = useMemo(() => {
    const cats = ["All", ...new Set(arrivals.map(p => p.category))];
    return cats.filter(Boolean);
  }, [arrivals]);

  const filteredArrivals = arrivals.filter(p => 
    activeFilter === "All" || p.category === activeFilter
  );

  const formatArrival = (dateVal) => {
    if (!dateVal) return "RECENT DROP";
    const date = dateVal.seconds ? new Date(dateVal.seconds * 1000) : new Date(dateVal);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`min-h-screen pt-24 pb-20 transition-colors duration-500 ${
      isDarkMode ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900"
    }`}>
      
      {/* 1. CYBER HEADER */}
      <section className="px-6 max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-4"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Live Satellite Feed // Sync Active</span>
            </motion.div>
            <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.75]">
              NEW<br /><span className="text-amber-500">DROPS</span>
            </h1>
          </div>

          {/* Stats Bar */}
          <div className="flex gap-10 border-l border-slate-800/20 pl-8 hidden lg:flex">
            <div>
              <p className="text-[10px] opacity-40 font-black uppercase mb-1">Total Assets</p>
              <p className="text-3xl font-black italic">{arrivals.length}</p>
            </div>
            <div>
              <p className="text-[10px] opacity-40 font-black uppercase mb-1">Sector</p>
              <p className="text-3xl font-black italic text-amber-500">Global</p>
            </div>
          </div>
        </div>

        {/* 2. FILTER SYSTEM */}
        <div className="flex gap-3 mt-12 overflow-x-auto pb-4 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                activeFilter === cat 
                ? "bg-amber-500 border-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]" 
                : "bg-transparent border-slate-800/50 text-slate-500 hover:border-amber-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 3. PRODUCT GRID */}
      <section className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="py-40 text-center font-black uppercase tracking-widest opacity-20 animate-pulse text-2xl">Initializing Neural Link...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredArrivals.map((p, idx) => (
                <EnhancedCard 
                  key={p.id} 
                  product={p} 
                  idx={idx} 
                  isDarkMode={isDarkMode} 
                  onSelect={() => setSelectedProduct(p)}
                  onAdd={(e) => { e.stopPropagation(); addToCart(p); }}
                  formatArrival={formatArrival}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* 4. DETAIL OVERLAY */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDossier 
            product={selectedProduct} 
            isDarkMode={isDarkMode} 
            onClose={() => setSelectedProduct(null)} 
            onAdd={addToCart} 
            formatArrival={formatArrival}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* --- ENHANCED CARD COMPONENT --- */
const EnhancedCard = ({ product, idx, isDarkMode, onSelect, onAdd, formatArrival }) => {
  const isLowStock = product.quantity > 0 && product.quantity <= 5;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: idx * 0.03 }}
      onClick={onSelect}
      className={`group relative rounded-[2rem] overflow-hidden border cursor-pointer flex flex-col h-full transition-all duration-500 ${
        isDarkMode ? "bg-[#0d1117] border-slate-800 hover:border-amber-500/50" : "bg-white border-slate-200 shadow-xl"
      }`}
    >
      {/* Visual Header */}
      <div className="h-60 bg-black relative overflow-hidden">
        {product.image ? (
          <img src={product.image} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt="" />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-10"><FaBox size={80} /></div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="bg-amber-500 text-black text-[8px] font-black px-3 py-1 rounded-md uppercase italic flex items-center gap-1">
            <FaBolt /> {formatArrival(product.arrivalDate)}
          </span>
          {isLowStock && (
            <span className="bg-rose-600 text-white text-[8px] font-black px-3 py-1 rounded-md uppercase animate-pulse">
              Critial Stock: {product.quantity}
            </span>
          )}
        </div>
      </div>

      {/* Data Content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[9px] font-black uppercase text-amber-500 tracking-widest">{product.category}</span>
          <FaInfoCircle className="opacity-0 group-hover:opacity-30 transition-opacity" />
        </div>
        
        <h3 className="text-xl font-black uppercase italic leading-none mb-4 group-hover:text-amber-500 transition-colors">
          {product.name}
        </h3>

        {/* Quick Intel Bar (Visible on Hover) */}
        <div className="flex gap-4 mb-6 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
           <div className="flex items-center gap-1.5">
              <FaMicrochip className="text-xs text-amber-500" />
              <span className="text-[9px] font-bold uppercase truncate max-w-[80px]">{product.tech || "Standard"}</span>
           </div>
           <div className="flex items-center gap-1.5">
              <FaLayerGroup className="text-xs text-amber-500" />
              <span className="text-[9px] font-bold uppercase">Gen.5</span>
           </div>
        </div>

        {/* Footer Pricing */}
        <div className="mt-auto pt-5 border-t border-slate-800/20 flex justify-between items-end">
          <div>
            <p className="text-[8px] font-black opacity-30 uppercase">MSRP Asset Value</p>
            <p className="text-2xl font-black text-amber-500">${product.price}</p>
          </div>
          <button 
            onClick={onAdd}
            className="w-12 h-12 rounded-xl bg-amber-500 text-black flex items-center justify-center hover:bg-white transition-all hover:scale-110 active:scale-90 shadow-lg"
          >
            <FaArrowRight />
          </button>
        </div>
      </div>

      {/* Stock Progress Line */}
      <div className="h-1 w-full bg-slate-800">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((product.quantity / 50) * 100, 100)}%` }}
          className={`h-full ${isLowStock ? "bg-rose-500" : "bg-emerald-500"}`}
        />
      </div>
    </motion.div>
  );
};

/* --- FULL DOSSIER MODAL --- */
const ProductDossier = ({ product, isDarkMode, onClose, onAdd, formatArrival }) => (
  <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[999]" />
    <motion.div 
      initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
      className={`fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-5xl w-full z-[1000] rounded-[3rem] overflow-hidden border ${
        isDarkMode ? "bg-[#0d1117] border-slate-800 text-white" : "bg-white border-slate-200 text-black"
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 h-full max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="bg-black flex items-center justify-center p-10 relative">
          {product.image ? <img src={product.image} className="max-h-full w-full object-contain" alt="" /> : <FaBox size={100} className="opacity-10" />}
          <div className="absolute bottom-8 left-8 bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl backdrop-blur-md">
             <p className="text-[9px] font-black text-amber-500 uppercase mb-1">Authenticated Asset</p>
             <p className="text-[10px] font-mono opacity-50">ID: {product.id.substring(0, 12).toUpperCase()}</p>
          </div>
        </div>

        <div className="p-12 flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <span className="bg-amber-500/10 text-amber-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
              {product.category}
            </span>
            <button onClick={onClose} className="text-2xl opacity-30 hover:opacity-100 transition-opacity"><FaTimes /></button>
          </div>

          <h2 className="text-5xl font-black uppercase italic leading-none mb-6">{product.name}</h2>
          
          <div className="space-y-8 flex-1">
             <div className="grid grid-cols-2 gap-4">
                <DossierStat icon={<FaCalendarAlt />} label="Deployed" value={formatArrival(product.arrivalDate)} />
                <DossierStat icon={<FaFire />} label="Status" value={product.status || "Operational"} />
                <DossierStat icon={<FaMicrochip />} label="Core Spec" value={product.tech || "Quantum"} />
                <DossierStat icon={<FaBox />} label="Inventory" value={`${product.quantity || 0} Units`} />
             </div>

             <div>
                <p className="text-[10px] font-black uppercase text-amber-500 mb-3 tracking-widest">Technical Brief</p>
                <p className="text-sm opacity-60 leading-relaxed font-medium">
                  This asset represents the latest advancement in {product.category} engineering. 
                  Optimized for extreme performance and high-availability neural processing. 
                  Standard deployment includes 3-year hardware encryption and priority support.
                </p>
             </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800/20 flex items-center justify-between gap-6">
            <div>
              <p className="text-[10px] font-black opacity-40 uppercase">Total Acquisition Cost</p>
              <p className="text-4xl font-black text-amber-500">${product.price}</p>
            </div>
            <button 
              onClick={() => { onAdd(product); onClose(); }} 
              className="flex-1 py-6 bg-amber-500 text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-white transition-all shadow-xl hover:shadow-amber-500/20"
            >
              Initialize Purchase
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  </>
);

const DossierStat = ({ icon, label, value }) => (
  <div className="bg-slate-500/5 p-4 rounded-2xl border border-slate-800/10 flex items-center gap-4">
    <div className="text-amber-500 text-xl">{icon}</div>
    <div>
      <p className="text-[9px] font-black opacity-30 uppercase">{label}</p>
      <p className="text-sm font-black uppercase italic">{value}</p>
    </div>
  </div>
);

export default NewArrivals;