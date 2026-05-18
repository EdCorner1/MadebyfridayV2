import Image from 'next/image';
import Link from 'next/link';

const samples = [
  {
    title: 'Sample slide 01',
    href: '/tiktok-samples/sample-slide-01.png',
  },
];

export default function TikTokSamplesPage() {
  return (
    <main className="min-h-screen bg-cream px-6 py-8 text-charcoal">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-8 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-medium tracking-tight">Made by Friday</Link>
          <Link href="/dashboard" className="text-sm font-medium text-charcoal/55 hover:text-coral">Dashboard →</Link>
        </nav>

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral/70">TikTok samples</p>
          <h1 className="mt-3 font-display text-5xl font-medium tracking-[-0.04em]">Downloadable slideshow assets</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal/55">
            Open an image, then right-click/save or long-press/save on mobile.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {samples.map((sample) => (
            <article key={sample.href} className="rounded-[24px] border border-charcoal/10 bg-white p-4 shadow-sm">
              <Image src={sample.href} alt={sample.title} width={1080} height={1920} className="aspect-[9/16] w-full rounded-[18px] object-cover" />
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-sm font-medium">{sample.title}</p>
                <a href={sample.href} download className="rounded-full bg-coral px-4 py-2 text-xs font-medium text-white hover:bg-red-700">
                  Download
                </a>
              </div>
              <a href={sample.href} target="_blank" className="mt-2 inline-flex text-xs text-charcoal/45 hover:text-coral">
                Open full size →
              </a>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
