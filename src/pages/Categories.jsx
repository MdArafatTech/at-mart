import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { 
  FaMicrochip, FaLayerGroup, FaBoxOpen, FaTag, 
  FaArrowRight, FaArrowLeft, FaShoppingCart, FaCheckCircle, FaTimes, FaTrash 
} from "react-icons/fa";

// ──────────────────────────────────────────────────────────────
// CATEGORIES
// ──────────────────────────────────────────────────────────────
const CATEGORY_MAP = [
  { id: 1, name: "Processors", icon: "🧠", count: 24, desc: "High-performance silicon for gaming and rendering.", spec: "Up to 6.0GHz", offer: "10% OFF i9 Series" },
  { id: 2, name: "Graphics Cards", icon: "🎮", count: 18, desc: "Ray-tracing powerhouses for ultimate visual fidelity.", spec: "GDDR6X / GDDR7 Support", offer: "Free Game Bundle" },
  { id: 3, name: "Memory", icon: "📏", count: 15, desc: "DDR5 modules with ultra-low latency timing.", spec: "Up to 8000MT/s", offer: "Buy 2 Get 15% Off" },
  { id: 4, name: "Storage", icon: "💾", count: 20, desc: "PCIe Gen5 NVMe drives for near-instant loading.", spec: "14,500MB/s Read", offer: "Save $50 on 4TB" },
  { id: 5, name: "Motherboards", icon: "🔌", count: 16, desc: "Foundational circuits with robust power delivery.", spec: "Z790 / X670E / X870", offer: "Next-Day Install" },
  { id: 6, name: "Audio Gear", icon: "🎧", count: 22, desc: "Studio-grade acoustics and noise cancellation.", spec: "Hi-Res Certified", offer: "Free Stand Included" },
  { id: 7, name: "Peripherals", icon: "⌨️", count: 28, desc: "Precision inputs for competitive advantages.", spec: "8K Polling Rate", offer: "20% Off Bundles" },
  { id: 8, name: "Mobile Tech", icon: "📱", count: 25, desc: "Next-gen smartphones and foldable tablets.", spec: "OLED / AMOLED Displays", offer: "Trade-in Bonus" },
  { id: 9, name: "Power Units", icon: "⚡", count: 15, desc: "80+ Platinum efficiency for stable builds.", spec: "ATX 3.1 Ready", offer: "10-Year Warranty" },
  { id: 10, name: "Cooling", icon: "🌊", count: 19, desc: "Liquid and air solutions for thermal mastery.", spec: "360mm / 420mm AIO", offer: "Free Paste Kit" },
];

// ──────────────────────────────────────────────────────────────
// ALL PRODUCTS — FULLY POPULATED (March 2026 realistic prices)
// ──────────────────────────────────────────────────────────────
const ALL_PRODUCTS = [
  // Processors (24 items)
  { id: 101, name: "Intel Core i9-14900K", price: 449, cat: "Processors", img: "🧠", tech: "6.0GHz / 24 Cores" },
  { id: 102, name: "AMD Ryzen 9 9950X", price: 519, cat: "Processors", img: "🚀", tech: "5.7GHz / 16 Cores" },
  { id: 103, name: "Intel Core i7-14700K", price: 389, cat: "Processors", img: "💎", tech: "5.6GHz / 20 Cores" },
  { id: 104, name: "AMD Ryzen 9 7950X3D", price: 629, cat: "Processors", img: "⚡", tech: "144MB V-Cache" },
  { id: 105, name: "Intel Core Ultra 9 285K", price: 589, cat: "Processors", img: "🌟", tech: "NPU AI / 24 Cores" },
  { id: 106, name: "AMD Ryzen 7 9800X3D", price: 479, cat: "Processors", img: "🔥", tech: "8 Cores / 3D V-Cache" },
  { id: 107, name: "Intel Core i5-14600K", price: 319, cat: "Processors", img: "💨", tech: "14 Cores / 5.3GHz" },
  { id: 108, name: "AMD Ryzen 7 7700X", price: 299, cat: "Processors", img: "🌈", tech: "8 Cores / 5.4GHz" },
  { id: 109, name: "AMD Ryzen 5 9600X", price: 229, cat: "Processors", img: "📡", tech: "6 Cores / 5.4GHz" },
  { id: 110, name: "Intel Core i9-13900K", price: 409, cat: "Processors", img: "🧬", tech: "24 Cores" },
  { id: 111, name: "AMD Ryzen 9 7900X", price: 419, cat: "Processors", img: "⚙️", tech: "12 Cores" },
  { id: 112, name: "Intel Core i5-13600K", price: 279, cat: "Processors", img: "🎯", tech: "14 Cores" },
  { id: 113, name: "AMD Ryzen 7 9700X", price: 359, cat: "Processors", img: "🔧", tech: "8 Cores Zen 5" },
  { id: 114, name: "Intel Core Ultra 7 265K", price: 399, cat: "Processors", img: "🌌", tech: "20 Cores Arrow Lake" },
  { id: 115, name: "AMD Ryzen 5 7600", price: 219, cat: "Processors", img: "💥", tech: "6 Cores" },
  { id: 116, name: "Intel Core i3-14100F", price: 129, cat: "Processors", img: "📍", tech: "4 Cores" },
  { id: 117, name: "AMD Ryzen 9 7950X", price: 549, cat: "Processors", img: "🌀", tech: "16 Cores" },
  { id: 118, name: "Intel Core i7-13700K", price: 349, cat: "Processors", img: "🔋", tech: "16 Cores" },
  { id: 119, name: "AMD Ryzen 7 5700X", price: 189, cat: "Processors", img: "📼", tech: "8 Cores" },
  { id: 120, name: "Intel Core i9-12900K", price: 329, cat: "Processors", img: "🏎️", tech: "16 Cores" },
  { id: 121, name: "AMD Ryzen 5 7500F", price: 179, cat: "Processors", img: "🌠", tech: "6 Cores" },
  { id: 122, name: "Intel Core Ultra 5 245K", price: 309, cat: "Processors", img: "🧪", tech: "14 Cores" },
  { id: 123, name: "AMD Ryzen 9 5900X", price: 269, cat: "Processors", img: "🛡️", tech: "12 Cores" },
  { id: 124, name: "Intel Core i5-12400F", price: 159, cat: "Processors", img: "🚀", tech: "6 Cores" },

  // Graphics Cards (18 items)
  { id: 201, name: "NVIDIA RTX 5090", price: 1999, cat: "Graphics Cards", img: "🎮", tech: "32GB GDDR7" },
  { id: 202, name: "AMD Radeon RX 9070 XT", price: 769, cat: "Graphics Cards", img: "🔥", tech: "16GB GDDR6" },
  { id: 203, name: "NVIDIA RTX 5080", price: 1199, cat: "Graphics Cards", img: "🌌", tech: "16GB GDDR7" },
  { id: 204, name: "AMD Radeon RX 9070", price: 629, cat: "Graphics Cards", img: "💥", tech: "12GB" },
  { id: 205, name: "NVIDIA RTX 5070 Ti", price: 799, cat: "Graphics Cards", img: "🚀", tech: "12GB GDDR7" },
  { id: 206, name: "NVIDIA RTX 4070 Ti Super", price: 749, cat: "Graphics Cards", img: "🖥️", tech: "16GB GDDR6X" },
  { id: 207, name: "AMD Radeon RX 7900 XTX", price: 899, cat: "Graphics Cards", img: "⚡", tech: "24GB" },
  { id: 208, name: "NVIDIA RTX 4080 Super", price: 999, cat: "Graphics Cards", img: "🌈", tech: "16GB" },
  { id: 209, name: "AMD Radeon RX 7800 XT", price: 499, cat: "Graphics Cards", img: "🔋", tech: "16GB" },
  { id: 210, name: "NVIDIA RTX 5060 Ti", price: 449, cat: "Graphics Cards", img: "📡", tech: "8GB" },
  { id: 211, name: "AMD Radeon RX 7600", price: 269, cat: "Graphics Cards", img: "🎯", tech: "8GB" },
  { id: 212, name: "NVIDIA RTX 4090", price: 1599, cat: "Graphics Cards", img: "🌀", tech: "24GB GDDR6X" },
  { id: 213, name: "Intel Arc B580", price: 289, cat: "Graphics Cards", img: "🧪", tech: "12GB" },
  { id: 214, name: "NVIDIA RTX 5070", price: 599, cat: "Graphics Cards", img: "🏎️", tech: "12GB" },
  { id: 215, name: "AMD Radeon RX 9060 XT", price: 469, cat: "Graphics Cards", img: "🌠", tech: "16GB" },
  { id: 216, name: "NVIDIA RTX 4060 Ti", price: 399, cat: "Graphics Cards", img: "🛡️", tech: "8GB" },
  { id: 217, name: "AMD Radeon RX 6700 XT", price: 329, cat: "Graphics Cards", img: "📼", tech: "12GB" },
  { id: 218, name: "NVIDIA RTX 3050", price: 219, cat: "Graphics Cards", img: "🔧", tech: "8GB" },

  // Memory (15 items)
  { id: 301, name: "G.Skill Trident Z5 Neo RGB 64GB", price: 289, cat: "Memory", img: "📏", tech: "DDR5-6000 CL30" },
  { id: 302, name: "Corsair Vengeance RGB 96GB DDR5", price: 429, cat: "Memory", img: "💎", tech: "6400MT/s" },
  { id: 303, name: "TeamGroup T-Force Delta 32GB", price: 129, cat: "Memory", img: "🌈", tech: "DDR5-7200" },
  { id: 304, name: "Kingston Fury Beast 128GB", price: 529, cat: "Memory", img: "⚡", tech: "6000MT/s" },
  { id: 305, name: "Crucial Pro 32GB DDR5", price: 119, cat: "Memory", img: "💨", tech: "5600MT/s" },
  { id: 306, name: "G.Skill Ripjaws 64GB DDR5", price: 249, cat: "Memory", img: "🔥", tech: "8000MT/s" },
  { id: 307, name: "Corsair Dominator Titanium 48GB", price: 319, cat: "Memory", img: "🌟", tech: "7200MT/s" },
  { id: 308, name: "TeamGroup 96GB DDR5 EXPO", price: 399, cat: "Memory", img: "🚀", tech: "6400MT/s" },
  { id: 309, name: "Kingston Fury Renegade 32GB", price: 159, cat: "Memory", img: "🎯", tech: "7800MT/s" },
  { id: 310, name: "Crucial 192GB DDR5 Kit", price: 699, cat: "Memory", img: "📡", tech: "5200MT/s" },
  { id: 311, name: "G.Skill Trident Z5 32GB", price: 139, cat: "Memory", img: "🌀", tech: "6000MT/s" },
  { id: 312, name: "Corsair Vengeance 64GB", price: 259, cat: "Memory", img: "🌌", tech: "6600MT/s" },
  { id: 313, name: "TeamGroup Vulcan 48GB", price: 179, cat: "Memory", img: "💥", tech: "7000MT/s" },
  { id: 314, name: "Kingston Fury 16GB DDR5", price: 79, cat: "Memory", img: "📍", tech: "5600MT/s" },
  { id: 315, name: "G.Skill 128GB DDR5 RGB", price: 579, cat: "Memory", img: "🏎️", tech: "6400MT/s" },

  // Storage (20 items)
  { id: 401, name: "Crucial T705 4TB PCIe Gen5", price: 599, cat: "Storage", img: "💾", tech: "14,500MB/s" },
  { id: 402, name: "WD Black SN850X 8TB", price: 899, cat: "Storage", img: "🔥", tech: "12,000MB/s" },
  { id: 403, name: "Samsung 990 EVO Plus 2TB", price: 199, cat: "Storage", img: "⚡", tech: "Gen4 / Heatsink" },
  { id: 404, name: "Seagate FireCuda 530 4TB", price: 449, cat: "Storage", img: "🌊", tech: "7300MB/s" },
  { id: 405, name: "Samsung 990 PRO 4TB", price: 329, cat: "Storage", img: "🌟", tech: "7450MB/s" },
  { id: 406, name: "WD Black SN770 2TB", price: 149, cat: "Storage", img: "🚀", tech: "5150MB/s" },
  { id: 407, name: "Crucial T500 2TB", price: 249, cat: "Storage", img: "💨", tech: "7300MB/s" },
  { id: 408, name: "Sabrent Rocket 5 4TB", price: 549, cat: "Storage", img: "🌌", tech: "14,000MB/s" },
  { id: 409, name: "Samsung 980 PRO 1TB", price: 129, cat: "Storage", img: "🎯", tech: "7000MB/s" },
  { id: 410, name: "WD Black SN850X 4TB", price: 399, cat: "Storage", img: "🌀", tech: "7300MB/s" },
  { id: 411, name: "Seagate Barracuda 8TB HDD", price: 179, cat: "Storage", img: "📼", tech: "7200RPM" },
  { id: 412, name: "Lexar NM790 2TB", price: 169, cat: "Storage", img: "🛡️", tech: "7400MB/s" },
  { id: 413, name: "Kingston KC3000 4TB", price: 319, cat: "Storage", img: "🏎️", tech: "7000MB/s" },
  { id: 414, name: "TeamGroup MP44 8TB", price: 699, cat: "Storage", img: "🔧", tech: "7400MB/s" },
  { id: 415, name: "Samsung 870 EVO 4TB SATA", price: 289, cat: "Storage", img: "📍", tech: "560MB/s" },
  { id: 416, name: "WD Blue SN580 1TB", price: 89, cat: "Storage", img: "🌠", tech: "4150MB/s" },
  { id: 417, name: "Crucial MX500 2TB", price: 149, cat: "Storage", img: "💥", tech: "560MB/s" },
  { id: 418, name: "Seagate IronWolf 12TB NAS", price: 349, cat: "Storage", img: "📡", tech: "7200RPM" },
  { id: 419, name: "Samsung 990 PRO 8TB", price: 799, cat: "Storage", img: "⚙️", tech: "7450MB/s" },
  { id: 420, name: "WD Black SN850X 1TB", price: 119, cat: "Storage", img: "🧪", tech: "7300MB/s" },

  // Motherboards (16 items)
  { id: 501, name: "MSI MPG Z790 Edge WiFi", price: 399, cat: "Motherboards", img: "🔌", tech: "DDR5-7800 / WiFi 7" },
  { id: 502, name: "Gigabyte X870 Aorus Elite", price: 349, cat: "Motherboards", img: "🌐", tech: "AM5 / PCIe 5.0" },
  { id: 503, name: "ASRock X670E Taichi", price: 499, cat: "Motherboards", img: "💎", tech: "Dual PCIe5 M.2" },
  { id: 504, name: "ASUS ROG Strix B650-E", price: 279, cat: "Motherboards", img: "⚡", tech: "WiFi 6E" },
  { id: 505, name: "MSI MAG B850 Tomahawk", price: 229, cat: "Motherboards", img: "🔥", tech: "DDR5" },
  { id: 506, name: "Gigabyte Z890 Aorus Master", price: 599, cat: "Motherboards", img: "🌟", tech: "Arrow Lake" },
  { id: 507, name: "ASUS Prime B650-Plus", price: 189, cat: "Motherboards", img: "🚀", tech: "AM5" },
  { id: 508, name: "MSI MPG Z890 Carbon", price: 449, cat: "Motherboards", img: "🌈", tech: "WiFi 7" },
  { id: 509, name: "ASRock B650M PG Riptide", price: 159, cat: "Motherboards", img: "🎯", tech: "Micro ATX" },
  { id: 510, name: "Gigabyte B650 Gaming X AX", price: 219, cat: "Motherboards", img: "🌀", tech: "WiFi 6E" },
  { id: 511, name: "ASUS TUF Gaming Z790-Plus", price: 299, cat: "Motherboards", img: "🛡️", tech: "DDR5" },
  { id: 512, name: "MSI Pro B650-P WiFi", price: 179, cat: "Motherboards", img: "🏎️", tech: "AM5" },
  { id: 513, name: "Gigabyte Z790 Aorus Elite AX", price: 329, cat: "Motherboards", img: "📼", tech: "WiFi 6E" },
  { id: 514, name: "ASRock Z890 Taichi", price: 549, cat: "Motherboards", img: "📍", tech: "Premium VRM" },
  { id: 515, name: "ASUS ROG Crosshair X870E Hero", price: 699, cat: "Motherboards", img: "🌠", tech: "Flagship AM5" },
  { id: 516, name: "MSI MAG B760 Tomahawk", price: 199, cat: "Motherboards", img: "🔧", tech: "LGA 1700" },

  // Audio Gear (22 items)
  { id: 601, name: "Beyerdynamic MMX 330 Pro", price: 329, cat: "Audio Gear", img: "🎧", tech: "Open-back / 45mm" },
  { id: 602, name: "SteelSeries Arctis Nova Pro", price: 349, cat: "Audio Gear", img: "🔊", tech: "ANC / Hot-Swap" },
  { id: 603, name: "HyperX Cloud Alpha Wireless", price: 199, cat: "Audio Gear", img: "📡", tech: "300hr Battery" },
  { id: 604, name: "Sony WH-1000XM5", price: 399, cat: "Audio Gear", img: "🌟", tech: "Noise Cancelling" },
  { id: 605, name: "Audio-Technica ATH-M50x", price: 149, cat: "Audio Gear", img: "🎤", tech: "Studio Monitor" },
  { id: 606, name: "Razer BlackShark V2 Pro", price: 179, cat: "Audio Gear", img: "⚡", tech: "THX Spatial" },
  { id: 607, name: "Logitech G Pro X 2", price: 249, cat: "Audio Gear", img: "🌈", tech: "Lightspeed Wireless" },
  { id: 608, name: "Bose QuietComfort Ultra", price: 429, cat: "Audio Gear", img: "🌀", tech: "ANC" },
  { id: 609, name: "Sennheiser HD 660S2", price: 599, cat: "Audio Gear", img: "💥", tech: "Open-back HiFi" },
  { id: 610, name: "JBL Quantum 910 Wireless", price: 299, cat: "Audio Gear", img: "🎯", tech: "Spatial Sound" },
  { id: 611, name: "Astro A50 Gen 5", price: 279, cat: "Audio Gear", img: "🏎️", tech: "PlayStation/PC" },
  { id: 612, name: "EPOS H6Pro Open", price: 219, cat: "Audio Gear", img: "📼", tech: "Open Acoustic" },
  { id: 613, name: "Shure AONIC 50 Gen 2", price: 349, cat: "Audio Gear", img: "🛡️", tech: "Studio ANC" },
  { id: 614, name: "Corsair HS80 RGB Wireless", price: 159, cat: "Audio Gear", img: "🌠", tech: "Low Latency" },
  { id: 615, name: "Razer Kraken V4 Pro", price: 229, cat: "Audio Gear", img: "🔧", tech: "Haptic Feedback" },
  { id: 616, name: "Beyerdynamic DT 990 Pro", price: 179, cat: "Audio Gear", img: "📍", tech: "250 Ohm" },
  { id: 617, name: "SteelSeries Nova 7", price: 179, cat: "Audio Gear", img: "🧪", tech: "Multi-Platform" },
  { id: 618, name: "Logitech Zone Vibe 125", price: 129, cat: "Audio Gear", img: "🌌", tech: "Bluetooth ANC" },
  { id: 619, name: "HyperX Cloud II", price: 99, cat: "Audio Gear", img: "💨", tech: "7.1 Surround" },
  { id: 620, name: "Audio-Technica ATH-G1", price: 219, cat: "Audio Gear", img: "🌀", tech: "Gaming" },
  { id: 621, name: "Sennheiser GSP 670", price: 299, cat: "Audio Gear", img: "⚙️", tech: "Wireless" },
  { id: 622, name: "Razer Barracuda X", price: 99, cat: "Audio Gear", img: "🏎️", tech: "Multi-Device" },

  // Peripherals (28 items)
  { id: 701, name: "Logitech G Pro X Superlight 2", price: 159, cat: "Peripherals", img: "🖱️", tech: "60g / 8000Hz" },
  { id: 702, name: "Razer Huntsman V3 Pro", price: 249, cat: "Peripherals", img: "⌨️", tech: "8KHz Optical" },
  { id: 703, name: "SteelSeries Apex Pro Mini", price: 229, cat: "Peripherals", img: "🔥", tech: "OmniPoint 2.0" },
  { id: 704, name: "Logitech G502 X Plus", price: 139, cat: "Peripherals", img: "🌟", tech: "Lightspeed" },
  { id: 705, name: "Razer Viper V3 Pro", price: 149, cat: "Peripherals", img: "⚡", tech: "54g Wireless" },
  { id: 706, name: "Corsair K100 RGB", price: 199, cat: "Peripherals", img: "🌈", tech: "Optical-Mechanical" },
  { id: 707, name: "Keychron Q1 Pro", price: 179, cat: "Peripherals", img: "🎯", tech: "Gasket Mount" },
  { id: 708, name: "Logitech MX Master 3S", price: 99, cat: "Peripherals", img: "🌀", tech: "8000 DPI" },
  { id: 709, name: "Razer DeathAdder V3 Pro", price: 129, cat: "Peripherals", img: "💥", tech: "64g" },
  { id: 710, name: "SteelSeries Aerox 9", price: 109, cat: "Peripherals", img: "🏎️", tech: "18K Sensor" },
  { id: 711, name: "ASUS ROG Harpe Ace", price: 169, cat: "Peripherals", img: "📼", tech: "54g" },
  { id: 712, name: "Wooting 80HE", price: 189, cat: "Peripherals", img: "🛡️", tech: "Hall Effect" },
  { id: 713, name: "Corsair Dark Core RGB Pro", price: 89, cat: "Peripherals", img: "🌠", tech: "Wireless" },
  { id: 714, name: "Razer Basilisk V3 Pro", price: 159, cat: "Peripherals", img: "🔧", tech: "Focus+ Sensor" },
  { id: 715, name: "Logitech G Pro X TKL", price: 129, cat: "Peripherals", img: "📍", tech: "Mechanical" },
  { id: 716, name: "Keychron K2", price: 79, cat: "Peripherals", img: "🧪", tech: "75% Wireless" },
  { id: 717, name: "Razer Ornata V3", price: 69, cat: "Peripherals", img: "🌌", tech: "Mecha-Membrane" },
  { id: 718, name: "SteelSeries QcK Heavy XXL", price: 49, cat: "Peripherals", img: "💨", tech: "Mousepad" },
  { id: 719, name: "Corsair MM700 RGB", price: 59, cat: "Peripherals", img: "⚙️", tech: "Extended Pad" },
  { id: 720, name: "Logitech G915 TKL", price: 229, cat: "Peripherals", img: "🏎️", tech: "Low Profile" },
  { id: 721, name: "Razer BlackWidow V4 Pro", price: 279, cat: "Peripherals", img: "🌀", tech: "Mechanical" },
  { id: 722, name: "ASUS ROG Strix Scope II", price: 149, cat: "Peripherals", img: "🌠", tech: "RX Switches" },
  { id: 723, name: "HyperX Alloy Origins Core", price: 89, cat: "Peripherals", img: "🔥", tech: "TKL" },
  { id: 724, name: "Logitech G213 Prodigy", price: 59, cat: "Peripherals", img: "💥", tech: "RGB" },
  { id: 725, name: "Razer Cynosa V2", price: 49, cat: "Peripherals", img: "📡", tech: "Membrane" },
  { id: 726, name: "SteelSeries Apex 9 Mini", price: 169, cat: "Peripherals", img: "🎯", tech: "Optical" },
  { id: 727, name: "Corsair K65 Plus", price: 119, cat: "Peripherals", img: "🌈", tech: "60%" },
  { id: 728, name: "Logitech G513 Carbon", price: 139, cat: "Peripherals", img: "🛡️", tech: "Romer-G" },

  // Mobile Tech (25 items)
  { id: 801, name: "Huawei Mate XT Ultimate", price: 2199, cat: "Mobile Tech", img: "📱", tech: "Tri-Fold 10.2\" OLED" },
  { id: 802, name: "Google Pixel Fold 2", price: 1799, cat: "Mobile Tech", img: "📲", tech: "Tensor G4 / AI" },
  { id: 803, name: "Samsung Galaxy Z Fold7", price: 1899, cat: "Mobile Tech", img: "🌟", tech: "7.6\" Dynamic AMOLED" },
  { id: 804, name: "Apple iPhone 17 Pro Max", price: 1299, cat: "Mobile Tech", img: "🍎", tech: "A19 Pro" },
  { id: 805, name: "Samsung Galaxy S26 Ultra", price: 1299, cat: "Mobile Tech", img: "🔥", tech: "200MP Camera" },
  { id: 806, name: "OnePlus 13", price: 899, cat: "Mobile Tech", img: "⚡", tech: "Snapdragon 8 Gen 4" },
  { id: 807, name: "Xiaomi 15 Ultra", price: 1099, cat: "Mobile Tech", img: "🌌", tech: "Leica Quad" },
  { id: 808, name: "Samsung Galaxy Z Flip7", price: 1099, cat: "Mobile Tech", img: "🌀", tech: "Foldable" },
  { id: 809, name: "Sony Xperia 1 VII", price: 1399, cat: "Mobile Tech", img: "🎥", tech: "4K 120Hz" },
  { id: 810, name: "Google Pixel 10 Pro", price: 1099, cat: "Mobile Tech", img: "📍", tech: "Tensor G5" },
  { id: 811, name: "Nothing Phone (3)", price: 699, cat: "Mobile Tech", img: "🌈", tech: "Glyph Interface" },
  { id: 812, name: "Motorola Razr 60 Ultra", price: 1199, cat: "Mobile Tech", img: "🏎️", tech: "Snapdragon 8s Gen 4" },
  { id: 813, name: "iPhone 17", price: 799, cat: "Mobile Tech", img: "🍎", tech: "A19" },
  { id: 814, name: "Samsung Galaxy S26", price: 899, cat: "Mobile Tech", img: "💥", tech: "Exynos 2600" },
  { id: 815, name: "OnePlus Open 2", price: 1699, cat: "Mobile Tech", img: "📼", tech: "Foldable" },
  { id: 816, name: "Xiaomi Pad 7 Pro", price: 599, cat: "Mobile Tech", img: "📱", tech: "12.4\" 144Hz" },
  { id: 817, name: "Lenovo Legion Y700", price: 449, cat: "Mobile Tech", img: "🎮", tech: "8.8\" Gaming" },
  { id: 818, name: "Samsung Galaxy Tab S10 Ultra", price: 1199, cat: "Mobile Tech", img: "🌠", tech: "14.6\" AMOLED" },
  { id: 819, name: "Apple iPad Pro 13\"", price: 1299, cat: "Mobile Tech", img: "🍎", tech: "M5 Chip" },
  { id: 820, name: "Huawei MatePad Pro 12.2", price: 899, cat: "Mobile Tech", img: "🛡️", tech: "PaperMatte" },
  { id: 821, name: "Google Pixel Tablet 2", price: 599, cat: "Mobile Tech", img: "📍", tech: "Tensor G4" },
  { id: 822, name: "Samsung Galaxy Tab A10", price: 249, cat: "Mobile Tech", img: "🧪", tech: "Budget" },
  { id: 823, name: "OnePlus Pad 2", price: 549, cat: "Mobile Tech", img: "⚙️", tech: "Snapdragon 8 Gen 3" },
  { id: 824, name: "Xiaomi Redmi Pad Pro", price: 329, cat: "Mobile Tech", img: "🌌", tech: "12.1\"" },
  { id: 825, name: "Lenovo Tab P12", price: 279, cat: "Mobile Tech", img: "💨", tech: "11.5\" 3K" },

  // Power Units (15 items)
  { id: 901, name: "Seasonic Prime TX-1000", price: 299, cat: "Power Units", img: "⚡", tech: "80+ Titanium" },
  { id: 902, name: "be quiet! Dark Power 13 850W", price: 219, cat: "Power Units", img: "🔌", tech: "80+ Platinum" },
  { id: 903, name: "Corsair HX1500i", price: 349, cat: "Power Units", img: "🌟", tech: "80+ Platinum" },
  { id: 904, name: "EVGA SuperNOVA 1300 G+", price: 279, cat: "Power Units", img: "🚀", tech: "80+ Gold" },
  { id: 905, name: "ASUS ROG Thor 1200W", price: 429, cat: "Power Units", img: "🌈", tech: "80+ Platinum" },
  { id: 906, name: "MSI MPG A1000G", price: 169, cat: "Power Units", img: "⚡", tech: "80+ Gold" },
  { id: 907, name: "Gigabyte UD1000GM PG5", price: 149, cat: "Power Units", img: "🔥", tech: "ATX 3.1" },
  { id: 908, name: "Thermaltake Toughpower GF A3 850W", price: 129, cat: "Power Units", img: "🌌", tech: "80+ Gold" },
  { id: 909, name: "FSP Hydro PTM Pro 1200W", price: 259, cat: "Power Units", img: "🎯", tech: "80+ Platinum" },
  { id: 910, name: "SilverStone SX1000 SFX-L", price: 239, cat: "Power Units", img: "🌀", tech: "SFX" },
  { id: 911, name: "NZXT C1200", price: 199, cat: "Power Units", img: "💥", tech: "80+ Gold" },
  { id: 912, name: "Cooler Master MWE Gold 850 V2", price: 109, cat: "Power Units", img: "🏎️", tech: "80+ Gold" },
  { id: 913, name: "Seasonic Focus GX-750", price: 129, cat: "Power Units", img: "📼", tech: "80+ Gold" },
  { id: 914, name: "be quiet! Straight Power 12 1000W", price: 269, cat: "Power Units", img: "🛡️", tech: "80+ Platinum" },
  { id: 915, name: "Corsair RM1000x Shift", price: 189, cat: "Power Units", img: "🌠", tech: "80+ Gold" },

  // Cooling (19 items)
  { id: 1001, name: "be quiet! Silent Loop 3 420", price: 219, cat: "Cooling", img: "🌊", tech: "420mm AIO" },
  { id: 1002, name: "Corsair iCUE H170i Elite", price: 299, cat: "Cooling", img: "❄️", tech: "420mm LCD" },
  { id: 1003, name: "Arctic Liquid Freezer III 360", price: 139, cat: "Cooling", img: "💨", tech: "360mm" },
  { id: 1004, name: "NZXT Kraken Elite 360 RGB", price: 249, cat: "Cooling", img: "🌟", tech: "360mm" },
  { id: 1005, name: "Deepcool LS720", price: 119, cat: "Cooling", img: "⚡", tech: "360mm" },
  { id: 1006, name: "Noctua NH-D15", price: 109, cat: "Cooling", img: "🌌", tech: "Dual Tower Air" },
  { id: 1007, name: "Thermalright Peerless Assassin 120", price: 39, cat: "Cooling", img: "🔥", tech: "Dual Tower" },
  { id: 1008, name: "be quiet! Dark Rock Pro 5", price: 99, cat: "Cooling", img: "🌀", tech: "Air Cooler" },
  { id: 1009, name: "Corsair H150i Elite Capellix XT", price: 179, cat: "Cooling", img: "🌈", tech: "360mm" },
  { id: 1010, name: "Lian Li Galahad II Trinity 360", price: 159, cat: "Cooling", img: "🎯", tech: "360mm" },
  { id: 1011, name: "Arctic Freezer 34 eSports DUO", price: 49, cat: "Cooling", img: "🏎️", tech: "Air" },
  { id: 1012, name: "Noctua NH-U12A", price: 89, cat: "Cooling", img: "📼", tech: "Single Tower" },
  { id: 1013, name: "EK-AIO Elite 360 D-RGB", price: 189, cat: "Cooling", img: "🛡️", tech: "360mm" },
  { id: 1014, name: "Thermalright Frozen Prism 360", price: 69, cat: "Cooling", img: "🌠", tech: "ARGB" },
  { id: 1015, name: "be quiet! Pure Loop 2 FX 240", price: 109, cat: "Cooling", img: "🔧", tech: "240mm" },
  { id: 1016, name: "Corsair H100i Elite", price: 129, cat: "Cooling", img: "📍", tech: "240mm" },
  { id: 1017, name: "Deepcool AK620", price: 59, cat: "Cooling", img: "🧪", tech: "Dual Tower" },
  { id: 1018, name: "NZXT Kraken 240 RGB", price: 139, cat: "Cooling", img: "🌌", tech: "240mm" },
  { id: 1019, name: "Arctic Liquid Freezer II 240", price: 99, cat: "Cooling", img: "💥", tech: "240mm" },
];

const CategoriesPage = () => {
  const { isDarkMode } = useTheme();
  const { addToCart, cartItems, removeFromCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return [];
    return ALL_PRODUCTS.filter(p => p.cat === selectedCategory.name);
  }, [selectedCategory]);

  return (
    <div className={`min-h-screen pt-28 pb-20 transition-colors duration-500 ${
      isDarkMode ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900"
    }`}>
      
      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          /* --- VIEW 1: CATEGORY HUB --- */
          <motion.div 
            key="hub"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0, x: -50 }}
          >
            <section className="max-w-7xl mx-auto px-6 mb-16">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-800/20 pb-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-amber-500">
                    <FaLayerGroup />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Hardware Directory</span>
                  </div>
                  <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85]">
                    Select <br /> <span className="text-amber-500">Division</span>
                  </h1>
                </div>
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {CATEGORY_MAP.map((cat, idx) => (
                <CategoryCard 
                  key={cat.id} 
                  cat={cat} 
                  idx={idx} 
                  isDarkMode={isDarkMode} 
                  onSelect={() => setSelectedCategory(cat)} 
                />
              ))}
            </section>

            {/* Global Stats Section */}
            <section className="max-w-7xl mx-auto px-6 mt-24">
              <div className={`rounded-[3rem] p-12 grid grid-cols-1 md:grid-cols-3 gap-12 text-center border ${
                isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-100 shadow-xl"
              }`}>
                <StatBox icon={<FaBoxOpen />} value="200+" label="Verified Nodes" />
                <StatBox icon={<FaTag />} value="10" label="Active Sectors" />
                <StatBox icon={<FaLayerGroup />} value="Global" label="Supply Network" />
              </div>
            </section>
          </motion.div>
        ) : (
          /* --- VIEW 2: PRODUCT LIST --- */
          <motion.div 
            key="products"
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto px-6"
          >
            <button 
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-3 text-amber-500 font-black uppercase text-[10px] tracking-widest mb-10 hover:gap-5 transition-all cursor-pointer"
            >
              <FaArrowLeft /> Return to Directory
            </button>

            <div className="flex items-center justify-between mb-16 border-l-4 border-amber-500 pl-8">
              <div>
                <h2 className="text-6xl font-black italic uppercase tracking-tighter">{selectedCategory.name}</h2>
                <p className="opacity-40 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">{selectedCategory.desc}</p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-black italic text-amber-500">{selectedCategory.count}</span>
                <p className="text-[8px] font-black opacity-30 uppercase tracking-widest">Available Units</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.length > 0 ? filteredProducts.map((p) => (
                <ProductCard 
                  key={p.id} 
                  p={p} 
                  isDarkMode={isDarkMode} 
                  onAdd={() => { addToCart(p); setIsCartOpen(true); }} 
                />
              )) : (
                <div className="col-span-full py-20 text-center opacity-20 uppercase font-black italic text-4xl">No Nodes Detected</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems} 
        remove={removeFromCart} 
        isDarkMode={isDarkMode} 
      />
    </div>
  );
};

// ──────────────────────────────────────────────────────────────
// SUB-COMPONENTS (unchanged — they were already perfect)
// ──────────────────────────────────────────────────────────────
const CategoryCard = ({ cat, idx, isDarkMode, onSelect }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }} 
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: idx * 0.05 }}
    whileHover={{ y: -8 }}
    onClick={onSelect}
    className={`relative group cursor-pointer p-8 rounded-[2.5rem] border transition-all overflow-hidden flex flex-col justify-between h-[380px] ${
      isDarkMode ? "bg-[#0d1117] border-slate-800 hover:border-amber-500/50" : "bg-white border-slate-200 shadow-xl"
    }`}
  >
    <div className="absolute top-6 right-0 bg-amber-500 text-black text-[8px] font-black px-4 py-1.5 rounded-l-full uppercase italic tracking-widest z-20">
      {cat.offer}
    </div>
    <div className="absolute -right-6 -bottom-6 text-[180px] opacity-5 group-hover:opacity-10 transition-opacity rotate-12 pointer-events-none">{cat.icon}</div>
    <div className="relative z-10">
      <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-500">{cat.icon}</div>
      <h3 className="text-2xl font-black italic uppercase mb-3 group-hover:text-amber-500 transition-colors">{cat.name}</h3>
      <p className="text-[10px] font-bold opacity-50 uppercase leading-relaxed tracking-wider">{cat.desc}</p>
    </div>
    <div className="relative z-10 pt-6 border-t border-slate-800/10 space-y-4">
      <div className="flex justify-between items-center text-[9px] font-black uppercase">
        <span className="text-amber-500 flex items-center gap-2"><FaMicrochip /> {cat.spec}</span>
        <span className="opacity-30">{cat.count} Units</span>
      </div>
      <div className="w-full h-1 bg-slate-500/10 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${(cat.count / 30) * 100}%` }} className="h-full bg-amber-500" />
      </div>
      <div className="flex items-center justify-between text-[10px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity pt-2">
        <span>Enter Sector</span><FaArrowRight className="text-amber-500" />
      </div>
    </div>
  </motion.div>
);

const ProductCard = ({ p, isDarkMode, onAdd }) => (
  <div className={`group p-6 rounded-[2.5rem] border transition-all ${isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white border-slate-200 shadow-lg"}`}>
    <div className="aspect-square bg-slate-500/5 rounded-3xl flex items-center justify-center text-7xl mb-6 relative overflow-hidden">
      <span className="group-hover:scale-110 transition-transform duration-500">{p.img}</span>
      <button 
        onClick={onAdd} 
        className="absolute bottom-4 inset-x-4 py-4 bg-amber-500 text-black font-black text-[10px] uppercase rounded-xl translate-y-24 group-hover:translate-y-0 transition-transform shadow-lg cursor-pointer flex items-center justify-center gap-2"
      >
        <FaShoppingCart /> Add to Arsenal
      </button>
    </div>
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="font-black text-sm uppercase leading-tight">{p.name}</h3>
        <span className="text-xl font-black italic text-amber-500">${p.price}</span>
      </div>
      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase pb-4 border-b border-slate-800/10">
        <FaMicrochip className="text-amber-500" /> {p.tech}
      </div>
      <div className="flex items-center gap-1 text-[9px] font-black uppercase text-emerald-500">
        <FaCheckCircle /> Optimized Node
      </div>
    </div>
  </div>
);

const StatBox = ({ icon, value, label }) => (
  <div className="space-y-2">
    <div className="text-3xl text-amber-500 mb-4 flex justify-center">{icon}</div>
    <h4 className="text-5xl font-black italic tracking-tighter">{value}</h4>
    <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.3em]">{label}</p>
  </div>
);

const CartDrawer = ({ isOpen, onClose, cartItems, remove, isDarkMode }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose} 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999]" 
        />
        <motion.div 
          initial={{ x: "100%" }} 
          animate={{ x: 0 }} 
          exit={{ x: "100%" }} 
          transition={{ type: "spring", damping: 25 }} 
          className={`fixed inset-y-0 right-0 z-[1000] w-full max-w-sm p-8 flex flex-col ${isDarkMode ? "bg-[#0d1117] border-l border-slate-800" : "bg-white"}`}
        >
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black italic uppercase">Your Arsenal</h2>
            <FaTimes className="cursor-pointer" onClick={onClose} />
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-center bg-slate-500/5 p-4 rounded-2xl group">
                <div className="text-3xl">{item.img}</div>
                <div className="flex-1">
                  <h4 className="text-[10px] font-black uppercase truncate">{item.name}</h4>
                  <p className="text-amber-500 font-black italic">${item.price}</p>
                </div>
                <FaTrash className="text-rose-500 cursor-pointer" onClick={() => remove(item.id)} />
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-slate-800/20 mt-6">
            <div className="flex justify-between mb-6 font-black uppercase">
              <span className="text-xs opacity-40">Total</span>
              <span className="text-2xl text-amber-500">
                ${cartItems.reduce((s, i) => s + i.price, 0)}
              </span>
            </div>
            <button className="w-full py-5 bg-amber-500 text-black font-black uppercase text-xs rounded-2xl shadow-lg">Execute Order</button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default CategoriesPage;