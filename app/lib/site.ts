const CANONICAL_SITE_URL = 'https://www.madebyfriday.tech';

export function getPublicSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredUrl?.startsWith('http://localhost') || configuredUrl?.startsWith('https://localhost')) {
    return configuredUrl.replace(/\/$/, '');
  }

  if (configuredUrl && !configuredUrl.includes('vercel.app')) {
    return configuredUrl.replace(/\/$/, '');
  }

  return CANONICAL_SITE_URL;
}
