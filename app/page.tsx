import { ArrowRight, CheckCircle, Menu, X, Star, Zap, Shield, Clock, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                StackSuite
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-700 hover:text-indigo-600 transition">Features</Link>
              <Link href="#pricing" className="text-gray-700 hover:text-indigo-600 transition">Pricing</Link>
              <Link href="#testimonials" className="text-gray-700 hover:text-indigo-600 transition">Testimonials</Link>
              <Link href="/login" className="text-gray-700 hover:text-indigo-600 transition">Login</Link>
              <Link href="/signup" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all transform hover:scale-105">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full mb-6">
              <Zap className="w-4 h-4 text-indigo-600 mr-2" />
              <span className="text-sm font-medium text-indigo-700">Trusted by 1,000+ businesses</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              The All-in-One Platform for
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Growing Your Business
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Stop juggling multiple tools. Manage customers, bookings, payments, and grow your business 
              with one powerful platform designed for modern service businesses.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transition-all transform hover:scale-105">
                Start 14-Day Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <button className="inline-flex items-center px-8 py-3 bg-white text-gray-700 font-semibold rounded-full border border-gray-300 hover:border-indigo-600 hover:text-indigo-600 transition">
                Watch Demo (2 min)
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • Setup in 5 minutes • Cancel anytime
            </p>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl transform rotate-1"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gray-100 p-4 border-b">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total Customers', value: '2,451', change: '+12%' },
                    { label: 'Revenue', value: '$45,231', change: '+23%' },
                    { label: 'Bookings Today', value: '18', change: '+5%' },
                    { label: 'Satisfaction', value: '98%', change: '+2%' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-green-600">{stat.change}</p>
                    </div>
                  ))}
                </div>
                <div className="h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features that help you focus on what matters - growing your business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Smart CRM',
                description: 'Track every interaction, automate follow-ups, and never miss an opportunity.',
                color: 'from-blue-500 to-indigo-600'
              },
              {
                icon: Clock,
                title: 'Online Booking',
                description: 'Let customers book 24/7. Reduce no-shows with automated reminders.',
                color: 'from-indigo-500 to-purple-600'
              },
              {
                icon: TrendingUp,
                title: 'Analytics & Insights',
                description: 'Make data-driven decisions with real-time analytics and reports.',
                color: 'from-purple-500 to-pink-600'
              }
            ].map((feature, i) => (
              <div key={i} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl blur-xl"
                     style={{backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`}}></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '$99',
                features: ['Up to 500 customers', 'Basic CRM', 'Online booking', 'Email support'],
                popular: false
              },
              {
                name: 'Professional',
                price: '$249',
                features: ['Unlimited customers', 'Advanced CRM', 'Marketing automation', 'Priority support'],
                popular: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                features: ['Everything in Pro', 'API access', 'Custom integrations', 'Dedicated support'],
                popular: false
              }
            ].map((plan) => (
              <div key={plan.name} className={`relative ${plan.popular ? 'transform scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className={`bg-white rounded-2xl p-8 shadow-lg ${plan.popular ? 'border-2 border-indigo-600' : ''}`}>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-gray-600">/month</span>}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/signup"
                    className={`block text-center py-3 px-6 rounded-full font-semibold transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white font-semibold mb-2">StackSuite</p>
          <p>© 2024 StackSuite. Built with ❤️ in Ontario, Canada</p>
        </div>
      </footer>
    </div>
  )
}