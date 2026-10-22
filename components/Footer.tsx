import { Link } from 'react-router-dom'
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="navy-bg text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 gold-accent" />
              <span className="font-display text-xl font-semibold text-white">
                VELORA <span className="gold-accent">BOOKS</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              A World of Stories, Curated for You. Premium books delivered to your doorstep.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 font-display">Browse</h4>
            <ul className="space-y-2 text-sm">
              {['Fiction', 'Mystery', 'Romance', 'Technology', 'Science', 'Business'].map(cat => (
                <li key={cat}>
                  <Link to={`/catalogue?cat=${cat}`} className="hover:text-white transition-colors">{cat}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 font-display">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
              <li><Link to="/account" className="hover:text-white transition-colors">My Orders</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 font-display">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><Mail className="w-4 h-4 gold-accent mt-0.5 shrink-0" /> hello@velorabooks.in</li>
              <li className="flex items-start gap-2"><Phone className="w-4 h-4 gold-accent mt-0.5 shrink-0" /> +91 98765 43210</li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 gold-accent mt-0.5 shrink-0" /> Bengaluru, Karnataka, India</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>© 2024 Velora Books. All rights reserved.</span>
          <span>Made with care for book lovers everywhere.</span>
        </div>
      </div>
    </footer>
  )
}
