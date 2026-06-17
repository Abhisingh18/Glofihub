import type { Metadata, Viewport } from 'next'
import { Sora, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ScrollReveal } from '@/components/ScrollReveal'

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
  themeColor: '#0A2F6B'
}

export const metadata: Metadata = {
  title: 'GlofiHub - Gateway to Infinite Possibilities',
  description: 'AI-integrated platform connecting students & professionals with education, jobs, skills & global opportunities',
  generator: 'v0.app',
  icons: {
    icon: '/logo/logo.png',
    shortcut: '/logo/logo.png',
    apple: '/logo/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sora.variable} ${jakarta.variable}`}>
      <body className="font-sans bg-background text-foreground antialiased">
        <ThemeProvider>
          <ScrollReveal />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
