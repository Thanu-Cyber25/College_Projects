import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  bookId: string
  title: string
  author: string
  price: number
  coverUrl: string
  quantity: number
  stock: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (bookId: string) => void
  updateQty: (bookId: string, qty: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('velora_cart') || '[]')
    } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('velora_cart', JSON.stringify(items))
  }, [items])

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.bookId === item.bookId)
      if (existing) {
        return prev.map(i =>
          i.bookId === item.bookId
            ? { ...i, quantity: Math.min(i.quantity + 1, item.stock) }
            : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeItem = (bookId: string) => setItems(prev => prev.filter(i => i.bookId !== bookId))

  const updateQty = (bookId: string, qty: number) => {
    if (qty < 1) { removeItem(bookId); return }
    setItems(prev => prev.map(i => i.bookId === bookId ? { ...i, quantity: Math.min(qty, i.stock) } : i))
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
