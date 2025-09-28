import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/ui/stat-card'
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Plus,
  Bell,
  Clock
} from 'lucide-react'

async function DashboardStats() {
  const supabase = createClient()

  // Get current user and business
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!business) return null

  // Get stats
  const today = new Date().toISOString().split('T')[0]
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]

  const [
    { count: totalCustomers },
    { count: bookingsToday },
    { data: monthlyBookings },
    { data: recentCustomers }
  ] = await Promise.all([
    supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', business.id),

    supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', business.id)
      .gte('date_time', today)
      .lt('date_time', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]),

    supabase
      .from('bookings')
      .select('price')
      .eq('business_id', business.id)
      .gte('date_time', firstDayOfMonth),

    supabase
      .from('customers')
      .select('name, email, created_at')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })
      .limit(5)
  ])

  const monthlyRevenue = monthlyBookings?.reduce((sum, booking) => sum + (booking.price || 0), 0) || 0
  const activeServices = 4 // This would come from a services table in a real app

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
        <p className="text-indigo-100">
          Here's what's happening with {business.name} today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Customers"
          value={totalCustomers || 0}
          change="+12% from last month"
          changeType="increase"
          icon={Users}
        />
        <StatCard
          title="Revenue This Month"
          value={`$${monthlyRevenue.toLocaleString()}`}
          change="+23% from last month"
          changeType="increase"
          icon={DollarSign}
        />
        <StatCard
          title="Bookings Today"
          value={bookingsToday || 0}
          change="+5% from yesterday"
          changeType="increase"
          icon={Calendar}
        />
        <StatCard
          title="Active Services"
          value={activeServices}
          change="2 new this month"
          changeType="increase"
          icon={TrendingUp}
        />
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors group">
              <div className="flex items-center">
                <Plus className="w-5 h-5 text-indigo-600 mr-3" />
                <span className="font-medium text-gray-900">Add New Customer</span>
              </div>
              <div className="text-indigo-600 group-hover:translate-x-1 transition-transform">→</div>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-purple-600 mr-3" />
                <span className="font-medium text-gray-900">Schedule Booking</span>
              </div>
              <div className="text-purple-600 group-hover:translate-x-1 transition-transform">→</div>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group">
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-green-600 mr-3" />
                <span className="font-medium text-gray-900">Send Reminders</span>
              </div>
              <div className="text-green-600 group-hover:translate-x-1 transition-transform">→</div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Customers</h2>
          {recentCustomers && recentCustomers.length > 0 ? (
            <div className="space-y-4">
              {recentCustomers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                      <p className="text-xs text-gray-500">{customer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(customer.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No customers yet</p>
              <p className="text-gray-400 text-xs">Add your first customer to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LoadingDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section Loading */}
      <div className="bg-gray-200 rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-64"></div>
      </div>

      {/* Stats Grid Loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <StatCard
            key={i}
            title=""
            value=""
            icon={Users}
            loading={true}
          />
        ))}
      </div>

      {/* Quick Actions and Recent Activity Loading */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="h-5 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="h-5 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <div className="p-6 lg:p-8">
      <Suspense fallback={<LoadingDashboard />}>
        <DashboardStats />
      </Suspense>
    </div>
  )
}