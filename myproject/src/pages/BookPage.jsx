import { useState, useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useBookStore } from '../../store/bookStore'
import MainLayout from '../../components/layout/MainLayout'
import BookCard from '../../components/books/BookCard'
import AddBookModal from '../../components/books/AddBookModal'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function BooksPage() {
  const { user } = useAuthStore()
  const { books, isLoading, fetchBooks, addBook, deleteBook } = useBookStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      fetchBooks(user.uid)
    }
  }, [user, fetchBooks])

  const handleAddBook = async (bookData) => {
    try {
      setError('')
      await addBook(user.uid, bookData)
      setIsModalOpen(false)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book and all its quotes?')) {
      try {
        setError('')
        await deleteBook(user.uid, bookId)
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">My Books</h1>
            <p className="text-gray-600 mt-1">
              {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} in your library
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <span>+</span>
            <span>Add Book</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Search Bar */}
        <div>
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Books Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner text="Loading your books..." />
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No books yet</h2>
            <p className="text-gray-600 mb-6">Start building your library by adding your first book!</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Add Your First Book
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={(book) => {
                  // TODO: Implement edit functionality
                  console.log('Edit book:', book)
                }}
                onDelete={handleDeleteBook}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddBook={handleAddBook}
      />
    </MainLayout>
  )
}
