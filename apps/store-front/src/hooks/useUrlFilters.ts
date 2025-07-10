import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo, useRef } from 'react';
import { isEqual } from '@baby-toys/ui-kit/utils';

type Parser<T> = (value: string) => T;

export const useUrlFilters = <T extends Record<string, any>>(
  parsers: Record<keyof T, Parser<any>>,
  defaultValues: Partial<T> = {},
  filterKeys?: (keyof T)[]
) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Keep a ref to last filters to avoid returning new object if unchanged
  const lastFiltersRef = useRef<Partial<T>>({});

  const urlFilters = useMemo((): Partial<T> => {
    const keys = filterKeys ?? (Object.keys(parsers) as (keyof T)[]);

    const result = {} as Partial<T>;

    keys.forEach((key) => {
      const val = searchParams.get(key as string);
      if (val !== null) {
        result[key] = parsers[key](val);
      } else {
        result[key] = defaultValues[key];
      }
    });

    if (isEqual(result, lastFiltersRef.current)) {
      return lastFiltersRef.current;
    } else {
      lastFiltersRef.current = result;
      return result;
    }
  }, [searchParams, parsers, defaultValues, filterKeys]);

  const updateUrlFilters = useCallback(
    (newFilters: Partial<T>) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);

        Object.entries(newFilters).forEach(([key, value]) => {
          const defaultVal = defaultValues[key as keyof T];

          if (value === undefined || value === null || value === '' || value === defaultVal) {
            params.delete(key);
          } else {
            if (Array.isArray(value)) {
              params.set(key, JSON.stringify(value));
            } else {
              params.set(key, value.toString());
            }
          }
        });

        if (!('page' in newFilters)) {
          params.delete('page');
        }

        return params;
      });
    },
    [setSearchParams, defaultValues]
  );

  const clearFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  const filtersToSearchParams = useCallback(
    (filters: Partial<T>): URLSearchParams => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        const defaultVal = defaultValues[key as keyof T];
        if (value !== undefined && value !== null && value !== '' && value !== defaultVal) {
          params.set(key, value.toString());
        }
      });
      return params;
    },
    [defaultValues]
  );

  const navigateTo = useCallback(
    (path: string, filters: Partial<T>) => {
      const params = filtersToSearchParams(filters);
      return `${path}?${params.toString()}`;
    },
    [filtersToSearchParams]
  );

  return {
    urlFilters,
    updateUrlFilters,
    clearFilters,
    navigateTo,
  };
};
