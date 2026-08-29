import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-rose-950/50 text-white/85 px-6 sm:px-10 pt-16 pb-8 mt-auto border-t-2 border-pink-500/20 overflow-hidden">
      {/* Background Subtle Heart Watermarks */}
      <span className="absolute top-8 right-12 text-pink-500/10 text-7xl select-none pointer-events-none">
        ♥
      </span>
      <span className="absolute bottom-6 left-10 text-rose-400/10 text-5xl select-none pointer-events-none">
        ♥
      </span>
      <span className="absolute top-1/2 left-1/3 text-pink-400/5 text-8xl select-none pointer-events-none">
        ♥
      </span>

      <div className="relative z-10 max-w-[1200px] mx-auto mb-12 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        {/* Brand Column */}
        <div className="md:col-span-5 flex flex-col items-start">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-display text-3xl font-black text-white tracking-tight">
              LUNA<span className="text-pink-400">.</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-black uppercase tracking-wider">
              <span className="text-pink-400">♥</span> JKT48 Team Love
            </span>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
            Website fanbase resmi yang didedikasikan untuk mendukung perjalanan{" "}
            <strong>Aurhel Alana Tirta</strong> di JKT48. Bersama kita dukung
            Lana untuk terus bersinar dan memancarkan pesonanya! 🌙✨
          </p>

          <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-900/80 border border-pink-500/20 text-xs text-slate-300 font-medium">
            <span className="text-lg">🌙</span>
            <span>
              <em>&ldquo;Dengan kekuatan bulan, aku akan menyihirmu!&rdquo;</em>
            </span>
          </div>
        </div>

        {/* Navigation Column */}
        <div className="md:col-span-3 flex flex-col">
          <h4 className="font-display text-base font-bold text-white mb-4 flex items-center gap-2">
            <i className="bx bx-compass text-pink-400"></i> Jelajahi Halaman
          </h4>
          <ul className="list-none flex flex-col gap-2.5 text-sm">
            <li>
              <Link
                href="/"
                className="text-slate-400 hover:text-pink-300 transition-colors flex items-center gap-2"
              >
                <i className="bx bx-chevron-right text-xs text-pink-500"></i>{" "}
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about-lana"
                className="text-slate-400 hover:text-pink-300 transition-colors flex items-center gap-2"
              >
                <i className="bx bx-chevron-right text-xs text-pink-500"></i>{" "}
                Profil & Rekap Lana
              </Link>
            </li>
            <li>
              <Link
                href="/about-luna"
                className="text-slate-400 hover:text-pink-300 transition-colors flex items-center gap-2"
              >
                <i className="bx bx-chevron-right text-xs text-pink-500"></i>{" "}
                Fansite Luna
              </Link>
            </li>
            <li>
              <Link
                href="/show-theater"
                className="text-slate-400 hover:text-pink-300 transition-colors flex items-center gap-2"
              >
                <i className="bx bx-chevron-right text-xs text-pink-500"></i>{" "}
                Jadwal Show Theater
              </Link>
            </li>
            <li>
              <Link
                href="/live"
                className="text-slate-400 hover:text-pink-300 transition-colors flex items-center gap-2"
              >
                <i className="bx bx-chevron-right text-xs text-pink-500"></i>{" "}
                Status Live Streaming
              </Link>
            </li>
            <li>
              <Link
                href="/gallery"
                className="text-slate-400 hover:text-pink-300 transition-colors flex items-center gap-2"
              >
                <i className="bx bx-chevron-right text-xs text-pink-500"></i>{" "}
                Galeri Foto
              </Link>
            </li>
            <li>
              <Link
                href="/news"
                className="text-slate-400 hover:text-pink-300 transition-colors flex items-center gap-2"
              >
                <i className="bx bx-chevron-right text-xs text-pink-500"></i>{" "}
                News & Pengumuman
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media Column */}
        <div className="md:col-span-4 flex flex-col">
          <h4 className="font-display text-base font-bold text-white mb-4 flex items-center gap-2">
            <i className="bx bx-share-alt text-pink-400"></i> Sosial Media Resmi
            Lana
          </h4>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Follow dan dukung semua akun resmi Aurhel Alana Tirta:
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href="https://x.com/AR_LanaJKT48"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900/80 hover:bg-pink-600 border border-slate-800 hover:border-pink-400 text-xs text-slate-300 hover:text-white font-bold transition-all shadow-sm group"
            >
              <span className="font-black w-4 text-center">X</span>
              <span className="truncate">Twitter (X)</span>
            </a>
            <a
              href="https://www.instagram.com/jkt48.lana.a/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900/80 hover:bg-pink-600 border border-slate-800 hover:border-pink-400 text-xs text-slate-300 hover:text-white font-bold transition-all shadow-sm group"
            >
              <i className="bx bxl-instagram text-base"></i>
              <span className="truncate">Instagram</span>
            </a>
            <a
              href="https://www.tiktok.com/@jkt48.lana"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900/80 hover:bg-pink-600 border border-slate-800 hover:border-pink-400 text-xs text-slate-300 hover:text-white font-bold transition-all shadow-sm group"
            >
              <i className="bx bxl-tiktok text-base"></i>
              <span className="truncate">TikTok</span>
            </a>
            <a
              href="https://www.threads.net/@jkt48.lana.a"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900/80 hover:bg-pink-600 border border-slate-800 hover:border-pink-400 text-xs text-slate-300 hover:text-white font-bold transition-all shadow-sm group"
            >
              <span className="font-bold">@</span>
              <span className="truncate">Threads</span>
            </a>
            <a
              href="https://www.showroom-live.com/r/JKT48_Lana"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900/80 hover:bg-pink-600 border border-slate-800 hover:border-pink-400 text-xs text-slate-300 hover:text-white font-bold transition-all shadow-sm group"
            >
              <span className="font-black text-[0.65rem]">SR</span>
              <span className="truncate">Showroom</span>
            </a>
            <a
              href="https://www.idn.app/jkt48_lana"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900/80 hover:bg-pink-600 border border-slate-800 hover:border-pink-400 text-xs text-slate-300 hover:text-white font-bold transition-all shadow-sm group"
            >
              <span className="font-black text-[0.65rem]">IDN</span>
              <span className="truncate">IDN Live</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 max-w-[1200px] mx-auto pt-6 border-t border-pink-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-xs">
        <p>
          &copy; {currentYear} <strong>LUNA Fansite</strong>. All rights
          reserved.
        </p>
        <p className="flex items-center gap-1 text-slate-400">
          Made with <span className="text-pink-400 animate-pulse">♥</span> for{" "}
          <strong>Aurhel Alana Tirta</strong>
        </p>
      </div>
    </footer>
  );
}
