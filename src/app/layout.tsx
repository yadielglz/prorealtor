import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { env } from '@/lib/env'
import '@/styles/globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: {
    default: 'Pro Realtor - Complete Real Estate Business Management',
    template: '%s | Pro Realtor'
  },
  description: 'Pro Realtor - Complete real estate business management platform with CRM, property management, document handling, and communication tools.',
  keywords: [
    'real estate',
    'realtor',
    'CRM',
    'property management',
    'MLS',
    'real estate software',
    'lead management',
    'property listings'
  ],
  authors: [{ name: 'Pro Realtor Team' }],
  creator: 'Pro Realtor',
  publisher: 'Pro Realtor',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: env.NEXT_PUBLIC_APP_URL,
    title: 'Pro Realtor - Complete Real Estate Business Management',
    description: 'Pro Realtor - Complete real estate business management platform with CRM, property management, document handling, and communication tools.',
    siteName: 'Pro Realtor',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pro Realtor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pro Realtor - Complete Real Estate Business Management',
    description: 'Pro Realtor - Complete real estate business management platform with CRM, property management, document handling, and communication tools.',
    images: ['/og-image.png'],
    creator: '@realtorplatform',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Pro Realtor',
  },
  applicationName: 'Pro Realtor',
  category: 'business',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  colorScheme: 'light dark',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Pro Realtor" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">
              {children}
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
        
        {/* Analytics - Add @vercel/analytics and @vercel/speed-insights packages if needed */}
        {env.NEXT_PUBLIC_ENABLE_ANALYTICS && (
          <div>
            {/* Analytics components will be added when packages are installed */}
          </div>
        )}
        
        {/* Service Worker Registration */}
        {env.NEXT_PUBLIC_ENABLE_PWA && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').then(function(registration) {
                      console.log('SW registered: ', registration);
                    }).catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                  });
                }
              `,
            }}
          />
        )}
      </body>
    </html>
  )
}