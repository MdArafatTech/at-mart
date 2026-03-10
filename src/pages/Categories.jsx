import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useSearch } from "../context/SearchContext";
import { useCart } from "../context/CartContext";
// --- FIREBASE INFRASTRUCTURE ---
import { db } from "../firebase/Firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { 
  FaMicrochip, FaLayerGroup, FaBoxOpen, FaTag, 
  FaArrowRight, FaArrowLeft, FaShoppingCart, FaCheckCircle, FaTimes, FaTrash, FaSatellite 
} from "react-icons/fa";

import {  where } from "firebase/firestore";







// Static UI Configuration for Categories
const CATEGORY_MAP = [
  // --- CORE COMPONENTS ---
  { id: 1, name: "Processors", icon: "🧠", desc: "High-performance silicon.", spec: "Up to 6.0GHz", offer: "10% OFF i9 Series" },
  { id: 2, name: "Graphics Cards", icon: "🎮", desc: "Ray-tracing powerhouses.", spec: "GDDR6X Support", offer: "Free Game Bundle" },
  { id: 3, name: "Motherboards", icon: "🖥️", desc: "Foundational circuits.", spec: "Z790 / X670E", offer: "Next-Day Install" },
  { id: 4, name: "Memory (RAM)", icon: "📏", desc: "DDR5 modules.", spec: "Up to 8000MT/s", offer: "Buy 2 Get 15% Off" },
  { id: 5, name: "Storage (SSD/HDD)", icon: "💾", desc: "Gen5 NVMe drives.", spec: "14,500MB/s Read", offer: "Save $50 on 4TB" },
  { id: 6, name: "Power Supplies", icon: "⚡", desc: "ATX 3.0 Ready.", spec: "80+ Platinum", offer: "10-Year Warranty" },
  { id: 7, name: "PC Cases", icon: "🏗️", desc: "Airflow optimized.", spec: "Dual-Chamber", offer: "Free Fan Kit" },
  { id: 8, name: "Cooling Systems", icon: "❄️", desc: "Liquid & Air cooling.", spec: "360mm AIO", offer: "Thermal Paste Inc." },

  // --- PERIPHERALS & GEAR ---
  { id: 9, name: "Monitors", icon: "📺", desc: "Ultra-fast displays.", spec: "240Hz OLED", offer: "Dead Pixel Guarantee" },
  { id: 10, name: "Audio Gear", icon: "🎧", desc: "Studio acoustics.", spec: "Hi-Res Certified", offer: "Free Stand" },
  { id: 11, name: "Keyboards", icon: "⌨️", desc: "Mechanical precision.", spec: "Hot-Swappable", offer: "Custom Keycaps" },
  { id: 12, name: "Mice & Pads", icon: "🖱️", desc: "Lightweight aim.", spec: "8K Polling", offer: "Bundle & Save" },
  { id: 13, name: "Streaming Gear", icon: "📹", desc: "Creator essentials.", spec: "4K Capture", offer: "Streamer Starter Kit" },
  { id: 14, name: "Networking", icon: "🌐", desc: "Lag-free speed.", spec: "WiFi 7 Ready", offer: "Setup Support" },

  // --- SYSTEMS & MOBILE ---
  { id: 15, name: "Laptops", icon: "💻", desc: "Mobile workstations.", spec: "RTX 4090 Mobile", offer: "Free Laptop Bag" },
  { id: 16, name: "Pre-built PCs", icon: "🤖", desc: "Plug & play power.", spec: "Stress Tested", offer: "2-Year Warranty" },
  { id: 17, name: "Handheld Consoles", icon: "🕹️", desc: "Gaming on the go.", spec: "RDNA 3 Graphics", offer: "Travel Case Inc." },
  { id: 18, name: "Accessories", icon: "🔌", desc: "Essential add-ons.", spec: "USB-C Ecosystem", offer: "Buy 3 for $20" },
  { id: 19, name: "Mobile", icon: "📱", desc: "ECutting-edge mobile devices", spec: "5G Ready", offer: "Trade Program" },
];
const CategoriesPage = () => {
  const { isDarkMode } = useTheme();
  const { searchQuery } = useSearch();
  const { addToCart, cartItems, removeFromCart } = useCart();
  
  const [dbProducts, setDbProducts] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- 1. REAL-TIME DATABASE SYNC ---
useEffect(() => {
  setLoading(true);
  
  // Logic: 
  // 1. Must be assigned to 'Homepage'
  // 2. Must NOT be on sale
  // 3. Ordered by newest first
  const q = query(
    collection(db, "products"), 
    where("targetPage", "==", "Homepage"),
    where("isOnSale", "==", false),
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const productData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setDbProducts(productData);
    setLoading(false);
  }, (error) => {
    console.error("Firestore Sync Error:", error);
    setLoading(false);
  });

  return () => unsubscribe();
}, []);

  // --- 2. SEARCH & CATEGORY FILTERING ---
  const filteredProducts = useMemo(() => {
    let products = [...dbProducts];
    
    if (selectedCategory) {
      products = products.filter(p => p.category === selectedCategory.name);
    }
    
    if (searchQuery.trim()) {
      const qText = searchQuery.toLowerCase();
      products = products.filter(p =>
        p.name?.toLowerCase().includes(qText) ||
        p.category?.toLowerCase().includes(qText) ||
        p.tech?.toLowerCase().includes(qText)
      );
    }
    return products;
  }, [selectedCategory, searchQuery, dbProducts]);

  return (
    <div className={`min-h-screen pt-28 pb-20 transition-all duration-500 ${
      isDarkMode ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900"
    }`}>
      
      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          /* CATEGORY HUB VIEW */
          <motion.div key="hub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <section className="max-w-7xl mx-auto px-6 mb-16">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-800/20 pb-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-amber-500">
                    <FaSatellite className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Live Database Feed Active</span>
                  </div>
                  <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">
                    Select <br /> <span className="text-amber-500">Sector</span>
                  </h1>
                </div>
                {searchQuery && (
                  <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl">
                    <p className="text-xs font-black text-amber-500 uppercase tracking-widest">{filteredProducts.length} Matches Found</p>
                    <p className="text-[8px] opacity-60 uppercase mt-1">Filtering Global Nodes...</p>
                  </div>
                )}
              </div>
            </section>

            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Syncing Satellite Data...</div>
              </div>
            ) : (
              <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {CATEGORY_MAP.map((cat, idx) => (
                  <CategoryCard 
                    key={cat.id} 
                    cat={{...cat, count: dbProducts.filter(p => p.category === cat.name).length}} 
                    idx={idx} 
                    isDarkMode={isDarkMode} 
                    onSelect={() => setSelectedCategory(cat)} 
                  />
                ))}
              </section>
            )}
          </motion.div>
        ) : (
          /* PRODUCT LIST VIEW */
          <motion.div key="products" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="max-w-7xl mx-auto px-6">
            <button 
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-3 text-amber-500 font-black uppercase text-[10px] tracking-widest mb-10 hover:gap-5 transition-all cursor-pointer group"
            >
              <FaArrowLeft className="group-hover:-translate-x-2 transition-transform" /> Directory Return
            </button>

            <div className="flex justify-between items-end mb-16 border-l-8 border-amber-500 pl-10">
              <div>
                <h2 className="text-5xl font-black italic uppercase tracking-tighter">{selectedCategory.name}</h2>
                <p className="opacity-40 font-bold uppercase text-[10px] tracking-[0.4em] mt-3">{selectedCategory.desc}</p>
              </div>
              <div className="text-right hidden sm:block">
                <span className="text-6xl font-black italic text-amber-500">{filteredProducts.length}</span>
                <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.3em]">Available Units</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <ProductCard 
                    key={p.id} 
                    p={p} 
                    isDarkMode={isDarkMode} 
                    onAdd={() => { addToCart(p); setIsCartOpen(true); }} 
                  />
                ))
              ) : (
                <div className="col-span-full py-32 text-center">
                   <FaBoxOpen className="mx-auto text-6xl opacity-10 mb-6" />
                   <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20">No nodes detected in this sector</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} remove={removeFromCart} isDarkMode={isDarkMode} />
    </div>
  );
};

// ──────────────────────────────────────────────────────────────
// SUB-COMPONENTS

const CategoryCard = ({ cat, idx, isDarkMode, onSelect }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay: idx * 0.05 }}
    whileHover={{ y: -10 }}
    onClick={onSelect}
    className={`relative group cursor-pointer p-10 rounded-[3rem] border transition-all h-[400px] flex flex-col justify-between overflow-hidden ${
      isDarkMode ? "bg-[#0d1117] border-slate-800 hover:border-amber-500/50" : "bg-white border-slate-100 shadow-xl"
    }`}
  >
    <div className="absolute top-8 right-0 bg-amber-500 text-black text-[8px] font-black px-5 py-2 rounded-l-full uppercase italic tracking-[0.2em] z-20">
      {cat.offer}
    </div>
    <div className="relative z-10">
      <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-500">{cat.icon}</div>
      <h3 className="text-3xl font-black italic uppercase group-hover:text-amber-500 transition-colors">{cat.name}</h3>
      <p className="text-[10px] font-bold opacity-40 uppercase tracking-wider mt-4">{cat.desc}</p>
    </div>
    <div className="relative z-10 pt-6 border-t border-slate-800/10 space-y-4">
      <div className="flex justify-between items-center text-[9px] font-black uppercase">
        <span className="text-amber-500 flex items-center gap-2"><FaMicrochip /> {cat.spec}</span>
        <span className="opacity-30">{cat.count} Units</span>
      </div>
      <div className="w-full h-1 bg-slate-500/10 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((cat.count / 20) * 100, 100)}%` }} className="h-full bg-amber-500" />
      </div>
    </div>
  </motion.div>
);

const ProductCard = ({ p, isDarkMode, onAdd }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className={`group p-6 rounded-[2.5rem] border transition-all ${
      isDarkMode ? "bg-[#0d1117] border-slate-800 hover:border-amber-500" : "bg-white border-slate-200 shadow-lg"
    }`}
  >
    <div className="aspect-square bg-slate-900/10 rounded-3xl flex items-center justify-center overflow-hidden mb-6">
      {p.image ? (
        <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
      ) : (
        <span className="text-6xl">{p.img || "📦"}</span>
      )}
    </div>
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="font-black text-xs uppercase leading-tight line-clamp-2">{p.name}</h3>
        <span className="text-xl font-black italic text-amber-500">${p.price}</span>
      </div>
      <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase pb-4 border-b border-slate-800/10">
        <FaMicrochip className="text-amber-500" /> {p.tech || "Gen-5 Protocol"}
      </div>
      <div className="flex justify-between items-center pt-2">
        <span className="text-[8px] font-black uppercase text-emerald-500 flex items-center gap-1">
          <FaCheckCircle /> Verified
        </span>
        <button 
          onClick={(e) => { e.stopPropagation(); onAdd(); }}
          className="px-5 py-3 bg-amber-500 text-black font-black text-[9px] uppercase rounded-xl hover:bg-white transition-all cursor-pointer flex items-center gap-2"
        >
          Add To Cart <FaShoppingCart />
        </button>
      </div>
    </div>
  </motion.div>
);

const CartDrawer = ({ isOpen, onClose, cartItems, remove, isDarkMode }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999]" />
        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className={`fixed inset-y-0 right-0 z-[1000] w-full max-w-sm p-8 flex flex-col ${isDarkMode ? "bg-[#0d1117] border-l border-slate-800" : "bg-white shadow-2xl"}`}>
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black italic uppercase">Arsenal</h2>
            <FaTimes className="text-2xl cursor-pointer hover:text-amber-500" onClick={onClose} />
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-center bg-slate-800/20 p-5 rounded-2xl">
                <div className="text-2xl">{item.img || "📦"}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-black uppercase truncate">{item.name}</h4>
                  <p className="text-amber-500 font-black italic">${item.price}</p>
                </div>
                <FaTrash className="text-rose-500 cursor-pointer" onClick={() => remove(item.id)} />
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-slate-800/30">
            <div className="flex justify-between mb-6 font-black uppercase">
              <span>Total</span>
              <span className="text-3xl text-amber-500">${cartItems.reduce((s, i) => s + (Number(i.price) || 0), 0).toLocaleString()}</span>
            </div>
            <button className="w-full py-5 bg-amber-500 text-black font-black uppercase rounded-2xl hover:bg-white transition-all shadow-xl">Execute Order</button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default CategoriesPage;