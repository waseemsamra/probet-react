import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!supabase) {
      navigate('/login', { replace: true })
      return
    }
    // Exchange the PKCE code returned by the OAuth provider for a session.
    supabase.auth
      .exchangeCodeForSession(window.location.search)
      .then(({ error }) => {
        if (error) console.error('[auth]', error.message)
      })
      .finally(() => navigate('/', { replace: true }))
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
      Completing sign in…
    </div>
  )
}
