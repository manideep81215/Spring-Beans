import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import RestaurantMenu from './pages/RestaurantMenu'
import Cart from './pages/Cart'
import OrderTracking from './pages/OrderTracking'
import OrderHistory from './pages/OrderHistory'
import About from './pages/About'
import Help from './pages/Help'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { borderRadius: '12px', fontFamily: 'Plus Jakarta Sans' },
              success: { style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' } },
              error:   { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' } },
            }}
          />
          <Routes>
            {/* Public routes */}
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route path="/"               element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/restaurant/:id" element={<ProtectedRoute><RestaurantMenu /></ProtectedRoute>} />
            <Route path="/cart"           element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/order/:id"      element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
            <Route path="/orders"         element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
            <Route path="/about"          element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path="/help"           element={<ProtectedRoute><Help /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
