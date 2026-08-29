"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'about' | 'activity' | 'media' | null
  const [isLive, setIsLive] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
    }

    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // Check live status
    const checkLive = async () => {
      try {
        const res = await fetch("/api/lana-live");
        const json = await res.json();
        setIsLive(!!(json.success && json.data));
      } catch {}
    };
    checkLive();
    const liveInterval = setInterval(checkLive, 60000);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearInterval(liveInterval);
    };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  };

  const menuLinkClass =
    "text-[0.88rem] font-bold text-slate-200 px-3.5 py-2 rounded-xl transition-all duration-200 tracking-[0.01em] hover:text-pink-300 hover:bg-pink-500/10 whitespace-nowrap flex items-center gap-1.5 cursor-pointer";

  const dropdownItemClass =
    "px-4 py-3 text-[0.85rem] font-bold text-slate-200 hover:text-pink-300 hover:bg-pink-500/10 transition-colors flex items-center gap-2.5 rounded-xl";

  return (
    <header
      ref={headerRef}
      className="bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950/40 backdrop-blur-xl px-4 md:px-8 border-b-2 border-pink-500/20 sticky top-0 z-50 shadow-[0_4px_30px_rgba(244,63,94,0.1)]"
    >
      <nav className="flex justify-between items-center max-w-[1200px] mx-auto h-16">
        {/* Logo & Team Love Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <Image
                src="/images/luna.webp"
                alt="LUNA Logo"
                width={36}
                height={36}
                className="object-cover rounded-full border-2 border-pink-400/60 shadow-[0_0_15px_rgba(244,63,94,0.4)] group-hover:scale-105 transition-transform"
                priority
              />
              {/* Live dot on logo */}
              {isLive && (
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-950 animate-pulse" />
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-[1.55rem] font-black text-white tracking-[0.02em]">
                LUNA<span className="text-pink-400">.</span>
              </span>
            </div>
          </Link>

          {/* Team Love Badge */}
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-[0.68rem] font-black uppercase tracking-wider">
            <span className="text-pink-400">♥</span> Team Love
          </span>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-[5px] w-10 h-10 rounded-2xl bg-white/5 border border-pink-500/30 text-white cursor-pointer hover:bg-pink-500/15 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`w-5 h-[2px] bg-white rounded-full transition-all duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-[7px] bg-pink-400" : ""
            }`}
          />
          <span
            className={`w-5 h-[2px] bg-white rounded-full transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-5 h-[2px] bg-white rounded-full transition-all duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-[7px] bg-pink-400" : ""
            }`}
          />
        </button>

        {/* Navigation Items */}
        <div
          className={`flex flex-col md:flex-row md:items-center gap-1.5 absolute md:static top-16 left-0 right-0 bg-slate-950/95 md:bg-transparent px-6 md:px-0 py-6 md:py-0 border-b md:border-none border-pink-500/20 transition-all duration-300 ${
            isMobileMenuOpen ? "flex shadow-2xl backdrop-blur-2xl" : "hidden md:flex"
          }`}
        >
          {/* 1. HOME */}
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`${menuLinkClass} ${pathname === "/" ? "text-pink-400 bg-pink-500/15 border border-pink-500/30" : ""}`}
          >
            <i className="bx bx-home text-base"></i> Home
          </Link>

          {/* 2. ABOUT DROPDOWN */}
          <div
            className="relative"
            onMouseEnter={() => !isMobileMenuOpen && setActiveDropdown("about")}
            onMouseLeave={() => !isMobileMenuOpen && setActiveDropdown(null)}
          >
            <button
              onClick={() =>
                setActiveDropdown(activeDropdown === "about" ? null : "about")
              }
              className={`${menuLinkClass} ${
                pathname?.startsWith("/about") ? "text-pink-400 bg-pink-500/15 border border-pink-500/30" : ""
              } w-full justify-between md:justify-start`}
            >
              <div className="flex items-center gap-1.5">
                <i className="bx bx-user text-base"></i>
                <span>About</span>
              </div>
              <i
                className={`bx bx-chevron-down text-sm transition-transform duration-200 ${
                  activeDropdown === "about" ? "rotate-180 text-pink-400" : ""
                }`}
              />
            </button>

            {activeDropdown === "about" && (
              <div className="md:absolute md:top-full md:left-0 bg-slate-950/95 backdrop-blur-2xl border-2 border-pink-500/20 md:rounded-2xl md:shadow-2xl md:shadow-pink-950/50 p-2 md:min-w-[220px] space-y-1 mt-1 md:mt-2 animate-in fade-in zoom-in-95 duration-200">
                <Link
                  href="/about-lana"
                  onClick={() => {
                    setActiveDropdown(null);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`${dropdownItemClass} ${pathname === "/about-lana" ? "bg-pink-500/20 text-pink-300" : ""}`}
                >
                  <div className="w-8 h-8 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 flex-shrink-0">
                    <i className="bx bx-id-card text-base"></i>
                  </div>
                  <div>
                    <div className="font-bold">Profil Lana</div>
                    <div className="text-[0.7rem] text-slate-400 font-normal">Biodata, Jiko & Trivia</div>
                  </div>
                </Link>
                <Link
                  href="/about-luna"
                  onClick={() => {
                    setActiveDropdown(null);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`${dropdownItemClass} ${pathname === "/about-luna" ? "bg-pink-500/20 text-pink-300" : ""}`}
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                    <i className="bx bx-star text-base"></i>
                  </div>
                  <div>
                    <div className="font-bold">Fansite Luna</div>
                    <div className="text-[0.7rem] text-slate-400 font-normal">Tim & Visi Fansite</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* 3. AKTIVITAS & SHOW DROPDOWN */}
          <div
            className="relative"
            onMouseEnter={() => !isMobileMenuOpen && setActiveDropdown("activity")}
            onMouseLeave={() => !isMobileMenuOpen && setActiveDropdown(null)}
          >
            <button
              onClick={() =>
                setActiveDropdown(activeDropdown === "activity" ? null : "activity")
              }
              className={`${menuLinkClass} ${
                pathname === "/show-theater" || pathname === "/live" || pathname === "/birthday"
                  ? "text-pink-400 bg-pink-500/15 border border-pink-500/30"
                  : ""
              } w-full justify-between md:justify-start`}
            >
              <div className="flex items-center gap-1.5">
                <i className="bx bx-calendar-event text-base"></i>
                <span>Aktivitas</span>
                {isLive && (
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse ml-0.5"></span>
                )}
              </div>
              <i
                className={`bx bx-chevron-down text-sm transition-transform duration-200 ${
                  activeDropdown === "activity" ? "rotate-180 text-pink-400" : ""
                }`}
              />
            </button>

            {activeDropdown === "activity" && (
              <div className="md:absolute md:top-full md:left-0 bg-slate-950/95 backdrop-blur-2xl border-2 border-pink-500/20 md:rounded-2xl md:shadow-2xl md:shadow-pink-950/50 p-2 md:min-w-[230px] space-y-1 mt-1 md:mt-2 animate-in fade-in zoom-in-95 duration-200">
                <Link
                  href="/show-theater"
                  onClick={() => {
                    setActiveDropdown(null);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`${dropdownItemClass} ${pathname === "/show-theater" ? "bg-pink-500/20 text-pink-300" : ""}`}
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                    <i className="bx bx-calendar-star text-base"></i>
                  </div>
                  <div>
                    <div className="font-bold">Show Theater</div>
                    <div className="text-[0.7rem] text-slate-400 font-normal">Jadwal Pertunjukan</div>
                  </div>
                </Link>

                <Link
                  href="/live"
                  onClick={() => {
                    setActiveDropdown(null);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`${dropdownItemClass} ${pathname === "/live" ? "bg-pink-500/20 text-pink-300" : ""}`}
                >
                  <div className="w-8 h-8 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0">
                    <i className="bx bx-broadcast text-base"></i>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold flex items-center justify-between">
                      <span>Status Live</span>
                      {isLive && (
                        <span className="bg-red-500 text-white text-[0.6rem] font-black px-1.5 py-0.2 rounded uppercase">
                          ON
                        </span>
                      )}
                    </div>
                    <div className="text-[0.7rem] text-slate-400 font-normal">Showroom & IDN Live</div>
                  </div>
                </Link>

                <Link
                  href="/birthday"
                  onClick={() => {
                    setActiveDropdown(null);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`${dropdownItemClass} ${pathname === "/birthday" ? "bg-pink-500/20 text-pink-300" : ""}`}
                >
                  <div className="w-8 h-8 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 flex-shrink-0">
                    <i className="bx bx-cake text-base"></i>
                  </div>
                  <div>
                    <div className="font-bold">Birthday Project</div>
                    <div className="text-[0.7rem] text-slate-400 font-normal">Project Ulang Tahun</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* 4. MEDIA & BERITA DROPDOWN */}
          <div
            className="relative"
            onMouseEnter={() => !isMobileMenuOpen && setActiveDropdown("media")}
            onMouseLeave={() => !isMobileMenuOpen && setActiveDropdown(null)}
          >
            <button
              onClick={() =>
                setActiveDropdown(activeDropdown === "media" ? null : "media")
              }
              className={`${menuLinkClass} ${
                pathname === "/gallery" || pathname === "/news" ? "text-pink-400 bg-pink-500/15 border border-pink-500/30" : ""
              } w-full justify-between md:justify-start`}
            >
              <div className="flex items-center gap-1.5">
                <i className="bx bx-folder text-base"></i>
                <span>Media</span>
              </div>
              <i
                className={`bx bx-chevron-down text-sm transition-transform duration-200 ${
                  activeDropdown === "media" ? "rotate-180 text-pink-400" : ""
                }`}
              />
            </button>

            {activeDropdown === "media" && (
              <div className="md:absolute md:top-full md:left-0 bg-slate-950/95 backdrop-blur-2xl border-2 border-pink-500/20 md:rounded-2xl md:shadow-2xl md:shadow-pink-950/50 p-2 md:min-w-[220px] space-y-1 mt-1 md:mt-2 animate-in fade-in zoom-in-95 duration-200">
                <Link
                  href="/gallery"
                  onClick={() => {
                    setActiveDropdown(null);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`${dropdownItemClass} ${pathname === "/gallery" ? "bg-pink-500/20 text-pink-300" : ""}`}
                >
                  <div className="w-8 h-8 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 flex-shrink-0">
                    <i className="bx bx-images text-base"></i>
                  </div>
                  <div>
                    <div className="font-bold">Galeri Foto</div>
                    <div className="text-[0.7rem] text-slate-400 font-normal">Koleksi Foto Lana</div>
                  </div>
                </Link>

                <Link
                  href="/news"
                  onClick={() => {
                    setActiveDropdown(null);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`${dropdownItemClass} ${pathname === "/news" ? "bg-pink-500/20 text-pink-300" : ""}`}
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <i className="bx bx-news text-base"></i>
                  </div>
                  <div>
                    <div className="font-bold">News & Updates</div>
                    <div className="text-[0.7rem] text-slate-400 font-normal">Berita & Rilis Resmi</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* 5. THEME TOGGLE BUTTON */}
          <button
            className="flex items-center gap-1.5 bg-slate-900/80 hover:bg-pink-500/15 text-slate-200 hover:text-pink-300 border border-pink-500/30 px-3.5 py-2 rounded-xl cursor-pointer text-[0.82rem] font-bold transition-all duration-200 w-fit mt-2 md:mt-0 md:ml-2"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <>
                <i className="bx bx-sun text-base text-amber-400" /> Light
              </>
            ) : (
              <>
                <i className="bx bx-moon text-base text-pink-400" /> Dark
              </>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
