import React, { useEffect, useState } from "react";
import { useAuth } from "../provider/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext"; 
import { 
  FaBox, FaChevronRight, FaHistory, FaUser, FaShieldAlt, 
  FaDesktop, FaSync, FaEdit, FaSave, FaTimes, FaShoppingBag 
} from "react-icons/fa";

// --- FIREBASE IMPORTS ---
import { db, auth } from "../firebase/Firebase";
import { updateProfile } from "firebase/auth";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

const fetchGeoLocation = async () => {
  try {
    const ipRes = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipRes.json();
    const geoRes = await fetch(`http://ip-api.com/json/${ipData.ip}`);
    const geoData = await geoRes.json();
    return { 
      city: geoData.city || "Unknown", 
      country_name: geoData.country || "Global", 
      ip: ipData.ip 
    };
  } catch (error) {
    return { city: "Secure Node", country_name: "Nexus", ip: "127.0.0.1" };
  }
};

const Account = () => {
  const { currentUser, logout } = useAuth();
  const { isDarkMode } = useTheme(); 
  const navigate = useNavigate();
  
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [userOrders, setUserOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhoto, setNewPhoto] = useState("");

  const [deviceInfo, setDeviceInfo] = useState({
    deviceType: "Detecting...",
    browser: "Detecting...",
    os: "Detecting...",
    screen: `${window.screen.width} x ${window.screen.height}`,
  });

  const [activityLogs, setActivityLogs] = useState(() => {
    const savedLogs = localStorage.getItem("activityLogs");
    return savedLogs ? JSON.parse(savedLogs) : [];
  });

  useEffect(() => {
    if (!currentUser) {
        navigate("/login");
        return;
    };
    setNewName(currentUser.displayName || "");
    setNewPhoto(currentUser.photoURL || "");

    setIsLoadingOrders(true);
    // Real-time listener for orders
    const q = query(
      collection(db, "orders"), 
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserOrders(orders);
      setIsLoadingOrders(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setIsLoadingOrders(false);
    });

    loadActivityLog();
    return () => unsubscribe();
  }, [currentUser, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: newName,
        photoURL: newPhoto
      });
      setIsEditing(false);
      alert("Terminal Identity Updated.");
    } catch (err) {
      alert("Protocol Error: " + err.message);
    }
    setIsUpdating(false);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userEmail");
      await logout();
      navigate("/");
    } catch (err) {
      alert("Logout failed: " + err.message);
    }
    setIsLoggingOut(false);
  };

  const loadActivityLog = async () => {
    const ua = navigator.userAgent.toLowerCase();
    const type = /mobile|android|iphone|ipad/i.test(ua) ? "Mobile" : "Desktop";
    const browser = ua.includes("edg") ? "Edge" : ua.includes("chrome") ? "Chrome" : "Safari";
    const os = ua.includes("win") ? "Windows" : ua.includes("mac") ? "MacOS" : "Linux";
    
    setDeviceInfo(prev => ({ ...prev, deviceType: type, browser, os }));
    const geo = await fetchGeoLocation();
    const log = {
      time: new Date().toLocaleString(),
      location: `${geo.city}, ${geo.country_name}`,
      ip: geo.ip,
    };

    setActivityLogs((prev) => {
      const updated = [log, ...prev].slice(0, 5);
      localStorage.setItem("activityLogs", JSON.stringify(updated));
      return updated;
    });
  };

  if (!currentUser) return null;

  const avatarUrl = currentUser.photoURL || `https://ui-avatars.com/api/?name=${currentUser.displayName || 'User'}&background=f59e0b&color=fff`;

  return (
    <div className={`min-h-screen py-10 px-4 transition-colors duration-500 mt-15 ${isDarkMode ? "bg-[#05070a] text-gray-100" : "bg-orange-50 text-gray-900"}`}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black mb-8 italic uppercase tracking-tighter">
          Command <span className="text-amber-500">Center</span>
        </h1>

        {/* TABS NAVIGATION */}
        <div className={`flex space-x-8 mb-10 border-b overflow-x-auto no-scrollbar ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}>
          {[
            { id: "profile", label: "Identity", icon: <FaUser /> },
            { id: "orders", label: "Acquisitions", icon: <FaBox /> },
            { id: "security", label: "Security", icon: <FaShieldAlt /> },
            { id: "activity", label: "Logs", icon: <FaHistory /> }
          ].map(tab => (
            <button
              key={tab.id}
              className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id 
                  ? "border-amber-500 text-amber-500" 
                  : `border-transparent ${isDarkMode ? "text-gray-600 hover:text-gray-300" : "text-gray-400 hover:text-gray-700"}`
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          
          {/* IDENTITY TAB */}
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className={`lg:col-span-2 rounded-[2.5rem] p-8 border relative overflow-hidden ${isDarkMode ? "bg-[#0d1117] border-gray-800" : "bg-white border-gray-100 shadow-xl"}`}>
                <AnimatePresence mode="wait">
                  {!isEditing ? (
                    <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col md:flex-row items-center gap-8">
                      <div className="relative group">
                        <img src={avatarUrl} alt="User" className="w-40 h-40 rounded-[2rem] border-4 border-amber-500/20 object-cover rotate-2 transition-transform group-hover:rotate-0" />
                        <button onClick={() => setIsEditing(true)} className="absolute -bottom-2 -right-2 bg-amber-500 text-black p-3 rounded-xl shadow-lg hover:scale-110 transition-all cursor-pointer">
                          <FaEdit size={14} />
                        </button>
                      </div>
                      <div className="text-center md:text-left">
                        <h2 className="text-4xl font-black text-amber-500 italic uppercase leading-none tracking-tighter">{currentUser.displayName || "Unknown Agent"}</h2>
                        <p className="text-xs font-bold opacity-50 mt-3 uppercase tracking-[0.2em]">{currentUser.email}</p>
                        <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                          <span className="px-4 py-1.5 bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase rounded-lg border border-amber-500/20 tracking-widest">Rank: Prime Client</span>
                          <span className={`px-4 py-1.5 text-[9px] font-black uppercase rounded-lg border tracking-widest ${currentUser.emailVerified ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>
                            {currentUser.emailVerified ? "Verified Protocol" : "Unverified Access"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form key="edit" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-black text-amber-500 uppercase italic tracking-widest">Update Identity</h3>
                        <button type="button" onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-red-500 transition-colors"><FaTimes /></button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase opacity-40 ml-2">Display Name</label>
                          <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold outline-none focus:border-amber-500 transition-all ${isDarkMode ? "bg-black border-gray-800" : "bg-gray-50 border-gray-200"}`} placeholder="Full Name" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase opacity-40 ml-2">Avatar URL</label>
                          <input type="text" value={newPhoto} onChange={(e) => setNewPhoto(e.target.value)} className={`w-full px-5 py-4 rounded-2xl border text-sm font-bold outline-none focus:border-amber-500 transition-all ${isDarkMode ? "bg-black border-gray-800" : "bg-gray-50 border-gray-200"}`} placeholder="https://image-link.com" />
                        </div>
                      </div>
                      <div className="flex gap-4 pt-4">
                        <button type="submit" disabled={isUpdating} className="flex-1 bg-amber-500 text-black font-black uppercase py-4 rounded-2xl text-[10px] tracking-widest hover:bg-amber-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20">
                          {isUpdating ? <FaSync className="animate-spin" /> : <><FaSave /> Save Changes</>}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

              {/* Sidebar Info */}
              <div className={`rounded-[2.5rem] p-8 border ${isDarkMode ? "bg-[#0d1117] border-gray-800" : "bg-white border-gray-100 shadow-xl"}`}>
                <h2 className="text-xs font-black text-emerald-500 mb-8 uppercase tracking-widest flex items-center gap-2"><FaDesktop/> Node Specs</h2>
                <div className="space-y-6">
                  {Object.entries(deviceInfo).map(([key, val]) => (
                    <div key={key} className="border-b border-gray-800/10 pb-2">
                      <p className="text-[8px] font-black opacity-30 uppercase tracking-tighter mb-1">{key}</p>
                      <p className="text-[11px] font-bold uppercase truncate">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ACQUISITIONS (ORDERS) TAB */}
          {activeTab === "orders" && (
            <div className={`rounded-[2rem] p-8 border ${isDarkMode ? "bg-[#0d1117] border-gray-800" : "bg-white border-gray-100 shadow-xl"}`}>
              <h2 className="text-2xl font-black italic text-amber-500 mb-8 uppercase tracking-widest">Order Registry</h2>
              {isLoadingOrders ? (
                <div className="flex flex-col items-center py-20 animate-pulse">
                  <FaSync className="animate-spin text-amber-500 mb-4" size={30} />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Syncing with Mainframe...</p>
                </div>
              ) : userOrders.length > 0 ? (
                <div className="space-y-4">
                  {userOrders.map(order => (
                    <div key={order.id} className={`p-6 rounded-2xl border flex flex-wrap items-center justify-between gap-4 transition-all hover:border-amber-500/50 ${isDarkMode ? "bg-black/40 border-gray-800" : "bg-gray-50 border-gray-200"}`}>
                      <div className="flex items-center gap-4">
                        <div className="bg-amber-500/10 p-4 rounded-xl text-amber-500"><FaShoppingBag size={20} /></div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Serial: #{order.id.slice(0,8)}</p>
                          <p className="font-bold text-sm uppercase">{new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-amber-500">${order.totalAmount}</p>
                        <span className="text-[9px] font-black px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full uppercase tracking-tighter">Fulfilled</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-6">No Data Entries Found</p>
                  <Link to="/shop" className="px-10 py-4 bg-amber-500 text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:scale-105 transition-all inline-block">Initiate Acquisition</Link>
                </div>
              )}
            </div>
          )}

          {/* LOGS TAB */}
          {activeTab === "activity" && (
            <div className={`rounded-[2rem] p-8 border ${isDarkMode ? "bg-[#0d1117] border-gray-800" : "bg-white border-gray-100 shadow-xl"}`}>
              <h2 className="text-2xl font-black italic text-blue-500 mb-8 uppercase tracking-widest">Access Logs</h2>
              <div className="space-y-4">
                {activityLogs.map((log, i) => (
                  <div key={i} className={`p-5 rounded-xl border-l-4 border-blue-500 flex justify-between items-center ${isDarkMode ? "bg-black/40 border-gray-800" : "bg-gray-50 border-gray-200"}`}>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">{log.time}</p>
                      <p className="text-xs font-bold mt-1 uppercase tracking-tighter">{log.location}</p>
                    </div>
                    <p className="text-[9px] font-mono font-bold opacity-40">{log.ip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className={`rounded-[2rem] p-8 border ${isDarkMode ? "bg-[#0d1117] border-gray-800" : "bg-white border-gray-100 shadow-xl"}`}>
              <h2 className="text-2xl font-black italic text-red-500 mb-6 uppercase tracking-widest">Shield Status</h2>
              <div className={`p-8 rounded-2xl flex justify-between items-center ${isDarkMode ? "bg-black/40 border border-gray-800" : "bg-gray-50"}`}>
                <div>
                  <p className="font-black text-xs uppercase tracking-widest">MFA Verification</p>
                  <p className="text-[10px] font-bold opacity-40 uppercase mt-1">Direct Firebase auth-link active.</p>
                </div>
                <span className={`text-[10px] font-black uppercase italic px-4 py-2 rounded-lg ${currentUser.emailVerified ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}>
                  {currentUser.emailVerified ? "PROTOCOL: ACTIVE" : "PROTOCOL: PENDING"}
                </span>
              </div>
            </div>
          )}

          {/* LOGOUT BUTTON */}
          <div className="mt-16 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.03, letterSpacing: "0.1em" }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className={`px-14 py-5 rounded-2xl cursor-pointer font-black tracking-[0.3em] uppercase transition-all shadow-xl text-[14px] ${
                isDarkMode 
                  ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white" 
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {isLoggingOut ? "Purging Session..." : "Log Out"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Account;