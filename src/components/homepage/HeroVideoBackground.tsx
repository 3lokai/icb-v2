"use client";

import { useEffect, useRef, useState } from "react";

export function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  // Lazy load video after FCP using intersection observer
  useEffect(() => {
    // Load video after a short delay to allow FCP to complete
    const timer = setTimeout(() => {
      setShouldLoadVideo(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Ensure video plays once loaded (works on all viewport sizes)
  useEffect(() => {
    if (!shouldLoadVideo) return;

    const video = videoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.warn("Video autoplay prevented:", error);
      }
    };

    const tryPlay = () => {
      // readyState 2 = HAVE_CURRENT_DATA, 3 = HAVE_FUTURE_DATA, 4 = HAVE_ENOUGH_DATA
      if (video.readyState >= 2) playVideo();
    };

    video.addEventListener("canplay", tryPlay);
    video.addEventListener("canplaythrough", playVideo);
    tryPlay(); // if already loaded (e.g. cached or fast network)

    return () => {
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("canplaythrough", playVideo);
    };
  }, [shouldLoadVideo]);

  return (
    <div className="absolute inset-0 z-0">
      {shouldLoadVideo ? (
        <video
          autoPlay
          className="absolute inset-0 h-full w-full object-cover"
          loop
          muted
          playsInline
          preload="auto"
          ref={videoRef}
          src="/videos/hero-video.mp4"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23000;stop-opacity:0.6'/%3E%3Cstop offset='50%25' style='stop-color:%23000;stop-opacity:0.5'/%3E%3Cstop offset='100%25' style='stop-color:%23000;stop-opacity:0.7'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='%231a1a1a'/%3E%3Crect width='100%25' height='100%25' fill='url(%23grad)'/%3E%3C/svg%3E"
        />
      ) : (
        <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      )}
    </div>
  );
}
