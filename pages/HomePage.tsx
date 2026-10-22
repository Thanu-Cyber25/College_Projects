import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ArrowRight, Star, BookOpen, Package, Truck, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '../components/Navbar'
import BookCard from '../components/BookCard'
import Footer from '../components/Footer'
import { SAMPLE_BOOKS, CATEGORIES, TESTIMONIALS } from '../lib/bookData'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const featuredBooks = SAMPLE_BOOKS.filter(b => b.featured).slice(0, 4)
  const bestSellers = SAMPLE_BOOKS.filter(b => b.bestseller).slice(0, 4)
  const newArrivals = SAMPLE_BOOKS.filter(b => b.newArrival).slice(0, 4)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/catalogue?q=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="velora-hero min-h-[85vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute text-white font-display text-6xl opacity-30 select-none"
              style={{ left: `${(i * 127) % 100}%`, top: `${(i * 83) % 100}%`, transform: 'rotate(-15deg)' }}>
              ❦
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 relative z-10 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-600/30 bg-amber-600/10 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="text-amber-300 text-xs font-medium uppercase tracking-widest">Premium Bookstore</span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
                Discover Your Next<br />
                <span className="gold-accent italic">Favourite Book</span>
              </h1>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-lg">
                A World of Stories, Curated for You. Explore thousands of handpicked titles across every genre imaginable.
              </p>
              <form onSubmit={handleSearch} className="flex gap-2 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by title, author, or genre…"
                    className="w-full pl-12 pr-4 py-3.5 rounded-lg bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <Button type="submit" className="gold-bg hover:opacity-90 text-white border-0 px-6 py-3.5">Search</Button>
              </form>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span>Popular: </span>
                {['Dune', 'Atomic Habits', 'The Alchemist'].map(t => (
                  <button key={t} onClick={() => navigate(`/catalogue?q=${t}`)} className="hover:text-amber-400 transition-colors underline underline-offset-2">
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="hidden md:grid grid-cols-2 gap-4 fade-in-up stagger-2">
              {featuredBooks.slice(0, 4).map((book, i) => (
                <Link key={book.id} to={`/books/${book.id}`}
                  className={`block rounded-lg overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300 ${i === 1 || i === 2 ? 'mt-8' : ''}`}
                >
                  <img src={book.coverUrl} alt={book.title} className="w-full h-48 object-cover" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-y border-stone-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, label: '10,000+ Titles', sub: 'Across all genres' },
              { icon: Truck, label: 'Fast Delivery', sub: '2–5 business days' },
              { icon: Package, label: 'Secure Packaging', sub: 'Books arrive perfect' },
              { icon: Shield, label: 'Secure Checkout', sub: '100% safe & trusted' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 gold-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-display text-3xl font-semibold text-gray-900">Browse by Category</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.map((cat, i) => (
              <Link key={cat} to={`/catalogue?cat=${cat}`}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all group text-center"
              >
                <span className="text-2xl">{['📚','🔍','💕','💻','🔬','💼','🧠','🎓'][i]}</span>
                <span className="text-xs font-medium text-gray-700 group-hover:text-amber-800">{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-semibold text-gray-900">Featured Books</h2>
              <p className="text-gray-500 mt-1">Handpicked by our editorial team</p>
            </div>
            <Link to="/catalogue" className="flex items-center gap-1 text-sm text-amber-800 hover:text-amber-900 font-medium">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map(book => <BookCard key={book.id} book={book} />)}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-semibold text-gray-900">Bestsellers</h2>
              <p className="text-gray-500 mt-1">Most loved by our readers</p>
            </div>
            <Link to="/catalogue?sort=bestseller" className="flex items-center gap-1 text-sm text-amber-800 hover:text-amber-900 font-medium">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map(book => <BookCard key={book.id} book={book} />)}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-semibold text-gray-900">New Arrivals</h2>
              <p className="text-gray-500 mt-1">Fresh titles just added to our collection</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newArrivals.map(book => <BookCard key={book.id} book={book} />)}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 navy-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-semibold text-white mb-2">What Readers Say</h2>
            <p className="text-gray-400">Sample testimonials from our community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="flex gap-1 mb-3">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full gold-bg flex items-center justify-center text-white text-xs font-bold">
                    {t.avatar}
                  </div>
                  <span className="text-white text-sm font-medium">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-amber-50 border-t border-amber-100">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-semibold text-gray-900 mb-2">Stay in the Story</h2>
          <p className="text-gray-600 mb-6">Get curated book recommendations, exclusive offers and new arrivals straight to your inbox.</p>
          <form className="flex gap-2 max-w-md mx-auto" onSubmit={e => { e.preventDefault(); }}>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-lg border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            />
            <Button className="gold-bg hover:opacity-90 text-white border-0 px-5">Subscribe</Button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
