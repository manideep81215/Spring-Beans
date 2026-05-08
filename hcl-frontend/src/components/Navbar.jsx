import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, LogOut, Home, Clock, Menu, X, UtensilsCrossed, Info, HelpCircle, ChevronDown, Mail, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount }    = useCart()
  const navigate         = useNavigate()
  const location         = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  const handleLogout = () => { logout(); navigate('/login') }
  const isActive = (path) => location.pathname === path
  const userInitial = user?.name?.trim()?.charAt(0)?.toUpperCase() || 'U'
  const firstName = user?.name?.split(' ')[0] || 'User'

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-gray-900">Food<span className="text-primary-500">Rush</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/') ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Home className="w-4 h-4" /> Home
            </Link>
            <Link to="/orders" className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/orders') ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Clock className="w-4 h-4" /> Orders
            </Link>
            <Link to="/about" className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/about') ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}>
              <Info className="w-4 h-4" /> About
            </Link>
            <Link to="/help" className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/help') ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}>
              <HelpCircle className="w-4 h-4" /> Help
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-xl hover:bg-primary-50 transition-colors group">
              <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-primary-500 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce-in">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            <div ref={profileRef} className="hidden md:flex items-center gap-2 pl-2 border-l border-gray-200 relative">
              <button
                type="button"
                onClick={() => setProfileOpen(open => !open)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors"
              >
                <div className="w-7 h-7 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-extrabold">
                  {userInitial}
                </div>
                <span className="text-sm font-medium text-gray-700">{firstName}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>
              <button onClick={handleLogout} className="p-2 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 animate-slide-up">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="w-14 h-14 bg-primary-500 text-white rounded-2xl flex items-center justify-center text-2xl font-extrabold">
                      {userInitial}
                    </div>
                    <div className="min-w-0">
                      <p className="font-extrabold text-gray-900 truncate">{user?.name || 'User'}</p>
                      <p className="text-sm text-gray-500 truncate">{user?.email || 'No email added'}</p>
                    </div>
                  </div>

                  <div className="py-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-primary-600" />
                      <span className="truncate">{user?.email || 'No email added'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                      <span className="capitalize">{user?.role || 'user'} profile</span>
                    </div>
                  </div>

                  <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-colors">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-xl hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 animate-slide-up">
          <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100">
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link to="/orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100">
            <Clock className="w-4 h-4" /> My Orders
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100">
            <Info className="w-4 h-4" /> About
          </Link>
          <Link to="/help" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100">
            <HelpCircle className="w-4 h-4" /> Help
          </Link>
          <div className="border-t border-gray-100 pt-2 mt-2">
            <div className="flex items-center gap-2 px-3 py-2">
              <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-extrabold">
                {userInitial}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-700 truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
