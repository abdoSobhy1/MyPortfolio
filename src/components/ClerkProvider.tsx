import { ClerkProvider as BaseClerkProvider } from "@clerk/clerk-react";
import type React from "react";

interface ClerkProviderProps {
  children: React.ReactNode;
}

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export function ClerkProvider({ children }: ClerkProviderProps) {
  return (
    <BaseClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      appearance={{
        signIn: {
          variables: {
            colorPrimary: "#8B5CF6",
          },
        },
        signUp: {
          variables: {
            colorPrimary: "#8B5CF6",
          },
        },
      }}
    >
      {children}
    </BaseClerkProvider>
  );
}
