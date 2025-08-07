
import { ClerkProvider as BaseClerkProvider } from '@clerk/clerk-react'
import { ReactNode } from 'react'

interface ClerkProviderProps {
  children: ReactNode
}

export function ClerkProvider({ children }: ClerkProviderProps) {
  return (
    <BaseClerkProvider 
      publishableKey="pk_test_Y2FzdWFsLWNyYW5lLTQ4LmNsZXJrLmFjY291bnRzLmRldiQ"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      appearance={{
        signIn: {
          variables: {
            colorPrimary: '#8B5CF6'
          }
        },
        signUp: {
          variables: {
            colorPrimary: '#8B5CF6'
          }
        }
      }}
    >
      {children}
    </BaseClerkProvider>
  )
}
