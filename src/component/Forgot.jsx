import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebase/Firebase";
import emailjs from "@emailjs/browser"; 
import { 
  collection, query, where, getDocs, 
  addDoc, updateDoc, serverTimestamp, limit 
} from "firebase/firestore";
import { FaShieldAlt, FaEnvelope, FaExclamationTriangle, FaCheckCircle, FaArrowLeft, FaEye } from "react-icons/fa";
import forgotGif from "../assets/forgot.gif"; // Make sure this path is correct

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => { setError(""); }, [email, otp]);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const cleanEmail = email.trim().toLowerCase();

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("email", "==", cleanEmail), limit(1));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Account not found.");
        setIsLoading(false);
        return;
      }

      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      await addDoc(collection(db, "otp_requests"), {
        email: cleanEmail,
        otp: generatedOtp,
        expiresAt: Date.now() + 600000, 
        createdAt: serverTimestamp(),
        used: false
      });

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { to_email: cleanEmail, passcode: generatedOtp, time: "10 minutes" },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      
      setSuccess("✅ Code sent to your inbox.");
      setStep(2);
    } catch (err) {
      setError("Failed to send OTP.");
    } finally { setIsLoading(false); }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const q = query(
        collection(db, "otp_requests"),
        where("email", "==", email.trim().toLowerCase()),
        where("otp", "==", otp.trim()),
        where("used", "==", false),
        limit(1)
      );

      const otpSnapshot = await getDocs(q);

      if (otpSnapshot.empty) {
        setError("Invalid or used code.");
      } else {
        const otpDoc = otpSnapshot.docs[0];
        if (Date.now() > otpDoc.data().expiresAt) {
          setError("Code expired.");
        } else {
          await updateDoc(otpDoc.ref, { used: true });
          setSuccess("✅ Verified.");
          setTimeout(() => navigate("/resetpassword", { state: { email: email.toLowerCase() } }), 1000);
        }
      }
    } catch (err) { setError("Verification failed."); } 
    finally { setIsLoading(false); }
  };

  return (
    <div className="bg-orange-50 dark:bg-gray-950 min-h-screen flex items-center justify-center p-4">
      <div className="w-full mt-13 max-w-5xl">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
          <div className="grid md:grid-cols-2">
            
            {/* --- FORM SECTION --- */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white uppercase tracking-tight">
                  {step === 1 ? "Reset Access" : "Verify Signal"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {step === 1 ? "Recover your account credentials" : "Enter the verification code"}
                </p>
              </div>

              {/* Status Messages */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-red-800 dark:text-red-400 text-center font-medium">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl text-green-800 dark:text-green-400 text-center font-medium">
                  {success}
                </div>
              )}

              <form onSubmit={step === 1 ? handleRequestOTP : handleVerifyOTP} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                    {step === 1 ? "Email Address" : "6-Digit Code"}
                  </label>
                  
                  {step === 1 ? (
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="📩 ENTER YOUR EMAIL"
                      className="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/30 outline-none transition"
                    />
                  ) : (
                    <input
                      type="text"
                      maxLength="6"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="0 0 0 0 0 0"
                      className="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-center text-2xl tracking-[0.5em] focus:ring-4 focus:ring-emerald-500/30 outline-none transition font-bold"
                    />
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 font-bold rounded-xl shadow-xl transform transition-all flex items-center justify-center gap-3 text-white cursor-pointer uppercase tracking-widest ${
                    isLoading 
                      ? "bg-gray-400 cursor-not-allowed" 
                      : step === 1 
                        ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:scale-[1.02] active:scale-95" 
                        : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-[1.02] active:scale-95"
                  }`}
                >
                  {isLoading ? "Processing..." : step === 1 ? "Send Signal" : "Verify Code"}
                </button>
              </form>

              <div className="text-center mt-8">
                <Link 
                  to="/login" 
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-yellow-400 cursor-pointer hover:underline uppercase tracking-widest"
                >
                  <FaArrowLeft size={12} /> Return to Login
                </Link>
              </div>
            </div>

            {/* --- IMAGE SECTION --- */}
            <div className={`hidden md:flex items-center justify-center p-10 bg-gradient-to-br ${
              step === 1 
              ? "from-amber-400 via-orange-500 to-red-500" 
              : "from-emerald-400 via-teal-500 to-cyan-600"
            }`}>
              <motion.img 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                src={forgotGif} 
                alt="Recovery" 
                className="w-full max-w-md drop-shadow-2xl" 
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Forgot;