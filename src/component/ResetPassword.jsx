import React, { useState } from "react";
import { auth } from "../firebase/Firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FaEnvelopeOpenText, FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setDone(true);
    } catch (err) {
      setError("No account found with this email address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 relative overflow-hidden">
        
        {/* Decorative background element */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>

        {!done ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button 
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-gray-400 hover:text-blue-600 font-semibold mb-6 transition-colors"
            >
              <FaArrowLeft size={14} /> Back to Login
            </button>

            <h2 className="text-4xl font-black text-gray-900 dark:text-white leading-tight mb-2">
              PASSWORD <br /> <span className="text-blue-600">RECOVERY</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
              Enter your email below. We'll send a secure link to reset your account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold text-center">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-black text-gray-400 ml-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>

              <button 
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </div>
        ) : (
          /* SUCCESS STATE */
          <div className="text-center animate-in zoom-in fade-in duration-500">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12">
              <FaEnvelopeOpenText size={32} />
            </div>
            
            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase mb-4">Check Your Email</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              A recovery link has been sent to <br />
              <span className="font-bold text-blue-600">{email}</span>
            </p>

            {/* SPAM NOTE */}
            <div className="flex items-start gap-3 p-5 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-900/50 text-left mb-8">
              <FaExclamationTriangle className="text-amber-600 mt-1 shrink-0" />
              <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                <span className="font-bold">Not in your inbox?</span> Please check your <span className="underline decoration-2">Spam</span> or <span className="underline decoration-2">Junk</span> folder. Sometimes these emails get filtered.
              </p>
            </div>

            <button 
              onClick={() => navigate("/login")} 
              className="w-full py-4 border-2 border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forgot;