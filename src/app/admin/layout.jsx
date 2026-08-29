"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on login page, don't show the dashboard sidebar layout
  const isLoginPage = pathname === "/admin";

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: "bx-grid-alt" },
    { label: "Setlists Theater", href: "/admin/setlists", icon: "bx-calendar-star" },
    { label: "Sosial Media & Show", href: "/admin/profile", icon: "bx-slider-alt" },
    { label: "Pesan & Moderasi", href: "/admin/messages", icon: "bx-message-square-dots" },
    { label: "Kelola Hashtag", href: "/admin/hashtags", icon: "bx-hash" },
    { label: "Gallery Foto", href: "/admin/gallery", icon: "bx-images" },
    { label: "Pengumuman / News", href: "/admin/announcements", icon: "bx-news" },
    { label: "Fun Facts & Trivia", href: "/admin/funfacts", icon: "bx-bulb" },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch {}
    router.push("/admin");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 border-b border-slate-800 px-5 py-4 sticky top-0 z-40">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-950 border border-accent/40 flex items-center justify-center">
            <Image src="/images/luna.webp" alt="LUNA" width={32} height={32} />
          </div>
          <span className="font-display font-black text-lg text-white">
            LUNA <span className="text-accent">CMS</span>
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl bg-slate-800 text-white hover:text-accent transition-colors"
          aria-label="Toggle menu"
        >
          <i className={`bx ${sidebarOpen ? "bx-x" : "bx-menu"} text-2xl`}></i>
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-50 md:z-auto w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-6 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Logo Brand */}
          <div className="flex items-center gap-3.5 mb-8 px-2 pb-6 border-b border-slate-800">
            <div className="w-11 h-11 rounded-2xl p-0.5 bg-gradient-to-tr from-accent to-amber-500 shadow-lg shadow-accent/20">
              <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-950 flex items-center justify-center">
                <Image src="/images/luna.webp" alt="LUNA" width={40} height={40} />
              </div>
            </div>
            <div>
              <h2 className="font-display font-black text-xl text-white tracking-tight">
                LUNA. <span className="text-accent text-sm uppercase">CMS</span>
              </h2>
              <p className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-wider">
                Management Panel
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-[0.9rem] transition-all duration-200 ${
                    active
                      ? "bg-accent text-slate-950 shadow-lg shadow-accent/25 translate-x-1"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                  }`}
                >
                  <i className={`bx ${item.icon} text-xl ${active ? "text-slate-950" : "text-accent"}`}></i>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-accent text-xs font-bold transition-colors"
          >
            <i className="bx bx-globe text-base text-accent"></i>
            <span>Buka Website Utama</span>
            <i className="bx bx-link-external text-xs ml-auto"></i>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 text-xs font-bold transition-all cursor-pointer"
          >
            <i className="bx bx-log-out text-base"></i>
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-5 md:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
