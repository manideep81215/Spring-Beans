import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, ChevronRight, Package, RotateCcw } from 'lucide-react'
import Navbar from '../components/Navbar'
import { orderAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

const STATUS_STYLES = {
  PLACED:           { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Placed'           },
  CONFIRMED:        { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Confirmed'         },
  PREPARING:        { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Preparing'         },
  OUT_FOR_DELIVERY: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Out for Delivery'  },
  DELIVERED:        { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Delivered'         },
  CANCELLED:        { bg: 'bg-red-100',    text: 'text-red-700',    label: 'Cancelled'         },
}

export default function OrderHistory() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await orderAPI.getHistory()
      setOrders(res.data)
    } catch { setError('Failed to load orders') }
    finally  { setLoading(false) }
  }

  const canManageOrders = ['ADMIN', 'RESTAURANT'].includes(user?.role)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">{canManageOrders ? 'Current Orders' : 'My Orders'}</h1>
          <button onClick={fetchOrders} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors">
            <RotateCcw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[...Array(4)].map((_,i)=>(
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
                <div className="flex justify-between mb-3">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-5 bg-gray-200 rounded-full w-20" />
                </div>
                <div className="h-3 bg-gray-200 rounded w-40 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-28" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={fetchOrders} className="btn-secondary text-sm px-5 py-2.5">Retry</button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">{canManageOrders ? 'No current orders' : 'No orders yet'}</h3>
            <p className="text-gray-400 text-sm mb-6">{canManageOrders ? 'Incoming customer orders will appear here' : 'Your order history will appear here'}</p>
            <button onClick={() => navigate('/')} className="btn-primary">Order Now</button>
          </div>
        )}

        {/* Orders list */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-3">
            {orders.map((order, i) => {
              const st = STATUS_STYLES[order.status] || STATUS_STYLES.PLACED
              const isActive = !['DELIVERED','CANCELLED'].includes(order.status)
              return (
                <div
                  key={order.id}
                  className="card p-5 cursor-pointer hover:border-primary-200 border border-transparent transition-all animate-slide-up"
                  style={{ animationDelay: `${i*50}ms` }}
                  onClick={() => navigate(`/order/${order.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-1">Order #{order.id}</p>
                      <p className="font-bold text-gray-900">{order.restaurantName || 'Restaurant'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`badge ${st.bg} ${st.text}`}>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-current mr-1 animate-pulse" />}
                        {st.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5" />
                      {order.items?.length || 0} item{(order.items?.length||0)>1?'s':''} • ₹{order.totalAmount?.toFixed(0)}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {order.placedAt ? new Date(order.placedAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>

                  {isActive && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs font-semibold text-primary-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                        Live — tap to track
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
