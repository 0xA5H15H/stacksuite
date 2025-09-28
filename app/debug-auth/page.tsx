'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DebugAuth() {
  const [email, setEmail] = useState('')
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const checkUser = async () => {
    if (!email) return
    setLoading(true)

    try {
      // Try to get user info
      const { data: userData, error: userError } = await supabase.auth.getUser()
      console.log('Current user:', { userData, userError })

      // Check if the email exists in auth.users (this will fail due to RLS, but good to try)
      const { data: authCheck, error: authCheckError } = await supabase
        .from('auth.users')
        .select('email')
        .eq('email', email)
        .limit(1)

      console.log('Auth check:', { authCheck, authCheckError })

      // Try a simple signup to see what happens
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: email,
        password: 'temppassword123'
      })

      setResults({
        currentUser: { userData, userError },
        authCheck: { authCheck, authCheckError },
        signupTest: { signupData, signupError }
      })

    } catch (error) {
      console.error('Debug error:', error)
      setResults({ error })
    } finally {
      setLoading(false)
    }
  }

  const clearAuthState = async () => {
    await supabase.auth.signOut()
    setResults({ message: 'Auth state cleared' })
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Auth Debug Tool</h1>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Test Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="test@example.com"
          />
        </div>

        <div className="space-x-4">
          <button
            onClick={checkUser}
            disabled={loading || !email}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Email'}
          </button>

          <button
            onClick={clearAuthState}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Clear Auth State
          </button>
        </div>
      </div>

      {Object.keys(results).length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold">Results:</h3>
          {Object.entries(results).map(([key, value]) => (
            <div key={key} className="bg-gray-100 p-4 rounded">
              <h4 className="font-semibold mb-2">{key}</h4>
              <pre className="text-sm overflow-auto bg-white p-2 rounded">
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-yellow-50 rounded">
        <h3 className="font-semibold mb-2">Quick Fixes:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Try a completely new email address</li>
          <li>Check if email confirmation is disabled in Supabase Auth settings</li>
          <li>Verify your Supabase project isn't paused</li>
          <li>Check for rate limiting (wait 1-2 minutes between attempts)</li>
        </ul>
      </div>
    </div>
  )
}