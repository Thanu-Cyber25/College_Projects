import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import Navbar from '../components/Navbar'
import BookCard from '../components/BookCard'
import Footer from '../components/Footer'
import { SAMPLE_BOOKS, CATEGORIES } from '../lib/bookData'

const PAGE_SIZE = 8

export default function CataloguePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('cat') || 'All')
  const [sort, setSort] = useState('default')
  const [priceMax, setPriceMax] = useState(2000)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let books = [...SAMPLE_BOOKS]
    if (search) {
      const q = search.toLowerCase()
      books = books.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.category.toLowerCase().includes(q))
    }
    if (category && category !== 'All') books = books.filter(b => b.category === category)
    books = books.filter(b => b.price <= priceMax)
    if (sort === 'price-asc') books.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') books.sort((a, b) => b.price - a.price)
    else if (sort === 'rating') books.sort((a, b) => b.rating - a.rating)
    else if (sort === 'bestseller') books = books.filter(b => b.bestseller)
    return books
  }, [search, category, sort, priceMax])

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1) }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <div className="navy-bg py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="font-display text-4xl font-bold text-white mb-2">Book Catalogue</h1>
          <p className="text-gray-400">Explore our complete collection of curated titles</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg border border-stone-200 p-4 mb-8 flex flex-wrap gap-4 items-end">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-48">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder="Search title, author…"
                className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </form>

          <div className="min-w-40">
            <label className="text-xs text-gray-500 block mb-1">Category</label>
            <Select value={category} onValueChange={v => { setCategory(v); setPage(1) }}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-36">
            <label className="text-xs text-gray-500 block mb-1">Sort by</label>
            <Select value={sort} onValueChange={v => { setSort(v); setPage(1) }}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="bestseller">Bestsellers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-48">
            <label className="text-xs text-gray-500 block mb-1">Max Price: ₹{priceMax}</label>
            <input
              type="range" min={100} max={2000} step={50}
              value={priceMax}
              onChange={e => { setPriceMax(Number(e.target.value)); setPage(1) }}
              className="w-full accent-amber-600"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">{filtered.length} book{filtered.length !== 1 ? 's' : ''} found</p>
        </div>

        {paginated.length === 0 ? (
          <div className="text-center py-20">
            <BookCard book={{ id:'', title:'', author:'', category:'', price:0, rating:0, stock:0, coverUrl:'' }} />
            <p className="text-gray-400 text-lg mt-4">No books found matching your filters.</p>
            <Button onClick={() => { setSearch(''); setCategory('All'); setPriceMax(2000); setSort('default') }} className="mt-4 gold-bg text-white border-0">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginated.map(book => <BookCard key={book.id} book={book} />)}
          </div>
        )}

        {pageCount > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
            {[...Array(pageCount)].map((_, i) => (
              <Button key={i} size="sm"
                variant={page === i + 1 ? 'default' : 'outline'}
                onClick={() => setPage(i + 1)}
                className={page === i + 1 ? 'gold-bg text-white border-0' : ''}
              >
                {i + 1}
              </Button>
            ))}
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(pageCount, p + 1))} disabled={page === pageCount}>Next</Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
