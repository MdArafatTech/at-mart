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
  Timestamp, // <--- ADD THIS LINE
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

  try {
    // 1. DATE SYNC: Ensure arrivalDate is a valid Firestore Timestamp
    // If user didn't pick a date, use the current time (serverTimestamp)
    let arrivalDateValue;
    if (formData.arrivalDate) {
      arrivalDateValue = Timestamp.fromDate(new Date(formData.arrivalDate));
    } else {
      arrivalDateValue = serverTimestamp();
    }

    const data = {
      ...formData,
      // 2. DATA TYPE SANITIZATION
      price: Number(formData.price) || 0,
      originalPrice: Number(formData.originalPrice) || Number(formData.price),
      discount: Number(formData.discount) || 0,
      quantity: Number(formData.quantity) || 0,

      // 3. PAGE TARGETING LOGIC
      // Important: Use "NewArrivals" (no space) to match your NewArrivals.js query
      targetPage: formData.targetPage === "New Arrivals" ? "NewArrivals" : formData.targetPage,
      
      // 4. SALE STATUS (Strict Gatekeeping)
      // New Arrivals query usually has: where("isOnSale", "==", false)
      isOnSale: formData.targetPage === "Sale",

      updatedAt: serverTimestamp(),
      arrivalDate: arrivalDateValue,
    };

    if (editingId) {
      const productRef = doc(db, "products", editingId);
      await updateDoc(productRef, data);
    } else {
      await addDoc(collection(db, "products"), {
        ...data,
        createdAt: serverTimestamp(), // Only set on creation
      });
    }

    closeModal();
  } catch (err) {
    console.error("Neural Sync Error:", err);
    alert("Matrix Update Failed: " + err.message);
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
      className={`min-h-screen   space-y-7 ${isDarkMode ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900"}`}
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase flex items-center gap-4">
            <FaDatabase className="text-amber-500" />
            Product CONTROL
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

    {/* FULLY RESPONSIVE ASSET GRID */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
  {filteredProducts.map((item) => (
    <div
      key={item.id}
      className={`group relative rounded-[2rem] md:rounded-[2.5rem] border p-4 md:p-6 transition-all duration-300 hover:shadow-2xl ${
        isDarkMode 
          ? "bg-[#0d1117] border-slate-800" 
          : "bg-white border-slate-200"
      }`}
    >
      {/* RESPONSIVE BADGE */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
        <span
          className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[9px] md:text-[10px] font-black tracking-widest uppercase ${
            item.quantity <= 5 
              ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" 
              : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
          }`}
        >
          {item.quantity} UNITS
        </span>
      </div>

      {/* RESPONSIVE IMAGE CONTAINER */}
      <div className="relative w-full aspect-video md:h-56 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-slate-800 mb-4 md:mb-6">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-20 text-4xl">📦</div>
        )}
        
        {/* OVERLAY PILL - Scales for touch */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-full border border-white/10">
          <TargetIcon target={item.targetPage} className="text-[10px]" />
          <span className="text-[9px] font-bold uppercase tracking-tight">
            {item.targetPage}
          </span>
        </div>
      </div>

      {/* TEXT CONTENT - Responsive Typography */}
      <div className="space-y-3 md:space-y-4">
        <div>
          <p className="text-[9px] md:text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">
            {item.category}
          </p>
          <h3 className="font-black uppercase text-base md:text-xl leading-tight dark:text-white line-clamp-1">
            {item.name}
          </h3>
        </div>

        {/* PRICING & ACTIONS - Responsive Flex Wrap */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/10 dark:border-slate-800/50 pt-4">
          <div className="flex flex-col">
            {item.discount > 0 && (
              <span className="text-[10px] line-through opacity-40 font-bold dark:text-slate-400">
                ${item.originalPrice}
              </span>
            )}
            <div className="flex items-center gap-2">
              <span className="font-black text-xl md:text-2xl lg:text-3xl tracking-tighter text-amber-500">
                ${item.price}
              </span>
              {item.discount > 0 && (
                <span className="text-[8px] md:text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded font-black">
                  -{item.discount}%
                </span>
              )}
            </div>
          </div>

          {/* ICON BUTTONS - Larger tap targets for mobile */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => openModal(item)}
              className="p-3 md:p-4 bg-blue-500/10 text-blue-500 rounded-xl md:rounded-2xl hover:bg-blue-500 hover:text-white transition-all active:scale-90"
              aria-label="Edit"
            >
              <FaEdit size={16} />
            </button>
            <button
              onClick={() => setDeleteConfirm(item.id)}
              className="p-3 md:p-4 bg-rose-500/10 text-rose-500 rounded-xl md:rounded-2xl hover:bg-rose-500 hover:text-white transition-all active:scale-90"
              aria-label="Delete"
            >
              <FaTrash size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  ))}
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
                isDarkMode
                  ? "bg-[#0d1117] border-slate-800 text-white"
                  : "bg-white shadow-2xl"
              }`}
            >
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8"
              >
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
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full bg-slate-500/5 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-800/20 font-bold outline-none focus:border-amber-500 transition-all text-sm"
                    >
                      <optgroup
                        label="Core Components"
                        className="bg-[#0d1117] text-slate-400"
                      >
                        <option>Processors</option>
                        <option>Graphics Cards</option>
                        <option>Motherboards</option>
                        <option>Memory (RAM)</option>
                        <option>Storage (SSD/HDD)</option>
                      </optgroup>
                      <optgroup
                        label="Systems & Gear"
                        className="bg-[#0d1117] text-slate-400"
                      >
                        <option>Laptops</option>
                        <option>Monitors</option>
                        <option>Audio Gear</option>
                        <option>Mobile</option>
                        <option>Networking</option>
                        <option>Keyboard</option>
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
                        onChange={(v) =>
                          handlePricingChange("originalPrice", v)
                        }
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
                      onChange={(v) =>
                        setFormData({ ...formData, quantity: v })
                      }
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          arrivalDate: e.target.value,
                        })
                      }
                      className="w-full bg-slate-500/5 p-4 rounded-2xl border border-slate-800/20 font-mono text-xs outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[10px] font-black uppercase text-slate-500 mb-4 ml-2">
                      Deployment Target
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Homepage", "Category", "New Arrivals", "Sale"].map(
                        (loc) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, targetPage: loc })
                            }
                            className={`py-3 md:py-4 cursor-pointer rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase border transition-all ${
                              formData.targetPage === loc
                                ? "bg-amber-500 border-amber-500 text-black"
                                : "bg-transparent border-slate-800 text-slate-500 hover:border-amber-500/50"
                            }`}
                          >
                            {loc}
                          </button>
                        ),
                      )}
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
    case "NewArrivals":
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
