'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

// Prefer using generated Supabase types if available (see below). Otherwise define a minimal type:
type Customer = {
  id: string | number
  name: string
  email: string
  phone?: string | null
  business_id?: string
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])

  useEffect(() => {
    fetchCustomers()
  }, [])

  async function fetchCustomers() {
    const { data } = await supabase.from('customers').select('*')
    if (data) setCustomers(data as Customer[])
  }

  async function addCustomer() {
    const name = prompt('Customer name:')
    const email = prompt('Customer email:')
    if (name && email) {
      await supabase.from('customers').insert({ name, email, business_id: 'temp-id' })
      fetchCustomers()
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <button onClick={addCustomer} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Customer
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="border-b">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Phone</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b">
                <td className="p-4">{customer.name}</td>
                <td className="p-4">{customer.email}</td>
                <td className="p-4">{customer.phone || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
