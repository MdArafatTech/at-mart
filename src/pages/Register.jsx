import React, { useState } from "react";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import registerGif from "../assets/register.gif";
import { useAuth } from "../provider/AuthProvider";
import { useTheme } from "../context/ThemeContext"; 
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const Register = () => {
  const { register, loginWithGoogle } = useAuth();
  const { isDarkMode } = useTheme(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // --- Handlers ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrorMsg("");
  };

  const togglePassword = () => setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  const toggleConfirmPassword = () => setFormData((prev) => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }));

  // ✅ RESTORED: Email/Password Submit Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsRegisterLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match!");
      setIsRegisterLoading(false);
      return;
    }

    try {
      await register(formData.email, formData.password);
      setShowSuccessPopup(true);
    } catch (error) {
      setErrorMsg(error.message || "Registration failed.");
    } finally {
      setIsRegisterLoading(false);
    }
  };

  // ✅ RESTORED: Google Logic
  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      setShowSuccessPopup(true);
    } catch (error) {
      if (error.code !== "auth/popup-closed-by-user") {
        setErrorMsg("Google sign-up failed.");
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const SuccessPopup = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <div className={`${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"} rounded-2xl shadow-2xl p-10 max-w-sm w-full mx-4 text-center`}>
        <div className={`mx-auto w-20 h-20 ${isDarkMode ? "bg-green-900/30" : "bg-green-100"} rounded-full flex items-center justify-center mb-6`}>
          <svg className={`w-12 h-12 ${isDarkMode ? "text-green-400" : "text-green-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className={`text-3xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>Account Created!</h2>
        <p className={`mb-8 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Welcome! Your account is ready.</p>
        <button
          onClick={() => navigate("/login")}
          className="w-full py-4 cursor-pointer bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition"
        >
          OK Go to Login
        </button>
      </div>
    </div>
  );

  return (
    <>
      {showSuccessPopup && <SuccessPopup />}

      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-950" : "bg-orange-50"
      }`}>
        <div className="w-full mt-13 max-w-5xl">
          <div className={`rounded-3xl shadow-2xl overflow-hidden border transition-colors duration-300 ${
            isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
          }`}>
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <div className="text-center mb-8">
                  <h1 className={`text-4xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Create Your Account</h1>
                </div>

                {errorMsg && (
                   <div className={`mb-6 p-5 border rounded-2xl text-center ${
                    isDarkMode ? "bg-red-950/20 border-red-900 text-red-400" : "bg-red-50 border-red-200 text-red-800"
                  }`}>
                    <p className="font-semibold">{errorMsg}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Email Address</label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                       placeholder=" 📩 Type password again"
                      onChange={handleChange}
                      required
                      className={`w-full px-5 py-4 rounded-xl border outline-none transition ${
                        isDarkMode ? "bg-gray-800 border-gray-700 text-white focus:ring-amber-500/20" : "bg-gray-50 border-gray-300 focus:ring-blue-500/30"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Password</label>
                    <div className="relative">
                      <input
                        id="password"
                        type={formData.showPassword ? "text" : "password"}
                        value={formData.password}
                       placeholder=" 🔏 Type password again"
                        onChange={handleChange}
                        required
                        className={`w-full px-5 py-4 pr-14 rounded-xl border outline-none transition ${
                           isDarkMode ? "bg-gray-800 border-gray-700 text-white focus:ring-amber-500/20" : "bg-gray-50 border-gray-300 focus:ring-blue-500/30"
                        }`}
                      />
                      <button type="button" onClick={togglePassword} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                        {formData.showPassword ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Confirm Password</label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={formData.showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                         placeholder=" 🔏 Type password again"
                        onChange={handleChange}
                        required
                        className={`w-full px-5 py-4 pr-14 rounded-xl border outline-none transition ${
                           isDarkMode ? "bg-gray-800 border-gray-700 text-white focus:ring-amber-500/20" : "bg-gray-50 border-gray-300 focus:ring-blue-500/30"
                        }`}
                      />
                      <button type="button" onClick={toggleConfirmPassword} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                        {formData.showConfirmPassword ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isRegisterLoading}
                    className="w-full py-4 font-bold rounded-xl shadow-xl transform transition-all bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 cursor-pointer disabled:opacity-50"
                  >
                    {isRegisterLoading ? "Creating Account..." : "Register"}
                  </button>
                </form>

                <div className={`my-8 text-center ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>or continue with</div>

            <button
                  type="button"
                  onClick={handleGoogleRegister}
                  disabled={isGoogleLoading}
                  className={`group w-full cursor-pointer flex items-center justify-center gap-3 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
                    isGoogleLoading
                      ? "border-2 border-gray-300 bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-red-600 hover:border-red-600 hover:text-white hover:scale-105 hover:shadow-red-500/25"
                  }`}
                >
                  {isGoogleLoading ? (
                    <>
                      <div className="w-6 h-6 border-4 border-gray-500 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                      Google Sign-up...
                    </>
                  ) : (
                    <>
                      <FaGoogle className="text-2xl text-red-500 group-hover:text-white transition-colors flex-shrink-0" />
                      <span>Sign up with Google</span>
                    </>
                  )}
                </button>


                <p className={`text-center mt-8 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Already have an account? <Link to="/login" className="text-amber-500 font-bold hover:underline">Log in</Link>
                </p>
              </div>

              <div className={`hidden md:flex items-center justify-center p-10 bg-gradient-to-br ${
                isDarkMode ? "from-gray-800 to-gray-950" : "from-blue-500 via-purple-600 to-pink-600"
              }`}>
                <img src={registerGif} alt="Register" className="w-full max-w-md drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;