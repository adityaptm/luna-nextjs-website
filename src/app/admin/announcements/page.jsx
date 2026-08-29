"use client";

import { useState, useEffect } from "react";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Info",
    published: true,
  });
  const [saving, setSaving] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/announcements");
      const json = await res.json();
      if (json.success) {
        setAnnouncements(json.data || []);
      }
    } catch (err) {
      console.error("Fetch announcements error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      content: "",
      category: "Info",
      published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      content: item.content,
      category: item.category || "Info",
      published: item.published !== false,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setSaving(true);
    try {
      const url = "/api/admin/announcements";
      const method = editingItem ? "PUT" : "POST";
      const payload = editingItem ? { id: editingItem.id, ...formData } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        fetchAnnouncements();
      } else {
        alert("Gagal menyimpan pengumuman: " + (json.message || "Error"));
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus pengumuman ini?")) return;

    try {
      const res = await fetch("/api/admin/announcements", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.success) {
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      alert("Gagal menghapus pengumuman.");
    }
  };

  const categories = ["Info", "Project", "Event", "Theater", "Birthday", "Official"];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border-2 border-slate-800 p-6 md:p-8 rounded-[32px] shadow-xl">
        <div>
          <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-black text-xs uppercase tracking-wider">
            Berita & Pengumuman
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-black text-white mt-2">
            Kelola Pengumuman ({announcements.length})
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Buat rilis berita, jadwal fanbase, atau pengumuman project spesial untuk fans.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-accent hover:bg-accent/90 text-slate-950 font-black text-sm shadow-lg shadow-accent/20 transition-all hover:scale-105 cursor-pointer"
        >
          <i className="bx bx-plus-circle text-xl"></i>
          Buat Pengumuman Baru
        </button>
      </div>

      {/* Announcements List */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 bg-slate-900 border-2 border-slate-800 rounded-[32px]">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Memuat pengumuman...</p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="py-20 text-center text-slate-500 bg-slate-900 border-2 border-slate-800 rounded-[32px] p-8">
          <i className="bx bx-news text-5xl mb-3"></i>
          <p className="text-lg font-bold text-slate-400">Belum ada pengumuman.</p>
          <p className="text-xs text-slate-600 mt-1">Klik tombol di atas untuk membuat pengumuman pertama.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border-2 border-slate-800 rounded-[28px] p-6 shadow-md hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent text-xs font-black uppercase tracking-wider">
                    {item.category || "Info"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.published !== false
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {item.published !== false ? "Published" : "Draft"}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {item.date
                      ? new Date(item.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "-"}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-white">{item.title}</h3>
                <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed whitespace-pre-line">
                  {item.content}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => openEditModal(item)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <i className="bx bx-edit text-base"></i> Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <i className="bx bx-trash text-base"></i> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-slate-700 rounded-[32px] max-w-xl w-full p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <h3 className="font-display text-2xl font-bold text-white">
                {editingItem ? "Edit Pengumuman" : "Buat Pengumuman Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xl"
              >
                <i className="bx bx-x"></i>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Judul Pengumuman
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Project Ulang Tahun Lana Ke-20"
                  className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none font-bold"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Status Publikasi
                  </label>
                  <select
                    value={formData.published ? "true" : "false"}
                    onChange={(e) => setFormData({ ...formData, published: e.target.value === "true" })}
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none font-bold"
                  >
                    <option value="true">Published (Tampil)</option>
                    <option value="false">Draft (Sembunyikan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Isi Pengumuman
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Tulis detail informasi atau pengumuman di sini..."
                  className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none resize-none leading-relaxed"
                ></textarea>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-xl bg-accent hover:bg-accent/90 text-slate-950 font-black text-sm transition-all shadow-lg shadow-accent/20 disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : editingItem ? "Simpan Perubahan" : "Publikasikan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
