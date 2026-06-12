import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getPublicQuote } from '../../services/quoteService'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import PageTemplates from '../../components/quotes/PageTemplates'

export default function PublicQuoteSharePage() {
  const { shareId } = useParams()
  const [quote, setQuote] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const loadQuote = async () => {
      try {
        setIsLoading(true)
        setError('')
        const quoteData = await getPublicQuote(shareId)
        if (quoteData) {
          setQuote(quoteData)
          // Set OG meta tags for social sharing
          document.title = `"${quoteData.text.substring(0, 50)}..." - BookKeeper`
        } else {
          setError('Quote not found')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (shareId) {
      loadQuote()
    }
  }, [shareId])

  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareToTwitter = () => {
    const text = `"${quote.text}" - ${quote.author}`
    const url = window.location.href
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, '_blank')
  }

  const handleShareToFacebook = () => {
    const url = window.location.href
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(facebookUrl, '_blank')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner text="Loading quote..." />
      </div>
    )
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md">
          <div className="text-4xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quote Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'This quote does not exist or has been deleted.'}</p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">📚</div>
          <h1 className="text-3xl font-bold text-gray-900">BookKeeper</h1>
          <p className="text-gray-600 mt-1">A Beautiful Quote Shared With You</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quote Display Card */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-6">
                <blockquote className="text-3xl font-serif text-gray-800 italic text-center leading-relaxed mb-6">
                  "{quote.text}"
                </blockquote>
                {quote.author && (
                  <p className="text-center text-lg text-gray-600 font-medium">
                    — {quote.author}
                  </p>
                )}
              </div>

              {/* Drawing Canvas */}
              {quote.drawing && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">Decorated version:</p>
                  <img
                    src={quote.drawing}
                    alt="Quote decoration"
                    className="w-full rounded-lg border border-gray-200 shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Reflection Section */}
            {quote.reflection && (
              <div className="bg-blue-50 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Personal Reflection</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {quote.reflection}
                </p>
              </div>
            )}

            {/* Share Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4">Share This Quote</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    copied
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {copied ? '✓ Copied!' : '📋 Copy Link'}
                </button>
                <button
                  onClick={handleShareToTwitter}
                  className="px-4 py-2 bg-blue-400 text-white rounded-lg font-medium hover:bg-blue-500 transition flex items-center gap-2"
                >
                  <span>𝕏</span>
                  <span>Twitter</span>
                </button>
                <button
                  onClick={handleShareToFacebook}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <span>f</span>
                  <span>Facebook</span>
                </button>
                <a
                  href={`mailto:?subject=${encodeURIComponent(`Check out this quote`)}&body=${encodeURIComponent(
                    `"${quote.text}" - ${quote.author}\n\n${window.location.href}`
                  )}`}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition flex items-center gap-2"
                >
                  <span>✉️</span>
                  <span>Email</span>
                </a>
              </div>
            </div>

            {/* BookKeeper Promo */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md p-6 text-white text-center">
              <h3 className="text-xl font-bold mb-2">Love organizing quotes?</h3>
              <p className="mb-4">Create your own BookKeeper account and start saving your favorite quotes today!</p>
              <a
                href="/"
                className="inline-block px-6 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition"
              >
                Get Started Now
              </a>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quote Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quote Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Author</p>
                  <p className="font-medium text-gray-900">{quote.author || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Shared On</p>
                  <p className="font-medium text-gray-900">
                    {new Date(quote.createdAt?.toDate?.() || quote.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Character Count</p>
                  <p className="font-medium text-gray-900">{quote.text.length}</p>
                </div>
              </div>
            </div>

            {/* Share QR Code Placeholder */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="font-bold text-gray-900 mb-4">Share Instantly</h3>
              <div className="bg-gray-100 rounded-lg p-4 mb-4 aspect-square flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl mb-2">📱</p>
                  <p className="text-xs text-gray-600">QR Code Coming Soon</p>
                </div>
              </div>
              <p className="text-xs text-gray-600">
                Scan to share this quote with friends
              </p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4">Why BookKeeper?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span>✨</span>
                  <span>Beautiful quote organization</span>
                </li>
                <li className="flex gap-2">
                  <span>🎨</span>
                  <span>Decorate with drawings</span>
                </li>
                <li className="flex gap-2">
                  <span>💭</span>
                  <span>Write personal reflections</span>
                </li>
                <li className="flex gap-2">
                  <span>☁️</span>
                  <span>Cloud sync across devices</span>
                </li>
                <li className="flex gap-2">
                  <span>🔗</span>
                  <span>Easy sharing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-12 text-gray-600">
        <p>
          Made with ❤️ by{' '}
          <a href="/" className="text-blue-600 hover:underline font-medium">
            BookKeeper
          </a>
        </p>
      </div>
    </div>
  )
}
