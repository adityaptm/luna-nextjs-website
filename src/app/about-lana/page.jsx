import Link from "next/link";
import Script from "next/script";

export default function AboutLana() {
  // GANTI pakai ID video YouTube Lana
  const VIDEO_ID = "R3HPWXgIwks";

  return (
    <div className="w-full">
      <div className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Biodata Aurhel Alana Tirta</h1>
        <p className="text-slate-600 dark:text-slate-300 text-lg">Profil lengkap dan perjalanan karir Lana di JKT48.</p>
      </div>

      {/* ===========================
          PROFILE CARD
          =========================== */}
      <section className="flex flex-col lg:flex-row gap-0 rounded-[32px] overflow-hidden mb-16 border-2 border-slate-100 dark:border-slate-700 shadow-2xl bg-white dark:bg-slate-800">
        <div className="flex-1 p-6 md:p-10 bg-transparent">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 mb-2">
            <h1 className="font-display text-[2.2rem] font-bold text-slate-900 dark:text-white">Aurhel Alana Tirta</h1>
            <button className="bg-transparent border-[1.5px] border-theme-border-md text-slate-900 dark:text-white px-4 py-1.5 rounded-full text-[0.78rem] font-bold tracking-[0.08em] cursor-pointer font-body transition-all hover:bg-accent hover:text-b900 hover:border-accent">
              + FOLLOW
            </button>
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
              <button className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white cursor-pointer flex items-center justify-center transition-all hover:bg-accent hover:text-slate-900 hover:border-accent shadow-sm" aria-label="Play">
                <i className="bx bx-play ml-0.5 text-xl"></i>
              </button>
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
              <a href="https://x.com/AR_LanaJKT48" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-theme-border-md bg-theme-soft text-slate-900 dark:text-white flex items-center justify-center transition-all hover:-translate-y-1 hover:border-accent hover:text-accent shadow-sm font-bold" aria-label="X">
                X
              </a>

              <a href="https://www.instagram.com/jkt48.lana.a/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-theme-border-md bg-theme-soft text-slate-900 dark:text-white flex items-center justify-center transition-all hover:-translate-y-1 hover:border-accent hover:text-accent shadow-sm" aria-label="Instagram">
                <i className="bx bxl-instagram text-xl"></i>
              </a>

              <a href="https://www.tiktok.com/@jkt48.lana" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-theme-border-md bg-theme-soft text-slate-900 dark:text-white flex items-center justify-center transition-all hover:-translate-y-1 hover:border-accent hover:text-accent shadow-sm" aria-label="TikTok">
                <i className="bx bxl-tiktok text-xl"></i>
              </a>

              <a href="https://www.youtube.com/@JKT48" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-theme-border-md bg-theme-soft text-slate-900 dark:text-white flex items-center justify-center transition-all hover:-translate-y-1 hover:border-accent hover:text-accent shadow-sm" aria-label="YouTube">
                <i className="bx bxl-youtube text-xl"></i>
              </a>

              <a
                href="https://www.showroom-live.com/r/JKT48_Lana"
                target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-full border border-theme-border-md bg-theme-soft text-slate-900 dark:text-white flex items-center justify-center transition-all hover:-translate-y-1 hover:border-accent hover:text-accent shadow-sm font-bold text-[0.75rem]"
                aria-label="Showroom"
              >
                SR
              </a>
              <a href="https://www.idn.app/jkt48_lana" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-theme-border-md bg-theme-soft text-slate-900 dark:text-white flex items-center justify-center transition-all hover:-translate-y-1 hover:border-accent hover:text-accent shadow-sm font-bold text-[0.75rem]" aria-label="IDN">
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
            <iframe src="https://www.instagram.com/p/DXt_VxAE4Oj/embed" width="100%" height="450" frameBorder="0" scrolling="no" allowTransparency></iframe>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-md overflow-hidden flex flex-col group transition-all w-full flex-1 p-2" dangerouslySetInnerHTML={{ __html: `<blockquote class="twitter-tweet" data-theme="dark"><a href="https://twitter.com/AR_LanaJKT48/status/2048247400700256690"></a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>` }} />

          <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-md overflow-hidden flex flex-col group transition-all w-full flex-1">
            <iframe src="https://www.threads.net/@jkt48.lana.a/post/DW3WfvFGtbe/embed" width="100%" height="450" frameBorder="0" scrolling="no" allowTransparency></iframe>
          </div>

          {/* IDN Embed Player Section */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-100 dark:border-slate-700 shadow-lg overflow-hidden flex flex-col">
            <div className="bg-slate-50 dark:bg-slate-900 p-5 flex items-center justify-between border-b-2 border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3 font-bold text-slate-950 dark:text-white">
                <span className="bg-red-600 text-white px-2.5 py-1 rounded-lg text-xs uppercase tracking-tighter shadow-sm font-black">LIVE</span> 
                <span className="flex items-center gap-2">
                  <i className="bx bx-play-circle text-red-500 text-xl"></i> IDN Live Embed
                </span>
              </div>
              <a href="https://www.idn.app/jkt48_lana" target="_blank" rel="noreferrer" className="text-xs text-accent font-black hover:underline flex items-center gap-1 uppercase tracking-wider">
                Buka di IDN <i className="bx bx-link-external"></i>
              </a>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src="https://www.idn.app/embed-player/haiiii-260426221201"
                title="Lana IDN Live"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
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
              <div className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">2023</div>
              <div className="text-[0.9rem] text-slate-500 dark:text-slate-400 font-medium">First Lana&apos;s Kabesha</div>
              <div className="text-[0.8rem] text-b500 font-semibold mt-1 bg-theme-soft inline-block px-3 py-1 rounded-full">As a Trainee Member</div>
            </figcaption>
          </figure>

          <figure className="bg-theme-card p-4 pb-6 rounded-2xl border border-theme-border shadow-sm transform transition-transform hover:-translate-y-2 hover:shadow-md mx-auto w-full">
            <div className="aspect-[3/4] w-full rounded-xl overflow-hidden mb-5 bg-theme-soft">
              <img src="/images/kabesha2.webp" alt="Lana Kabesha 2025" className="w-full h-full object-cover" />
            </div>
            <figcaption className="text-center">
              <div className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">2025</div>
              <div className="text-[0.9rem] text-slate-500 dark:text-slate-400 font-medium">Lana&apos;s Kabesha</div>
              <div className="text-[0.8rem] text-b500 font-semibold mt-1 bg-theme-soft inline-block px-3 py-1 rounded-full">As a Regular Member</div>
            </figcaption>
          </figure>

          <figure className="bg-theme-card p-4 pb-6 rounded-2xl border border-theme-border shadow-sm transform transition-transform hover:-translate-y-2 hover:shadow-md hover:-rotate-1 mx-auto w-full">
            <div className="aspect-[3/4] w-full rounded-xl overflow-hidden mb-5 bg-theme-soft">
              <img src="/images/kabesha3.webp" alt="Lana Kabesha 2026" className="w-full h-full object-cover" />
            </div>
            <figcaption className="text-center">
              <div className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">2026</div>
              <div className="text-[0.9rem] text-slate-500 dark:text-slate-400 font-medium">Lana&apos;s Kabesha</div>
              <div className="text-[0.8rem] text-b500 font-semibold mt-1 bg-theme-soft inline-block px-3 py-1 rounded-full">As a Regular Member</div>
            </figcaption>
          </figure>

          <figure className="bg-theme-card p-4 pb-6 rounded-2xl border border-theme-border shadow-sm transform transition-transform hover:-translate-y-2 hover:shadow-md hover:rotate-2 mx-auto w-full">
            <div className="aspect-[3/4] w-full rounded-xl overflow-hidden mb-5 bg-theme-soft">
              <img src="/images/aurhel.webp" alt="Lana Love Team" className="w-full h-full object-cover" />
            </div>
            <figcaption className="text-center">
              <div className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-1">2026</div>
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
  );
}
