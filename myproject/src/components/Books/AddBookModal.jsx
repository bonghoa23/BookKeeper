import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'

export default function AddBookModal({ isOpen, onClose, onAddBook }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    coverImage: '',
    description: '',
  })
  const [imagePreview, setImagePreview] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // For MVP, we'll use a data URL. In production, upload to Firebase Storage
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setFormData((prev) => ({ ...prev, coverImage: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.author.trim()) {
      setError('Please fill in title and author')
      return
    }

    try {
      setIsLoading(true)
      setError('')
      await onAddBook(formData)
      setFormData({ title: '', author: '', coverImage: '', description: '' })
      setImagePreview('')
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Add New Book</h2>
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

          {/* Book Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Book Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter book title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Author *
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter author name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            {imagePreview && (
              <div className="mt-3 relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview('')
                    setFormData((prev) => ({ ...prev, coverImage: '' }))
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP (max 5MB)</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Optional: Add a brief description"
              rows="3"
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
              {isLoading ? 'Adding...' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
