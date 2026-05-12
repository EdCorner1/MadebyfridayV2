'use client';

import { useState, useEffect } from 'react';

interface VideoPreviewProps {
  url: string;
  onPlay: () => void;
}

/**
 * Custom video preview — thumbnail + play button.
 * No "View Profile" button. No third-party embed iframe.
 * Clicking fires onPlay so the parent controls the lightbox.
 */
export default function VideoPreview({ url, onPlay }: VideoPreviewProps) {
  const isYouTube = /youtube\.com|youtu\.be/.test(url);
  const isInstagram = /instagram\.com/.test(url);
  const isTikTok = /tiktok\.com/.test(url);

  // ── YouTube ───────────────────────────────────────────────────────────────
  if (isYouTube) {
    const ytId = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    )?.[1];

    return (
      <div
        className="relative w-full overflow-hidden rounded-[10px] border border-[#ece7df] bg-[#111] cursor-pointer"
        onClick={onPlay}
        style={{ paddingTop: '100%' }}
      >
        {ytId ? (
          <img
            src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
            alt="YouTube thumbnail"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#222]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#cc0000">
              <path d="M23.495 6.205a3 3 0 0 0-2.105-2.112C19.365 3.545 12 3.545 12 3.545s-7.365 0-9.39.548A3 3 0 0 0 .502 6.205 31.76 31.76 0 0 0 0 12c0 1.92.548 3.793 1.548 5.795a3 3 0 0 0 2.112 2.112c2.025.548 9.39.548 9.39.548s7.365 0 9.39-.548a3 3 0 0 0 2.105-2.112A31.76 31.76 0 0 0 24 12c0-1.92-.548-3.793-1.548-5.795zM9.609 15.601V8.399l6.264 3.602L9.609 15.601z"/>
            </svg>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#333">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // ── TikTok ────────────────────────────────────────────────────────────────
  if (isTikTok) {
    return (
      <div
        className="relative w-full overflow-hidden rounded-[10px] border border-[#ece7df] bg-[#111] cursor-pointer"
        onClick={onPlay}
        style={{ paddingTop: '130%' }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.77 1.52V6.04a4.85 4.85 0 0 1-1-.35z"/>
          </svg>
          <span className="text-white/40 text-[10px] font-semibold tracking-wider uppercase">TikTok</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#333">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // ── Instagram ─────────────────────────────────────────────────────────────
  if (isInstagram) {
    return (
      <InstagramPreview url={url} onPlay={onPlay} />
    );
  }

  // ── Generic fallback ──────────────────────────────────────────────────────
  return (
    <div
      className="relative w-full overflow-hidden rounded-[10px] border border-[#ece7df] bg-[#f0f0f0] cursor-pointer"
      onClick={onPlay}
      style={{ paddingTop: '100%' }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#bbb">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
        </svg>
        <span className="text-[10px] text-[#ccc]">Play</span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/5">
        <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#333">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

function InstagramPreview({ url, onPlay }: { url: string; onPlay: () => void }) {
  const [thumb, setThumb] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const postId = url.match(/instagram\.com\/(?:p|reel|tv)\/([^\/\?]+)/)?.[1];
    if (!postId) return;

    // Try via our API route to avoid CORS
    fetch(`/api/preview?url=${encodeURIComponent(url)}`)
      .then(r => r.json())
      .then(data => {
        if (!cancelled && data.thumbnail_url) setThumb(data.thumbnail_url);
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [url]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-[10px] border border-[#ece7df] bg-[#fafaf8] cursor-pointer"
      onClick={onPlay}
      style={{ paddingTop: '100%' }}
    >
      {thumb ? (
        <img
          src={thumb}
          alt="Instagram preview"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#E4405F" className="opacity-35">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
          </svg>
          <span className="text-[10px] text-[#ccc]">Instagram</span>
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#333">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
