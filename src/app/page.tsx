"use client";

import { useEffect, useState } from "react";
import ShowTheaterLanaPage from "./show-theater/page";
import GameLanaPage from "./game/page";
import MessageBoard from "@/components/MessageBoard";

function AnimatedNumber({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1400;
    const step = value / (duration / 16);

    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
}

export default function AboutLanaPage() {
  const [activeTab, setActiveTab] = useState("tentang");
  const [openQ, setOpenQ] = useState<number | null>(null);
  const [openSetlist, setOpenSetlist] = useState<number | null>(null);

  const tabs = [
    { key: "tentang", label: "Tentang Lana" },
    { key: "rekap", label: "Rekap Show Lana" },
    { key: "theater", label: "Show Theater Lana" },
    { key: "game", label: "Game Lana" },
    { key: "pesan", label: "Pesan" },
    { key: "hashtag", label: "Hashtag" },
    { key: "qa", label: "Pertanyaan Seputar Lana" },
  ];

  return (
    <div className="w-full">
      {/* HERO */}
      <section className="bg-slate-900 text-white py-12 md:py-20 px-4 md:px-10 text-center rounded-3xl mb-16 relative overflow-hidden shadow-lg border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(1.5px_1.5px_at_15%_20%,rgba(255,255,255,0.7),transparent),radial-gradient(1px_1px_at_35%_60%,rgba(255,255,255,0.5),transparent),radial-gradient(2px_2px_at_55%_15%,rgba(255,255,255,0.6),transparent)] animate-starsFloat opacity-40"></div>
        <div className="relative z-10">
          <h1 className="font-display text-4xl md:text-[3.8rem] font-black mb-4 tracking-tight leading-tight">Aurhel Alana</h1>
          <p className="text-[1.3rem] mb-[18px] opacity-90 font-light flex items-center justify-center gap-2">
            <i className="bx bx-info-circle text-accent"></i> Halaman informasi dan aktivitas Lana.
          </p>
        </div>
      </section>

      {/* TABS */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`px-5 py-2.5 rounded-full text-[0.9rem] font-bold transition-all duration-200 border ${
              activeTab === tab.key
                ? "bg-accent text-b900 border-accent shadow-md transform -translate-y-0.5"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-theme-border hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-[960px] mx-auto">
        {/* ================= TENTANG ================= */}
        {activeTab === "tentang" && (
          <section className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-[32px] shadow-lg p-10 md:p-12 transition-all">
            <h1 className="font-display text-4xl font-bold text-slate-950 dark:text-white mb-8 border-b-2 border-slate-100 dark:border-slate-700 pb-4">
              <i className="bx bx-user-circle text-accent"></i> Tentang Lana
            </h1>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-6">Tentang Aurhel Alana</h2>

            <div className="space-y-6">
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-[1.05rem] font-medium">
                Aurhel Alana merupakan salah satu member JKT48 Generasi ke-12 yang
                memiliki aura lembut dan pembawaan yang tenang namun penuh pesona.
                Lahir pada 14 September 2006 di Bekasi, ia memiliki zodiak Virgo dengan tinggi sekitar 162 cm.
              </p>

              <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-[1.05rem] font-medium">
                Lana pertama kali diperkenalkan sebagai trainee pada event
                Jak-Japan Matsuri 2023 tanggal 18 November 2023. Ia kemudian
                melakukan debut theater pertamanya pada setlist
                <strong className="text-accent font-bold mx-1">Ingin Bertemu</strong>
                tanggal 1 Maret 2024.
              </p>

              <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-[1.05rem] font-medium">
                Dengan kesukaan terhadap strawberry dan warna pink, Lana dikenal
                sebagai pribadi yang hangat serta memiliki ketertarikan di bidang
                public speaking. Ia mampu beradaptasi dengan cepat dan membuat
                suasana di sekitarnya terasa nyaman serta penuh cerita.
              </p>
            </div>
          </section>
        )}

        {/* ================= REKAP ================= */}
        {activeTab === "rekap" && (
          <section className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[32px] shadow-xl p-10 md:p-12 transition-all">
            <h1 className="font-display text-4xl font-bold text-slate-950 dark:text-white mb-8 border-b-2 border-slate-100 dark:border-slate-700 pb-4">
              <i className="bx bx-list-check text-accent"></i> Rekap Perjalanan
            </h1>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-6">Momen Penting Lana</h2>
            <div className="space-y-6 mb-12">
              {[
                { date: "14 Sep 2006", event: "Lahir di Bekasi, Indonesia", icon: "bx bxs-cake" },
                { date: "18 Nov 2023", event: "Diperkenalkan sebagai Trainee JKT48 (Jak-Japan Matsuri)", icon: "bx bxs-megaphone" },
                { date: "01 Mar 2024", event: "Debut Theater (Setlist Ingin Bertemu)", icon: "bx bxs-buildings" }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-5 items-start bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-accent transition-all">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 border-2 border-accent/20 flex items-center justify-center text-accent text-2xl flex-shrink-0">
                    <i className={item.icon}></i>
                  </div>
                  <div>
                    <p className="text-accent font-black text-xs uppercase tracking-widest mb-1">{item.date}</p>
                    <p className="text-slate-950 dark:text-white font-bold text-[1.1rem] leading-tight">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-[32px] p-8 text-center shadow-md hover:shadow-xl transition-all relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[4px] bg-accent opacity-0 transition-opacity group-hover:opacity-100"></div>
                <div className="w-16 h-16 mx-auto mb-6 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl flex items-center justify-center text-3xl text-accent shadow-sm">
                  <i className="bx bx-list-ul" />
                </div>
                <h2 className="text-3xl font-black text-slate-950 dark:text-white mb-1">
                  <AnimatedNumber value={7} />
                </h2>
                <p className="text-[0.8rem] font-black text-slate-700 dark:text-slate-400 tracking-widest uppercase">SETLISTS</p>
              </div>

              <div className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-[32px] p-8 text-center shadow-md hover:shadow-xl transition-all relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[4px] bg-accent opacity-0 transition-opacity group-hover:opacity-100"></div>
                <div className="w-16 h-16 mx-auto mb-6 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl flex items-center justify-center text-3xl text-accent shadow-sm">
                  <i className="bx bx-music" />
                </div>
                <h2 className="text-3xl font-black text-slate-950 dark:text-white mb-1">
                  <AnimatedNumber value={13} />
                </h2>
                <p className="text-[0.8rem] font-black text-slate-700 dark:text-slate-400 tracking-widest uppercase">UNIT SONGS</p>
              </div>

              <div className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-[32px] p-8 text-center shadow-md hover:shadow-xl transition-all relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[4px] bg-accent opacity-0 transition-opacity group-hover:opacity-100"></div>
                <div className="w-16 h-16 mx-auto mb-6 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl flex items-center justify-center text-3xl text-accent shadow-sm">
                  <i className="bx bx-calendar-star" />
                </div>
                <h2 className="text-3xl font-black text-slate-950 dark:text-white mb-1">
                  <AnimatedNumber value={74} />
                </h2>
                <p className="text-[0.8rem] font-black text-slate-700 dark:text-slate-400 tracking-widest uppercase">TOTAL SHOWS</p>
              </div>
            </div>

            <div className="bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-5 md:p-8 shadow-sm max-w-[800px] mx-auto">
              <h3 className="font-display text-2xl font-bold text-slate-950 dark:text-white mb-2 flex items-center gap-3">
                <i className="bx bx-library text-accent text-3xl"></i> Detail Unit Song Per Setlist
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-8 text-[0.95rem] font-medium">Daftar unit song yang pernah dibawakan oleh Lana.</p>
              
              <div className="flex flex-col gap-4">
                {[
                  { setlist: "Aitakatta", songs: ["Nageki no Figure", "Namida no Shounan", "Nagisa no Cherry", "Koi no Plan", "Senaka Kara Dakishimete"] },
                  { setlist: "Pajama Drive", songs: ["Pajama Drive", "Kagami no Naka no Jean Da Arc"] },
                  { setlist: "Ramune no Nomikata", songs: ["Manazashi Sayonara", "Nice to Meet You"] },
                  { setlist: "Te wo Tsunaginagara", songs: ["Kono Mune no Barcode"] },
                  { setlist: "Renai Kinshi Jourei", songs: ["Manatsu no Christmas Rose"] },
                  { setlist: "Pertaruhan Cinta", songs: ["Dai Dai Dai"] },
                  { setlist: "Itadaki Love", songs: ["Hatsukoi Dorobou"] }
                ].map((item, i) => {
                  const isOpen = openSetlist === i;
                  return (
                    <div key={i} className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? "border-accent shadow-md scale-[1.01]" : "border-slate-200 dark:border-slate-700 hover:border-accent/50"}`}>
                      <button 
                        onClick={() => setOpenSetlist(isOpen ? null : i)}
                        className={`w-full flex items-center justify-between px-6 py-5 transition-all text-left ${isOpen ? "bg-accent/15" : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? "bg-accent text-slate-900" : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"}`}>
                            <i className={`bx bx-chevron-right text-xl transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}></i>
                          </div>
                          <span className={`text-[1.1rem] font-bold ${isOpen ? "text-slate-900 dark:text-white" : "text-slate-800 dark:text-slate-100"}`}>{item.setlist}</span>
                        </div>
                        <span className="text-[0.75rem] font-black px-3 py-1 bg-accent text-slate-900 rounded-lg uppercase tracking-wider">
                          {item.songs.length} Unit
                        </span>
                      </button>
                      
                      {isOpen && (
                        <div className="p-5 md:p-6 bg-white dark:bg-slate-900 border-t-2 border-slate-200 dark:border-slate-700">
                          <div className="flex flex-wrap gap-3">
                            {item.songs.map((song, si) => (
                              <div key={si} className="flex items-center gap-2 px-5 py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:border-accent transition-all cursor-default">
                                <div className="w-2 h-2 rounded-full bg-accent"></div>
                                <span className="text-[0.95rem] font-bold">{song}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ================= SHOW THEATER ================= */}
        {activeTab === "theater" && (
          <section className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[32px] shadow-xl p-10 md:p-12 transition-all">
            <h1 className="font-display text-4xl font-bold text-slate-950 dark:text-white mb-8 border-b-2 border-slate-100 dark:border-slate-700 pb-4">
              <i className="bx bx-calendar-star text-accent"></i> Jadwal Theater
            </h1>
            <ShowTheaterLanaPage />
          </section>
        )}

        {/* ================= GAME LANA ================= */}
        {activeTab === "game" && (
          <section className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[32px] shadow-xl p-10 md:p-12 transition-all">
            <GameLanaPage />
          </section>
        )}

        {/* ================= PESAN LANA ================= */}
        {activeTab === "pesan" && (
          <section className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[32px] shadow-xl p-10 md:p-12 transition-all">
            <MessageBoard />
          </section>
        )}

        {/* ================= HASHTAG ================= */}
        {activeTab === "hashtag" && (
          <section className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[32px] shadow-xl p-10 md:p-12 transition-all">
            <h1 className="font-display text-4xl font-bold text-slate-950 dark:text-white mb-8 border-b-2 border-slate-100 dark:border-slate-700 pb-4">
              <i className="bx bx-hash text-accent"></i> Hashtag Support
            </h1>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-2">Official Hashtag Lana</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-8 text-[1rem] font-medium italic">Gunakan hashtag ini untuk mendukung Lana di media sosial!</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { tag: "#VoyageOfLana", desc: "Dukungan Umum", icon: "bx bx-rocket" },
                { tag: "#LaNaight", desc: "Ucapan Selamat Malam", icon: "bx bx-moon" },
                { tag: "#PremierJourLana", desc: "Dukungan Show Setlist Pertama", icon: "bx bx-star" },
                { tag: "#ObroLana", desc: "Pengalaman Meeting/VC/M&G", icon: "bx bx-chat" },
                { tag: "#SAurhel", desc: "Postingan Sahur", icon: "bx bx-sun" },
                { tag: "#TakjiLANAgih", desc: "Postingan Buka Puasa", icon: "bx bx-restaurant" },
                { tag: "#AurheLive", desc: "Pengalaman Nonton Live SR/IDN", icon: "bx bx-broadcast" },
                { tag: "#AurheView", desc: "Review Penampilan Theater", icon: "bx bx-show" },
                { tag: "#LanAffirmation", desc: "Dukungan Oshi / Balas PM", icon: "bx bx-heart" },
                { tag: "#CeritaLana", desc: "Balas PM", icon: "bx bx-book-open" },
                { tag: "#RaBulana", desc: "Upload Foto Hari Rabu", icon: "bx bx-image" },
                { tag: "#RHenaiKinshiJourei", desc: "Request Hour 2026", icon: "bx bx-music" },
                { tag: "#JKT48RequestAURhel2026", desc: "Request Hour 2026", icon: "bx bx-trophy" },
                { tag: "#JKT48RequestHour2026", desc: "Request Hour 2026", icon: "bx bx-medal" }
              ].map((item) => (
                <div key={item.tag} className="flex flex-col p-6 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl hover:border-accent hover:scale-[1.03] transition-all group cursor-default shadow-sm">
                  <span className="text-slate-950 dark:text-white font-black text-[1.15rem] mb-1.5 flex items-center gap-3">
                    <i className={`${item.icon} text-accent text-xl`}></i> {item.tag}
                  </span>
                  <span className="text-slate-800 dark:text-slate-300 text-[0.95rem] font-bold">
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= Q&A ================= */}
        {activeTab === "qa" && (
          <section className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8 md:p-10">
            <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-200 dark:border-slate-700 pb-4">Tanya Jawab</h1>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-6">Pertanyaan Seputar Lana</h2>
            <div className="flex flex-col gap-4">
              {[
                {
                  q: "Kapan Lana debut pertama kali?",
                  a: "Lana debut sebagai trainee pada 18 November 2023 dan debut theater pada 1 Maret 2024.",
                },
                {
                  q: "Apa zodiak Lana?",
                  a: "Lana memiliki zodiak Virgo.",
                },
                {
                  q: "Apa kesukaan Lana?",
                  a: "Lana menyukai strawberry, warna pink, dan public speaking.",
                },
              ].map((item, i) => (
                <div key={i} className="border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                  <button
                    className="w-full flex justify-between items-center px-6 py-5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-left font-bold text-[1rem] text-slate-950 dark:text-white"
                    onClick={() => setOpenQ(openQ === i ? null : i)}
                  >
                    <span className="flex items-center gap-3">
                      <i className="bx bx-help-circle text-accent text-xl"></i> {item.q}
                    </span>
                    <i className={`bx ${openQ === i ? 'bx-chevron-up' : 'bx-chevron-down'} text-xl text-slate-400`}></i>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openQ === i ? "max-h-40 border-t border-theme-border" : "max-h-0"}`}>
                    <div className="p-5 text-[0.9rem] text-slate-600 dark:text-slate-400 bg-theme-card">
                      {item.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
