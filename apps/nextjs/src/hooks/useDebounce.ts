import { useEffect, useState } from 'react';

/**
 * Use debounce to prevent a value from being set too rapidly.
 * This is useful for values that reactively trigger expensive actions
 * like making an API call or a large calculation.
 */
export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay ?? 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
