import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'

export default function CartPage() {
  const { items, removeItem, updateQty, total } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!user) { navigate('/login?redirect=/checkout'); return }
    navigate('/checkout')
  }

  if (items.length === 0) return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-6" />
        <h2 className="font-display text-3xl font-semibold text-gray-800 mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Discover thousands of curated books waiting for you.</p>
        <Link to="/catalogue">
          <Button className="gold-bg text-white border-0 px-8">Browse Catalogue</Button>
        </Link>
      </div>
      <Footer />
    </div>
  )

  const delivery = total < 500 ? 49 : 0

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.bookId} className="bg-white rounded-lg border border-stone-200 p-4 flex gap-4">
                <Link to={`/books/${item.bookId}`}>
                  <img src={item.coverUrl} alt={item.title} className="w-16 h-24 object-cover rounded shadow" />
                </Link>
                <div className="flex-1">
                  <Link to={`/books/${item.bookId}`} className="font-display font-semibold text-gray-900 hover:text-amber-800 transition-colors">
                    {item.title}
                  </Link>
                  <p className="text-sm text-gray-500 mb-3">{item.author}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-stone-200 rounded">
                      <button onClick={() => updateQty(item.bookId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-stone-100">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQty(item.bookId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-stone-100" disabled={item.quantity >= item.stock}>
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-semibold text-gray-900">₹{item.price * item.quantity}</span>
                  </div>
                </div>
                <button onClick={() => removeItem(item.bookId)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-stone-200 p-6 sticky top-24">
              <h2 className="font-display text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal ({items.length} items)</span><span>₹{total}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Delivery</span><span>{delivery === 0 ? 'Free' : `₹${delivery}`}</span></div>
                {delivery === 0 && <p className="text-xs text-emerald-600">Free delivery on orders above ₹500</p>}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-semibold text-lg mb-6">
                <span>Total</span>
                <span className="font-display">₹{total + delivery}</span>
              </div>
              <Button onClick={handleCheckout} className="w-full gold-bg hover:opacity-90 text-white border-0 gap-2 py-3">
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Button>
              <Link to="/catalogue" className="block text-center text-sm text-gray-500 hover:text-gray-800 mt-4">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
