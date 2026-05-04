"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const getSpotifyId = (url) => {
  if (!url) return null;
  const match = url.match(/track\/([a-zA-Z0-9]+)/) || url.match(/spotify:track:([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
};

export default function MessageBoard() {
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({ name: "", message: "", song: "" });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Spotify Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);

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

  // Spotify Search Effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSearchResults(data.tracks || []);
      } catch (err) {
        console.error("Spotify Search Error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;

    // Optional: validate spotify link
    const spotifyId = getSpotifyId(formData.song);
    if (formData.song && !spotifyId) {
      alert("Link Spotify tidak valid! Pastikan link lagu (track) yang benar.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          spotifyId // Simpan ID untuk mempermudah embed
        })
      });
      const json = await res.json();
      if (json.success) {
        setFormData({ name: "", message: "", song: "" });
        setSelectedTrack(null);
        setSearchQuery("");
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
          Tuliskan pesan dukunganmu untuk Aurhel Alana Tirta dan lampirkan lagu favoritmu dari Spotify!
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
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 px-1">Cari Lagu Spotify (Opsional)</label>
                <div className="relative">
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="Ketik judul lagu atau nama artis..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-3 pr-12 text-[0.95rem] outline-none focus:border-accent transition-all dark:text-white"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (!e.target.value) setSearchResults([]);
                      }}
                    />
                    {isSearching ? (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <i className="bx bx-search absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl"></i>
                    )}
                  </div>

                  {/* Search Results Dropdown */}
                  {(searchResults.length > 0 || (searchQuery.length > 2 && !isSearching)) && (
                    <div className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                      {searchResults.length > 0 ? (
                        searchResults.map((track) => (
                          <button
                            key={track.id}
                            type="button"
                            className="w-full flex items-center gap-4 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left border-b border-slate-100 dark:border-slate-700 last:border-none"
                            onClick={() => {
                              setSelectedTrack(track);
                              setFormData({ ...formData, song: track.external_url });
                              setSearchQuery("");
                              setSearchResults([]);
                            }}
                          >
                            <img src={track.thumbnail} alt={track.name} className="w-10 h-10 rounded-lg object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{track.name}</p>
                              <p className="text-slate-500 text-xs truncate">{track.artist}</p>
                            </div>
                            <i className="bx bx-plus-circle text-accent text-xl"></i>
                          </button>
                        ))
                      ) : (
                        <div className="px-5 py-8 text-center">
                          <i className="bx bx-search-alt-2 text-3xl text-slate-300 mb-2"></i>
                          <p className="text-slate-500 text-sm">Lagu tidak ditemukan atau ada kendala koneksi Spotify.</p>
                          <p className="text-[0.65rem] text-slate-400 mt-1 italic">*Pastikan akun Spotify App Anda Premium</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Selected Track Preview */}
                  {selectedTrack && (
                    <div className="mt-4 bg-accent/5 border-2 border-accent/20 rounded-2xl p-4 flex items-center gap-4 relative animate-in zoom-in-95">
                      <img src={selectedTrack.thumbnail} alt={selectedTrack.name} className="w-14 h-14 rounded-xl object-cover shadow-sm" />
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-slate-900 dark:text-white text-sm truncate">{selectedTrack.name}</p>
                        <p className="text-slate-600 dark:text-slate-400 text-xs font-bold truncate">{selectedTrack.artist}</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          setSelectedTrack(null);
                          setFormData({ ...formData, song: "" });
                        }}
                        className="bg-white dark:bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center text-red-500 shadow-md hover:scale-110 active:scale-90 transition-all"
                      >
                        <i className="bx bx-x"></i>
                      </button>
                    </div>
                  )}
                </div>
                {!selectedTrack && (
                  <p className="text-[0.7rem] text-slate-500 mt-2 px-1 italic">
                    *Cari lagu favoritmu dan klik untuk melampirkannya
                  </p>
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
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
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

                  {msg.spotifyId && (
                    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                      <iframe 
                        src={`https://open.spotify.com/embed/track/${msg.spotifyId}?utm_source=generator&theme=0`} 
                        width="100%" 
                        height="152" 
                        frameBorder="0" 
                        allowFullScreen="" 
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                        loading="lazy"
                        className="bg-transparent"
                      ></iframe>
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
