"use client";

import { useState, useEffect } from "react";

function SetlistFlipCard({ item }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group perspective-1000 w-full select-none cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-[410px] rounded-3xl transition-transform duration-700 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* ================= FRONT SIDE ================= */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-[#18181b] border-2 border-amber-500/40 hover:border-amber-400 rounded-3xl p-4 shadow-2xl flex flex-col justify-between transition-all duration-300 group-hover:-translate-y-1">
          {/* Top Tape Sticker */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-slate-200/80 dark:bg-slate-300/80 backdrop-blur-sm border border-black/20 rotate-[-1deg] shadow-md z-20 rounded-sm"></div>

          {/* Setlist Poster Image */}
          <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden bg-black/80 border border-white/10 mt-1 shadow-inner relative group-hover:scale-[1.02] transition-transform">
            <img
              src={item.image || "/images/setlists/passion200.svg"}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/images/lana1.webp";
              }}
            />
          </div>

          {/* Title & Period */}
          <div className="text-center my-auto py-2">
            <h3 className="font-black text-white text-lg sm:text-xl font-display tracking-tight leading-snug">
              {item.title}
            </h3>
            <p className="text-slate-400 text-xs italic mt-1 font-medium">
              {item.period || "Present"}
            </p>
          </div>

          {/* Badge & Flip Hint */}
          <div className="text-center mt-auto pb-1">
            <span className="inline-block px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold shadow-inner">
              {item.badge || `${item.shows || 0} Show`}
            </span>
            <p className="text-[0.7rem] text-amber-400 font-bold mt-2 flex items-center justify-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
              <i className="bx bx-rotate-right text-base animate-spin-slow"></i>
              <span>Klik kartu untuk unit songs</span>
            </p>
          </div>
        </div>

        {/* ================= BACK SIDE (ROTATED 180 DEG) ================= */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-b from-[#1c1917] to-[#0c0a09] border-2 border-pink-500/60 rounded-3xl p-5 shadow-2xl flex flex-col justify-between">
          {/* Top Tape Sticker */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-pink-200/85 backdrop-blur-sm border border-black/20 rotate-[1deg] shadow-md z-20 rounded-sm"></div>

          <div>
            <div className="text-center pt-2 pb-3 border-b border-slate-800">
              <span className="text-[0.68rem] uppercase font-black text-pink-400 tracking-widest block">
                UNIT SONGS DIBAWAKAN
              </span>
              <h4 className="font-black text-white text-base font-display mt-0.5 truncate">
                {item.title}
              </h4>
            </div>

            {/* Songs List */}
            <div className="py-3 space-y-2 max-h-[235px] overflow-y-auto pr-1">
              {Array.isArray(item.songs) && item.songs.length > 0 ? (
                item.songs.map((song, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 font-semibold shadow-sm"
                  >
                    <span className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-400 font-black text-[0.7rem] flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{song}</span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-500 text-xs italic">
                  Belum ada unit songs tercatat
                </div>
              )}
            </div>
          </div>

          <div className="text-center pt-2 border-t border-slate-800/80">
            <span className="text-[0.72rem] text-slate-400 flex items-center justify-center gap-1.5 font-bold hover:text-pink-300 transition-colors">
              <i className="bx bx-refresh text-base"></i> Klik untuk membalik kartu
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SetlistShowSection({ defaultStats, defaultItems }) {
  const [stats, setStats] = useState(
    defaultStats || { totalShows: 103, totalSetlists: 7, totalUnitSongs: 15 }
  );
  const [items, setItems] = useState(defaultItems || []);
  const [loading, setLoading] = useState(!defaultItems);

  useEffect(() => {
    async function loadSetlists() {
      try {
        const res = await fetch("/api/setlists");
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.stats) setStats(json.data.stats);
          if (Array.isArray(json.data.items)) {
            setItems(json.data.items.filter((i) => i.active !== false));
          }
        }
      } catch (err) {
        console.error("Failed to load setlists:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSetlists();
  }, []);

  return (
    <div className="w-full space-y-10">
      {/* ================= TOP STATS BOX (MATCHING SCREENSHOT) ================= */}
      <div className="max-w-xl mx-auto bg-[#1c1917]/95 border-2 border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Subtle glow on top edge */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
        <div className="w-3 h-3 rounded-full bg-slate-800 mx-auto -mt-3 mb-4 shadow-inner border border-slate-700"></div>

        <div className="grid grid-cols-3 gap-4 text-center items-center">
          {/* 1. Total Shows */}
          <div className="flex flex-col items-center">
            <div className="text-slate-400 text-2xl md:text-3xl mb-1.5">
              <i className="bx bx-calendar"></i>
            </div>
            <div className="text-3xl md:text-4xl font-black text-white tracking-tight font-display">
              {stats.totalShows || 103}
            </div>
            <div className="text-[0.68rem] md:text-xs font-black text-slate-400 uppercase tracking-wider mt-1">
              TOTAL SHOW
            </div>
          </div>

          {/* 2. Setlists */}
          <div className="flex flex-col items-center border-x border-slate-800/80 px-2">
            <div className="text-slate-400 text-2xl md:text-3xl mb-1.5">
              <i className="bx bx-music"></i>
            </div>
            <div className="text-3xl md:text-4xl font-black text-white tracking-tight font-display">
              {stats.totalSetlists || 7}
            </div>
            <div className="text-[0.68rem] md:text-xs font-black text-slate-400 uppercase tracking-wider mt-1">
              SETLISTS
            </div>
          </div>

          {/* 3. Unit Songs */}
          <div className="flex flex-col items-center">
            <div className="text-slate-400 text-2xl md:text-3xl mb-1.5">
              <i className="bx bx-microphone"></i>
            </div>
            <div className="text-3xl md:text-4xl font-black text-white tracking-tight font-display">
              {stats.totalUnitSongs || 15}
            </div>
            <div className="text-[0.68rem] md:text-xs font-black text-slate-400 uppercase tracking-wider mt-1">
              UNIT SONGS
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3D FLIP SETLIST CARDS GRID ================= */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-amber-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Memuat setlists theater...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <SetlistFlipCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
