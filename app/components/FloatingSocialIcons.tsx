const ICONS = [
  { label: 'TikTok', mark: '♬', className: 'left-[7%] top-[18%]', delay: '0s' },
  { label: 'Instagram', mark: '◎', className: 'left-[13%] top-[45%]', delay: '1.1s' },
  { label: 'YouTube', mark: '▶', className: 'left-[6%] bottom-[18%]', delay: '2.2s' },
  { label: 'Shorts', mark: '▻', className: 'right-[8%] top-[21%]', delay: '0.7s' },
  { label: 'TikTok', mark: '♬', className: 'right-[14%] top-[50%]', delay: '1.8s' },
  { label: 'Instagram', mark: '◎', className: 'right-[7%] bottom-[16%]', delay: '2.7s' },
];

export default function FloatingSocialIcons() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block">
      {ICONS.map((icon, index) => (
        <div
          key={`${icon.label}-${index}`}
          className={`floating-social-icon absolute ${icon.className}`}
          style={{ animationDelay: icon.delay }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-charcoal/10 bg-white/72 shadow-[0_18px_50px_rgba(17,17,17,0.08)] backdrop-blur-sm">
            <span className="text-xl font-semibold text-coral/75">{icon.mark}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
