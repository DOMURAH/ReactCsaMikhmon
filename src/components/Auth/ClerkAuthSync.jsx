import { useEffect, useContext } from 'react'
import { useUser } from '@clerk/react'
import { AuthContext } from './AuthContext.jsx'

const ClerkAuthSync = () => {
  const { user, isLoaded } = useUser()
  const { setUser } = useContext(AuthContext)

  useEffect(() => {
    if (!isLoaded) return
    if (user) {
      const displayName =
        user.firstName ||
        user.fullName ||
        user.primaryEmailAddress?.emailAddress
      setUser(displayName ?? 'Utilisateur')
    } else {
      setUser(null)
    }
  }, [user, isLoaded, setUser])

  return null
}

export default ClerkAuthSync
