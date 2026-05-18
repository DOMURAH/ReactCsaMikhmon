import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import { useAuth } from '@clerk/react'
import Home from './components/Layout/Home'
import Login from './components/Login/Login'
import SignUp from './components/Signup/Signup'
import Welcome from './components/Auth/Welcome'
import Upload from './components/upload_File/Upload.jsx'
import { StatsProvider } from './StatsContext.jsx'
import AuthProvider from './components/Auth/AuthContext.jsx'
import ClerkAuthSync from './components/Auth/ClerkAuthSync.jsx'
import AuthCompleteRedirect from './components/Auth/AuthCompleteRedirect.jsx'

function AuthSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <CircularProgress size={32} sx={{ color: 'white' }} />
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) return <AuthSpinner />
  if (isSignedIn) return children
  return <Navigate to="/sign-in" replace />
}

function PublicAuthRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) return <AuthSpinner />
  if (isSignedIn) return <Navigate to="/dashboard" replace />
  return children
}

function App() {
  return (
    <StatsProvider>
      <AuthProvider>
        <ClerkAuthSync />
        <BrowserRouter>
          <AuthCompleteRedirect />
          <Routes>
            <Route
              path="/"
              element={
                <PublicAuthRoute>
                  <Welcome />
                </PublicAuthRoute>
              }
            />
            <Route
              path="/sign-in"
              element={
                <PublicAuthRoute>
                  <Login />
                </PublicAuthRoute>
              }
            />
            <Route
              path="/sign-up"
              element={
                <PublicAuthRoute>
                  <SignUp />
                </PublicAuthRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </StatsProvider>
  )
}

export default App
