import { useNavigate } from 'react-router-dom'

export default function BookCard({ book, onEdit, onDelete }) {
  const navigate = useNavigate()

  const handleViewQuotes = () => {
    navigate(`/books/${book.id}/quotes`)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Book Cover */}
      <div
        onClick={handleViewQuotes}
        className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600 cursor-pointer overflow-hidden group"
      >
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">📖</span>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-gray-100">
            View Quotes
          </button>
        </div>
      </div>

      {/* Book Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 truncate">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-1">by {book.author}</p>

        {book.description && (
          <p className="text-gray-500 text-sm mb-3 line-clamp-2">{book.description}</p>
        )}

        {/* Quote Count */}
        <div className="mb-4 text-sm text-gray-500">
          <p>📝 {book.quoteCount || 0} quotes saved</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleViewQuotes}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition"
          >
            Open
          </button>
          <button
            onClick={() => onEdit(book)}
            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(book.id)}
            className="px-3 py-2 border border-red-300 text-red-700 rounded-lg font-medium text-sm hover:bg-red-50 transition"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}
