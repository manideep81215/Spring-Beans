import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, Receipt, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import OrderStatusTracker from '../components/OrderStatusTracker'
import { orderAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

const STATUS_TIMES = {
  PLACED:           { label: 'Order placed',      eta: '~35 min' },
  CONFIRMED:        { label: 'Order confirmed',    eta: '~30 min' },
  PREPARING:        { label: 'Being prepared',     eta: '~20 min' },
  OUT_FOR_DELIVERY: { label: 'Out for delivery',   eta: '~10 min' },
  DELIVERED:        { label: 'Delivered!',         eta: 'Enjoy!' },
}

const STATUS_OPTIONS = ['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']

const isRestaurantStaff = (user) => ['ADMIN', 'RESTAURANT'].includes(user?.role)

export default function OrderTracking() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [order,   setOrder]   = useState(null)
  const [status,  setStatus]  = useState('PLACED')
  const [nextStatus, setNextStatus] = useState('PLACED')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const canManageOrder = isRestaurantStaff(user)

  const fetchOrder = useCallback(async () => {
    try {
      const res = await orderAPI.getById(id)
      setOrder(res.data)
      setStatus(res.data.status)
      setNextStatus(res.data.status)
    } catch { navigate('/orders') }
    finally  { setLoading(false) }
  }, [id])

  const handleStatusUpdate = async () => {
    try {
      setUpdating(true)
      const res = await orderAPI.updateStatus(id, nextStatus)
      setOrder(res.data)
      setStatus(res.data.status)
      setNextStatus(res.data.status)
      toast.success('Order status updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update order status')
    } finally {
      setUpdating(false)
    }
  }

  const handleCancelOrder = async () => {
    try {
      setCancelling(true)
      await orderAPI.cancelOrder(id)
      setShowCancelConfirm(false)
      toast.success('Order cancelled')
      fetchOrder()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel order')
    } finally {
      setCancelling(false)
    }
  }

  useEffect(() => {
    fetchOrder()
    // Poll every 30 seconds for status updates
    const interval = setInterval(() => {
      if (status !== 'DELIVERED' && status !== 'CANCELLED') {
        fetchOrder()
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [fetchOrder, status])

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Loading order details...</p>
      </div>
    </div>
  )

  const statusInfo = STATUS_TIMES[status] || STATUS_TIMES.PLACED

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">

        <button onClick={() => navigate('/orders')} className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 font-medium text-sm mb-5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> My Orders
        </button>

        {/* Status header card */}
        <div className={`rounded-3xl p-6 mb-5 text-white ${status === 'DELIVERED' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-primary-500 to-primary-600'}`}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-white/80 text-sm font-medium">Order #{order?.id}</p>
              <h2 className="text-2xl font-extrabold mt-0.5">{statusInfo.label}</h2>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 text-center">
              <div className="font-bold text-lg">{statusInfo.eta}</div>
              <div className="text-white/70 text-xs">ETA</div>
            </div>
          </div>
          {status !== 'DELIVERED' && (
            <p className="text-white/70 text-xs mt-1">
              <Clock className="w-3 h-3 inline mr-1" />
              Auto-updates every 30 seconds
            </p>
          )}
        </div>

        {/* Status tracker */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h3 className="font-bold text-gray-900">Order Progress</h3>
            {canManageOrder && (
              <div className="flex items-center gap-2">
                <select
                  value={nextStatus}
                  onChange={e => setNextStatus(e.target.value)}
                  className="input-field py-2 text-sm"
                >
                  {STATUS_OPTIONS.map(option => (
                    <option key={option} value={option}>{STATUS_TIMES[option]?.label || 'Cancelled'}</option>
                  ))}
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updating || nextStatus === status}
                  className="btn-primary text-sm px-4 py-2 disabled:opacity-60"
                >
                  {updating ? 'Saving...' : 'Update'}
                </button>
              </div>
            )}
          </div>
          <OrderStatusTracker status={status} />
        </div>

        {/* Delivery info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-5">
          <h3 className="font-bold text-gray-900 mb-3">Delivery Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3 text-gray-600">
              <MapPin className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
              <span>{order?.deliveryAddress || 'Address not provided'}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Clock className="w-4 h-4 text-primary-500" />
              <span>Placed at: {order?.placedAt ? new Date(order.placedAt).toLocaleTimeString() : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Order items */}
        {order?.items?.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm mb-5">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-primary-500" /> Order Items
            </h3>
            <div className="space-y-2">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm py-1.5 border-b border-gray-50 last:border-0">
                  <div>
                    <span className="font-medium text-gray-800">{item.menuItemName || item.name}</span>
                    <span className="text-gray-400 ml-2">×{item.quantity}</span>
                  </div>
                  <span className="font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center text-sm font-bold pt-2 text-primary-600">
                <span>Total</span>
                <span>₹{order?.totalAmount?.toFixed(0)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Cancel button */}
        {!canManageOrder && (status === 'PLACED' || status === 'CONFIRMED') && (
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="w-full py-3 border-2 border-red-200 text-red-500 rounded-2xl font-semibold hover:bg-red-50 transition-colors text-sm"
          >
            Cancel Order
          </button>
        )}
      </div>

      {showCancelConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 px-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5 animate-bounce-in">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-2">Cancel this order?</h3>
            <p className="text-sm text-gray-500 mb-5">
              Your order will be marked as cancelled and the restaurant will stop processing it.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowCancelConfirm(false)}
                disabled={cancelling}
                className="py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
