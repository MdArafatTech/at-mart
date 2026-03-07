import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import emailjs from "@emailjs/browser";
import {
  FaBolt, FaShieldAlt, FaGlobe, FaUsers, FaStar, FaQuoteLeft,
  FaMicrochip, FaArrowRight, FaTimes, FaCheckCircle, FaLinkedin
} from "react-icons/fa";

// ──────────────────────────────────────────────────────────────
// DATA
// ──────────────────────────────────────────────────────────────
const STATS = [
  { icon: <FaMicrochip />, value: "200,000+", label: "Nodes Deployed" },
  { icon: <FaUsers />, value: "47,892", label: "Hardware Architects" },
  { icon: <FaGlobe />, value: "128", label: "Countries Served" },
  { icon: <FaShieldAlt />, value: "100%", label: "Authentic Hardware" },
];

const TIMELINE = [
  { year: "2023", event: "Founded in a garage by 4 overclockers" },
  { year: "2024", event: "First RTX 4090 day-one drop sold out in 11 minutes" },
  { year: "2025", event: "Expanded to 47,892 members across 128 countries" },
  { year: "2026", event: "Launched Arsenal Grid — the most advanced hardware platform" },
];

const LEADERSHIP = [
  {
    name: "Marcus Kane",
    role: "Founder & CEO",
    avatar: "👨‍💼",
    bio: "Former competitive overclocker and hardware engineer. Built Arsenal from a Discord group into the premier hardware destination. Passionate about making cutting-edge silicon accessible to everyone.",
    linkedin: "#"
  },
  {
    name: "Elena Voss",
    role: "Chief Technology Officer",
    avatar: "👩‍🔬",
    bio: "Ex-NVIDIA engineer with 12 years in GPU architecture. Leads our product verification and testing lab. Ensures every component meets our Zero Defect standard.",
    linkedin: "#"
  },
  {
    name: "Liam Chen",
    role: "Head of Operations",
    avatar: "🧑‍💼",
    bio: "Logistics and supply chain expert. Manages our global warehouse network and guarantees same-day shipping for 92% of orders.",
    linkedin: "#"
  },
];

const REVIEWS = [
  { id: 1, name: "Alex Rivera", role: "Senior PC Builder @ Vortex Labs", avatar: "🧔", rating: 5, text: "The only place I trust for day-one flagship drops. My RTX 5090 arrived 3 hours after launch with full warranty.", date: "March 2026" },
  { id: 2, name: "Priya Sharma", role: "AI Research Lead @ NeuralForge", avatar: "👩‍🔬", rating: 5, text: "The Intel Ultra 9 285K + G.Skill 9200 kit I bought here is running my training cluster at 2.3× efficiency.", date: "February 2026" },
  { id: 3, name: "Marcus Chen", role: "Esports Athlete", avatar: "🎮", rating: 5, text: "My 9950X3D + custom water loop arrived perfectly tuned. These guys actually understand performance.", date: "January 2026" },
  { id: 4, name: "Elena Voss", role: "Content Creator @ PixelForge", avatar: "📸", rating: 5, text: "Been buying from them since the 4090 launch. Every component has been flawless.", date: "December 2025" },
  { id: 5, name: "Liam Dubois", role: "Hardware Engineer @ TitanForge", avatar: "👨‍🔧", rating: 5, text: "The Crucial T705 4TB arrived with full test report. This level of transparency is unmatched.", date: "March 2026" },
  { id: 6, name: "Sofia Patel", role: "Game Developer", avatar: "👩‍💻", rating: 5, text: "Got my Ryzen 9 9950X3D and ASUS Z890 board in the same box. Perfectly packaged.", date: "February 2026" },
  { id: 7, name: "Jamal Wright", role: "Stream Engineer", avatar: "🎤", rating: 5, text: "The Beyerdynamic MMX 330 Studio Pro I got here sounds better than my $1200 monitors.", date: "January 2026" },
  { id: 8, name: "Nina Kowalski", role: "3D Artist", avatar: "🎨", rating: 5, text: "Ordered a full workstation build. Everything arrived in perfect condition and 2 days early.", date: "March 2026" },
];

const AboutPage = () => {
  const { isDarkMode } = useTheme();
  const [selectedReview, setSelectedReview] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs.send(
      "service_fel2b38",                    // Your Service ID
      "template_2nb2qvj",                   // Your Template ID
      {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
      },
      "-dm5gWB-Fz--QlTIN"                   // Your Public Key
    )
      .then(() => {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
      })
      .catch((err) => {
        alert("Failed to send message. Please try again.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className={`min-h-screen pt-20 md:pt-28 pb-20 transition-colors duration-500 ${
      isDarkMode ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900"
    }`}>

      {/* HERO */}
      <section className="relative px-6 py-16 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-3 text-amber-500 mb-6">
                <FaBolt className="animate-pulse text-2xl" />
                <span className="font-black uppercase tracking-[0.4em] text-xs">EST. 2023 • EARTH GRID</span>
              </div>
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-black italic uppercase tracking-[-0.04em] leading-[0.85]">
                WE BUILD<br />THE FUTURE
              </h1>
              <p className="mt-8 max-w-lg text-lg opacity-80">
                Arsenal is the premier destination for enthusiasts and professionals who demand the absolute cutting edge in PC hardware.
              </p>
            </div>
            <div className="flex-1 relative hidden lg:block">
              <div className="aspect-video bg-gradient-to-br from-slate-900 to-black rounded-3xl flex items-center justify-center text-[180px] opacity-20">⚙️</div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 mb-20">
        <div className={`rounded-3xl border p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-8 ${
          isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white border-slate-100 shadow-xl"
        }`}>
          {STATS.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="text-4xl text-amber-500 mb-4">{stat.icon}</div>
              <div className="text-5xl font-black tracking-tighter">{stat.value}</div>
              <div className="text-xs font-black uppercase tracking-widest opacity-50 mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="max-w-7xl mx-auto px-6 mb-28">
        <div className="text-center mb-12">
          <div className="text-amber-500 text-xs font-black tracking-widest">OUR JOURNEY</div>
          <h2 className="text-5xl font-black italic tracking-tight mt-2">From Garage to Global Grid</h2>
        </div>
        <div className="space-y-12 max-w-2xl mx-auto">
          {TIMELINE.map((item, i) => (
            <div key={i} className="flex gap-8">
              <div className="w-20 font-black text-amber-500 text-right text-3xl">{item.year}</div>
              <div className="flex-1 border-l-2 border-amber-500/30 pl-8 text-lg opacity-90">{item.event}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LEADERSHIP TEAM */}
      <section className="max-w-7xl mx-auto px-6 mb-28">
        <div className="text-center mb-12">
          <div className="text-amber-500 text-xs font-black tracking-widest mb-3">THE ARSENAL CORE</div>
          <h2 className="text-5xl font-black italic tracking-tight">Leadership Team</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {LEADERSHIP.map((leader, i) => (
            <div key={i} className={`rounded-3xl p-8 border transition-all ${
              isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white border-slate-200"
            }`}>
              <div className="text-6xl mb-6">{leader.avatar}</div>
              <h3 className="font-black text-2xl mb-1">{leader.name}</h3>
              <p className="text-amber-500 text-sm font-medium mb-6">{leader.role}</p>
              <p className="text-sm opacity-80 leading-relaxed">{leader.bio}</p>
              <a href={leader.linkedin} className="text-amber-500 text-xs mt-6 inline-flex items-center gap-2 hover:gap-3 transition-all">
                Connect on LinkedIn <FaArrowRight />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="max-w-7xl mx-auto px-6 mb-28">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-amber-500 text-xs font-black tracking-widest mb-3">
            <FaStar /> COMMUNITY VERDICT
          </div>
          <h2 className="text-5xl font-black italic tracking-tight">What Our Builders Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {REVIEWS.map((review) => (
            <motion.div
              key={review.id}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedReview(review)}
              className={`p-8 rounded-3xl border cursor-pointer transition-all h-full ${
                isDarkMode ? "bg-[#0d1117] border-slate-800 hover:border-amber-500/50" : "bg-white border-slate-200 hover:shadow-xl"
              }`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl">{review.avatar}</div>
                <div>
                  <div className="font-black text-lg leading-none">{review.name}</div>
                  <div className="text-xs opacity-60 mt-1">{review.role}</div>
                </div>
              </div>
              <div className="flex text-amber-500 mb-6 text-xl">
                {Array.from({ length: review.rating }).map((_, i) => <FaStar key={i} />)}
              </div>
              <FaQuoteLeft className="text-4xl opacity-10 mb-4" />
              <p className="italic text-sm leading-relaxed line-clamp-4">“{review.text}”</p>
              <div className="mt-8 text-xs font-mono opacity-40">{review.date}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONTACT FORM - EMAILJS */}
      <section className="max-w-7xl mx-auto px-6">
        <div className={`rounded-3xl p-10 md:p-16 border ${
          isDarkMode ? "bg-[#0d1117] border-slate-800" : "bg-white border-slate-100 shadow-xl"
        }`}>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="text-amber-500 text-xs font-black tracking-widest mb-3">SPEAK DIRECTLY TO THE GRID</div>
            <h2 className="text-5xl font-black italic tracking-tight">Send Us a Message</h2>
            <p className="mt-4 opacity-70">We reply within 4 hours during business hours.</p>
          </div>

          {submitted ? (
            <div className="text-center py-16">
              <FaCheckCircle className="text-6xl text-emerald-500 mx-auto mb-6" />
              <h3 className="text-3xl font-black">Message Received</h3>
              <p className="mt-3 opacity-70">Thank you. A member of the Arsenal team will reply shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="YOUR NAME"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-6 py-5 rounded-2xl outline-none text-sm font-medium border ${
                    isDarkMode ? "bg-black/30 border-slate-700" : "bg-white border-slate-200"
                  }`}
                  required
                />
                <input
                  type="email"
                  placeholder="YOUR PROTOCOL EMAIL"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-6 py-5 rounded-2xl outline-none text-sm font-medium border ${
                    isDarkMode ? "bg-black/30 border-slate-700" : "bg-white border-slate-200"
                  }`}
                  required
                />
              </div>

              <textarea
                rows={6}
                placeholder="YOUR MESSAGE TO THE ARSENAL TEAM..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={`w-full px-6 py-5 rounded-2xl outline-none text-sm font-medium border resize-none ${
                  isDarkMode ? "bg-black/30 border-slate-700" : "bg-white border-slate-200"
                }`}
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer py-6 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-600 text-black font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                {loading ? "SENDING TO THE GRID..." : "SEND MESSAGE"} 
                {!loading && <FaArrowRight />}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* REVIEW MODAL */}
      <AnimatePresence>
        {selectedReview && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/90">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-lg rounded-3xl p-10 relative ${
                isDarkMode ? "bg-[#0d1117]" : "bg-white"
              }`}
            >
              <button onClick={() => setSelectedReview(null)} className="absolute top-6 right-6 text-4xl opacity-40 hover:opacity-100">
                <FaTimes />
              </button>
              <div className="flex gap-4 mb-8">
                <div className="text-6xl">{selectedReview.avatar}</div>
                <div>
                  <div className="font-black text-2xl">{selectedReview.name}</div>
                  <div className="text-sm opacity-60">{selectedReview.role}</div>
                </div>
              </div>
              <div className="flex text-amber-500 mb-6 text-2xl">
                {Array.from({ length: selectedReview.rating }).map((_, i) => <FaStar key={i} />)}
              </div>
              <p className="text-lg italic leading-relaxed">“{selectedReview.text}”</p>
              <div className="mt-10 text-xs font-mono opacity-40 border-t border-slate-700/30 pt-6">
                {selectedReview.date}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AboutPage;