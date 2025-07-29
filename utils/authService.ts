import { useState } from 'react';

export function useGoogleAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signIn = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate async Google sign-in
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsAuthenticated(true);
    } catch (e) {
      setError('Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return { signIn, loading, error, isAuthenticated };
} 