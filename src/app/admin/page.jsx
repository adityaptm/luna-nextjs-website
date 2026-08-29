"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });

      const json = await res.json();

      if (json.success) {
        router.push("/admin/dashboard");
      } else {
        setError(json.message || "Password salah. Coba lagi!");
      }
    } catch (err) {
      setError("Terjadi kesalahan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border-2 border-slate-800 rounded-[32px] p-8 md:p-10 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full p-1 bg-gradient-to-tr from-accent to-amber-500 shadow-xl shadow-accent/20">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-950 flex items-center justify-center">
              <Image
                src="/images/luna.webp"
                alt="LUNA Logo"
                width={70}
                height={70}
                className="object-cover"
                priority
              />
            </div>
          </div>
          <h1 className="font-display text-3xl font-black text-white tracking-tight">
            LUNA. <span className="text-accent">CMS</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">
            Admin Panel Aurhel Alana Fansite
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold flex items-center gap-3 animate-in shake duration-300">
            <i className="bx bx-error-circle text-xl flex-shrink-0"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">
              Admin Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password admin..."
                className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-5 py-3.5 pl-12 text-[0.95rem] text-white placeholder:text-slate-600 outline-none focus:border-accent transition-all"
                autoFocus
              />
              <i className="bx bx-lock-alt absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl"></i>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent/90 text-slate-950 font-black py-4 rounded-2xl shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                <span>Memverifikasi...</span>
              </div>
            ) : (
              <>
                <i className="bx bx-log-in text-xl"></i>
                Masuk ke Dashboard
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-accent transition-colors"
          >
            <i className="bx bx-left-arrow-alt text-base"></i> Kembali ke Website Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
