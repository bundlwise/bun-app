import { useEffect, useRef, useState } from 'react';

type UseSmartFetchProps<T> = {
  url: string;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  throttleDelay?: number; // in milliseconds
};

export const useSmartFetch = <T = any>({
  url,
  onSuccess,
  onError,
  throttleDelay = 2000,
}: UseSmartFetchProps<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const lastFetchTime = useRef<number>(0);

  const fetchData = async () => {
    const now = Date.now();
    if (now - lastFetchTime.current < throttleDelay) return;

    lastFetchTime.current = now;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const json = await response.json();
      setData(json);
      onSuccess?.(json); // success callback
    } catch (err) {
      setError(err);
      onError?.(err); // error callback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
