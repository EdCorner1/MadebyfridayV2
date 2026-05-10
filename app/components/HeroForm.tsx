'use client';

export default function HeroForm() {
  return (
    <form
      action="/dashboard"
      className="w-full mt-4"
      onSubmit={(e) => {
        const input = e.currentTarget.querySelector('input[name="q"]') as HTMLInputElement;
        if (!input.value.trim()) {
          e.preventDefault();
          input.focus();
        }
      }}
    >
      <div className="relative">
        <input
          type="text"
          name="q"
          placeholder="I make fitness content for 25-35 year olds..."
          autoFocus
          className="w-full px-6 py-4 pr-32 text-charcoal bg-white border-2 border-charcoal/10 rounded-2xl text-base md:text-lg placeholder-charcoal/30 outline-none focus:border-coral transition-colors shadow-sm"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-coral text-white rounded-xl font-medium text-sm hover:bg-coral/90 transition-colors"
        >
          Go →
        </button>
      </div>
    </form>
  );
}