import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import loginGif from "../assets/forgot.gif";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const auth = getAuth();

  // Auto detect system dark mode
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      setDarkMode(e.matches);
      document.documentElement.classList.toggle("dark", e.matches);
    };
    setDarkMode(mediaQuery.matches);
    document.documentElement.classList.toggle("dark", mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const cleanEmail = email.trim();
      
      await sendPasswordResetEmail(auth, cleanEmail, {
        url: `${window.location.origin}/login`,
        handleCodeInApp: true,
      });

      setMessage("✅ Password reset link sent! Check inbox/spam (2-10 mins).");
      setEmail("");

    } catch (error) {
      console.error("Reset error:", error);
      
      let errorMsg = "Something went wrong. Please try again.";
      
      switch (error.code) {
        case 'auth/too-many-requests':
          errorMsg = "Too many attempts. Please wait.";
          break;
        case 'auth/network-request-failed':
          errorMsg = "Network error. Check connection.";
          break;
        default:
          errorMsg = "Please try again.";
      }
      
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-2 lg:p-12 bg-gradient-to-br transition-all duration-1000">
      {/* Backgrounds */}
      <div className={`absolute inset-0 bg-gradient-to-r ${
        darkMode ? "from-slate-900 via-purple-900/20 to-slate-900" : "from-gradient-50 via-blue-50/50 to-indigo-50"
      }`} />
      <div className={`absolute inset-0 opacity-20 ${
        darkMode ? "bg-[radial-gradient(circle_at_25%_25%,#9333ea_0%,transparent_50%)]" : "bg-[radial-gradient(circle_at_25%_25%,#3b82f6_0%,transparent_50%)]"
      }`} />
      
      <div className={`relative z-10 w-full max-w-6xl mx-auto backdrop-blur-xl ${
        darkMode ? "bg-white/5 border border-white/10 shadow-2xl shadow-black/20" : "bg-white/80 border border-white/40 shadow-2xl shadow-blue-500/10"
      } rounded-3xl overflow-hidden flex flex-col lg:flex-row gap-8 p-4 lg:p-12 transition-all duration-700 hover:shadow-3xl`}>
        
        {/* Form Side */}
        <div className="flex-1 flex flex-col justify-center px-2 lg:px-8 order-2 lg:order-1">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className={`inline-flex items-center px-5 py-3 rounded-full mb-6 transition-all duration-500 ${
                darkMode ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30" : "bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-400/30"
              }`}>
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="font-semibold text-lg tracking-wide">Secure Reset</span>
              </div>
              
              <h1 className={`text-4xl lg:text-5xl font-black mb-6 bg-gradient-to-r ${
                darkMode ? "bg-gradient-to-r from-white to-gray-200 text-transparent bg-clip-text" : "bg-gradient-to-r from-gray-900 via-gray-800 to-black text-transparent bg-clip-text"
              } leading-tight`}>
                Reset Password
              </h1>
              <p className={`text-xl ${darkMode ? "text-gray-300" : "text-gray-600"} font-light max-w-md mx-auto leading-relaxed`}>
                We'll send a reset link to your registered email.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label className={`block text-sm font-semibold mb-3 tracking-wide ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                  Email Address
                </label>
                <div className={`relative group ${
                  darkMode ? "bg-white/5 border border-white/20" : "bg-white/50 border border-gray-200/50"
                } rounded-2xl p-3 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10`}>
                  <input
                    type="email"
                    placeholder="your.email@company.com"
                    className={`w-full bg-transparent text-sm md:text-md lg:text-lg placeholder-gray-400 ${
                      darkMode ? "text-white" : "text-gray-900"
                    } border-none outline-none transition-all duration-300 pr-5`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.27 7.27c.883.883 2.317.883 3.2 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`group cursor-pointer relative w-full h-14 rounded-2xl font-bold text-xl flex items-center justify-center transition-all duration-500 overflow-hidden ${
                  isLoading
                    ? "bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed" 
                    : darkMode
                      ? "bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-2xl shadow-purple-500/25 hover:shadow-3xl hover:shadow-purple-500/40 hover:-translate-y-1"
                      : "bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl shadow-blue-500/25 hover:shadow-3xl hover:shadow-blue-500/40 hover:-translate-y-1"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            {/* Message */}
            {message && (
              <div className={`mt-8 p-6 rounded-2xl backdrop-blur-md border transition-all duration-500 shadow-2xl ${
                message.includes("✅")
                  ? "bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-400/30 dark:border-emerald-600/50"
                  : "bg-rose-500/10 dark:bg-rose-500/20 border-rose-400/30 dark:border-rose-600/50"
              }`}>
                <div className="flex items-center justify-center gap-4">
                  <div className={`flex-shrink-0 p-3 rounded-full ${
                    message.includes("✅") ? "bg-emerald-500/20 dark:bg-emerald-500/30" : "bg-rose-500/20 dark:bg-rose-500/30"
                  }`}>
                    <svg className={`w-6 h-6 ${message.includes("✅") ? "text-emerald-500" : "text-rose-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      {message.includes("✅") ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                    </svg>
                  </div>
                  <p className={`text-sm lg:text-lg font-semibold text-center break-words ${
                    message.includes("✅") ? "text-emerald-800 dark:text-emerald-200" : "text-rose-800 dark:text-rose-200"
                  }`}>
                    {message}
                  </p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-10 pt-8 border-t border-white/10 text-center">
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Remember your password?{" "}
                <Link to="/login" className={`inline-flex items-center font-semibold group transition-all duration-300 ${
                  darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
                }`}>
                  Return to Login
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Image Side */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8 order-1 lg:order-2">
          <div className={`relative w-full h-80 lg:h-96 rounded-3xl overflow-hidden shadow-2xl ${
            darkMode ? "bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl border border-white/20" : "bg-gradient-to-br from-blue-500/5 to-purple-500/5 backdrop-blur-xl border border-blue-200/30"
          }`}>
            <img src={loginGif} alt="Secure Password Reset" className="w-full h-full object-contain p-8 lg:p-12 animate-float transition-all duration-1000" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forgot;
