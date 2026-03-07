import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// MUST BE ACTUAL IMPORTS
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { useTheme } from "../context/ThemeContext"; 
import { useSearch } from "../context/SearchContext"; 
import { useCart } from "../context/CartContext"; 
import { 
  FaArrowRight, FaTimes, FaTrash, FaMicrochip, 
  FaServer, FaWind, FaBolt, FaShieldAlt, FaChevronRight
} from "react-icons/fa";

const Homepage = () => {
  const { isDarkMode } = useTheme(); 
  const { searchQuery } = useSearch(); 
  const { cartItems, addToCart, removeFromCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const products = [
    { id: 1, name: "Neural Link i9", price: 899, cat: "Computing", img: "🧠", tech: "6.0 GHz", tag: "Hot" },
    { id: 2, name: "Vortex RTX 5090", price: 1599, cat: "Gaming", img: "🎮", tech: "32GB VRAM", tag: "Limit" },
    { id: 3, name: "Ghost Carbon Laptop", price: 2800, cat: "Computing", img: "💻", tech: "Liquid Cooled", tag: "Elite" },
    { id: 4, name: "Nano-State 200TB", price: 650, cat: "Storage", img: "💾", tech: "Optane tech", tag: "Sale" },
    { id: 5, name: "Holoscreen Fold", price: 1300, cat: "Mobile", img: "📱", tech: "8K Foldable", tag: "New" },
    { id: 6, name: "Neuro-Watch Pro", price: 450, cat: "Mobile", img: "⌚", tech: "Oxygen Sync", tag: "Trend" },
    { id: 7, name: "Photon Keyboard", price: 210, cat: "Computing", img: "⌨️", tech: "Laser Switch", tag: "Fast" },
    { id: 8, name: "Void-X ANC", price: 320, cat: "Audio", img: "🎧", tech: "90dB Cancel", tag: "Pro" },
  ];

  const carouselItems = [
    { title: "THE QUANTUM AGE", subtitle: "Next-Gen Processors", img: "🌀", color: "from-blue-600 to-indigo-900" },
    { title: "ULTRA GAMING", subtitle: "RTX Series Now In Stock", img: "🕹️", color: "from-purple-600 to-pink-900" },
    { title: "MOBILE FUTURE", subtitle: "Satellite Link Enabled", img: "📡", color: "from-amber-500 to-orange-800" },
    { title: "CYBER AUDIO", subtitle: "Sonic Void ANC 2.0", img: "🎧", color: "from-emerald-600 to-teal-900" },
    { title: "NEURAL STORAGE", subtitle: "100TB Quantum SSD", img: "💾", color: "from-rose-600 to-red-900" },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.cat === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900"}`}>
      
      {/* 1. HERO CONTINUOUS CAROUSEL */}
      <section className="pt-6 pb-10 px-4">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={0}
          centeredSlides={true}
          loop={true} 
          speed={1200}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          navigation={true}
          className="max-w-7xl h-[350px] md:h-[550px] rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl"
        >
          {carouselItems.map((item, idx) => (
            <SwiperSlide key={idx}>
              <div className={`w-full h-full bg-gradient-to-br ${item.color} flex items-center p-8 md:p-20 relative overflow-hidden`}>
                <div className="absolute -right-10 -bottom-10 opacity-10 text-[300px] md:text-[500px] rotate-12 select-none pointer-events-none">
                  {item.img}
                </div>
                <div className="z-10 w-full md:w-2/3">
                  <motion.div initial={{ x: -100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
                    <h2 className="text-4xl md:text-8xl font-black italic mb-4 leading-[0.9] text-white uppercase">{item.title}</h2>
                    <p className="text-sm md:text-xl font-bold text-white/80 mb-8 uppercase tracking-[0.3em]">{item.subtitle}</p>
                    <button className="px-8 md:px-12 py-4 bg-white text-black font-black uppercase text-[10px] md:text-xs rounded-full hover:bg-amber-500 hover:text-white transition-all shadow-xl cursor-pointer">
                      Deploy Tech
                    </button>
                  </motion.div>
                </div>
                <div className="hidden lg:block text-[280px] opacity-20 z-10">{item.img}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* 2. TRUST BADGES */}
      <section className="py-12 border-y border-slate-800/20 bg-slate-500/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <TrustItem icon={<FaShieldAlt/>} title="Secure Link" desc="AES-256 Encrypted" />
          <TrustItem icon={<FaBolt/>} title="Warp Speed" desc="Same Day Shipping" />
          <TrustItem icon={<FaServer/>} title="Verified" desc="Authentic Nodes" />
          <TrustItem icon={<FaWind/>} title="Thermal" desc="Cooling Optimized" />
        </div>
      </section>














{/* 3. PRODUCT GRID WITH FILTERS */}


<section className="py-12 md:py-24 max-w-7xl mx-auto px-4 md:px-6">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6">
    <div className="w-full">
      <h3 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">
        Hardware Arsenal
      </h3>
      
      {/* Category Container: Mobile-First Scroll */}
      <div className="flex gap-2 mt-6 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 snap-x">
        {['All', 'Computing', 'Gaming', 'Mobile', 'Storage', 'Audio'].map(c => (
          <button 
            key={c} 
            onClick={() => setActiveCategory(c)} 
            className={`
              snap-start px-6 md:px-8 py-2.5 md:py-3 rounded-xl text-[9px] md:text-[10px] 
              font-black uppercase transition-all cursor-pointer whitespace-nowrap
              ${activeCategory === c 
                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20 scale-100" 
                : "bg-slate-800/10 text-slate-500 hover:bg-slate-800/20 scale-95 md:scale-100"}
            `}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  </div>

  {/* Responsive Grid: 1 col on tiny phones, 2 on phablets/tablets, 4 on desktop */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
    <AnimatePresence mode="popLayout">
      {filteredProducts.map(p => (
        <motion.div
          key={p.id}
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <ProductCard 
            product={p} 
            onAdd={() => { addToCart(p); setIsCartOpen(true); }} 
            isDarkMode={isDarkMode} 
          />
        </motion.div>
      ))}
    </AnimatePresence>
  </div>


{/* SHOP MORE BUTTON */}
<div className="mt-16 flex justify-center">
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => window.location.href = '/shop'} // Or use navigate('/shop') if using React Router
    className={`
      group relative cursor-pointer flex items-center gap-4 px-12 py-5 rounded-2xl 
      font-black uppercase text-xs tracking-[0.2em] transition-all overflow-hidden
      ${isDarkMode 
        ? "bg-white text-black hover:bg-amber-500" 
        : "bg-slate-900 text-white hover:bg-amber-500"}
    `}
  >
    <span className="  relative z-10">Shop More</span>
    <FaArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
    
    {/* Subtle Glow Effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
  </motion.button>
</div>



</section>















      {/* 4. TECH REPAIR CALLOUT */}
      <section className="py-10 px-6 max-w-7xl mx-auto">
        <div className={`rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative ${isDarkMode ? "bg-amber-500 text-black" : "bg-slate-900 text-white"}`}>
          <div className="flex-1 z-10">
            <h2 className="text-5xl md:text-7xl font-black italic leading-[0.9] mb-6">UPLINK & REPAIR</h2>
            <p className="font-bold opacity-80 mb-8 uppercase text-sm tracking-widest">Global technical support for all decentralized components.</p>
            <button className={`px-10 py-5 rounded-2xl font-black text-xs uppercase shadow-2xl ${isDarkMode ? "bg-black text-white" : "bg-amber-500 text-black"}`}>Schedule Diagnostic</button>
          </div>
          <div className="text-9xl md:text-[12rem] opacity-20 absolute -right-10 rotate-12">⚙️</div>
        </div>
      </section>

      {/* GLOBAL CART DRAWER */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} remove={removeFromCart} isDarkMode={isDarkMode} />
    </div>
  );
};

/* --- SHARED SUB-COMPONENTS --- */

const ProductCard = ({ product, onAdd, isDarkMode }) => (
  <motion.div whileHover={{ y: -10 }} className={`p-6 rounded-[2.5rem] border transition-all ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white border-slate-200 shadow-xl"}`}>
    <div className="aspect-square bg-slate-500/5 rounded-3xl flex items-center justify-center text-7xl mb-6 relative overflow-hidden group">
      <span className="group-hover:scale-110 transition-transform duration-700">{product.img}</span>
      <div className="absolute top-4 left-4 bg-black/80 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase italic tracking-widest">{product.tag}</div>
      <button onClick={onAdd} className="absolute bottom-4 inset-x-4 py-4 bg-amber-500 text-black font-black text-[10px] uppercase rounded-xl translate-y-24 group-hover:translate-y-0 transition-transform cursor-pointer shadow-lg active:scale-95">Deploy to Cart</button>
    </div>
    <div className="flex justify-between items-start mb-4">
      <div>
        <h4 className="font-black text-[10px] uppercase text-slate-500 mb-1">{product.cat}</h4>
        <h3 className="font-black text-sm uppercase leading-tight">{product.name}</h3>
      </div>
      <p className="text-xl font-black italic text-amber-500">${product.price}</p>
    </div>
    <div className="pt-4 border-t border-slate-800/10 flex items-center justify-between">
       <span className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase"><FaMicrochip className="text-amber-500"/> {product.tech}</span>
       <FaArrowRight className="text-slate-400 group-hover:text-amber-500 transition-colors" />
    </div>
  </motion.div>
);

const TrustItem = ({ icon, title, desc }) => (
  <div className="text-center group cursor-default">
    <div className="text-4xl text-amber-500 mb-3 flex justify-center group-hover:rotate-12 transition-transform">{icon}</div>
    <h4 className="font-black text-xs uppercase tracking-tighter mb-1">{title}</h4>
    <p className="text-[9px] font-bold opacity-50 uppercase tracking-widest">{desc}</p>
  </div>
);

const CartDrawer = ({ isOpen, onClose, cartItems, remove, isDarkMode }) => (
  <>
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]" 
        />
      )}
    </AnimatePresence>
    <div className={`fixed inset-y-0 right-0 z-[1000] w-full max-w-sm transition-transform duration-500 transform ${isOpen ? "translate-x-0" : "translate-x-full"} ${isDarkMode ? "bg-[#0d1117] border-l border-slate-800" : "bg-white border-l border-slate-200"} shadow-2xl`}>
      <div className="p-8 h-full flex flex-col">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-black italic tracking-tighter uppercase">Arsenal Bay</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 transition-colors cursor-pointer"><FaTimes size={20}/></button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <FaServer size={50} className="mb-4" />
              <p className="text-center font-black uppercase text-[10px] tracking-[0.3em]">No Gear Detected</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.cartId} className="flex gap-4 items-center group bg-slate-500/5 p-4 rounded-2xl">
                <div className="h-16 w-16 bg-white/5 rounded-xl flex items-center justify-center text-3xl">{item.img}</div>
                <div className="flex-1">
                  <h4 className="text-[10px] font-black uppercase leading-tight mb-1">{item.name}</h4>
                  <p className="text-amber-500 font-black italic text-lg">${item.price}</p>
                </div>
                <button onClick={() => remove(item.cartId)} className="p-3 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"><FaTrash size={14}/></button>
              </div>
            ))
          )}
        </div>
        <div className="pt-8 border-t border-slate-800/20">
          <div className="flex justify-between font-black mb-6">
            <span className="text-xs tracking-[0.2em] opacity-50 uppercase">Subtotal</span>
            <span className="text-2xl text-amber-500">${cartItems.reduce((s, i) => s + i.price, 0)}</span>
          </div>
          <button className="w-full py-5 bg-amber-500 text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-lg shadow-amber-500/20">Authorize Checkout</button>
        </div>
      </div>
    </div>
  </>
);

export default Homepage;