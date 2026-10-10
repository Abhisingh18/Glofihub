import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'

// The parent site plus the pages of the five business websites (Counselling, Education, Academy,
// Import-Export, Technology). Admin, student and API routes are intentionally left out.
const PAGES: { path: string; priority: number; changeFrequency: 'weekly' | 'monthly' }[] = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/counselling', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/education', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/education/study-in-india', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/education/study-abroad', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/education/programs', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/academy', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/academy/courses', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/academy/teach', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/import-export', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/import-export/services', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/import-export/enquiry', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/technology', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/technology/services', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return PAGES.map((p) => ({
    url: `${SITE.url}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }))
}
