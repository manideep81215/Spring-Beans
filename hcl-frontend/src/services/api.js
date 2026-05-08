import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const toNumber = (value) => {
  if (value === null || value === undefined) return value
  const parsed = Number(value)
  return Number.isNaN(parsed) ? value : parsed
}

const fullName = (user = {}) =>
  user.name || [user.firstName, user.lastName].filter(Boolean).join(' ').trim()

const normalizeUser = (user) => user ? {
  ...user,
  name: fullName(user) || user.email || 'User',
  role: user.role || 'CUSTOMER',
} : user

const normalizeMenuItem = (item) => item ? {
  ...item,
  price: toNumber(item.price),
  isAvailable: item.isAvailable ?? item.available ?? true,
  imageUrl: item.imageUrl || (
    item.imageData && item.imageContentType
      ? `data:${item.imageContentType};base64,${item.imageData}`
      : undefined
  ),
} : item

const normalizeRestaurant = (restaurant) => restaurant ? {
  ...restaurant,
  isOpen: restaurant.isOpen ?? restaurant.open ?? false,
  imageUrl: restaurant.imageUrl || (
    restaurant.imageData && restaurant.imageContentType
      ? `data:${restaurant.imageContentType};base64,${restaurant.imageData}`
      : undefined
  ),
  menuItems: restaurant.menuItems?.map(normalizeMenuItem) || restaurant.menuItems,
} : restaurant

const normalizeCart = (cart) => cart ? {
  ...cart,
  totalAmount: toNumber(cart.totalAmount),
  items: (cart.items || cart.cartItems || []).map(normalizeMenuItem),
} : cart

const normalizeOrder = (order) => order ? {
  ...order,
  totalAmount: toNumber(order.totalAmount),
  deliveryAddress: order.deliveryAddress || order.address,
  items: (order.items || order.orderItems || []).map(normalizeMenuItem),
} : order

const withData = (normalizer) => (response) => {
  response.data = Array.isArray(response.data)
    ? response.data.map(normalizer)
    : normalizer(response.data)
  return response
}

const normalizeAuthResponse = (response) => {
  response.data = {
    ...response.data,
    user: normalizeUser(response.data?.user),
  }
  return response
}

const toRegisterRequest = ({ name = '', firstName, lastName, role, ...rest }) => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return {
    ...rest,
    firstName: firstName || parts[0] || '',
    lastName: lastName || parts.slice(1).join(' ') || '',
    role: role || 'CUSTOMER',
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Handle 401 errors
    if (error.response?.status === 401) {
      // Don't redirect for auth endpoints - let them handle errors
      const url = error.config?.url || ''
      const isAuthEndpoint = /\/(auth\/(login|register|logout))/.test(url)
      
      if (!isAuthEndpoint) {
        // Token expired or invalid on protected endpoint
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    
    // Preserve the original error for the caller to handle
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (data) => api.post('/auth/login', data).then(normalizeAuthResponse),
  register: (data) => api.post('/auth/register', toRegisterRequest(data)).then(normalizeAuthResponse),
  logout: () => api.post('/auth/logout'),
}

export const restaurantAPI = {
  getAll: () => api.get('/restaurants').then(withData(normalizeRestaurant)),
  getById: (id) => api.get(`/restaurants/${id}`).then(withData(normalizeRestaurant)),
  getMenu: (id) => api.get(`/restaurants/${id}/menu`).then(withData(normalizeMenuItem)),
  search: (q) => api.get('/restaurants/search', { params: { q } }).then(withData(normalizeRestaurant)),
  create: (data) => api.post('/admin/restaurants', data).then(withData(normalizeRestaurant)),
  uploadImage: (id, image) => {
    const formData = new FormData()
    formData.append('image', image)
    return api.put(`/restaurants/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(withData(normalizeRestaurant))
  },
}

export const cartAPI = {
  getCart: () => api.get('/cart').then(withData(normalizeCart)),
  addItem: (data) => api.post('/cart/add', { price: 0, ...data }).then(withData(normalizeCart)),
  updateItem: (itemId, data) => api.put(`/cart/update/${itemId}`, data).then(withData(normalizeCart)),
  removeItem: (itemId) => api.delete(`/cart/remove/${itemId}`).then(withData(normalizeCart)),
  clearCart: () => api.delete('/cart/clear'),
}

export const orderAPI = {
  placeOrder: (data) => api.post('/orders/place', {
    address: data.address || data.deliveryAddress,
  }).then(withData(normalizeOrder)),
  getHistory: () => api.get('/orders/history').then(withData(normalizeOrder)),
  getById: (id) => api.get(`/orders/${id}`).then(withData(normalizeOrder)),
  getStatus: (id) => api.get(`/orders/${id}/status`),
  cancelOrder: (id) => api.put(`/orders/cancel/${id}`).then(withData(normalizeOrder)),
  updateStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }).then(withData(normalizeOrder)),
}

export const userAPI = {
  getProfile: () => api.get('/user/profile').then(withData(normalizeUser)),
  updateProfile: (data) => api.put('/user/profile', toRegisterRequest(data)).then(withData(normalizeUser)),
}

export const menuItemAPI = {
  create: (data) => api.post('/admin/menu-items', data).then(withData(normalizeMenuItem)),
  uploadImage: (id, image) => {
    const formData = new FormData()
    formData.append('image', image)
    return api.put(`/admin/menu-items/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(withData(normalizeMenuItem))
  },
}

export default api
