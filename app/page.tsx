import './globals.css';
import HeroForm from './components/HeroForm';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-cream flex flex-col">
      {/* Simple nav */}
      <nav className="w-full px-6 py-5 flex items-center justify-between max-w-3xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-coral flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="font-semibold text-charcoal text-base tracking-tight">Friday</span>
        </div>
        <a href="/dashboard" className="text-sm text-charcoal/50 hover:text-coral transition-colors">
          Go to app →
        </a>
      </nav>

      {/* Hero — centered, Lovable-style */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 pt-10 pb-24">
        <div className="w-full max-w-2xl text-center space-y-8">
          {/* Headline */}
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 800 }} className="text-5xl md:text-6xl text-charcoal leading-tight">
            Your viral content<br />
            <span style={{ color: '#FF6B35' }}>co-pilot.</span>
          </h1>

          {/* Subheadline — single line, clean */}
          <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-charcoal/55 text-lg md:text-xl leading-relaxed">
            Tell Friday what you make. She finds the hooks that work, then helps you rewrite the script.
          </p>

          {/* The input — the whole product */}
          <HeroForm />

          {/* Tiny trust line */}
          <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-charcoal/30 text-xs tracking-wide">
            No signup needed · 1,000+ viral hooks · New ideas every day
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-charcoal/20 text-xs">
        © 2026 Made by Friday
      </footer>
    </main>
  );
}