"use client";

import { useEffect, useState } from "react";
import ShowTheaterLanaPage from "./show-theater/page";
import GameLanaPage from "./game/page";
import MessageBoard from "@/components/MessageBoard";
import LiveStatus from "@/components/LiveStatus";
import SetlistShowSection from "@/components/SetlistShowSection";
import Link from "next/link";

const fallbackHashtags = [
  { tag: "#VoyageOfLana", desc: "Dukungan Umum", icon: "bx bx-rocket", color: "text-purple-400" },
  { tag: "#LaNaight", desc: "Ucapan Selamat Malam", icon: "bx bx-moon", color: "text-indigo-400" },
  { tag: "#PremierJourLana", desc: "Dukungan Show Setlist Pertama", icon: "bx bx-star", color: "text-amber-400" },
  { tag: "#AurheLive", desc: "Nonton Live SR/IDN", icon: "bx bx-broadcast", color: "text-rose-500" },
  { tag: "#AurheView", desc: "Review Penampilan Theater", icon: "bx bx-show", color: "text-blue-400" },
  { tag: "#LanAffirmation", desc: "Dukungan Oshi / Balas PM", icon: "bx bx-heart", color: "text-pink-500" },
  { tag: "#CeritaLana", desc: "Balas PM", icon: "bx bx-book-open", color: "text-emerald-400" },
  { tag: "#RaBulana", desc: "Upload Foto Hari Rabu", icon: "bx bx-image", color: "text-cyan-400" },
  { tag: "#RHenaiKinshiJourei", desc: "Request Hour 2026", icon: "bx bx-music", color: "text-rose-400" },
  { tag: "#JKT48RequestAURhel2026", desc: "Request Hour 2026", icon: "bx bx-trophy", color: "text-amber-400" },
  { tag: "#JKT48RequestHour2026", desc: "Request Hour 2026", icon: "bx bx-medal", color: "text-amber-400" },
];

const defaultProfile = {
  socials: {
    x: "https://x.com/AR_LanaJKT48",
    instagram: "https://www.instagram.com/jkt48.lana.a/",
    tiktok: "https://www.tiktok.com/@jkt48.lana",
    threads: "https://www.threads.net/@jkt48.lana.a",
    showroom: "https://www.showroom-live.com/r/JKT48_Lana",
    idn: "https://www.idn.app/jkt48_lana",
  },
  rekapShow: { totalShows: 52, totalSetlists: 5, totalUnitSongs: 10 },
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("tentang");
  const [hashtags, setHashtags] = useState(fallbackHashtags);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [liveData, setLiveData] = useState(null);
  const [liveLoading, setLiveLoading] = useState(true);
  const [profileData, setProfileData] = useState(defaultProfile);

  const loadLiveStatus = async () => {
    setLiveLoading(true);
    try {
      const res = await fetch("/api/lana-live");
      const json = await res.json();
      if (json.success) setLiveData(json.data);
    } catch {}
    finally { setLiveLoading(false); }
  };

  const loadHashtags = async () => {
    try {
      const res = await fetch("/api/hashtags");
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) setHashtags(json.data);
    } catch {}
  };

  const loadProfile = async () => {
    try {
      const [profRes, setRes] = await Promise.allSettled([
        fetch("/api/profile").then((r) => r.json()),
        fetch("/api/setlists").then((r) => r.json()),
      ]);
      let combined = { ...defaultProfile };
      if (profRes.status === "fulfilled" && profRes.value.success && profRes.value.data) {
        combined = { ...combined, ...profRes.value.data };
      }
      if (setRes.status === "fulfilled" && setRes.value.success && setRes.value.data?.stats) {
        combined.rekapShow = setRes.value.data.stats;
      }
      setProfileData(combined);
    } catch {}
  };

  useEffect(() => {
    loadLiveStatus();
    loadHashtags();
    loadProfile();
    const id = setInterval(loadLiveStatus, 60000);
    return () => clearInterval(id);
  }, []);

  const copyToClipboard = (text: string, label?: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTag(text);
    setToastMessage(label || `${text} berhasil disalin!`);
    setTimeout(() => { setCopiedTag(null); setToastMessage(null); }, 2500);
  };

  const copyAllHashtags = () => {
    const allTags = hashtags.map((h) => h.tag).join(" ");
    copyToClipboard(allTags, "Semua hashtag berhasil disalin!");
  };

  const tabs = [
    { key: "tentang", label: "Tentang Lana", icon: "bx-user" },
    { key: "theater", label: "Show Theater", icon: "bx-calendar-star" },
    { key: "live", label: "Live", icon: "bx-broadcast" },
    { key: "game", label: "Game", icon: "bx-game" },
    { key: "pesan", label: "Pesan", icon: "bx-envelope" },
    { key: "hashtag", label: "Hashtag", icon: "bx-hash" },
  ];

  const socials = profileData.socials || defaultProfile.socials;
  const rekap = profileData.rekapShow || defaultProfile.rekapShow;

  return (
    <div className="w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[99999] bg-slate-900/95 border-2 border-pink-500/80 text-white px-6 py-3 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-xs">
            <i className="bx bx-check"></i>
          </div>
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* ===========================
          HERO SECTION (STYLE FANBASE INTAN)
          =========================== */}
      <section className="relative overflow-hidden rounded-[36px] mb-8 shadow-2xl border-2 border-pink-500/20 bg-slate-950">
        {/* Background Team Love Gradient & Atmospheric Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/90 to-rose-950/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(1.5px_1.5px_at_15%_20%,rgba(255,255,255,0.7),transparent),radial-gradient(1px_1px_at_35%_60%,rgba(255,255,255,0.4),transparent),radial-gradient(2px_2px_at_55%_15%,rgba(255,255,255,0.6),transparent),radial-gradient(1px_1px_at_75%_45%,rgba(255,255,255,0.3),transparent),radial-gradient(1.5px_1.5px_at_90%_80%,rgba(255,255,255,0.5),transparent)] opacity-40"></div>

        {/* Soft glowing spheres */}
        <div className="absolute -bottom-10 -left-10 w-96 h-96 rounded-full bg-pink-600/15 blur-[100px] pointer-events-none"></div>
        <div className="absolute -top-10 -right-10 w-96 h-96 rounded-full bg-rose-500/15 blur-[90px] pointer-events-none"></div>

        {/* Floating Heart & Moon Watermarks */}
        <span className="absolute top-6 left-6 text-pink-400/20 text-4xl select-none animate-pulse">♥</span>
        <span className="absolute top-14 right-1/3 text-rose-300/15 text-6xl select-none">♥</span>
        <span className="absolute bottom-16 left-1/4 text-pink-500/15 text-5xl select-none">♥</span>
        <span className="absolute top-8 right-12 text-3xl select-none opacity-20">🌙</span>
        <span className="absolute bottom-10 right-8 text-2xl select-none opacity-20">✨</span>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
          {/* Left Column: Intro & Biodata */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="inline-flex items-center gap-1.5 bg-pink-500/20 border border-pink-500/40 text-pink-300 px-3.5 py-1.5 rounded-full text-[0.75rem] font-black uppercase tracking-wider shadow-sm">
                <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></span>
                JKT48 Team Love
              </span>
              <span className="inline-flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-full text-[0.75rem] font-black uppercase tracking-wider">
                Generasi 12
              </span>
            </div>

            {/* Sub-heading & Title */}
            <p className="text-pink-300/90 text-xs font-black uppercase tracking-[0.25em] mb-1.5">
              Kenalan dengan
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.3rem] font-black text-white leading-tight mb-3 tracking-tight">
              Aurhel Alana <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300">Tirta</span>
            </h1>

            {/* Jikoshoukai */}
            <div className="bg-pink-950/40 border-l-4 border-pink-500 rounded-r-2xl py-2.5 px-4 mb-4 backdrop-blur-sm">
              <p className="text-pink-200/90 text-sm font-medium italic">
                &ldquo;Dengan kekuatan bulan, aku akan menyihirmu dengan pesona ku!&rdquo; 🌙✨
              </p>
            </div>

            {/* Birth Info */}
            <div className="flex items-center gap-2 mb-4 text-slate-300 text-sm font-bold">
              <div className="w-7 h-7 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <i className="bx bx-map-pin"></i>
              </div>
              <span>Bekasi, 14 September 2006</span>
            </div>

            {/* Intro Narrative */}
            <p className="text-slate-300/90 text-sm md:text-[0.95rem] leading-relaxed mb-6">
              Member aktif <strong>JKT48 Generasi 12</strong> di <strong>Team Love</strong>. Saat ini menempuh pendidikan sebagai <strong>Mahasiswi Jurusan Hubungan Internasional (HI)</strong> dengan ketertarikan di bidang fotografi dan hobi make up. Dikenal <em>easy going</em>, flexible, rajin menyapa penggemar, dan memiliki pesona senyum yang hangat memikat hati!
            </p>

            {/* Social Media Row */}
            <div className="mb-7">
              <p className="text-[0.7rem] font-black uppercase tracking-widest text-slate-400 mb-2.5 flex items-center gap-1.5">
                <i className="bx bx-heart text-pink-400"></i> Ikuti Lana:
              </p>
              <div className="flex flex-wrap gap-2.5">
                <a
                  href={socials.x}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-2xl bg-slate-900/90 hover:bg-pink-600 border border-slate-700 hover:border-pink-400 flex items-center justify-center text-white font-black text-sm transition-all hover:-translate-y-1 shadow-md"
                  title="Twitter / X"
                >
                  X
                </a>
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-2xl bg-slate-900/90 hover:bg-pink-600 border border-slate-700 hover:border-pink-400 flex items-center justify-center text-white text-xl transition-all hover:-translate-y-1 shadow-md"
                  title="Instagram"
                >
                  <i className="bx bxl-instagram"></i>
                </a>
                <a
                  href={socials.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-2xl bg-slate-900/90 hover:bg-pink-600 border border-slate-700 hover:border-pink-400 flex items-center justify-center text-white text-xl transition-all hover:-translate-y-1 shadow-md"
                  title="TikTok"
                >
                  <i className="bx bxl-tiktok"></i>
                </a>
                <a
                  href={socials.threads}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-2xl bg-slate-900/90 hover:bg-pink-600 border border-slate-700 hover:border-pink-400 flex items-center justify-center text-white font-bold text-sm transition-all hover:-translate-y-1 shadow-md"
                  title="Threads"
                >
                  @
                </a>
                <a
                  href={socials.showroom}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-2xl bg-slate-900/90 hover:bg-pink-600 border border-slate-700 hover:border-pink-400 flex items-center justify-center text-white font-black text-[0.7rem] transition-all hover:-translate-y-1 shadow-md"
                  title="Showroom"
                >
                  SR
                </a>
                <a
                  href={socials.idn}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-2xl bg-slate-900/90 hover:bg-pink-600 border border-slate-700 hover:border-pink-400 flex items-center justify-center text-white font-black text-[0.7rem] transition-all hover:-translate-y-1 shadow-md"
                  title="IDN Live"
                >
                  IDN
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5">
              <Link
                href="/about-lana"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-400 hover:to-rose-500 text-white font-black text-sm shadow-xl shadow-pink-900/40 transition-all hover:scale-105 cursor-pointer"
              >
                <i className="bx bx-user-circle text-lg"></i>
                Kenali Lebih Dekat
              </Link>
              <button
                onClick={() => setActiveTab("live")}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border-2 border-pink-500/30 text-white font-bold text-sm transition-all hover:scale-105 backdrop-blur-sm cursor-pointer shadow-md"
              >
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                Cek Status Live
              </button>
            </div>
          </div>

          {/* Right Column: Lana Photo Card */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-[360px] aspect-[4/5] rounded-[32px] overflow-hidden border-2 border-pink-500/40 shadow-2xl group bg-slate-900">
              <img
                src="/images/lana1.webp"
                alt="Aurhel Alana Tirta"
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
              
              {/* Floating Badge in photo */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-pink-400">Team Love</p>
                  <p className="text-sm font-black text-white">Aurhel Alana Tirta</p>
                </div>
                <span className="text-xl">🌙</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row Bar */}
        <div className="relative z-10 grid grid-cols-3 border-t-2 border-pink-500/20 bg-slate-950/70 backdrop-blur-md">
          <div className="py-5 px-3 text-center border-r-2 border-pink-500/20">
            <div className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-300">
              {rekap.totalShows || 52}+ Show
            </div>
            <div className="text-[0.7rem] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
              Penampilan Teater
            </div>
          </div>

          <div className="py-5 px-3 text-center border-r-2 border-pink-500/20">
            <div className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-amber-300">
              {rekap.totalSetlists || 5} Setlist
            </div>
            <div className="text-[0.7rem] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
              Setlist Yang Dibawakan
            </div>
          </div>

          <div className="py-5 px-3 text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-pink-300">
              {rekap.totalUnitSongs || 10} Unit Song
            </div>
            <div className="text-[0.7rem] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
              Unit Songs
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Running Hashtags Bar */}
      <div className="mb-8 overflow-hidden bg-slate-900/90 border-2 border-pink-500/20 rounded-2xl py-3 px-3 shadow-lg relative backdrop-blur-sm">
        <div className="flex items-center">
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider flex-shrink-0 mr-3 z-10 shadow-sm">
            <i className="bx bx-trending-up animate-pulse"></i> Trending
          </div>
          <div className="overflow-hidden w-full relative">
            <div className="animate-marquee gap-3 flex items-center">
              {[...hashtags, ...hashtags].map((item, idx) => (
                <button
                  key={`${item.tag}-${idx}`}
                  onClick={() => copyToClipboard(item.tag)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-pink-500/20 hover:border-pink-500/50 border border-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer whitespace-nowrap group"
                  title="Klik untuk menyalin"
                >
                  <span className="text-pink-400 group-hover:text-pink-300">#</span>
                  {item.tag.replace("#", "")}
                  <i className="bx bx-copy text-[0.7rem] opacity-60 group-hover:opacity-100"></i>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 px-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-[0.85rem] font-bold transition-all duration-200 border-2 cursor-pointer ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white border-pink-400 shadow-lg shadow-pink-900/30 transform -translate-y-0.5"
                : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-pink-500/40"
            } ${tab.key === "live" && !liveLoading && liveData ? "ring-2 ring-red-500" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <i className={`bx ${tab.icon} text-base`}></i>
            {tab.label}
            {tab.key === "live" && !liveLoading && liveData && (
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse ml-0.5"></span>
            )}
          </button>
        ))}
      </div>

      <div className="max-w-[960px] mx-auto">
        {/* TAB: TENTANG LANA */}
        {activeTab === "tentang" && (
          <section className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[32px] shadow-xl p-8 md:p-12 transition-all">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-slate-100 dark:border-slate-800">
              <div className="w-11 h-11 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500 text-2xl">
                <i className="bx bx-user-circle"></i>
              </div>
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-950 dark:text-white">
                  Tentang Aurhel Alana
                </h2>
                <p className="text-xs text-slate-400 font-medium">Biodata & Informasi Singkat</p>
              </div>
            </div>

            <div className="space-y-5 text-slate-800 dark:text-slate-200 leading-relaxed text-[1.02rem]">
              <p>
                Aurhel Alana Tirta merupakan salah satu member JKT48 Generasi ke-12 yang saat ini aktif di <strong>JKT48 Team Love</strong>. Dikenal dengan aura lembut, pembawaan tenang, dan pesonanya yang memikat. Lahir pada tanggal 14 September 2006 di Bekasi dengan kampung halaman di Semarang, Lana berzodiak Virgo dengan tinggi badan 163 cm dan MBTI ENFJ.
              </p>
              <p>
                Lana pertama kali diperkenalkan sebagai trainee pada event <strong>Jak-Japan Matsuri 2023</strong> tanggal 18 November 2023, dan melakukan debut theater pertamanya pada setlist <em>Aitakatta (Ingin Bertemu)</em> tanggal 1 Maret 2024.
              </p>
              <p>
                Ia saat ini menempuh pendidikan sebagai <strong>Mahasiswi Jurusan Hubungan Internasional (HI)</strong> dengan minat mendalam di bidang fotografi. Lana menyukai warna pink, anime Sailor Moon, musik K-Pop, seblak, dan ayam geprek.
              </p>
              <div className="pt-4 flex items-center gap-3">
                <Link
                  href="/about-lana"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-sm shadow-lg hover:scale-105 transition-all"
                >
                  <i className="bx bx-id-card"></i>
                  Baca Profil &amp; Rekap Lengkap
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* TAB: LIVE */}
        {activeTab === "live" && (
          <section className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[32px] shadow-xl p-8 md:p-12 transition-all">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-slate-100 dark:border-slate-800">
              <div className="w-11 h-11 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 text-2xl">
                <i className="bx bx-broadcast"></i>
              </div>
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-950 dark:text-white">
                  Live Streaming Lana
                </h2>
                <p className="text-xs text-slate-400 font-medium">Showroom &amp; IDN Live</p>
              </div>
            </div>
            <LiveStatus data={liveData} loading={liveLoading} />
          </section>
        )}

        {/* TAB: THEATER */}
        {activeTab === "theater" && (
          <section className="space-y-12 transition-all">
            <SetlistShowSection />
            <div className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[32px] shadow-xl p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-slate-100 dark:border-slate-800">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 text-2xl">
                  <i className="bx bx-calendar-star"></i>
                </div>
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-950 dark:text-white">
                    Jadwal Pertunjukan Teater
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">Jadwal Penampilan Teater Mendatang</p>
                </div>
              </div>
              <ShowTheaterLanaPage />
            </div>
          </section>
        )}

        {/* TAB: GAME */}
        {activeTab === "game" && (
          <div className="transition-all w-full">
            <GameLanaPage />
          </div>
        )}

        {/* TAB: PESAN */}
        {activeTab === "pesan" && (
          <section className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[32px] shadow-xl p-8 md:p-12 transition-all">
            <MessageBoard />
          </section>
        )}

        {/* TAB: HASHTAG */}
        {activeTab === "hashtag" && (
          <section className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[32px] shadow-xl p-8 md:p-12 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b-2 border-slate-100 dark:border-slate-800 pb-6">
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
                  <i className="bx bx-hash text-pink-500"></i> Official Hashtag Support
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Klik pada kartu untuk menyalin hashtag ke clipboard secara otomatis!
                </p>
              </div>

              <button
                onClick={copyAllHashtags}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-pink-900/30 transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
              >
                <i className="bx bx-copy-alt text-base"></i>
                Salin Semua Hashtag
              </button>
            </div>

            {/* Grid of Hashtags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {hashtags.map((item) => {
                const isCopied = copiedTag === item.tag;
                return (
                  <button
                    key={item.tag}
                    onClick={() => copyToClipboard(item.tag)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 group cursor-pointer shadow-sm text-left w-full ${
                      isCopied
                        ? "bg-pink-500/15 border-pink-500 scale-[1.02]"
                        : "bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 hover:border-pink-500/50 hover:scale-[1.02]"
                    }`}
                  >
                    <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center flex-shrink-0 text-xl shadow-sm border border-slate-100 dark:border-slate-800">
                      <i className={`${item.icon} ${item.color}`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-950 dark:text-white font-black text-[0.95rem] truncate flex items-center gap-2">
                        {item.tag}
                        {isCopied && (
                          <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-pink-500 text-white uppercase tracking-wider">
                            Disalin!
                          </span>
                        )}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[0.8rem] font-medium mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-pink-400 group-hover:bg-pink-500/10 transition-colors flex-shrink-0">
                      <i className={`bx ${isCopied ? "bx-check text-pink-500 text-lg" : "bx-copy"}`}></i>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
