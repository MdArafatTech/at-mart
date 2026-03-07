import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaChevronRight, FaTrash, FaExclamationTriangle } from "react-icons/fa";

const Orders = ({ isDarkMode }) => {
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All Orders");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");
    setAllOrders(savedOrders);
    setFilteredOrders(savedOrders);
  }, []);

  useEffect(() => {
    let result = allOrders;
    if (filterStatus !== "All Orders") {
      result = result.filter(o => o.status === filterStatus);
    }
    if (searchQuery) {
      result = result.filter(o => 
        o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredOrders(result);
  }, [filterStatus, searchQuery, allOrders]);

  const updateStatus = (orderId, newStatus) => {
    const updated = allOrders.map(o => 
      o.orderId === orderId ? { ...o, status: newStatus } : o
    );
    saveAndRefresh(updated);
  };

  const deleteOrder = (orderId) => {
    if (window.confirm("Are you sure you want to PERMANENTLY delete this order? This cannot be undone.")) {
      const updated = allOrders.filter(o => o.orderId !== orderId);
      saveAndRefresh(updated);
    }
  };

  const saveAndRefresh = (newData) => {
    setAllOrders(newData);
    localStorage.setItem("myOrders", JSON.stringify(newData));
  };

  return (
    <div className="animate-in slide-in-from-bottom-8 duration-500 space-y-6 pb-10">
      
      {/* RESPONSIVE CONTROLS */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="flex gap-2 overflow-x-auto pb-3 md:pb-0 no-scrollbar select-none">
          {['All Orders', 'Pending', 'Verified', 'Shipped', 'Delivered'].map((t) => (
            <button 
              key={t} 
              onClick={() => setFilterStatus(t)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                filterStatus === t 
                ? 'bg-amber-500 text-slate-900 shadow-lg' 
                : isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500 shadow-sm'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:flex-none">
            <input 
              type="text"
              placeholder="Search..."
              className={`w-full md:w-64 p-3 pl-10 rounded-xl text-[10px] font-bold outline-none border transition-all ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200"
              }`}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
          </div>
        </div>
      </div>

      {/* TABLE CONTAINER WITH HORIZONTAL SCROLL */}
      <div className={`rounded-[2rem] md:rounded-[2.5rem] border overflow-hidden ${
        isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white shadow-xl border-transparent"
      }`}>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm border-collapse min-w-[900px]">
            <thead className={`text-[10px] font-black uppercase text-slate-500 border-b ${
              isDarkMode ? "bg-slate-800/30 border-slate-800" : "bg-slate-50 border-slate-100"
            }`}>
              <tr>
                <th className="px-6 py-5">Track ID</th>
                <th className="px-6 py-5">Customer</th>
                <th className="px-6 py-5">Total</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/10">
              {filteredOrders.map((order) => (
                <tr key={order.orderId} className="hover:bg-amber-500/5 transition-colors group">
                  <td className="px-6 py-6">
                    <p className="font-black text-amber-500 italic uppercase leading-none">{order.orderId}</p>
                    <p className="text-[8px] opacity-40 mt-1 font-mono">{new Date(order.date).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-6 font-bold uppercase text-xs truncate max-w-[150px]">
                    {order.customer?.fullName || "Guest User"}
                  </td>
                  <td className="px-6 py-6 font-black text-lg italic tracking-tighter text-amber-500">
                    ${order.total}
                  </td>
                  <td className="px-6 py-6">
                    <select 
                      value={order.status || "Pending"}
                      onChange={(e) => updateStatus(order.orderId, e.target.value)}
                      className={`text-[10px] font-black uppercase p-2 rounded-lg outline-none border cursor-pointer ${
                        isDarkMode ? "bg-slate-900 border-slate-800 text-amber-500" : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Verified">Verified</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => navigate(`/ordertracking/${order.orderId}`)}
                        className="p-3 bg-amber-500/10 text-amber-500 rounded-xl hover:bg-amber-500 hover:text-white transition-all"
                        title="View Details"
                      >
                        <FaChevronRight size={10} />
                      </button>
                      <button 
                        onClick={() => deleteOrder(order.orderId)}
                        className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                        title="Delete Order"
                      >
                        <FaTrash size={10} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="py-20 text-center">
            <FaExclamationTriangle className="mx-auto text-slate-700 mb-4" size={30} />
            <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">No matching records found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;