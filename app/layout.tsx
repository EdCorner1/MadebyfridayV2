import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Made by Friday — Viral Script Generator for UGC Creators',
  description: 'Tell Friday what you\'re making. Get 6 viral hooks. Pick your winner. Rewrite your script. Done in 60 seconds.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Stinger:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-stinger antialiased">
        {children}
      </body>
    </html>
  );
}