import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { useNavigate } from "react-router-dom";

// Firebase & Icons
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import {
  FaArrowRight, FaTimes, FaTrash, FaMicrochip, FaServer, 
  FaShieldAlt, FaBolt, FaWind, FaShoppingCart, FaHeadphones, 
  FaKeyboard, FaBatteryFull, FaMicrophoneAlt, FaSatelliteDish
} from "react-icons/fa";

// Styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const Homepage = () => {
  const { isDarkMode } = useTheme();
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDarkMode ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900"}`}>
      
      {/* 1. HERO CAROUSEL: THE MATRIX ENTRY */}
      <section className="pt-6 pb-10 px-4">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          loop={true}
          effect="fade"
          autoplay={{ delay: 5000 }}
          speed={1500}
          pagination={{ clickable: true, dynamicBullets: true }}
          navigation={true}
          className="max-w-7xl h-[500px] md:h-[700px] rounded-[3rem] overflow-hidden shadow-2xl mx-auto"
        >
          <SwiperSlide>
            <HeroSlide 
              title="Quantum Intelligence" 
              subtitle="GEN-7 ARCHITECTURE" 
              btnText="Sync Arsenal" 
              bg="from-blue-600 to-indigo-950" 
              icon="🌀" 
              onBtnClick={() => navigate("/shop")} 
            />
          </SwiperSlide>
          <SwiperSlide>
            <HeroSlide 
              title="Neural Audio" 
              subtitle="0.001ms LATENCY" 
              btnText="Experience Sound" 
              bg="from-rose-600 to-purple-900" 
              icon="🎧" 
              onBtnClick={() => navigate("/shop?cat=Audio")} 
            />
          </SwiperSlide>
          <SwiperSlide>
            <HeroSlide 
              title="Solar Power" 
              subtitle="INFINITE CELL TECH" 
              btnText="View Power Stations" 
              bg="from-amber-500 to-orange-800" 
              icon="🔋" 
              onBtnClick={() => navigate("/shop?cat=Power")} 
            />
          </SwiperSlide>
        </Swiper>
      </section>

      {/* 2. LIVE SYSTEM STATS (New Dynamic Section) */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatBox label="Network Status" value="Online" color="text-emerald-500" />
          <StatBox label="Active Nodes" value="2,482" color="text-amber-500" />
          <StatBox label="Global Delivery" value="Warp Enabled" color="text-blue-500" />
        </div>
      </section>

      {/* 3. EXPANDED CATEGORY GRID (8 Categories) */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.5em] mb-4">Classified Departments</h2>
          <h3 className="text-4xl md:text-6xl font-black italic uppercase">Select Your <span className="text-amber-500">Tier</span></h3>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <GatewayCard title="Computing" icon={<FaMicrochip />} color="from-blue-500/10" onClick={() => navigate("/categories")} />
          <GatewayCard title="Gaming" icon={<FaServer />} color="from-purple-500/10" onClick={() => navigate("/categories?cat=Gaming")} />
          <GatewayCard title="Audio" icon={<FaHeadphones />} color="from-rose-500/10" onClick={() => navigate("/categories?cat=Gaming?cat=Audio")} />
          <GatewayCard title="Input" icon={<FaKeyboard />} color="from-cyan-500/10" onClick={() => navigate("/categories?cat=Gaming?cat=Peripherals")} />
          <GatewayCard title="Power" icon={<FaBatteryFull />} color="from-amber-500/10" onClick={() => navigate("/categories?cat=Gaming?cat=Power")} />
          <GatewayCard title="Recording" icon={<FaMicrophoneAlt />} color="from-indigo-500/10" onClick={() => navigate("/categories?cat=Recording")} />
          <GatewayCard title="Network" icon={<FaSatelliteDish />} color="from-emerald-500/10" onClick={() => navigate("/categories?cat=Gamingcat=Network")} />
          <GatewayCard title="Security" icon={<FaShieldAlt />} color="from-slate-500/10" onClick={() => navigate("/categories?cat=Gaming?cat=Security")} />
        </div>
      </section>

      {/* 4. DUAL PROMO BANNERS (New & Sale) */}
      <section className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 gap-8">
        <PromoBanner 
          title="Fresh Drop" 
          headline="Latest Edition Hardware" 
          btn="View Shop" 
          color="bg-slate-900" 
          onClick={() => navigate("/shop")} 
          img="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000"
        />
        <PromoBanner 
          title="Clearance" 
          headline="best offer of the year" 
          btn="Enter Sale" 
          color="bg-rose-950" 
          onClick={() => navigate("/sale")} 
          badge="70%"
          img="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000"
        />
      </section>

      {/* 5. NEWSLETTER: THE INNER CIRCLE */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-amber-500 rounded-[3.5rem] p-12 md:p-24 text-center flex flex-col items-center justify-center elative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <h2 className="text-4xl md:text-7xl font-black italic uppercase text-black mb-8 relative z-10">Product Updates</h2>
          <div className="max-w-md mx-auto flex flex-col md:flex-row gap-4 relative z-10">
      <a href="/newarrivals" className="flex items-center justify-center">
            <button className="bg-black cursor-pointer text-white px-10 items-center justify-center py-4 rounded-2xl font-black uppercase text-xs hover:bg-zinc-800 transition-colors">Connect</button></a>
          </div>
        </div>
      </section>

      {/* CART DRAWER (Kept functional) */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} remove={removeFromCart} isDarkMode={isDarkMode} navigate={navigate} />
    </div>
  );
};

// --- SUB-COMPONENTS FOR CLEANER CODE ---

const HeroSlide = ({ title, subtitle, btnText, bg, icon, onBtnClick }) => (
  <div className={`w-full h-full bg-gradient-to-br ${bg} flex items-center p-8 md:p-24 relative`}>
    <div className="z-10">
      <motion.span initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="inline-block bg-white/10 backdrop-blur-xl px-6 py-2 rounded-full mb-6 text-[10px] font-black tracking-widest text-white border border-white/20">{subtitle}</motion.span>
      <motion.h2 initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} transition={{delay:0.1}} className="text-5xl md:text-8xl font-black italic uppercase leading-[0.85] mb-10 text-white">{title}</motion.h2>
      <motion.button initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} transition={{delay:0.2}} onClick={onBtnClick} className="px-12 py-5 bg-white text-black font-black uppercase text-xs rounded-full hover:bg-amber-500 hover:text-white transition-all shadow-2xl">
        {btnText} →
      </motion.button>
    </div>
    <div className="absolute right-10 bottom-10 text-[250px] md:text-[450px] opacity-10 pointer-events-none select-none">{icon}</div>
  </div>
);

const GatewayCard = ({ title, icon, color, onClick }) => (
  <motion.div whileHover={{ y: -8, scale: 1.02 }} onClick={onClick} className={`p-8 rounded-[2.5rem] bg-gradient-to-b ${color} to-transparent border border-white/5 cursor-pointer flex flex-col items-center justify-center gap-4 transition-all group`}>
    <div className="text-4xl text-amber-500 group-hover:scale-110 transition-transform">{icon}</div>
    <h4 className="text-sm font-black uppercase italic tracking-tighter opacity-80">{title}</h4>
  </motion.div>
);

const PromoBanner = ({ title, headline, btn, color, onClick, img, badge }) => (
  <motion.div whileHover={{ scale: 0.99 }} onClick={onClick} className={`h-[450px] rounded-[3rem] ${color} relative overflow-hidden cursor-pointer group`}>
    <img src={img} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-1000" alt="" />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
    {badge && <div className="absolute top-8 right-8 bg-rose-600 text-white w-14 h-14 rounded-full flex items-center justify-center font-black italic text-sm animate-pulse shadow-lg shadow-rose-600/40">{badge}</div>}
    <div className="absolute bottom-10 left-10 p-2">
      <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em]">{title}</span>
      <h4 className="text-4xl font-black uppercase italic text-white mt-2 mb-6 leading-none">{headline}</h4>
      <div className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-black uppercase text-[10px] group-hover:bg-amber-500 group-hover:text-white transition-colors">{btn}</div>
    </div>
  </motion.div>
);

const StatBox = ({ label, value, color }) => (
  <div className="bg-white/5 border border-white/5 backdrop-blur-sm p-6 rounded-3xl flex flex-col items-center justify-center text-center">
    <span className="text-[9px] font-black uppercase opacity-40 tracking-widest mb-1">{label}</span>
    <span className={`text-xl font-black italic uppercase ${color}`}>{value}</span>
  </div>
);

// (Keep your CartDrawer as defined previously)
const CartDrawer = ({ isOpen, onClose, cartItems, remove, isDarkMode, navigate }) => {
    const subtotal = cartItems.reduce((s, i) => s + i.price * (i.quantity || 1), 0);
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]" />
                    <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25 }} className={`fixed inset-y-0 right-0 z-[1000] w-full max-w-[400px] flex flex-col ${isDarkMode ? "bg-[#0d1117] text-white" : "bg-white text-slate-900"}`}>
                        <div className="p-8 border-b border-white/5 flex justify-between items-center">
                            <h2 className="text-2xl font-black italic uppercase">Cart <span className="text-amber-500">Bay</span></h2>
                            <button onClick={onClose} className="p-3 bg-slate-500/10 rounded-xl"><FaTimes /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {cartItems.map(item => (
                                <div key={item.cartId} className="flex gap-4 items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="w-12 h-12 flex items-center justify-center text-2xl">{item.image ? <img src={item.image} className="w-full h-full object-cover rounded-lg" alt="" /> : item.img}</div>
                                    <div className="flex-1">
                                        <h4 className="text-[10px] font-black uppercase truncate">{item.name}</h4>
                                        <p className="text-amber-500 font-black">${item.price}</p>
                                    </div>
                                    <button onClick={() => remove(item.cartId)} className="text-slate-500 hover:text-rose-500"><FaTrash size={12}/></button>
                                </div>
                            ))}
                        </div>
                        <div className="p-8 border-t border-white/5 bg-black/20">
                            <div className="flex justify-between mb-6">
                                <span className="font-black uppercase text-xs opacity-40">Total Valuation</span>
                                <span className="font-black text-amber-500 text-xl">${subtotal.toLocaleString()}</span>
                            </div>
                            <button onClick={() => { onClose(); navigate("/cartpage"); }} className="w-full py-5 bg-amber-500 text-black font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-lg shadow-amber-500/20">Authorize Checkout</button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Homepage;