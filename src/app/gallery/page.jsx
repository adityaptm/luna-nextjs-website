"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState(null); // index of open image
  
  const defaultPhotos = [
    { src: "/images/lana1.webp", alt: "Lana 1", caption: "Lana Aesthetic" },
    { src: "/images/lana2.webp", alt: "Lana 2", caption: "Lana Casual" },
    { src: "/images/lana3.webp", alt: "Lana 3", caption: "Lana Close-up" },
    { src: "/images/luna.jpg", alt: "Luna 1", caption: "" },
    { src: "/images/luna2.jpg", alt: "Luna 2", caption: "" },
    { src: "/images/luna3.jpg", alt: "Luna 3", caption: "" },
    { src: "/images/luna4.jpg", alt: "Luna 4", caption: "" },
    { src: "/images/luna5.jpg", alt: "Luna 5", caption: "" },
    { src: "/images/luna6.jpg", alt: "Luna 6", caption: "" },
    { src: "/images/luna7.jpg", alt: "Luna 7", caption: "" },
    { src: "/images/luna8.jpg", alt: "Luna 8", caption: "" },
    { src: "/images/luna9.jpg", alt: "Luna 9", caption: "" },
    { src: "/images/luna10.jpg", alt: "Luna 10", caption: "" },
    { src: "/images/luna11.jpg", alt: "Luna 11", caption: "" },
    { src: "/images/luna12.jpg", alt: "Luna 12", caption: "" },
    { src: "/images/luna13.jpg", alt: "Luna 13", caption: "" },
    { src: "/images/luna14.jpg", alt: "Luna 14", caption: "" },
    { src: "/images/luna15.jpg", alt: "Luna 15", caption: "" },
    { src: "/images/luna16.jpg", alt: "Luna 16", caption: "" },
    { src: "/images/luna17.jpg", alt: "Luna 17", caption: "" },
    { src: "/images/luna18.jpg", alt: "Luna 18", caption: "" },
    { src: "/images/luna19.jpg", alt: "Luna 19", caption: "" },
    { src: "/images/luna20.jpg", alt: "Luna 20", caption: "" },
    { src: "/images/luna21.jpg", alt: "Luna 21", caption: "" },
    { src: "/images/luna22.jpg", alt: "Luna 22", caption: "" },
    { src: "/images/luna23.jpg", alt: "Luna 23", caption: "" },
    { src: "/images/luna24.jpg", alt: "Luna 24", caption: "" },
    { src: "/images/luna25.jpg", alt: "Luna 25", caption: "" },
    { src: "/images/luna26.jpg", alt: "Luna 26", caption: "" },
    { src: "/images/luna27.jpg", alt: "Luna 27", caption: "" },
    { src: "/images/luna28.jpg", alt: "Luna 28", caption: "" },
    { src: "/images/luna29.jpg", alt: "Luna 29", caption: "" },
    { src: "/images/luna30.jpg", alt: "Luna 30", caption: "" },
    { src: "/images/luna31.jpg", alt: "Luna 31", caption: "" },
  ];

  const [photos, setPhotos] = useState(defaultPhotos);

  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await fetch("/api/gallery");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setPhotos(json.data);
        }
      } catch {}
    }
    loadGallery();
  }, []);

  const reversed = [...photos].reverse();

  const prev = useCallback(() => {
    setLightbox((i) => (i <= 0 ? reversed.length - 1 : i - 1));
  }, [reversed.length]);

  const next = useCallback(() => {
    setLightbox((i) => (i >= reversed.length - 1 ? 0 : i + 1));
  }, [reversed.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, prev, next]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  const currentPhoto = lightbox !== null ? reversed[lightbox] : null;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2">
          Gallery Aurhel Alana Tirta
        </h1>
        <p className="text-slate-500 dark:text-slate-300 text-lg mb-6 font-medium">
          {reversed.length} foto · Klik untuk melihat lebih besar & caption lengkap
        </p>
        <Link
          href="/about-lana"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-body text-[0.9rem] font-semibold transition-all border-2 border-accent text-accent hover:bg-accent/10 hover:-translate-y-0.5"
        >
          <i className="bx bx-left-arrow-alt text-lg"></i> Kembali ke About Lana
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-20">
        {reversed.map((p, i) => {
          const captionText = p.caption || p.alt;
          return (
            <button
              key={i}
              onClick={() => setLightbox(i)}
              className="block w-full rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-accent group relative text-left bg-white dark:bg-slate-900"
            >
              <div className="aspect-square w-full overflow-hidden relative bg-slate-950">
                <img
                  src={p.src}
                  alt={p.alt || "Lana"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/80 text-slate-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-lg">
                    <i className="bx bx-zoom-in text-xl"></i>
                  </div>
                </div>
              </div>

              {captionText && (
                <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {captionText}
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightbox !== null && currentPhoto && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-between p-4"
          onClick={() => setLightbox(null)}
        >
          {/* Top Bar */}
          <div className="w-full max-w-5xl flex items-center justify-between z-10 pt-2">
            <div className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full border border-white/10">
              {lightbox + 1} / {reversed.length}
            </div>

            {/* Close Button */}
            <button
              className="w-11 h-11 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white text-2xl transition-all"
              onClick={() => setLightbox(null)}
            >
              <i className="bx bx-x"></i>
            </button>
          </div>

          {/* Prev Button */}
          <button
            className="fixed left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white text-2xl transition-all z-10"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
          >
            <i className="bx bx-chevron-left"></i>
          </button>

          {/* Image & Caption Center Container */}
          <div
            className="flex-1 flex flex-col items-center justify-center max-h-[75vh] my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentPhoto.src}
              alt={currentPhoto.alt || "Lana"}
              className="max-w-[90vw] max-h-[70vh] object-contain rounded-2xl shadow-2xl"
            />

            {(currentPhoto.caption || currentPhoto.alt) && (
              <div className="mt-4 px-6 py-2.5 bg-black/70 backdrop-blur-md border border-white/15 text-white rounded-full text-sm font-bold shadow-xl max-w-lg text-center">
                {currentPhoto.caption || currentPhoto.alt}
              </div>
            )}
          </div>

          {/* Next Button */}
          <button
            className="fixed right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white text-2xl transition-all z-10"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
          >
            <i className="bx bx-chevron-right"></i>
          </button>

          {/* Thumbnails strip */}
          <div className="w-full max-w-3xl flex justify-center gap-1.5 px-4 pb-2 overflow-x-auto z-10">
            {reversed.map((p, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox(i);
                }}
                className={`w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  i === lightbox
                    ? "border-accent scale-110 shadow-lg"
                    : "border-transparent opacity-40 hover:opacity-80"
                }`}
              >
                <img src={p.src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
