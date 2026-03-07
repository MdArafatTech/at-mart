import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useSearch } from "../context/SearchContext";
import { FaMicrochip, FaSearch, FaFilter, FaArrowUp, FaTimes, FaTrash } from "react-icons/fa";

// 50+ Product Data Array
const ALL_PRODUCTS = [
  // COMPUTING (Processors/Motherboards)
  { id: 1, name: "Core i9-14900K", price: 589, cat: "Computing", img: "🧠", tech: "6.0GHz 24-Core", tag: "Flagship" },
  { id: 2, name: "Ryzen 9 7950X3D", price: 699, cat: "Computing", img: "🚀", tech: "128MB L3 Cache", tag: "Gaming King" },
  { id: 3, name: "Threadripper 7980X", price: 4999, cat: "Computing", img: "🏗️", tech: "64-Core Monster", tag: "Workstation" },
  { id: 4, name: "Z790 Maximus Hero", price: 629, cat: "Computing", img: "🔌", tech: "DDR5 / PCIe 5.0", tag: "High-End" },
  { id: 5, name: "X670E Taichi", price: 499, cat: "Computing", img: "⚙️", tech: "24+2+1 Phase", tag: "Stable" },
  { id: 6, name: "Core i7-14700K", price: 409, cat: "Computing", img: "💎", tech: "20-Core / 5.6GHz", tag: "Popular" },
  { id: 7, name: "Ryzen 7 7800X3D", price: 449, cat: "Computing", img: "🎯", tech: "3D V-Cache", tag: "Best Buy" },
  { id: 8, name: "B760M Mortar", price: 179, cat: "Computing", img: "🧱", tech: "WiFi 6E Support", tag: "Budget" },

  // GAMING (GPUs)
  { id: 9, name: "RTX 4090 OC", price: 1999, cat: "Gaming", img: "🎮", tech: "24GB G6X", tag: "Ultimate" },
  { id: 10, name: "RTX 4080 Super", price: 999, cat: "Gaming", img: "⚡", tech: "16GB G6X", tag: "New" },
  { id: 11, name: "RX 7900 XTX", price: 930, cat: "Gaming", img: "🔥", tech: "24GB VRAM", tag: "AMD Top" },
  { id: 12, name: "RTX 4070 Ti", price: 799, cat: "Gaming", img: "🧊", tech: "Dual Fan OC", tag: "Mid-Range" },
  { id: 13, name: "RX 7800 XT", price: 499, cat: "Gaming", img: "🌪️", tech: "16GB G6", tag: "Value" },
  { id: 14, name: "Arc A770", price: 329, cat: "Gaming", img: "🟦", tech: "16GB VRAM", tag: "Intel" },
  { id: 15, name: "RTX 4060 Ti", price: 389, cat: "Gaming", img: "🎲", tech: "8GB Low Power", tag: "Efficient" },

  // MOBILE & LAPTOPS
  { id: 16, name: "MacBook Pro M3 Max", price: 3499, cat: "Mobile", img: "💻", tech: "16-Core CPU", tag: "Apple" },
  { id: 17, name: "ROG Zephyrus G14", price: 1599, cat: "Mobile", img: "🐆", tech: "Ryzen 9 / 4070", tag: "Slim" },
  { id: 18, name: "iPhone 15 Pro Max", price: 1199, cat: "Mobile", img: "📱", tech: "Titanium / A17", tag: "Pro" },
  { id: 19, name: "S24 Ultra", price: 1299, cat: "Mobile", img: "🖋️", tech: "Snapdragon G3", tag: "AI Phone" },
  { id: 20, name: "iPad Pro M2", price: 799, cat: "Mobile", img: "🎨", tech: "Liquid Retina", tag: "Creative" },
  { id: 21, name: "Pixel 8 Pro", price: 999, cat: "Mobile", img: "📷", tech: "Google Tensor", tag: "Pure Android" },
  { id: 22, name: "Razer Blade 16", price: 2999, cat: "Mobile", img: "🐍", tech: "Mini-LED 240Hz", tag: "Elite" },

  // STORAGE
  { id: 23, name: "990 Pro 4TB", price: 340, cat: "Storage", img: "💾", tech: "7450MB/s Read", tag: "Fastest" },
  { id: 24, name: "Crucial T700", price: 175, cat: "Storage", img: "🚄", tech: "PCIe Gen5", tag: "Gen 5" },
  { id: 25, name: "WD Black SN850X", price: 150, cat: "Storage", img: "🕶️", tech: "Heatsink Incl", tag: "PS5 Ready" },
  { id: 26, name: "SanDisk Extreme", price: 110, cat: "Storage", img: "🧱", tech: "Rugged Portable", tag: "Outdoor" },
  { id: 27, name: "IronWolf Pro 18TB", price: 380, cat: "Storage", img: "🐺", tech: "NAS Optimized", tag: "Server" },

  // AUDIO & ACCESSORIES
  { id: 28, name: "Sony WH-1000XM5", price: 399, cat: "Audio", img: "🎧", tech: "Best ANC", tag: "Travel" },
  { id: 29, name: "AirPods Pro 2", price: 249, cat: "Audio", img: "⚪", tech: "USB-C Case", tag: "Apple" },
  { id: 30, name: "Sennheiser HD 660S2", price: 599, cat: "Audio", img: "🎼", tech: "Audiophile Open", tag: "Studio" },
  { id: 31, name: "Blue Yeti X", price: 169, cat: "Audio", img: "🎤", tech: "Custom Lighting", tag: "Streamer" },
  { id: 32, name: "SteelSeries Arctis Nova", price: 349, cat: "Audio", img: "📡", tech: "Wireless Hi-Res", tag: "Gaming" },

  // PERIPHERALS
  { id: 33, name: "Logitech G Pro X 2", price: 159, cat: "Peripherals", img: "🖱️", tech: "LIGHTSPEED", tag: "Esports" },
  { id: 34, name: "Razer Huntsman V3", price: 249, cat: "Peripherals", img: "⌨️", tech: "Analog Optical", tag: "Fast" },
  { id: 35, name: "Alienware 34 OLED", price: 899, cat: "Peripherals", img: "🖥️", tech: "Ultrawide 175Hz", tag: "Curved" },
  { id: 36, name: "Keychron Q6 Pro", price: 210, cat: "Peripherals", img: "🎹", tech: "Aluminum Body", tag: "Mechanical" },
  { id: 37, name: "Stream Deck MK.2", price: 149, cat: "Peripherals", img: "🔳", tech: "15 LCD Keys", tag: "Workflow" },

  // Adding more to reach 50...
  { id: 38, name: "DDR5 Dominator 64GB", price: 299, cat: "Computing", img: "📏", tech: "6400MHz CL32", tag: "Premium" },
  { id: 39, name: "Corsair RM1000x", price: 189, cat: "Computing", img: "🔌", tech: "80+ Gold", tag: "Modular" },
  { id: 40, name: "NZXT Kraken Elite", price: 279, cat: "Computing", img: "🌊", tech: "LCD Display", tag: "AIO" },
  { id: 41, name: "H9 Elite Case", price: 239, cat: "Computing", img: "📦", tech: "Dual Chamber", tag: "Design" },
  { id: 42, name: "Elgato Facecam Pro", price: 299, cat: "Peripherals", img: "📹", tech: "4K 60FPS", tag: "Ultra" },
  { id: 43, name: "Secretlab Titan Evo", price: 549, cat: "Peripherals", img: "💺", tech: "Ergonomic Pro", tag: "Seating" },
  { id: 44, name: "Philips Hue Starter", price: 199, cat: "Peripherals", img: "💡", tech: "Smart Lighting", tag: "RGB" },
  { id: 45, name: "Meta Quest 3", price: 499, cat: "Gaming", img: "🥽", tech: "Mixed Reality", tag: "VR" },
  { id: 46, name: "Steam Deck OLED", price: 549, cat: "Gaming", img: "📟", tech: "Handheld HDR", tag: "Valve" },
  { id: 47, name: "Asus ROG Swift 500Hz", price: 829, cat: "Peripherals", img: "📺", tech: "E-TN Panel", tag: "Speed" },
  { id: 48, name: "Bose Ultra Earbuds", price: 299, cat: "Audio", img: "🔉", tech: "Immersive Audio", tag: "Quiet" },
  { id: 49, name: "Surface Laptop 5", price: 999, cat: "Mobile", img: "💻", tech: "PixelSense Touch", tag: "Office" },
  { id: 50, name: "GoPro HERO12", price: 399, cat: "Mobile", img: "📷", tech: "5.3K HDR", tag: "Action" },
  { id: 51, name: "TUF Gaming Motherboard", price: 219, cat: "Computing", img: "🛠️", tech: "Military Grade", tag: "Durable" }
];

const Shop = () => {
  const { isDarkMode } = useTheme();
  const { searchQuery, setSearchQuery } = useSearch();
  const { addToCart, cartItems, removeFromCart } = useCart();
  
  const [activeCategory, setActiveCategory] = useState("All");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  const categories = ["All", "Computing", "Gaming", "Mobile", "Storage", "Audio", "Peripherals"];

  // Search and Filter Logic
  const filteredProducts = useMemo(() => {
    let result = ALL_PRODUCTS.filter((p) => {
      const matchesCategory = activeCategory === "All" || p.cat === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    if (sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <div className={`min-h-screen pt-24 pb-20 transition-colors duration-500 ${isDarkMode ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900"}`}>
      
      {/* 1. Header & Filters */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-slate-800/20 pb-10">
          <div>
            <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none mb-4">Tech Arsenal</h1>
            <p className="text-amber-500 font-bold tracking-[0.3em] text-xs uppercase">50+ Modular Components Verified</p>
          </div>
          
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <select 
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-3 rounded-xl text-[10px] font-bold uppercase border-none outline-none ${isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900 shadow-md"}`}
            >
              <option value="default">Sort: Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>
        </div>

        {/* Category Horizontal Scroll */}
        <div className="flex gap-3 mt-8 overflow-x-auto pb-4 no-scrollbar">
          {categories.map(c => (
            <button 
              key={c} 
              onClick={() => setActiveCategory(c)} 
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all whitespace-nowrap cursor-pointer ${activeCategory === c ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" : "bg-slate-800/10 text-slate-500 hover:bg-slate-800/20"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Product Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <AnimatePresence mode="popLayout">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <ShopProductCard 
                    product={product} 
                    onAdd={() => { addToCart(product); setIsCartOpen(true); }}
                    isDarkMode={isDarkMode}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-40 text-center">
              <FaSearch size={50} className="mx-auto mb-6 opacity-20" />
              <h2 className="text-2xl font-black uppercase italic opacity-40">No Hardware Found</h2>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* 3. Back to Top */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 p-4 bg-amber-500 text-black rounded-full shadow-2xl z-50 hover:scale-110 transition-transform cursor-pointer"
      >
        <FaArrowUp size={20} />
      </button>

      {/* 4. Shared Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} remove={removeFromCart} isDarkMode={isDarkMode} />
    </div>
  );
};

/* --- MINI COMPONENTS --- */

const ShopProductCard = ({ product, onAdd, isDarkMode }) => (
  <div className={`p-5 rounded-[2.5rem] border transition-all group ${isDarkMode ? "bg-[#0d1117] border-slate-800 hover:border-amber-500/50" : "bg-white border-slate-200 shadow-xl hover:shadow-2xl"}`}>
    <div className="aspect-square bg-slate-500/5 rounded-3xl flex items-center justify-center text-7xl mb-6 relative overflow-hidden">
      <span className="group-hover:scale-110 transition-transform duration-700">{product.img}</span>
      <div className="absolute top-4 left-4 bg-black/80 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase italic tracking-widest">{product.tag}</div>
      
      <button 
        onClick={onAdd}
        className="absolute bottom-4 inset-x-4 py-4 bg-amber-500 text-black font-black text-[10px] uppercase rounded-xl translate-y-24 group-hover:translate-y-0 transition-transform shadow-lg cursor-pointer"
      >
        Authorize Purchase
      </button>
    </div>

    <div className="flex justify-between items-start mb-4">
      <div className="max-w-[70%]">
        <h4 className="text-[9px] font-black uppercase text-amber-500 mb-1">{product.cat}</h4>
        <h3 className="font-black text-sm uppercase leading-tight truncate">{product.name}</h3>
      </div>
      <p className="text-xl font-black italic text-amber-500">${product.price}</p>
    </div>

    <div className="pt-4 border-t border-slate-800/10 flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
      <FaMicrochip className="opacity-50" /> {product.tech}
    </div>
  </div>
);

// Reuse the CartDrawer from your Homepage for consistency
const CartDrawer = ({ isOpen, onClose, cartItems, remove, isDarkMode }) => (
  <>
    <AnimatePresence>
      {isOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[999]" />}
    </AnimatePresence>
    <div className={`fixed inset-y-0 right-0 z-[1000] w-full max-w-sm transition-transform duration-500 transform ${isOpen ? "translate-x-0" : "translate-x-full"} ${isDarkMode ? "bg-[#0d1117] border-l border-slate-800" : "bg-white border-l border-slate-200"} shadow-2xl`}>
      <div className="p-8 h-full flex flex-col">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">Current Loadout</h2>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-rose-500 cursor-pointer"><FaTimes size={24}/></button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
          {cartItems.map((item) => (
            <div key={item.cartId} className="flex gap-4 items-center bg-slate-500/5 p-4 rounded-2xl group">
              <div className="h-14 w-14 bg-white/5 rounded-xl flex items-center justify-center text-2xl">{item.img}</div>
              <div className="flex-1">
                <h4 className="text-[10px] font-black uppercase truncate">{item.name}</h4>
                <p className="text-amber-500 font-black italic">${item.price}</p>
              </div>
              <button onClick={() => remove(item.cartId)} className="p-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><FaTrash size={14}/></button>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-slate-800/20 mt-6">
          <div className="flex justify-between font-black mb-6">
            <span className="text-xs uppercase opacity-50 tracking-widest">Total Credit</span>
            <span className="text-2xl text-amber-500">${cartItems.reduce((s, i) => s + i.price, 0)}</span>
          </div>
          <button className="w-full py-5 bg-amber-500 text-black font-black uppercase text-xs tracking-widest rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all">Execute Order</button>
        </div>
      </div>
    </div>
  </>
);

export default Shop;