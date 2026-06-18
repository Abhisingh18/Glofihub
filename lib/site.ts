/**
 * Central site configuration — single source of truth for SEO / metadata.
 * Override the URL per-environment with NEXT_PUBLIC_SITE_URL (e.g. on Vercel).
 */
export const SITE = {
  name: 'GlofiHub',
  legalName: 'GlofiHub',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://glofihub.com').replace(/\/$/, ''),
  title: 'GlofiHub — Study Abroad, MBBS & Career Guidance Experts',
  shortTitle: 'GlofiHub',
  description:
    'GlofiHub is your gateway to global education & careers — expert counselling for study abroad, MBBS abroad, education in India, job placement and skill development. Trusted by students across India, Russia & Central Asia.',
  tagline: 'Gateway to Infinite Possibilities',
  locale: 'en_IN',
  email: 'info@glofihub.com',
  phone: '+919241168875',
  phoneDisplay: '+91 924 116 8875',
  whatsapp: '919241168875',
  ogImage: '/logo/logo.png',
  keywords: [
    'study abroad consultants',
    'MBBS abroad',
    'MBBS in Russia',
    'overseas education',
    'education consultancy India',
    'study abroad India',
    'career guidance',
    'job placement',
    'skill development',
    'education in India',
    'admission counselling',
    'student visa assistance',
    'GlofiHub',
  ],
  social: {
    instagram: 'https://www.instagram.com/glofihub',
    facebook: 'https://www.facebook.com/glofihub',
    youtube: 'https://www.youtube.com/@glofihub',
    linkedin: 'https://www.linkedin.com/company/glofihub',
  },
} as const;
