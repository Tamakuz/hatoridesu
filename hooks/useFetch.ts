import { useState, useCallback } from 'react';

interface UseFetchResult<T> {
  data: T;
  isLoading: boolean;
  error: Error | null;
  get: (url: string) => Promise<void>;
  post: (url: string, body: any) => Promise<void>;
  put: (url: string, body: any) => Promise<void>;
  delete: (url: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const cache: { [key: string]: any } = {};

function useFetch<T>(): UseFetchResult<T> {
  const [data, setData] = useState<T>({} as T);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  const fetchData = useCallback(async (url: string, method: string, body?: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result as T);
      if (method === 'GET') {
        cache[url] = result;
        setCurrentUrl(url);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const get = useCallback(async (url: string) => {
    if (cache[url]) {
      setData(cache[url] as T);
      setCurrentUrl(url);
      return;
    }
    await fetchData(url, 'GET');
  }, [fetchData]);

  const post = useCallback(async (url: string, body: any) => {
    await fetchData(url, 'POST', body);
  }, [fetchData]);

  const put = useCallback(async (url: string, body: any) => {
    await fetchData(url, 'PUT', body);
  }, [fetchData]);

  const deleteRequest = useCallback(async (url: string) => {
    await fetchData(url, 'DELETE');
  }, [fetchData]);

  const refetch = useCallback(async () => {
    if (currentUrl) {
      await get(currentUrl);
    }
  }, [currentUrl, get]);

  return { data, isLoading, error, get, post, put, delete: deleteRequest, refetch };
}

export default useFetch;
