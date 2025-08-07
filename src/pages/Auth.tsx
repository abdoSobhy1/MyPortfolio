
import { SignIn, SignUp } from '@clerk/clerk-react'
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const { isSignedIn, isLoaded } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/dashboard')
    }
  }, [isSignedIn, isLoaded, navigate])

  if (isLoaded && isSignedIn) {
    return null // Prevent flash of auth page
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="grid-bg absolute inset-0 opacity-40" />
      <div className="relative z-10 w-full max-w-md">
        <Card className="glass-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription>
              {isSignUp ? 'Sign up to access the dashboard' : 'Sign in to access your dashboard'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-6">
              {isSignUp ? (
                <SignUp 
                  afterSignUpUrl="/dashboard"
                  redirectUrl="/dashboard"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "bg-transparent shadow-none border-none",
                    }
                  }}
                />
              ) : (
                <SignIn 
                  afterSignInUrl="/dashboard"
                  redirectUrl="/dashboard"
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "bg-transparent shadow-none border-none",
                    }
                  }}
                />
              )}
            </div>
            
            <div className="text-center">
              <Button 
                variant="link" 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Auth
