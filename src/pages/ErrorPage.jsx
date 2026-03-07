// import { motion } from "framer-motion";
// import cartoonImg from "../assets/error.gif"; // replace with your cartoon image

// const ErrorPage = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-800 to-pink-600 flex flex-col justify-center items-center px-4 text-center">
//       {/* Cartoon */}
//       <motion.img
//         src={cartoonImg}
//         alt="Error Cartoon"
//         className="w-64 h-64 mb-8"
//         initial={{ y: -50, opacity: 0, rotate: -10 }}
//         animate={{ y: 0, opacity: 1, rotate: 0 }}
//         transition={{ type: "spring", stiffness: 120, damping: 10 }}
//       />

//       {/* Error Text */}
//       <motion.h1
//         className="text-6xl font-bold text-white mb-4"
//         initial={{ scale: 0.8, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//       >
//         Oops!
//       </motion.h1>
//       <motion.p
//         className="text-xl text-gray-200 mb-6 max-w-md"
//         initial={{ y: 20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 0.3, duration: 0.6 }}
//       >
//         Something went wrong. The page you are looking for does not exist.
//       </motion.p>

//       {/* Button */}
//       <motion.a
//         href="/"
//         className="inline-block px-8 py-3 bg-red-500 text-white font-bold rounded-full shadow-lg hover:bg-red-600 transition-colors duration-300"
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.95 }}
//       >
//         Go Home
//       </motion.a>

//       {/* Floating balloons animation */}
//       <motion.div
//         className="absolute top-10 left-10 w-6 h-6 bg-yellow-400 rounded-full"
//         animate={{ y: [0, -30, 0], x: [0, 10, -10, 0] }}
//         transition={{ repeat: Infinity, duration: 3 }}
//       />
//       <motion.div
//         className="absolute top-20 right-16 w-8 h-8 bg-green-400 rounded-full"
//         animate={{ y: [0, -40, 0], x: [0, -15, 15, 0] }}
//         transition={{ repeat: Infinity, duration: 4 }}
//       />
//     </div>
//   );
// };

// export default ErrorPage;


import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { 
  FaExclamationTriangle, FaTerminal, FaWifi, 
  FaSatellite, FaArrowRight, FaCodeBranch 
} from "react-icons/fa";

const ErrorPage = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [errorCode, setErrorCode] = useState("");

  // Simulated "Glitch" text effect for the 404
  useEffect(() => {
    const chars = "01010101404ERROR";
    const interval = setInterval(() => {
      let glitch = "";
      for (let i = 0; i < 3; i++) {
        glitch += chars[Math.floor(Math.random() * chars.length)];
      }
      setErrorCode(glitch);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-500 ${isDarkMode ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900"}`}>
      
      {/* BACKGROUND DECORATIVE GRID */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <main className="max-w-3xl w-full relative z-10 text-center">
        
        {/* TOP SIGNAL STATUS */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center items-center gap-4 mb-12"
        >
          <div className="h-[1px] w-12 bg-rose-500" />
          <p className="text-[10px] font-mono font-black text-rose-500 uppercase tracking-[0.5em] animate-pulse">
            Signal Lost // Connection Terminated
          </p>
          <div className="h-[1px] w-12 bg-rose-500" />
        </motion.div>

        {/* LARGE ERROR CODE */}
        <div className="relative mb-8">
          <motion.h1 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-[10rem] md:text-[15rem] font-black leading-none italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-rose-600 to-rose-950 opacity-20 select-none"
          >
            404
          </motion.h1>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="space-y-4">
                <FaExclamationTriangle className="text-6xl md:text-8xl text-amber-500 mx-auto drop-shadow-[0_0_30px_rgba(245,158,11,0.5)]" />
                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-widest italic">Dropped Signal</h2>
             </div>
          </div>
        </div>

        {/* TERMINAL ERROR LOG */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`p-8 rounded-[2rem] border text-left mb-12 font-mono ${isDarkMode ? "bg-black/50 border-slate-800 shadow-2xl" : "bg-white border-slate-200 shadow-xl"}`}
        >
          <div className="flex gap-2 mb-4 border-b border-slate-800 pb-2">
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="space-y-2 text-[11px] md:text-xs">
            <p className="text-slate-500 tracking-tighter">[$] <span className="text-emerald-500 italic">locate_resource</span> --path /requested-node</p>
            <p className="text-rose-500 font-bold tracking-widest">[CRITICAL_ERROR] Target coordinate not found in AN-Shop Global Hub.</p>
            <p className="text-slate-500 tracking-tighter">[$] <span className="text-amber-500 italic">ping</span> dhaka-central-hub ... <span className="text-rose-400">Request Timed Out.</span></p>
            <p className="text-slate-400 font-bold">Checking local cache... <span className="text-rose-500 opacity-50">Empty.</span></p>
          </div>
        </motion.div>

        {/* NAVIGATION OPTIONS */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="w-full md:w-auto px-12 py-5 bg-amber-500 text-black font-black rounded-2xl text-[10px] uppercase tracking-[0.3em] transition-all cursor-pointer shadow-xl shadow-amber-500/20"
          >
             Go To Homepage
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
         onClick={() => navigate("/about")} // Changed from -1 to "/about"
            className={`w-full md:w-auto px-12 py-5 border-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all cursor-pointer ${isDarkMode ? "border-slate-800 hover:border-slate-600" : "border-slate-200 hover:border-slate-400 text-slate-600"}`}
          >
             Contact Support
          </motion.button>
        </div>

        {/* FOOTER DATA */}
        <footer className="mt-20">
          <div className="flex justify-center gap-8 opacity-30">
            <div className="flex items-center gap-2">
              <FaCodeBranch className="text-xs" />
              <p className="text-[9px] font-mono uppercase tracking-widest font-black">Build: 404.26.1</p>
            </div>
            <div className="flex items-center gap-2">
              <FaSatellite className="text-xs" />
              <p className="text-[9px] font-mono uppercase tracking-widest font-black">Node: DHAKA_01</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default ErrorPage;