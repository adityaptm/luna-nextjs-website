"use client";

import { useState, useEffect } from "react";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      const json = await res.json();
      if (json.success) {
        setMessages(json.data || []);
      }
    } catch (err) {
      console.error("Fetch messages error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Apakah kamu yakin ingin menghapus pesan ini?")) return;

    setDeletingId(id);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      } else {
        alert("Gagal menghapus pesan: " + (json.message || "Error"));
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menghapus pesan.");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = messages.filter((m) => {
    const q = search.toLowerCase();
    return (
      (m.name && m.name.toLowerCase().includes(q)) ||
      (m.message && m.message.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border-2 border-slate-800 p-6 md:p-8 rounded-[32px] shadow-xl">
        <div>
          <span className="px-3.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 font-black text-xs uppercase tracking-wider">
            Moderasi Konten
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-black text-white mt-2">
            Pesan & Dukungan Fans ({messages.length})
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Pantau dan moderasi pesan yang masuk di Message Board publik.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMessages}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-all cursor-pointer"
          >
            <i className={`bx bx-refresh text-lg ${loading ? "animate-spin" : ""}`}></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 flex items-center gap-3">
        <i className="bx bx-search text-slate-400 text-xl ml-2"></i>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari pengirim atau isi pesan..."
          className="w-full bg-transparent text-white placeholder:text-slate-500 outline-none text-sm font-medium"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-slate-400 hover:text-white text-sm font-bold px-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 bg-slate-900 border-2 border-slate-800 rounded-[32px]">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-medium">Memuat pesan...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-slate-500 bg-slate-900 border-2 border-slate-800 rounded-[32px] p-8">
          <i className="bx bx-message-rounded-x text-5xl mb-3"></i>
          <p className="text-lg font-bold text-slate-400">Tidak ada pesan ditemukan.</p>
          <p className="text-xs text-slate-600 mt-1">Coba kata kunci pencarian lain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((msg) => (
            <div
              key={msg.id}
              className="bg-slate-900 border-2 border-slate-800 rounded-[28px] p-6 shadow-md hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-accent/10 border border-accent/20 text-accent font-black flex items-center justify-center text-lg flex-shrink-0">
                      {msg.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white">{msg.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {msg.timestamp
                          ? new Date(msg.timestamp).toLocaleString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(msg.id)}
                    disabled={deletingId === msg.id}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-all cursor-pointer flex items-center justify-center text-lg"
                    title="Hapus pesan ini"
                  >
                    {deletingId === msg.id ? (
                      <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <i className="bx bx-trash"></i>
                    )}
                  </button>
                </div>

                <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 mb-4">
                  <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line italic">
                    "{msg.message}"
                  </p>
                </div>
              </div>

              {msg.imageUrl && (
                <div className="mt-2 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <i className="bx bx-image text-accent text-base"></i> Lampiran Gambar
                  </span>
                  <button
                    onClick={() => setPreviewImage(msg.imageUrl)}
                    className="text-xs font-bold text-accent hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Lihat Foto <i className="bx bx-zoom-in"></i>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] bg-slate-900 border-2 border-slate-700 rounded-3xl p-4 shadow-2xl overflow-hidden">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-slate-950/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white text-2xl transition-all z-10"
            >
              <i className="bx bx-x"></i>
            </button>
            <img
              src={previewImage}
              alt="Lampiran"
              className="w-full max-h-[80vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
