import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
      Loading…
    </div>
  )
}

export function RequireAuth() {
  const { user, loading } = useAuth()
  if (loading) return <Loading />
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}

export function RequireAdmin() {
  const { user, isAdmin, loading } = useAuth()
  if (loading) return <Loading />
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return <Outlet />
}
