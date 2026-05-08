import React, { useState } from 'react'
import { Plus, Minus, ShoppingCart, ImagePlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import { menuItemAPI } from '../services/api'

export default function MenuItemCard({ item, canManage = false, onChange }) {
  const { addToCart, loading } = useCart()
  const [qty, setQty]         = useState(0)
  const [adding, setAdding]   = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleAdd = async () => {
    setAdding(true)
    await addToCart(item.id, qty > 0 ? qty : 1, item.price)
    setQty(0)
    setAdding(false)
  }

  const handleImageUpload = async (event) => {
    const image = event.target.files?.[0]
    if (!image) return

    try {
      setUploading(true)
      const res = await menuItemAPI.uploadImage(item.id, image)
      onChange?.(res.data)
      toast.success('Menu item image replaced')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not replace image')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="card flex gap-4 p-4 group">
      {/* Text */}
      <div className="flex-1 min-w-0">
        {/* Veg/Non-veg indicator */}
        <div className={`inline-flex items-center gap-1 mb-1.5 ${item.isVeg ? 'text-green-600' : 'text-red-500'}`}>
          <div className={`w-3.5 h-3.5 border-2 rounded-sm flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-500'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-500'}`} />
          </div>
          <span className="text-xs font-medium">{item.isVeg ? 'Veg' : 'Non-Veg'}</span>
        </div>

        <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">{item.name}</h4>

        {item.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-2">{item.description}</p>
        )}

        <div className="flex items-center justify-between gap-3">
          <span className="font-bold text-gray-900">₹{item.price?.toFixed(0)}</span>

          {/* Add button */}
          {canManage ? (
            <label className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer">
              <ImagePlus className="w-3.5 h-3.5" />
              {uploading ? 'Uploading...' : 'Image'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={handleImageUpload}
              />
            </label>
          ) : !item.isAvailable ? (
            <span className="text-xs text-gray-400 font-medium bg-gray-100 px-3 py-1.5 rounded-lg">Unavailable</span>
          ) : qty === 0 ? (
            <button
              onClick={handleAdd}
              disabled={adding || loading}
              className="flex items-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-3 py-1.5 rounded-xl transition-all active:scale-95 disabled:opacity-60"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-primary-500 rounded-xl px-1 py-1">
              <button onClick={() => setQty(q => Math.max(0, q - 1))} className="w-6 h-6 flex items-center justify-center text-white hover:bg-primary-600 rounded-lg">
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-white font-bold text-sm min-w-[16px] text-center">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="w-6 h-6 flex items-center justify-center text-white hover:bg-primary-600 rounded-lg">
                <Plus className="w-3 h-3" />
              </button>
              <button onClick={handleAdd} disabled={adding} className="bg-white text-primary-600 text-xs font-bold px-2 py-1 rounded-lg ml-1 hover:bg-primary-50 transition-colors">
                ADD
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image */}
      {item.imageUrl && (
        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      )}
    </div>
  )
}
