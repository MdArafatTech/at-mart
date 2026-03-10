import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes, FaHistory, FaArrowRight, FaBox } from "react-icons/fa";
import { useSearch } from "../context/SearchContext";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebase/Firebase"; // Ensure your path is correct
import { collection, query, getDocs, limit } from "firebase/firestore";

const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState([]); // Now dynamic
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  // --- FIREBASE SEARCH LOGIC ---
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputValue.length < 2) {
        setSuggestions(["Latest Trends", "Processors", "Laptops"]); // Default fallbacks
        return;
      }

      setIsLoading(true);
      try {
        const q = query(collection(db, "products"), limit(100));
        const querySnapshot = await getDocs(q);
        
        const allProducts = querySnapshot.docs.map(doc => ({
          name: doc.data().name,
          category: doc.data().category
        }));

        // Client-side filtering for better UX/speed
        const filtered = allProducts
          .filter(p => 
            p.name.toLowerCase().includes(inputValue.toLowerCase()) ||
            p.category.toLowerCase().includes(inputValue.toLowerCase())
          )
          .map(p => p.name)
          .slice(0, 6); // Top 6 matches

        setSuggestions(filtered.length > 0 ? [...new Set(filtered)] : ["No matches found"]);
      } catch (error) {
        console.error("Search Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce to prevent hitting Firebase on every single keystroke
    const timeoutId = setTimeout(() => fetchSuggestions(), 300);
    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  useEffect(() => { setInputValue(searchQuery); }, [searchQuery]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setSearchQuery(value); 
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") setIsOpen(false);
  };

  const selectSuggestion = (text) => {
    if (text === "No matches found") return;
    setInputValue(text);
    setSearchQuery(text);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2.5 rounded-full transition-all duration-300 z-[60] ${
          isOpen ? "bg-amber-500 text-white scale-110" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        {isOpen ? <FaTimes size={18} /> : <FaSearch className="text-orange-400" size={18} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
            />

            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute left-0 right-0 top-full mt-4 px-4 z-50 flex justify-center"
            >
              <div className={`w-full max-w-2xl overflow-hidden rounded-[2.5rem] shadow-2xl border ${
                isDarkMode ? "bg-[#0d1117]/90 border-slate-800" : "bg-white/90 border-gray-200"
              } backdrop-blur-xl`}>
                
                <div className="relative flex items-center p-6 border-b border-slate-800/10 dark:border-slate-800/50">
                  <FaSearch className={isLoading ? "text-amber-500 animate-pulse" : "text-amber-500"} size={20} />
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleSearch}
                    onKeyDown={handleKeyDown}
                    placeholder="Search database..."
                    className="w-full bg-transparent px-4 py-2 text-lg outline-none dark:text-white placeholder-gray-500 font-bold uppercase tracking-tight"
                  />
                </div>

                <div className="p-6">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 px-2">
                    {isLoading ? "Querying Neural Network..." : "Database Results"}
                  </p>
                  
                  <div className="grid grid-cols-1 gap-1">
                    {suggestions.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => selectSuggestion(item)}
                        className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all group ${
                          isDarkMode ? "hover:bg-amber-500/10 text-gray-300" : "hover:bg-amber-50 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <FaBox className="text-gray-600 group-hover:text-amber-500" size={14} />
                          <span className="font-black text-xs uppercase tracking-widest">{item}</span>
                        </div>
                        <FaArrowRight size={12} className="opacity-0 group-hover:opacity-100 text-amber-500 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`px-8 py-4 text-[9px] font-black uppercase tracking-widest ${isDarkMode ? "bg-black/40 text-gray-600" : "bg-gray-50 text-gray-400"}`}>
                  Search Engine: <span className="text-amber-500">v2.1 Firestore Sync</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;