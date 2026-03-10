import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaUser,
  FaMoon,
  FaSun,
  FaSignOutAlt,
  FaChevronRight
} from "react-icons/fa";
import navimg from "../assets/AT-mart.png";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../provider/AuthProvider";
import { useCart } from "../context/CartContext"; // 1. Import the Cart Hook
import SearchBar from "./Searchbar";

const Header = () => {
  const [open, setOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const { cartItems } = useCart(); // 2. Get live cartItems from context
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // Desktop/Mobile Nav Items Configuration
  const navItems = [

    { name: "Shop", path: "/shop" },
    { name: "Categories", path: "/categories" },
    { name: "New Arrivals", path: "/newarrivals" },
    { name: "Sale", path: "/sale", highlight: true },
    { name: "About", path: "/about" },
    { name: "Order", path: "/userorder" },
    { name: "Returns", path: "/returnprogress" },
  ];

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [open]);

  return (
    <header className={`sticky top-0 left-0 right-0 z-50 shadow-md transition-colors duration-300 ${
      isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
    }`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        
        {/* 1. Logo */}
        <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={navimg}
            alt="AT-mart"
            className="h-10 md:h-12 w-auto"
            style={{ filter: isDarkMode ? "brightness(1.2)" : "none" }}
          />
        </Link>

        {/* 2. Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-8 font-semibold">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`transition-colors relative group py-1 ${
                isActive(item.path) ? "text-amber-500" : item.highlight ? "text-red-500 hover:text-red-600" : "hover:text-amber-500"
              }`}
            >
              {item.name}
              <span className={`absolute left-0 -bottom-1 h-0.5 bg-amber-500 transition-all duration-300 ${
                isActive(item.path) ? "w-full" : "w-0 group-hover:w-full"
              }`} />
            </Link>
          ))}
        </nav>

        {/* 3. Action Icons */}
        <div className="flex items-center gap-2 md:gap-4">
          
          <SearchBar />














          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isDarkMode ? "hover:bg-gray-800 text-yellow-400" : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>











          {/* 3. DYNAMIC CART ICON */}
          <Link to="/cartpage" className="p-2 relative hover:text-amber-500 transition-colors">
            <FaShoppingCart className="text-xl" />
            <AnimatePresence>
              {cartItems.length > 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  key={cartItems.length} // Key ensures animation re-runs on count change
                  className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold"
                >
                  {cartItems.length}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <div className="hidden sm:block">
            {currentUser ? (
              <Link
                to="/account"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all shadow-sm ${
                  isActive("/account") ? "bg-amber-500 text-white" : "bg-orange-400 text-white hover:bg-orange-500"
                }`}
              >
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="User" className="w-6 h-6 rounded-full border border-white" />
                ) : <FaUser />}
                <span className="hidden lg:inline">Account</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold bg-orange-500 text-white hover:bg-orange-600 shadow-md transition-all"
              >
                <FaUser /> Login
              </Link>
            )}
          </div>

          <button className="xl:hidden p-2 text-2xl transition-transform active:scale-90" onClick={() => setOpen(true)}>
            <FaBars className={open ? "text-amber-500" : ""} />
          </button>
        </div>
      </div>

      {/* 4. Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed top-0 left-0 h-full w-[320px] z-[70] shadow-2xl flex flex-col ${
                isDarkMode ? "bg-gray-900 text-white border-r border-gray-800" : "bg-white text-gray-900"
              }`}
            >
              <div className="flex justify-between items-center p-6 border-b dark:border-gray-800">
                <img src={navimg} alt="AT-mart" className="h-8 w-auto" />
                <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <FaTimes className="text-xl text-red-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Main Menu</p>
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center justify-between py-4 px-4 rounded-2xl transition-all font-bold ${
                          isActive(item.path)
                            ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => setOpen(false)}
                      >
                        <span className={item.highlight && !isActive(item.path) ? "text-red-500" : ""}>
                           {item.name}
                        </span>
                        <FaChevronRight size={12} className="opacity-30" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 border-t dark:border-gray-800 space-y-4">
                {currentUser ? (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/account"
                      className="flex flex-col items-center justify-center gap-1 py-3 rounded-2xl font-bold bg-orange-500 text-white"
                      onClick={() => setOpen(false)}
                    >
                      <FaUser /> <span className="text-xs">Account</span>
                    </Link>
                   
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg"
                    onClick={() => setOpen(false)}
                  >
                    <FaUser /> Login to Account
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;