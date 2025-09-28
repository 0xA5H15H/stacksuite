'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestSupabase() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const testConnection = async () => {
    setLoading(true)
    const testResults: any = {}

    try {
      // Test 1: Basic connection
      console.log('Testing basic connection...')
      const { data: healthCheck, error: healthError } = await supabase
        .from('businesses')
        .select('count')
        .limit(1)

      testResults.healthCheck = { data: healthCheck, error: healthError }

      // Test 2: Check if tables exist
      console.log('Testing table existence...')
      const { data: tablesData, error: tablesError } = await supabase.rpc('version')
      testResults.tablesCheck = { data: tablesData, error: tablesError }

      // Test 3: Test auth
      console.log('Testing auth...')
      const { data: authData, error: authError } = await supabase.auth.getUser()
      testResults.authCheck = { data: authData, error: authError }

      // Test 4: Test insert (should fail due to RLS)
      console.log('Testing insert without auth (should fail)...')
      const { data: insertData, error: insertError } = await supabase
        .from('businesses')
        .insert({
          name: 'Test Business',
          email: 'test@example.com',
          user_id: '00000000-0000-0000-0000-000000000000',
          plan_tier: 'starter',
          onboarding_completed: false
        })

      testResults.insertTest = { data: insertData, error: insertError }

      console.log('All test results:', testResults)
      setResults(testResults)

    } catch (error) {
      console.error('Test error:', error)
      testResults.generalError = error
      setResults(testResults)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>

      <button
        onClick={testConnection}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Run Tests'}
      </button>

      {Object.keys(results).length > 0 && (
        <div className="space-y-4">
          {Object.entries(results).map(([testName, result]) => (
            <div key={testName} className="bg-gray-100 p-4 rounded">
              <h3 className="font-semibold mb-2">{testName}</h3>
              <pre className="text-sm overflow-auto bg-white p-2 rounded">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-yellow-50 rounded">
        <h3 className="font-semibold mb-2">Environment Check:</h3>
        <p><strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing'}</p>
        <p><strong>Supabase Anon Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}</p>
      </div>
    </div>
  )
}