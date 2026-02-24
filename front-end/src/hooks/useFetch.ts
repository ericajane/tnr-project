import { useEffect, useReducer, useRef } from 'react';
import { apiClient } from '../api/client';

type State<T> =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: Error };

type Action<T> =
  | { type: 'LOADING' }
  | { type: 'SUCCESS'; payload: T }
  | { type: 'ERROR'; payload: Error };

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'LOADING':
      return { status: 'loading', data: null, error: null };
    case 'SUCCESS':
      return { status: 'success', data: action.payload, error: null };
    case 'ERROR':
      return { status: 'error', data: null, error: action.payload };
    default:
      return state;
  }
}

const initialState = { status: 'idle', data: null, error: null } as const;

/**
 * Fetches data from the NestJS API on mount (and whenever `path` changes).
 *
 * @example
 * const { data, status, error } = useFetch<User[]>('/users');
 */
export function useFetch<T>(path: string) {
  const [state, dispatch] = useReducer(reducer<T>, initialState as State<T>);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    dispatch({ type: 'LOADING' });

    apiClient
      .get<T>(path)
      .then((data) => dispatch({ type: 'SUCCESS', payload: data }))
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        dispatch({ type: 'ERROR', payload: err instanceof Error ? err : new Error(String(err)) });
      });

    return () => {
      abortRef.current?.abort();
    };
  }, [path]);

  return state;
}
