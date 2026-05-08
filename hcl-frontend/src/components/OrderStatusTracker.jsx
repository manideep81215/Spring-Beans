import React from 'react'
import { CheckCircle, Clock, ChefHat, Bike, Package } from 'lucide-react'

const STEPS = [
  { key: 'PLACED',           label: 'Order Placed',       icon: Package,    color: 'text-blue-500',  bg: 'bg-blue-100'  },
  { key: 'CONFIRMED',        label: 'Confirmed',           icon: CheckCircle,color: 'text-purple-500',bg: 'bg-purple-100'},
  { key: 'PREPARING',        label: 'Preparing',           icon: ChefHat,    color: 'text-orange-500',bg: 'bg-orange-100'},
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery',   icon: Bike,       color: 'text-yellow-500',bg: 'bg-yellow-100'},
  { key: 'DELIVERED',        label: 'Delivered',           icon: CheckCircle,color: 'text-green-500', bg: 'bg-green-100' },
]

export default function OrderStatusTracker({ status }) {
  const currentIdx = STEPS.findIndex(s => s.key === status)

  return (
    <div className="py-4">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full z-0" />
        <div
          className="absolute top-5 left-0 h-1 bg-primary-500 rounded-full z-0 transition-all duration-700"
          style={{ width: `${currentIdx === 0 ? 0 : (currentIdx / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step, idx) => {
          const Icon = step.icon
          const done    = idx <= currentIdx
          const current = idx === currentIdx

          return (
            <div key={step.key} className="flex flex-col items-center gap-2 z-10 flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                done
                  ? `${step.bg} border-transparent shadow-md ${current ? 'scale-110 ring-4 ring-primary-200' : ''}`
                  : 'bg-white border-gray-200'
              }`}>
                <Icon className={`w-5 h-5 ${done ? step.color : 'text-gray-300'}`} />
              </div>
              <span className={`text-xs font-medium text-center max-w-[70px] leading-tight ${done ? 'text-gray-800' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Status message */}
      {status === 'PLACED' && (
        <p className="text-center text-sm text-gray-500 mt-6 animate-pulse-soft">⏳ Waiting for restaurant to confirm your order...</p>
      )}
      {status === 'CONFIRMED' && (
        <p className="text-center text-sm text-gray-500 mt-6 animate-pulse-soft">✅ Restaurant confirmed! Getting ready to prepare your food.</p>
      )}
      {status === 'PREPARING' && (
        <p className="text-center text-sm text-orange-500 mt-6 animate-pulse-soft">👨‍🍳 Your food is being freshly prepared!</p>
      )}
      {status === 'OUT_FOR_DELIVERY' && (
        <p className="text-center text-sm text-yellow-600 mt-6 animate-pulse-soft">🛵 Your order is on the way to you!</p>
      )}
      {status === 'DELIVERED' && (
        <p className="text-center text-sm text-green-600 mt-6 font-medium">🎉 Delivered! Enjoy your meal!</p>
      )}
    </div>
  )
}
