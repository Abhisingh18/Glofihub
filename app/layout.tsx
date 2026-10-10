import type { Metadata, Viewport } from 'next'
import { Sora, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ScrollReveal } from '@/components/ScrollReveal'
import { GetStartedModal } from '@/components/GetStartedModal'
import { StudentForm } from '@/components/StudentForm'
import { UtmCapture } from '@/components/UtmCapture'
import { SITE } from '@/lib/site'
import { DIVISIONS } from '@/lib/divisions'

const sora = Sora({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0A2F6B' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  generator: 'Next.js',
  keywords: [...SITE.keywords],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  category: 'business',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: `${SITE.name} — ${SITE.tagline}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.title,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/logo/logo.png',
    shortcut: '/logo/logo.png',
    apple: '/logo/logo.png',
  },
  manifest: '/manifest.webmanifest',
  // Add real values once you have them (Google Search Console, etc.)
  // verification: { google: 'xxxx' },
}

const ORG_ID = `${SITE.url}/#organization`

// schema.org type per business (by DIVISIONS slug); anything new falls back to a plain Organization.
const DIVISION_SCHEMA_TYPE: Record<string, string> = {
  education: 'EducationalOrganization',
  academy: 'EducationalOrganization',
  counselling: 'EducationalOrganization',
  consulting: 'ProfessionalService',
  technology: 'ProfessionalService',
}

// Plain data only — DIVISIONS carries icon components that must not reach JSON.stringify.
const subOrganizations = DIVISIONS.map((d) => ({
  '@type': DIVISION_SCHEMA_TYPE[d.slug] ?? 'Organization',
  '@id': `${SITE.url}/#division-${d.slug}`,
  name: d.name,
  description: d.description,
  slogan: d.tagline,
  url: d.href.startsWith('/') ? `${SITE.url}${d.href}` : d.href,
  parentOrganization: { '@id': ORG_ID },
}))

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: SITE.name,
      legalName: SITE.legalName,
      slogan: SITE.tagline,
      url: SITE.url,
      logo: `${SITE.url}/logo/logo.png`,
      image: `${SITE.url}${SITE.ogImage}`,
      description: SITE.description,
      email: SITE.email,
      telephone: SITE.phone,
      sameAs: Object.values(SITE.social),
      subOrganization: subOrganizations,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: SITE.phone,
        contactType: 'customer service',
        email: SITE.email,
        areaServed: ['IN', 'RU'],
        availableLanguage: ['en', 'hi'],
      },
      areaServed: ['India', 'Russia', 'Central Asia'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      description: SITE.description,
      publisher: { '@id': ORG_ID },
      inLanguage: 'en-IN',
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sora.variable} ${jakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-background text-foreground antialiased">
        <ThemeProvider>
          <ScrollReveal />
          <UtmCapture />
          {children}
          <GetStartedModal />
          <StudentForm />
        </ThemeProvider>
      </body>
    </html>
  )
}
