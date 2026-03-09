import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase/Firebase"; 
import { useAuth } from "../provider/AuthProvider"; // Assuming you have an AuthProvider
import { 
  doc, setDoc, onSnapshot, updateDoc, 
  serverTimestamp, getDoc 
} from "firebase/firestore";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const { currentUser } = useAuth();

  // --- 1. PERSISTENCE: Sync with Firebase on Refresh ---
  useEffect(() => {
    if (!currentUser) {
      setCartItems([]); // Clear local state if user logs out
      return;
    }

    // Listen to the user's specific cart document
    const cartRef = doc(db, "userCarts", currentUser.uid);
    const unsubscribe = onSnapshot(cartRef, (docSnap) => {
      if (docSnap.exists()) {
        setCartItems(docSnap.data().items || []);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  // --- 2. ADD TO CART (Updates Firebase) ---
  const addToCart = async (product) => {
    if (!currentUser) return alert("Please login to add items to cart");

    const cartRef = doc(db, "userCarts", currentUser.uid);
    const cartId = Math.random().toString(36).substr(2, 9);
    const newItem = { ...product, cartId, addedAt: new Date().toISOString() };

    try {
      const docSnap = await getDoc(cartRef);
      if (docSnap.exists()) {
        // Update existing list
        await updateDoc(cartRef, {
          items: [...docSnap.data().items, newItem]
        });
      } else {
        // Create new cart document
        await setDoc(cartRef, { items: [newItem] });
      }
    } catch (err) {
      console.error("Cart Update Error:", err);
    }
  };

  // --- 3. REMOVE FROM CART (Updates Firebase) ---
  const removeFromCart = async (cartId) => {
    if (!currentUser) return;
    const cartRef = doc(db, "userCarts", currentUser.uid);
    const updatedList = cartItems.filter((item) => item.cartId !== cartId);
    
    await updateDoc(cartRef, { items: updatedList });
  };

  // --- 4. CLEAR CART ---
  const clearCart = async () => {
    setDiscount(0);
    if (currentUser) {
      const cartRef = doc(db, "userCarts", currentUser.uid);
      await setDoc(cartRef, { items: [] });
    } else {
      setCartItems([]);
    }
  };

  const applyCoupon = (code) => {
    if (code.toUpperCase() === "MARCH26") {
      setDiscount(0.15);
      return { success: true };
    } else {
      setDiscount(0);
      return { success: false };
    }
  };

  // --- 5. PROCESS ORDER (Final Checkout) ---
  const processOrder = async (customerDetails) => {
    if (cartItems.length === 0) return { success: false, message: "Cart is empty" };

    const subtotal = cartItems.reduce((acc, item) => acc + Number(item.price), 0);
    const finalTotal = subtotal - (subtotal * discount);

    const orderPayload = {
      orderId: `AT-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: customerDetails,
      userId: currentUser?.uid || "guest",
      items: cartItems.map(item => ({ name: item.name, price: item.price })),
      total: finalTotal.toFixed(2),
      status: "Pending",
      date: new Date().toISOString(),
      createdAt: serverTimestamp() 
    };

    try {
      await addDoc(collection(db, "myOrders"), orderPayload);
      await clearCart(); // Clears the Firebase 'userCarts' doc
      return { success: true };
    } catch (error) {
      console.error("Firebase Sync Error:", error);
      return { success: false, error };
    }
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart,
      discount,      
      applyCoupon,
      processOrder 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);