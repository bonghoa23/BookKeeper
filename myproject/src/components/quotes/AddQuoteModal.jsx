import { useState } from 'react'

export default function AddQuoteModal({ isOpen, onClose, onAddQuote, isLoading }) {
  const [formData, setFormData] = useState({
    text: '',
    pageNumber: '',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.text.trim()) {
      setError('Please enter the quote text')
      return
    }

    try {
      setError('')
      await onAddQuote(formData)
      setFormData({ text: '', pageNumber: '' })
      onClose()
    } catch (err) {
      setError(err.message)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Add New Quote</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Quote Text */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Quote Text *
            </label>
            <textarea
              name="text"
              value={formData.text}
              onChange={handleChange}
              placeholder="Enter the quote text here..."
              rows="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-serif"
              required
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.text.length} characters
            </p>
          </div>

          {/* Page Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Page Number (Optional)
            </label>
            <input
              type="number"
              name="pageNumber"
              value={formData.pageNumber}
              onChange={handleChange}
              placeholder="e.g., 42"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add Quote'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
