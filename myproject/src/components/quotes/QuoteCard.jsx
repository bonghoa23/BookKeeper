import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function QuoteCard({ quote, bookId, onDelete, onEdit }) {
  const navigate = useNavigate()
  const [showActions, setShowActions] = useState(false)

  const handleViewQuote = () => {
    navigate(`/books/${bookId}/quotes/${quote.id}`)
  }

  return (
    <div
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300 relative"
    >
      {/* Quote Text */}
      <blockquote className="text-gray-800 italic mb-3 line-clamp-3 text-base leading-relaxed">
        "{quote.text}"
      </blockquote>

      {/* Page Number */}
      {quote.pageNumber && (
        <p className="text-xs text-gray-500 mb-3">Page {quote.pageNumber}</p>
      )}

      {/* Reflection Preview */}
      {quote.reflection && (
        <div className="mb-3 p-3 bg-gray-50 rounded">
          <p className="text-xs font-semibold text-gray-600 mb-1">Your reflection:</p>
          <p className="text-sm text-gray-700 line-clamp-2">{quote.reflection}</p>
        </div>
      )}

      {/* Has Drawing Indicator */}
      {quote.drawing && (
        <div className="flex items-center gap-2 text-sm text-blue-600 mb-3">
          <span>🎨</span>
          <span>Decorated</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleViewQuote}
          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition"
        >
          View & Decorate
        </button>
        <button
          onClick={() => onEdit(quote)}
          className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition"
        >
          ✏️
        </button>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this quote?')) {
              onDelete(quote.id)
            }
          }}
          className="px-3 py-2 border border-red-300 text-red-700 rounded-lg font-medium text-sm hover:bg-red-50 transition"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}
