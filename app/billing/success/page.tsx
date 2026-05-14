import Link from 'next/link';

export default function BillingSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6 text-charcoal">
      <div className="max-w-md rounded-[28px] border border-charcoal/10 bg-white p-8 text-center shadow-sm">
        <p className="text-4xl">🖤</p>
        <h1 className="mt-4 font-display text-4xl font-medium tracking-[-0.04em]">You&apos;re in.</h1>
        <p className="mt-3 text-sm leading-6 text-charcoal/55">
          Payment succeeded. Friday should now have your upgraded plan after Stripe finishes shouting at the webhook.
        </p>
        <Link href="/dashboard" className="mt-6 inline-flex rounded-full bg-charcoal px-5 py-2.5 text-sm font-medium text-white">
          Go to dashboard →
        </Link>
      </div>
    </main>
  );
}
