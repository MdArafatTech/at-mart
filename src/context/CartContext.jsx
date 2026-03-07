import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  // 1. ADD THIS STATE
  const [discount, setDiscount] = useState(0); 

  const addToCart = (product) => {
    const cartId = Math.random().toString(36).substr(2, 9);
    setCartItems((prev) => [...prev, { ...product, cartId }]);
  };

  const removeFromCart = (cartId) => {
    setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const clearCart = () => {
    setCartItems([]);
    setDiscount(0); // Reset discount when cart is purged
  };

  // 2. ADD THIS FUNCTION
  const applyCoupon = (code) => {
    if (code.toUpperCase() === "MARCH26") {
      setDiscount(0.15); // This is 15%
      return { success: true };
    } else {
      setDiscount(0);
      return { success: false };
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart,
      discount,      // 3. EXPOSE THESE
      applyCoupon    // 4. EXPOSE THESE
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);