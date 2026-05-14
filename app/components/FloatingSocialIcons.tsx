function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="M16.6 5.1c-1-.7-1.7-1.8-1.9-3.1h-3.1v13.1a2.8 2.8 0 1 1-2.1-2.7V9.2A6 6 0 1 0 14.7 15V8.4c1.2.9 2.7 1.4 4.3 1.4V6.7c-.9 0-1.7-.2-2.4-.6Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.2" />
      <path d="M17.5 6.8h.01" strokeLinecap="round" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
      <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5a3 3 0 0 0-2.1 2.1A31 31 0 0 0 2 12a31 31 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22 12a31 31 0 0 0-.4-4.8ZM10 15.4V8.6l5.8 3.4L10 15.4Z" />
    </svg>
  );
}

function ShortsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="M15.7 3.2 8.2 7.4a3.1 3.1 0 0 0 0 5.4l.7.4-1.4.8a3.1 3.1 0 0 0 3 5.4l7.4-4.2a3.1 3.1 0 0 0 0-5.4l-.7-.4 1.4-.8a3.1 3.1 0 1 0-3-5.4ZM10.4 9.7l4.3 2.3-4.3 2.3V9.7Z" />
    </svg>
  );
}

const ICONS = [
  { label: 'TikTok', icon: <TikTokIcon />, className: 'left-[max(2rem,5vw)] top-[18%]', delay: '0s' },
  { label: 'Instagram', icon: <InstagramIcon />, className: 'left-[max(4rem,9vw)] top-[45%]', delay: '1.1s' },
  { label: 'YouTube', icon: <YouTubeIcon />, className: 'left-[max(2rem,5vw)] bottom-[18%]', delay: '2.2s' },
  { label: 'YouTube Shorts', icon: <ShortsIcon />, className: 'right-[max(2rem,5vw)] top-[21%]', delay: '0.7s' },
  { label: 'TikTok', icon: <TikTokIcon />, className: 'right-[max(4rem,9vw)] top-[50%]', delay: '1.8s' },
  { label: 'Instagram', icon: <InstagramIcon />, className: 'right-[max(2rem,5vw)] bottom-[16%]', delay: '2.7s' },
];

export default function FloatingSocialIcons() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden overflow-hidden xl:block">
      {ICONS.map((icon, index) => (
        <div
          key={`${icon.label}-${index}`}
          className={`floating-social-icon absolute ${icon.className}`}
          style={{ animationDelay: icon.delay }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-charcoal/10 bg-white/72 text-coral/75 shadow-[0_18px_50px_rgba(17,17,17,0.08)] backdrop-blur-sm">
            {icon.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
