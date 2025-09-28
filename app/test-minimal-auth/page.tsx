'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function TestMinimalAuth() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testBasicAuth = async () => {
    setLoading(true)

    try {
      // Create a fresh client
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      console.log('Testing with URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log('Anon key starts with:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 10))

      // Test 1: Basic connection
      const { data: healthData, error: healthError } = await supabase
        .from('businesses')
        .select('count')
        .limit(1)

      console.log('Health check:', { healthData, healthError })

      // Test 2: Try the most basic auth operation
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: `test-${Date.now()}@example.com`,
        password: 'test123456'
      })

      console.log('Auth test result:', { authData, authError })

      setResult({
        health: { healthData, healthError },
        auth: { authData, authError },
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        keyPrefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)
      })

    } catch (error) {
      console.error('Test error:', error)
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Minimal Auth Test</h1>

      <button
        onClick={testBasicAuth}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 mb-6"
      >
        {loading ? 'Testing...' : 'Test Basic Auth'}
      </button>

      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Test Results:</h3>
          <pre className="text-sm overflow-auto bg-white p-2 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6 p-4 bg-red-50 rounded">
        <h3 className="font-semibold text-red-800">If you still see 500 errors:</h3>
        <ul className="list-disc list-inside text-red-700 text-sm mt-2">
          <li>Your Supabase project may have infrastructure issues</li>
          <li>Try creating a new Supabase project</li>
          <li>Check Supabase Status page for outages</li>
          <li>Contact Supabase support</li>
        </ul>
      </div>
    </div>
  )
}