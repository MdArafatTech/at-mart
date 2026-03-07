import React, { useState } from "react";
import { useTheme } from "./context/ThemeContext";

// Components
import Sidebar from "./views/Sidebar";
import Header from "./views/Header"; // Added this missing import

// Pages
import Overview from "./views/Overview";
import Orders from "./views/Orders";

import Customers from "./views/Customers";
import Settings from "./views/Settings";

const Dashboard = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeView, setActiveView] = useState("overview"); 
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case "overview":  return <Overview isDarkMode={isDarkMode} />;
      case "orders":    return <Orders isDarkMode={isDarkMode} />;

      case "customers": return <Customers isDarkMode={isDarkMode} />;
      case "settings":  return <Settings isDarkMode={isDarkMode} />;
      default:          return <Overview isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden transition-all duration-500 ${isDarkMode ? "bg-[#05070a]" : "bg-[#f4f7fe]"}`}>
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isDarkMode={isDarkMode} 
        isOpen={isSidebarOpen} 
        setOpen={setSidebarOpen} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        <Header 
          activeView={activeView} 
          setSidebarOpen={setSidebarOpen} 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-12 space-y-8 custom-scrollbar">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;