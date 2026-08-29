"use client";

import { useState, useEffect } from "react";

export default function AdminSetlistsPage() {
  const [stats, setStats] = useState({
    totalShows: 103,
    totalSetlists: 7,
    totalUnitSongs: 15,
  });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingStats, setSavingStats] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    period: "",
    badge: "",
    image: "/images/lana1.webp",
    songs: "",
    shows: 0,
    order: 0,
    active: true,
  });
  const [savingItem, setSavingItem] = useState(false);

  const fetchSetlists = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/setlists");
      const json = await res.json();
      if (json.success && json.data) {
        if (json.data.stats) setStats(json.data.stats);
        if (Array.isArray(json.data.items)) setItems(json.data.items);
      }
    } catch (err) {
      console.error("Fetch setlists error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSetlists();
  }, []);

  const handleSaveStats = async (e) => {
    e.preventDefault();
    setSavingStats(true);
    try {
      const res = await fetch("/api/admin/setlists", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "stats", stats }),
      });
      const json = await res.json();
      if (json.success) {
        alert("Statistik berhasil disimpan!");
      } else {
        alert("Gagal menyimpan statistik: " + (json.message || "Error"));
      }
    } catch {
      alert("Terjadi kesalahan saat menyimpan statistik.");
    } finally {
      setSavingStats(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      period: "",
      badge: "",
      image: "/images/lana1.webp",
      songs: "",
      shows: 0,
      order: items.length + 1,
      active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      period: item.period || "",
      badge: item.badge || "",
      image: item.image || "/images/lana1.webp",
      songs: Array.isArray(item.songs) ? item.songs.join(", ") : item.songs || "",
      shows: item.shows || 0,
      order: item.order || 0,
      active: item.active ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setSavingItem(true);
    try {
      const url = "/api/admin/setlists";
      const method = editingItem ? "PUT" : "POST";
      const payload = editingItem
        ? { id: editingItem.id, ...formData }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setIsModalOpen(false);
        fetchSetlists();
      } else {
        alert("Gagal menyimpan setlist: " + (json.message || "Error"));
      }
    } catch {
      alert("Terjadi kesalahan saat menyimpan setlist.");
    } finally {
      setSavingItem(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!confirm("Hapus setlist ini?")) return;
    try {
      const res = await fetch("/api/admin/setlists", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.success) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      }
    } catch {
      alert("Gagal menghapus setlist.");
    }
  };

  const handleToggleActive = async (item) => {
    try {
      const updatedActive = !item.active;
      const res = await fetch("/api/admin/setlists", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, active: updatedActive }),
      });
      const json = await res.json();
      if (json.success) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, active: updatedActive } : i))
        );
      }
    } catch {
      alert("Gagal mengubah status aktif.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border-2 border-slate-800 p-6 md:p-8 rounded-[32px] shadow-xl">
        <div>
          <span className="px-3.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-400 font-black text-xs uppercase tracking-wider">
            Show Theater Lana
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-black text-white mt-2">
            Kelola Setlists ({items.length} item)
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Tambah, edit daftar setlist pertunjukan teater, unit songs, dan statistik total show Lana.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-accent hover:bg-accent/90 text-slate-950 font-black text-sm shadow-lg shadow-accent/20 transition-all hover:scale-105 cursor-pointer"
        >
          <i className="bx bx-plus-circle text-xl"></i>
          Tambah Setlist
        </button>
      </div>

      {/* Stats Summary Form */}
      <div className="bg-slate-900 border-2 border-slate-800 rounded-[32px] p-6 md:p-8 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <i className="bx bx-bar-chart-alt-2 text-accent text-2xl"></i> Edit Statistik Teater
          </h2>
          <span className="text-xs text-slate-400">Ditampilkan di Home & Profil Lana</span>
        </div>

        <form onSubmit={handleSaveStats} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Total Shows
            </label>
            <input
              type="number"
              value={stats.totalShows}
              onChange={(e) => setStats({ ...stats, totalShows: Number(e.target.value) })}
              className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-lg font-black text-accent focus:border-accent outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Setlists
            </label>
            <input
              type="number"
              value={stats.totalSetlists}
              onChange={(e) => setStats({ ...stats, totalSetlists: Number(e.target.value) })}
              className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-lg font-black text-white focus:border-accent outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Unit Songs
            </label>
            <input
              type="number"
              value={stats.totalUnitSongs}
              onChange={(e) => setStats({ ...stats, totalUnitSongs: Number(e.target.value) })}
              className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-lg font-black text-white focus:border-accent outline-none"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={savingStats}
              className="w-full px-6 py-3.5 rounded-2xl bg-accent hover:bg-accent/90 text-slate-950 font-black text-sm shadow-lg shadow-accent/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <i className={`bx ${savingStats ? "bx-loader-alt animate-spin" : "bx-save"} text-lg`}></i>
              {savingStats ? "Menyimpan..." : "Simpan Statistik"}
            </button>
          </div>
        </form>
      </div>

      {/* Setlists Table List */}
      <div className="bg-slate-900 border-2 border-slate-800 rounded-[32px] shadow-xl overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <i className="bx bx-list-ul text-accent text-2xl"></i> Daftar Setlists ({items.length})
          </h2>
          <span className="text-xs text-slate-400">Urut berdasarkan urutan show</span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500">
            <div className="w-10 h-10 border-4 border-slate-700 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Memuat setlists...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <i className="bx bx-calendar-x text-5xl mb-2"></i>
            <p>Belum ada setlist yang ditambahkan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-[0.75rem] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-4 px-6">Gambar</th>
                  <th className="py-4 px-6">Judul</th>
                  <th className="py-4 px-6">Periode</th>
                  <th className="py-4 px-6">Badge</th>
                  <th className="py-4 px-6">Unit Songs</th>
                  <th className="py-4 px-6 text-center">Aktif</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm font-medium text-slate-200">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-700 overflow-hidden flex-shrink-0">
                        <img
                          src={item.image || "/images/lana1.webp"}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.src = "/images/lana1.webp")}
                        />
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-white text-base">{item.title}</div>
                      <div className="text-xs text-slate-500">{item.shows || 0} Shows total</div>
                    </td>

                    <td className="py-4 px-6 text-slate-300 whitespace-nowrap">
                      {item.period || "-"}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent font-bold text-xs">
                        {item.badge || `${item.shows || 0} Show`}
                      </span>
                    </td>

                    <td className="py-4 px-6 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(item.songs) && item.songs.length > 0 ? (
                          item.songs.map((song, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[0.7rem] text-slate-300"
                            >
                              {song}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-500 italic">Belum ada lagu</span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base transition-all cursor-pointer mx-auto ${
                          item.active
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
                            : "bg-slate-800 text-slate-500 border border-slate-700 hover:bg-slate-700"
                        }`}
                        title={item.active ? "Aktif (Klik untuk non-aktifkan)" : "Non-aktif (Klik untuk aktifkan)"}
                      >
                        <i className={`bx ${item.active ? "bx-check" : "bx-x"}`}></i>
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="w-9 h-9 rounded-xl bg-accent/20 hover:bg-accent text-accent hover:text-slate-950 flex items-center justify-center transition-all cursor-pointer font-bold"
                          title="Edit Setlist"
                        >
                          <i className="bx bx-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="w-9 h-9 rounded-xl bg-red-500/20 hover:bg-red-600 text-red-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                          title="Hapus Setlist"
                        >
                          <i className="bx bx-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Add / Edit Setlist */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-slate-700 rounded-[32px] max-w-xl w-full p-8 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <h3 className="font-display text-2xl font-bold text-white">
                {editingItem ? "Edit Setlist" : "Tambah Setlists"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xl cursor-pointer"
              >
                <i className="bx bx-x"></i>
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Judul Setlist
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Aitakatta / Pajama Drive"
                  className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Periode (cth: 1 Jan - Present)
                  </label>
                  <input
                    type="text"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    placeholder="30 May 2024 - Present"
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Badge (cth: 3 Shows)
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="42 Shows"
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  URL Gambar
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="URL gambar atau pilih dari media... (cth: /images/lana1.webp)"
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const sampleImages = ["/images/lana1.webp", "/images/lana2.webp", "/images/lana3.webp"];
                      const currentIdx = sampleImages.indexOf(formData.image);
                      const nextIdx = (currentIdx + 1) % sampleImages.length;
                      setFormData({ ...formData, image: sampleImages[nextIdx] });
                    }}
                    className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl text-xs font-bold uppercase tracking-wider flex-shrink-0 cursor-pointer"
                  >
                    Pilih
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Songs — pisahkan dengan koma
                </label>
                <textarea
                  rows={3}
                  value={formData.songs}
                  onChange={(e) => setFormData({ ...formData, songs: e.target.value })}
                  placeholder="Contoh: Pajama Drive, Kagami no Naka no Jean Da Arc"
                  className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Jumlah Show
                  </label>
                  <input
                    type="number"
                    value={formData.shows}
                    onChange={(e) => setFormData({ ...formData, shows: Number(e.target.value) })}
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Urutan
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-sm font-bold text-white">Status Aktif</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-5 h-5 rounded accent-accent cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-300">
                    {formData.active ? "Aktif" : "Non-aktif"}
                  </span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingItem}
                  className="px-8 py-3.5 rounded-xl bg-accent hover:bg-accent/90 text-slate-950 font-black text-sm shadow-lg shadow-accent/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {savingItem ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
