import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useSearch } from "../context/SearchContext";

// --- FIREBASE INFRASTRUCTURE ---
import { db } from "../firebase/Firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { 
  FaMicrochip, FaGamepad, FaMobileAlt, 
  FaHdd, FaHeadphones, FaKeyboard, FaCheckCircle, 
  FaMemory, FaShoppingCart 
} from "react-icons/fa";

// Dynamic Icon Mapping
const getProductIcon = (category) => {
  const icons = {
    "Computing": <FaMicrochip />,
    "Gaming": <FaGamepad />,
    "Mobile": <FaMobileAlt />,
    "Storage": <FaHdd />,
    "Audio": <FaHeadphones />,
    "Peripherals": <FaKeyboard />
  };
  return icons[category] || <FaMicrochip />;
};

const Shop = () => {
  const { isDarkMode } = useTheme();
  const { searchQuery } = useSearch();
  const { addToCart } = useCart(); // Keep this to manage the global cart state
  
  const [dbProducts, setDbProducts] = useState([]); 
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Computing", "Gaming", "Mobile", "Storage", "Audio", "Peripherals"];

  // --- 1. REAL-TIME DATABASE SYNC ---
  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDbProducts(productData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- 2. SEARCH, CATEGORY & SORT LOGIC ---
  const filteredProducts = useMemo(() => {
    let result = dbProducts.filter((p) => {
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    if (sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [dbProducts, activeCategory, searchQuery, sortBy]);

  return (
    <div className={`min-h-screen pt-24 pb-20 transition-colors duration-500 ${
      isDarkMode ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900"
    }`}>
      
      {/* HEADER SECTION */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-slate-800/20 pb-10">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
              Hardware <br /> <span className="text-amber-500">Arsenal</span>
            </h1>
            <p className="text-amber-500 font-bold tracking-[0.3em] text-[10px] uppercase flex items-center gap-2">
               <FaMemory className="animate-pulse" /> {dbProducts.length} Nodes Active in Grid
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <select 
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase border transition-all outline-none cursor-pointer ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-xl"
              }`}
            >
              <option value="default">Protocol: Recommended</option>
              <option value="price-low">Credits: Low to High</option>
              <option value="price-high">Credits: High to Low</option>
              <option value="name">Identifier: A-Z</option>
            </select>
          </div>
        </div>

        {/* CATEGORY NAV */}
        <div className="flex gap-3 mt-8 overflow-x-auto pb-4 no-scrollbar">
          {categories.map(c => (
            <button 
              key={c} 
              onClick={() => setActiveCategory(c)} 
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all whitespace-nowrap cursor-pointer border ${
                activeCategory === c 
                ? "bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/20" 
                : isDarkMode ? "bg-slate-800/20 border-slate-800 text-slate-500 hover:text-white" : "bg-white border-slate-200 text-slate-400"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Decrypting Database...</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
                    onAdd={() => addToCart(product)} // Add to cart quietly
                    isDarkMode={isDarkMode}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </section>
    </div>
  );
};

const ShopProductCard = ({ product, onAdd, isDarkMode }) => (
  <div className={`p-6 rounded-[2.5rem] border transition-all group relative flex flex-col h-full ${
    isDarkMode ? "bg-[#0d1117] border-slate-800 hover:border-amber-500" : "bg-white border-slate-200 shadow-xl"
  }`}>
    <div className={`aspect-square rounded-[2rem] flex items-center justify-center text-6xl mb-6 relative overflow-hidden transition-all duration-500 ${
      isDarkMode ? "bg-slate-900 group-hover:bg-amber-500/10" : "bg-slate-50 group-hover:bg-amber-50"
    }`}>
      {product.image ? (
        <img src={product.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={product.name} />
      ) : (
        <div className="group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 text-slate-500 group-hover:text-amber-500">
          {getProductIcon(product.category)}
        </div>
      )}
      
      {product.tag && (
        <div className="absolute top-4 left-4 bg-amber-500 text-black text-[7px] font-black px-3 py-1 rounded-full uppercase italic">
          {product.tag}
        </div>
      )}
    </div>

    <div className="flex-1 space-y-3">
      <div className="flex justify-between items-start">
        <div className="max-w-[70%]">
          <h4 className="text-[8px] font-black uppercase text-amber-500 mb-1 tracking-widest">
            {product.category}
          </h4>
          <h3 className="font-black text-[14px] uppercase leading-tight line-clamp-2">
            {product.name}
          </h3>
        </div>
        <p className="text-xl font-black italic text-amber-500">${product.price}</p>
      </div>

      <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase pb-4 border-b border-slate-800/10">
        <FaMicrochip className="text-amber-500" /> {product.tech || "Gen-5 Protocol"}
      </div>
    </div>

    <div className="flex items-center justify-between pt-4">
      <span className="text-[8px] font-black uppercase text-emerald-500 flex items-center gap-1">
        <FaCheckCircle /> Verified
      </span>
      <button 
        onClick={onAdd} 
        className="px-5 py-3 bg-amber-500 text-black font-black text-[9px] uppercase rounded-xl transition-all shadow-lg cursor-pointer flex items-center gap-2 hover:bg-white active:scale-95"
      >
        Add To Cart <FaShoppingCart />
      </button>
    </div>
  </div>
);

export default Shop;