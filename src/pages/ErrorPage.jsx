import { motion } from "framer-motion";
import cartoonImg from "../assets/error.gif"; // replace with your cartoon image

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-pink-600 flex flex-col justify-center items-center px-4 text-center">
      {/* Cartoon */}
      <motion.img
        src={cartoonImg}
        alt="Error Cartoon"
        className="w-64 h-64 mb-8"
        initial={{ y: -50, opacity: 0, rotate: -10 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
      />

      {/* Error Text */}
      <motion.h1
        className="text-6xl font-bold text-white mb-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Oops!
      </motion.h1>
      <motion.p
        className="text-xl text-gray-200 mb-6 max-w-md"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Something went wrong. The page you are looking for does not exist.
      </motion.p>

      {/* Button */}
      <motion.a
        href="/"
        className="inline-block px-8 py-3 bg-red-500 text-white font-bold rounded-full shadow-lg hover:bg-red-600 transition-colors duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        Go Home
      </motion.a>

      {/* Floating balloons animation */}
      <motion.div
        className="absolute top-10 left-10 w-6 h-6 bg-yellow-400 rounded-full"
        animate={{ y: [0, -30, 0], x: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      />
      <motion.div
        className="absolute top-20 right-16 w-8 h-8 bg-green-400 rounded-full"
        animate={{ y: [0, -40, 0], x: [0, -15, 15, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
      />
    </div>
  );
};

export default ErrorPage;
