import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import LoadingSpinner from './components/common/LoadingSpinner'

// Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import BooksPage from './pages/BooksPage'

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading..." />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default function App() {
  const { isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Initializing..." />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <BooksPage />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
