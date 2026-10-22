import { useState } from 'react'
import { Plus, Pencil, Trash2, Star, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import AdminLayout from './AdminLayout'
import { SAMPLE_BOOKS, CATEGORIES } from '../../lib/bookData'
import { toast } from '@/components/ui/toast'

export default function AdminBooksPage() {
  const [books, setBooks] = useState(SAMPLE_BOOKS)
  const [editBook, setEditBook] = useState<any>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [newBook, setNewBook] = useState({
    title: '', author: '', category: 'Fiction', price: '', stock: '', description: '', rating: '4.0',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=420&fit=crop',
    featured: false, bestseller: false, newArrival: false,
  })

  const filtered = books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()))

  const handleAdd = () => {
    const book = { ...newBook, id: `b${Date.now()}`, price: Number(newBook.price), stock: Number(newBook.stock), rating: Number(newBook.rating) }
    setBooks(prev => [book, ...prev])
    setShowAdd(false)
    toast.success('Book added successfully')
    setNewBook({ title: '', author: '', category: 'Fiction', price: '', stock: '', description: '', rating: '4.0', coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=420&fit=crop', featured: false, bestseller: false, newArrival: false })
  }

  const handleEdit = () => {
    setBooks(prev => prev.map(b => b.id === editBook.id ? editBook : b))
    setEditBook(null)
    toast.success('Book updated')
  }

  const handleDelete = () => {
    setBooks(prev => prev.filter(b => b.id !== deleteId))
    setDeleteId(null)
    toast.success('Book removed')
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">Book Inventory</h1>
            <p className="text-gray-500 mt-0.5">{books.length} titles in catalogue</p>
          </div>
          <Button onClick={() => setShowAdd(true)} className="gold-bg text-white border-0 gap-2">
            <Plus className="w-4 h-4" /> Add Book
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
          <div className="p-4 border-b border-stone-100">
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search books…" className="max-w-72" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Book</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Price</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Stock</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Badges</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map(book => (
                  <tr key={book.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={book.coverUrl} alt={book.title} className="w-8 h-11 object-cover rounded shadow" />
                        <div>
                          <p className="font-medium text-gray-900">{book.title}</p>
                          <p className="text-xs text-gray-500">{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{book.category}</td>
                    <td className="px-4 py-3 text-right font-semibold font-display">₹{book.price}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-medium ${book.stock < 10 ? 'text-orange-600' : 'text-gray-900'}`}>{book.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {book.bestseller && <Badge className="gold-bg text-white border-0 text-xs">Best</Badge>}
                        {book.newArrival && <Badge className="bg-emerald-600 text-white border-0 text-xs">New</Badge>}
                        {book.featured && <Badge variant="secondary" className="text-xs">Featured</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="icon" variant="ghost" onClick={() => setEditBook({ ...book })} className="w-8 h-8 text-gray-500 hover:text-amber-700">
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setDeleteId(book.id)} className="w-8 h-8 text-gray-500 hover:text-red-500">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Book Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display">Add New Book</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input value={newBook.title} onChange={e => setNewBook(p => ({ ...p, title: e.target.value }))} /></div>
            <div><Label>Author</Label><Input value={newBook.author} onChange={e => setNewBook(p => ({ ...p, author: e.target.value }))} /></div>
            <div>
              <Label>Category</Label>
              <Select value={newBook.category} onValueChange={v => setNewBook(p => ({ ...p, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Price (₹)</Label><Input type="number" value={newBook.price} onChange={e => setNewBook(p => ({ ...p, price: e.target.value }))} /></div>
              <div><Label>Stock</Label><Input type="number" value={newBook.stock} onChange={e => setNewBook(p => ({ ...p, stock: e.target.value }))} /></div>
            </div>
            <div><Label>Description</Label><Input value={newBook.description} onChange={e => setNewBook(p => ({ ...p, description: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleAdd} className="gold-bg text-white border-0" disabled={!newBook.title || !newBook.author || !newBook.price}>Add Book</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Book Dialog */}
      {editBook && (
        <Dialog open={!!editBook} onOpenChange={() => setEditBook(null)}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-display">Edit Book</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Title</Label><Input value={editBook.title} onChange={e => setEditBook((p: any) => ({ ...p, title: e.target.value }))} /></div>
              <div><Label>Author</Label><Input value={editBook.author} onChange={e => setEditBook((p: any) => ({ ...p, author: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Price (₹)</Label><Input type="number" value={editBook.price} onChange={e => setEditBook((p: any) => ({ ...p, price: Number(e.target.value) }))} /></div>
                <div><Label>Stock</Label><Input type="number" value={editBook.stock} onChange={e => setEditBook((p: any) => ({ ...p, stock: Number(e.target.value) }))} /></div>
              </div>
              <div><Label>Description</Label><Input value={editBook.description} onChange={e => setEditBook((p: any) => ({ ...p, description: e.target.value }))} /></div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button onClick={handleEdit} className="gold-bg text-white border-0">Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Delete</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-600">Are you sure you want to remove this book from the catalogue? This action cannot be undone.</p>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleDelete} variant="destructive">Delete Book</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
