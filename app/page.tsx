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
          <span style={{ fontFamily: "'Bricolage Grotesque', Georgia, serif" }} className="font-medium text-charcoal text-base tracking-tight">Friday</span>
        </div>
        <a href="/dashboard" style={{ fontFamily: "'Inter', sans-serif" }} className="text-sm text-charcoal/70 hover:text-coral transition-colors">
          Go to app →
        </a>
      </nav>

      {/* Hero — centered, Lovable-style */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 pt-10 pb-24">
        <div className="w-full max-w-2xl text-center space-y-8">
          {/* Headline */}
          <h1 style={{ fontFamily: "'Bricolage Grotesque', Georgia, serif", fontWeight: 600 }} className="text-5xl md:text-6xl text-charcoal leading-tight">
            Find your next<br />
            <span style={{ color: '#FF6B35' }}>viral hook.</span>
          </h1>

          {/* Subheadline */}
          <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-charcoal/55 text-lg md:text-xl leading-relaxed max-w-lg mx-auto">
            Tell Friday what content you make. She pulls 6 real viral hooks from a database of 1,000+ proven winners — then helps you rewrite the script.
          </p>

          {/* The input — the whole product */}
          <HeroForm />

          {/* Tiny trust line */}
          <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-charcoal/30 text-xs tracking-wide">
            No signup needed · 1,000+ viral hooks · New ideas daily
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ fontFamily: "'Inter', sans-serif" }} className="px-6 py-4 text-center text-charcoal/20 text-xs">
        © 2026 Made by Friday
      </footer>
    </main>
  );
}