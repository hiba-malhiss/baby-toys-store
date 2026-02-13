import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo, useRef } from 'react';
import { isEqual } from '@baby-toys/ui-kit/utils';

type Parser<T> = (value: string, key: string) => T;

export type PrefixParser = {
  prefix: string;
  parser: Parser<any>;
};

export const useUrlFilters = <T extends Record<string, any>>(
  parsers: Record<string, Parser<any>>,
  defaultValues: Partial<T> = {},
  filterKeys?: (keyof T)[],
  prefixParsers: PrefixParser[] = []
) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const lastFiltersRef = useRef<Record<string, any>>({});

  const getParserForKey = (key: string): Parser<any> | undefined => {
    if (parsers[key]) return parsers[key];

    const prefixMatch = prefixParsers.find((p) => key.startsWith(p.prefix));
    return prefixMatch?.parser;
  };

  const urlFilters = useMemo((): Partial<T> & Record<string, any> => {
    const keys = filterKeys ?? (Object.keys(parsers) as (keyof T)[]);
    const result: Record<string, any> = {};

    // 1️⃣ Parse ALL URL params (including dynamic ones)
    for (const [key, val] of searchParams.entries()) {
      const parser = getParserForKey(key);
      result[key] = parser ? parser(val, key) : val;
    }

    // 2️⃣ Ensure known keys fallback to defaults
    keys.forEach((key) => {
      if (!searchParams.has(key as string)) {
        result[key as string] = defaultValues[key];
      }
    });

    if (isEqual(result, lastFiltersRef.current)) {
      return lastFiltersRef.current as Partial<T> & Record<string, any>;
    }

    lastFiltersRef.current = result;
    return result as Partial<T> & Record<string, any>;
  }, [searchParams, parsers, defaultValues, filterKeys, prefixParsers]);

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
            (Array.isArray(value) && value.length === 0)
          ) {
            params.delete(key);
          } else {
            const stringValue = Array.isArray(value) ? value.join(',') : value.toString();

            params.set(key, stringValue);
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

  const deleteParamsWithPrefix = (prefix: string) => {
    Array.from(searchParams.keys()).forEach((key) => {
      if (key.startsWith(prefix)) {
        searchParams.delete(key);
      }
    });
  };

  const clearFilters = useCallback(() => {
    prefixParsers?.map(({ prefix }) => {
      deleteParamsWithPrefix(prefix);
    });
    Object.entries(defaultValues).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value);
      } else {
        searchParams.delete(key);
      }
    });
    setSearchParams(searchParams);
  }, [setSearchParams, searchParams, defaultValues, prefixParsers]);

  return {
    urlFilters,
    updateUrlFilters,
    clearFilters,
  };
};
