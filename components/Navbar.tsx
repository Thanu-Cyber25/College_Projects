import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Search, User, BookOpen, Menu, X, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useTheme } from '../contexts/ThemeContext'

interface NavbarProps {
  onSearch?: (q: string) => void
  showSearch?: boolean
}

export default function Navbar({ onSearch, showSearch = false }: NavbarProps) {
  const { user, signOut } = useAuth()
  const { itemCount } = useCart()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) onSearch(searchVal)
    else navigate(`/catalogue?q=${encodeURIComponent(searchVal)}`)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="velora-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <BookOpen className="w-6 h-6 gold-accent" />
            <span className="font-display text-xl font-semibold text-white tracking-wide">
              VELORA <span className="gold-accent">BOOKS</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm text-gray-300 hover:text-white transition-colors">Home</Link>
            <Link to="/catalogue" className="text-sm text-gray-300 hover:text-white transition-colors">Catalogue</Link>
            <Link to="/catalogue?cat=Fiction" className="text-sm text-gray-300 hover:text-white transition-colors">Fiction</Link>
            <Link to="/catalogue?cat=Academic" className="text-sm text-gray-300 hover:text-white transition-colors">Academic</Link>
          </div>

          {showSearch && (
            <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  placeholder="Search books…"
                  className="pl-9 pr-4 py-2 bg-white/10 text-white placeholder-gray-400 rounded text-sm border border-white/10 focus:outline-none focus:border-yellow-600/60 w-56"
                />
              </div>
            </form>
          )}

          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <Link to="/cart" className="relative p-2 text-gray-300 hover:text-white transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full gold-bg text-xs font-semibold text-white flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/account">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10 gap-1">
                    <User className="w-4 h-4" /> {user.name?.split(' ')[0]}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-400 hover:text-white hover:bg-white/10 text-xs">
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="gold-bg hover:opacity-90 text-white border-0">Register</Button>
                </Link>
              </div>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-300 hover:text-white">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-white/10 py-4 space-y-3">
            <Link to="/" className="block text-sm text-gray-300 hover:text-white px-2 py-1">Home</Link>
            <Link to="/catalogue" className="block text-sm text-gray-300 hover:text-white px-2 py-1">Catalogue</Link>
            {user
              ? <Link to="/account" className="block text-sm text-gray-300 hover:text-white px-2 py-1">My Account</Link>
              : <Link to="/login" className="block text-sm text-gray-300 hover:text-white px-2 py-1">Sign In</Link>
            }
          </div>
        )}
      </div>
    </nav>
  )
}
