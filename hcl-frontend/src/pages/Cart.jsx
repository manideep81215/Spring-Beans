import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, MapPin, CreditCard, Wallet, Smartphone, Landmark } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useCart } from '../context/CartContext'
import { orderAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function Cart() {
  const navigate = useNavigate()
  const { cart, updateQuantity, removeFromCart, clearCart, fetchCart } = useCart()
  const [address, setAddress] = useState('')
  const [placing, setPlacing] = useState(false)
  const [addrErr, setAddrErr] = useState('')
  const [checkoutStep, setCheckoutStep] = useState('details')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [payment, setPayment] = useState({
    cardNumber: '',
    name: '',
    expiry: '',
    cvv: '',
    upiId: '',
    bank: '',
  })

  const items = cart?.items || []
  const subtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
  const deliveryFee = subtotal > 0 ? 30 : 0
  const total = subtotal + deliveryFee

  const handleContinueToPayment = () => {
    if (!address.trim()) {
      setAddrErr('Please enter a delivery address')
      return
    }
    setCheckoutStep('payment')
  }

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      setAddrErr('Please enter a delivery address')
      setCheckoutStep('details')
      return
    }

    setPlacing(true)
    try {
      const res = await orderAPI.placeOrder({ deliveryAddress: address })
      await clearCart()
      toast.success('Order placed successfully!')
      navigate(`/order/${res.data.id}`)
    } catch (err) {
      await fetchCart()
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  if (items.length === 0) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-7xl mb-6">Cart</div>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add some delicious items to your cart</p>
        <button onClick={() => navigate('/')} className="btn-primary">Browse Restaurants</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 font-medium text-sm mb-5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Continue shopping
        </button>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {items.map(item => (
              <div key={item.id} className="card flex items-center gap-4 p-4 animate-fade-in">
                {item.imageUrl && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{item.menuItemName || item.name}</h3>
                  <p className="text-primary-600 font-bold text-sm mt-0.5">Rs {(item.price * item.quantity).toFixed(0)}</p>
                  <p className="text-gray-400 text-xs">Rs {item.price} each</p>
                </div>

                <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white transition-colors">
                    <Minus className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <span className="text-sm font-bold text-gray-800 min-w-[20px] text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white transition-colors">
                    <Plus className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                </div>

                <button onClick={() => removeFromCart(item.id)} className="p-2 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-500" /> Delivery Address
              </h3>
              <textarea
                className={`input-field resize-none h-20 ${addrErr ? 'border-red-400 focus:ring-red-300' : ''}`}
                placeholder="Enter your complete delivery address..."
                value={address}
                onChange={e => { setAddress(e.target.value); setAddrErr('') }}
              />
              {addrErr && <p className="text-red-500 text-xs mt-1">{addrErr}</p>}
            </div>

            {checkoutStep === 'payment' && (
              <div className="bg-white rounded-2xl p-5 shadow-sm animate-slide-up">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary-500" /> Payment
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition-all ${
                      paymentMethod === 'card' ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" /> Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition-all ${
                      paymentMethod === 'upi' ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" /> UPI
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition-all ${
                      paymentMethod === 'netbanking' ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <Landmark className="w-4 h-4" /> Net Banking
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition-all ${
                      paymentMethod === 'cod' ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <Wallet className="w-4 h-4" /> Cash
                  </button>
                </div>

                {paymentMethod === 'card' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      className="input-field sm:col-span-2"
                      placeholder="Card number"
                      value={payment.cardNumber}
                      onChange={e => setPayment(data => ({ ...data, cardNumber: e.target.value }))}
                    />
                    <input
                      className="input-field sm:col-span-2"
                      placeholder="Name on card"
                      value={payment.name}
                      onChange={e => setPayment(data => ({ ...data, name: e.target.value }))}
                    />
                    <input
                      className="input-field"
                      placeholder="MM/YY"
                      value={payment.expiry}
                      onChange={e => setPayment(data => ({ ...data, expiry: e.target.value }))}
                    />
                    <input
                      className="input-field"
                      placeholder="CVV"
                      value={payment.cvv}
                      onChange={e => setPayment(data => ({ ...data, cvv: e.target.value }))}
                    />
                  </div>
                ) : paymentMethod === 'upi' ? (
                  <div className="grid grid-cols-1 gap-3">
                    <input
                      className="input-field"
                      placeholder="UPI ID"
                      value={payment.upiId}
                      onChange={e => setPayment(data => ({ ...data, upiId: e.target.value }))}
                    />
                    <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-sm text-gray-600">
                      Enter a UPI ID like name@bank and continue to place the order.
                    </div>
                  </div>
                ) : paymentMethod === 'netbanking' ? (
                  <div className="grid grid-cols-1 gap-3">
                    <select
                      className="input-field"
                      value={payment.bank}
                      onChange={e => setPayment(data => ({ ...data, bank: e.target.value }))}
                    >
                      <option value="">Select bank</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                    </select>
                    <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-sm text-gray-600">
                      Choose your bank to continue with net banking.
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-sm text-gray-600">
                    Pay when your order arrives.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-20">
              <h2 className="font-extrabold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary-500" /> Order Summary
              </h2>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} item{items.length > 1 ? 's' : ''})</span>
                  <span className="font-medium">Rs {subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery fee</span>
                  <span className="font-medium">{deliveryFee === 0 ? 'Free' : `Rs ${deliveryFee}`}</span>
                </div>
                <div className="border-t border-gray-100 pt-2.5 flex justify-between font-extrabold text-gray-900 text-base">
                  <span>Total</span>
                  <span className="text-primary-600">Rs {total.toFixed(0)}</span>
                </div>
              </div>

              <button
                onClick={checkoutStep === 'details' ? handleContinueToPayment : handlePlaceOrder}
                disabled={placing}
                className="btn-primary w-full mt-5 flex items-center justify-center gap-2"
              >
                {placing ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Placing order...</>
                ) : checkoutStep === 'details' ? (
                  `Proceed to Payment - Rs ${total.toFixed(0)}`
                ) : (
                  `Pay & Place Order - Rs ${total.toFixed(0)}`
                )}
              </button>

              {checkoutStep === 'payment' && (
                <button
                  type="button"
                  onClick={() => setCheckoutStep('details')}
                  className="w-full mt-2 py-2.5 text-sm font-semibold text-gray-500 hover:text-primary-600 transition-colors"
                >
                  Edit delivery details
                </button>
              )}

              <p className="text-xs text-gray-400 text-center mt-3">Secure checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
