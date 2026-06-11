const siteBase = import.meta.env.BASE_URL.replace(/\/+$/, '');

export const LOCALES = ['en', 'es', 'pt', 'fr', 'it', 'ru', 'tr', 'zh', 'ar', 'ja', 'hi', 'bn', 'de', 'ko', 'vi'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const RTL_LOCALES: Locale[] = ['ar'];

export const LOCALE_LABELS: Record<Locale, { code: string; nativeName: string }> = {
  en: { code: 'EN', nativeName: 'English' },
  es: { code: 'ES', nativeName: 'Español' },
  pt: { code: 'PT', nativeName: 'Português' },
  fr: { code: 'FR', nativeName: 'Français' },
  it: { code: 'IT', nativeName: 'Italiano' },
  ru: { code: 'RU', nativeName: 'Русский' },
  tr: { code: 'TR', nativeName: 'Türkçe' },
  zh: { code: 'ZH', nativeName: '中文' },
  ar: { code: 'AR', nativeName: 'العربية' },
  ja: { code: 'JA', nativeName: '日本語' },
  hi: { code: 'HI', nativeName: 'हिन्दी' },
  bn: { code: 'BN', nativeName: 'বাংলা' },
  de: { code: 'DE', nativeName: 'Deutsch' },
  ko: { code: 'KO', nativeName: '한국어' },
  vi: { code: 'VI', nativeName: 'Tiếng Việt' }
};

export const isLocale = (value: string): value is Locale => LOCALES.includes(value as Locale);

export const isRtlLocale = (locale: Locale): boolean => RTL_LOCALES.includes(locale);

const dictionaries = import.meta.glob('@/data/i18n/*.json', { eager: true });

export interface UiDictionary {
  nav: { games: string; about: string; contact: string; privacy: string };
  hero: { badge: string; ctaPrimary: string; ctaSecondary: string };
  home: {
    gamesEyebrow: string;
    gamesTitle: string;
    gamesSubtitle: string;
    whyEyebrow: string;
    whyTitle: string;
    whySubtitle: string;
    whyCards: { title: string; description: string }[];
    aboutEyebrow: string;
    aboutTitle: string;
    aboutSubtitle: string;
    contactEyebrow: string;
    contactTitle: string;
    contactSubtitle: string;
  };
  game: {
    explore: string;
    back: string;
    featuresTitle: string;
    aboutTitle: string;
    relatedTitle: string;
    screenshots: string;
    swipeHint: string;
    download: string;
    downloadsSoon: string;
    featuresSoon: string;
    openScreenshot: string;
    closeGallery: string;
    previousScreenshot: string;
    nextScreenshot: string;
    screenshotOf: string;
    screenshotAlt: string;
    iconAlt: string;
  };
  contact: { telegram: string; whatsapp: string; email: string };
  seo: { homeTitle: string; homeDescription: string; privacyTitle: string; privacyDescription: string };
  footer: { rights: string };
}

const dictionaryByLocale = Object.entries(dictionaries).reduce(
  (acc, [path, mod]) => {
    const key = path.split('/').pop()?.replace('.json', '');
    if (key && isLocale(key)) {
      acc[key] = (mod as { default: UiDictionary }).default;
    }
    return acc;
  },
  {} as Partial<Record<Locale, UiDictionary>>
);

export const getDictionary = (locale: Locale): UiDictionary => dictionaryByLocale[locale] ?? dictionaryByLocale[DEFAULT_LOCALE]!;

export const localizePath = (locale: Locale, path = ''): string => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${siteBase}/${locale}${normalized === '/' ? '/' : normalized}`;
};

export const switchLocalePath = (pathname: string, targetLocale: Locale): string => {
  const parts = pathname.split('/').filter(Boolean);
  if (!parts.length) return `${siteBase}/${targetLocale}/`;
  if (isLocale(parts[0])) parts[0] = targetLocale;
  else parts.unshift(targetLocale);
  return `${siteBase}/${parts.join('/')}${pathname.endsWith('/') ? '/' : ''}`;
};

export const getAlternateLinks = (pathname: string): { locale: Locale; href: string }[] => {
  const current = pathname || '/';
  return LOCALES.map((locale) => ({ locale, href: switchLocalePath(current, locale) }));
};

export { siteBase };
