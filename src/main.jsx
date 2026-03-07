// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import Routes from './routes/Routes'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from "./provider/AuthProvider"
import SearchProvider from './context/SearchContext'
import { CartProvider } from './context/CartContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
      <SearchProvider>
      <ThemeProvider>
        <RouterProvider router={Routes} />
      </ThemeProvider>
      </SearchProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
)