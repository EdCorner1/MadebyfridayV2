import './globals.css';
import HeroForm from './components/HeroForm';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-cream flex flex-col">
      {/* Simple nav */}
      <nav className="w-full px-6 py-5 flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-coral flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="font-headline font-bold text-charcoal text-lg">Friday</span>
        </div>
        <a href="/dashboard" className="text-sm text-charcoal/60 hover:text-coral transition-colors">
          Go to app →
        </a>
      </nav>

      {/* Hero — centered, Lovable-style */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 pt-12 pb-20">
        <div className="w-full max-w-2xl text-center space-y-6">
          {/* Headline */}
          <h1 className="font-headline text-5xl md:text-6xl font-bold text-charcoal leading-tight">
            Your viral content<br />
            <span className="text-coral">co-pilot.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-charcoal/60 text-lg md:text-xl leading-relaxed max-w-lg mx-auto">
            Tell Friday what you make. She finds the hooks that work,<br className="hidden md:block" />
            then helps you rewrite the script.
          </p>

          {/* The input — the whole product */}
          <HeroForm />

          {/* Tiny trust line */}
          <p className="text-charcoal/35 text-xs">
            No signup needed · 1,000+ viral hooks · New ideas every day
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-charcoal/30 text-xs">
        © 2026 Made by Friday · Built for creators
      </footer>
    </main>
  );
}