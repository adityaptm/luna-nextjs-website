"use client";

import { useState, useEffect } from "react";

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    src: "",
    alt: "",
    caption: "",
  });
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery");
      const json = await res.json();
      if (json.success) {
        setGallery(json.data || []);
      }
    } catch (err) {
      console.error("Fetch gallery error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ src: "", alt: "", caption: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      src: item.src || "",
      alt: item.alt || "",
      caption: item.caption || "",
    });
    setIsModalOpen(true);
  };

  const handleSavePhoto = async (e) => {
    e.preventDefault();
    if (!formData.src.trim()) return;

    setSaving(true);
    try {
      const url = "/api/admin/gallery";
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
        setFormData({ src: "", alt: "", caption: "" });
        fetchGallery();
      } else {
        alert("Gagal menyimpan foto: " + (json.message || "Error"));
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menyimpan foto.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus foto ini dari galeri?")) return;

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.success) {
        setGallery((prev) => prev.filter((g) => g.id !== id));
      }
    } catch (err) {
      alert("Gagal menghapus foto.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border-2 border-slate-800 p-6 md:p-8 rounded-[32px] shadow-xl">
        <div>
          <span className="px-3.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-400 font-black text-xs uppercase tracking-wider">
            Galeri Foto & Caption
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-black text-white mt-2">
            Kelola Galeri Foto ({gallery.length})
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Tambah foto baru, edit teks / caption gambar, atau hapus foto Aurhel Alana.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-accent hover:bg-accent/90 text-slate-950 font-black text-sm shadow-lg shadow-accent/20 transition-all hover:scale-105 cursor-pointer"
        >
          <i className="bx bx-plus-circle text-xl"></i>
          Tambah Foto Baru
        </button>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 bg-slate-900 border-2 border-slate-800 rounded-[32px]">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Memuat galeri...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {gallery.map((p) => (
            <div
              key={p.id}
              className="bg-slate-900 border-2 border-slate-800 hover:border-accent/40 rounded-2xl overflow-hidden shadow-md group relative flex flex-col justify-between transition-all"
            >
              <div className="aspect-square w-full bg-slate-950 overflow-hidden relative">
                <img
                  src={p.src}
                  alt={p.alt || "Lana"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                  <button
                    onClick={() => setPreviewImage(p.src)}
                    className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white text-white hover:text-slate-950 flex items-center justify-center text-base transition-all cursor-pointer"
                    title="Zoom Foto"
                  >
                    <i className="bx bx-zoom-in"></i>
                  </button>
                  <button
                    onClick={() => openEditModal(p)}
                    className="w-8 h-8 rounded-xl bg-accent/80 hover:bg-accent text-slate-950 flex items-center justify-center text-base transition-all cursor-pointer font-bold"
                    title="Edit Teks & Caption"
                  >
                    <i className="bx bx-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="w-8 h-8 rounded-xl bg-red-500/80 hover:bg-red-600 text-white flex items-center justify-center text-base transition-all cursor-pointer"
                    title="Hapus"
                  >
                    <i className="bx bx-trash"></i>
                  </button>
                </div>
              </div>
              <div className="p-3 bg-slate-900 border-t border-slate-800">
                <p className="text-[0.78rem] font-bold text-white truncate">
                  {p.caption || p.alt || "Tanpa Caption"}
                </p>
                <p className="text-[0.68rem] text-slate-500 truncate mt-0.5">
                  {p.src.split("/").pop()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit Photo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-slate-700 rounded-[32px] max-w-md w-full p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <h3 className="font-display text-2xl font-bold text-white">
                {editingItem ? "Edit Teks / Caption Foto" : "Tambah Foto Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xl"
              >
                <i className="bx bx-x"></i>
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Path / URL Gambar
                </label>
                <input
                  type="text"
                  required
                  value={formData.src}
                  onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                  placeholder="Contoh: /images/lana1.webp atau https://..."
                  className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Caption Gambar
                </label>
                <input
                  type="text"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Contoh: Lana saat Perform di Theater"
                  className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Alt Teks / Keterangan
                </label>
                <input
                  type="text"
                  value={formData.alt}
                  onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                  placeholder="Contoh: Aurhel Alana Tirta"
                  className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none"
                />
              </div>

              {formData.src && (
                <div className="pt-2">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Pratinjau Foto
                  </span>
                  <div className="w-full h-32 rounded-2xl bg-slate-950 border-2 border-slate-800 overflow-hidden flex items-center justify-center">
                    <img
                      src={formData.src}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </div>
                </div>
              )}

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
                  className="px-6 py-3 rounded-xl bg-accent hover:bg-accent/90 text-slate-950 font-black text-sm transition-all shadow-lg shadow-accent/20 disabled:opacity-50 cursor-pointer"
                >
                  {saving ? "Menyimpan..." : editingItem ? "Simpan Perubahan" : "Tambahkan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Preview */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 text-white text-3xl hover:text-accent"
            >
              <i className="bx bx-x"></i>
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
