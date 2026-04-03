'use client';

import { createContext, useContext, useCallback } from 'react';
import { translations, Locale } from './translations';
import { useUIStore } from '@/stores/ui-store';

interface I18nContext {
  locale: Locale;
  t: (key: string) => string;
  setLocale: (locale: Locale) => void;
}

const I18nCtx = createContext<I18nContext>({
  locale: 'en',
  t: (key) => key,
  setLocale: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = useUIStore((s) => s.locale);
  const setLocale = useUIStore((s) => s.setLocale);

  const t = useCallback((key: string): string => {
    return translations[locale]?.[key] || translations.en[key] || key;
  }, [locale]);

  return (
    <I18nCtx.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nCtx.Provider>
  );
}

export function useI18n() {
  return useContext(I18nCtx);
}
