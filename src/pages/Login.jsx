import React, { useState } from "react";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import loginGif from "../assets/login.gif";
import { useAuth } from "../provider/AuthProvider";
// Added useLocation to catch the "from" state
import { useNavigate, Link, useLocation } from "react-router-dom";

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ CAPTURE REDIRECT PATH
  // If user came from cart, this will be "/cart". Otherwise, defaults to "/account"
  const from = location.state?.from || "/account";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    showPassword: false,
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showGoogleSuccessPopup, setShowGoogleSuccessPopup] = useState(false);
  
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrorMsg("");
  };

  const togglePassword = () => {
    setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsEmailLoading(true);

    try {
      await login(formData.email, formData.password);
      
      // ✅ SYNC WITH CART LOGIC
      localStorage.setItem("isLoggedIn", "true");
      
      setShowSuccessPopup(true);
      // Auto-redirect after 2 seconds
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 2000);
    } catch (error) {
      if (error.code === "auth/user-not-found" || error.code === "auth/invalid-email") {
        setErrorMsg("No account found with this email.");
      } else if (error.code === "auth/too-many-requests") {
        setErrorMsg("Too many attempts. Account temporarily locked.");
      } else {
        setErrorMsg("Incorrect Password, or not registered.");
      }
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      
      // ✅ SYNC WITH CART LOGIC
      localStorage.setItem("isLoggedIn", "true");
      
      setShowGoogleSuccessPopup(true);
      // Auto-redirect after 2 seconds
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 2000);
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") return;
      if (error.code === "auth/invalid-credential") {
        navigate("/register");
        return;
      }
      setErrorMsg("Google sign-in failed.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // ✅ UPDATED SUCCESS POPUP
  const SuccessPopup = ({ isGoogle = false }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 max-w-sm w-full mx-4 text-center transform scale-100 animate-in fade-in zoom-in duration-300">
        <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
          {isGoogle ? "Google Login Successful!" : "Login Successful!"}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Welcome back! You are being redirected to {from === "/cart" ? "complete your order..." : "your account..."}
        </p>
        <button
          onClick={() => navigate(from, { replace: true })}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 cursor-pointer hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition"
        >
          Proceed Now →
        </button>
      </div>
    </div>
  );

  return (
    <>
      {showSuccessPopup && <SuccessPopup />}
      {showGoogleSuccessPopup && <SuccessPopup isGoogle={true} />}

      <div className="bg-orange-50 dark:bg-gray-950 min-h-screen flex items-center justify-center p-4">
        <div className="w-full mt-13 max-w-5xl">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
            <div className="grid md:grid-cols-2">
              {/* Form Section */}
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Welcome Back</h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Log in to access your account</p>
                </div>

                {errorMsg && (
                  <div className="mb-6 p-5 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/40 dark:to-pink-950/30 border border-red-200 dark:border-red-900 rounded-2xl text-center">
                    <p className="text-red-800 dark:text-red-300 font-semibold mb-3">{errorMsg}</p>
                    {errorMsg.includes("No account found") && (
                      <button
                        onClick={() => navigate("/register")}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition"
                      >
                        Create Free Account
                      </button>
                    )}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="📩 you@example.com"
                      required
                      disabled={isEmailLoading}
                      className="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-4 focus:ring-blue-500/30 outline-none disabled:opacity-50 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                    <div className="relative">
                      <input
                        id="password"
                        type={formData.showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="🔑 Enter password"
                        required
                        disabled={isEmailLoading}
                        className="w-full px-5 py-4 pr-14 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-4 focus:ring-blue-500/30 outline-none disabled:opacity-50 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={togglePassword}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {formData.showPassword ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <Link to="/forgot" className="text-blue-600 dark:text-yellow-400 font-medium text-sm">Forgot Password?</Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isEmailLoading}
                    className={`w-full py-4 font-bold rounded-xl shadow-xl transform transition-all flex items-center justify-center gap-3 text-white ${
                      isEmailLoading
                        ? "bg-cyan-400 cursor-not-allowed animate-pulse"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 cursor-pointer"
                    }`}
                  >
                    {isEmailLoading ? "Signing in..." : "Log In"}
                  </button>
                </form>

                <div className="my-8 text-center text-gray-500">or continue with</div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  className={`group w-full flex items-center justify-center gap-3 py-4 border-2 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
                    isGoogleLoading
                      ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-red-600 hover:border-red-600 hover:text-white hover:scale-105 cursor-pointer"
                  }`}
                >
                  {isGoogleLoading ? "Google Sign-in..." : (
                    <>
                      <FaGoogle className="text-2xl text-red-500 group-hover:text-white" />
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>

                <p className="text-center mt-8 text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-blue-600 dark:text-yellow-400 font-bold cursor-pointer">
                    Register for free
                  </Link>
                </p>
              </div>

              {/* Image Section */}
              <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 p-10">
                <img src={loginGif} alt="Welcome" className="w-full max-w-md drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;