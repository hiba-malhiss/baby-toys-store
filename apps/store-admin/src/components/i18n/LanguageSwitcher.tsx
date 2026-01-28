import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { queryClient } from '../../App';
import { getAppLocale, setAppLocale } from './locale';
import { Button, ButtonGroup } from '@baby-toys/ui-kit';

type Locale = 'en' | 'ar';

function normalizeLocale(raw?: string | null): Locale{
  const v = (raw || '').toLowerCase();
  return v.startsWith('ar') ? 'ar' : 'en';
}

function applyDocumentLang(locale: Locale){
  if(typeof document === 'undefined') return;

  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('lang', locale);
  document.documentElement.setAttribute('dir', dir);
}

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const current = useMemo<Locale>(() => {
    const fromI18n = normalizeLocale(i18n.resolvedLanguage || i18n.language);
    const fromStorage = normalizeLocale(getAppLocale());
    // prefer i18n if set, otherwise fallback to stored
    return fromI18n || fromStorage;
  }, [i18n.language, i18n.resolvedLanguage]);

  const isAr = current === 'ar';

  const switchTo = useCallback(
    async(next: Locale) => {
      setAppLocale(next);
      applyDocumentLang(next);
      await i18n.changeLanguage(next);
      // Refresh queries to pick up new Accept-Language header
      queryClient.invalidateQueries();
    },
    [i18n]
  );

  return (
    <ButtonGroup>
      <Button
        appearance="outline"
        color="highlighted"
        size="xsmall"
        isSelected={isAr}
        onClick={() => switchTo('ar')}
      >
        AR
      </Button>
      <Button
        appearance="outline"
        color="highlighted"
        size="xsmall"
        isSelected={!isAr}
        onClick={() => switchTo('en')}
      >
        EN
      </Button>
    </ButtonGroup>
  );
};

export default LanguageSwitcher;
