import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

const BRAND = 'GlofiHub Import-Export';

/**
 * Metadata for the pages of the Import-Export website.
 * - `title`: a SHORT page title; the layout's template adds " | GlofiHub Import-Export".
 * - `absoluteTitle`: a full title that bypasses the template (home page).
 * `openGraph` / `twitter` are re-declared in full because a page-level object replaces the root layout's
 * (so the share image and site name are kept).
 */
export function tradeMetadata({
  title,
  absoluteTitle,
  description,
  path,
}: {
  title?: string;
  absoluteTitle?: string;
  description: string;
  /** Canonical path, e.g. '/import-export/services'. */
  path: string;
}): Metadata {
  const shareTitle = absoluteTitle ?? (title ? `${title} | ${BRAND}` : BRAND);
  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: SITE.name,
      locale: SITE.locale,
      title: shareTitle,
      description,
      url: path,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: `${SITE.name} — ${SITE.tagline}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: shareTitle,
      description,
      images: [SITE.ogImage],
    },
  };
}
