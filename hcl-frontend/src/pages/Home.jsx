import React, { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, Flame, Star, X, Plus, Store } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import RestaurantCard from '../components/RestaurantCard'
import MenuItemCard from '../components/MenuItemCard'
import { restaurantAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

const FILTERS = ['All', 'All Menu Items', 'Pizza', 'Burger', 'Indian', 'Chinese', 'Italian', 'Biryani']

export default function Home() {
  const { user } = useAuth()
  const [restaurants, setRestaurants] = useState([])
  const [filtered,    setFiltered]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [search,      setSearch]      = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [error,       setError]       = useState(null)
  const canManageRestaurants = ['ADMIN', 'RESTAURANT'].includes(user?.role)
  const [addingRestaurant, setAddingRestaurant] = useState(false)
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    cuisine: '',
    address: '',
    rating: '4.2',
    open: true,
  })

  useEffect(() => {
    fetchRestaurants()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [search, activeFilter, restaurants])

  const allMenuItems = restaurants.flatMap(restaurant =>
    (restaurant.menuItems || []).map(item => ({
      ...item,
      restaurantId: item.restaurantId || restaurant.id,
      restaurantName: item.restaurantName || restaurant.name,
    }))
  )

  const query = search.trim().toLowerCase()
  const menuItemResults = (activeFilter === 'All Menu Items' || query)
    ? allMenuItems.filter(item =>
      !query ||
      item.name?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query)
    )
    : []
  const showMenuItems = activeFilter === 'All Menu Items' || menuItemResults.length > 0

  const fetchRestaurants = async () => {
    try {
      setLoading(true)
      const res = await restaurantAPI.getAll()
      setRestaurants(res.data)
    } catch (err) {
      setError('Failed to load restaurants. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let result = [...restaurants]
    if (activeFilter === 'All Menu Items') {
      setFiltered([])
      return
    }
    if (search.trim()) {
      const query = search.toLowerCase()
      result = result.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.cuisine.toLowerCase().includes(query)
      )
    }
    if (activeFilter !== 'All') {
      result = result.filter(r => r.cuisine.toLowerCase().includes(activeFilter.toLowerCase()))
    }
    setFiltered(result)
  }

  const handleSearch = (val) => {
    setSearch(val)
  }

  const handleRestaurantChange = (updatedRestaurant) => {
    setRestaurants(items =>
      items.map(item => item.id === updatedRestaurant.id ? updatedRestaurant : item)
    )
  }

  const handleMenuItemChange = (updatedItem) => {
    setRestaurants(items => items.map(restaurant => (
      restaurant.id === updatedItem.restaurantId
        ? {
          ...restaurant,
          menuItems: restaurant.menuItems?.map(item =>
            item.id === updatedItem.id ? updatedItem : item
          ) || [],
        }
        : restaurant
    )))
  }

  const handleAddRestaurant = async (event) => {
    event.preventDefault()
    try {
      setAddingRestaurant(true)
      const res = await restaurantAPI.create({
        ...newRestaurant,
        rating: Number(newRestaurant.rating),
      })
      setRestaurants(items => [res.data, ...items])
      setNewRestaurant({ name: '', cuisine: '', address: '', rating: '4.2', open: true })
      toast.success('Restaurant added')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add restaurant')
    } finally {
      setAddingRestaurant(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-primary-100 text-sm font-medium mb-1">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},</p>
              <h1 className="text-2xl md:text-3xl font-extrabold mb-1">{user?.name?.split(' ')[0]} 👋</h1>
              <p className="text-primary-100">What would you like to eat today?</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 text-center">
                <div className="font-bold text-lg">{restaurants.length}</div>
                <div className="text-primary-100 text-xs">Restaurants</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 text-center">
                <div className="font-bold text-lg">30</div>
                <div className="text-primary-100 text-xs">Min Delivery</div>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search food items, restaurants, cuisines..."
              className="w-full bg-white text-gray-800 pl-12 pr-4 py-3.5 rounded-2xl shadow-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-300"
              value={search}
              onChange={e => handleSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => { setSearch(''); applyFilters() }} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === f
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {canManageRestaurants && (
          <form onSubmit={handleAddRestaurant} className="bg-white rounded-2xl p-5 shadow-sm mt-5 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Store className="w-5 h-5 text-primary-500" />
              <h2 className="font-extrabold text-gray-900">Add Restaurant</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <input
                className="input-field md:col-span-1"
                placeholder="Restaurant name"
                value={newRestaurant.name}
                onChange={e => setNewRestaurant(data => ({ ...data, name: e.target.value }))}
                required
              />
              <input
                className="input-field md:col-span-1"
                placeholder="Cuisine"
                value={newRestaurant.cuisine}
                onChange={e => setNewRestaurant(data => ({ ...data, cuisine: e.target.value }))}
                required
              />
              <input
                className="input-field md:col-span-1"
                placeholder="Address"
                value={newRestaurant.address}
                onChange={e => setNewRestaurant(data => ({ ...data, address: e.target.value }))}
                required
              />
              <input
                className="input-field md:col-span-1"
                type="number"
                min="0"
                max="5"
                step="0.1"
                placeholder="Rating"
                value={newRestaurant.rating}
                onChange={e => setNewRestaurant(data => ({ ...data, rating: e.target.value }))}
                required
              />
              <button
                type="submit"
                disabled={addingRestaurant}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {addingRestaurant ? 'Adding...' : 'Add'}
              </button>
            </div>
          </form>
        )}

        {/* Section header */}
        <div className="flex items-center gap-2 mt-6 mb-4">
          <Flame className="w-5 h-5 text-primary-500" />
          <h2 className="text-lg font-bold text-gray-900">
            {showMenuItems ? 'Menu Items' : activeFilter === 'All' ? 'All Restaurants' : `${activeFilter} Restaurants`}
          </h2>
          {!loading && <span className="text-sm text-gray-400 ml-1">({showMenuItems ? menuItemResults.length : filtered.length})</span>}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
            <button onClick={fetchRestaurants} className="ml-auto text-red-500 underline">Retry</button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            {showMenuItems ? (
              menuItemResults.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">Food</div>
                  <h3 className="text-lg font-bold text-gray-700 mb-2">No menu items found</h3>
                  <p className="text-gray-400 text-sm">Try another food item name</p>
                  <button onClick={() => { setSearch(''); setActiveFilter('All') }} className="mt-4 btn-secondary text-sm px-5 py-2.5">
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menuItemResults.map((item, i) => (
                    <div key={item.id} className="animate-slide-up" style={{ animationDelay: `${i * 40}ms` }}>
                      <MenuItemCard item={item} canManage={canManageRestaurants} onChange={handleMenuItemChange} />
                    </div>
                  ))}
                </div>
              )
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🍽️</div>
                <h3 className="text-lg font-bold text-gray-700 mb-2">No restaurants found</h3>
                <p className="text-gray-400 text-sm">Try a different search or filter</p>
                <button onClick={() => { setSearch(''); setActiveFilter('All') }} className="mt-4 btn-secondary text-sm px-5 py-2.5">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((r, i) => (
                  <div key={r.id} className="animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <RestaurantCard
                      restaurant={r}
                      canManage={canManageRestaurants}
                      onChange={handleRestaurantChange}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
