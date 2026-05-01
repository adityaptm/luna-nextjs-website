import React, { ReactNode } from "react";
import Link from "next/link";

// --- 1. Definisi Interface untuk TypeScript (Mencegah Error) ---
interface InfoBoxProps {
  label: string;
  value: string;
}

interface SocialBtnProps {
  href: string;
  label: string;
  icon?: ReactNode;
  textIcon?: string;
}

interface KabeshaCardProps {
  year: string;
  sub: string;
  badge: string;
  img: string;
  wide?: boolean;
}

// --- 2. Komponen Utama Halaman ---
export default function AboutLana() {
  return (
    <div className="mx-auto flex max-w-[600px] flex-col gap-3 p-4 font-sans text-slate-900 dark:text-white selection:bg-b200/50">
      <div className="mb-6">
        <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white mb-2">News & Updates</h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm tracking-wide">Informasi terbaru seputar aktivitas Aurhel Alana Tirta.</p>
      </div>
      
      {/* HERO CARD */}
      <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-b900 via-b800 to-b600 p-7 pb-0 text-white shadow-xl shadow-b900/20 border border-b100/10">
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-b400/20 blur-2xl" />
        <div className="absolute -left-12 bottom-16 h-36 w-36 rounded-full bg-b100/10 blur-xl" />

        <div className="relative z-10 flex gap-5">
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border-[3px] border-white/30 bg-b600 shadow-inner">
            <img src="/images/lana1.webp" alt="Aurhel Alana Tirta" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 pt-1">
            <h1 className="text-3xl font-bold leading-[1.1] font-display">
              Aurhel <br /> Alana
            </h1>
            <p className="mt-1.5 text-[11px] uppercase tracking-[2.5px] text-b100 font-medium">
              Lana · JKT48
            </p>
            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-b300" />
              Team Love
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-5 rounded-r-2xl border-l-4 border-accent bg-white/10 p-5 backdrop-blur-md">
          <p className="text-[14px] italic leading-relaxed text-b50 text-pretty font-medium flex items-center gap-2">
            <i className="bx bx-moon text-accent"></i> Dengan kekuatan bulan, aku akan menyihirmu dengan
          </p>
          <p className="mt-2 font-display text-xl font-black tracking-wide">Pesonaku! <i className="bx bx-sparkles text-accent"></i></p>
        </div>

        <div className="relative z-10 mt-4 flex gap-2 py-4">
          {[1, 2, 3].map((num) => (
            <div key={num} className="aspect-square flex-1 overflow-hidden rounded-xl border-2 border-white/20 bg-white/10 transition-transform active:scale-95">
              <img src={`/images/lana${num}.webp`} alt={`Lana ${num}`} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* PROFIL */}
      <section className="rounded-[24px] border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg">
        <SectionLabel label="Profil Lana" />
        <div className="grid grid-cols-2 gap-3">
          <InfoBox label="Nama Asli" value="Aurhel Alana Tirta" />
          <InfoBox label="Panggilan" value="Lana" />
          <InfoBox label="Tanggal Lahir" value="14 Sep 2006" />
          <InfoBox label="Zodiak" value="Virgo" />
          <InfoBox label="Gol. Darah" value="O" />
          <InfoBox label="Tinggi" value="162 cm" />
          <div className="col-span-2 rounded-2xl bg-slate-50 dark:bg-slate-800 p-4 border-2 border-slate-100 dark:border-slate-700 shadow-sm">
            <p className="text-[11px] tracking-widest text-accent uppercase mb-1 font-black">Kota Asal</p>
            <p className="text-[1.1rem] font-black text-slate-950 dark:text-white">Bekasi, Indonesia</p>
          </div>
        </div>
      </section>

      {/* SOCIAL MEDIA */}
      <section className="rounded-[20px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 shadow-sm">
        <SectionLabel label="Social Media" />
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-3">
          <SocialBtn href="https://x.com/AR_LanaJKT48" label="X" icon={<span className="font-bold text-lg">X</span>} />
          <SocialBtn href="https://www.instagram.com/jkt48.lana.a/" label="Instagram" icon={<i className="bx bxl-instagram text-lg"></i>} />
          <SocialBtn href="https://www.tiktok.com/@jkt48.lana" label="TikTok" icon={<i className="bx bxl-tiktok text-lg"></i>} />
          <SocialBtn href="https://www.showroom-live.com/r/JKT48_Lana" label="Showroom" textIcon="SR" />
          <SocialBtn href="https://www.idn.app/jkt48_lana" label="IDN Live" textIcon="IDN" />
          <SocialBtn href="https://www.youtube.com/@JKT48" label="YouTube" icon={<i className="bx bxl-youtube text-lg"></i>} />
        </div>
      </section>

      {/* VIDEO DEBUT */}
      <section className="rounded-[20px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 shadow-sm">
        <SectionLabel label="Video Debut" />
        <div className="aspect-video overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 relative">
          <iframe
            src="https://www.youtube.com/embed/R3HPWXgIwks"
            className="absolute top-0 left-0 w-full h-full border-none"
            title="Lana Debut Video"
            allowFullScreen
          />
        </div>
      </section>

      {/* KABESHA */}
      <section className="rounded-[20px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 shadow-sm">
        <SectionLabel label="Kabesha" />
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <KabeshaCard year="2023" sub="First Kabesha" badge="Trainee" img="/images/kabesha1.webp" />
          <KabeshaCard year="2025" sub="Member Kabesha" badge="Regular" img="/images/kabesha2.webp" />
          <div className="sm:col-span-2">
            <KabeshaCard year="2026" sub="Latest Kabesha" badge="Regular" img="/images/kabesha3.webp" wide />
          </div>
        </div>
        <Link href="/gallery" className="flex w-full items-center justify-center rounded-xl border-[1.5px] border-b600 py-3 text-[0.9rem] font-semibold text-b600 transition-all hover:bg-b50 active:scale-[0.98]">
          Lihat Gallery <i className="bx bx-right-arrow-alt text-xl ml-1"></i>
        </Link>
      </section>
    </div>
  );
}

// --- 3. Sub-components (Diletakkan di luar komponen utama agar rapi) ---

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[3px] text-b600 after:h-[1px] after:flex-1 after:bg-theme-border">
      {label}
    </div>
  );
}

function InfoBox({ label, value }: InfoBoxProps) {
  return (
    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4 transition-all hover:bg-slate-100 dark:hover:bg-slate-700 border-2 border-slate-100 dark:border-slate-700 shadow-sm">
      <p className="mb-1 text-[11px] uppercase tracking-widest font-black text-accent">{label}</p>
      <p className="text-[1rem] font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function SocialBtn({ href, label, icon, textIcon }: SocialBtnProps) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="group flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 p-2 transition-all hover:bg-slate-200 dark:hover:bg-slate-700 hover:-translate-y-0.5"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-b600 to-b900 text-[11px] font-bold text-white shadow-md transition-transform group-hover:scale-110 active:scale-90">
        {icon || textIcon}
      </div>
      <span className="text-center text-[10px] font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">{label}</span>
    </a>
  );
}

function KabeshaCard({ year, sub, badge, img, wide }: KabeshaCardProps) {
  return (
    <div className={`overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 ${wide ? 'flex flex-col sm:flex-row' : 'flex flex-col'} group hover:-translate-y-1 transition-transform`}>
      <div className={`${wide ? 'sm:w-1/2' : 'w-full'} aspect-[3/4] ${wide ? 'sm:aspect-video' : ''} overflow-hidden bg-slate-200 dark:bg-slate-700`}>
        <img src={img} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" alt={sub} loading="lazy" />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
        <span className="font-display text-xl font-bold text-slate-900 dark:text-white mb-0.5">{year}</span>
        <span className="text-[11px] leading-tight text-slate-500 dark:text-slate-400 font-medium">{sub}</span>
        <span className="mt-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-0.5 text-[10px] font-bold tracking-wide text-b600 uppercase shadow-sm">
          {badge}
        </span>
      </div>
    </div>
  );
}