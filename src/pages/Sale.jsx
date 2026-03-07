import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import {
  FaFire, FaArrowRight, FaMicrochip, FaCalendarAlt,
  FaClock, FaTimes, FaPercent, FaBolt
} from "react-icons/fa";

// ──────────────────────────────────────────────────────────────
// 22 BIG SALE ITEMS (March 2026) — Standardized 'price' property
// ──────────────────────────────────────────────────────────────
const SALE_ITEMS = [
  // Graphics Cards
  { id: 8001, name: "NVIDIA RTX 5090", original: 2199, price: 1799, discount: 18, cat: "Graphics Cards", img: "⚡", tech: "32GB GDDR7 • Blackwell", arrival: "2025-01-30 09:00 UTC", stock: "Only 64 left", detail: "Biggest GPU drop of 2026" },
  { id: 8002, name: "NVIDIA RTX 5080", original: 1299, price: 999, discount: 23, cat: "Graphics Cards", img: "🌌", tech: "16GB GDDR7", arrival: "2025-01-30 09:00 UTC", stock: "Only 128 left", detail: "4K gaming beast" },
  { id: 8003, name: "AMD RX 9070 XT", original: 849, price: 599, discount: 29, cat: "Graphics Cards", img: "🔥", tech: "16GB GDDR6 • FSR 4", arrival: "2026-02-18 14:00 UTC", stock: "Only 91 left", detail: "Best value 4K card" },

  // Processors
  { id: 8004, name: "AMD Ryzen 9 9950X3D", original: 849, price: 629, discount: 26, cat: "Processors", img: "🧠", tech: "16C/32T • 128MB V-Cache", arrival: "2025-03-12 13:00 UTC", stock: "Only 107 left", detail: "Fastest gaming CPU" },
  { id: 8005, name: "Intel Core Ultra 9 285K", original: 649, price: 499, discount: 23, cat: "Processors", img: "🌟", tech: "24 Cores • NPU", arrival: "2024-10-24 08:00 UTC", stock: "Only 214 left", detail: "AI powerhouse" },
  { id: 8006, name: "AMD Ryzen 7 9800X3D", original: 529, price: 399, discount: 25, cat: "Processors", img: "⚡", tech: "8C/16T • 96MB V-Cache", arrival: "2024-11-07 10:00 UTC", stock: "Only 183 left", detail: "Still the king" },

  // Motherboards
  { id: 8007, name: "ASUS ROG Maximus Z890 Extreme", original: 999, price: 699, discount: 30, cat: "Motherboards", img: "🔌", tech: "Thunderbolt 5 • WiFi 7", arrival: "2025-02-12 11:00 UTC", stock: "Only 38 left", detail: "Ultimate flagship" },
  { id: 8008, name: "MSI MPG X870E Carbon", original: 599, price: 429, discount: 28, cat: "Motherboards", img: "🌐", tech: "PCIe 5.0 • WiFi 7", arrival: "2025-01-15 15:00 UTC", stock: "Only 76 left", detail: "High-end AM5" },

  // Memory
  { id: 8009, name: "G.Skill Trident Z5 64GB DDR5-9200", original: 389, price: 249, discount: 36, cat: "Memory", img: "📏", tech: "CL32 • EXPO", arrival: "2026-02-25 09:30 UTC", stock: "Only 142 left", detail: "Fastest DDR5 kit" },
  { id: 8010, name: "Corsair Dominator 96GB", original: 579, price: 399, discount: 31, cat: "Memory", img: "💎", tech: "8000MT/s", arrival: "2025-03-01 12:00 UTC", stock: "Only 89 left", detail: "Premium RGB RAM" },

  // Storage
  { id: 8011, name: "Crucial T705 4TB Gen5", original: 699, price: 479, discount: 31, cat: "Storage", img: "🚄", tech: "14,500 MB/s", arrival: "2025-01-08 12:00 UTC", stock: "Only 67 left", detail: "Fastest SSD alive" },
  { id: 8012, name: "Samsung 990 EVO Plus 4TB", original: 429, price: 299, discount: 30, cat: "Storage", img: "⚡", tech: "Gen4 Heatsink", arrival: "2025-02-05 10:00 UTC", stock: "Only 134 left", detail: "Best seller" },

  // Mobile Tech
  { id: 8013, name: "Samsung Galaxy Z Fold7 Ultra", original: 2399, price: 1799, discount: 25, cat: "Mobile Tech", img: "📱", tech: "Tri-Fold 10.2\"", arrival: "2025-09-10 00:01 UTC", stock: "Pre-order", detail: "Most advanced foldable" },

  // Power Units
  { id: 8014, name: "Seasonic Prime TX-1600 Titanium", original: 579, price: 379, discount: 35, cat: "Power Units", img: "🔋", tech: "1600W • 80+ Titanium", arrival: "2025-03-05 10:00 UTC", stock: "Only 52 left", detail: "Best PSU for 5090" },

  // Audio Gear
  { id: 8015, name: "Beyerdynamic MMX 330 Studio Pro", original: 749, price: 499, discount: 33, cat: "Audio Gear", img: "🎧", tech: "Planar Magnetic + DAC", arrival: "2025-02-20 14:30 UTC", stock: "Only 81 left", detail: "Studio reference" },

  // Peripherals
  { id: 8016, name: "Logitech G Pro X Superlight 2", original: 179, price: 119, discount: 34, cat: "Peripherals", img: "🖱️", tech: "60g • 8000Hz", arrival: "2025-01-20 09:00 UTC", stock: "Only 203 left", detail: "Best wireless mouse" },
  { id: 8017, name: "Razer Huntsman V3 Pro", original: 279, price: 189, discount: 32, cat: "Peripherals", img: "⌨️", tech: "8KHz Optical", arrival: "2025-02-10 11:00 UTC", stock: "Only 97 left", detail: "Pro gaming keyboard" },

  // Cooling
  { id: 8018, name: "Corsair iCUE H170i Elite 420", original: 349, price: 229, discount: 34, cat: "Cooling", img: "❄️", tech: "420mm LCD AIO", arrival: "2025-03-15 12:00 UTC", stock: "Only 68 left", detail: "Premium cooling" },
];

const SalePage = () => {
  const { isDarkMode } = useTheme();
  const { addToCart } = useCart();
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 30, hours: 14, minutes: 37, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatArrival = (arrival) => {
    const [date, time] = arrival.split(" ");
    return `${date} • ${time}`;
  };

  return (
    <div className={`min-h-screen pt-20 md:pt-28 pb-20 transition-colors duration-500 ${
      isDarkMode ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900"
    }`}>

      {/* HERO BANNER */}
      <section className="relative -mt-30 px-6 py-16 md:py-24 bg-gradient-to-br from-rose-600 via-orange-500 to-amber-500 text-black overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur px-8 py-3 rounded-full mb-6">
            <FaFire className="text-3xl animate-pulse" />
            <span className="font-black uppercase tracking-[0.4em]">SPRING MEGA SALE 2026</span>
          </div>
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black italic uppercase tracking-[-0.04em] leading-[0.85] mb-6">
            UP TO<br />42% OFF
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-8">
            <div className="text-4xl font-black">Sale Ends In</div>
            <div className="flex gap-3 text-center font-mono">
              {[
                { val: timeLeft.days, label: "DAYS" },
                { val: timeLeft.hours, label: "HRS" },
                { val: timeLeft.minutes, label: "MIN" },
                { val: timeLeft.seconds, label: "SEC" }
              ].map((t, i) => (
                <div key={i} className="bg-black/30 backdrop-blur px-5 py-3 rounded-2xl">
                  <div className="text-3xl font-black">{t.val}</div>
                  <div className="text-xs -mt-1">{t.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {SALE_ITEMS.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.025 }}
              onMouseEnter={() => setHoveredId(p.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedProduct(p)}
              className={`group relative rounded-3xl overflow-hidden border h-full flex flex-col cursor-pointer transition-all duration-300 ${
                isDarkMode ? "bg-[#0d1117] border-slate-800 hover:border-rose-500" : "bg-white border-slate-200 hover:shadow-2xl"
              }`}
            >
              <div className="absolute top-4 right-4 bg-rose-500 text-white text-xs font-black px-5 py-1 rounded-2xl shadow-xl z-30">
                -{p.discount}%
              </div>
              <div className="absolute top-4 left-4 text-[10px] bg-black/70 text-white px-3 py-1 rounded-xl font-mono flex items-center gap-1 z-30">
                <FaCalendarAlt className="text-amber-400" /> {formatArrival(p.arrival)}
              </div>
              <div className="h-56 bg-gradient-to-br from-slate-950 to-black flex items-center justify-center relative overflow-hidden">
                <motion.span animate={{ scale: hoveredId === p.id ? 1.32 : 1 }} className="text-9xl transition-all duration-500">
                  {p.img}
                </motion.span>
              </div>
              <div className="flex-1 p-6 flex flex-col">
                <div className="text-rose-500 text-xs font-black tracking-widest mb-1">{p.cat}</div>
                <h3 className="font-black text-xl leading-tight mb-4 line-clamp-2">{p.name}</h3>
                <div className="text-xs text-slate-400 mb-6 flex items-center gap-2">
                  <FaMicrochip /> {p.tech}
                </div>
                <div className="mt-auto pt-5 border-t border-slate-700/30 flex items-end justify-between">
                  <div>
                    <span className="line-through text-lg opacity-40">${p.original}</span>
                    <span className="text-3xl font-black text-rose-500 ml-3">${p.price}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                    className="bg-rose-500 cursor-pointer hover:bg-rose-400 text-black font-black uppercase text-xs tracking-widest px-5 py-3 rounded-2xl flex items-center gap-2"
                  >
                    ADD <FaArrowRight />
                  </motion.button>
                </div>
              </div>
              <div className="px-6 py-3 text-xs font-mono bg-black/20 flex items-center justify-between text-rose-400 border-t border-slate-700/30">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
                  {p.stock}
                </div>
                <FaClock />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />
            <motion.div
              initial={{ scale: 0.95, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 40, opacity: 0 }}
              className={`relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl ${isDarkMode ? "bg-[#0d1117]" : "bg-white text-slate-900"}`}
            >
              <div className="p-8 md:p-12">
                <button onClick={() => setSelectedProduct(null)} className="absolute top-8 right-8 text-4xl opacity-40 hover:opacity-100">
                  <FaTimes />
                </button>
                <div className="text-rose-500 text-xs font-black tracking-widest mb-2">{selectedProduct.cat}</div>
                <h2 className="text-4xl font-black mb-8">{selectedProduct.name}</h2>
                <div className="flex gap-6 mb-10 items-baseline">
                  <span className="text-4xl line-through opacity-30">${selectedProduct.original}</span>
                  <span className="text-7xl font-black text-rose-500">${selectedProduct.price}</span>
                </div>
                <div className="grid md:grid-cols-2 gap-8 mb-10">
                  <div className="text-[160px] flex items-center justify-center bg-slate-900/50 rounded-3xl p-6">{selectedProduct.img}</div>
                  <div className="space-y-4 text-sm font-bold uppercase tracking-tight">
                    <div className="flex justify-between border-b border-slate-800/10 pb-2"><span className="opacity-50">Arrival:</span> <span>{selectedProduct.arrival}</span></div>
                    <div className="flex justify-between border-b border-slate-800/10 pb-2"><span className="opacity-50">Specs:</span> <span>{selectedProduct.tech}</span></div>
                    <div className="flex justify-between border-b border-slate-800/10 pb-2"><span className="opacity-50">Status:</span> <span className="text-rose-400">{selectedProduct.stock}</span></div>
                    <p className="pt-4 opacity-60 normal-case">{selectedProduct.detail}</p>
                  </div>
                </div>
                <button
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  className="w-full py-5 bg-rose-500 hover:bg-rose-400 text-black font-black text-xl rounded-2xl flex items-center justify-center gap-4 transition-all"
                >
                  ACQUIRE — ${selectedProduct.price}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SalePage;