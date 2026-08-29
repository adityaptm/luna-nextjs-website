"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    messages: 0,
    hashtags: 0,
    gallery: 0,
    announcements: 0,
    funfacts: 0,
    setlists: 0,
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [msgRes, hashRes, galRes, annRes, funRes, setRes] = await Promise.allSettled([
        fetch("/api/admin/messages").then((r) => r.json()),
        fetch("/api/admin/hashtags").then((r) => r.json()),
        fetch("/api/admin/gallery").then((r) => r.json()),
        fetch("/api/admin/announcements").then((r) => r.json()),
        fetch("/api/admin/funfacts").then((r) => r.json()),
        fetch("/api/admin/setlists").then((r) => r.json()),
      ]);

      const msgData = msgRes.status === "fulfilled" && msgRes.value.success ? msgRes.value.data : [];
      const hashData = hashRes.status === "fulfilled" && hashRes.value.success ? hashRes.value.data : [];
      const galData = galRes.status === "fulfilled" && galRes.value.success ? galRes.value.data : [];
      const annData = annRes.status === "fulfilled" && annRes.value.success ? annRes.value.data : [];
      const funData = funRes.status === "fulfilled" && funRes.value.success ? funRes.value.data : [];
      const setData = setRes.status === "fulfilled" && setRes.value.success && setRes.value.data?.items ? setRes.value.data.items : [];

      setStats({
        messages: msgData.length,
        hashtags: hashData.length,
        gallery: galData.length,
        announcements: annData.length,
        funfacts: funData.length,
        setlists: setData.length || 7,
      });

      setRecentMessages(msgData.slice(0, 5));
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      label: "Setlists Theater",
      count: stats.setlists,
      icon: "bx-calendar-star",
      color: "from-rose-500/20 to-pink-600/10 text-pink-400 border-pink-500/30",
      href: "/admin/setlists",
    },
    {
      label: "Total Pesan Fans",
      count: stats.messages,
      icon: "bx-message-square-dots",
      color: "from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/30",
      href: "/admin/messages",
    },
    {
      label: "Hashtag Dukungan",
      count: stats.hashtags,
      icon: "bx-hash",
      color: "from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/30",
      href: "/admin/hashtags",
    },
    {
      label: "Foto Gallery",
      count: stats.gallery,
      icon: "bx-images",
      color: "from-pink-500/20 to-pink-600/10 text-pink-400 border-pink-500/30",
      href: "/admin/gallery",
    },
    {
      label: "Pengumuman / News",
      count: stats.announcements,
      icon: "bx-news",
      color: "from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/30",
      href: "/admin/announcements",
    },
    {
      label: "Fun Facts & Trivia",
      count: stats.funfacts,
      icon: "bx-bulb",
      color: "from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/30",
      href: "/admin/funfacts",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border-2 border-slate-800 p-6 md:p-8 rounded-[32px] shadow-xl">
        <div>
          <span className="px-3.5 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent font-black text-xs uppercase tracking-wider">
            Admin CMS Dashboard
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-black text-white mt-2">
            Selamat Datang di LUNA. CMS
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-1">
            Kelola setlists teater, pesan fans, hashtag dukungan, galeri foto, pengumuman, dan trivia Lana JKT48.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-all cursor-pointer"
          >
            <i className={`bx bx-refresh text-lg ${loading ? "animate-spin" : ""}`}></i>
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, i) => (
          <Link
            key={i}
            href={card.href}
            className={`p-6 rounded-[28px] border-2 bg-gradient-to-br ${card.color} shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {card.label}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-slate-950/60 flex items-center justify-center text-xl">
                <i className={`bx ${card.icon}`}></i>
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-white">
                {loading ? "..." : card.count}
              </div>
              <p className="text-xs font-medium text-slate-400 mt-2 flex items-center gap-1 group-hover:text-white transition-colors">
                Kelola konten <i className="bx bx-right-arrow-alt"></i>
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Action & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="bg-slate-900 border-2 border-slate-800 rounded-[32px] p-6 md:p-8 shadow-xl space-y-4">
          <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <i className="bx bx-bolt-circle text-accent text-2xl"></i> Menu Cepat
          </h2>
          <div className="grid grid-cols-1 gap-2.5">
            <Link
              href="/admin/setlists"
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-pink-400 hover:bg-slate-800/80 transition-all font-bold text-sm text-slate-200 hover:text-pink-400 group"
            >
              <div className="flex items-center gap-3">
                <i className="bx bx-calendar-star text-pink-400 text-lg"></i>
                Kelola Setlists Teater
              </div>
              <i className="bx bx-chevron-right group-hover:translate-x-1 transition-transform"></i>
            </Link>

            <Link
              href="/admin/profile"
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-accent hover:bg-slate-800/80 transition-all font-bold text-sm text-slate-200 hover:text-accent group"
            >
              <div className="flex items-center gap-3">
                <i className="bx bx-slider-alt text-cyan-400 text-lg"></i>
                Sosial Media &amp; Embeds
              </div>
              <i className="bx bx-chevron-right group-hover:translate-x-1 transition-transform"></i>
            </Link>

            <Link
              href="/admin/messages"
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-accent hover:bg-slate-800/80 transition-all font-bold text-sm text-slate-200 hover:text-accent group"
            >
              <div className="flex items-center gap-3">
                <i className="bx bx-message-rounded-check text-blue-400 text-lg"></i>
                Moderasi Pesan Fans
              </div>
              <i className="bx bx-chevron-right group-hover:translate-x-1 transition-transform"></i>
            </Link>

            <Link
              href="/admin/hashtags"
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-accent hover:bg-slate-800/80 transition-all font-bold text-sm text-slate-200 hover:text-accent group"
            >
              <div className="flex items-center gap-3">
                <i className="bx bx-plus-circle text-purple-400 text-lg"></i>
                Tambah / Edit Hashtag
              </div>
              <i className="bx bx-chevron-right group-hover:translate-x-1 transition-transform"></i>
            </Link>

            <Link
              href="/admin/gallery"
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-accent hover:bg-slate-800/80 transition-all font-bold text-sm text-slate-200 hover:text-accent group"
            >
              <div className="flex items-center gap-3">
                <i className="bx bx-image-add text-pink-400 text-lg"></i>
                Kelola Foto Gallery
              </div>
              <i className="bx bx-chevron-right group-hover:translate-x-1 transition-transform"></i>
            </Link>

            <Link
              href="/admin/announcements"
              className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-accent hover:bg-slate-800/80 transition-all font-bold text-sm text-slate-200 hover:text-accent group"
            >
              <div className="flex items-center gap-3">
                <i className="bx bx-edit text-emerald-400 text-lg"></i>
                Buat Pengumuman Baru
              </div>
              <i className="bx bx-chevron-right group-hover:translate-x-1 transition-transform"></i>
            </Link>
          </div>
        </div>

        {/* Recent Messages Preview */}
        <div className="lg:col-span-2 bg-slate-900 border-2 border-slate-800 rounded-[32px] p-6 md:p-8 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
              <i className="bx bx-time-five text-accent text-2xl"></i> Pesan Masuk Terbaru
            </h2>
            <Link
              href="/admin/messages"
              className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
            >
              Lihat Semua ({stats.messages}) <i className="bx bx-right-arrow-alt"></i>
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500">
              <div className="w-8 h-8 border-2 border-slate-700 border-t-accent rounded-full animate-spin mx-auto mb-3"></div>
              Memuat pesan...
            </div>
          ) : recentMessages.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <i className="bx bx-chat text-4xl mb-2"></i>
              <p>Belum ada pesan yang masuk.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 text-accent font-black flex items-center justify-center flex-shrink-0 text-sm">
                      {msg.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{msg.name}</span>
                        <span className="text-[0.7rem] text-slate-500 font-medium">
                          {msg.timestamp
                            ? new Date(msg.timestamp).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "-"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2 italic">
                        "{msg.message}"
                      </p>
                    </div>
                  </div>
                  {msg.imageUrl && (
                    <span className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-[0.65rem] font-bold uppercase flex-shrink-0 flex items-center gap-1">
                      <i className="bx bx-image"></i> Ada Foto
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
