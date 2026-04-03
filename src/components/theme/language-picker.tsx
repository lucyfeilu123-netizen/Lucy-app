'use client';

import { Globe } from 'lucide-react';
import { useI18n } from '@/lib/i18n/provider';
import { localeNames, Locale } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils';

const locales: Locale[] = ['en', 'zh-TW', 'es'];

export function LanguagePicker() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <Globe size={14} className="text-[var(--fg-quieter)]" />
      <div className="flex gap-1">
        {locales.map((l) => (
          <button
            key={l}
            onClick={() => setLocale(l)}
            className={cn(
              'px-2 py-0.5 rounded text-xs font-medium transition-colors',
              locale === l
                ? 'bg-[var(--accent)] text-white'
                : 'text-[var(--fg-quieter)] hover:text-[var(--fg)] hover:bg-[var(--bg-quiet)]'
            )}
          >
            {l === 'en' ? 'EN' : l === 'zh-TW' ? '\u4e2d\u6587' : 'ES'}
          </button>
        ))}
      </div>
    </div>
  );
}
