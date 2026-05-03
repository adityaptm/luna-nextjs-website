"use client";
import Link from "next/link";
import Script from "next/script";
import { Tweet } from "react-tweet";
import { useEffect, useMemo, useRef, useState } from "react";

// mapping nama panggilan → nama panjang
const namaPanjang = {
  erine: "Catherina Vallencia Kurniawan",
  aralie: "Abigail Rachel",
  delynn: "Adeline Wijaya",
  alya: "Alya Amanda",
  amanda: "Amanda Puspita Sukma Mulyadewi",
  christy: "Angelina Christy",
  anindya: "Anindya Ramadhani",
  virgi: "Astrella Virgiananda",
  auwia: "Aulia Riza",
  lia: "Aurellia",
  lana: "Aurhel Alana Tirta",
  rilly: "Bong Aprilli",
  cathy: "Cathleen Nixie",
  elin: "Celline Thefani",
  chelsea: "Chelsea Davina",
  oniel: "Cornelia Vanisa",
  cynthia: "Cynthia Yaputera",
  danella: "Dena Natalia",
  daisy: "Desy Natalia",
  olla: "Febriola Sinambela",
  feni: "Feni Fitriyanti",
  fiony: "Fiony Alveria",
  freya: "Freya Jayawardana",
  fritzy: "Fritzy Rosmerian",
  ella: "Gabriela Abigail Mewengkang",
  gendis: "Gendis Mayrannisa",
  gita: "Gita Sekar Andarini",
  gracie: "Grace Octaviani",
  greesel: "Greesella Adhalia",
  giaa: "Hagia Sopia",
  eli: "Helisma Putri",
  lily: "Hillary Abigail",
  maira: "Humaira Ramadhani",
  indah: "Indah Cahya Nabilla",
  ekin: "Jacqueline Immanuela",
  trisha: "Jazzlyn Trisha",
  jemima: "Jemima Evodie",
  jessi: "Jessica Chandra",
  lyn: "Jesslyn Elly",
  kathrina: "Kathrina Irene",
  lulu: "Lulu Salsabila",
  marsha: "Marsha Lenathea",
  michie: "Marsha Lenathea",
  levi: "Michelle Levia",
  mikaela: "Mikaela Kusjanto",
  muthe: "Mutiara Azzahra",
  nayla: "Nayla Suji Aurelia",
  nachia: "Nina Tutachia",
  intan: "Nur Intan",
  oline: "Oline Manuel",
  raisha: "Raisha Syifa Wardhana",
  ribka: "Ribka Budiman",
  nala: "Shabilqis Naila",
  gracia: "Shania Gracia",
  kimmy: "Victoria Kimberly",
};

function normalizeKey(name) {
  return (name || "").toLowerCase().trim();
}

function formatIdDate(showDate) {
  if (!showDate) return { dateStr: "-", timeStr: "-" };
  const d = new Date(showDate);
  const dateStr = d.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { dateStr, timeStr };
}

export default function AboutLana() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // profile, rekap, theater, hashtag

  // --- Theater State ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [show, setShow] = useState(null);

  async function loadSchedule() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/show-theater", { cache: "no-store" });
      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error("Gagal memuat format data theater.");
      }

      if (json?.success === true) {
        setShow(json.data || null);
        return;
      }
      
      const msg = json?.message || "Gagal memuat jadwal";
      setShow(null);
      setError(msg);
    } catch (e) {
      setShow(null);
      setError(e?.message || "Gagal memuat jadwal");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSchedule();
    const id = setInterval(loadSchedule, 180000);
    return () => clearInterval(id);
  }, []);

  const computed = useMemo(() => {
    if (!show) return null;
    const { dateStr, timeStr } = formatIdDate(show.date);
    const members = Array.isArray(show.members) ? show.members : show.lineup || [];
    return { dateStr, timeStr, members };
  }, [show]);
  // --------------------

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

  // GANTI pakai ID video YouTube Lana
  const VIDEO_ID = "R3HPWXgIwks";

  const categories = [
    { id: "profile", label: "Profile Lana", icon: "bx-user" },
    { id: "rekap", label: "Rekap Show Lana", icon: "bx-history" },
    { id: "theater", label: "Show Theater Lana", icon: "bx-building-house" },
    { id: "hashtag", label: "Hashtag Lana", icon: "bx-hash" },
  ];

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Aurhel Alana Tirta</h1>
        <p className="text-slate-600 dark:text-slate-300 text-lg">Halaman resmi informasi dan update terbaru Lana JKT48.</p>
      </div>

      {/* ===========================
          CATEGORY NAVIGATION
          =========================== */}
      <div className="flex flex-wrap gap-3 mb-10 p-2 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-[0.85rem] transition-all duration-300 ${
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

      {activeTab === "profile" && (
        <div className="profile-tab-content animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ===========================
          PROFILE CARD
          =========================== */}
      <section className="flex flex-col lg:flex-row gap-0 rounded-[32px] overflow-hidden mb-16 border-2 border-slate-100 dark:border-slate-700 shadow-2xl bg-white dark:bg-slate-800">
        <div className="flex-1 p-6 md:p-10 bg-transparent">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 mb-2">
            <h1 className="font-display text-[2.2rem] font-bold text-slate-900 dark:text-white">Aurhel Alana Tirta</h1>
            <a href="https://www.idn.app/jkt48_lana" target="_blank" rel="noreferrer" className="inline-block bg-transparent border-[1.5px] border-theme-border-md text-slate-900 dark:text-white px-4 py-1.5 rounded-full text-[0.78rem] font-bold tracking-[0.08em] cursor-pointer font-body transition-all hover:bg-accent hover:text-b900 hover:border-accent">
              + FOLLOW
            </a>
          </div>
          <p className="text-[0.88rem] text-slate-500 dark:text-slate-400 mb-7 italic">Indonesia • Bekasi</p>

          <div className="mb-6 pb-6 border-b-2 border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800 last:border-b-0">
              <span className="font-bold text-slate-950 dark:text-white min-w-[140px] flex items-center gap-2">
                <i className="bx bx-id-card text-accent"></i> Nama Asli
              </span>
              <span className="text-slate-800 dark:text-slate-200 text-right font-medium">Aurhel Alana Tirta</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800 last:border-b-0">
              <span className="font-bold text-slate-950 dark:text-white min-w-[140px] flex items-center gap-2">
                <i className="bx bx-user text-accent"></i> Panggilan
              </span>
              <span className="text-slate-800 dark:text-slate-200 text-right font-medium">Lana</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800 last:border-b-0">
              <span className="font-bold text-slate-950 dark:text-white min-w-[140px] flex items-center gap-2">
                <i className="bx bx-calendar text-accent"></i> Tanggal Lahir
              </span>
              <span className="text-slate-800 dark:text-slate-200 text-right font-medium">14 September 2006</span>
            </div>
          </div>

          <div className="mb-6 pb-6 border-b-2 border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800 last:border-b-0">
              <span className="font-bold text-slate-950 dark:text-white min-w-[140px] flex items-center gap-2">
                <i className="bx bx-map text-accent"></i> Kota Asal
              </span>
              <span className="text-slate-800 dark:text-slate-200 text-right font-medium">Bekasi, Indonesia</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800 last:border-b-0">
              <span className="font-bold text-slate-950 dark:text-white min-w-[140px] flex items-center gap-2">
                <i className="bx bx-droplet text-accent"></i> Gol. Darah
              </span>
              <span className="text-slate-800 dark:text-slate-200 text-right font-medium">O</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800 last:border-b-0">
              <span className="font-bold text-slate-950 dark:text-white min-w-[140px] flex items-center gap-2">
                <i className="bx bx-star text-accent"></i> Zodiak
              </span>
              <span className="text-slate-800 dark:text-slate-200 text-right font-medium">Virgo</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800 last:border-b-0">
              <span className="font-bold text-slate-950 dark:text-white min-w-[140px] flex items-center gap-2">
                <i className="bx bx-ruler text-accent"></i> Tinggi Badan
              </span>
              <span className="text-slate-800 dark:text-slate-200 text-right font-medium">162cm</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800 last:border-b-0">
              <span className="font-bold text-slate-950 dark:text-white min-w-[140px] flex items-center gap-2">
                <i className="bx bx-group text-accent"></i> Tim
              </span>
              <span className="text-slate-800 dark:text-slate-200 text-right font-medium">Love</span>
            </div>
          </div>

          <div className="mb-6 pb-6 border-b-2 border-slate-100 dark:border-slate-800">
            <h3 className="text-[0.75rem] tracking-[0.15em] uppercase text-slate-500 dark:text-slate-400 mb-3.5 flex items-center gap-2.5 font-bold">
              <i className="bx bx-comment-detail text-accent text-lg"></i> JIKOSHOUKAI
              <button 
                onClick={togglePlay}
                className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white cursor-pointer flex items-center justify-center transition-all hover:bg-accent hover:text-slate-900 hover:border-accent shadow-sm" 
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                <i className={`bx ${isPlaying ? 'bx-pause' : 'bx-play'} ml-0.5 text-xl`}></i>
              </button>
              <audio ref={audioRef} src="/audio/jiko_lana.mp3" onEnded={() => setIsPlaying(false)} className="hidden" />
            </h3>
            <div className="pl-5 border-l-4 border-accent bg-slate-50 dark:bg-slate-800/50 p-6 rounded-r-2xl">
              <p className="text-[1.1rem] italic text-slate-900 dark:text-white mb-2 font-medium">Dengan kekuatan bulan,</p>
              <p className="text-[1.1rem] italic text-slate-900 dark:text-white mb-2 font-medium">aku akan menyihirmu dengan</p>
              <p className="text-[1.2rem] font-black text-accent tracking-wide">Pesonaku!</p>
            </div>
          </div>

          <div>
            <h3 className="text-[0.75rem] tracking-[0.15em] uppercase text-slate-500 dark:text-slate-400 mb-3.5">LANA&apos;S SOCIAL MEDIA</h3>
            <div className="flex flex-wrap gap-3">
              <a href="https://x.com/AR_LanaJKT48" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-accent flex items-center justify-center transition-all hover:-translate-y-1 hover:border-accent hover:text-accent shadow-sm font-bold" aria-label="X">
                X
              </a>

              <a href="https://www.instagram.com/jkt48.lana.a/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-accent flex items-center justify-center transition-all hover:-translate-y-1 hover:border-accent hover:text-accent shadow-sm" aria-label="Instagram">
                <i className="bx bxl-instagram text-xl"></i>
              </a>

              <a href="https://www.tiktok.com/@jkt48.lana" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-accent flex items-center justify-center transition-all hover:-translate-y-1 hover:border-accent hover:text-accent shadow-sm" aria-label="TikTok">
                <i className="bx bxl-tiktok text-xl"></i>
              </a>


              <a
                href="https://www.showroom-live.com/r/JKT48_Lana"
                target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-accent flex items-center justify-center transition-all hover:-translate-y-1 hover:border-accent hover:text-accent shadow-sm font-bold text-[0.75rem]"
                aria-label="Showroom"
              >
                SR
              </a>
              <a href="https://www.idn.app/jkt48_lana" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-accent flex items-center justify-center transition-all hover:-translate-y-1 hover:border-accent hover:text-accent shadow-sm font-bold text-[0.75rem]" aria-label="IDN">
                IDN
              </a>
            </div>
          </div>
        </div>

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

      {/* ===========================
          SOCIAL MEDIA FEEDS
          =========================== */}
      <section className="mb-16">
        <div className="text-center mb-10 relative">
          <span className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-2xl border-2 border-slate-800 dark:border-slate-200 text-[0.85rem] tracking-[0.2em] font-black shadow-xl uppercase z-10 relative">
            <i className="bx bx-rss animate-pulse text-accent text-xl"></i> LATEST UPDATES
          </span>
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-100 dark:bg-slate-800 z-0"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-md overflow-hidden flex flex-col group transition-all w-full flex-1">
            <iframe src="https://www.instagram.com/p/DXt_VxAE4Oj/embed" width="100%" height="450" frameBorder="0" scrolling="no" allowtransparency="true"></iframe>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-md overflow-hidden flex flex-col group transition-all w-full flex-1 p-2 items-center justify-center">
            <Tweet id="2050953297947992286" />
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-md overflow-hidden flex flex-col group transition-all w-full flex-1">
            <iframe src="https://www.threads.net/@jkt48.lana.a/post/DW3WfvFGtbe/embed" width="100%" height="450" frameBorder="0" scrolling="no" allowtransparency="true"></iframe>
          </div>

          <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-100 dark:border-slate-700 shadow-lg overflow-hidden flex flex-col">
            <div className="bg-slate-50 dark:bg-slate-900 p-5 flex items-center justify-between border-b-2 border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3 font-bold text-slate-950 dark:text-white">
                <span className="bg-red-600 text-white px-2.5 py-1 rounded-lg text-xs uppercase tracking-tighter shadow-sm font-black">LIVE</span> 
                <span className="flex items-center gap-2">
                  <i className="bx bx-play-circle text-red-500 text-xl"></i> Lana IDN Live
                </span>
              </div>
              <a href="https://www.idn.app/jkt48_lana" target="_blank" rel="noreferrer" className="text-xs text-accent font-black hover:underline flex items-center gap-1 uppercase tracking-wider">
                Buka di IDN <i className="bx bx-link-external"></i>
              </a>
            </div>
            <div className="p-10 text-center bg-slate-950 text-white/50 italic text-[0.9rem]">
              Klik tombol di atas untuk menonton live terbaru Lana di IDN.
            </div>
          </div>

          {/* TikTok Embed */}
          <div className="md:col-span-2 lg:col-span-3 bg-theme-card rounded-3xl border border-theme-border shadow-sm overflow-hidden flex flex-col md:flex-row">
            <div className="bg-black text-white p-6 md:w-1/3 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
                  <img src="/images/lana1.webp" className="w-full h-full object-cover" alt="Avatar" />
                </div>
                <div>
                  <h4 className="font-bold">Lana JKT48</h4>
                  <p className="text-xs text-white/60">@jkt48.lana</p>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 italic">&quot;Cek video TikTok terbaru aku ya!&quot;</h3>
              <a href="https://www.tiktok.com/@jkt48.lana" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold text-sm transition-transform hover:scale-105">
                <i className="bx bxl-tiktok"></i> Follow di TikTok
              </a>
            </div>
            <div className="flex-1 bg-theme-soft p-4 flex items-center justify-center overflow-hidden">
              <div className="w-full max-w-[325px]">
                <blockquote className="tiktok-embed" cite="https://www.tiktok.com/@jkt48.lana/video/7632990796190354709" data-video-id="7632990796190354709" style={{ maxWidth: '605px', minWidth: '325px' }}>
                  <section>
                    <a target="_blank" title="@jkt48.lana" href="https://www.tiktok.com/@jkt48.lana?refer=embed">@jkt48.lana</a>
                  </section>
                </blockquote>
                <Script async src="https://www.tiktok.com/embed.js" strategy="lazyOnload" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===========================
          LANA VIDEO DEBUT (EMBED)
          =========================== */}
      <section className="mb-16">
        <div className="text-center mb-8 relative">
          <span className="inline-block bg-theme-card px-5 py-2 rounded-full border border-theme-border-md text-[0.8rem] tracking-[0.15em] font-bold text-b500 shadow-sm uppercase z-10 relative">LANA&apos;S VIDEO DEBUT</span>
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

      {/* Lana kabesha*/}
      <section className="mb-16">
        <div className="text-center mb-8 relative">
          <span className="inline-block bg-theme-card px-5 py-2 rounded-full border border-theme-border-md text-[0.8rem] tracking-[0.15em] font-bold text-b500 shadow-sm uppercase z-10 relative">LANA&apos;S KABESHA</span>
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-theme-border z-0"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <figure className="bg-theme-card p-4 pb-6 rounded-2xl border border-theme-border shadow-sm transform transition-transform hover:-translate-y-2 hover:shadow-md hover:rotate-1 mx-auto w-full">
            <div className="aspect-[3/4] w-full rounded-xl overflow-hidden mb-5 bg-theme-soft">
              <img src="/images/kabesha1.webp" alt="Lana Kabesha 2023" className="w-full h-full object-cover" />
            </div>
            <figcaption className="text-center">
              <div className="font-display text-2xl font-bold text-slate-900 mb-1">2023</div>
              <div className="text-[0.9rem] text-slate-500 dark:text-slate-400 font-medium">First Lana&apos;s Kabesha</div>
              <div className="text-[0.8rem] text-b500 font-semibold mt-1 bg-theme-soft inline-block px-3 py-1 rounded-full">As a Trainee Member</div>
            </figcaption>
          </figure>

          <figure className="bg-theme-card p-4 pb-6 rounded-2xl border border-theme-border shadow-sm transform transition-transform hover:-translate-y-2 hover:shadow-md mx-auto w-full">
            <div className="aspect-[3/4] w-full rounded-xl overflow-hidden mb-5 bg-theme-soft">
              <img src="/images/kabesha2.webp" alt="Lana Kabesha 2025" className="w-full h-full object-cover" />
            </div>
            <figcaption className="text-center">
              <div className="font-display text-2xl font-bold text-slate-900 mb-1">2025</div>
              <div className="text-[0.9rem] text-slate-500 dark:text-slate-400 font-medium">Lana&apos;s Kabesha</div>
              <div className="text-[0.8rem] text-b500 font-semibold mt-1 bg-theme-soft inline-block px-3 py-1 rounded-full">As a Regular Member</div>
            </figcaption>
          </figure>

          <figure className="bg-theme-card p-4 pb-6 rounded-2xl border border-theme-border shadow-sm transform transition-transform hover:-translate-y-2 hover:shadow-md hover:-rotate-1 mx-auto w-full">
            <div className="aspect-[3/4] w-full rounded-xl overflow-hidden mb-5 bg-theme-soft">
              <img src="/images/kabesha3.webp" alt="Lana Kabesha 2026" className="w-full h-full object-cover" />
            </div>
            <figcaption className="text-center">
              <div className="font-display text-2xl font-bold text-slate-900 mb-1">2026</div>
              <div className="text-[0.9rem] text-slate-500 dark:text-slate-400 font-medium">Lana&apos;s Kabesha</div>
              <div className="text-[0.8rem] text-b500 font-semibold mt-1 bg-theme-soft inline-block px-3 py-1 rounded-full">As a Regular Member</div>
            </figcaption>
          </figure>

          <figure className="bg-theme-card p-4 pb-6 rounded-2xl border border-theme-border shadow-sm transform transition-transform hover:-translate-y-2 hover:shadow-md hover:rotate-2 mx-auto w-full">
            <div className="aspect-[3/4] w-full rounded-xl overflow-hidden mb-5 bg-theme-soft">
              <img src="/images/aurhel.webp" alt="Lana Love Team" className="w-full h-full object-cover" />
            </div>
            <figcaption className="text-center">
              <div className="font-display text-2xl font-bold text-slate-900 mb-1">2026</div>
              <div className="text-[0.9rem] text-slate-500 dark:text-slate-400 font-medium">Love Team Kabesha</div>
              <div className="text-[0.8rem] text-b500 font-semibold mt-1 bg-theme-soft inline-block px-3 py-1 rounded-full">As a Love Team Member</div>
            </figcaption>
          </figure>
        </div>

        <div className="text-center">
          <Link href="/gallery" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-body text-[0.95rem] font-semibold transition-all border-2 border-accent text-accent hover:bg-accent/10 hover:-translate-y-0.5">
            Lihat Gallery <i className="bx bx-right-arrow-alt text-xl"></i>
          </Link>
        </div>
        </section>
      </div>
    )}

      {/* ===========================
          REKAP SHOW TAB
          =========================== */}
      {activeTab === "rekap" && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-100 dark:border-slate-700 shadow-xl p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="bx bx-history text-4xl text-accent"></i>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Rekap Show Lana</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
              Fitur Rekap Show sedang dalam pengembangan. Kamu bisa melihat riwayat penampilan Lana di theater JKT48 segera!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="text-2xl font-black text-accent">--</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Show</div>
              </div>
              <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="text-2xl font-black text-accent">--</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Setlist Berbeda</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===========================
          THEATER TAB
          =========================== */}
      {activeTab === "theater" && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="w-12 h-12 border-4 border-slate-100 dark:border-slate-700 border-t-accent rounded-full animate-spin mb-4" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">Memuat jadwal theater...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-8 rounded-3xl border-2 border-red-100 dark:border-red-900/30 text-center">
              <i className="bx bx-error-circle text-4xl mb-3"></i>
              <p className="font-bold text-lg mb-1">Yah, ada kendala!</p>
              <p className="opacity-80 mb-6">{error}</p>
              <button onClick={loadSchedule} className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors">Coba Lagi</button>
            </div>
          ) : !show || !computed ? (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-12 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-center">
              <i className="bx bx-calendar-x text-5xl text-slate-300 dark:text-slate-600 mb-4"></i>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Belum Ada Jadwal</h3>
              <p className="text-slate-500 dark:text-slate-400">Saat ini belum ada jadwal theater terbaru untuk Lana.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-[32px] border-2 border-slate-100 dark:border-slate-700 shadow-2xl overflow-hidden group">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 text-white p-6 md:px-10 border-b-2 border-slate-800">
                <div className="font-semibold text-lg flex items-center gap-2">
                  <i className="bx bx-calendar text-accent text-xl"></i> {computed.dateStr}
                </div>
                <div className="font-medium text-[0.95rem] opacity-90 flex items-center gap-2 mt-2 sm:mt-0">
                  <i className="bx bx-time-five text-accent text-xl"></i> Mulai: <span className="font-bold text-white">{computed.timeStr} WIB</span>
                </div>
              </div>

              <div className="flex flex-col-reverse lg:flex-row p-6 md:p-10 gap-10">
                <div className="flex-1">
                  <div className="font-display text-2xl md:text-4xl font-black text-slate-950 dark:text-white mb-8 pb-6 border-b-2 border-slate-100 dark:border-slate-700 leading-tight">
                    {String(show.title || "").toUpperCase()}
                  </div>

                  <div className="flex flex-wrap gap-3 mb-10">
                    {computed.members.map((m, idx) => {
                      const key = normalizeKey(m?.name);
                      const fullName = namaPanjang[key] || m?.name || "";
                      const isLana = key === "lana" || normalizeKey(fullName) === "aurhel alana tirta";

                      return (
                        <div
                          key={`${key}-${idx}`}
                          className={`px-4 py-2 rounded-xl text-[0.85rem] font-bold border-2 transition-all duration-300 cursor-default ${
                            isLana 
                              ? "bg-accent text-slate-900 border-accent shadow-lg shadow-accent/20 scale-110 z-10" 
                              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-700 hover:border-accent/40"
                          }`}
                        >
                          {isLana && <i className="bx bxs-star mr-1.5"></i>}
                          {fullName}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {show.url && (
                      <a href={show.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-slate-900 rounded-2xl font-bold shadow-xl shadow-accent/20 hover:-translate-y-1 transition-all">
                        <i className="bx bx-receipt text-xl"></i> Beli Tiket
                      </a>
                    )}
                    {show?.idnTheater?.slug && (
                      <a href={`https://www.idn.app/live/${show.idnTheater.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-accent text-accent rounded-2xl font-bold hover:bg-accent/5 hover:-translate-y-1 transition-all">
                        <i className="bx bx-play-circle text-xl"></i> Nonton di IDN
                      </a>
                    )}
                  </div>
                </div>

                <div className="w-full lg:w-[320px] flex-shrink-0">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
                    {show.poster || show.banner || show.setlist_poster ? (
                      <img src={show.poster || show.banner || show.setlist_poster} alt={show.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                        <i className="bx bx-image text-5xl mb-2"></i>
                        <span className="font-bold">No Poster</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ===========================
          HASHTAG TAB
          =========================== */}
      {activeTab === "hashtag" && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border-2 border-slate-100 dark:border-slate-700 shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <i className="bx bx-hash text-accent text-2xl"></i> Official Hashtags
              </h3>
              <div className="space-y-4">
                {[
                  { tag: "#AurhelAlana", desc: "Hashtag utama untuk Lana JKT48" },
                  { tag: "#LanaJKT48", desc: "Hashtag pencarian di sosial media" },
                  { tag: "#PesonakuLana", desc: "Hashtag khusus interaksi fans" },
                  { tag: "#LanaGenerasi12", desc: "Hashtag debut generasi 12" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 group hover:border-accent transition-colors">
                    <div>
                      <div className="font-bold text-accent text-lg">{item.tag}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</div>
                    </div>
                    <button 
                      onClick={() => navigator.clipboard.writeText(item.tag)}
                      className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-accent hover:border-accent transition-all flex items-center justify-center"
                    >
                      <i className="bx bx-copy"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl text-white shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-4">Kenapa pakai Hashtag?</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  Menggunakan hashtag resmi membantu meningkatkan visibilitas Lana di media sosial dan memudahkan Lana untuk melihat dukungan dari kalian semua!
                </p>
                <div className="p-4 bg-white/10 rounded-2xl border border-white/10 italic text-sm text-white/90">
                  &quot;Gunakan hashtag #PesonakuLana setiap kali kamu memposting foto atau dukungan untukku ya!&quot;
                </div>
              </div>
              <div className="mt-8 flex items-center gap-3">
                <i className="bx bxl-twitter text-3xl opacity-50"></i>
                <i className="bx bxl-instagram text-3xl opacity-50"></i>
                <i className="bx bxl-tiktok text-3xl opacity-50"></i>
              </div>
            </div>
          </div>
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
            { q: "Kapan Lana ulang tahun?", a: "Lana berulang tahun setiap tanggal 14 September. Ia lahir pada tahun 2006." },
            { q: "Apa hobi Lana?", a: "Lana sangat suka public speaking, menyanyi, dan menari. Ia juga senang berinteraksi dengan fans." },
            { q: "Apa warna kesukaan Lana?", a: "Lana sangat menyukai warna Pink dan Putih." },
            { q: "Apa makanan favorit Lana?", a: "Strawberry adalah makanan yang sangat disukai Lana!" },
            { q: "Apa Jikoshoukai Lana?", a: "Dengan kekuatan bulan, aku akan menyihirmu dengan pesonaku! Halo, aku Lana." },
          ].map((faq, i) => (
            <FaqItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </section>
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
