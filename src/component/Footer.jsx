import React from "react";
import {
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaApplePay,
} from "react-icons/fa";
import { MdEmail, MdLocationOn, MdPhone, MdShield } from "react-icons/md";
import fimg from "../assets/AT-mart.png";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Footer = () => {
  const { isDarkMode } = useTheme();

  const socialLinks = [
    {
      Icon: FaFacebook,
      href: "https://www.facebook.com/md.al.arafat.84/",
      color: "hover:bg-[#1877F2]", // Facebook Blue
      label: "Facebook",
    },
    {
      Icon: FaInstagram,
      href: "https://instagram.com/yourhandle",
      color:
        "hover:bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]", // Insta Gradient
      label: "Instagram",
    },
    {
      Icon: MdEmail,
      href: "mailto:mdalarafatabir@gmail.com",
      color: "hover:bg-emerald-500", // Email Emerald
      label: "Email",
    },
    {
      Icon: FaLinkedin,
      href: "https://linkedin.com/in/yourprofile",
      color: "hover:bg-[#0077b5]", // LinkedIn Blue
      label: "LinkedIn",
    },
  ];

  const footerSections = [
    {
      title: "Shop Categories",
      links: [
        { name: "New Arrivals", path: "/newarrivals" },
        { name: "Best Sellers", path: "/sale" },
        { name: "Categories", path: "/categories" },
        { name: "Shop", path: "/shop" },
      ],
    },
    {
      title: "Customer Support",
      links: [
        { name: "Order Tracking", path: "/ordertracking" },
        { name: "Shipping Policy", path: "/shippingpolicy" },
        { name: "Returns & Exchanges", path: "/returnpolicy" },
        { name: "FAQs", path: "/faq" },
      ],
    },
  ];

  return (
    <footer
      className={`w-full pt-20 pb-10 px-6 md:px-12 lg:px-20 border-t transition-colors duration-300 ${
        isDarkMode
          ? "bg-gray-950 text-gray-100 border-gray-800"
          : "bg-white text-gray-900 border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Section: Brand & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start">
            <Link to="/" className="mb-6 block">
              <img
                src={fimg}
                alt="ArafatTECH"
                className="h-20 w-auto"
                style={{ filter: isDarkMode ? "brightness(1.2)" : "none" }}
              />
            </Link>
            <p
              className={`text-sm mb-6 max-w-sm text-center lg:text-left ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Your premium destination for high-quality tech and lifestyle
              products. Elevate your experience with Arafat-Tech.
            </p>

            <div className="flex gap-4">
              {socialLinks.map(({ Icon, href, color, label }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`p-3 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:text-white flex items-center justify-center ${
                    isDarkMode
                      ? "bg-gray-800 text-gray-400"
                      : "bg-gray-100 text-gray-600"
                  } ${color}`}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-bold text-lg mb-6 uppercase tracking-wider text-amber-500">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className={`text-sm transition-colors ${
                          isDarkMode
                            ? "text-gray-400 hover:text-white"
                            : "text-gray-600 hover:text-black"
                        }`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter Column */}
            <div className="col-span-2 md:col-span-1">
              <h3 className="font-bold text-lg mb-6 uppercase tracking-wider text-emerald-500">
                Stay Updated
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Subscribe to get special offers and once-in-a-lifetime deals.
              </p>
              <form className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`px-4 py-2.5 rounded-lg text-sm outline-none border ${
                    isDarkMode
                      ? "bg-gray-900 border-gray-700"
                      : "bg-gray-50 border-gray-200"
                  } focus:border-amber-500`}
                />
                <button className="bg-amber-500 cursor-pointer hover:bg-amber-600 text-white font-bold py-2.5 rounded-lg text-sm transition-all">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Middle Section: Trust Badges */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-y ${isDarkMode ? "border-gray-800" : "border-gray-100"}`}
        >
          <div className="flex items-center gap-4 justify-center">
            <MdShield className="text-amber-500" size={32} />
            <div>
              <p className="font-bold text-sm">Secure Payment</p>
              <p className="text-xs text-gray-500">
                100% secure payment processing
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center">
            <a href="tel:+8801303180712">
              {" "}
              <MdPhone className="text-emerald-500" size={32} />
            </a>
            <div>
              <p className="font-bold text-sm">24/7 Support</p>
              <p className="text-xs text-gray-500">
                Dedicated support via email/call
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center">
            <a href="">
              {" "}
              <MdLocationOn className="text-blue-500" size={32} />
            </a>
            <div>
              <p className="font-bold text-sm">Worldwide Shipping</p>
              <p className="text-xs text-gray-500">
                Fast delivery to your doorstep
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Payment Icons & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-10 gap-6">
          <div
            className={`text-sm ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
          >
            © {new Date().getFullYear()} AT-mart Ltd. All rights reserved.
          </div>

          <div className="flex items-center gap-4 opacity-60">
            <FaCcVisa size={30} />
            <FaCcMastercard size={30} />
            <FaCcPaypal size={30} />
            <FaApplePay size={35} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
