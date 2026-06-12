import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useBookStore } from '../../store/bookStore'
import { useQuoteStore } from '../../store/quoteStore'
import MainLayout from '../../components/layout/MainLayout'
import QuoteList from '../../components/quotes/QuoteList'
import AddQuoteModal from '../../components/quotes/AddQuoteModal'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import * as bookService from '../../services/bookService'

export default function BookDetailPage() {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { currentBook, setCurrentBook } = useBookStore()
  const { quotes, isLoading, fetchQuotes, addQuote, deleteQuote } = useQuoteStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState('')
  const [bookLoading, setBookLoading] = useState(true)

  useEffect(() => {
    const loadBook = async () => {
      try {
        setBookLoading(true)
        setError('')
        const book = await bookService.getBook(user.uid, bookId)
        if (book) {
          setCurrentBook(book)
          await fetchQuotes(user.uid, bookId)
        } else {
          setError('Book not found')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setBookLoading(false)
      }
    }

    if (user && bookId) {
      loadBook()
    }
  }, [user, bookId, setCurrentBook, fetchQuotes])

  const handleAddQuote = async (quoteData) => {
    try {
      setError('')
      await addQuote(user.uid, bookId, quoteData)
      setIsModalOpen(false)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteQuote = async (quoteId) => {
    try {
      setError('')
      await deleteQuote(user.uid, bookId, quoteId)
    } catch (err) {
      setError(err.message)
    }
  }

  if (bookLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-12">
          <LoadingSpinner text="Loading book..." />
        </div>
      </MainLayout>
    )
  }

  if (error && !currentBook) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => navigate('/books')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Books
          </button>
        </div>
      </MainLayout>
    )
  }

  if (!currentBook) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Book not found</p>
          <button
            onClick={() => navigate('/books')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Books
          </button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-start gap-4">
          <button
            onClick={() => navigate('/books')}
            className="mt-1 text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Books
          </button>
        </div>

        {/* Book Info Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex gap-6">
            {/* Book Cover */}
            <div className="flex-shrink-0">
              {currentBook.coverImage ? (
                <img
                  src={currentBook.coverImage}
                  alt={currentBook.title}
                  className="w-32 h-48 object-cover rounded-lg shadow-md"
                />
              ) : (
                <div className="w-32 h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-5xl shadow-md">
                  📖
                </div>
              )}
            </div>

            {/* Book Details */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentBook.title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">by {currentBook.author}</p>

              {currentBook.description && (
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {currentBook.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex gap-6 text-sm text-gray-600">
                <div>
                  <p className="font-semibold text-gray-900">{quotes.length}</p>
                  <p>Quote{quotes.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Quotes Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quotes</h2>
          <QuoteList
            quotes={quotes}
            bookId={bookId}
            isLoading={isLoading}
            onDelete={handleDeleteQuote}
            onEdit={(quote) => {
              // TODO: Implement edit functionality
              console.log('Edit quote:', quote)
            }}
            onAddClick={() => setIsModalOpen(true)}
          />
        </div>
      </div>

      {/* Add Quote Modal */}
      <AddQuoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddQuote={handleAddQuote}
        isLoading={isLoading}
      />
    </MainLayout>
  )
}
