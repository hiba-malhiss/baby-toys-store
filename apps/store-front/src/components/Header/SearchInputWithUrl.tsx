import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StringInputWithButton } from '@baby-toys/ui-kit/components';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useUrlFilters } from '../../hooks/useUrlFilters.ts';

const parsers = {
  search: (val: string) => val,
};
const SearchInputWithUrl = () => {
  const navigate = useNavigate();
  const { urlFilters, updateUrlFilters } = useUrlFilters(parsers, {}, ['search']);

  const handleSearch = (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    const trimmed = (urlFilters?.search ?? '').trim();
    updateUrlFilters({ search: trimmed || undefined });
    navigate({
      pathname: '/shop',
      search: trimmed ? `?search=${encodeURIComponent(trimmed)}` : '',
    });
  };

  return (
    <form onSubmit={handleSearch} aria-label="Product Search Form">
      <StringInputWithButton
        placeholder="Search products..."
        buttonIcon={faSearch}
        fullWidth
        value={urlFilters?.search}
        onChange={(val) => updateUrlFilters({ search: val })}
        onIconClick={handleSearch}
        onClick={handleSearch}
      />
    </form>
  );
};

export default SearchInputWithUrl;
