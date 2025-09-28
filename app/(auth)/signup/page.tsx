'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    businessEmail: '',
    businessPhone: '',
    industry: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      console.log('Starting signup process...')

      // Test basic Supabase connection first
      const { data: testData, error: testError } = await supabase
        .from('businesses')
        .select('count')
        .limit(1)

      console.log('Supabase connection test:', { testData, testError })

      // Create auth user
      console.log('Creating auth user with email:', formData.email)

      // First check if user already exists
      const { data: existingUser, error: checkError } = await supabase.auth.getUser()
      console.log('Existing user check:', { existingUser, checkError })

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      console.log('Auth signup result:', {
        user: authData.user ? 'User created' : 'No user',
        session: authData.session ? 'Session created' : 'No session',
        error: authError
      })

      if (authError) {
        console.error('Auth error details:', {
          message: authError.message,
          status: authError.status,
          statusCode: authError.statusCode,
          name: authError.name,
          stack: authError.stack
        })

        // Handle specific error cases
        if (authError.message?.includes('User already registered')) {
          setError('An account with this email already exists. Please try logging in instead.')
        } else if (authError.message?.includes('Database error')) {
          setError('There was a database error creating your account. Please try again in a few minutes, or contact support if the issue persists.')
        } else if (authError.message?.includes('Invalid email')) {
          setError('Please enter a valid email address.')
        } else {
          setError(`Account creation failed: ${authError.message}`)
        }
        setLoading(false)
        return
      }

      if (authData.user) {
        console.log('User created successfully, user ID:', authData.user.id)

        // Check if we have a session after signup
        if (!authData.session) {
          console.warn('No session after signup - this means email confirmation is required')
          setError('Please check your email and click the confirmation link to complete your account setup.')
          setLoading(false)
          return
        }

        console.log('Session created, proceeding with business creation')

        // Set the session explicitly
        const { error: sessionError } = await supabase.auth.setSession(authData.session)
        if (sessionError) {
          console.error('Session setting error:', sessionError)
          setError('Authentication error. Please try again.')
          setLoading(false)
          return
        }

        // Wait a moment for session to propagate
        await new Promise(resolve => setTimeout(resolve, 500))

        // Create business record (no trigger interference now)
        const businessData = {
          name: formData.businessName,
          email: formData.businessEmail || formData.email,
          phone: formData.businessPhone || null,
          industry: formData.industry || null,
          user_id: authData.user.id,
          plan_tier: 'starter',
          plan: 'starter',
          onboarding_completed: false
        }

        console.log('Creating business with data:', businessData)

        const { data: businessResult, error: businessError } = await supabase
          .from('businesses')
          .insert(businessData)
          .select()

        console.log('Business creation result:', { businessResult, businessError })

        if (businessError) {
          console.error('Business creation error:', businessError)
          setError(`Account created but there was an issue setting up your business: ${businessError.message || 'Please try logging in.'}`)
        } else {
          console.log('Business created successfully:', businessResult)
          router.push('/dashboard')
          router.refresh()
        }
      } else {
        console.error('No user created in auth response')
        setError('User creation failed')
      }
    } catch (err) {
      console.error('Signup error (catch block):', err)
      console.error('Error type:', typeof err)
      console.error('Error constructor:', err.constructor.name)
      setError(`An unexpected error occurred: ${err.message || String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Start your journey
        </h1>
        <p className="text-gray-600 mt-2">Create your StackSuite account and business</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Your Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
              Business Name *
            </label>
            <input
              id="businessName"
              name="businessName"
              type="text"
              value={formData.businessName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              placeholder="Your Business Inc."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="businessEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Business Email
            </label>
            <input
              id="businessEmail"
              name="businessEmail"
              type="email"
              value={formData.businessEmail}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              placeholder="info@yourbusiness.com"
            />
          </div>

          <div>
            <label htmlFor="businessPhone" className="block text-sm font-medium text-gray-700 mb-2">
              Business Phone
            </label>
            <input
              id="businessPhone"
              name="businessPhone"
              type="tel"
              value={formData.businessPhone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
            Industry
          </label>
          <select
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          >
            <option value="">Select your industry</option>
            <option value="automotive">Automotive</option>
            <option value="beauty">Beauty & Wellness</option>
            <option value="consulting">Consulting</option>
            <option value="fitness">Fitness</option>
            <option value="healthcare">Healthcare</option>
            <option value="home-services">Home Services</option>
            <option value="professional-services">Professional Services</option>
            <option value="retail">Retail</option>
            <option value="other">Other</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Creating account...
            </div>
          ) : (
            'Create account'
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-indigo-600 hover:text-indigo-700">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-indigo-600 hover:text-indigo-700">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}