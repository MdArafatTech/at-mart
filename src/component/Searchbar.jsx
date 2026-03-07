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

  // Mock Suggestions - You can replace this with an API call
  const suggestions = ["Latest Trends", "Summer Collection", "Best Sellers", "New Arrivals", "Discounts"];
  const filteredSuggestions = suggestions.filter(item => 
    item.toLowerCase().includes(inputValue.toLowerCase())
  );

  useEffect(() => { setInputValue(searchQuery); }, [searchQuery]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setSearchQuery(value);
    if (value.trim() !== "" && location.pathname !== "/") navigate("/");
  };

  const selectSuggestion = (text) => {
    setInputValue(text);
    setSearchQuery(text);
    setIsOpen(false);
    navigate("/");
  };

  return (
    <div className="flex items-center">
      {/* Search Icon Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2.5 rounded-full transition-all duration-300 ${
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
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-40"
            />

            {/* Sliding Container */}
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute left-0 right-0 top-full mt-4 px-4 z-50 flex justify-center"
            >
              <div className={`w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl border ${
                isDarkMode ? "bg-gray-900/90 border-gray-700" : "bg-white/90 border-gray-200"
              } backdrop-blur-xl`}>
                
                {/* Input Area */}
                <div className="relative flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
                  <FaSearch className="text-amber-500 ml-2" size={20} />
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleSearch}
                    placeholder="Search for products, brands, or categories..."
                    className="w-full bg-transparent px-4 py-2 text-lg outline-none dark:text-white placeholder-gray-500"
                  />
                  {inputValue && (
                    <button onClick={() => {setInputValue(""); setSearchQuery("");}} className="p-2 text-gray-400 hover:text-red-500">
                      <FaTimes />
                    </button>
                  )}
                </div>

                {/* Suggestions Section */}
                <div className="p-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                    {inputValue ? "Suggested Results" : "Popular Searches"}
                  </p>
                  
                  <div className="space-y-1">
                    {(inputValue ? filteredSuggestions : suggestions).map((item, index) => (
                      <button
                        key={index}
                        onClick={() => selectSuggestion(item)}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-colors ${
                          isDarkMode ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <FaHistory className="text-gray-400" size={14} />
                          <span className="font-medium">{item}</span>
                        </div>
                        <FaArrowRight size={12} className="opacity-0 group-hover:opacity-100 text-amber-500" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer hint */}
                <div className={`px-6 py-3 text-xs ${isDarkMode ? "bg-gray-800/50 text-gray-500" : "bg-gray-50 text-gray-400"}`}>
                  Press <kbd className="font-sans font-semibold text-amber-500">Enter</kbd> to search everything
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