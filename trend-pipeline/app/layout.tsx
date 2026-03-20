import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hidden Library — Specific answers to specific questions',
  description: 'Deep-dive guides on money, business, career, productivity, and financial health. Ask a specific question, get a complete document.',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: '#0d0d0d' }}>
        {children}
      </body>
    </html>
  );
}
