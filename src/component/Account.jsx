import React, { useEffect, useState } from "react";
import { useAuth } from "../provider/AuthProvider";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext"; 
import { FaBox, FaChevronRight, FaHistory, FaUser, FaShieldAlt, FaDesktop } from "react-icons/fa";

// FIX: Using ipify + ip-api to avoid CORS blocks on localhost
const fetchGeoLocation = async () => {
  try {
    const ipRes = await fetch("https://api.ipify.org?format=json");
    const ipData = await ipRes.json();
    
    // ip-api.com is excellent for development (no API key required)
    const geoRes = await fetch(`http://ip-api.com/json/${ipData.ip}`);
    const geoData = await geoRes.json();
    
    return { 
      city: geoData.city || "Unknown", 
      country_name: geoData.country || "Global", 
      ip: ipData.ip 
    };
  } catch (error) {
    console.error("Geo-location failed:", error);
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

  const [profileForm, setProfileForm] = useState({
    displayName: "",
    photoURL: "",
  });

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        displayName: currentUser.displayName || "User",
        photoURL: currentUser.photoURL || "",
      });
      loadActivityLog();
      
      // ✅ LOAD & FILTER ORDERS BY USER ID
      const allOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");
      const filtered = allOrders.filter(order => order.userId === currentUser.uid);
      setUserOrders(filtered);
    }
  }, [currentUser]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/");
    } catch (err) {
      alert("Logout failed: " + err.message);
    }
    setIsLoggingOut(false);
  };

  const detectDeviceInfo = () => {
    const ua = navigator.userAgent.toLowerCase();
    let type = /mobile|android|iphone|ipad/i.test(ua) ? "Mobile/Tablet" : "Desktop";
    const browser = ua.includes("edg") ? "Edge" : ua.includes("chrome") ? "Chrome" : "Safari";
    const os = ua.includes("win") ? "Windows" : ua.includes("mac") ? "MacOS" : "Linux";
    return { type, browser, os };
  };

  const loadActivityLog = async () => {
    const { type, browser, os } = detectDeviceInfo();
    setDeviceInfo(prev => ({ ...prev, deviceType: type, browser, os }));

    const geo = await fetchGeoLocation();
    const log = {
      time: new Date().toLocaleString(),
      location: `${geo.city}, ${geo.country_name}`,
      ip: geo.ip,
    };

    setActivityLogs((prev) => {
      if (prev[0] && prev[0].time === log.time) return prev;
      const updated = [log, ...prev].slice(0, 5);
      localStorage.setItem("activityLogs", JSON.stringify(updated));
      return updated;
    });
  };

  if (!currentUser) return (
    <div className={`flex flex-col items-center justify-center h-screen ${isDarkMode ? "bg-gray-950 text-gray-300" : "bg-white text-gray-700"}`}>
      <h1 className="text-3xl font-black italic uppercase">Access Denied</h1>
      <p className="mt-2 opacity-50 uppercase text-xs tracking-widest">Please login to view terminal data.</p>
    </div>
  );

  const avatarUrl = profileForm.photoURL || `https://ui-avatars.com/api/?name=${profileForm.displayName}&background=f59e0b&color=fff`;

  return (
    <div className={`min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${
      isDarkMode ? "bg-[#05070a] text-gray-100" : "bg-orange-50 text-gray-900"
    }`}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black mb-8 italic uppercase tracking-tighter">
          Command <span className="text-amber-500">Center</span>
        </h1>

        {/* Tabs Navigation */}
        <div className={`flex space-x-8 mb-10 border-b overflow-x-auto ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}>
          {[
            { id: "profile", label: "Identity", icon: <FaUser /> },
            { id: "orders", label: "Orders", icon: <FaBox /> },
            { id: "security", label: "Security", icon: <FaShieldAlt /> },
            { id: "activity", label: "Logs", icon: <FaHistory /> }
          ].map(tab => (
            <button
              key={tab.id}
              className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
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

        <motion.div key={activeTab} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          
          {/* IDENTITY TAB */}
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`rounded-[2rem] p-8 border ${isDarkMode ? "bg-[#0d1117] border-gray-800" : "bg-white border-gray-100 shadow-xl"}`}>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <img src={avatarUrl} alt="User" className="w-32 h-32 rounded-full border-4 border-amber-500/20 object-cover" />
                  <div className="text-center md:text-left">
                    <h2 className="text-3xl font-black text-amber-500 italic uppercase leading-none">{profileForm.displayName}</h2>
                    <p className="text-xs font-bold opacity-50 mt-2 uppercase tracking-widest">{currentUser.email}</p>
                    <div className="mt-4">
                      <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${currentUser.emailVerified ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                        {currentUser.emailVerified ? "Verified Protocol" : "Unverified Access"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`rounded-[2rem] p-8 border ${isDarkMode ? "bg-[#0d1117] border-gray-800" : "bg-white border-gray-100 shadow-xl"}`}>
                <h2 className="text-xs font-black text-emerald-500 mb-6 uppercase tracking-widest flex items-center gap-2"><FaDesktop/> Terminal Specs</h2>
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  {Object.entries(deviceInfo).map(([key, val]) => (
                    <div key={key}>
                      <p className="text-[9px] font-black opacity-30 uppercase tracking-tighter mb-1">{key.replace(/([A-Z])/g, " $1")}</p>
                      <p className="text-xs font-bold uppercase truncate">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

    {/* ACQUISITIONS TAB */}
{activeTab === "orders" && (
  <div className={`rounded-[2rem] p-8 border ${isDarkMode ? "bg-[#0d1117] border-gray-800" : "bg-white border-gray-100 shadow-xl"}`}>
    {userOrders.length === 0 ? (
      <div className="py-20 text-center opacity-20 italic font-black uppercase tracking-widest">
        No transaction data found.
      </div>
    ) : (
      <div className="space-y-6">
        {userOrders.map((order) => (
          <motion.div 
            key={order.orderId}
            whileHover={{ y: -5 }}
            className={`p-6 rounded-[2rem] border transition-all ${
              isDarkMode ? "bg-black/20 border-gray-800" : "bg-gray-50 border-gray-200"
            }`}
          >
            {/* Header: ID, Date, and Status */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-dashed border-gray-800/50">
              <div className="flex items-center gap-4">
                <div className="bg-amber-500 text-black p-3 rounded-xl shadow-lg shadow-amber-500/20">
                  <FaBox />
                </div>
                <div>
                  <p className="font-black text-sm tracking-widest uppercase italic leading-none">{order.orderId}</p>
                  <p className="text-[9px] font-bold opacity-40 uppercase mt-1">Logged: {new Date(order.date).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <span className="px-4 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[9px] font-black uppercase tracking-tighter border border-emerald-500/20">
                  {order.status}
                </span>
                <button 
                  onClick={() => navigate(`/ordertracking/${order.orderId}`)}
                  className="p-2 hover:bg-amber-500 hover:text-black rounded-lg transition-all text-amber-500 border border-amber-500/20"
                >
                  <FaChevronRight className="text-xs" />
                </button>
              </div>
            </div>

            {/* Content: Product Manifest */}
            <div className="space-y-3 px-2">
              <p className="text-[8px] font-black opacity-30 uppercase tracking-[0.2em] mb-2">Acquisition Manifest</p>
              {order.items && order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="opacity-70">{item.name} <span className="text-[8px] opacity-40 ml-1">x{item.quantity || 1}</span></span>
                  <span className="text-amber-500/80">${item.price}</span>
                </div>
              ))}
            </div>

            {/* Footer: Total Amount */}
            <div className="mt-6 pt-4 border-t border-gray-800/30 flex justify-between items-end">
              <div>
                 <p className="text-[8px] font-black opacity-30 uppercase">Payment Method</p>
                 <p className="text-[10px] font-black uppercase italic">{order.paymentMethod || "Encrypted"}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black opacity-30 uppercase">Total Credits</p>
                <p className="font-black text-amber-500 text-2xl italic tracking-tighter leading-none">${order.total}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>
)}

          {/* SECURITY & LOGS TABS ARE SAME AS PREVIOUS (Integrated within full code) */}
          {activeTab === "security" && (
            <div className={`rounded-[2rem] p-8 border ${isDarkMode ? "bg-[#0d1117] border-gray-800" : "bg-white border-gray-100 shadow-xl"}`}>
              <h2 className="text-xl font-black italic text-red-500 mb-6 uppercase tracking-widest">Firewall Status</h2>
              <div className={`p-6 rounded-2xl flex justify-between items-center ${isDarkMode ? "bg-black/40 border border-gray-800" : "bg-gray-50"}`}>
                <div>
                  <p className="font-black text-xs uppercase tracking-widest">MFA Verification</p>
                  <p className="text-[10px] font-bold opacity-40 uppercase mt-1">Identity confirm via communication signal.</p>
                </div>
                <span className={`text-[10px] font-black uppercase italic ${currentUser.emailVerified ? "text-emerald-500" : "text-amber-500"}`}>
                  {currentUser.emailVerified ? "SECURE" : "PENDING"}
                </span>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className={`rounded-[2rem] p-8 border ${isDarkMode ? "bg-[#0d1117] border-gray-800" : "bg-white border-gray-100 shadow-xl"}`}>
              <h2 className="text-xl font-black italic text-blue-500 mb-8 uppercase tracking-widest">Access Logs</h2>
              <div className="space-y-4">
                {activityLogs.map((log, index) => (
                  <div key={index} className={`flex justify-between items-center p-5 rounded-xl border ${isDarkMode ? "bg-black/20 border-gray-800" : "bg-gray-50 border-gray-100"}`}>
                    <div>
                      <p className="font-black text-amber-500 text-[11px] uppercase tracking-tighter leading-none">{log.time}</p>
                      <p className="text-[9px] font-bold opacity-40 mt-1 uppercase tracking-widest">IP: {log.ip}</p>
                    </div>
                    <p className="text-[10px] font-black uppercase italic opacity-60 text-right">{log.location}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Logout Button */}
          <div className="mt-16 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.03, letterSpacing: "0.2em" }}
              whileTap={{ scale: 0.70 }}
              onClick={() => setTimeout(handleLogout, 700)}
              className={`px-12 py-5 rounded-2xl  cursor-pointer font-black tracking-[0.3em] uppercase transition-all shadow-xl text-[15px] ${
                isDarkMode 
                  ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white" 
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {isLoggingOut ? "Terminating..." : "Log out"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Account;