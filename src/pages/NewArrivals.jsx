import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import {
  FaBolt, FaRegClock, FaMicrochip, FaArrowRight,
  FaShieldAlt, FaChartLine, FaRocket, FaCalendarAlt,
  FaClock, FaTag, FaTimes
} from "react-icons/fa";

// ──────────────────────────────────────────────────────────────
// FULL DATA WITH ARRIVAL TIMESTAMPS (March 2026)
// ──────────────────────────────────────────────────────────────
const NEW_DROPS = [
  { id: 9001, name: "NVIDIA GeForce RTX 5090", price: 1999, cat: "Graphics Cards", img: "⚡", tech: "32GB GDDR7 • Blackwell • DLSS 4.5", status: "Flagship Drop", arrivalDate: "2025-01-30", arrivalTime: "09:00 UTC", stock: "142 units", detail: "World's fastest consumer GPU. 2× ray tracing performance." },
  { id: 9002, name: "NVIDIA RTX 5080", price: 1199, cat: "Graphics Cards", img: "🌌", tech: "16GB GDDR7 • 5th Gen Tensor", status: "In Stock", arrivalDate: "2025-01-30", arrivalTime: "09:00 UTC", stock: "387 units", detail: "Perfect 4K/144Hz gaming card." },
  { id: 9003, name: "AMD Radeon RX 9070 XT", price: 769, cat: "Graphics Cards", img: "🔥", tech: "16GB GDDR6 • FSR 4 AI", status: "High Demand", arrivalDate: "2026-02-18", arrivalTime: "14:00 UTC", stock: "94 units", detail: "Best price/performance 4K card of 2026." },
  { id: 9004, name: "NVIDIA RTX 5070 Ti", price: 799, cat: "Graphics Cards", img: "🚀", tech: "12GB GDDR7 • Advanced RT Core", status: "New Entry", arrivalDate: "2025-02-27", arrivalTime: "16:00 UTC", stock: "521 units", detail: "Mid-range king for 1440p ultra." },

  { id: 9007, name: "AMD Ryzen 9 9950X3D", price: 749, cat: "Processors", img: "🧠", tech: "16C/32T • 128MB 3D V-Cache", status: "Gaming King", arrivalDate: "2025-03-12", arrivalTime: "13:00 UTC", stock: "289 units", detail: "Fastest gaming CPU ever made." },
  { id: 9008, name: "Intel Core Ultra 9 285K", price: 589, cat: "Processors", img: "🌟", tech: "24 Cores • Arrow Lake • NPU", status: "AI Optimized", arrivalDate: "2024-10-24", arrivalTime: "08:00 UTC", stock: "412 units", detail: "Strong content creation + AI acceleration." },
  { id: 9009, name: "AMD Ryzen 7 9800X3D", price: 479, cat: "Processors", img: "⚡", tech: "8C/16T • 96MB 3D V-Cache", status: "In Stock", arrivalDate: "2024-11-07", arrivalTime: "10:00 UTC", stock: "673 units", detail: "Undisputed 1440p/4K gaming champion." },

  { id: 9012, name: "ASUS ROG Maximus Z890 Extreme", price: 899, cat: "Motherboards", img: "🔌", tech: "Z890 • Thunderbolt 5 • WiFi 7", status: "Premium", arrivalDate: "2025-02-12", arrivalTime: "11:00 UTC", stock: "67 units", detail: "Flagship board for Arrow Lake." },
  { id: 9013, name: "MSI MPG X870E Carbon", price: 549, cat: "Motherboards", img: "🌐", tech: "X870E • PCIe 5.0 • WiFi 7", status: "In Stock", arrivalDate: "2025-01-15", arrivalTime: "15:00 UTC", stock: "134 units", detail: "High-end AM5 platform." },

  { id: 9015, name: "G.Skill Trident Z5 64GB", price: 319, cat: "Memory", img: "📏", tech: "DDR5-9200 CL32 • EXPO", status: "High Demand", arrivalDate: "2026-02-25", arrivalTime: "09:30 UTC", stock: "218 units", detail: "Fastest DDR5 for Ryzen 9000." },

  { id: 9018, name: "Crucial T705 4TB Gen5", price: 599, cat: "Storage", img: "🚄", tech: "14,500 MB/s • Phison E26", status: "Latest Tech", arrivalDate: "2025-01-08", arrivalTime: "12:00 UTC", stock: "305 units", detail: "Fastest consumer SSD on Earth." },

  { id: 9021, name: "Samsung Galaxy Z Fold7 Ultra", price: 2199, cat: "Mobile Tech", img: "📱", tech: "Tri-Fold 10.2\" • Snapdragon 8 Gen 4", status: "Pre-Order", arrivalDate: "2025-09-10", arrivalTime: "00:01 UTC", stock: "Pre-Order", detail: "Most advanced foldable ever." },

  { id: 9023, name: "Seasonic Prime TX-1600 Titanium", price: 499, cat: "Power Units", img: "🔋", tech: "1600W • 80+ Titanium • ATX 3.1", status: "In Stock", arrivalDate: "2025-03-05", arrivalTime: "10:00 UTC", stock: "89 units", detail: "Ultimate PSU for 5090 builds." },
  { id: 9024, name: "Beyerdynamic MMX 330 Studio Pro", price: 650, cat: "Audio Gear", img: "🎧", tech: "Planar Magnetic • Built-in DAC", status: "Premium", arrivalDate: "2025-02-20", arrivalTime: "14:30 UTC", stock: "156 units", detail: "Reference studio headphones." },
];

const NewArrivals = () => {
  const { isDarkMode } = useTheme();
  const { addToCart } = useCart();
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const formatArrival = (dateStr, timeStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + " • " + timeStr;
  };

  return (
    <div className={`min-h-screen pt-20 md:pt-28 pb-20 transition-colors duration-500 ${
      isDarkMode ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900"
    }`}>

      {/* HERO - Fully Responsive */}
      <section className="relative px-6 py-16 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
                <FaRocket className="text-amber-500 animate-pulse" />
                <span className="font-black uppercase text-xs tracking-[0.25em]">MARCH 2026 • LIVE</span>
              </div>

              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[92px] font-black italic uppercase tracking-[-0.04em] leading-[0.85]">
                NEW<br />ARRIVALS
              </h1>

              <p className="mt-6 max-w-lg mx-auto lg:mx-0 text-base md:text-lg opacity-70 font-light">
                Exact arrival timestamps • Verified stock • Full technical specs.<br />
                Updated <span className="font-mono text-amber-400">March 07, 2026 16:53 UTC</span>
              </p>
            </div>

            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                  <div className="text-3xl mb-2">📈</div>
                  <div className="text-xs font-black uppercase opacity-60">Demand</div>
                  <div className="text-2xl font-black text-emerald-400">+47%</div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                  <div className="text-3xl mb-2">🛡️</div>
                  <div className="text-xs font-black uppercase opacity-60">Authentic</div>
                  <div className="text-2xl font-black">100%</div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="text-xs font-black uppercase opacity-60">Ships In</div>
                  <div className="text-2xl font-black">24h</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT GRID - Responsive (1 / 2 / 3 / 4 columns) */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {NEW_DROPS.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              onMouseEnter={() => setHoveredId(p.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedProduct(p)}
              className={`group relative rounded-3xl overflow-hidden border h-full flex flex-col cursor-pointer transition-all duration-300 ${
                isDarkMode 
                  ? "bg-[#0d1117] border-slate-800 hover:border-amber-500/60" 
                  : "bg-white border-slate-200 hover:shadow-2xl hover:border-amber-400"
              }`}
            >
              {/* Status & Date */}
              <div className="absolute top-4 left-4 z-30 flex flex-col gap-2">
                <div className="bg-emerald-500 text-black text-[10px] font-black px-4 py-1 rounded-2xl shadow">
                  {p.status}
                </div>
                <div className="bg-black/70 text-[10px] font-mono px-3 py-1 rounded-xl flex items-center gap-1 text-white">
                  <FaCalendarAlt className="text-amber-400" />
                  {formatArrival(p.arrivalDate, p.arrivalTime)}
                </div>
              </div>

              {/* Visual */}
              <div className="h-56 sm:h-60 bg-gradient-to-br from-slate-950 to-black flex items-center justify-center relative overflow-hidden">
                <motion.span
                  animate={{ scale: hoveredId === p.id ? 1.25 : 1 }}
                  className="text-8xl sm:text-9xl transition-all duration-500 drop-shadow-2xl"
                >
                  {p.img}
                </motion.span>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 flex flex-col">
                <div className="uppercase text-amber-500 text-xs font-black tracking-widest mb-1">{p.cat}</div>
                <h3 className="font-black text-xl leading-tight mb-4 line-clamp-2 group-hover:text-amber-400 transition-colors">
                  {p.name}
                </h3>

                <div className="text-xs text-slate-400 mb-6 flex items-center gap-2">
                  <FaMicrochip /> {p.tech}
                </div>

                <div className="text-sm opacity-70 line-clamp-3 mb-8">
                  {p.detail}
                </div>

                <div className="mt-auto pt-6 border-t border-slate-700/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs opacity-50">PRICE</span>
                    <div className="text-3xl font-black text-amber-500">${p.price}</div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                    className="bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-xs tracking-widest px-7 py-4 rounded-2xl flex items-center gap-2 shadow-lg"
                  >
                    ADD <FaArrowRight className="text-sm" />
                  </motion.button>
                </div>
              </div>

              {/* Stock Bar */}
              <div className="px-6 py-3 bg-black/20 text-xs font-mono flex items-center justify-between text-emerald-400 border-t border-slate-700/30">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  {p.stock}
                </div>
                <FaClock className="opacity-40" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* DETAIL MODAL - Mobile Friendly */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[999]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              className={`fixed inset-x-4 top-[10%] bottom-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:max-w-2xl md:h-fit z-[1000] rounded-3xl overflow-hidden shadow-2xl ${
                isDarkMode ? "bg-[#0d1117]" : "bg-white"
              }`}
            >
              <div className="p-6 md:p-10 relative">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-6 right-6 text-4xl opacity-40 hover:opacity-100 transition-all"
                >
                  <FaTimes />
                </button>

                <div className="text-amber-500 text-xs font-black tracking-widest mb-2">{selectedProduct.cat}</div>
                <h2 className="text-3xl md:text-4xl font-black leading-none mb-8 pr-10">{selectedProduct.name}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-slate-900/50 rounded-3xl flex items-center justify-center text-[140px] py-12">
                    {selectedProduct.img}
                  </div>

                  <div className="space-y-7 text-sm">
                    <div>
                      <div className="text-xs opacity-50 mb-1">ARRIVAL</div>
                      <div className="font-mono text-2xl leading-none">{formatArrival(selectedProduct.arrivalDate, selectedProduct.arrivalTime)}</div>
                    </div>

                    <div>
                      <div className="text-xs opacity-50 mb-2">FULL SPEC</div>
                      <div className="opacity-80 leading-relaxed">{selectedProduct.tech}</div>
                    </div>

                    <div>
                      <div className="text-xs opacity-50 mb-1">STOCK</div>
                      <div className="font-semibold text-emerald-400 text-lg">{selectedProduct.stock}</div>
                    </div>

                    <div className="pt-4 border-t border-slate-700/30">
                      <div className="text-xs opacity-50 mb-2">WHY THIS DROPPED</div>
                      <p className="text-base leading-relaxed opacity-80">{selectedProduct.detail}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  className="mt-10 w-full py-6 bg-amber-500 hover:bg-amber-400 text-black font-black text-lg rounded-2xl flex items-center justify-center gap-4 transition-all active:scale-95"
                >
                  <FaArrowRight /> ADD TO ARSENAL — ${selectedProduct.price}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FINAL CTA - Clean & Responsive */}
      <section className="max-w-7xl mx-auto px-6 mt-20">
        <div className={`rounded-3xl p-8 md:p-16 flex flex-col md:flex-row gap-8 md:gap-16 items-center border ${
          isDarkMode ? "bg-gradient-to-br from-amber-500 to-amber-600 text-black" : "bg-slate-900 text-white"
        }`}>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tight leading-none">Never miss the next flagship drop</h2>
            <p className="mt-4 opacity-75 text-sm md:text-base">Exact UTC timestamps. Zero spam. Only hardware intelligence.</p>
          </div>
          <div className="flex-1 w-full max-w-md">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="YOUR PROTOCOL EMAIL"
                className={`flex-1 px-6 py-5 rounded-2xl outline-none text-sm font-medium ${isDarkMode ? "bg-black/30 text-black" : "bg-white/10 text-white"}`}
              />
              <button className="px-12 py-5 bg-black text-white font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-900 transition-all">SUBSCRIBE</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewArrivals;