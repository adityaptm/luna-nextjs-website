"use client";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import LiveStatus from "@/components/LiveStatus";
import SetlistShowSection from "@/components/SetlistShowSection";

const defaultRekap = {
  totalShows: 52,
  totalSetlists: 5,
  totalUnitSongs: 10,
  setlists: [
    { name: "Aitakatta (Ingin Bertemu)", period: "01 Mar 2024 - Sekarang", shows: 24, unitSongs: ["Nageki no Figure", "Namida no Shounan", "Nagisa no Cherry", "Koi no Plan", "Senaka Kara Dakishimete"] },
    { name: "Pajama Drive", period: "30 Mei 2024 - Sekarang", shows: 18, unitSongs: ["Pajama Drive", "Kagami no Naka no Jean Da Arc"] },
    { name: "Ramune no Nomikata (Cara Meminum Ramune)", period: "2024 - Sekarang", shows: 4, unitSongs: ["Manazashi Sayonara", "Nice to Meet You"] },
    { name: "Te wo Tsunaginagara (Sambil Menggandeng Erat Tanganku)", period: "2024 - Sekarang", shows: 3, unitSongs: ["Kono Mune no Barcode"] },
    { name: "Renai Kinshi Jourei (Aturan Anti Cinta)", period: "2025 - Sekarang", shows: 3, unitSongs: ["Manatsu no Christmas Rose"] },
  ]
};

export default function AboutLana() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // profile, funfacts, favorites, rekap

  const [liveData, setLiveData] = useState(null);
  const [liveLoading, setLiveLoading] = useState(true);
  const [funfactsList, setFunfactsList] = useState([]);
  const [profileData, setProfileData] = useState({
    socials: {
      x: "https://x.com/AR_LanaJKT48",
      xHandle: "@AR_LanaJKT48",
      instagram: "https://www.instagram.com/jkt48.lana.a/",
      instagramHandle: "@jkt48.lana.a",
      tiktok: "https://www.tiktok.com/@jkt48.lana",
      tiktokHandle: "@jkt48.lana",
      threads: "https://www.threads.net/@jkt48.lana.a",
      threadsHandle: "@jkt48.lana.a",
      showroom: "https://www.showroom-live.com/r/JKT48_Lana",
      idn: "https://www.idn.app/jkt48_lana",
    },
    latestUpdates: {
      instagramEmbed: "https://www.instagram.com/p/DXt_VxAE4Oj/embed",
      threadsEmbed: "https://www.threads.net/@jkt48.lana.a/post/DW3WfvFGtbe/embed",
      tweetText: "Halo semuanya! Selamat malam! Jangan lupa istirahat yaa, besok semangat lagi! 🌙✨",
      tweetUrl: "https://x.com/AR_LanaJKT48",
      tiktokVideoUrl: "https://www.tiktok.com/@jkt48.lana",
    },
    rekapShow: defaultRekap,
  });

  const loadLiveStatus = async () => {
    setLiveLoading(true);
    try {
      const res = await fetch("/api/lana-live");
      const json = await res.json();
      if (json.success) {
        setLiveData(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch live status:", err);
    } finally {
      setLiveLoading(false);
    }
  };

  const loadProfile = async () => {
    try {
      const [profRes, setRes] = await Promise.allSettled([
        fetch("/api/profile").then((r) => r.json()),
        fetch("/api/setlists").then((r) => r.json()),
      ]);
      let combined = {};
      if (profRes.status === "fulfilled" && profRes.value.success && profRes.value.data) {
        combined = { ...profRes.value.data };
      }
      if (setRes.status === "fulfilled" && setRes.value.success && setRes.value.data) {
        const { stats, items } = setRes.value.data;
        combined.rekapShow = {
          totalShows: stats?.totalShows || 103,
          totalSetlists: stats?.totalSetlists || 7,
          totalUnitSongs: stats?.totalUnitSongs || 15,
          setlists: (items || []).filter((i) => i.active !== false).map((i) => ({
            name: i.title,
            period: i.period,
            shows: i.shows || (i.badge ? parseInt(i.badge) : 0),
            unitSongs: Array.isArray(i.songs) ? i.songs : [],
          })),
        };
      }
      setProfileData((prev) => ({ ...prev, ...combined }));
    } catch {}
  };

  const loadFunfacts = async () => {
    try {
      const res = await fetch("/api/funfacts");
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setFunfactsList(json.data);
      }
    } catch {}
  };

  useEffect(() => {
    loadLiveStatus();
    loadProfile();
    loadFunfacts();
    const id = setInterval(loadLiveStatus, 60000); // 1 minute
    return () => clearInterval(id);
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const VIDEO_ID = "R3HPWXgIwks";

  const categories = [
    { id: "profile", label: "Profil & Biodata", icon: "bx-user" },
    { id: "funfacts", label: "Fun Facts & Trivia", icon: "bx-bulb" },
    { id: "favorites", label: "Kesukaan & Dislike", icon: "bx-heart" },
    { id: "rekap", label: "Rekap Show Lana", icon: "bx-history" },
  ];

  return (
    <div className="w-full">
      {/* Header Banner */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="px-3.5 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent font-black text-xs tracking-wider uppercase">
            JKT48 Team Love
          </span>
          <span className="px-3.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs">
            Generasi 12
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-3 tracking-tight leading-tight">
          Aurhel Alana Tirta
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl">
          Halaman resmi profil lengkap, fun fact, kesukaan, dan rekap show Lana JKT48.
        </p>
      </div>

      {/* ===========================
          CATEGORY NAVIGATION
          =========================== */}
      <div className="flex flex-wrap gap-2.5 mb-10 p-2 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-[0.85rem] transition-all duration-300 ${
              activeTab === cat.id
                ? "bg-accent text-slate-900 shadow-lg shadow-accent/20 scale-[1.02]"
                : "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <i className={`bx ${cat.icon} text-lg`}></i>
            {cat.label}
          </button>
        ))}
      </div>

      {/* ===========================
          TAB 1: PROFILE & BIODATA
          =========================== */}
      {activeTab === "profile" && (
        <div className="profile-tab-content animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* PROFILE CARD */}
          <section className="flex flex-col lg:flex-row gap-0 rounded-[32px] overflow-hidden mb-16 border-2 border-slate-100 dark:border-slate-700 shadow-2xl bg-white dark:bg-slate-800">
            <div className="flex-1 p-6 md:p-10 bg-transparent">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <div>
                  <h2 className="font-display text-[2.2rem] font-bold text-slate-900 dark:text-white leading-tight">
                    Aurhel Alana Tirta
                  </h2>
                  <p className="text-[0.9rem] text-slate-500 dark:text-slate-400 mt-1 italic">
                    Indonesia • Bekasi (Kampung: Semarang)
                  </p>
                </div>
                <a
                  href="https://www.idn.app/jkt48_lana"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center bg-transparent border-[1.5px] border-theme-border-md text-slate-900 dark:text-white px-4 py-1.5 rounded-full text-[0.78rem] font-bold tracking-[0.08em] cursor-pointer font-body transition-all hover:bg-accent hover:text-b900 hover:border-accent w-fit"
                >
                  + FOLLOW IDN
                </a>
              </div>

              {/* Jikoshoukai Box */}
              <div className="my-6 pl-5 border-l-4 border-accent bg-slate-50 dark:bg-slate-800/50 p-5 rounded-r-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[0.75rem] tracking-[0.15em] uppercase text-accent font-black flex items-center gap-1.5">
                    <i className="bx bxs-quote-left"></i> JIKOSHOUKAI
                  </span>
                  <button
                    onClick={togglePlay}
                    className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white cursor-pointer flex items-center justify-center transition-all hover:bg-accent hover:text-slate-900 hover:border-accent shadow-sm"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    <i className={`bx ${isPlaying ? "bx-pause" : "bx-play"} ml-0.5 text-xl`}></i>
                  </button>
                  <audio ref={audioRef} src="/audio/jiko_lana.mp3" onEnded={() => setIsPlaying(false)} className="hidden" />
                </div>
                <p className="text-[1.1rem] italic text-slate-900 dark:text-white font-medium">
                  &ldquo;Dengan kekuatan bulan, aku akan menyihirmu dengan pesona ku!&rdquo;
                </p>
              </div>

              {/* Biodata Card Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-sm">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-500 flex items-center justify-center text-base">
                      <i className="bx bx-id-card"></i>
                    </span>
                    Nama Lengkap
                  </span>
                  <span className="font-black text-slate-900 dark:text-white">Aurhel Alana Tirta</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center text-base">
                      <i className="bx bx-user"></i>
                    </span>
                    Panggilan
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Lana / Lantul</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center text-base">
                      <i className="bx bx-calendar"></i>
                    </span>
                    Tanggal Lahir
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">14 September 2006</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 flex items-center justify-center text-base">
                      <i className="bx bx-star"></i>
                    </span>
                    Zodiak
                  </span>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-400 font-bold text-xs border border-cyan-500/30">
                    Virgo
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-500 flex items-center justify-center text-base">
                      <i className="bx bx-group"></i>
                    </span>
                    Tim &amp; Generasi
                  </span>
                  <span className="px-3 py-1 rounded-full bg-pink-500/15 text-pink-400 font-black text-xs border border-pink-500/30">
                    Team Love (Gen 12)
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center text-base">
                      <i className="bx bx-brain"></i>
                    </span>
                    MBTI
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-black text-xs border border-emerald-500/30">
                    ENFJ
                  </span>
                </div>

                {/* PENDIDIKAN MAHASISWI */}
                <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border-2 border-pink-500/30 shadow-sm">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-500 flex items-center justify-center text-base">
                      <i className="bx bx-book-reader"></i>
                    </span>
                    Status Pendidikan
                  </span>
                  <span className="font-black text-slate-900 dark:text-white bg-pink-500/15 text-pink-600 dark:text-pink-300 px-4 py-1.5 rounded-full text-xs sm:text-sm border border-pink-500/30 text-left sm:text-right">
                    Mahasiswi S1 Hubungan Internasional (HI)
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center text-base">
                      <i className="bx bx-map-pin"></i>
                    </span>
                    Asal &amp; Kampung
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Bekasi / Semarang</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center text-base">
                      <i className="bx bx-home-heart"></i>
                    </span>
                    Keluarga
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Bungsu (2 Bersaudara)</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center text-base">
                      <i className="bx bx-ruler"></i>
                    </span>
                    Tinggi Badan
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">163 cm</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center text-base">
                      <i className="bx bx-droplet"></i>
                    </span>
                    Golongan Darah
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">O</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center text-base">
                      <i className="bx bx-closet"></i>
                    </span>
                    Ukuran Baju
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">S / M</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-500 flex items-center justify-center text-base">
                      <i className="bx bx-walk"></i>
                    </span>
                    Ukuran Sepatu
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">39</span>
                </div>

                <div className="sm:col-span-2 flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-500 flex items-center justify-center text-base">
                      <i className="bx bx-palette"></i>
                    </span>
                    Hobby &amp; Minat
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Make up &amp; Fotografi</span>
                </div>
              </div>

              {/* Social Media Links */}
              <div>
                <h3 className="text-[0.75rem] tracking-[0.15em] uppercase text-slate-500 dark:text-slate-400 mb-3.5 font-bold">
                  LANA&apos;S OFFICIAL SOCIAL MEDIA
                </h3>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={profileData.socials?.x || "https://x.com/AR_LanaJKT48"}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-accent flex items-center justify-center transition-all hover:-translate-y-1 hover:border-accent hover:text-accent shadow-sm font-bold"
                    aria-label="X"
                  >
                    X
                  </a>
                  <a
                    href={profileData.socials?.instagram || "https://www.instagram.com/jkt48.lana.a/"}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-accent flex items-center justify-center transition-all hover:-translate-y-1 hover:border-accent hover:text-accent shadow-sm"
                    aria-label="Instagram"
                  >
                    <i className="bx bxl-instagram text-xl"></i>
                  </a>
                  <a
                    href={profileData.socials?.tiktok || "https://www.tiktok.com/@jkt48.lana"}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-accent flex items-center justify-center transition-all hover:-translate-y-1 hover:border-accent hover:text-accent shadow-sm"
                    aria-label="TikTok"
                  >
                    <i className="bx bxl-tiktok text-xl"></i>
                  </a>
                  <a
                    href={profileData.socials?.threads || "https://www.threads.net/@jkt48.lana.a"}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-accent flex items-center justify-center transition-all hover:-translate-y-1 hover:border-accent hover:text-accent shadow-sm font-bold text-xs"
                    aria-label="Threads"
                  >
                    @
                  </a>
                  <a
                    href={profileData.socials?.showroom || "https://www.showroom-live.com/r/JKT48_Lana"}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-accent flex items-center justify-center transition-all hover:-translate-y-1 hover:border-accent hover:text-accent shadow-sm font-bold text-[0.75rem]"
                    aria-label="Showroom"
                  >
                    SR
                  </a>
                  <a
                    href={profileData.socials?.idn || "https://www.idn.app/jkt48_lana"}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-accent flex items-center justify-center transition-all hover:-translate-y-1 hover:border-accent hover:text-accent shadow-sm font-bold text-[0.75rem]"
                    aria-label="IDN"
                  >
                    IDN
                  </a>
                </div>
              </div>
            </div>

            {/* Profile Sidebar Photos */}
            <div className="flex-none w-full lg:w-[360px] bg-slate-50 dark:bg-slate-800/30 p-6 flex flex-col items-center border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700">
              <div className="w-full aspect-[3/4] max-w-[300px] lg:max-w-none rounded-2xl overflow-hidden shadow-md mb-5 border border-theme-border">
                <img src="/images/lana1.webp" alt="Aurhel Alana Tirta" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
              </div>

              <div className="grid grid-cols-3 gap-2.5 mb-5 w-full">
                <img src="/images/lana1.webp" alt="Gallery 1" className="w-full aspect-square object-cover rounded-lg shadow-sm border border-theme-border" />
                <img src="/images/lana2.webp" alt="Gallery 2" className="w-full aspect-square object-cover rounded-lg shadow-sm border border-theme-border" />
                <img src="/images/lana3.webp" alt="Gallery 3" className="w-full aspect-square object-cover rounded-lg shadow-sm border border-theme-border" />
              </div>

              <p className="text-[0.9rem] text-slate-500 dark:text-slate-400">
                See <Link href="/gallery" className="font-semibold text-accent hover:text-accent/80 transition-colors">Gallery</Link> for more!
              </p>
            </div>
          </section>

          {/* SOCIAL MEDIA FEEDS */}
          <section className="mb-16">
            <div className="text-center mb-10 relative">
              <span className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-2xl border-2 border-slate-800 dark:border-slate-200 text-[0.85rem] tracking-[0.2em] font-black shadow-xl uppercase z-10 relative">
                <i className="bx bx-rss animate-pulse text-accent text-xl"></i> LATEST UPDATES
              </span>
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-100 dark:bg-slate-800 z-0"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Instagram Feed */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-md overflow-hidden flex flex-col group transition-all w-full flex-1">
                <iframe
                  src={profileData.latestUpdates?.instagramEmbed || "https://www.instagram.com/p/DXt_VxAE4Oj/embed"}
                  width="100%"
                  height="450"
                  frameBorder="0"
                  scrolling="no"
                  allowtransparency="true"
                ></iframe>
              </div>

              {/* X / Twitter Latest Tweet Card */}
              <div className="bg-slate-950 text-white rounded-2xl border-2 border-slate-800 shadow-md overflow-hidden flex flex-col justify-between p-6 group transition-all w-full flex-1">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden border border-accent/40 bg-slate-900 flex-shrink-0">
                        <img src="/images/lana1.webp" alt="Lana Avatar" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <h4 className="font-bold text-sm text-white">Aurhel Alana Tirta</h4>
                          <span className="text-accent text-xs">✓</span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">
                          {profileData.socials?.xHandle || "@AR_LanaJKT48"}
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-lg text-slate-400">X</span>
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed italic whitespace-pre-line my-4">
                    &ldquo;{profileData.latestUpdates?.tweetText || "Halo semuanya! Jangan lupa senyum hari ini yaa ✨"}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[0.75rem] text-slate-500 font-bold">
                    {profileData.latestUpdates?.tweetDate || "Official Post"}
                  </span>
                  <a
                    href={profileData.latestUpdates?.tweetUrl || profileData.socials?.x || "https://x.com/AR_LanaJKT48"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-slate-950 text-xs font-black hover:bg-accent/90 transition-all hover:scale-105"
                  >
                    Buka di X <i className="bx bx-right-arrow-alt text-base"></i>
                  </a>
                </div>
              </div>

              {/* Threads Feed */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-md overflow-hidden flex flex-col group transition-all w-full flex-1">
                <iframe
                  src={profileData.latestUpdates?.threadsEmbed || "https://www.threads.net/@jkt48.lana.a/post/DW3WfvFGtbe/embed"}
                  width="100%"
                  height="450"
                  frameBorder="0"
                  scrolling="no"
                  allowtransparency="true"
                ></iframe>
              </div>

              {/* Lana Live Status (Dynamic) */}
              <div className="lg:col-span-3">
                <LiveStatus data={liveData} loading={liveLoading} />
              </div>

              {/* TikTok Feed Card */}
              <div className="md:col-span-2 lg:col-span-3 bg-slate-900 text-white rounded-3xl border-2 border-slate-800 shadow-xl overflow-hidden flex flex-col md:flex-row">
                <div className="bg-black/60 p-8 md:w-1/2 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full border-2 border-accent overflow-hidden">
                      <img src="/images/lana1.webp" className="w-full h-full object-cover" alt="Avatar" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Lana JKT48</h4>
                      <p className="text-xs text-slate-400">{profileData.socials?.tiktokHandle || "@jkt48.lana"}</p>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white">
                    {profileData.latestUpdates?.tiktokTitle || "Cek video dan aktivitas seru Lana di TikTok!"}
                  </h3>
                  <a
                    href={profileData.latestUpdates?.tiktokVideoUrl || profileData.socials?.tiktok || "https://www.tiktok.com/@jkt48.lana"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-accent text-slate-950 px-6 py-3 rounded-full font-black text-sm transition-transform hover:scale-105 w-fit"
                  >
                    <i className="bx bxl-tiktok text-lg"></i> Buka TikTok Lana
                  </a>
                </div>
                <div className="flex-1 bg-slate-950 p-6 flex flex-col items-center justify-center text-center">
                  <i className="bx bxl-tiktok text-6xl text-accent/80 mb-3 animate-bounce"></i>
                  <p className="text-slate-400 text-sm font-medium">Follow &amp; dukung video keseharian Lana!</p>
                </div>
              </div>
            </div>
          </section>

          {/* LANA VIDEO DEBUT */}
          <section className="mb-16">
            <div className="text-center mb-8 relative">
              <span className="inline-block bg-theme-card px-5 py-2 rounded-full border border-theme-border-md text-[0.8rem] tracking-[0.15em] font-bold text-b500 shadow-sm uppercase z-10 relative">
                LANA&apos;S VIDEO DEBUT
              </span>
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-theme-border z-0"></div>
            </div>

            <div className="bg-theme-card p-4 rounded-3xl border border-theme-border shadow-sm">
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black relative">
                <iframe
                  src={`https://www.youtube.com/embed/${VIDEO_ID}`}
                  title="Lana Video Debut"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full border-0"
                />
              </div>
            </div>
          </section>

          {/* LANA KABESHA TIMELINE */}
          <section className="mb-16">
            <div className="text-center mb-8 relative">
              <span className="inline-block bg-theme-card px-5 py-2 rounded-full border border-theme-border-md text-[0.8rem] tracking-[0.15em] font-bold text-b500 shadow-sm uppercase z-10 relative">
                LANA&apos;S KABESHA JOURNEY
              </span>
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-theme-border z-0"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <figure className="bg-theme-card p-4 pb-6 rounded-2xl border border-theme-border shadow-sm transform transition-transform hover:-translate-y-2 hover:shadow-md hover:rotate-1 mx-auto w-full">
                <div className="aspect-[3/4] w-full rounded-xl overflow-hidden mb-5 bg-theme-soft">
                  <img src="/images/kabesha1.webp" alt="Lana Kabesha 2023" className="w-full h-full object-cover" />
                </div>
                <figcaption className="text-center">
                  <div className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">2023</div>
                  <div className="text-[0.9rem] text-slate-500 dark:text-slate-400 font-medium">First Lana&apos;s Kabesha</div>
                  <div className="text-[0.8rem] text-b500 font-semibold mt-1 bg-theme-soft inline-block px-3 py-1 rounded-full">Trainee Member</div>
                </figcaption>
              </figure>

              <figure className="bg-theme-card p-4 pb-6 rounded-2xl border border-theme-border shadow-sm transform transition-transform hover:-translate-y-2 hover:shadow-md mx-auto w-full">
                <div className="aspect-[3/4] w-full rounded-xl overflow-hidden mb-5 bg-theme-soft">
                  <img src="/images/kabesha2.webp" alt="Lana Kabesha 2025" className="w-full h-full object-cover" />
                </div>
                <figcaption className="text-center">
                  <div className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">2025</div>
                  <div className="text-[0.9rem] text-slate-500 dark:text-slate-400 font-medium">Lana&apos;s Kabesha</div>
                  <div className="text-[0.8rem] text-b500 font-semibold mt-1 bg-theme-soft inline-block px-3 py-1 rounded-full">Regular Member</div>
                </figcaption>
              </figure>

              <figure className="bg-theme-card p-4 pb-6 rounded-2xl border border-theme-border shadow-sm transform transition-transform hover:-translate-y-2 hover:shadow-md hover:-rotate-1 mx-auto w-full">
                <div className="aspect-[3/4] w-full rounded-xl overflow-hidden mb-5 bg-theme-soft">
                  <img src="/images/kabesha3.webp" alt="Lana Kabesha 2026" className="w-full h-full object-cover" />
                </div>
                <figcaption className="text-center">
                  <div className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">2026</div>
                  <div className="text-[0.9rem] text-slate-500 dark:text-slate-400 font-medium">Lana&apos;s Kabesha</div>
                  <div className="text-[0.8rem] text-b500 font-semibold mt-1 bg-theme-soft inline-block px-3 py-1 rounded-full">Regular Member</div>
                </figcaption>
              </figure>

              <figure className="bg-theme-card p-4 pb-6 rounded-2xl border border-theme-border shadow-sm transform transition-transform hover:-translate-y-2 hover:shadow-md hover:rotate-2 mx-auto w-full">
                <div className="aspect-[3/4] w-full rounded-xl overflow-hidden mb-5 bg-theme-soft">
                  <img src="/images/aurhel.webp" alt="Lana Love Team" className="w-full h-full object-cover" />
                </div>
                <figcaption className="text-center">
                  <div className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">2026</div>
                  <div className="text-[0.9rem] text-slate-500 dark:text-slate-400 font-medium">Love Team Kabesha</div>
                  <div className="text-[0.8rem] text-b500 font-semibold mt-1 bg-theme-soft inline-block px-3 py-1 rounded-full">Team Love Member</div>
                </figcaption>
              </figure>
            </div>

            <div className="text-center">
              <Link href="/gallery" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-body text-[0.95rem] font-semibold transition-all border-2 border-accent text-accent hover:bg-accent/10 hover:-translate-y-0.5">
                Lihat Gallery Selengkapnya <i className="bx bx-right-arrow-alt text-xl"></i>
              </Link>
            </div>
          </section>
        </div>
      )}

      {/* ===========================
          TAB 2: FUN FACTS & TRIVIA
          =========================== */}
      {activeTab === "funfacts" && (
        <div className="funfacts-tab-content animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Fun Facts & Trivia Lana</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Fakta-fakta unik, kebiasaan lucu, dan sisi menggemaskan dari Aurhel Alana Tirta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {(funfactsList.length > 0 ? funfactsList : [
              { id: 1, icon: "bx bxs-moon", color: "text-amber-500", bg: "bg-amber-500/10", title: "Jiko Bulan & Sailor Moon", content: "Jikonya bertema bulan karena Lana sangat menggemari anime Sailor Moon! Bahkan sebelum memakai nama \"Lana\", awalnya ia mengusulkan stage name \"Luna\"." },
              { id: 2, icon: "bx bx-masks-theater", color: "text-pink-500", bg: "bg-pink-500/10", title: "Punya 2 Mode Kepribadian", content: "Lana punya 2 mode yang kontras: Mode Aurhel untuk sisi anggun dan kalemnya, serta Mode Lana untuk sisi centil, ekspresif, dan cerianya!" },
              { id: 3, icon: "bx bx-spa", color: "text-emerald-500", bg: "bg-emerald-500/10", title: "Bakat Lidah Bentuk Bunga", content: "Salah satu bakat unik biologisnya adalah bisa melipat lidahnya menjadi 3 bagian sehingga bentuknya persis menyerupai kelopak bunga." },
              { id: 4, icon: "bx bx-camera", color: "text-blue-500", bg: "bg-blue-500/10", title: "Jidat 1 Hektar & Muka Selayar", content: "Kalau selfie, Lana sering banget tangannya menutupi \"jidat 1 hektar\"-nya. Selain itu, dia juga hobi foto close-up muka selayar penuh." },
              { id: 5, icon: "bx bx-message-square-dots", color: "text-violet-500", bg: "bg-violet-500/10", title: "Typingan Khas & Emote Bejibun", content: "Typingannya dikenal agak alay disertai CAPSLOCK JEBOL dan emote segabannya! Dia juga suka ngode lewat emotikon-emotikon lucunya." },
              { id: 6, icon: "bx bx-dish", color: "text-orange-500", bg: "bg-orange-500/10", title: "Tim Bubur Diaduk", content: "Dalam perdebatan aliran bubur ayam, Lana secara tegas masuk ke dalam sekte Bubur DIADUK!" },
              { id: 7, icon: "bx bx-smile", color: "text-rose-500", bg: "bg-rose-500/10", title: "Julukan Lantul & Bestie Erine", content: "Dipanggil \"Lantul\" oleh Erine. Waktu audisi kedua mereka main bareng dan ngeledekin Fritzy berdua. Lana juga jadi sasaran empuk kejahilan Erine dan gen 12!" },
              { id: 8, icon: "bx bx-globe", color: "text-cyan-500", bg: "bg-cyan-500/10", title: "Lancar Bahasa Korea", content: "Pernah belajar bahasa Jepang, tetapi akhirnya pindah haluan mendalami bahasa Korea sampai cukup lancar dan fasih." },
              { id: 9, icon: "bx bx-time", color: "text-indigo-500", bg: "bg-indigo-500/10", title: "Rutinitas X & Absen Pagi", content: "Selalu mengucapkan goodnight setiap malam, rajin tweet absen pagi setiap hari, dan sangat rajin membaca mention para fans di platform X." },
              { id: 10, icon: "bx bx-shuffle", color: "text-teal-500", bg: "bg-teal-500/10", title: "Sering Ketuker Lana vs Nala", content: "Karena nama dan pelafalannya mirip, sampai sekarang masih banyak fans atau orang baru yang sering ketuker antara Lana dan Nala." },
              { id: 11, icon: "bx bx-music", color: "text-fuchsia-500", bg: "bg-fuchsia-500/10", title: "Wishlist: Usotsuki Dachou", content: "Lana sangat berkeinginan untuk membawakan unit song Usotsuki Dachou (Burung Unta Bohong) dari setlist legendaris Ramune no Nomikata." },
              { id: 12, icon: "bx bx-layer", color: "text-sky-500", bg: "bg-sky-500/10", title: "Aikatsu x JKT48", content: "Pertama kali tahu JKT48 lewat kolaborasi Aikatsu x JKT48. Dia ikut audisi gen 12 karena diajak oleh temannya!" },
            ]).map((fact) => (
              <div
                key={fact.id}
                className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${fact.bg || "bg-amber-500/10"} ${fact.color || "text-amber-500"} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}
                >
                  <i className={fact.icon || "bx bx-bulb"}></i>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                  {fact.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-[0.92rem] leading-relaxed">
                  {fact.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===========================
          TAB 3: KESUKAAN & DISLIKES
          =========================== */}
      {activeTab === "favorites" && (
        <div className="favorites-tab-content animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Favorit & Pantangan Lana</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Segala hal yang disukai dan tidak disukai oleh Lana, dari musik, kuliner, hobi, hingga idol favorit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* K-Pop & Music */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-slate-100 dark:border-slate-700 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center text-2xl">
                  <i className="bx bx-headphone"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">K-Pop & Musik Favorit</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Penggemar K-Pop sejak sekolah dasar</p>
                </div>
              </div>

              <ul className="space-y-3.5 text-slate-700 dark:text-slate-300 text-[0.92rem]">
                <li className="flex items-start gap-2.5">
                  <i className="bx bxs-check-circle text-accent text-lg mt-0.5"></i>
                  <div><strong>Girl Group:</strong> (G)I-DLE, AESPA, BABYMONSTER, NewJeans (&ldquo;semua suka katanya!&rdquo;)</div>
                </li>
                <li className="flex items-start gap-2.5">
                  <i className="bx bxs-check-circle text-accent text-lg mt-0.5"></i>
                  <div><strong>Boy Group:</strong> ENHYPEN</div>
                </li>
                <li className="flex items-start gap-2.5">
                  <i className="bx bxs-check-circle text-accent text-lg mt-0.5"></i>
                  <div><strong>Lagu Favorit:</strong> <em>Ditto</em> - NewJeans (pernah bikin project terinspirasi dari Ditto)</div>
                </li>
                <li className="flex items-start gap-2.5">
                  <i className="bx bxs-check-circle text-accent text-lg mt-0.5"></i>
                  <div><strong>Solois Favorit:</strong> The Weeknd</div>
                </li>
                <li className="flex items-start gap-2.5">
                  <i className="bx bxs-check-circle text-accent text-lg mt-0.5"></i>
                  <div><strong>Koleksi:</strong> Rajin mengumpulkan album K-Pop sejak masih SD</div>
                </li>
              </ul>
            </div>

            {/* Kuliner & Makanan */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-slate-100 dark:border-slate-700 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-2xl">
                  <i className="bx bx-restaurant"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Kuliner & Selera Makanan</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Makanan pedas, manis, dan gurih</p>
                </div>
              </div>

              <ul className="space-y-3.5 text-slate-700 dark:text-slate-300 text-[0.92rem]">
                <li className="flex items-start gap-2.5">
                  <i className="bx bxs-check-circle text-accent text-lg mt-0.5"></i>
                  <div><strong>Makanan Favorit:</strong> Seblak & Ayam Geprek dekat rumah</div>
                </li>
                <li className="flex items-start gap-2.5">
                  <i className="bx bxs-check-circle text-accent text-lg mt-0.5"></i>
                  <div><strong>Bagian Ayam:</strong> Tim Paha Atas (sama persis kayak Erine)</div>
                </li>
                <li className="flex items-start gap-2.5">
                  <i className="bx bxs-check-circle text-accent text-lg mt-0.5"></i>
                  <div><strong>Camilan & Buah:</strong> Dodol Duren & Jeruk Sunkist</div>
                </li>
                <li className="flex items-start gap-2.5">
                  <i className="bx bxs-check-circle text-accent text-lg mt-0.5"></i>
                  <div><strong>Preferensi:</strong> Martabak Manis &gt; Asin, Keju &gt; Cokelat, Nasi Goreng &gt; Mie Goreng</div>
                </li>
              </ul>
            </div>

            {/* JKT48 Songs & Oshi */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-slate-100 dark:border-slate-700 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-2xl">
                  <i className="bx bx-heart-circle"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Lagu JKT48 & Oshi</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Lagu favorit dan panutan di grup</p>
                </div>
              </div>

              <div className="space-y-4 text-slate-700 dark:text-slate-300 text-[0.92rem]">
                <div>
                  <strong className="block text-slate-900 dark:text-white mb-1">Lagu JKT48 Favorit:</strong>
                  <div className="flex flex-wrap gap-2">
                    {["Darashinai Aishikata", "Namida No Shounan", "Dareka No Tame Ni", "Oshibe to Meshibe"].map((song, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-100 dark:bg-slate-700/60 rounded-xl text-xs font-semibold">
                        {song}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                  <strong className="block text-slate-900 dark:text-white mb-1">Oshi di JKT48:</strong>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Sebelum masuk: Marsha</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Setelah masuk: <strong>Marsha, Adel, Ella, Fiony, Freya, Feni</strong> (&ldquo;semua yang dia liat jadi oshi dia!&rdquo;)
                  </p>
                </div>
              </div>
            </div>

            {/* Karakter, Hobi & Hal yang Tidak Disukai */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border-2 border-slate-100 dark:border-slate-700 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl">
                  <i className="bx bx-star"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Minat, Karakter & Dislike</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Warna, tempat nongkrong & hal yang dihindari</p>
                </div>
              </div>

              <ul className="space-y-3.5 text-slate-700 dark:text-slate-300 text-[0.92rem]">
                <li className="flex items-start gap-2.5">
                  <i className="bx bxs-heart text-pink-500 text-lg mt-0.5"></i>
                  <div><strong>Warna & Karakter:</strong> Pink, Sailor Moon, Koleksi Kartu Aikatsu</div>
                </li>
                <li className="flex items-start gap-2.5">
                  <i className="bx bxs-map-pin text-accent text-lg mt-0.5"></i>
                  <div><strong>Tempat Main & Olahraga:</strong> Suka main ke BKT (Banjir Kanal Timur) & Olahraga Renang</div>
                </li>
                <li className="flex items-start gap-2.5">
                  <i className="bx bx-tv text-accent text-lg mt-0.5"></i>
                  <div><strong>Series & Humor:</strong> Twilight Drama Series & Suka jokes bapak-bapak garing</div>
                </li>
                <li className="flex items-start gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <i className="bx bxs-x-circle text-red-500 text-lg mt-0.5"></i>
                  <div>
                    <strong className="text-red-500">DISLIKE:</strong> Nggak suka dibilang <em>&ldquo;srat srot&rdquo;</em> & Nggak suka dikapal-kapalin (katanya nanti ditenggelamin!).
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ===========================
          TAB 4: REKAP SHOW
          =========================== */}
      {activeTab === "rekap" && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
          <div className="text-center mb-4">
            <h2 className="font-display text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
              Rekap Show &amp; Setlists Teater
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg mx-auto">
              Klik pada kartu setlist untuk membalik kartu (3D Flip) dan melihat daftar unit song yang dibawakan Lana! 🌙✨
            </p>
          </div>

          <SetlistShowSection />
        </section>
      )}

      {/* ===========================
          FAQ SECTION
          =========================== */}
      <section className="mt-20 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Pertanyaan Seputar Lana</h2>
          <p className="text-slate-500 dark:text-slate-400">Segala hal yang ingin kamu ketahui tentang Lana JKT48.</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {[
            { q: "Kapan Lana ulang tahun dan berapa angka kesukaannya?", a: "Lana berulang tahun setiap tanggal 14 September (lahir tahun 2006). Angka kesukaannya adalah 14, sesuai dengan tanggal kelahirannya!" },
            { q: "Di team mana Lana berada saat ini?", a: "Lana adalah member JKT48 Generasi 12 dan saat ini merupakan bagian dari JKT48 Team Love." },
            { q: "Apa jikoshoukai Lana dan kenapa bertema bulan?", a: "Jikonya adalah: 'Dengan kekuatan bulan, aku akan menyihirmu dengan pesona ku!'. Jiko ini bertema bulan karena Lana sangat menyukai anime Sailor Moon." },
            { q: "Apa jurusan kuliah Lana saat ini?", a: "Lana saat ini menempuh pendidikan di perguruan tinggi sebagai Mahasiswi Jurusan Hubungan Internasional (HI)." },
            { q: "Apa makanan dan minuman kesukaan Lana?", a: "Lana sangat menyukai seblak dan ayam geprek dekat rumahnya, dodol duren, serta buah Jeruk Sunkist. Untuk bagian ayam, Lana tim paha atas!" },
            { q: "Siapa idol K-Pop dan penyanyi favorit Lana?", a: "Lana menyukai (G)I-DLE, AESPA, BABYMONSTER, NewJeans (khususnya lagu Ditto), ENHYPEN, dan solois The Weeknd." },
            { q: "Apa hal yang paling tidak disukai oleh Lana?", a: "Lana tidak suka dibilang 'srat srot' dan paling tidak suka dikapal-kapalin (katanya nanti ditenggelamin!)." },
          ].map((faq, i) => (
            <FaqItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </section>
    </div>
  );
}

function RekapItem({ setlist, shows, period, unitSongs }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-all mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
            <i className="bx bx-music text-xl"></i>
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white group-hover:text-accent transition-colors text-base md:text-lg block">
              {setlist}
            </span>
            {period && (
              <span className="text-xs text-slate-400 font-medium">{period}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {shows && (
            <span className="px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent font-black text-xs uppercase tracking-wider">
              {shows} Show
            </span>
          )}
          <i className={`bx ${isOpen ? 'bx-chevron-up' : 'bx-chevron-down'} text-2xl text-slate-400`}></i>
        </div>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-2 animate-in fade-in slide-in-from-top-2 duration-300 border-t border-slate-100 dark:border-slate-700/60">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Unit Songs Dibawakan:</p>
          <div className="flex flex-wrap gap-2">
            {unitSongs.map((song, idx) => (
              <span key={idx} className="px-4 py-2 bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 rounded-xl text-xs md:text-sm font-semibold border border-slate-100 dark:border-slate-700">
                {idx + 1}. {song}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex items-center justify-between gap-4 group"
      >
        <span className="font-bold text-slate-900 dark:text-white group-hover:text-accent transition-colors">{question}</span>
        <i className={`bx ${isOpen ? 'bx-chevron-up' : 'bx-chevron-down'} text-2xl text-slate-400`}></i>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 text-[0.95rem] leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
          {answer}
        </div>
      )}
    </div>
  );
}
