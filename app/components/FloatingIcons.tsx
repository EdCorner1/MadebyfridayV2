'use client';

import { useEffect, useState } from 'react';

const PlatformIcon = ({ platform, color }: { platform: string; color: string }) => {
  const icons: Record<string, React.ReactNode> = {
    TikTok: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white">
        <path d="M12.525.02c-1.31-.02-2.61.01-3.91.09V7.74h4.91V.02zM16.67 2.5a6.5 6.5 0 0 1 3.06 1.57c.37.41.67 1.01.84 1.72.17 0.7.23 1.42.23 2.14V11h-2.25v-3.8c0-1.1-.3-2.1-.8-2.9a4.8 4.8 0 0 0-1.8-1.73zM12 11.5v12.5h2.25v-12.5H12z" />
      </svg>
    ),
    Instagram: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <circle cx="12" cy="12" r="3" />
        <circle cx="17" cy="7" r="1" />
      </svg>
    ),
    YouTube: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8 0 12 0 12s0 4 0 4c0 0 0 0 .502 1.814a3.017 3.017 0 0 0 2.122 2.136c1.872.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.017 3.017 0 0 0 2.122-2.136C24 16 24 12 24 12s0-4 0-4c0 0 0 0-.502-1.814zM9.545 15.5C8.243 15.5 7.091 14.409 7.091 12.5s-1.152-2.999-2.454-2.999c-1.303 0-2.454 1.091-2.454 2.999s1.151 3 2.454 3c1.303 0 2.454-1.091 2.454-2.999z" />
      </svg>
    ),
    Shorts: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <path d="M10 12l4 4-4 4" />
        <rect x="4" y="2" width="16" height="20" rx="3" />
      </svg>
    ),
  };

  return (
    <div className={`flex items-center justify-center rounded-full ${color} text-white shadow-lg w-10 h-10`}>
      {icons[platform] || <span className="text-xs font-bold">{platform[0]}</span>}
    </div>
  );
};

export default function FloatingIcons() {
  const [icons, setIcons] = useState<{ id: number; x: number; y: number; size: number; platform: string; color: string }[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const PLATFORMS = [
    { platform: 'TikTok', color: 'bg-black' },
    { platform: 'Instagram', color: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600' },
    { platform: 'YouTube', color: 'bg-red-600' },
    { platform: 'Shorts', color: 'bg-red-500' },
  ];

  useEffect(() => {
    const generated = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      size: Math.random() * (50 - 40) + 40,
      ...PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)],
    }));
    setIcons(generated);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {icons.map((icon) => (
        <div
          key={icon.id}
          className="absolute transition-transform duration-700 ease-out"
          style={{
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            transform: `translate(${(mousePos.x - window.innerWidth / 2) * 0.02}px, ${(mousePos.y - window.innerHeight / 2) * 0.02}px)`,
          }}
        >
          <PlatformIcon platform={icon.platform} color={icon.color} />
        </div>
      ))}
    </div>
  );
}
