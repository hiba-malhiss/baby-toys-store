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
  const lastFiltersRef = useRef<Record<string, any>>({});

  const urlFilters = useMemo((): Partial<T> & Record<string, any> => {
    const keys = filterKeys ?? (Object.keys(parsers) as (keyof T)[]);

    const result: Record<string, any> = {};

    // 1) Include ALL current URL params; parse via parser if known, else keep raw string
    for (const [key, val] of searchParams.entries()) {
      const parser = parsers[key as keyof T];
      result[key] = parser ? parser(val) : val;
    }

    // 2) Ensure known keys not present in URL fall back to defaults
    keys.forEach((key) => {
      if (!searchParams.has(key as string)) {
        result[key as string] = defaultValues[key];
      }
    });

    if (isEqual(result, lastFiltersRef.current)) {
      return lastFiltersRef.current as Partial<T> & Record<string, any>;
    } else {
      lastFiltersRef.current = result;
      return result as Partial<T> & Record<string, any>;
    }
  }, [searchParams, parsers, defaultValues, filterKeys]);

  const updateUrlFilters = useCallback(
    (newFilters: Partial<T>) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);

        Object.entries(newFilters).forEach(([key, value]) => {
          const defaultVal = defaultValues[key as keyof T];

          if (
            value === undefined ||
            value === null ||
            value === '' ||
            isEqual(value, defaultVal) ||
            (Array.isArray(value) && value.filter(Boolean).length === 0)
          ) {
            params.delete(key);
          } else {
            params.set(key, Array.isArray(value) ? value.join(',') : value.toString());
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
    setSearchParams(defaultValues || {});
  }, [setSearchParams, defaultValues]);

  const filtersToSearchParams = useCallback(
    (filters: Partial<T>): URLSearchParams => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        const defaultVal = defaultValues[key as keyof T];
        if (value !== undefined && value !== null && value !== '' && !isEqual(value, defaultVal)) {
          params.set(key, Array.isArray(value) ? value.join(',') : value.toString());
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
