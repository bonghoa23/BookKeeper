import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useQuoteStore } from '../../store/quoteStore'
import MainLayout from '../../components/layout/MainLayout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import CanvasDrawingManager from '../../services/canvasService'
import DrawingTools from '../../components/quotes/DrawingTools'
import PageTemplates from '../../components/quotes/PageTemplates'
import * as quoteService from '../../services/quoteService'

export default function QuoteDetailPage() {
  const { bookId, quoteId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { updateQuote, saveDrawing, createPublicShare } = useQuoteStore()

  const [quote, setQuote] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [reflection, setReflection] = useState('')
  const [pageTemplate, setPageTemplate] = useState('blank')
  const [isSaving, setIsSaving] = useState(false)
  const [canvasReady, setCanvasReady] = useState(false)

  const canvasRef = useRef(null)
  const drawingManagerRef = useRef(null)
  const containerRef = useRef(null)

  // Load quote
  useEffect(() => {
    const loadQuote = async () => {
      try {
        setIsLoading(true)
        setError('')
        const quoteData = await quoteService.getQuote(user.uid, bookId, quoteId)
        if (quoteData) {
          setQuote(quoteData)
          setReflection(quoteData.reflection || '')
          setPageTemplate(quoteData.pageTemplate || 'blank')
        } else {
          setError('Quote not found')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (user && bookId && quoteId) {
      loadQuote()
    }
  }, [user, bookId, quoteId])

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current && quote && !drawingManagerRef.current) {
      const canvas = canvasRef.current
      const container = containerRef.current

      // Set canvas size
      const width = container.clientWidth
      const height = 600
      canvas.width = width
      canvas.height = height

      // Initialize drawing manager
      drawingManagerRef.current = new CanvasDrawingManager(canvas)

      // Load existing drawing if available
      if (quote.drawing) {
        drawingManagerRef.current.loadImageData(quote.drawing)
      }

      setCanvasReady(true)
    }
  }, [quote])

  const handleSaveReflection = async () => {
    try {
      setIsSaving(true)
      setError('')
      await updateQuote(user.uid, bookId, quoteId, {
        reflection,
        pageTemplate,
      })
      alert('Reflection saved!')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveDrawing = async () => {
    try {
      setIsSaving(true)
      setError('')
      const drawingData = drawingManagerRef.current.getImageData()
      await saveDrawing(user.uid, bookId, quoteId, drawingData)
      alert('Drawing saved!')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleClearCanvas = () => {
    if (window.confirm('Are you sure you want to clear all drawings?')) {
      drawingManagerRef.current.clear()
    }
  }

  const handleUndo = () => {
    drawingManagerRef.current.undo()
  }

  const handleRedo = () => {
    drawingManagerRef.current.redo()
  }

  const handleExportDrawing = () => {
    drawingManagerRef.current.exportAsImage(
      `quote-${quoteId}-decoration.png`
    )
  }

  const handleCreatePublicShare = async () => {
    try {
      setIsSaving(true)
      const shareId = await createPublicShare(user.uid, bookId, quoteId, {
        text: quote.text,
        reflection,
        drawing: drawingManagerRef.current?.getImageData(),
        author: quote.author,
      })
      const shareUrl = `${window.location.origin}/quotes/share/${shareId}`
      
      // Copy to clipboard
      navigator.clipboard.writeText(shareUrl)
      alert('Share link copied to clipboard!\n\n' + shareUrl)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-12">
          <LoadingSpinner text="Loading quote..." />
        </div>
      </MainLayout>
    )
  }

  if (error && !quote) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => navigate(`/books/${bookId}/quotes`)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back
          </button>
        </div>
      </MainLayout>
    )
  }

  if (!quote) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Quote not found</p>
          <button
            onClick={() => navigate(`/books/${bookId}/quotes`)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back
          </button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/books/${bookId}/quotes`)}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Quotes
        </button>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left/Center */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quote Display */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <blockquote className="text-2xl font-serif text-gray-800 italic text-center leading-relaxed mb-4">
                "{quote.text}"
              </blockquote>
              {quote.pageNumber && (
                <p className="text-center text-sm text-gray-500">
                  — Page {quote.pageNumber}
                </p>
              )}
            </div>

            {/* Canvas Drawing Area */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Decorate Your Quote
                </h3>
                <DrawingTools
                  drawingManager={drawingManagerRef.current}
                  onUndo={handleUndo}
                  onRedo={handleRedo}
                  onClear={handleClearCanvas}
                  onSave={handleSaveDrawing}
                  onExport={handleExportDrawing}
                  isSaving={isSaving}
                />
              </div>

              {/* Canvas with Page Template */}
              <div className="relative" ref={containerRef}>
                <PageTemplates template={pageTemplate} />
                <canvas
                  ref={canvasRef}
                  className="w-full border-2 border-gray-200 cursor-crosshair relative z-10"
                  style={{ minHeight: '600px' }}
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Page Template Selection */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-bold text-gray-900 mb-3">Page Template</h3>
              <div className="space-y-2">
                {[
                  { value: 'blank', label: '📄 Blank' },
                  { value: 'lined', label: '📋 Lined' },
                  { value: 'dot', label: '⚫ Dot Grid' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="pageTemplate"
                      value={option.value}
                      checked={pageTemplate === option.value}
                      onChange={(e) => setPageTemplate(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reflection Section */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-bold text-gray-900 mb-3">Your Reflection</h3>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Write your thoughts and reflections about this quote..."
                rows="6"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={handleSaveReflection}
                disabled={isSaving}
                className="w-full mt-3 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Reflection'}
              </button>
            </div>

            {/* Share Section */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-bold text-gray-900 mb-3">Share This Quote</h3>
              <button
                onClick={handleCreatePublicShare}
                disabled={isSaving}
                className="w-full px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
              >
                {isSaving ? 'Creating...' : '🔗 Generate Share Link'}
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Create a public link to share this quote with others
              </p>
            </div>

            {/* Stats */}
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
              <p>✏️ Last edited: {new Date(quote.updatedAt?.toDate?.() || quote.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
