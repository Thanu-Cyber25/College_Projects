import { Link } from 'react-router-dom'
import { ShoppingCart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '../contexts/CartContext'
import { toast } from '@/components/ui/toast'

interface Book {
  id: string
  title: string
  author: string
  category: string
  price: number
  rating: number
  stock: number
  coverUrl: string
  featured?: boolean
  bestseller?: boolean
  newArrival?: boolean
}

export default function BookCard({ book }: { book: Book }) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    if (book.stock < 1) return
    addItem({
      bookId: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      coverUrl: book.coverUrl,
      stock: book.stock,
    })
    toast.success(`"${book.title}" added to cart`)
  }

  return (
    <div className="book-card bg-white rounded-lg overflow-hidden border border-stone-200 flex flex-col">
      <Link to={`/books/${book.id}`} className="block overflow-hidden relative">
        <img
          src={book.coverUrl}
          alt={book.title}
          className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {book.bestseller && <Badge className="gold-bg text-white border-0 text-xs">Bestseller</Badge>}
          {book.newArrival && <Badge className="bg-emerald-600 text-white border-0 text-xs">New</Badge>}
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-amber-700 font-medium uppercase tracking-wide mb-1">{book.category}</span>
        <Link to={`/books/${book.id}`}>
          <h3 className="font-display font-semibold text-gray-900 leading-snug hover:text-amber-800 transition-colors line-clamp-2 mb-1">
            {book.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mb-2">{book.author}</p>
        <div className="flex items-center gap-1 mb-3">
          {[1,2,3,4,5].map(s => (
            <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(book.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
          ))}
          <span className="text-xs text-gray-500 ml-1">{book.rating.toFixed(1)}</span>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="font-display text-xl font-semibold text-gray-900">₹{book.price}</span>
          <div className="flex items-center gap-2">
            {book.stock < 5 && book.stock > 0 && (
              <span className="text-xs text-orange-600">Only {book.stock} left</span>
            )}
            {book.stock === 0 && (
              <span className="text-xs text-red-500">Out of stock</span>
            )}
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={book.stock === 0}
              className="gold-bg hover:opacity-90 text-white border-0 gap-1"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
