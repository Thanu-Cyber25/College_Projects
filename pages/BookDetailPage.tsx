import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, ShoppingCart, ArrowLeft, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Navbar from '../components/Navbar'
import BookCard from '../components/BookCard'
import Footer from '../components/Footer'
import { useCart } from '../contexts/CartContext'
import { toast } from '@/components/ui/toast'
import { SAMPLE_BOOKS } from '../lib/bookData'

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>()
  const book = SAMPLE_BOOKS.find(b => b.id === id)
  const { addItem, items, updateQty } = useCart()
  const [qty, setQty] = useState(1)

  const related = SAMPLE_BOOKS.filter(b => b.id !== id && b.category === book?.category).slice(0, 4)
  const cartItem = items.find(i => i.bookId === id)

  if (!book) return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-display font-semibold text-gray-700">Book not found</h2>
        <Link to="/catalogue" className="mt-4 inline-block text-amber-700 underline">Back to Catalogue</Link>
      </div>
    </div>
  )

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem({ bookId: book.id, title: book.title, author: book.author, price: book.price, coverUrl: book.coverUrl, stock: book.stock })
    }
    toast.success(`Added ${qty} copy of "${book.title}" to cart`)
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <Link to="/catalogue" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Catalogue
        </Link>

        <div className="bg-white rounded-xl border border-stone-200 p-6 md:p-10">
          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-1">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img src={book.coverUrl} alt={book.title} className="w-full h-auto max-h-96 object-cover" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {book.bestseller && <Badge className="gold-bg text-white border-0">Bestseller</Badge>}
                {book.newArrival && <Badge className="bg-emerald-600 text-white border-0">New Arrival</Badge>}
                {book.featured && <Badge variant="secondary">Featured</Badge>}
              </div>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm font-medium text-amber-700 uppercase tracking-widest mb-2">{book.category}</p>
              <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>
              <p className="text-xl text-gray-500 mb-4">by {book.author}</p>

              <div className="flex items-center gap-2 mb-4">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-5 h-5 ${s <= Math.round(book.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                ))}
                <span className="text-sm text-gray-500">{book.rating.toFixed(1)} (sample rating)</span>
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">{book.description}</p>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-display text-4xl font-bold text-gray-900">₹{book.price}</span>
                <span className="text-sm text-gray-500">incl. taxes</span>
              </div>

              <div className="flex items-center gap-2 text-sm mb-6">
                <Package className="w-4 h-4 text-gray-400" />
                {book.stock > 0
                  ? <span className="text-emerald-600 font-medium">{book.stock} in stock</span>
                  : <span className="text-red-500 font-medium">Out of stock</span>
                }
              </div>

              {book.stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <label className="text-sm font-medium text-gray-700">Quantity:</label>
                  <div className="flex items-center border border-stone-200 rounded">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center hover:bg-stone-100 text-lg font-medium">−</button>
                    <span className="w-10 text-center text-sm font-medium">{qty}</span>
                    <button onClick={() => setQty(q => Math.min(book.stock, q + 1))} className="w-9 h-9 flex items-center justify-center hover:bg-stone-100 text-lg font-medium">+</button>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={book.stock === 0}
                  className="gold-bg hover:opacity-90 text-white border-0 gap-2 px-8 py-3"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </Button>
                <Link to="/cart">
                  {cartItem && (
                    <Button variant="outline" className="border-amber-400 text-amber-800">
                      View Cart ({cartItem.quantity} in cart)
                    </Button>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-semibold text-gray-900 mb-6">Related Books in {book.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(b => <BookCard key={b.id} book={b} />)}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
