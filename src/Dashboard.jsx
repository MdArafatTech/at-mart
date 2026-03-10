import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase/Firebase";
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import emailjs from "@emailjs/browser"; 
import { 
  FaLock, FaUser, FaEye, FaEyeSlash, FaSpinner, FaTerminal 
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./context/ThemeContext";

// Views
import Sidebar from "./views/Sidebar";
import Header from "./views/Header";
import Overview from "./views/Overview";
import Orders from "./views/Orders";
import Customers from "./views/Customers";
import AdminChat from "./views/AdminChat";
import Products from "./views/Products";
import Return from "./views/Return";
import Settings from "./views/Settings"; // Ensure this path is correct

const Dashboard = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  // --- SYSTEM STATE ---
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(() => {
    return sessionStorage.getItem("terminal_verified") === "true";
  });

  const [brandName, setBrandName] = useState("Hardware Arsenal");
  const [activeView, setActiveView] = useState("overview");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [step, setStep] = useState("login"); 
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  // --- FORM STATE ---
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);

  // --- 1. OTP TRANSMISSION ---
  const sendOtpEmail = async (userEmail, otp) => {
    const templateParams = {
      to_email: userEmail,
      passcode: otp,
      time: new Date(Date.now() + 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    try {
      await emailjs.send("service_fel2b38", "template_wzp9kwx", templateParams, "-dm5gWB-Fz--QlTIN");
      return true;
    } catch (err) { return false; }
  };

  // --- 2. LOGIN HANDLER ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      const user = userCredential.user;
      const adminDoc = await getDoc(doc(db, "admins", user.uid));
      
      if (adminDoc.exists() && adminDoc.data().role === "admin") {
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(newOtp);
        if (await sendOtpEmail(user.email, newOtp)) {
          setStep("otp");
        } else {
          setStatusMsg({ type: 'error', text: 'SIGNAL ERROR: OTP FAILED' });
        }
      } else {
        await signOut(auth);
        setStatusMsg({ type: 'error', text: 'CLEARENCE REJECTED: NOT AN ADMIN' });
      }
    } catch (error) {
      setStatusMsg({ type: 'error', text: "ACCESS DENIED: INVALID KEY" });
    } finally {
      setLoading(false);
    }
  };

  // --- 3. OTP VERIFICATION ---
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpInput === generatedOtp) {
      sessionStorage.setItem("terminal_verified", "true");
      setIsVerified(true);
    } else {
      setStatusMsg({ type: 'error', text: 'INVALID ACCESS SIGNAL' });
    }
  };

  // --- 4. LOGOUT ---
  const handleLogout = async () => {
    sessionStorage.removeItem("terminal_verified");
    await signOut(auth);
  };

  // --- 5. AUTH OBSERVER ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        const settingsRef = doc(db, "userSettings", user.uid);
        onSnapshot(settingsRef, (docSnap) => {
          if (docSnap.exists()) setBrandName(docSnap.data().brandName || "Hardware Arsenal");
        });
      } else {
        setCurrentUser(null);
        setIsVerified(false);
        sessionStorage.removeItem("terminal_verified");
        setStep("login");
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => { setSidebarOpen(false); }, [activeView]);

  if (authLoading) return (
    <div className="h-screen bg-[#05070a] flex flex-col items-center justify-center space-y-4">
      <FaTerminal className="text-amber-500 animate-pulse text-3xl" />
      <p className="text-amber-500/40 text-[9px] font-black tracking-[0.4em] uppercase">Decrypting Identity...</p>
    </div>
  );

  // --- LOGIN UI ---
  if (!currentUser || !isVerified) {




return (
  <div className={`min-h-screen flex items-center justify-center p-4 overflow-hidden relative transition-colors duration-700 ${
    isDarkMode ? "bg-[#05070a]" : "bg-[#f1f5f9]"
  }`}>
    {/* DYNAMIC AMBIENT GLOWS */}
    <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] blur-[120px] rounded-full transition-opacity duration-1000 ${
      isDarkMode ? "bg-amber-500/10 opacity-100" : "bg-amber-500/20 opacity-40"
    }`} />
    <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] blur-[120px] rounded-full transition-opacity duration-1000 ${
      isDarkMode ? "bg-blue-500/10 opacity-100" : "bg-blue-500/20 opacity-40"
    }`} />

    <div className="w-full max-w-md relative z-10">
      {/* BRANDING SECTION */}
      <div className="text-center mb-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={`text-3xl sm:text-4xl font-black italic uppercase tracking-tighter transition-colors ${
            isDarkMode 
            ? "text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600" 
            : "text-slate-900"
          }`}>
            AtShop Admin
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className={`h-[1px] w-8 bg-gradient-to-r from-transparent ${isDarkMode ? "to-slate-700" : "to-slate-300"}`} />
            <p className={`text-[10px] font-black uppercase tracking-[0.5em] ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
              Terminal v3.0
            </p>
            <span className={`h-[1px] w-8 bg-gradient-to-l from-transparent ${isDarkMode ? "to-slate-700" : "to-slate-300"}`} />
          </div>
        </motion.div>
      </div>

      {/* THE TERMINAL BOX */}
      <motion.div 
        layout 
        className={`relative backdrop-blur-2xl rounded-[2.5rem] p-8 sm:p-12 border transition-all duration-500 ${
          isDarkMode 
          ? "bg-[#0f172a]/40 border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
          : "bg-white/80 border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
        }`}
      >
        {/* SUBTLE GRID OVERLAY (Dark Mode Only) */}
        {isDarkMode && (
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
        )}
        
        <AnimatePresence mode="wait">
          {step === "login" ? (
            <motion.form 
              key="login" 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 1.05 }}
              onSubmit={handleLogin} 
              className="space-y-6"
            >
              {/* ADMIN ID INPUT */}
              <div className="group relative">
                <FaUser className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 transition-colors ${
                  isDarkMode ? "text-amber-500/30 group-focus-within:text-amber-500" : "text-slate-300 group-focus-within:text-slate-900"
                }`} />
                <input 
                  type="email" 
                  required 
                  placeholder="ADMIN_IDENTIFIER" 
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  className={`w-full h-14 pl-12 pr-4 rounded-2xl outline-none border font-bold text-sm transition-all ${
                    isDarkMode 
                    ? "bg-[#05070a]/60 border-white/5 text-white focus:border-amber-500/40" 
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-900/20"
                  }`} 
                />
              </div>

              {/* SECURITY KEY INPUT */}
              <div className="group relative">
                <FaLock className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 transition-colors ${
                  isDarkMode ? "text-amber-500/30 group-focus-within:text-amber-500" : "text-slate-300 group-focus-within:text-slate-900"
                }`} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  placeholder="SECURITY_PROTOCOL"
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  className={`w-full h-14 pl-12 pr-12 rounded-2xl outline-none border font-bold text-sm transition-all ${
                    isDarkMode 
                    ? "bg-[#05070a]/60 border-white/5 text-white focus:border-amber-500/40" 
                    : "bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-900/20"
                  }`} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
                    isDarkMode ? "text-slate-600 hover:text-amber-500" : "text-slate-300 hover:text-slate-900"
                  }`}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* ACTION BUTTON */}
              <button 
                disabled={loading} 
                className={`group relative w-full h-16 font-black rounded-2xl uppercase tracking-[0.2em] text-[11px] overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                  isDarkMode ? "bg-white text-black" : "bg-slate-900 text-white"
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? <FaSpinner className="animate-spin" /> : "Request Access"}
                </span>
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="otp" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              onSubmit={handleVerifyOtp} 
              className="space-y-8 text-center"
            >
              <div>
                <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${
                  isDarkMode ? "text-amber-500" : "text-slate-400"
                }`}>Confirm Identity</p>
                <input 
                  type="text" 
                  maxLength="6" 
                  required 
                  autoFocus
                  onChange={(e) => setOtpInput(e.target.value)}
                  className={`w-full h-20 text-center text-4xl font-black tracking-[0.5em] bg-transparent border-b outline-none transition-all ${
                    isDarkMode ? "border-white/10 text-amber-500 focus:border-amber-500" : "border-slate-200 text-slate-900 focus:border-slate-900"
                  }`} 
                />
              </div>
              
              <div className="space-y-4">
                <button className={`w-full h-14 font-black rounded-2xl uppercase tracking-widest text-[10px] transition-all cursor-pointer ${
                  isDarkMode ? "bg-amber-500 text-black shadow-[0_10px_20px_rgba(245,158,11,0.2)]" : "bg-slate-900 text-white"
                }`}>
                  Verify Passcode
                </button>
                <button 
                  type="button" 
                  onClick={() => setStep("login")} 
                  className="w-full text-slate-400 text-[9px] font-black uppercase tracking-widest hover:text-amber-500 transition-colors cursor-pointer"
                >
                  Abort Mission
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* ERROR/SUCCESS MESSAGES */}
        {statusMsg.text && (
          <div className={`mt-6 p-3 rounded-xl border text-center text-[9px] font-black uppercase tracking-widest ${
            statusMsg.type === 'error' 
            ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' 
            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
          }`}>
            {statusMsg.text}
          </div>
        )}
      </motion.div>
    </div>
  </div>
);









  }

  // --- CONTENT DISPATCHER ---
  const renderContent = () => {
    const props = { isDarkMode, brandName };
    switch (activeView) {
      case "overview":  return <Overview {...props} />;
      case "orders":    return <Orders {...props} />;
      case "return":    return <Return {...props} />;
      case "customers": return <Customers {...props} />;
      case "products":  return <Products {...props} />;
      case "adminChat": return <AdminChat {...props} />;
      case "settings":  return <Settings {...props} />; // Now uses the full Settings component
      default:          return <Overview {...props} />;
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-500 ${isDarkMode ? "bg-[#05070a]" : "bg-[#f8fafc]"}`}>
      <Sidebar activeView={activeView} setActiveView={setActiveView} isDarkMode={isDarkMode} isOpen={isSidebarOpen} setOpen={setSidebarOpen} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Header activeView={activeView} setSidebarOpen={setSidebarOpen} isDarkMode={isDarkMode} toggleTheme={toggleTheme} user={{ name: currentUser.email.split('@')[0], role: 'Super Admin' }} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 custom-scrollbar">
          <motion.div key={activeView} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;