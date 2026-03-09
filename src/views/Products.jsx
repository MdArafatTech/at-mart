import React, { useState, useEffect, useMemo } from "react";
import { db } from "../firebase/Firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaLayerGroup,
  FaHome,
  FaPercentage,
  FaBoxOpen,
  FaGlobe,
  FaSearch,
  FaTimes,
  FaDatabase,
  FaExclamationTriangle,
  FaChartBar,
  FaCalendarAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Products = ({ isDarkMode }) => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Added 'arrivalDate' and 'status' to initial state
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: "Processors",
    tech: "",
    image: "",
    discount: 0,
    quantity: 1,
    targetPage: "Homepage",
    isOnSale: false,
    status: "In Stock",
  });

  const handlePricingChange = (field, value) => {
    const numVal = Number(value);
    let newFormData = { ...formData, [field]: value };
    const { price, originalPrice, discount } = newFormData;

    if (field === "discount") {
      if (originalPrice && numVal > 0) {
        newFormData.price = Math.round(
          Number(originalPrice) * (1 - numVal / 100),
        );
      }
    } else if (field === "price") {
      if (originalPrice && Number(originalPrice) > numVal) {
        newFormData.discount = Math.round(
          ((Number(originalPrice) - numVal) / Number(originalPrice)) * 100,
        );
      }
    } else if (field === "originalPrice") {
      if (discount > 0) {
        newFormData.price = Math.round(numVal * (1 - Number(discount) / 100));
      } else if (price && numVal > Number(price)) {
        newFormData.discount = Math.round(
          ((numVal - Number(price)) / numVal) * 100,
        );
      }
    }
    setFormData(newFormData);
  };

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category || "").toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [products, searchTerm]);

  const stats = useMemo(() => {
    const totalValue = products.reduce(
      (sum, p) => sum + (Number(p.price) * Number(p.quantity) || 0),
      0,
    );
    const lowStock = products.filter((p) => Number(p.quantity) <= 5).length;
    return { totalValue, lowStock };
  }, [products]);

  // --- MODIFIED SUBMIT LOGIC ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...formData,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice) || Number(formData.price),
      discount: Number(formData.discount),
      quantity: Number(formData.quantity),
      isOnSale: formData.targetPage === "Sale" || Number(formData.discount) > 0,
      updatedAt: serverTimestamp(),

      // FIX: Ensure every product has an arrivalDate for the "New Arrivals" query
      // If it's a "New Arrival" target, we definitely need the timestamp
      arrivalDate: formData.arrivalDate
        ? new Date(formData.arrivalDate)
        : serverTimestamp(),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "products", editingId), data);
      } else {
        await addDoc(collection(db, "products"), {
          ...data,
          createdAt: serverTimestamp(),
        });
      }
      closeModal();
    } catch (err) {
      alert("Neural Sync Failed: " + err.message);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setFormData({ ...product });
      setEditingId(product.id);
    } else {
      setFormData({
        name: "",
        price: "",
        originalPrice: "",
        category: "Processors",
        tech: "",
        image: "",
        discount: 0,
        quantity: 1,
        targetPage: "Homepage",
        isOnSale: false,
        status: "In Stock",
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };













  const executeDelete = async () => {
    if (deleteConfirm) {
      await deleteDoc(doc(db, "products", deleteConfirm));
      setDeleteConfirm(null);
    }
  };










  

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-black animate-pulse opacity-40">
        SYNCING NEURAL CORE...
      </div>
    );

  return (
    <div
      className={`min-h-screen p-4 md:p-10 space-y-10 ${isDarkMode ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900"}`}
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase flex items-center gap-4">
            <FaDatabase className="text-amber-500" /> MATRIX CONTROL
          </h1>
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-slate-500 mt-2 ml-1">
            v5.0 Global Asset Management
          </p>
        </div>

        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
          <StatBox
            label="Value"
            value={`$${stats.totalValue.toLocaleString()}`}
            color="text-emerald-500"
            isDarkMode={isDarkMode}
          />
          <StatBox
            label="Alerts"
            value={stats.lowStock}
            color="text-rose-500"
            isDarkMode={isDarkMode}
          />
          <button
            onClick={() => openModal()}
            className="flex-1 lg:flex-none px-10 py-6 bg-gradient-to-r from-amber-500 to-orange-600 text-black cursor-pointer font-black rounded-3xl text-xs uppercase tracking-widest hover:scale-[1.03] transition-all"
          >
            ADD PRODUCT
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div
        className={`p-4 rounded-[2rem] border ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white border-slate-200"}`}
      >
        <div className="relative flex items-center">
          <FaSearch className="absolute left-6 text-slate-500" />
          <input
            type="text"
            placeholder="FILTER BY ASSET NAME OR SECTOR..."
            className="w-full pl-16 pr-6 py-5 bg-transparent font-bold outline-none uppercase text-sm tracking-widest"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ASSET TABLE */}
      <div
        className={`rounded-[3rem] border overflow-hidden ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white border-slate-200"}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800/10">
                <th className="p-8">Asset Specification</th>
                <th className="p-8">Target Page</th>
                <th className="p-8">Pricing</th>
                <th className="p-8">Units</th>
                <th className="p-8 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/5">
              {filteredProducts.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-amber-500/5 transition-all"
                >
                  <td className="p-8">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-slate-800 overflow-hidden border border-slate-700 flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center opacity-20 text-2xl">
                            📦
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-black uppercase text-lg leading-tight">
                          {item.name}
                        </p>
                        <p className="text-[10px] font-bold text-amber-500 uppercase mt-1">
                          {item.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center gap-3">
                      <TargetIcon target={item.targetPage} />
                      <span className="text-xs font-black uppercase">
                        {item.targetPage}
                      </span>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-2xl tracking-tighter text-amber-500">
                          ${item.price}
                        </span>
                        {item.discount > 0 && (
                          <span className="text-[10px] bg-rose-500/10 text-rose-500 px-2 py-1 rounded-lg font-black">
                            -{item.discount}%
                          </span>
                        )}
                      </div>
                      {item.discount > 0 && (
                        <span className="text-[10px] line-through opacity-30 font-bold">
                          ${item.originalPrice}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-8">
                    <span
                      className={`px-4 py-2 rounded-xl text-[10px] font-black ${item.quantity <= 5 ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"}`}
                    >
                      {item.quantity} UNITS
                    </span>
                  </td>
                  <td className="p-8">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => openModal(item)}
                        className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl hover:bg-blue-500 hover:text-white transition-all"
                      >
                        <FaEdit />
                      </button>


                      <button
                        onClick={() => setDeleteConfirm(item.id)}
                        className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"
                      >
                        <FaTrash />
                      </button>


                      
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DEPLOYMENT MODAL */}
     <AnimatePresence>
  {isModalOpen && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-xl">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        /* RESPONSIVE FIX: Added 'grid-cols-1' for mobile, 'lg:grid-cols-2' for desktop */
        className={`w-full max-w-5xl p-6 md:p-12 rounded-[2rem] md:rounded-[4rem] border max-h-[90vh] overflow-y-auto no-scrollbar ${
          isDarkMode ? "bg-[#0d1117] border-slate-800 text-white" : "bg-white shadow-2xl"
        }`}
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Header remains full width */}
          <div className="lg:col-span-2 flex justify-between items-center mb-2 md:mb-4">
            <h3 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter">
              System Configuration
            </h3>
            <FaTimes
              className="text-2xl md:text-3xl cursor-pointer opacity-50 hover:opacity-100"
              onClick={closeModal}
            />
          </div>

          {/* Left Column */}
          <div className="space-y-6">
            <InputField
              label="Asset Visual URL"
              value={formData.image}
              onChange={(v) => setFormData({ ...formData, image: v })}
              placeholder="https://..."
            />
            <InputField
              label="Asset Name"
              value={formData.name}
              onChange={(v) => setFormData({ ...formData, name: v })}
            />

            <div className="flex flex-col">
              <label className="text-[10px] font-black uppercase text-slate-500 mb-3 ml-2 tracking-widest">
                Sector Selection
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-500/5 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-800/20 font-bold outline-none focus:border-amber-500 transition-all text-sm"
              >
                <optgroup label="Core Components" className="bg-[#0d1117] text-slate-400">
                  <option>Processors</option>
                  <option>Graphics Cards</option>
                  <option>Motherboards</option>
                  <option>Memory (RAM)</option>
                  <option>Storage (SSD/HDD)</option>
                </optgroup>
                <optgroup label="Systems & Gear" className="bg-[#0d1117] text-slate-400">
                  <option>Laptops</option>
                  <option>Monitors</option>
                  <option>Audio Gear</option>
                  <option>Networking</option>
                </optgroup>
              </select>
            </div>

            <InputField
              label="Tech Summary"
              value={formData.tech}
              onChange={(v) => setFormData({ ...formData, tech: v })}
              placeholder="e.g. 16GB VRAM"
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="p-4 md:p-6 bg-rose-500/5 border border-rose-500/10 rounded-[1.5rem] md:rounded-[2.5rem] space-y-4">
              <label className="text-[10px] font-black uppercase text-rose-500 tracking-widest ml-2">
                Pricing Matrix (Reactive)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Original ($)"
                  type="number"
                  value={formData.originalPrice}
                  onChange={(v) => handlePricingChange("originalPrice", v)}
                />
                <InputField
                  label="Discount (%)"
                  type="number"
                  value={formData.discount}
                  onChange={(v) => handlePricingChange("discount", v)}
                />
              </div>
              <InputField
                label="Final Sale Price ($)"
                type="number"
                value={formData.price}
                onChange={(v) => handlePricingChange("price", v)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Stock"
                type="number"
                value={formData.quantity}
                onChange={(v) => setFormData({ ...formData, quantity: v })}
              />
              <InputField
                label="Status"
                value={formData.status}
                onChange={(v) => setFormData({ ...formData, status: v })}
                placeholder="In Stock"
              />
            </div>

            <div className="p-4 md:p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[1.5rem] md:rounded-[2.5rem] space-y-4">
              <label className="text-[10px] font-black uppercase text-emerald-500 tracking-widest ml-2 flex items-center gap-2">
                <FaCalendarAlt /> Arrival Logic
              </label>
              <input
                type="date"
                value={formData.arrivalDate || ""}
                onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
                className="w-full bg-slate-500/5 p-4 rounded-2xl border border-slate-800/20 font-mono text-xs outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-black uppercase text-slate-500 mb-4 ml-2">
                Deployment Target
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["Homepage", "Category", "New Arrivals", "Sale"].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setFormData({ ...formData, targetPage: loc })}
                    className={`py-3 md:py-4 cursor-pointer rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase border transition-all ${
                      formData.targetPage === loc
                        ? "bg-amber-500 border-amber-500 text-black"
                        : "bg-transparent border-slate-800 text-slate-500 hover:border-amber-500/50"
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="lg:col-span-2 py-6 md:py-8 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-black uppercase cursor-pointer rounded-[1.5rem] md:rounded-[2.5rem] hover:scale-[1.01] transition-all text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em]"
          >
            Deploy Product 
          </button>
        </form>
      </motion.div>
    </div>
  )}
</AnimatePresence>

      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-[#0d1117] border border-rose-500/30 p-12 rounded-[3rem] text-center max-w-sm"
            >
              <FaExclamationTriangle className="text-6xl text-rose-500 mx-auto mb-6" />
              <h3 className="text-2xl font-black mb-4">PURGE DATA?</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-4 cursor-pointer rounded-2xl border border-slate-700 font-black text-xs"
                >
                  ABORT
                </button>
                <button
                  onClick={executeDelete}
                  className="flex-1 py-4 cursor-pointer bg-rose-500 text-black rounded-2xl font-black text-xs"
                >
                  PURGE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


    </div>
  );
};

const StatBox = ({ label, value, color, isDarkMode }) => (
  <div
    className={`px-8 py-5 rounded-[2rem] border min-w-[140px] text-center ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white border-slate-200 shadow-xl"}`}
  >
    <p className={`text-2xl font-black tracking-tighter ${color}`}>{value}</p>
    <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mt-1">
      {label}
    </p>
  </div>
);

const TargetIcon = ({ target }) => {
  switch (target) {
    case "Homepage":
      return <FaHome className="text-blue-500" />;
    case "Category":
      return <FaLayerGroup className="text-amber-500" />;
    case "New Arrivals":
      return <FaBoxOpen className="text-emerald-500" />;
    case "Sale":
      return <FaPercentage className="text-rose-500" />;
    default:
      return <FaGlobe className="text-slate-500" />;
  }
};

const InputField = ({ label, type = "text", value, onChange, placeholder }) => (
  <div className="flex flex-col">
    <label className="text-[10px] font-black uppercase text-slate-500 mb-3 ml-2 tracking-widest">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-slate-500/5 p-5 rounded-3xl border border-slate-800/20 font-bold outline-none focus:border-amber-500 transition-all text-sm"
    />
  </div>
);

export default Products;
