import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

/**
 * Page metadata for the GlofiHub Academy website. A page-level `openGraph` / `twitter` replaces the root
 * layout's, so the site name, locale and image are repeated here to keep link previews complete.
 *
 * `title` is a short page name that the Academy layout turns into "<title> | GlofiHub Academy";
 * pass `absoluteTitle` for a full title that must not get that suffix (the Academy home page).
 */
export function academyMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  /** Canonical path of the page, e.g. '/academy/courses'. */
  path: string;
  absoluteTitle?: boolean;
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | GlofiHub Academy`;
  const image = { url: SITE.ogImage, width: 1200, height: 630, alt: `${SITE.name} — ${SITE.tagline}` };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: SITE.locale,
      siteName: SITE.name,
      url: path,
      title: fullTitle,
      description,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [SITE.ogImage],
    },
  };
}
