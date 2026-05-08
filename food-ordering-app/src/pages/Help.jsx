import React from 'react'
import { Link } from 'react-router-dom'
import { HelpCircle, LifeBuoy, Mail, MessageCircle, PackageSearch, RefreshCcw } from 'lucide-react'
import Navbar from '../components/Navbar'

const faqs = [
  {
    question: 'How do I track an order?',
    answer: 'Open Orders from the navbar and select an active order to view the latest delivery status.',
  },
  {
    question: 'Can I change my delivery address?',
    answer: 'Enter the delivery address during checkout before placing the order.',
  },
  {
    question: 'Where can I see past orders?',
    answer: 'Your completed and active orders are available on the Orders page.',
  },
  {
    question: 'What should I do if an order fails?',
    answer: 'Refresh your Orders page first. If the issue continues, reach support with your order number.',
  },
]

const supportOptions = [
  { icon: MessageCircle, label: 'Chat support', value: 'Available inside your account soon' },
  { icon: Mail, label: 'Email', value: 'support@foodrush.local' },
  { icon: PackageSearch, label: 'Order help', value: 'Keep your order number ready' },
]

export default function Help() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-7">
          <div>
            <p className="text-primary-600 text-sm font-bold mb-2">Help Center</p>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">How can we help?</h1>
            <p className="text-gray-500 max-w-2xl">
              Find quick answers for ordering, tracking, checkout, and account support.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm text-sm font-semibold text-gray-700">
            <LifeBuoy className="w-4 h-4 text-primary-600" />
            Support ready
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-4 mb-6">
          {supportOptions.map(({ icon: Icon, label, value }) => (
            <div key={label} className="card p-5 border border-gray-100">
              <div className="w-11 h-11 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-primary-600" />
              </div>
              <h2 className="font-bold text-gray-900 mb-1">{label}</h2>
              <p className="text-sm text-gray-500 leading-6">{value}</p>
            </div>
          ))}
        </section>

        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 sm:px-6 py-5 border-b border-gray-100 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-extrabold text-gray-900">Frequently asked questions</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {faqs.map((item) => (
              <div key={item.question} className="px-5 sm:px-6 py-5">
                <h3 className="font-bold text-gray-900 mb-2">{item.question}</h3>
                <p className="text-sm text-gray-500 leading-6">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-gray-900 text-white p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
          <div>
            <h2 className="font-extrabold text-lg mb-1">Still stuck?</h2>
            <p className="text-gray-300 text-sm">Try refreshing your latest order status or contact support.</p>
          </div>
          <Link to="/orders" className="btn-primary inline-flex items-center justify-center gap-2 sm:w-auto">
            <RefreshCcw className="w-4 h-4" />
            Refresh Orders
          </Link>
        </section>
      </main>
    </div>
  )
}
