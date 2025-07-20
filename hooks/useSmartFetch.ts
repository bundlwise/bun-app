import { useState, useCallback, useEffect } from 'react';

interface FetchOptions {
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  auto?: boolean;
}

export function useSmartFetch<T = any>(initialOptions?: FetchOptions) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<FetchOptions | undefined>(initialOptions);

  const fetchData = useCallback(async (overrideOptions?: FetchOptions) => {
    const merged = { ...options, ...overrideOptions };
    if (!merged.url) throw new Error('No URL provided to useSmartFetch');
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(merged.url, {
        method: merged.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...merged.headers,
        },
        body: merged.body ? JSON.stringify(merged.body) : undefined,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Request failed');
      setData(result);
      return { data: result };
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      return { error: err.message || 'Unknown error' };
    } finally {
      setLoading(false);
    }
  }, [options]);

  // Real-time validation function
  const validateField = useCallback(async (fieldType: 'email' | 'username', value: string) => {
    if (!value || value.length < 3) return null; // Don't validate if too short
    
    try {
      const response = await fetch(`https://your-api.com/validate-${fieldType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [fieldType]: value }),
      });
      const result = await response.json();
      return result.exists ? `${fieldType} already exists` : null;
    } catch (err) {
      return null; // Don't show error for validation failures
    }
  }, []);

  // Optionally auto-fetch on mount
  useEffect(() => {
    if (options?.auto) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // refetch can take new options
  const refetch = (overrideOptions?: FetchOptions) => {
    if (overrideOptions) setOptions(prev => ({ ...prev, ...overrideOptions }));
    return fetchData(overrideOptions);
  };

  return { data, loading, error, refetch, validateField };
}
