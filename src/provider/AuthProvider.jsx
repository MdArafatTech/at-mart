import React, { createContext, useContext, useEffect, useState } from "react";
// FIX: Point specifically to the Firebase.js file
import { auth, googleProvider } from "../firebase/Firebase"; 
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  signInWithPhoneNumber,
  updatePassword
} from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  const logout = () => signOut(auth);
  const resetPasswordByEmail = (email) => sendPasswordResetEmail(auth, email);
  const sendPhoneOTP = (phoneNumber, appVerifier) => signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  const updateUserPassword = (user, newPassword) => updatePassword(user, newPassword);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    register,
    login,
    loginWithGoogle,
    logout,
    resetPasswordByEmail,
    sendPhoneOTP,
    updateUserPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
