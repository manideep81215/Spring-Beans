import React from 'react'
import { Clock, ShieldCheck, Sparkles, Truck, UtensilsCrossed } from 'lucide-react'
import Navbar from '../components/Navbar'

const highlights = [
  {
    icon: UtensilsCrossed,
    title: 'Local favorites',
    text: 'Browse nearby restaurants and find meals that fit the moment.',
    bg: 'bg-primary-100',
    color: 'text-primary-600',
  },
  {
    icon: Clock,
    title: 'Fast ordering',
    text: 'Move from craving to checkout with a simple, focused flow.',
    bg: 'bg-blue-100',
    color: 'text-blue-600',
  },
  {
    icon: Truck,
    title: 'Live updates',
    text: 'Track your order status from the kitchen to your door.',
    bg: 'bg-green-100',
    color: 'text-green-600',
  },
]

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <section className="bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-3xl p-6 sm:p-8 mb-6 animate-fade-in">
          <div className="max-w-2xl">
            <p className="text-primary-100 text-sm font-semibold mb-2">About FoodRush</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Good food, delivered without the fuss.</h1>
            <p className="text-primary-50 leading-7">
              FoodRush helps you discover restaurants, build a cart, place orders, and follow every step until your food arrives.
            </p>
          </div>
        </section>

        <section className="grid sm:grid-cols-3 gap-4 mb-6">
          {highlights.map(({ icon: Icon, title, text, bg, color }) => (
            <div key={title} className="card p-5 border border-gray-100">
              <div className={`w-11 h-11 ${bg} rounded-2xl flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <h2 className="font-bold text-gray-900 mb-2">{title}</h2>
              <p className="text-sm text-gray-500 leading-6">{text}</p>
            </div>
          ))}
        </section>

        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">Why we built it</h2>
              <p className="text-gray-500 leading-7 mb-5">
                Ordering food should feel calm and reliable. FoodRush keeps restaurant discovery, cart management,
                checkout, order history, and tracking in one friendly place.
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                Secure account access and protected order details
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
