import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import MainLayout from '../../components/layout/MainLayout'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import * as authService from '../../services/authService'

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuthStore()
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      setError('')
      setSuccess('')

      await updateProfile({
        displayName: formData.displayName,
        email: formData.email,
      })

      setSuccess('Profile updated successfully!')
      setIsEditing(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      await logout()
      navigate('/login')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <LoadingSpinner />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Page Header */}
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl">
                  {user.displayName?.charAt(0) || user.email?.charAt(0)}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {user.displayName || 'No Name'}
              </h2>
              <p className="text-gray-600 mb-4">{user.email}</p>

              {!isEditing && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50"
                  >
                    {isLoading ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <form onSubmit={handleUpdateProfile} className="mt-6 pt-6 border-t border-gray-200 space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Display Name</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Account Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Account Created</p>
              <p className="font-medium text-gray-900">
                {user.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString()
                  : 'Unknown'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Signed In</p>
              <p className="font-medium text-gray-900">
                {user.metadata?.lastSignInTime
                  ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
                  : 'Unknown'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email Verified</p>
              <p className="font-medium text-gray-900">
                {user.emailVerified ? '✓ Yes' : '✗ No'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">User ID</p>
              <p className="font-medium text-gray-900 text-sm break-all">{user.uid}</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Statistics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">📚</p>
              <p className="text-sm text-gray-600 mt-2">Total Books</p>
              <p className="text-lg font-semibold text-gray-900">Coming Soon</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">💭</p>
              <p className="text-sm text-gray-600 mt-2">Total Quotes</p>
              <p className="text-lg font-semibold text-gray-900">Coming Soon</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">🔗</p>
              <p className="text-sm text-gray-600 mt-2">Shared Quotes</p>
              <p className="text-lg font-semibold text-gray-900">Coming Soon</p>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-red-50 rounded-lg shadow-md p-6 border border-red-200">
          <h3 className="text-lg font-bold text-red-900 mb-4">Danger Zone</h3>
          <p className="text-red-700 text-sm mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition">
            Delete Account
          </button>
        </div>
      </div>
    </MainLayout>
  )
}
