"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
  lana: "Aurhel Alana",
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

/* jadwal dari API */
export default function ShowTheaterLanaPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [show, setShow] = useState(null);

  async function loadSchedule() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/show-theater", { 
        cache: "no-store"
      });

      // kalau backend ngirim HTML (error), ini bantu debug biar ga "Unexpected token <"
      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error("Response bukan JSON. Cek API route /api/show-theater");
      }

      // fleksibel: support {success:true, data:...} atau {status:true, theater:[...]}
      if (json?.success === true) {
        const data = json.data;
        if (Array.isArray(data)) {
          setShow(data[0] || null);
        } else {
          setShow(data || null);
        }
        return;
      }

      if (json?.status === true && Array.isArray(json?.theater)) {
        // ambil show terdekat (paling cepat yang masih upcoming)
        const now = Date.now();
        const upcoming = json.theater
          .map((s) => ({ ...s, _t: new Date(s.date).getTime() }))
          .filter((s) => Number.isFinite(s._t))
          .filter((s) => s._t >= now)
          .sort((a, b) => a._t - b._t)[0];

        setShow(upcoming || null);
        if (!upcoming) setError("Tidak ada jadwal upcoming.");
        return;
      }

      // error message
      const msg =
        json?.message ||
        json?.data?.message ||
        json?.error ||
        "Gagal memuat jadwal";
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
    const id = setInterval(loadSchedule, 180000); // 3 menit
    return () => clearInterval(id);
  }, []);

  const computed = useMemo(() => {
    if (!show) return null;

    const { dateStr, timeStr } = formatIdDate(show.date);

    // members dari beberapa kemungkinan field API
    const members = Array.isArray(show.members)
      ? show.members
      : Array.isArray(show.member)
        ? show.member
        : Array.isArray(show.lineup)
          ? show.lineup
          : [];

    return { dateStr, timeStr, members };
  }, [show]);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-theme-border">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-2">Show Theater Lana</h1>
          <p className="text-slate-500 dark:text-slate-400 text-[0.95rem]">Jadwal Theater Terbaru Aurhel Alana.</p>
        </div>

        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <Link href="/about-lana" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-body text-[0.85rem] font-semibold cursor-pointer transition-all border-2 border-accent text-accent hover:bg-accent/10 hover:-translate-y-0.5 bg-transparent">
            ← Kembali
          </Link>

          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-body text-[0.85rem] font-semibold cursor-pointer transition-all border-none bg-accent text-b900 shadow-[0_4px_14px_rgba(251,191,36,0.35)] hover:bg-accent/90 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(251,191,36,0.45)]" onClick={loadSchedule}>
            <i className="bx bx-refresh text-lg"></i> Refresh
          </button>
        </div>
      </div>

      <div className="w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 dark:text-slate-400 gap-4">
            <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-800 border-t-accent rounded-full animate-spin" />
            <p className="font-medium">Memuat jadwal...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-xl border border-red-200 dark:border-red-900/30 text-center font-medium">
            {error}
          </div>
        ) : !show || !computed ? (
          <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 p-10 rounded-xl text-center border border-theme-border font-medium">
            Jadwal tidak ditemukan.
          </div>
        ) : (
          <section className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[32px] shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 text-white p-6 md:px-10 border-b-2 border-slate-800">
              <div className="font-semibold text-lg flex items-center gap-2">
                <i className="bx bx-calendar text-b200 text-xl"></i> {computed.dateStr}
              </div>
              <div className="font-medium text-[0.95rem] opacity-90 flex items-center gap-2 mt-2 sm:mt-0">
                <i className="bx bx-time-five text-b200 text-xl"></i> Mulai: <span className="font-bold text-b100">{computed.timeStr} WIB</span>
              </div>
            </div>

            <div className="flex flex-col-reverse md:flex-row p-6 md:p-8 gap-8">
              <div className="flex-1">
                <div className="font-display text-2xl md:text-3xl font-black text-slate-950 dark:text-white mb-6 pb-5 border-b-2 border-slate-100 dark:border-slate-700 leading-tight tracking-tight">
                  {String(show.title || "").toUpperCase()}
                </div>

                <div className="flex flex-wrap gap-2.5 mb-8">
                  {computed.members.map((m, idx) => {
                    const key = normalizeKey(m?.name);
                    const fullName = namaPanjang[key] || m?.name || "";
                    const isLana =
                      key === "lana" ||
                      normalizeKey(fullName) === "aurhel alana" ||
                      normalizeKey(m?.name) === "aurhel alana";

                    return (
                      <div
                        key={`${key}-${idx}`}
                        className={`px-4 py-2 rounded-xl text-[0.9rem] font-bold border-2 transition-all duration-300 cursor-default group relative overflow-hidden ${
                          isLana 
                            ? "bg-gradient-to-br from-accent to-amber-500 text-slate-900 border-accent shadow-[0_4px_20px_rgba(251,191,36,0.5)] scale-110 z-10 animate-pulse-subtle" 
                            : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-100 dark:border-slate-700 hover:border-accent/50 hover:shadow-lg hover:-translate-y-1 hover:scale-105"
                        }`}
                      >
                        {/* Glow effect for Lana */}
                        {isLana && (
                          <div className="absolute inset-0 bg-white/20 animate-shine" />
                        )}
                        
                        <span className="relative z-10 flex items-center gap-2">
                          {isLana && <i className="bx bxs-star text-amber-900 animate-spin-slow"></i>}
                          {fullName}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-3">
                  {show.url ? (
                    <a
                      href={show.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-body text-[0.9rem] font-semibold cursor-pointer transition-all bg-accent text-b900 shadow-[0_4px_14px_rgba(251,191,36,0.35)] hover:bg-accent/90 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(251,191,36,0.45)]"
                    >
                      <i className="bx bx-receipt text-lg"></i> Beli Tiket
                    </a>
                  ) : null}

                  {show?.idnTheater?.slug ? (
                    <a
                      href={`https://www.idn.app/live/${show.idnTheater.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-body text-[0.9rem] font-semibold cursor-pointer transition-all border-2 border-accent text-accent bg-transparent hover:bg-accent/10 hover:-translate-y-0.5"
                    >
                      <i className="bx bx-play-circle text-lg"></i> Nonton di IDN
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="w-full md:w-[320px] flex-shrink-0">
                {show.poster ? (
                  <img src={show.poster} alt={show.title || ""} className="w-full h-auto rounded-xl shadow-md object-cover border border-theme-border" />
                ) : show.banner ? (
                  <img src={show.banner} alt={show.title || ""} className="w-full h-auto rounded-xl shadow-md object-cover border border-theme-border" />
                ) : show.setlist_poster ? (
                  <img src={show.setlist_poster} alt={show.title || ""} className="w-full h-auto rounded-xl shadow-md object-cover border border-theme-border" />
                ) : (
                  <div className="w-full aspect-[3/4] bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 font-medium flex-col gap-2">
                    <i className="bx bx-image text-4xl opacity-50"></i>
                    No Poster
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
