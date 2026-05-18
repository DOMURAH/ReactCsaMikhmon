import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/react'
import { clerkAppearance } from './lib/clerkAppearance.js'

const publishableKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

if (!publishableKey) {
  throw new Error(
    'Clé Clerk manquante : définissez VITE_CLERK_PUBLISHABLE_KEY dans .env'
  )
}

createRoot(document.getElementById('root')).render(
  <ClerkProvider
    publishableKey={publishableKey}
    signInUrl="/sign-in"
    signUpUrl="/sign-up"
    signInFallbackRedirectUrl="/dashboard"
    signUpFallbackRedirectUrl="/dashboard"
    signInForceRedirectUrl="/dashboard"
    signUpForceRedirectUrl="/dashboard"
    appearance={clerkAppearance}
  >
    <App />
  </ClerkProvider>
)
