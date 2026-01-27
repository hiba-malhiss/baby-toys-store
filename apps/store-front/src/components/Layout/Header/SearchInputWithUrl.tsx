import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StringInput } from '@baby-toys/ui-kit';
import { Search } from 'lucide-react';
import { useUrlFilters } from '../../../hooks/useUrlFilters.ts';
import { useTranslation } from 'react-i18next';
import { suggest } from '../../../api/searchApi';

const parsers = {
  query: (val: string) => val,
};
const SearchInputWithUrl = () => {
  const navigate = useNavigate();
  const { urlFilters, updateUrlFilters } = useUrlFilters(parsers, {}, ['query']);
  const [value, setValue] = useState<string>(urlFilters?.query ?? '');
  const { t } = useTranslation('common');
  const isShopPage = location.pathname === '/shop' || location.pathname.startsWith('/shop/');

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
        placeholder={t('common.searchPlaceholder')}
        fullWidth
        value={value}
        onChange={(val) => {
          const next = String(val ?? '');
          setValue(next);
          if (next.trim() === '' && isShopPage) {
            updateUrlFilters({ query: undefined });
            navigate({ pathname: '/shop' });
          }
        }}
        iconRight={Search}
        withIconBackground
        onIconClick={handleSearch}
        autoCompleteEnabled
        getSuggestions={async (q) => {
          const { items } = await suggest(q, 10);
          return items.map((it) => ({ id: it.id, label: it.name }));
        }}
        onSuggestionSelected={(it) => {
          const name = String(it.label);
          setValue(name);
          updateUrlFilters({ query: name });
          navigate({ pathname: '/shop', search: `?query=${encodeURIComponent(name)}` });
        }}
      />
    </form>
  );
};

export default SearchInputWithUrl;
