import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, Clock, MapPin, ChevronRight, ImagePlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { restaurantAPI } from '../services/api'

export default function RestaurantCard({ restaurant, canManage = false, onChange }) {
  const navigate = useNavigate()
  const [uploading, setUploading] = useState(false)

  const cuisineColors = {
    'Indian': 'bg-orange-100 text-orange-700',
    'Chinese': 'bg-red-100 text-red-700',
    'Italian': 'bg-green-100 text-green-700',
    'Pizza': 'bg-yellow-100 text-yellow-700',
    'Burger': 'bg-blue-100 text-blue-700',
    'default': 'bg-gray-100 text-gray-700',
  }
  const cuisineClass = cuisineColors[restaurant.cuisine] || cuisineColors.default
  const menuItems = restaurant.menuItems || []
  const previewItems = menuItems.slice(0, 3)

  const handleImageUpload = async (event) => {
    event.stopPropagation()
    const image = event.target.files?.[0]
    if (!image) return

    try {
      setUploading(true)
      const res = await restaurantAPI.uploadImage(restaurant.id, image)
      onChange?.(res.data)
      toast.success('Restaurant image replaced')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not replace image')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div
      className="card cursor-pointer group"
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
    >
      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-orange-100 to-amber-50 overflow-hidden">
        {restaurant.imageUrl ? (
          <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">🍽️</span>
          </div>
        )}
        {/* Open/Closed badge */}
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold ${restaurant.isOpen ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
          {restaurant.isOpen ? '● Open' : '● Closed'}
        </div>
        {/* Cuisine tag */}
        <div className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${cuisineClass}`}>
          {restaurant.cuisine}
        </div>
        {canManage && (
          <label
            className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-gray-900/90 hover:bg-gray-900 text-white text-xs font-semibold px-2.5 py-1 rounded-full transition-all cursor-pointer"
            onClick={(event) => event.stopPropagation()}
          >
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
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="font-bold text-gray-900 text-base group-hover:text-primary-600 transition-colors line-clamp-1">
            {restaurant.name}
          </h3>
          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0 mt-0.5" />
        </div>

        <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="font-medium text-gray-700">{restaurant.rating?.toFixed(1) || '4.2'}</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {restaurant.deliveryTime || '30-40'} min
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate max-w-[100px]">{restaurant.address?.split(',')[0] || 'Nearby'}</span>
          </span>
        </div>

        {menuItems.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 mb-2">Menu items</p>
            <div className="flex flex-wrap gap-1.5">
              {previewItems.map(item => (
                <span key={item.id} className="px-2 py-1 rounded-lg bg-gray-50 text-xs font-medium text-gray-600 border border-gray-100">
                  {item.name}
                </span>
              ))}
              {menuItems.length > previewItems.length && (
                <span className="px-2 py-1 rounded-lg bg-primary-50 text-xs font-semibold text-primary-600">
                  +{menuItems.length - previewItems.length} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
