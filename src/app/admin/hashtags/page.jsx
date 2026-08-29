"use client";

import { useState, useEffect } from "react";

export default function AdminHashtagsPage() {
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    tag: "",
    desc: "",
    icon: "bx bx-hash",
    color: "text-accent",
    active: true,
  });
  const [saving, setSaving] = useState(false);

  const fetchHashtags = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/hashtags");
      const json = await res.json();
      if (json.success) {
        setHashtags(json.data || []);
      }
    } catch (err) {
      console.error("Fetch hashtags error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHashtags();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      tag: "#",
      desc: "",
      icon: "bx bx-rocket",
      color: "text-purple-500",
      active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      tag: item.tag,
      desc: item.desc,
      icon: item.icon || "bx bx-hash",
      color: item.color || "text-accent",
      active: item.active !== false,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.tag.trim()) return;

    setSaving(true);
    try {
      const url = "/api/admin/hashtags";
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
        fetchHashtags();
      } else {
        alert("Gagal menyimpan hashtag: " + (json.message || "Error"));
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus hashtag ini dari daftar?")) return;

    try {
      const res = await fetch("/api/admin/hashtags", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.success) {
        setHashtags((prev) => prev.filter((h) => h.id !== id));
      }
    } catch (err) {
      alert("Gagal menghapus hashtag.");
    }
  };

  const handleToggleActive = async (item) => {
    try {
      const updated = { ...item, active: !item.active };
      const res = await fetch("/api/admin/hashtags", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setHashtags((prev) => prev.map((h) => (h.id === item.id ? updated : h)));
      }
    } catch {}
  };

  const iconOptions = [
    { label: "Rocket", value: "bx bx-rocket" },
    { label: "Moon", value: "bx bx-moon" },
    { label: "Star", value: "bx bx-star" },
    { label: "Broadcast", value: "bx bx-broadcast" },
    { label: "Show", value: "bx bx-show" },
    { label: "Heart", value: "bx bx-heart" },
    { label: "Book", value: "bx bx-book-open" },
    { label: "Image", value: "bx bx-image" },
    { label: "Music", value: "bx bx-music" },
    { label: "Trophy", value: "bx bx-trophy" },
    { label: "Medal", value: "bx bx-medal" },
    { label: "Hash", value: "bx bx-hash" },
  ];

  const colorOptions = [
    { label: "Purple", value: "text-purple-500" },
    { label: "Indigo", value: "text-indigo-400" },
    { label: "Yellow / Accent", value: "text-accent" },
    { label: "Red", value: "text-red-500" },
    { label: "Blue", value: "text-blue-400" },
    { label: "Pink", value: "text-pink-500" },
    { label: "Emerald", value: "text-emerald-500" },
    { label: "Cyan", value: "text-cyan-500" },
    { label: "Rose", value: "text-rose-400" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border-2 border-slate-800 p-6 md:p-8 rounded-[32px] shadow-xl">
        <div>
          <span className="px-3.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-400 font-black text-xs uppercase tracking-wider">
            Hashtag Support
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-black text-white mt-2">
            Kelola Official Hashtag ({hashtags.length})
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Hashtag yang aktif akan tampil di ticker berjalan dan menu Hashtag di halaman utama.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-accent hover:bg-accent/90 text-slate-950 font-black text-sm shadow-lg shadow-accent/20 transition-all hover:scale-105 cursor-pointer"
        >
          <i className="bx bx-plus-circle text-xl"></i>
          Tambah Hashtag
        </button>
      </div>

      {/* Hashtags Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 bg-slate-900 border-2 border-slate-800 rounded-[32px]">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Memuat hashtag...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hashtags.map((item) => (
            <div
              key={item.id}
              className={`bg-slate-900 border-2 rounded-[28px] p-6 shadow-md transition-all flex flex-col justify-between ${
                item.active !== false ? "border-slate-800 hover:border-accent/40" : "border-slate-800/40 opacity-60"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center flex-shrink-0 text-2xl">
                    <i className={`${item.icon} ${item.color}`}></i>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleActive(item)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        item.active !== false
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {item.active !== false ? "Aktif" : "Nonaktif"}
                    </button>
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <i className="bx bx-edit text-base"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-colors cursor-pointer"
                      title="Hapus"
                    >
                      <i className="bx bx-trash text-base"></i>
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-lg text-white mb-1">{item.tag}</h3>
                <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-slate-700 rounded-[32px] max-w-lg w-full p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <h3 className="font-display text-2xl font-bold text-white">
                {editingItem ? "Edit Hashtag" : "Tambah Hashtag Baru"}
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
                  Hashtag Tag
                </label>
                <input
                  type="text"
                  required
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  placeholder="Contoh: #VoyageOfLana"
                  className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Deskripsi / Penggunaan
                </label>
                <input
                  type="text"
                  required
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  placeholder="Contoh: Dukungan Umum atau Nonton Live SR/IDN"
                  className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Ikon
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none font-bold"
                  >
                    {iconOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Warna Aksen
                  </label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none font-bold"
                  >
                    {colorOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Preview Box */}
              <div className="pt-2">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Preview Tampilan Card
                </span>
                <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-xl">
                    <i className={`${formData.icon} ${formData.color}`}></i>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{formData.tag || "#ContohHashtag"}</p>
                    <p className="text-xs text-slate-400">{formData.desc || "Deskripsi hashtag"}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-xl bg-accent hover:bg-accent/90 text-slate-950 font-black text-sm transition-all shadow-lg shadow-accent/20 cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : editingItem ? "Simpan Perubahan" : "Tambahkan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
