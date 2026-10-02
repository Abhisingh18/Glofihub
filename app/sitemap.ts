import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'

// Only indexable pages belong here. The "launching soon" business pages
// (/academy, /export-import) are noindex — add them once those businesses go live.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    {
      // Group home — hub for every business
      url: SITE.url,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      // GlofiHub Digital + full service list
      url: `${SITE.url}/services`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE.url}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
