import type { Metadata } from 'next';
import Script from 'next/script';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://hiddenlibrary.io';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Hidden Library — Specific answers to specific questions',
    template: '%s — Hidden Library',
  },
  description: 'Deep-dive guides on money, business, career, productivity, and financial health. Ask a specific question, get a complete document.',
  keywords: ['guides', 'pdf guides', 'money', 'business', 'career', 'productivity', 'financial health', 'how-to'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Hidden Library',
    title: 'Hidden Library — Specific answers to specific questions',
    description: 'Deep-dive guides on money, business, career, productivity, and financial health. Ask a specific question, get a complete document.',
    url: BASE_URL,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hidden Library — Specific answers to specific questions',
    description: 'Deep-dive guides on money, business, career, productivity, and financial health.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/icon.ico',
    apple: '/icon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Hidden Library',
    url: BASE_URL,
    logo: `${BASE_URL}/icon.ico`,
    description: 'Deep-dive guides on money, business, career, productivity, and financial health.',
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Hidden Library',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-74HW95LC49"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-74HW95LC49');
          `}
        </Script>
      </head>
      <body style={{ margin: 0, padding: 0, background: '#0d0d0d' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
