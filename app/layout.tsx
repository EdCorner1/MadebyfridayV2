import type { Metadata } from 'next';
import { Bricolage_Grotesque, Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './components/AuthProvider';
import PwaRegister from './components/PwaRegister';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.madebyfriday.tech'),
  applicationName: 'Made by Friday',
  title: 'Made by Friday — Viral Script Generator for UGC Creators',
  description: 'Tell Friday what you\'re making. Get viral hooks, pick your winner, and rewrite your script in your creator workspace.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Friday',
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'Made by Friday — Viral Script Generator for UGC Creators',
    description: 'Find viral hooks, rewrite scripts, and build your creator workspace with Friday.',
    url: '/',
    siteName: 'Made by Friday',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        <PwaRegister />
      </body>
    </html>
  );
}
