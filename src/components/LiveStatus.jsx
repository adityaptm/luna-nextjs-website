"use client";

export default function LiveStatus({ data = null, loading = false } = {}) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-100 dark:border-slate-700 shadow-lg overflow-hidden p-10 flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-700 border-t-accent rounded-full animate-spin" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Mengecek status live Lana...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border-2 border-slate-700 overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/3 relative bg-slate-800/50 flex items-center justify-center min-h-[180px]">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-slate-700/50 border-2 border-slate-600 flex items-center justify-center mx-auto mb-3">
              <i className="bx bx-moon text-4xl text-slate-400"></i>
            </div>
            <span className="bg-slate-600 text-slate-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">OFFLINE</span>
          </div>
        </div>
        <div className="flex-1 p-8 flex flex-col justify-center">
          <h3 className="text-2xl font-black text-white mb-2">Lana Sedang Offline</h3>
          <p className="text-slate-400 text-sm mb-6">Lana belum live saat ini. Pantau terus ya — halaman ini otomatis update setiap 1 menit!</p>
          <div className="flex flex-wrap gap-3">
            <a href="https://www.showroom-live.com/r/JKT48_Lana" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 px-4 py-2.5 rounded-xl font-bold text-sm transition-all">
              <i className="bx bxs-star text-blue-400"></i> Showroom Lana
            </a>
            <a href="https://www.idn.app/jkt48_lana" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 px-4 py-2.5 rounded-xl font-bold text-sm transition-all">
              <i className="bx bxs-video text-red-400"></i> IDN Live Lana
            </a>
          </div>
        </div>
      </div>
    );
  }

  const isIDN = data.type?.toLowerCase() === "idn" || data.type?.toLowerCase() === "idn_live";
  
  // Robust URL detection
  let liveUrl = "";
  if (data.url && data.url.startsWith("http")) {
    liveUrl = data.url;
  } else if (data.live_url && data.live_url.startsWith("http")) {
    liveUrl = data.live_url;
  } else if (data.link && data.link.startsWith("http")) {
    liveUrl = data.link;
  } else if (isIDN) {
    // IDN Live format: https://www.idn.app/[user_slug]/live/[live_slug]
    const userSlug = data.user?.username || data.username || data.creator?.username || data.creator?.slug || "jkt48_lana";
    const liveSlug = data.slug || data.url_key;
    
    if (liveSlug && liveSlug.startsWith("http")) {
      liveUrl = liveSlug;
    } else if (liveSlug) {
      liveUrl = `https://www.idn.app/${userSlug}/live/${liveSlug}`;
    } else {
      liveUrl = `https://www.idn.app/${userSlug}`;
    }
  } else {
    // Showroom fallback
    const srKey = data.url_key || data.room_url_key || "JKT48_Lana";
    liveUrl = srKey.startsWith("http") ? srKey : `https://www.showroom-live.com/r/${srKey}`;
  }

  // Final validation to ensure it's absolute
  if (liveUrl && !liveUrl.startsWith("http")) {
    liveUrl = `https://${liveUrl}`;
  }

  // Debug log (can be seen in browser console)
  console.log("LANA LIVE DEBUG:", { type: data.type, liveUrl, data });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-2xl">
      <div className="md:w-1/3 relative aspect-video md:aspect-auto">
        <img 
          src={data.img || data.img_alt || data.image || "https://img.jkt48connect.com/jkt48/members/api/v1/storages/media/jkt48-member/jkt48logo.jpg"} 
          alt={`Live Stream: ${data.name || "Lana"}`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black animate-pulse shadow-lg">LIVE</span>
        </div>
        {isIDN && (
          <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-lg text-[0.65rem] font-bold text-slate-900 dark:text-white flex items-center gap-1.5 shadow-sm">
            <i className="bx bxs-video text-red-500"></i> IDN LIVE
          </div>
        )}
        {!isIDN && (
          <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-lg text-[0.65rem] font-bold text-slate-900 dark:text-white flex items-center gap-1.5 shadow-sm">
            <i className="bx bxs-star text-blue-500"></i> SHOWROOM
          </div>
        )}
      </div>
      
      <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-accent text-xs font-black uppercase tracking-widest">{data.type} STREAMING</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span className="text-slate-500 text-xs font-medium">Started {new Date(data.started_at).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} WIB</span>
          </div>
          <h3 className="text-2xl font-black text-slate-950 dark:text-white mb-4 leading-tight">
            {data.slug?.replace(/-/g, ' ').replace(/\d+$/, '') || data.name || "Lana is Live!"}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-6">
            Yuk tonton live Lana sekarang! Jangan lupa kasih gift dan dukung Lana ya.
          </p>
        </div>
        
        <a 
          href={liveUrl} 
          target="_blank" 
          rel="noreferrer" 
          className="inline-flex items-center justify-center gap-2 w-full md:w-fit bg-accent text-slate-900 px-8 py-3.5 rounded-2xl font-black text-[0.9rem] transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-accent/25 active:scale-95"
        >
          <i className={`bx ${isIDN ? 'bx-play-circle' : 'bx-broadcast'} text-xl`}></i>
          TONTON SEKARANG
        </a>
      </div>
    </div>
  );
}
