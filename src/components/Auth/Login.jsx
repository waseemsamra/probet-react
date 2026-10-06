import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

const PROVIDERS = ['github', 'google', 'apple']

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('signin') // signin | signup | magic | reset
  const [error, setError] = useState(null)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-md w-full p-8 bg-white rounded-xl shadow border border-slate-200">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">ProBet Admin</h1>
          <p className="text-slate-600 mb-4">Sign in to continue.</p>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            Supabase is not configured. Add <code className="font-mono">VITE_SUPABASE_URL</code> and{' '}
            <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> to your <code className="font-mono">.env</code>, then restart <code className="font-mono">npm run dev</code>.
          </div>
        </div>
      </div>
    )
  }

  const resetState = () => { setError(null); setSent(false) }

  const switchMode = (next) => {
    setMode(next); resetState()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null); setSent(false); setLoading(true)
    try {
      if (mode === 'magic') {
        const { error: err } = await supabase.auth.signInWithOtp({
          email,
          options: { shouldCreateUser: true, emailRedirectTo: window.location.origin },
        })
        if (err) throw err
        setSent(true)
      } else if (mode === 'reset') {
        const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/update-password`,
        })
        if (err) throw err
        setSent(true)
      } else {
        let result
        if (mode === 'signup') {
          result = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: email.split('@')[0] } },
          })
        } else {
          result = await supabase.auth.signInWithPassword({ email, password })
        }
        const { error: err } = result
        if (err) throw err
        // If signup with email confirmations enabled, a magic-link email is sent.
        if (mode === 'signup') setSent(true)
      }
    } catch (err) {
      setError(err.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const signInWithOAuth = async (provider) => {
    setError(null); setLoading(true)
    try {
      const { data, error: err } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (err) throw err
      if (data?.url) window.location.assign(data.url)
    } catch (err) {
      setError(err.message ?? 'OAuth failed')
    } finally {
      setLoading(false)
    }
  }

  const field = (label, type, value, setValue, autoComplete) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        required
      />
    </div>
  )

  const submitLabel = () => {
    if (mode === 'signup') return 'Create account'
    if (mode === 'magic') return 'Send magic link'
    if (mode === 'reset') return 'Send reset link'
    return 'Sign in'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">ProBet Admin</h1>
          <p className="text-sm text-slate-500">
            {mode === 'signup' && 'Create your account'}
            {mode === 'magic' && 'Sign in with a one-time link'}
            {mode === 'reset' && 'Reset your password'}
            {(mode === 'signin') && 'Welcome back — sign in to continue'}
          </p>
        </div>

        {sent && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800">
            Check your email for a sign-in link or reset instructions.
          </div>
        )}

        {mode !== 'signin' && mode !== 'signup' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {field('Email', 'email', email, setEmail, 'email')}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Sending…' : submitLabel()}
            </button>
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className="w-full text-sm text-indigo-600 hover:underline"
            >
              Back to sign in
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {field('Email', 'email', email, setEmail, 'email')}
            {field('Password', 'password', password, setPassword, 'current-password')}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Signing in…' : submitLabel()}
            </button>
          </form>
        )}

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <div className="pt-2 border-t border-slate-200 text-center text-sm text-slate-600">
          <button
            onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-indigo-600 hover:underline"
          >
            {mode === 'signin' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>
          {' · '}
          <button
            onClick={() => switchMode('magic')}
            className="text-indigo-600 hover:underline"
          >
            Magic link
          </button>
          {' · '}
          <button
            onClick={() => switchMode('reset')}
            className="text-indigo-600 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <div className="pt-2 border-t border-slate-200">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Or continue with</p>
          <div className="space-y-2">
            {PROVIDERS.map((p) => (
              <button
                key={p}
                onClick={() => signInWithOAuth(p)}
                disabled={loading}
                className="w-full py-2 px-4 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 capitalize"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
