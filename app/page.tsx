import './globals.css';
import HeroForm from './components/HeroForm';
import FloatingIcons from './components/FloatingIcons';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-cream flex flex-col relative">
      <FloatingIcons />
      {/* Simple nav */}
      <nav className="w-full px-6 py-5 flex items-center justify-between max-w-3xl mx-auto relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm bg-white">
            <img src="/logo_app_icon.svg" alt="Friday" className="w-full h-full object-cover" />
          </div>
          <span style={{ fontFamily: "'Bricolage Grotesque', Georgia, serif" }} className="font-medium text-charcoal text-lg tracking-tight">Friday</span>
        </div>
        <a href="/dashboard" style={{ fontFamily: "'Inter', sans-serif" }} className="text-sm text-charcoal hover:text-red-600 transition-colors font-medium">
          Go to app →
        </a>
      </nav>

      {/* Hero — centered, Lovable-style */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 pt-10 pb-24 relative z-10">
        <div className="w-full max-w-2xl text-center space-y-8">
          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                </div>
              ))}
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-charcoal/40 bg-white/50 backdrop-blur-sm px-2 py-0.5 rounded-full border border-charcoal/5">
              Live data from 10,000 viral videos
            </span>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: "'Bricolage Grotesque', Georgia, serif", fontWeight: 400 }} className="text-4xl sm:text-5xl md:text-7xl text-charcoal leading-tight">
            Find your next<br />
            <span style={{ color: '#DC2626', fontFamily: "'Dancing Script', cursive", fontWeight: 700 }}>viral hook.</span>
          </h1>

          {/* Subheadline */}
          <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-charcoal/55 text-lg md:text-xl leading-relaxed max-w-lg mx-auto">
            Describe the content you make, Friday pulls data from 10,000 viral videos with live links and rewrites it in your style
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
      <footer style={{ fontFamily: "'Inter', sans-serif" }} className="px-6 py-4 text-center text-charcoal/20 text-xs relative z-10">
        © 2026 Made by Friday
      </footer>
    </main>
  );
}