import Image from 'next/image';
import Link from 'next/link';
import './globals.css';
import HeroForm from './components/HeroForm';
import FloatingSocialIcons from './components/FloatingSocialIcons';

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-cream text-charcoal">
      <FloatingSocialIcons />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6">
        <nav className="flex items-center justify-between py-6">
          <Link href="/" className="flex items-center gap-3" aria-label="Made by Friday home">
            <Image
              src="/logo_app_icon.svg"
              alt=""
              width={36}
              height={36}
              className="rounded-xl shadow-sm"
              priority
            />
            <span className="font-display text-lg font-medium tracking-tight">Friday</span>
          </Link>

          <Link href="/dashboard" className="text-sm font-medium text-charcoal/60 transition hover:text-coral">
            Go to app →
          </Link>
        </nav>

        <section className="flex flex-1 flex-col items-center justify-center pb-20 pt-10 text-center">
          <p className="mb-5 rounded-full border border-charcoal/10 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal/45">
            Trained on 10,000 viral videos
          </p>

          <h1 className="font-display text-5xl font-medium leading-[0.98] tracking-[-0.04em] text-charcoal sm:text-6xl md:text-7xl">
            Find your next
            <br />
            <span className="text-coral">viral hook.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-charcoal/55 sm:text-lg">
            Tell Friday what you make. Get relevant viral references and rewrite them for your audience.
          </p>

          <div className="mt-8 w-full max-w-2xl">
            <HeroForm />
          </div>

          <p className="mt-4 text-xs text-charcoal/35">
            Search first. Sign in when you’re ready to rewrite.
          </p>
        </section>
      </div>
    </main>
  );
}
