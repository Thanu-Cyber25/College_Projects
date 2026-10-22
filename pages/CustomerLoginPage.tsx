import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '../contexts/AuthContext'
import { toast } from '@/components/ui/toast'

export default function CustomerLoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(form.email, form.password)
      toast.success('Welcome back!')
      navigate(params.get('redirect') || '/account')
    } catch (err: any) {
      setError(err.message || 'Sign in failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen navy-bg flex flex-col items-center justify-center px-4">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <BookOpen className="w-7 h-7 gold-accent" />
        <span className="font-display text-2xl font-semibold text-white">VELORA <span className="gold-accent">BOOKS</span></span>
      </Link>
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">Welcome Back</h1>
        <p className="text-sm text-gray-500 mb-6">Sign in to your Velora Books account</p>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required autoComplete="email" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required autoComplete="current-password" />
          </div>
          <Button type="submit" disabled={loading} className="w-full gold-bg hover:opacity-90 text-white border-0 py-2.5">
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {"Don't have an account? "}
          <Link to="/register" className="text-amber-700 hover:text-amber-900 font-medium">Register</Link>
        </p>
        <p className="text-center text-xs text-gray-400 mt-2">
          <Link to="/admin/login" className="hover:text-gray-600">Admin login →</Link>
        </p>
      </div>
    </div>
  )
}
