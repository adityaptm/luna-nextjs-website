"use client";

import { useState, useEffect } from "react";

export default function AdminFunFactsPage() {
  const [funfacts, setFunfacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    icon: "bx bx-bulb",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    active: true,
  });
  const [saving, setSaving] = useState(false);

  const fetchFunFacts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/funfacts");
      const json = await res.json();
      if (json.success) {
        setFunfacts(json.data || []);
      }
    } catch (err) {
      console.error("Fetch funfacts error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunFacts();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      content: "",
      icon: "bx bx-bulb",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      content: item.content,
      icon: item.icon || "bx bx-bulb",
      color: item.color || "text-amber-500",
      bg: item.bg || "bg-amber-500/10",
      active: item.active !== false,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    setSaving(true);
    try {
      const url = "/api/admin/funfacts";
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
        fetchFunFacts();
      } else {
        alert("Gagal menyimpan trivia: " + (json.message || "Error"));
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus fakta/trivia ini?")) return;

    try {
      const res = await fetch("/api/admin/funfacts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.success) {
        setFunfacts((prev) => prev.filter((f) => f.id !== id));
      }
    } catch (err) {
      alert("Gagal menghapus trivia.");
    }
  };

  const iconOptions = [
    { label: "Bohlam (Idea)", value: "bx bx-bulb" },
    { label: "Bulan (Sailor Moon)", value: "bx bxs-moon" },
    { label: "Topeng (Dual Mode)", value: "bx bx-masks-theater" },
    { label: "Bunga (Lidah)", value: "bx bx-spa" },
    { label: "Kamera (Foto)", value: "bx bx-camera" },
    { label: "Pesan (Typing)", value: "bx bx-message-square-dots" },
    { label: "Makanan (Bubur)", value: "bx bx-dish" },
    { label: "Senyum (Lantul)", value: "bx bx-smile" },
    { label: "Globe (Bahasa Korea)", value: "bx bx-globe" },
    { label: "Waktu (Absen)", value: "bx bx-time" },
    { label: "Acak (Lana vs Nala)", value: "bx bx-shuffle" },
    { label: "Musik (Setlist)", value: "bx bx-music" },
    { label: "Layer (Aikatsu)", value: "bx bx-layer" },
  ];

  const colorOptions = [
    { label: "Amber / Gold", value: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Pink", value: "text-pink-500", bg: "bg-pink-500/10" },
    { label: "Emerald (Green)", value: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Blue", value: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Violet (Purple)", value: "text-violet-500", bg: "bg-violet-500/10" },
    { label: "Orange", value: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Rose (Red)", value: "text-rose-500", bg: "bg-rose-500/10" },
    { label: "Cyan", value: "text-cyan-500", bg: "bg-cyan-500/10" },
    { label: "Indigo", value: "text-indigo-500", bg: "bg-indigo-500/10" },
    { label: "Teal", value: "text-teal-500", bg: "bg-teal-500/10" },
    { label: "Fuchsia", value: "text-fuchsia-500", bg: "bg-fuchsia-500/10" },
    { label: "Sky", value: "text-sky-500", bg: "bg-sky-500/10" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border-2 border-slate-800 p-6 md:p-8 rounded-[32px] shadow-xl">
        <div>
          <span className="px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-black text-xs uppercase tracking-wider">
            Trivia & Fun Facts
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-black text-white mt-2">
            Kelola Fun Facts Lana ({funfacts.length})
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Fakta unik dan cerita menarik tentang Aurhel Alana yang tampil di website.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-accent hover:bg-accent/90 text-slate-950 font-black text-sm shadow-lg shadow-accent/20 transition-all hover:scale-105 cursor-pointer"
        >
          <i className="bx bx-plus-circle text-xl"></i>
          Tambah Fun Fact
        </button>
      </div>

      {/* Fun Facts Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 bg-slate-900 border-2 border-slate-800 rounded-[32px]">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Memuat trivia...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {funfacts.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border-2 border-slate-800 rounded-[28px] p-6 shadow-md hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl ${item.bg || "bg-amber-500/10"} ${item.color || "text-amber-500"} flex items-center justify-center text-2xl flex-shrink-0`}
                  >
                    <i className={item.icon || "bx bx-bulb"}></i>
                  </div>

                  <div className="flex items-center gap-1.5">
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

                <h3 className="font-bold text-lg text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{item.content}</p>
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
                {editingItem ? "Edit Fun Fact" : "Tambah Fun Fact Baru"}
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
                  Judul Trivia
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Suka Sailor Moon"
                  className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none font-bold"
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
                    onChange={(e) => {
                      const selected = colorOptions.find((c) => c.value === e.target.value);
                      setFormData({
                        ...formData,
                        color: selected.value,
                        bg: selected.bg,
                      });
                    }}
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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Isi Cerita / Penjelasan
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Tuliskan fakta unik atau cerita lengkap di sini..."
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
