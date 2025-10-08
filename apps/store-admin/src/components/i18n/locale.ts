export function getAppLocale(): string {
  try {
    return (
      localStorage.getItem('app.locale') ||
      localStorage.getItem('i18nextLng') ||
      navigator.language ||
      'en'
    )
      .slice(0, 2)
      .toLowerCase();
  } catch {
    return 'en';
  }
}

export function setAppLocale(locale: string): void {
  try {
    localStorage.setItem('app.locale', locale);
  } catch {
    // ignore storage errors
  }
}

export function getSupportedLocales(): string[] {
  return ['ar', 'en'];
}
