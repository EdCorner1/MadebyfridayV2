'use client';

import { useEffect, useState } from 'react';

type FloatingPlatform = {
  id: number;
  x: number;
  y: number;
  platform: string;
  src: string;
  size: number;
};

const PLATFORMS = [
  {
    platform: 'TikTok',
    src: 'https://cdn.simpleicons.org/tiktok/000000',
  },
  {
    platform: 'Instagram',
    src: 'https://cdn.simpleicons.org/instagram/E4405F',
  },
  {
    platform: 'YouTube',
    src: 'https://cdn.simpleicons.org/youtube/FF0000',
  },
  {
    platform: 'YouTube Shorts',
    src: 'https://cdn.simpleicons.org/youtubeshorts/FF0000',
  },
];

export default function FloatingIcons() {
  const [icons, setIcons] = useState<FloatingPlatform[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Real platform logos, fewer of them, kept away from the central hero column.
    const generated = Array.from({ length: 8 }).map((_, i) => {
      const side = i < 4 ? 'left' : 'right';
      const x = side === 'left'
        ? Math.random() * 22 + 4          // 4–26% left outer lane
        : Math.random() * 22 + 74;        // 74–96% right outer lane
      const y = Math.random() * 78 + 8;   // 8–86% vertical spread
      const platform = PLATFORMS[i % PLATFORMS.length];

      return {
        id: i,
        x,
        y,
        size: Math.random() * 8 + 26,
        ...platform,
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
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden hidden sm:block">
      {icons.map((icon) => (
        <div
          key={icon.id}
          className="absolute transition-transform duration-700 ease-out opacity-80"
          style={{
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            transform: `translate(${(mousePos.x - window.innerWidth / 2) * 0.012}px, ${(mousePos.y - window.innerHeight / 2) * 0.012}px)`,
          }}
        >
          <img
            src={icon.src}
            alt={icon.platform}
            width={icon.size}
            height={icon.size}
            className="select-none"
            style={{
              width: icon.size,
              height: icon.size,
              filter: 'drop-shadow(0 10px 12px rgba(17, 17, 17, 0.16))',
            }}
          />
        </div>
      ))}
    </div>
  );
}
