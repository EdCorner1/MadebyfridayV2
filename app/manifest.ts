import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Made by Friday',
    short_name: 'Friday',
    description: 'Find viral hooks, rewrite scripts, and build your creator workspace with Friday.',
    start_url: '/dashboard',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#FDFCF7',
    theme_color: '#DC2626',
    categories: ['productivity', 'social', 'business'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/maskable-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/maskable-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'New hook search',
        short_name: 'Search',
        description: 'Find viral hook references for a new content idea.',
        url: '/dashboard',
        icons: [{ src: '/logo_app_icon.png', sizes: '1024x1024' }],
      },
      {
        name: 'Go unlimited',
        short_name: 'Upgrade',
        description: 'Upgrade to unlimited rewrites.',
        url: '/upgrade',
        icons: [{ src: '/logo_app_icon.png', sizes: '1024x1024' }],
      },
    ],
  };
}
