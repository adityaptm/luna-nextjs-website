"use client";

import { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function MessageBoard() {
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({ name: "", message: "", song: "" });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewModalImage, setPreviewModalImage] = useState(null);

  // Image Upload States
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran gambar maksimal 5MB!");
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/messages");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) setMessages(json.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    if (!isSupabaseConfigured) return;

    try {
      const subscription = supabase
        .channel("messages-changes")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          (payload) => {
            setMessages((prev) => [payload.new, ...prev]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    } catch (err) {
      console.warn("Realtime subscription error:", err);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;

    setSubmitting(true);
    let finalImageUrl = null;

    try {
      if (selectedImage) {
        setUploadingImage(true);
        const fileExt = selectedImage.name.includes(".")
          ? selectedImage.name.split(".").pop()
          : "jpg";
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("message_images")
          .upload(fileName, selectedImage);

        setUploadingImage(false);

        if (uploadError) {
          console.error("Upload Error:", uploadError);
        } else {
          const { data: publicUrlData } = supabase.storage
            .from("message_images")
            .getPublicUrl(fileName);
          finalImageUrl = publicUrlData.publicUrl;
        }
      }

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          imageUrl: finalImageUrl,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setFormData({ name: "", message: "", song: "" });
        setSelectedImage(null);
        setImagePreview(null);
        fetchMessages();
      }
    } catch (err) {
      console.error("Submit Error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredMessages = messages.filter(
    (m) =>
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
            <i className="bx bx-envelope text-pink-500"></i> Pesan &amp; Dukungan Fans
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-0.5">
            Tuliskan pesan cinta &amp; semangat untuk Aurhel Alana Tirta!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-400 font-bold text-xs">
            {messages.length} Pesan Masuk
          </span>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Sticky Form (5 Cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <i className="bx bx-edit-alt text-pink-500 text-xl"></i> Kirim Pesan Baru
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Nama Kamu
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Aditya / Fans Lana"
                  className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-pink-500 outline-none font-medium transition-all"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Pesan Dukungan
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tulis pesan semangatmu untuk Lana di sini..."
                  className="w-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm text-slate-900 dark:text-white focus:border-pink-500 outline-none resize-none leading-relaxed transition-all font-medium"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Lampirkan Foto / Fanart (Opsional)
                </label>

                {!imagePreview ? (
                  <label className="block w-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-pink-400 rounded-2xl p-4 text-center bg-white/60 dark:bg-slate-950/60 hover:bg-pink-500/5 transition-all cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <i className="bx bx-image-add text-3xl text-slate-400 group-hover:text-pink-500 transition-colors"></i>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-bold mt-1">
                      Pilih Foto / Gambar
                    </p>
                    <p className="text-[0.65rem] text-slate-400 mt-0.5">
                      JPG, PNG, WEBP (Maksimal 5MB)
                    </p>
                  </label>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-pink-500/40 group bg-slate-950">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                        }}
                        className="bg-red-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 hover:scale-105 transition-all cursor-pointer"
                      >
                        <i className="bx bx-trash"></i> Hapus Foto
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-400 hover:to-rose-500 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-pink-900/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs uppercase tracking-wider"
              >
                {submitting || uploadingImage ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{uploadingImage ? "Mengunggah..." : "Mengirim..."}</span>
                  </div>
                ) : (
                  <>
                    <i className="bx bxs-paper-plane text-base"></i> Kirim Pesan Sekarang
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Message Grid / Wall (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <i className="bx bx-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
            <input
              type="text"
              placeholder="Cari pesan atau nama pengirim..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-2.5 text-xs md:text-sm text-slate-900 dark:text-white focus:border-pink-500 outline-none font-medium"
            />
          </div>

          {/* Scrollable Card Wall Container */}
          <div className="max-h-[680px] overflow-y-auto pr-1.5 space-y-3.5">
            {loading && messages.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <div className="w-8 h-8 border-4 border-slate-700 border-t-pink-500 rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-xs">Memuat pesan...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="bg-slate-50 dark:bg-slate-900/60 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
                <i className="bx bx-chat text-5xl text-slate-300 dark:text-slate-700 mb-2"></i>
                <p className="text-slate-500 text-sm font-bold">
                  {searchTerm ? "Tidak ada pesan yang cocok dengan pencarian." : "Belum ada pesan. Jadilah yang pertama mengirim!"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredMessages.map((msg, i) => (
                  <div
                    key={msg.id || i}
                    className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 hover:border-pink-500/40 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Sender Top */}
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-500 font-black text-sm flex-shrink-0">
                          {msg.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                            {msg.name}
                          </h4>
                          <p className="text-[0.65rem] text-slate-400 font-medium">
                            {msg.timestamp
                              ? new Date(msg.timestamp).toLocaleDateString(
                                  "id-ID",
                                  { day: "numeric", month: "short", year: "numeric" }
                                )
                              : "Baru saja"}
                          </p>
                        </div>
                      </div>

                      {/* Text */}
                      <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed italic mb-3">
                        &ldquo;{msg.message}&rdquo;
                      </p>
                    </div>

                    {/* Image Thumbnail if attached */}
                    {msg.imageUrl && (
                      <div
                        className="mt-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-video cursor-pointer relative group bg-black"
                        onClick={() => setPreviewModalImage(msg.imageUrl)}
                      >
                        <img
                          src={msg.imageUrl}
                          alt="Lampiran Foto"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                          <i className="bx bx-zoom-in text-base"></i> Lihat Foto
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Preview Modal for Message Attachments */}
      {previewModalImage && (
        <div
          className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewModalImage(null)}
        >
          <div className="relative max-w-2xl max-h-[85vh]">
            <button
              onClick={() => setPreviewModalImage(null)}
              className="absolute -top-10 right-0 text-white text-2xl hover:text-pink-400 cursor-pointer"
            >
              <i className="bx bx-x"></i>
            </button>
            <img
              src={previewModalImage}
              alt="Preview"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
