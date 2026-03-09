// src/services/orderService.js

export const getLocalOrders = () => {
  const data = localStorage.getItem("at_mart_orders");
  return data ? JSON.parse(data) : [];
};

export const placeOrder = (customerName, amount) => {
  const currentOrders = getLocalOrders();
  
  const newOrder = {
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    customer: customerName || "Guest User",
    amount: amount || (Math.random() * 500).toFixed(2),
    status: "Pending",
    time: new Date().toLocaleTimeString(),
    date: new Date().toLocaleDateString()
  };

  const updatedOrders = [newOrder, ...currentOrders];
  localStorage.setItem("at_mart_orders", JSON.stringify(updatedOrders));
  
  // This triggers the 'storage' event for other components to hear
  window.dispatchEvent(new Event("storage")); 
  return newOrder;
};