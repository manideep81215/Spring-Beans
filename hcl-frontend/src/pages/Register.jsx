import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Phone, UtensilsCrossed } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// ✅ Field is defined OUTSIDE Register to prevent remount on every keystroke
const Field = ({
  label,
  name,
  type = 'text',
  icon: Icon,
  placeholder,
  value,
  onChange,
  error,
  showPass,
  setShowPass,
}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type={
          name === 'password' || name === 'confirmPassword'
            ? showPass
              ? 'text'
              : 'password'
            : type
        }
        className={`input-field pl-10 ${error ? 'border-red-400 focus:ring-red-300' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {name === 'password' && (
        <button
          type="button"
          onClick={() => setShowPass(!showPass)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )}
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
)

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'CUSTOMER',
  })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [errors, setErrors]     = useState({})

  const setField = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'First name is required'
    if (!form.lastName.trim()) e.lastName = 'Last name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    if (!form.phone) e.phone = 'Phone is required'
    else if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter 10-digit phone number'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Minimum 8 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    const result = await register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      phone: form.phone,
      role: form.role,
    })
    setLoading(false)
    if (result.success) navigate(form.role === 'RESTAURANT' ? '/orders' : '/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-md">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-extrabold">
            Food<span className="text-primary-500">Rush</span>
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Create account</h2>
          <p className="text-gray-500 text-sm mb-6">Join FoodRush and start ordering!</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field
              label="First name"
              name="firstName"
              icon={User}
              placeholder="John"
              value={form.firstName}
              error={errors.firstName}
              showPass={showPass}
              setShowPass={setShowPass}
              onChange={e => setField('firstName', e.target.value)}
            />
            <Field
              label="Last name"
              name="lastName"
              icon={User}
              placeholder="Doe"
              value={form.lastName}
              error={errors.lastName}
              showPass={showPass}
              setShowPass={setShowPass}
              onChange={e => setField('lastName', e.target.value)}
            />
            <Field
              label="Email address"
              name="email"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              value={form.email}
              error={errors.email}
              showPass={showPass}
              setShowPass={setShowPass}
              onChange={e => setField('email', e.target.value)}
            />
            <Field
              label="Phone number"
              name="phone"
              type="tel"
              icon={Phone}
              placeholder="10-digit mobile number"
              value={form.phone}
              error={errors.phone}
              showPass={showPass}
              setShowPass={setShowPass}
              onChange={e => setField('phone', e.target.value)}
            />
            <Field
              label="Password"
              name="password"
              icon={Lock}
              placeholder="Min 8 characters"
              value={form.password}
              error={errors.password}
              showPass={showPass}
              setShowPass={setShowPass}
              onChange={e => setField('password', e.target.value)}
            />
            <Field
              label="Confirm password"
              name="confirmPassword"
              icon={Lock}
              placeholder="Re-enter password"
              value={form.confirmPassword}
              error={errors.confirmPassword}
              showPass={showPass}
              setShowPass={setShowPass}
              onChange={e => setField('confirmPassword', e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
