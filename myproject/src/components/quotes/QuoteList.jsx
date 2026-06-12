import { useState, useEffect } from 'react'
import QuoteCard from './QuoteCard'
import LoadingSpinner from '../common/LoadingSpinner'

export default function QuoteList({
  quotes,
  bookId,
  isLoading,
  onDelete,
  onEdit,
  onAddClick,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredQuotes, setFilteredQuotes] = useState(quotes)

  useEffect(() => {
    setFilteredQuotes(
      quotes.filter((quote) =>
        quote.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [quotes, searchTerm])

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner text="Loading quotes..." />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search quotes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={onAddClick}
          className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
        >
          + Add Quote
        </button>
      </div>

      {/* Quotes Count */}
      {filteredQuotes.length > 0 && (
        <p className="text-sm text-gray-600">
          Showing {filteredQuotes.length} of {quotes.length} quotes
        </p>
      )}

      {/* Quotes List */}
      {filteredQuotes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">✨</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {quotes.length === 0 ? 'No quotes yet' : 'No matching quotes'}
          </h3>
          <p className="text-gray-600">
            {quotes.length === 0
              ? "Start by adding your favorite quotes from this book"
              : 'Try a different search term'}
          </p>
          {quotes.length === 0 && (
            <button
              onClick={onAddClick}
              className="mt-4 px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
            >
              Add Your First Quote
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuotes.map((quote) => (
            <QuoteCard
              key={quote.id}
              quote={quote}
              bookId={bookId}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
