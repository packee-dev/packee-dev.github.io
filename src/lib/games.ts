import type { Locale } from '@/lib/i18n';
import { DEFAULT_LOCALE } from '@/lib/i18n';

export interface DownloadLink {
  label: string;
  url: string;
}

export interface GameTranslation {
  title: string;
  shortDescription: string;
  description: string;
  features: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface GameShared {
  slug: string;
  icon: string;
  screenshots: string[];
  downloads: DownloadLink[];
  order: number;
  published: boolean;
}

export interface GameData extends GameShared {
  translations: Partial<Record<Locale, GameTranslation>>;
}

export interface LocalizedGame extends GameShared, GameTranslation {}

const PLACEHOLDER_IMAGE = `${import.meta.env.BASE_URL}images/placeholder.svg`;

const gameModules = import.meta.glob('@/data/games/*.json', { eager: true });

const games = Object.values(gameModules)
  .map((mod) => (mod as { default: GameData }).default)
  .map((game): GameData => ({
    slug: game.slug,
    icon: game.icon || PLACEHOLDER_IMAGE,
    screenshots: game.screenshots?.length ? game.screenshots : [PLACEHOLDER_IMAGE],
    downloads: game.downloads ?? [],
    order: typeof game.order === 'number' ? game.order : 999,
    published: game.published ?? false,
    translations: game.translations ?? {}
  }))
  .sort((a, b) => a.order - b.order);

const resolveGameTranslation = (game: GameData, locale: Locale): GameTranslation => {
  const fallback = game.translations[DEFAULT_LOCALE];
  const target = game.translations[locale] ?? fallback;

  return {
    title: target?.title ?? fallback?.title ?? 'Untitled Game',
    shortDescription: target?.shortDescription ?? fallback?.shortDescription ?? 'Description coming soon.',
    description: target?.description ?? fallback?.description ?? 'Details coming soon.',
    features: target?.features?.length ? target.features : fallback?.features ?? [],
    seoTitle: target?.seoTitle ?? fallback?.seoTitle,
    seoDescription: target?.seoDescription ?? fallback?.seoDescription
  };
};

export const getAllGames = (locale: Locale): LocalizedGame[] =>
  games.filter((game) => game.published).map((game) => ({ ...game, ...resolveGameTranslation(game, locale) }));

export const getGameBySlug = (slug: string, locale: Locale): LocalizedGame | undefined => {
  const game = games.find((entry) => entry.slug === slug && entry.published);
  if (!game) return undefined;
  return { ...game, ...resolveGameTranslation(game, locale) };
};

export const getRelatedGames = (slug: string, locale: Locale, limit = 2): LocalizedGame[] =>
  getAllGames(locale)
    .filter((game) => game.slug !== slug)
    .slice(0, limit);

export const getPublishedGameSlugs = (): string[] => games.filter((game) => game.published).map((game) => game.slug);
