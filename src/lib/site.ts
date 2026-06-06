import type { Locale } from '@/lib/i18n';
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n';

export interface Founder {
  name: string;
  role: string;
  photo: string;
}

export interface SiteContact {
  telegram: string;
  whatsapp: string;
  email: string;
}

export interface SiteData {
  name: string;
  tagline: string;
  heroTitle: string;
  heroDescription: string;
  contact: SiteContact;
  founders: Founder[];
}

const siteModules = import.meta.glob('@/data/site/*.json', { eager: true });

const sites = Object.entries(siteModules).reduce(
  (acc, [path, mod]) => {
    const key = path.split('/').pop()?.replace('.json', '');
    if (key && isLocale(key)) {
      acc[key] = (mod as { default: SiteData }).default;
    }
    return acc;
  },
  {} as Partial<Record<Locale, SiteData>>
);

export const getSiteData = (locale: Locale): SiteData => {
  const site = sites[locale] ?? sites[DEFAULT_LOCALE]!;
  return {
    ...site,
    founders: site.founders.map((f) => ({
      ...f,
      photo: `${import.meta.env.BASE_URL}/${f.photo.replace(/^\//, '')}`
    }))
  };
};
