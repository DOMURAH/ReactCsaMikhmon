import { useEffect } from 'react'
import { useAuth } from '@clerk/react'
import { useLocation, useNavigate } from 'react-router-dom'

const AUTH_PAGES = ['/', '/sign-in', '/sign-up']

/**
 * Redirige vers /dashboard dès que Clerk a une session active
 * (filet de sécurité si Clerk renvoie vers / au lieu du dashboard).
 */
const AuthCompleteRedirect = () => {
  const { isLoaded, isSignedIn } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return
    if (AUTH_PAGES.includes(pathname)) {
      navigate('/dashboard', { replace: true })
    }
  }, [isLoaded, isSignedIn, pathname, navigate])

  return null
}

export default AuthCompleteRedirect
