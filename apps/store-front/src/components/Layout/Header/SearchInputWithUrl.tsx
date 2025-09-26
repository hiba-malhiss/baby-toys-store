import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StringInput } from '@baby-toys/ui-kit';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useUrlFilters } from '../../../hooks/useUrlFilters.ts';

const parsers = {
  query: (val: string) => val,
};
const SearchInputWithUrl = () => {
  const navigate = useNavigate();
  const { urlFilters, updateUrlFilters } = useUrlFilters(parsers, {}, ['query']);
  const [value, setValue] = useState<string>(urlFilters?.query ?? '');

  useEffect(() => {
    setValue(urlFilters?.query ?? '');
  }, [urlFilters?.query]);

  const handleSearch = (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    const trimmed = (value ?? '').trim();
    updateUrlFilters({ query: trimmed || undefined });
    navigate({
      pathname: '/shop',
      search: trimmed ? `?query=${encodeURIComponent(trimmed)}` : '',
    });
  };

  return (
    <form onSubmit={handleSearch} aria-label="Product Search Form">
      <StringInput
        placeholder="Search products..."
        fullWidth
        value={value}
        onChange={(val) => {
          const next = String(val ?? '');
          setValue(next);
          if (next.trim() === '') {
            updateUrlFilters({ query: undefined });
            navigate({ pathname: '/shop' });
          }
        }}
        iconRight={faSearch}
        withIconBackground
        onIconClick={handleSearch}
      />
    </form>
  );
};

export default SearchInputWithUrl;
