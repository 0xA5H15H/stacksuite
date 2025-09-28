import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="flex">
          <div className="w-64 p-4">
            <h1 className="text-xl font-bold">StackSuite</h1>
          </div>
          <div className="flex-1 p-4">
            <div className="flex gap-6">
              <Link href="/dashboard" className="hover:text-blue-600">Overview</Link>
              <Link href="/dashboard/customers" className="hover:text-blue-600">Customers</Link>
              <Link href="/dashboard/bookings" className="hover:text-blue-600">Bookings</Link>
              <Link href="/dashboard/payments" className="hover:text-blue-600">Payments</Link>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}