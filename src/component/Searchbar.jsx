import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes, FaHistory, FaArrowRight } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(searchQuery);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);

  // Mock Suggestions 
  const suggestions = ["Latest Trends", "Summer Collection", "Best Sellers", "New Arrivals", "Discounts"];
  
  const filteredSuggestions = suggestions.filter(item => 
    item.toLowerCase().includes(inputValue.toLowerCase())
  );

  useEffect(() => { setInputValue(searchQuery); }, [searchQuery]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // ✅ FIX: Removed navigation from here. 
  // It now only updates the context so current page can filter results.
  const handleSearch = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setSearchQuery(value); 
  };

  // ✅ NEW: Handle Enter key to close the overlay without redirecting
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setIsOpen(false);
      // Optional: If input is empty, reset everything
      if (inputValue.trim() === "") {
        setSearchQuery("");
      }
    }
  };

  const selectSuggestion = (text) => {
    setInputValue(text);
    setSearchQuery(text);
    setIsOpen(false);
    // Note: If you want suggestions to ALWAYS go home, keep the navigate. 
    // If you want them to filter the CURRENT page, remove navigate("/") below.
    // navigate("/"); 
  };

  return (
    <div className="flex items-center">
      {/* Search Icon Trigger */}
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
            {/* Backdrop Blur */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
            />

            {/* Sliding Container */}
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute left-0 right-0 top-full mt-4 px-4 z-50 flex justify-center"
            >
              <div className={`w-full max-w-2xl overflow-hidden rounded-[2rem] shadow-2xl border ${
                isDarkMode ? "bg-gray-900/90 border-gray-700" : "bg-white/90 border-gray-200"
              } backdrop-blur-xl`}>
                
                {/* Input Area */}
                <div className="relative flex items-center p-6 border-b border-gray-200 dark:border-gray-700">
                  <FaSearch className="text-amber-500 ml-2" size={20} />
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleSearch}
                    onKeyDown={handleKeyDown}
                    placeholder="Search for products, brands, or categories..."
                    className="w-full bg-transparent px-4 py-2 text-lg outline-none dark:text-white placeholder-gray-500 font-medium"
                  />
                  {inputValue && (
                    <button 
                      onClick={() => {setInputValue(""); setSearchQuery("");}} 
                      className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>

                {/* Suggestions Section */}
                <div className="p-6">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 px-2">
                    {inputValue ? "Targeting Signal" : "Popular Nodes"}
                  </p>
                  
                  <div className="grid grid-cols-1 gap-1">
                    {(inputValue ? filteredSuggestions : suggestions).map((item, index) => (
                      <button
                        key={index}
                        onClick={() => selectSuggestion(item)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${
                          isDarkMode ? "hover:bg-amber-500/10 text-gray-300" : "hover:bg-amber-50 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <FaHistory className="text-gray-500 group-hover:text-amber-500" size={14} />
                          <span className="font-bold text-sm uppercase tracking-tight">{item}</span>
                        </div>
                        <FaArrowRight size={12} className="opacity-0 group-hover:opacity-100 text-amber-500 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer hint */}
                <div className={`px-8 py-4 text-[9px] font-black uppercase tracking-widest ${isDarkMode ? "bg-black/40 text-gray-600" : "bg-gray-50 text-gray-400"}`}>
                  System Status: <span className="text-emerald-500">Live Filtering Active</span> | Press <kbd className="text-amber-500">Enter</kbd> to confirm
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