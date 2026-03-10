import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase/Firebase"; // Ensure correct path
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useTheme } from "./context/ThemeContext";
import { FaLock, FaUser, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Components
import Sidebar from "./views/Sidebar";
import Header from "./views/Header";

// Pages
import Overview from "./views/Overview";
import Orders from "./views/Orders";
import Customers from "./views/Customers";
import AdminChat from "./views/AdminChat";
import Products from "./views/Products";
import Settings from "./views/Settings";
import Return from "./views/Return";

const Dashboard = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  // AUTH & GLOBAL STATE
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [brandName, setBrandName] = useState("Hardware Hub");

  // LOGIN UI STATE
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // DASHBOARD UI STATE
  const [activeView, setActiveView] = useState("overview"); 
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // --- 1. FIREBASE AUTH LISTENER ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        // Sync Brand Name from Firestore
        const settingsRef = doc(db, "userSettings", user.uid);
        onSnapshot(settingsRef, (docSnap) => {
          if (docSnap.exists()) setBrandName(docSnap.data().brandName);
        });
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- 2. FIREBASE LOGIN HANDLER ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      // Auth listener handles the rest
    } catch (error) {
      console.error(error.code);
      setLoginError(error.code === 'auth/invalid-credential' 
        ? '❌ Invalid Security Clearance' 
        : '❌ System Access Denied');
    } finally {
      setLoginLoading(false);
    }
  };

  // --- 3. FIREBASE LOGOUT ---
  const handleLogout = async () => {
    await signOut(auth);
    setActiveView('overview');
  };

  // LOADING SCREEN
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center">
        <FaSpinner className="text-amber-500 animate-spin" size={40} />
      </div>
    );
  }

  // LOGIN UI (If not authenticated)
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 relative overflow-hidden">
        {/* Background Decors */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-12">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl mb-6">⚡</motion.div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-2xl uppercase italic tracking-tighter">
              {brandName}
            </h1>
            <p className="text-slate-300 mt-3 font-bold uppercase tracking-[0.3em] text-xs">Terminal Access Required</p>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
            <AnimatePresence>
              {loginError && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="bg-rose-500/10 border border-rose-500/30 text-rose-500 p-4 rounded-2xl mb-6 text-center text-xs font-black uppercase tracking-widest">
                  {loginError}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 tracking-widest px-1 uppercase">Admin Identifier</label>
                <div className="relative">
                  <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500/50" />
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full h-14 pl-12 pr-5 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-amber-500 outline-none transition-all font-bold"
                    placeholder="name@terminal.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 tracking-widest px-1 uppercase">Security Key</label>
                <div className="relative">
                  <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500/50" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full h-14 pl-12 pr-12 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-amber-500 outline-none transition-all font-bold"
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-500">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full h-16 bg-amber-500 text-black font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 active:scale-95 transition-all uppercase tracking-[0.2em] disabled:opacity-50 cursor-pointer"
              >
                {loginLoading ? "Decrypting..." : "Initialize Dashboard"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  // CONTENT DISPATCHER
  const renderContent = () => {
    const props = { isDarkMode, brandName }; // Shared props
    switch (activeView) {
      case "overview":  return <Overview {...props} />;
      case "orders":    return <Orders {...props} />;
      case "customers": return <Customers {...props} />;
      case "adminchat": return <AdminChat {...props} />;
      case "settings":  return <Settings {...props} />; 
        case "products":  return <Products {...props} />;
        case "return":    return <Return {...props} />;

      default:          return <Overview {...props} />;
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden transition-all duration-500 ${isDarkMode ? "bg-[#05070a]" : "bg-[#f4f7fe]"}`}>
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isDarkMode={isDarkMode} 
        isOpen={isSidebarOpen} 
        setOpen={setSidebarOpen}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Header 
          activeView={activeView} 
          setSidebarOpen={setSidebarOpen} 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme}
          user={{ name: currentUser.email.split('@')[0], role: 'Super Admin' }}
          onLogout={handleLogout}
        />
        
        <main id="dashboard-content" className="flex-1 overflow-y-auto p-4 lg:p-12 custom-scrollbar">
          <motion.div 
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;