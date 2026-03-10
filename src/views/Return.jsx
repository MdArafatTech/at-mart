import React, { useEffect, useState, useMemo } from "react";
import { db } from "../firebase/Firebase";
import { collection, onSnapshot, updateDoc, doc, serverTimestamp, getDocs, query, orderBy, deleteDoc } from "firebase/firestore";
import { 
  FaTerminal, FaSync, FaShieldAlt, FaLayerGroup, 
  FaEnvelope, FaClock, FaSearch, FaTrashAlt, FaExclamationTriangle 
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const Return = () => {
  const { darkMode } = useTheme();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [confirmDelete, setConfirmDelete] = useState(null); // Track which ID is pending deletion

  const statusOrder = ["pending", "authorized", "inspected", "resolved"];

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const q = query(collection(db, "returns"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReturns(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const q = query(collection(db, "returns"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReturns(data);
      setTimeout(() => setIsRefreshing(false), 600);
    } catch (err) {
      console.error(err);
      setIsRefreshing(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    const returnRef = doc(db, "returns", id);
    try {
      await updateDoc(returnRef, { status: newStatus, lastUpdated: serverTimestamp() });
    } catch (err) { console.error(err); }
  };

  const deleteRequest = async (id) => {
    try {
      await deleteDoc(doc(db, "returns", id));
      setConfirmDelete(null);
    } catch (err) { console.error("Delete Error:", err); }
  };

  const filteredReturns = useMemo(() => {
    return returns.filter((item) => {
      const matchesSearch = item.productName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.orderId?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === "all" || item.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [returns, searchQuery, activeFilter]);

  return (
    <div className="min-h-screen transition-colors duration-500 font-mono py-6 md:py-10 px-4 md:px-8 bg-white dark:bg-black text-slate-900 dark:text-zinc-300">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-6 border-b border-gray-100 dark:border-zinc-900 pb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500 rounded-2xl shadow-lg shadow-amber-500/20">
              <FaShieldAlt className="text-black text-xl md:text-2xl" />
            </div>
            <div>
              <h2 className="text-xl md:text-3xl lg:text-4xl font-black uppercase italic tracking-tighter text-black dark:text-white leading-none">
                RMA Terminal
              </h2>
              <p className="text-[9px] md:text-xs text-zinc-500 mt-1 uppercase tracking-[3px]">Protocol Management</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-64 lg:w-96 group">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-amber-500" />
              <input 
                type="text"
                placeholder="SEARCH DATABASE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-xs md:text-sm font-bold uppercase outline-none focus:border-amber-500/50"
              />
            </div>
            <button onClick={handleRefresh} className={`p-4 rounded-xl bg-gray-50 dark:bg-zinc-900 text-zinc-400 hover:text-amber-500 transition-all ${isRefreshing ? 'animate-spin' : ''}`}>
              <FaSync />
            </button>
          </div>
        </header>

        {/* --- FILTERS --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          <button onClick={() => setActiveFilter("all")} className={`py-3 px-4 rounded-xl border text-[10px] md:text-xs lg:text-sm font-black uppercase transition-all ${activeFilter === 'all' ? 'bg-amber-500 text-black border-amber-500' : 'bg-transparent border-gray-100 dark:border-zinc-800 text-zinc-500 hover:border-amber-500/30'}`}>
            All [{returns.length}]
          </button>
          {statusOrder.map((status) => (
            <button key={status} onClick={() => setActiveFilter(status)} className={`py-3 px-4 rounded-xl border text-[10px] md:text-xs lg:text-sm font-black uppercase transition-all ${activeFilter === status ? 'bg-amber-500 text-black border-amber-500' : 'bg-transparent border-gray-100 dark:border-zinc-800 text-zinc-500 hover:border-amber-500/30'}`}>
              {status} [{returns.filter(r => r.status === status).length}]
            </button>
          ))}
        </div>

        {/* --- GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReturns.map((item) => (
            <div key={item.id} className="flex flex-col rounded-[2rem] border transition-all duration-300 bg-white dark:bg-zinc-900/30 border-gray-100 dark:border-zinc-800 hover:border-amber-500/40 p-6 shadow-sm group relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1.5 ${item.status === 'resolved' ? 'bg-emerald-500' : 'bg-amber-500'}`} />

              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] md:text-xs font-black text-amber-500 bg-amber-500/5 px-3 py-1.5 rounded-lg border border-amber-500/10 uppercase">
                  ID_{item.id.slice(0, 8)}
                </span>
                
                {/* DELETE LOGIC */}
                {confirmDelete === item.id ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => deleteRequest(item.id)} className="text-[10px] bg-rose-600 text-white px-2 py-1 rounded font-black hover:bg-rose-700 transition-colors">CONFIRM</button>
                    <button onClick={() => setConfirmDelete(null)} className="text-[10px] text-zinc-500 font-black">X</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDelete(item.id)} className="p-2 text-zinc-500 hover:text-rose-500 transition-colors cursor-pointer">
                    <FaTrashAlt size={15} />
                  </button>
                )}
              </div>

              <div className="mb-6 flex-grow">
                <h4 className="text-sm md:text-lg lg:text-xl font-black text-black dark:text-white uppercase italic tracking-tight mb-2 truncate">
                  {item.productName}
                </h4>
                <p className="text-[10px] md:text-sm text-zinc-500 font-bold mb-6 opacity-60">REF: {item.orderId}</p>
                
                <div className="space-y-3 border-t border-gray-50 dark:border-zinc-800/50 pt-5">
                  <div className="flex items-center gap-3 text-xs md:text-sm lg:text-base text-zinc-500">
                    <FaEnvelope className="text-amber-500/50" /> 
                    <span className="truncate">{item.email || "NO_EMAIL"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs md:text-sm lg:text-base text-zinc-500">
                    <FaLayerGroup className="text-amber-500/50" /> 
                    <span>QTY: {item.qty || 1} UNIT(S)</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto space-y-4">
                <div className="bg-gray-50 dark:bg-black/60 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800/50">
                  <label className="text-[8px] md:text-[10px] font-black text-zinc-400 uppercase mb-2 block tracking-widest">Update Protocol</label>
                  <select 
                    value={item.status}
                    onChange={(e) => updateStatus(item.id, e.target.value)}
                    className="w-full bg-transparent text-xs md:text-sm lg:text-md font-black text-black dark:text-amber-500 uppercase outline-none"
                  >
                    {statusOrder.map(s => <option key={s} value={s} className="bg-white dark:bg-zinc-900">{s.toUpperCase()}</option>)}
                  </select>
                </div>

                <div className="flex items-center justify-between text-[9px] md:text-xs font-black text-zinc-400 uppercase tracking-widest px-1">
                   <span className="flex items-center gap-2"><FaClock className="text-amber-500" /> {item.createdAt?.toDate().toLocaleDateString()}</span>
                   {item.status === 'pending' && <span className="text-rose-500 animate-pulse bg-rose-500/5 px-2 py-0.5 rounded">Action Req</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- EMPTY STATE --- */}
        {filteredReturns.length === 0 && !loading && (
          <div className="py-24 text-center border-2 border-dashed border-gray-100 dark:border-zinc-900 rounded-[3rem]">
            <FaTerminal className="mx-auto text-5xl text-zinc-200 dark:text-zinc-800 mb-6" />
            <p className="text-zinc-400 text-xs md:text-sm font-black uppercase tracking-[0.2em]">System Standby: 0 Nodes Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Return;