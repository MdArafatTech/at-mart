import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollTopButton = () => {
  const [visible, setVisible] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Detect dark/light mode
  const detectColorScheme = () => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    detectColorScheme();
    // Listen to changes in color scheme
    const darkModeListener = window.matchMedia("(prefers-color-scheme: dark)");
    darkModeListener.addEventListener("change", detectColorScheme);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      darkModeListener.removeEventListener("change", detectColorScheme);
    };
  }, []);

  return (
    <>
      {visible && (
        <button
          onClick={scrollToTop}
          className={`fixed cursor-pointer bottom-8 right-8 p-3 rounded-full shadow-lg transition-all z-50
            ${isDark ? "bg-orange-600 text-gray-800 " : "bg-orange-600 text-white hover:bg-orange-500"}`}
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </button>
      )}
    </>
  );
};

export default ScrollTopButton;
