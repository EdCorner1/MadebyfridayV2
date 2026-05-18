import Image from 'next/image';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6 text-center text-charcoal">
      <section className="w-full max-w-md rounded-[28px] border border-charcoal/10 bg-white p-8 shadow-[0_24px_80px_rgba(17,17,17,0.08)]">
        <Image src="/logo_app_icon.svg" alt="Friday" width={64} height={64} className="mx-auto mb-5 rounded-2xl" />
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral/70">Offline</p>
        <h1 className="mt-3 font-display text-4xl font-medium tracking-[-0.035em]">Friday needs the internet.</h1>
        <p className="mt-4 text-sm leading-6 text-charcoal/55">
          Your workspace is safe, but hooks and rewrites need a connection. Reconnect and jump back in.
        </p>
        <Link href="/dashboard" className="mt-6 inline-flex rounded-full bg-coral px-5 py-3 text-sm font-medium text-white hover:bg-red-700">
          Try again
        </Link>
      </section>
    </main>
  );
}
