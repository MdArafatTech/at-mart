import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { db } from "../firebase/Firebase";
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  where 
} from "firebase/firestore";
import { 
  FaRocket, FaCalendarAlt, FaMicrochip, FaArrowRight, 
  FaTimes, FaBolt, FaLayerGroup, FaFire, FaBox, FaInfoCircle,
  FaLink, FaDatabase, FaExclamationTriangle
} from "react-icons/fa";

const NewArrivals = () => {
  const { isDarkMode } = useTheme();
  const { addToCart } = useCart();
  const [arrivals, setArrivals] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    setLoading(true);
    
    // THE LOCK-AND-KEY SYSTEM
    // To show up here, a product MUST have:
    // 1. targetPage == "NewArrivals"
    // 2. isOnSale == false
    // 3. A valid arrivalDate field
    const q = query(
      collection(db, "products"), 
      where("targetPage", "==", "NewArrivals"), 
      where("isOnSale", "==", false),
      orderBy("arrivalDate", "desc"), 
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // DEBUG LOG: Press F12 in your browser to see if data is arriving
      console.log("New Arrivals Data Found:", docs.length, "items");
      
      setArrivals(docs);
      setLoading(false);
    }, (error) => {
      // INDEX ERROR CHECK: If you see a link in the console, click it to create the Firestore Index
      console.error("Firestore Query Error:", error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
              className="flex items-center gap-3 mb-4"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">
                Sector: New_Arrivals // Sync Active
              </span>
            </motion.div>
            <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.75]">
              NEW<br /><span className="text-amber-500">DROPS</span>
            </h1>
          </div>

          <div className="flex gap-10 border-l border-slate-800/20 pl-8 hidden lg:flex">
            <div>
              <p className="text-[10px] opacity-40 font-black uppercase mb-1">Active Assets</p>
              <p className="text-3xl font-black italic">{arrivals.length}</p>
            </div>
            <div>
              <p className="text-[10px] opacity-40 font-black uppercase mb-1">Status</p>
              <p className="text-3xl font-black italic text-emerald-500">Live</p>
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
                ? "bg-amber-500 border-amber-500 text-black" 
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
          <div className="py-40 text-center font-black uppercase tracking-widest opacity-20 animate-pulse text-2xl">Syncing Grid...</div>
        ) : filteredArrivals.length > 0 ? (
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
        ) : (
          <div className="py-32 text-center border-2 border-dashed border-slate-800/20 rounded-[3rem] bg-white/5 backdrop-blur-sm">
            <FaExclamationTriangle className="mx-auto text-4xl mb-4 text-amber-500 opacity-50" />
            <h3 className="text-xl font-black uppercase italic mb-2">No Targeted Assets Found</h3>
            <p className="max-w-xs mx-auto text-[10px] font-bold uppercase opacity-30 leading-relaxed">
              Ensure products in your database have targetPage: "NewArrivals" and isOnSale: false.
            </p>
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
const EnhancedCard = ({ product, idx, isDarkMode, onSelect, onAdd, formatArrival }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ delay: idx * 0.05 }}
    onClick={onSelect}
    className={`group relative rounded-[2.5rem] overflow-hidden border cursor-pointer flex flex-col h-full transition-all duration-500 ${
      isDarkMode ? "bg-[#0d1117] border-slate-800 hover:border-amber-500/50" : "bg-white border-slate-200 shadow-xl"
    }`}
  >
    <div className="h-64 bg-black relative overflow-hidden">
      {product.image ? (
        <img src={product.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt="" />
      ) : (
        <div className="w-full h-full flex items-center justify-center opacity-10"><FaBox size={80} /></div>
      )}
      <div className="absolute top-5 left-5">
        <span className="bg-amber-500 text-black text-[8px] font-black px-4 py-1.5 rounded-full uppercase italic flex items-center gap-1 shadow-xl">
          <FaBolt /> {formatArrival(product.arrivalDate)}
        </span>
      </div>
    </div>

    <div className="p-7 flex-1 flex flex-col">
      <span className="text-[10px] font-black uppercase text-amber-500 tracking-[0.2em] mb-2">{product.category}</span>
      <h3 className="text-2xl font-black uppercase italic leading-[0.9] mb-6 group-hover:text-amber-500 transition-colors">
        {product.name}
      </h3>
      <div className="mt-auto pt-6 border-t border-slate-800/20 flex justify-between items-end">
        <div>
          <p className="text-[8px] font-black opacity-30 uppercase tracking-widest">Asset Value</p>
          <p className="text-3xl font-black text-amber-500">${product.price}</p>
        </div>
        <button onClick={onAdd} className="w-14 h-14 rounded-2xl bg-amber-500 text-black flex items-center justify-center hover:bg-white transition-all shadow-lg"><FaArrowRight /></button>
      </div>
    </div>
  </motion.div>
);

/* --- FULL DOSSIER MODAL --- */
const ProductDossier = ({ product, isDarkMode, onClose, onAdd, formatArrival }) => (
  <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[999]" />
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
      className={`fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-6xl w-full z-[1000] rounded-[3.5rem] overflow-hidden border ${
        isDarkMode ? "bg-[#0d1117] border-slate-800 text-white" : "bg-white border-slate-200 text-black"
      }`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 h-full lg:h-[75vh]">
        <div className="bg-black flex items-center justify-center p-12">
          {product.image ? <img src={product.image} className="max-h-full w-full object-contain" alt="" /> : <FaBox size={100} className="opacity-10" />}
        </div>
        <div className="p-12 flex flex-col justify-center">
          <div className="flex justify-between items-start mb-10">
            <div className="bg-emerald-500/10 text-emerald-500 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">New Arrival Unit</div>
            <button onClick={onClose} className="p-4 bg-slate-500/10 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"><FaTimes /></button>
          </div>
          <h2 className="text-6xl font-black uppercase italic leading-none mb-8">{product.name}</h2>
          <div className="flex items-center justify-between mt-auto">
            <p className="text-5xl font-black text-amber-500">${product.price}</p>
            <button onClick={() => { onAdd(product); onClose(); }} className="px-12 py-7 bg-amber-500 text-black font-black uppercase text-xs tracking-widest rounded-[2rem] hover:bg-white transition-all">Add to Grid</button>
          </div>
        </div>
      </div>
    </motion.div>
  </>
);

export default NewArrivals;