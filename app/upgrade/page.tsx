import Link from 'next/link';
import PricingSection from '../components/PricingSection';

export default function UpgradePage() {
  return (
    <main className="min-h-screen bg-cream text-charcoal">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <Link href="/dashboard" className="text-sm font-medium text-charcoal/55 hover:text-coral">
          ← Back to dashboard
        </Link>
        <Link href="/" className="font-display text-lg font-medium tracking-tight">
          Friday
        </Link>
      </nav>
      <div className="pt-10">
        <PricingSection />
      </div>
    </main>
  );
}
