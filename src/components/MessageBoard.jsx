"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";



export default function MessageBoard() {
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({ name: "", message: "", song: "" });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
      if (json.success) setMessages(json.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Realtime subscription
    const subscription = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          setMessages((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;

    setSubmitting(true);
    let finalImageUrl = null;

    try {
      // 1. Upload Image if exists
      if (selectedImage) {
        setUploadingImage(true);
        const fileExt = selectedImage.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('message_images')
          .upload(fileName, selectedImage);

        setUploadingImage(false);

        if (uploadError) {
          console.error("Upload Error:", uploadError);
          alert("Gagal mengunggah gambar. Pastikan Anda sudah menjalankan SQL untuk storage!");
          setSubmitting(false);
          return;
        }
        
        const { data: publicUrlData } = supabase.storage
          .from('message_images')
          .getPublicUrl(fileName);
          
        finalImageUrl = publicUrlData.publicUrl;
      }

      // 2. Post Message
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          imageUrl: finalImageUrl
        })
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

  return (
    <div className="w-full">
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold text-slate-950 dark:text-white mb-4">
          Pesan Untuk Lana <i className="bx bx-envelope text-accent"></i>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 font-medium max-w-xl mx-auto">
          Tuliskan pesan dukunganmu untuk Aurhel Alana Tirta dan lampirkan fanart atau foto favoritmu!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* FORM SECTION */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[32px] p-8 shadow-xl sticky top-24">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <i className="bx bx-edit-alt text-accent"></i> Kirim Pesan
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 px-1">Nama Kamu</label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: Aurhel Alana Tirta"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-3 text-[0.95rem] outline-none focus:border-accent transition-all dark:text-white"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 px-1">Pilih Gambar (Opsional)</label>
                
                {!imagePreview ? (
                  <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <i className="bx bx-image-add text-4xl text-slate-300 dark:text-slate-600 group-hover:text-accent transition-colors mb-2"></i>
                    <p className="text-sm text-slate-500 font-medium">Klik atau drop gambar di sini</p>
                    <p className="text-[0.65rem] text-slate-400 mt-1">*Maksimal 5MB (JPG, PNG, WEBP)</p>
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 group">
                    <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button"
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                      >
                        <i className="bx bx-trash"></i> Hapus
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 px-1">Pesan</label>
                <textarea 
                  required
                  rows="4"
                  placeholder="Tulis pesan semangatmu di sini..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 text-[0.95rem] outline-none focus:border-accent transition-all resize-none dark:text-white"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full bg-accent text-slate-900 font-black py-4 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-widest text-sm"
              >
                {submitting || uploadingImage ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    <span>{uploadingImage ? "Mengunggah Gambar..." : "Mengirim..."}</span>
                  </div>
                ) : (
                  <><i className="bx bxs-paper-plane"></i> Kirim Sekarang</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* LIST SECTION */}
        <div className="lg:col-span-3">
          <div className="space-y-6">
            {loading && messages.length === 0 ? (
              <div className="text-center py-20 opacity-50">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
                <p>Memuat pesan...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] p-20 text-center">
                <i className="bx bx-chat text-6xl text-slate-300 dark:text-slate-700 mb-4"></i>
                <p className="text-slate-500 font-medium">Belum ada pesan. Jadi yang pertama mengirim!</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div 
                  key={msg.id} 
                  className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[32px] p-8 shadow-md hover:shadow-xl transition-all animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-accent/10 border-2 border-accent/20 flex items-center justify-center text-accent text-2xl font-black">
                        {msg.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-[1.1rem]">{msg.name}</h4>
                        <p className="text-[0.75rem] font-black text-slate-400 uppercase tracking-wider">
                          {new Date(msg.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 mb-6">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium italic">"{msg.message}"</p>
                  </div>

                  {msg.imageUrl && (
                    <div className="rounded-2xl overflow-hidden shadow-sm">
                      <img 
                        src={msg.imageUrl} 
                        alt="Lampiran" 
                        className="w-full max-h-80 object-cover hover:scale-105 transition-transform duration-500" 
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
