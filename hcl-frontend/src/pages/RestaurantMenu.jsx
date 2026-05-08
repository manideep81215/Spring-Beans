import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, Clock, MapPin, ShoppingCart, Search, Plus, UtensilsCrossed } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import MenuItemCard from '../components/MenuItemCard'
import { menuItemAPI, restaurantAPI } from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function RestaurantMenu() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const { cartCount } = useCart()
  const { user } = useAuth()

  const [restaurant, setRestaurant] = useState(null)
  const [menuItems,  setMenuItems]  = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const canManageMenu = ['ADMIN', 'RESTAURANT'].includes(user?.role)
  const [addingItem, setAddingItem] = useState(false)
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    price: '',
    available: true,
  })

  useEffect(() => { fetchData() }, [id])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [resRes, menuRes] = await Promise.all([
        restaurantAPI.getById(id),
        restaurantAPI.getMenu(id),
      ])
      setRestaurant(resRes.data)
      setMenuItems(menuRes.data)
      const cats = ['All', ...new Set(menuRes.data.map(i => i.category).filter(Boolean))]
      setCategories(cats)
    } catch {
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const filtered = menuItems.filter(item => {
    const matchesCat    = activeCategory === 'All' || item.category === activeCategory
    const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase())
    return matchesCat && matchesSearch
  })

  const handleMenuItemChange = (updatedItem) => {
    setMenuItems(items => items.map(item => item.id === updatedItem.id ? updatedItem : item))
  }

  const handleAddMenuItem = async (event) => {
    event.preventDefault()
    try {
      setAddingItem(true)
      const res = await menuItemAPI.create({
        restaurantId: Number(id),
        name: newItem.name,
        category: newItem.category,
        price: Number(newItem.price),
        available: newItem.available,
      })
      setMenuItems(items => [res.data, ...items])
      setCategories(current => current.includes(res.data.category) ? current : [...current, res.data.category])
      setNewItem({ name: '', category: '', price: '', available: true })
      toast.success('Menu item added')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add menu item')
    } finally {
      setAddingItem(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-4">
        <div className="h-48 bg-gray-200 rounded-2xl" />
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_,i)=><div key={i} className="h-28 bg-white rounded-2xl shadow-sm"/>)}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">

        {/* Back button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 font-medium text-sm mt-4 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to restaurants
        </button>

        {/* Restaurant header */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-6">
          <div className="h-48 bg-gradient-to-br from-orange-100 to-amber-50 relative overflow-hidden">
            {restaurant?.imageUrl ? (
              <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">🍽️</div>
            )}
            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${restaurant?.isOpen ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
              {restaurant?.isOpen ? '● Open' : '● Closed'}
            </div>
          </div>
          <div className="p-5">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">{restaurant?.name}</h1>
            <p className="text-gray-500 text-sm mb-3">{restaurant?.cuisine}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-gray-800">{restaurant?.rating?.toFixed(1) || '4.2'}</span>
              </span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400" />{restaurant?.deliveryTime || '30-40'} min</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" />{restaurant?.address}</span>
            </div>
          </div>
        </div>

        {canManageMenu && (
          <form onSubmit={handleAddMenuItem} className="bg-white rounded-2xl p-5 shadow-sm mb-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <UtensilsCrossed className="w-5 h-5 text-primary-500" />
              <h2 className="font-extrabold text-gray-900">Add Menu Item</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                className="input-field"
                placeholder="Item name"
                value={newItem.name}
                onChange={e => setNewItem(data => ({ ...data, name: e.target.value }))}
                required
              />
              <input
                className="input-field"
                placeholder="Category"
                value={newItem.category}
                onChange={e => setNewItem(data => ({ ...data, category: e.target.value }))}
                required
              />
              <input
                className="input-field"
                type="number"
                min="0"
                step="1"
                placeholder="Price"
                value={newItem.price}
                onChange={e => setNewItem(data => ({ ...data, price: e.target.value }))}
                required
              />
              <button
                type="submit"
                disabled={addingItem}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {addingItem ? 'Adding...' : 'Add item'}
              </button>
            </div>
          </form>
        )}

        {/* Search menu */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search menu items..."
            className="input-field pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Category tabs */}
        {categories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-5">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === c ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* Menu items */}
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-500">No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item, i) => (
              <div key={item.id} className="animate-slide-up" style={{ animationDelay: `${i * 40}ms` }}>
                <MenuItemCard item={item} canManage={canManageMenu} onChange={handleMenuItemChange} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating cart button */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-3 bg-primary-500 text-white px-6 py-3.5 rounded-2xl shadow-2xl hover:bg-primary-600 transition-all active:scale-95"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-bold">View Cart</span>
            <span className="bg-white text-primary-600 text-sm font-bold px-2 py-0.5 rounded-full">{cartCount}</span>
          </button>
        </div>
      )}
    </div>
  )
}
