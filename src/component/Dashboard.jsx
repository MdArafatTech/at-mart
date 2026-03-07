import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaBox,
  FaPaperPlane,
  FaUser,
  FaShieldAlt,
  FaChartLine,
  FaWallet,
  FaShoppingBag,
  FaCog,
  FaBell,
  FaSearch,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaArrowUp,
  FaCircle,
  FaDownload,
  FaTrash,
  FaEdit,
  FaPlus,
  FaFilter,
  FaLock,
  FaUserShield,
  FaArrowRight,
  FaEye,
  FaEyeSlash,
  FaPowerOff,
  FaChevronRight,
  FaDatabase,
  FaGlobe,
  FaUserSecret,
} from "react-icons/fa";

const Dashboard = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("insights");

  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLoginSuccess={() => setIsAuthenticated(true)}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
    );
  }

  return (
    <div
      className={`flex h-screen overflow-hidden transition-all duration-500 ${isDarkMode ? "bg-[#05070a] text-slate-200" : "bg-[#f4f7fe] text-slate-900"}`}
    >
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] w-72 transform transition-transform duration-300 lg:translate-x-0 lg:static ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white border-slate-200"} border-r flex flex-col shadow-2xl`}
      >
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="bg-amber-500 p-2.5 rounded-2xl text-slate-900 shadow-lg shadow-amber-500/20">
              <FaShieldAlt size={22} />
            </div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase">
              AN-SHOP
            </h1>
          </div>
          <button
            className="lg:hidden p-2 text-slate-500 cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        <nav className="flex-1 px-6 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          <NavItem
            icon={<FaChartLine />}
            label="Insights"
            active={activeView === "insights"}
            onClick={() => {
              setActiveView("insights");
              setSidebarOpen(false);
            }}
            isDarkMode={isDarkMode}
          />
          <NavItem
            icon={<FaShoppingBag />}
            label="Orders"
            active={activeView === "orders"}
            onClick={() => {
              setActiveView("orders");
              setSidebarOpen(false);
            }}
            isDarkMode={isDarkMode}
          />
          <NavItem
            icon={<FaBox />}
            label="Inventory"
            active={activeView === "inventory"}
            onClick={() => {
              setActiveView("inventory");
              setSidebarOpen(false);
            }}
            isDarkMode={isDarkMode}
          />
          <NavItem
            icon={<FaUser />}
            label="Customers"
            active={activeView === "customers"}
            onClick={() => {
              setActiveView("customers");
              setSidebarOpen(false);
            }}
            isDarkMode={isDarkMode}
          />
          <NavItem
            icon={<FaCog />}
            label="Settings"
            active={activeView === "settings"}
            onClick={() => {
              setActiveView("settings");
              setSidebarOpen(false);
            }}
            isDarkMode={isDarkMode}
          />
        </nav>

        <div className="p-6 mt-auto space-y-3">
          <button
            onClick={() => alert("Generating Report...")}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-amber-500 text-slate-900 font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <FaDownload /> Export PDF
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-rose-500/10 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 cursor-pointer"
          >
            <FaPowerOff /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <header
          className={`h-20 lg:h-24 px-6 lg:px-8 border-b flex items-center justify-between sticky top-0 z-40 backdrop-blur-md ${isDarkMode ? "bg-[#05070a]/70 border-slate-800" : "bg-white/70 border-slate-200"}`}
        >
          <div className="flex items-center gap-4 lg:gap-6">
            <button
              className="lg:hidden p-2 text-2xl cursor-pointer"
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars />
            </button>
            <h2 className="text-lg lg:text-xl font-black italic tracking-tight capitalize">
              {activeView}
            </h2>
          </div>

          <div className="flex items-center gap-3 lg:gap-4">
            <div
              className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${isDarkMode ? "bg-emerald-500/10 text-emerald-500" : "bg-emerald-100 text-emerald-700"}`}
            >
              <FaCircle className="animate-pulse text-[8px]" /> Server: Online
            </div>
            <button
              onClick={toggleTheme}
              className={`p-2.5 lg:p-3 rounded-2xl transition-all cursor-pointer ${isDarkMode ? "bg-slate-800 text-amber-400 hover:bg-slate-700" : "bg-slate-100 text-slate-500 shadow-sm hover:bg-slate-200"}`}
            >
              {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>
            <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center font-black text-white shadow-xl cursor-pointer hover:rotate-6 transition-transform">
              A
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-12 space-y-8 lg:space-y-12 custom-scrollbar">
          {activeView === "insights" && (
            <InsightsView isDarkMode={isDarkMode} />
          )}
          {activeView === "orders" && <OrdersView isDarkMode={isDarkMode} />}
          {activeView === "inventory" && (
            <InventoryView isDarkMode={isDarkMode} />
          )}
          {activeView === "customers" && (
            <CustomersView isDarkMode={isDarkMode} />
          )}
          {activeView === "settings" && (
            <SettingsView isDarkMode={isDarkMode} />
          )}
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   ORDERS VIEW (SYNCED WITH USER ACQUISITIONS)
   ========================================================================== */
const OrdersView = ({ isDarkMode }) => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch orders from the same localStorage key used in Account/Payment
    const savedOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");
    setOrders(savedOrders);
  }, []);

  return (
    <div className="animate-in slide-in-from-bottom-8 duration-500 space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {["All Orders", "Pending", "Verified", "Flagged"].map((t, i) => (
            <button
              key={i}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all ${i === 0 ? "bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20" : isDarkMode ? "bg-slate-800 text-slate-400 hover:text-white" : "bg-white text-slate-500 shadow-sm"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <div
            className={`p-2.5 rounded-xl border cursor-pointer ${isDarkMode ? "border-slate-800 text-slate-400" : "bg-white border-transparent shadow-sm"}`}
          >
            <FaFilter />
          </div>
          <div
            className={`p-2.5 rounded-xl border cursor-pointer ${isDarkMode ? "border-slate-800 text-slate-400" : "bg-white border-transparent shadow-sm"}`}
          >
            <FaSearch />
          </div>
        </div>
      </div>

      <div
        className={`rounded-[2.5rem] border overflow-hidden ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white shadow-xl border-transparent"}`}
      >
        {orders.length === 0 ? (
          <div className="py-32 text-center opacity-20 italic font-black uppercase tracking-[0.4em]">
            No verified transactions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead
                className={`text-[10px] font-black uppercase text-slate-500 border-b ${isDarkMode ? "bg-slate-800/30 border-slate-800" : "bg-slate-50 border-slate-100"}`}
              >
                <tr>
                  <th className="px-8 py-5">Track ID</th>
                  <th className="px-8 py-5">Client Name</th>
                  <th className="px-8 py-5">Assets</th>
                  <th className="px-8 py-5">Gateway</th>
                  <th className="px-8 py-5">Total</th>
                  <th className="px-8 py-5 text-center">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/10">
                {orders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="hover:bg-amber-500/5 transition-colors cursor-pointer group"
                  >
                    <td className="px-8 py-6 font-black text-amber-500 italic uppercase leading-none">
                      {order.orderId}
                      <p className="text-[8px] opacity-40 mt-1 font-mono tracking-tighter uppercase">
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-8 py-6 font-bold uppercase text-xs">
                      {order.customer?.fullName || "Encrypted User"}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex -space-x-2">
                        {order.items?.slice(0, 3).map((item, idx) => (
                          <div
                            key={idx}
                            className="h-7 w-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[10px] font-black text-amber-500"
                          >
                            {item.name[0]}
                          </div>
                        ))}
                        {order.items?.length > 3 && (
                          <div className="h-7 w-7 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center text-[8px] font-black">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 font-bold text-[10px] uppercase opacity-60">
                      {order.paymentMethod || "Direct Auth"}
                    </td>
                    <td className="px-8 py-6 font-black text-lg italic tracking-tighter text-amber-500">
                      ${order.total}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button
                        onClick={() =>
                          navigate(`/ordertracking/${order.orderId}`)
                        }
                        className="p-3 bg-amber-500/10 text-amber-500 rounded-xl hover:bg-amber-500 hover:text-white transition-all cursor-pointer shadow-lg shadow-transparent hover:shadow-amber-500/20"
                      >
                        <FaChevronRight size={10} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

/* ==========================================================================
   INSIGHTS VIEW
   ========================================================================== */
const InsightsView = ({ isDarkMode }) => (
  <div className="animate-in fade-in duration-700 space-y-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
      <StatCard
        label="Total Revenue"
        val="$142,400"
        trend="+12%"
        color="amber"
        isDarkMode={isDarkMode}
      />
      <StatCard
        label="Active Orders"
        val="1,245"
        trend="+5%"
        color="blue"
        isDarkMode={isDarkMode}
      />
      <StatCard
        label="New Clients"
        val="892"
        trend="+18%"
        color="emerald"
        isDarkMode={isDarkMode}
      />
      <StatCard
        label="System Load"
        val="24%"
        trend="-2%"
        color="rose"
        isDarkMode={isDarkMode}
      />
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div
        className={`xl:col-span-2 p-6 lg:p-10 rounded-[2.5rem] border ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white shadow-xl border-transparent"}`}
      >
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Revenue Stream (24h)
          </h3>
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-amber-500/20"
              />
            ))}
          </div>
        </div>
        <div className="flex items-end gap-2 lg:gap-4 h-56 lg:h-72">
          {[30, 60, 45, 80, 55, 95, 70, 40, 85, 65, 50, 90].map((h, i) => (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className="flex-1 bg-gradient-to-t from-amber-600 to-amber-300 rounded-t-xl opacity-80 hover:opacity-100 transition-all group relative cursor-pointer"
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-black p-2 bg-slate-900 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                ${h}k
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`p-6 lg:p-8 rounded-[2.5rem] border flex flex-col h-[400px] xl:h-auto ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white shadow-xl border-transparent"}`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Live Support Hub
          </h3>
          <span className="bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full animate-pulse">
            3 LIVE
          </span>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          <ChatItem
            name="Alex Rivera"
            msg="My order #992 is delayed..."
            time="1m"
            online
            isDarkMode={isDarkMode}
          />
          <ChatItem
            name="Sarah Jenkins"
            msg="Can I pay with Crypto?"
            time="5m"
            online
            isDarkMode={isDarkMode}
          />
          <ChatItem
            name="Marc Suzo"
            msg="Bulk pricing inquiry"
            time="12m"
            online={false}
            isDarkMode={isDarkMode}
          />
          <ChatItem
            name="Unknown User"
            msg="System login error"
            time="2h"
            online={false}
            isDarkMode={isDarkMode}
          />
        </div>
        <div className="mt-6 relative">
          <input
            type="text"
            placeholder="Reply to all..."
            className={`w-full py-4 pl-5 pr-12 rounded-2xl text-xs font-bold outline-none border transition-all ${isDarkMode ? "bg-slate-900 border-slate-800 focus:border-amber-500" : "bg-slate-50 border-transparent focus:border-amber-500"}`}
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-amber-500 text-slate-900 rounded-xl cursor-pointer hover:scale-110 active:scale-90 transition-transform">
            <FaPaperPlane size={12} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

/* ==========================================================================
   INVENTORY & CUSTOMER VIEWS
   ========================================================================== */
const InventoryView = ({ isDarkMode }) => (
  <div className="space-y-8 animate-in zoom-in-95 duration-500">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        className={`p-8 rounded-[2rem] border ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white shadow-xl border-transparent"}`}
      >
        <FaDatabase className="text-amber-500 mb-4" size={24} />
        <h4 className="font-black uppercase text-xs tracking-widest text-slate-500">
          Storage Used
        </h4>
        <p className="text-3xl font-black mt-2">84.2 GB</p>
        <div className="w-full h-1.5 bg-slate-800 rounded-full mt-4">
          <div className="w-3/4 h-full bg-amber-500 rounded-full" />
        </div>
      </div>
      <div
        className={`p-8 rounded-[2rem] border ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white shadow-xl border-transparent"}`}
      >
        <FaBox className="text-blue-500 mb-4" size={24} />
        <h4 className="font-black uppercase text-xs tracking-widest text-slate-500">
          Low Stock SKUs
        </h4>
        <p className="text-3xl font-black mt-2">12 Items</p>
        <p className="text-[10px] text-rose-500 font-bold mt-2 animate-pulse">
          Requires immediate restock
        </p>
      </div>
      <div
        className={`p-8 rounded-[2rem] border flex items-center justify-center border-dashed border-slate-700 hover:border-amber-500 hover:bg-amber-500/5 transition-all cursor-pointer group`}
      >
        <div className="text-center">
          <FaPlus className="mx-auto mb-2 text-slate-500 group-hover:text-amber-500" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-amber-500">
            Add New SKU
          </p>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div
          key={i}
          className={`p-6 rounded-[2rem] border group cursor-pointer transition-all hover:-translate-y-2 ${isDarkMode ? "bg-[#0d1117] border-slate-800 hover:border-amber-500/50" : "bg-white shadow-lg border-transparent"}`}
        >
          <div className="aspect-square bg-slate-500/10 rounded-2xl mb-4 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
            📦
          </div>
          <h4 className="font-black text-sm mb-1 truncate">
            HyperCore Node V{i}
          </h4>
          <div className="flex justify-between items-center mt-4">
            <span className="font-black text-amber-500">$420.00</span>
            <span className="text-[9px] font-black uppercase text-slate-500">
              Qty: 42
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CustomersView = ({ isDarkMode }) => (
  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in slide-in-from-right-10 duration-500">
    <div className="xl:col-span-2 space-y-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className={`p-5 rounded-3xl border flex items-center justify-between group cursor-pointer transition-all hover:translate-x-2 ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white shadow-md border-transparent hover:shadow-xl"}`}
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-900 flex items-center justify-center font-black text-white text-xs">
              C{i}
            </div>
            <div>
              <p className="font-black group-hover:text-amber-500 transition-colors">
                Premium Client {i * 120}
              </p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                Joined: 2 mins ago
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-3 bg-slate-500/10 rounded-xl hover:bg-amber-500 hover:text-slate-900 transition-all cursor-pointer">
              <FaEdit size={12} />
            </button>
            <button className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all cursor-pointer">
              <FaTrash size={12} />
            </button>
          </div>
        </div>
      ))}
    </div>
    <div
      className={`p-8 rounded-[2.5rem] border h-fit sticky top-32 ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white shadow-xl"}`}
    >
      <FaGlobe className="text-amber-500 mb-6" size={32} />
      <h3 className="text-xl font-black italic tracking-tighter mb-4">
        Market Reach
      </h3>
      <div className="space-y-6">
        <RegionStat label="Europe" val="45%" color="amber" />
        <RegionStat label="Asia" val="30%" color="blue" />
        <RegionStat label="North America" val="25%" color="emerald" />
      </div>
    </div>
  </div>
);

const SettingsView = ({ isDarkMode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
    <div
      className={`p-10 rounded-[3rem] border ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white shadow-xl border-transparent"}`}
    >
      <div className="flex items-center gap-4 mb-10">
        <FaUserSecret className="text-amber-500" size={24} />
        <h3 className="text-lg font-black italic">Security Protocol</h3>
      </div>
      <div className="space-y-6">
        <ToggleItem
          label="Biometric Bypass"
          desc="Allow fingerprint authentication"
          active
        />
        <ToggleItem
          label="Stealth Mode"
          desc="Hide IP address from logs"
          active={false}
        />
        <ToggleItem
          label="Auto-Lock"
          desc="Lock terminal after 5m idle"
          active
        />
        <button className="w-full py-5 bg-amber-500 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest mt-4 cursor-pointer hover:scale-[1.02] active:scale-95 transition-all">
          Regenerate Master Key
        </button>
      </div>
    </div>
    <div
      className={`p-10 rounded-[3rem] border ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white shadow-xl border-transparent"}`}
    >
      <div className="flex items-center gap-4 mb-10">
        <FaBell className="text-blue-500" size={24} />
        <h3 className="text-lg font-black italic">Push Notifications</h3>
      </div>
      <div className="space-y-6">
        <ToggleItem
          label="Sale Alerts"
          desc="Real-time browser notifications"
          active
        />
        <ToggleItem
          label="Inventory Warning"
          desc="Alert when stock < 10%"
          active
        />
        <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-center">
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
            System Version
          </p>
          <p className="text-2xl font-black tracking-tighter uppercase">
            AN-SHOP V4.0.2
          </p>
        </div>
      </div>
    </div>
  </div>
);

/* ==========================================================================
   UI HELPERS & SMALL COMPONENTS
   ========================================================================== */
const ChatItem = ({ name, msg, time, online, isDarkMode }) => (
  <div
    className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all hover:translate-x-1 ${isDarkMode ? "bg-slate-900/40 hover:bg-slate-800" : "bg-slate-50 hover:bg-white hover:shadow-md"}`}
  >
    <div className="relative">
      <div className="h-10 w-10 rounded-xl bg-amber-500 text-slate-900 flex items-center justify-center font-black text-xs">
        {name[0]}
      </div>
      {online && (
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center mb-1">
        <p className="text-xs font-black truncate">{name}</p>
        <span className="text-[9px] text-slate-500 font-bold">{time}</span>
      </div>
      <p className="text-[10px] text-slate-500 truncate font-medium">{msg}</p>
    </div>
  </div>
);

const NavItem = ({ icon, label, active, onClick, isDarkMode }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-5 px-6 py-4 rounded-[1.5rem] cursor-pointer transition-all duration-300 ${
      active
        ? "bg-amber-500 text-slate-900 font-black shadow-2xl shadow-amber-500/30 translate-x-2"
        : isDarkMode
          ? "hover:bg-slate-800 text-slate-500 hover:text-white"
          : "hover:bg-slate-100 text-slate-400 hover:text-slate-900"
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span className="text-[10px] uppercase font-black tracking-widest">
      {label}
    </span>
  </div>
);

const StatCard = ({ label, val, trend, color, isDarkMode }) => (
  <div
    className={`p-8 rounded-[2.5rem] border transition-all hover:-translate-y-2 cursor-pointer group ${isDarkMode ? "bg-[#0d1117] border-slate-800 hover:border-amber-500/50" : "bg-white shadow-xl border-transparent hover:shadow-2xl"}`}
  >
    <div className="flex justify-between items-start mb-4">
      <span
        className={`text-[10px] font-black px-2 py-1 rounded-lg bg-${color}-500/10 text-${color}-500 group-hover:bg-amber-500 group-hover:text-white transition-colors`}
      >
        {trend}
      </span>
      <FaArrowUp
        className={`text-${color}-500 opacity-20 group-hover:opacity-100 transition-opacity`}
      />
    </div>
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
      {label}
    </p>
    <h3 className="text-3xl font-black tracking-tighter mt-1">{val}</h3>
  </div>
);

const ToggleItem = ({ label, desc, active }) => (
  <div className="flex justify-between items-center cursor-pointer group">
    <div>
      <p className="font-bold group-hover:text-amber-500 transition-colors text-sm">
        {label}
      </p>
      <p className="text-[10px] text-slate-500">{desc}</p>
    </div>
    <div
      className={`w-12 h-6 rounded-full relative transition-colors ${active ? "bg-amber-500" : "bg-slate-800"}`}
    >
      <div
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? "right-1" : "left-1"}`}
      />
    </div>
  </div>
);

const RegionStat = ({ label, val, color }) => (
  <div className="cursor-pointer group">
    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
      <span>{label}</span>
      <span className={`text-${color}-500`}>{val}</span>
    </div>
    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <div
        className={`h-full bg-${color}-500 transition-all duration-1000 group-hover:opacity-80`}
        style={{ width: val }}
      />
    </div>
  </div>
);

const LoginScreen = ({ onLoginSuccess, isDarkMode, toggleTheme }) => {
  const [creds, setCreds] = useState({ user: "", pass: "" });
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (creds.user === "admin" && creds.pass === "admin") onLoginSuccess();
      else {
        alert("INVALID ACCESS KEY");
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 transition-all duration-700 ${isDarkMode ? "bg-[#05070a]" : "bg-[#f4f7fe]"}`}
    >
      <div
        className={`w-full max-w-md p-10 rounded-[3rem] border transform transition-all hover:scale-[1.01] ${isDarkMode ? "bg-[#0d1117] border-slate-800 shadow-[0_0_50px_rgba(245,158,11,0.05)]" : "bg-white shadow-2xl"}`}
      >
        <div className="text-center mb-10">
          <div
            className="bg-amber-500 p-5 rounded-[2rem] w-fit mx-auto text-slate-900 mb-6 cursor-pointer hover:rotate-12 transition-transform shadow-xl shadow-amber-500/20"
            onClick={toggleTheme}
          >
            <FaUserShield size={32} />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">
            AN-SHOP
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">
            Biometric Auth Portal
          </p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">
              Admin ID
            </label>
            <input
              type="text"
              placeholder="Access Code"
              required
              className={`w-full p-4 rounded-2xl text-xs font-bold outline-none border transition-all ${isDarkMode ? "bg-slate-900 border-slate-800 focus:border-amber-500" : "bg-slate-50 border-transparent focus:border-amber-500"}`}
              onChange={(e) => setCreds({ ...creds, user: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">
              Security Key
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              className={`w-full p-4 rounded-2xl text-xs font-bold outline-none border transition-all ${isDarkMode ? "bg-slate-900 border-slate-800 focus:border-amber-500" : "bg-slate-50 border-transparent focus:border-amber-500"}`}
              onChange={(e) => setCreds({ ...creds, pass: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full py-5 bg-amber-500 text-slate-900 font-black rounded-2xl text-xs uppercase tracking-[0.2em] cursor-pointer hover:bg-amber-400 hover:shadow-xl hover:shadow-amber-500/30 active:scale-95 transition-all mt-4"
          >
            {loading ? "Decrypting Protocol..." : "Unlock Terminal"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
