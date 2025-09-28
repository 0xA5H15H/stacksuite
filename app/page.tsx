import { Users, Calendar, CreditCard, BarChart3 } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="p-6 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">StackSuite</h1>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Start Free Trial
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          The Operating System for Small Business
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Manage customers, bookings, and payments in one simple platform.
        </p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700">
          Get Started - 14 Days Free -new 
        </button>

        <div className="grid md:grid-cols-4 gap-8 mt-20">
          <div className="p-6">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Smart CRM</h3>
            <p className="text-gray-600">Track every customer automatically</p>
          </div>
          <div className="p-6">
            <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Online Booking</h3>
            <p className="text-gray-600">Let customers book 24/7</p>
          </div>
          <div className="p-6">
            <CreditCard className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Easy Payments</h3>
            <p className="text-gray-600">Get paid faster with less effort</p>
          </div>
          <div className="p-6">
            <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Real Analytics</h3>
            <p className="text-gray-600">See what&apos;s working instantly</p>
          </div>
        </div>
      </main>
    </div>
  )
}