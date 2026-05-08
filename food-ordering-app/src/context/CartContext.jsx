import React, { createContext, useContext, useState, useEffect } from 'react'
import { cartAPI } from '../services/api'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { token } = useAuth()
  const [cart, setCart]           = useState(null)
  const [cartCount, setCartCount] = useState(0)
  const [loading, setLoading]     = useState(false)

  useEffect(() => {
    if (token) fetchCart()
    else { setCart(null); setCartCount(0) }
  }, [token])

  const fetchCart = async () => {
    try {
      const res = await cartAPI.getCart()
      setCart(res.data)
      const count = res.data?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0
      setCartCount(count)
    } catch {
      setCart(null); setCartCount(0)
    }
  }

  const addToCart = async (menuItemId, quantity = 1, price = 0) => {
    setLoading(true)
    try {
      await cartAPI.addItem({ menuItemId, quantity, price })
      await fetchCart()
      toast.success('Added to cart! 🛒')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add item')
    } finally { setLoading(false) }
  }

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      if (quantity <= 0) { await removeFromCart(cartItemId); return }
      await cartAPI.updateItem(cartItemId, { quantity })
      await fetchCart()
    } catch { toast.error('Failed to update') }
  }

  const removeFromCart = async (cartItemId) => {
    try {
      await cartAPI.removeItem(cartItemId)
      await fetchCart()
      toast.success('Item removed')
    } catch { toast.error('Failed to remove item') }
  }

  const clearCart = async () => {
    try {
      await cartAPI.clearCart()
      await fetchCart()
    } catch { toast.error('Failed to clear cart') }
  }

  return (
    <CartContext.Provider value={{ cart, cartCount, loading, fetchCart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
