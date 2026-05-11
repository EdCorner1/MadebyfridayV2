'use client';

import { useEffect, useState } from 'react';

const PlatformIcon = ({ platform, color }: { platform: string; color: string }) => {
  const icons: Record<string, React.ReactNode> = {
    TikTok: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 6.67 20a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.78a8.26 8.26 0 0 0 4.83 1.45V6.07a4.85 4.85 0 0 1-1-.38z" />
      </svg>
    ),
    Instagram: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.069 4.054C.012 5.334 0 5.741 0 8c0 3.259.014 3.668.072 4.948.2 1.364.967 2.956 2.984 3.993a6.79 6.79 0 0 0 2.948 1.09A6.81 6.81 0 0 0 8 24c3.259 0 3.668-.014 4.948-.072 1.364-.2 2.956-.967 3.993-2.988a6.82 6.82 0 0 0 1.09-2.948C24 11.668 23.986 8.259 24 8c0-3.259-.014-3.666-.072-4.948C23.8 1.688 22.033.272 18.947.072 17.666.014 17.259 0 14 0zm0 5.438a6.56 6.56 0 1 0 0 13.123 6.56 6.56 0 0 0 0-13.123zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
    YouTube: (
      <svg width="20" height="14" viewBox="0 0 24 16" fill="currentColor">
        <path d="M23.495 2.205a3.03 3.03 0 0 0-2.13-2.147C19.505.191 12 0 12 0S4.495.191 2.635.058a3.03 3.03 0 0 0-2.13 2.147C.19 4.345 0 8 0 8s.19 3.655.505 5.795a3.03 3.03 0 0 0 2.13 2.147c1.86.133 9.365.191 9.365.191s7.51-.191 9.365-.358a3.03 3.03 0 0 0 2.13-2.147c.315-2.14.505-4.795.505-4.795s-.19-3.655-.505-5.795zM9.602 11.15V4.85l6.397 3.15-6.397 3.15z" />
      </svg>
    ),
    Shorts: (
      <svg width="16" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.453 2.583a2.58 2.58 0 0 0-1.447-1.448C19.86.654 12 0 12 0S4.14.654 2.01 1.135A2.58 2.58 0 0 0 .562 2.583.83.83 0 0 0 0 3.498C.191 5.72.765 8.666 2.01 11.04c1.245 2.375 3.63 3.885 6.555 4.17 2.205.215 9.435.215 9.435.215s7.23 0 9.435-.215c2.925-.285 5.31-1.795 6.555-4.17 1.245-2.374 1.819-5.32 2.01-7.542a.83.83 0 0 0-.562-.915zM9.749 15.623l5.857-3.374-5.857-3.374v6.748z" />
      </svg>
    ),
  };

  return (
    <div className={`flex items-center justify-center rounded-xl ${color} text-white shadow-lg px-2 py-2`}>
      {icons[platform] || <span className="text-xs font-bold">{platform[0]}</span>}
    </div>
  );
};

export default function FloatingIcons() {
  const [icons, setIcons] = useState<{ id: number; x: number; y: number; size: number; platform: string; color: string }[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const PLATFORMS = [
    { platform: 'TikTok', color: 'bg-black' },
    { platform: 'Instagram', color: 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600' },
    { platform: 'YouTube', color: 'bg-[#FF0000]' },
    { platform: 'Shorts', color: 'bg-[#FF0033]' },
  ];

  useEffect(() => {
    const generated = Array.from({ length: 14 }).map((_, i) => {
      const side = i < 7 ? 'left' : 'right';
      const x = side === 'left'
        ? Math.random() * 28 + 2
        : Math.random() * 28 + 70;
      const y = Math.random() * 85 + 5;
      return {
        id: i,
        x,
        y,
        size: Math.random() * (45 - 30) + 30,
        ...PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)],
      };
    });
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
            transform: `translate(${(mousePos.x - window.innerWidth / 2) * 0.015}px, ${(mousePos.y - window.innerHeight / 2) * 0.015}px)`,
          }}
        >
          <PlatformIcon platform={icon.platform} color={icon.color} />
        </div>
      ))}
    </div>
  );
}
