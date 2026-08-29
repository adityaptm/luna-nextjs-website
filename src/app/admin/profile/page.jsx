"use client";

import { useState, useEffect } from "react";

export default function AdminProfilePage() {
  const [profileData, setProfileData] = useState({
    socials: {
      x: "https://x.com/AR_LanaJKT48",
      xHandle: "@AR_LanaJKT48",
      instagram: "https://www.instagram.com/jkt48.lana.a/",
      instagramHandle: "@jkt48.lana.a",
      tiktok: "https://www.tiktok.com/@jkt48.lana",
      tiktokHandle: "@jkt48.lana",
      threads: "https://www.threads.net/@jkt48.lana.a",
      threadsHandle: "@jkt48.lana.a",
      showroom: "https://www.showroom-live.com/r/JKT48_Lana",
      idn: "https://www.idn.app/jkt48_lana",
    },
    latestUpdates: {
      instagramEmbed: "https://www.instagram.com/p/DXt_VxAE4Oj/embed",
      instagramUrl: "https://www.instagram.com/jkt48.lana.a/",
      threadsEmbed: "https://www.threads.net/@jkt48.lana.a/post/DW3WfvFGtbe/embed",
      threadsUrl: "https://www.threads.net/@jkt48.lana.a",
      tweetText: "Halo semuanya! Selamat malam! Jangan lupa istirahat yaa, besok semangat lagi! 🌙✨",
      tweetDate: "2026",
      tweetUrl: "https://x.com/AR_LanaJKT48",
      tiktokVideoUrl: "https://www.tiktok.com/@jkt48.lana",
      tiktokTitle: "Video Terbaru Lana di TikTok",
    },
    rekapShow: {
      totalShows: 52,
      totalSetlists: 5,
      totalUnitSongs: 10,
      setlists: [],
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("socials"); // 'socials' | 'updates' | 'rekap'

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/profile");
      const json = await res.json();
      if (json.success && json.data) {
        setProfileData(json.data);
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      const json = await res.json();
      if (json.success) {
        alert("Pengaturan profil, sosial media, dan rekap show berhasil disimpan!");
      } else {
        alert("Gagal menyimpan: " + (json.message || "Error"));
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menyimpan pengaturan.");
    } finally {
      setSaving(false);
    }
  };

  const handleSetlistChange = (index, field, value) => {
    const updated = [...(profileData.rekapShow?.setlists || [])];
    updated[index] = { ...updated[index], [field]: value };
    setProfileData({
      ...profileData,
      rekapShow: { ...profileData.rekapShow, setlists: updated },
    });
  };

  const handleAddSetlist = () => {
    const updated = [
      ...(profileData.rekapShow?.setlists || []),
      {
        name: "Setlist Baru",
        period: "2026 - Sekarang",
        shows: 1,
        unitSongs: ["Unit Song 1"],
      },
    ];
    setProfileData({
      ...profileData,
      rekapShow: { ...profileData.rekapShow, setlists: updated },
    });
  };

  const handleRemoveSetlist = (index) => {
    const updated = profileData.rekapShow?.setlists?.filter((_, i) => i !== index);
    setProfileData({
      ...profileData,
      rekapShow: { ...profileData.rekapShow, setlists: updated },
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border-2 border-slate-800 p-6 md:p-8 rounded-[32px] shadow-xl">
        <div>
          <span className="px-3.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-black text-xs uppercase tracking-wider">
            Pengaturan Profil & Show
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-black text-white mt-2">
            Sosial Media, Updates & Rekap Show
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Ganti link sosial media Lana, kartu Latest Updates, dan total show theater secara langsung.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-accent hover:bg-accent/90 text-slate-950 font-black text-sm shadow-lg shadow-accent/20 transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
        >
          <i className={`bx ${saving ? "bx-loader-alt animate-spin" : "bx-save"} text-xl`}></i>
          {saving ? "Menyimpan..." : "Simpan Semua Perubahan"}
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900 border-2 border-slate-800 rounded-2xl">
        <button
          onClick={() => setActiveTab("socials")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "socials"
              ? "bg-accent text-slate-950 shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <i className="bx bx-share-alt text-base"></i> Link Sosial Media
        </button>
        <button
          onClick={() => setActiveTab("updates")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "updates"
              ? "bg-accent text-slate-950 shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <i className="bx bx-rss text-base"></i> Latest Updates (Embeds)
        </button>
        <button
          onClick={() => setActiveTab("rekap")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "rekap"
              ? "bg-accent text-slate-950 shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <i className="bx bx-calendar-star text-base"></i> Total & Rekap Show
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500 bg-slate-900 border-2 border-slate-800 rounded-[32px]">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Memuat pengaturan...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-8">
          {/* TAB 1: SOSIAL MEDIA */}
          {activeTab === "socials" && (
            <div className="bg-slate-900 border-2 border-slate-800 rounded-[32px] p-6 md:p-8 space-y-6 shadow-xl">
              <h2 className="font-display text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
                <i className="bx bx-share-alt text-accent text-2xl"></i> Link Akun Resmi Sosial Media Lana
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Twitter / X Profile URL
                  </label>
                  <input
                    type="text"
                    value={profileData.socials?.x || ""}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        socials: { ...profileData.socials, x: e.target.value },
                      })
                    }
                    placeholder="https://x.com/AR_LanaJKT48"
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Twitter / X Handle
                  </label>
                  <input
                    type="text"
                    value={profileData.socials?.xHandle || ""}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        socials: { ...profileData.socials, xHandle: e.target.value },
                      })
                    }
                    placeholder="@AR_LanaJKT48"
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Instagram Profile URL
                  </label>
                  <input
                    type="text"
                    value={profileData.socials?.instagram || ""}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        socials: { ...profileData.socials, instagram: e.target.value },
                      })
                    }
                    placeholder="https://www.instagram.com/jkt48.lana.a/"
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    TikTok Profile URL
                  </label>
                  <input
                    type="text"
                    value={profileData.socials?.tiktok || ""}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        socials: { ...profileData.socials, tiktok: e.target.value },
                      })
                    }
                    placeholder="https://www.tiktok.com/@jkt48.lana"
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Threads Profile URL
                  </label>
                  <input
                    type="text"
                    value={profileData.socials?.threads || ""}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        socials: { ...profileData.socials, threads: e.target.value },
                      })
                    }
                    placeholder="https://www.threads.net/@jkt48.lana.a"
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Showroom Room URL
                  </label>
                  <input
                    type="text"
                    value={profileData.socials?.showroom || ""}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        socials: { ...profileData.socials, showroom: e.target.value },
                      })
                    }
                    placeholder="https://www.showroom-live.com/r/JKT48_Lana"
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    IDN Live URL
                  </label>
                  <input
                    type="text"
                    value={profileData.socials?.idn || ""}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        socials: { ...profileData.socials, idn: e.target.value },
                      })
                    }
                    placeholder="https://www.idn.app/jkt48_lana"
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LATEST UPDATES (EMBEDS) */}
          {activeTab === "updates" && (
            <div className="bg-slate-900 border-2 border-slate-800 rounded-[32px] p-6 md:p-8 space-y-6 shadow-xl">
              <h2 className="font-display text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
                <i className="bx bx-rss text-accent text-2xl"></i> Feed Latest Updates di Halaman About Lana
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Instagram Post Embed URL
                  </label>
                  <input
                    type="text"
                    value={profileData.latestUpdates?.instagramEmbed || ""}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        latestUpdates: {
                          ...profileData.latestUpdates,
                          instagramEmbed: e.target.value,
                        },
                      })
                    }
                    placeholder="Contoh: https://www.instagram.com/p/DXt_VxAE4Oj/embed"
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none font-medium"
                  />
                  <p className="text-[0.75rem] text-slate-500 mt-1">
                    Gunakan link post Instagram yang diakhiri dengan /embed
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Threads Post Embed URL
                  </label>
                  <input
                    type="text"
                    value={profileData.latestUpdates?.threadsEmbed || ""}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        latestUpdates: {
                          ...profileData.latestUpdates,
                          threadsEmbed: e.target.value,
                        },
                      })
                    }
                    placeholder="Contoh: https://www.threads.net/@jkt48.lana.a/post/DW3WfvFGtbe/embed"
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    X / Tweet Teks Terkini
                  </label>
                  <textarea
                    rows={3}
                    value={profileData.latestUpdates?.tweetText || ""}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        latestUpdates: {
                          ...profileData.latestUpdates,
                          tweetText: e.target.value,
                        },
                      })
                    }
                    placeholder="Tulis tweet atau postingan terbaru Lana di X..."
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none font-medium resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Link Postingan X / Tweet Asli
                  </label>
                  <input
                    type="text"
                    value={profileData.latestUpdates?.tweetUrl || ""}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        latestUpdates: {
                          ...profileData.latestUpdates,
                          tweetUrl: e.target.value,
                        },
                      })
                    }
                    placeholder="https://x.com/AR_LanaJKT48/status/..."
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-accent outline-none font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REKAP SHOW */}
          {activeTab === "rekap" && (
            <div className="bg-slate-900 border-2 border-slate-800 rounded-[32px] p-6 md:p-8 space-y-6 shadow-xl">
              <h2 className="font-display text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
                <i className="bx bx-calendar-star text-accent text-2xl"></i> Total Show & Statistik Theater Lana
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Total Show
                  </label>
                  <input
                    type="number"
                    value={profileData.rekapShow?.totalShows || 0}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        rekapShow: {
                          ...profileData.rekapShow,
                          totalShows: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-lg text-accent font-black focus:border-accent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Total Setlist
                  </label>
                  <input
                    type="number"
                    value={profileData.rekapShow?.totalSetlists || 0}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        rekapShow: {
                          ...profileData.rekapShow,
                          totalSetlists: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-lg text-accent font-black focus:border-accent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Total Unit Song
                  </label>
                  <input
                    type="number"
                    value={profileData.rekapShow?.totalUnitSongs || 0}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        rekapShow: {
                          ...profileData.rekapShow,
                          totalUnitSongs: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-lg text-accent font-black focus:border-accent outline-none"
                  />
                </div>
              </div>

              {/* Setlist List */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-white">Daftar Setlist Theater Lana</h3>
                  <button
                    type="button"
                    onClick={handleAddSetlist}
                    className="px-4 py-2 rounded-xl bg-accent text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-accent/90 transition-all cursor-pointer"
                  >
                    + Tambah Setlist
                  </button>
                </div>

                <div className="space-y-4">
                  {profileData.rekapShow?.setlists?.map((item, index) => (
                    <div
                      key={index}
                      className="p-5 rounded-2xl bg-slate-950 border-2 border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleSetlistChange(index, "name", e.target.value)}
                          placeholder="Nama Setlist (contoh: Aitakatta)"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:border-accent outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSetlist(index)}
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-all text-base flex-shrink-0"
                          title="Hapus setlist ini"
                        >
                          <i className="bx bx-trash"></i>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[0.7rem] font-bold text-slate-400 uppercase">
                            Periode Show
                          </label>
                          <input
                            type="text"
                            value={item.period || ""}
                            onChange={(e) => handleSetlistChange(index, "period", e.target.value)}
                            placeholder="01 Mar 2024 - Sekarang"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-accent outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[0.7rem] font-bold text-slate-400 uppercase">
                            Jumlah Show
                          </label>
                          <input
                            type="number"
                            value={item.shows || 0}
                            onChange={(e) =>
                              handleSetlistChange(index, "shows", Number(e.target.value))
                            }
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-accent font-bold focus:border-accent outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[0.7rem] font-bold text-slate-400 uppercase">
                          Unit Songs (Pisahkan dengan koma)
                        </label>
                        <input
                          type="text"
                          value={
                            Array.isArray(item.unitSongs)
                              ? item.unitSongs.join(", ")
                              : item.unitSongs || ""
                          }
                          onChange={(e) =>
                            handleSetlistChange(
                              index,
                              "unitSongs",
                              e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                            )
                          }
                          placeholder="Nageki no Figure, Namida no Shounan, Nagisa no Cherry"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-accent outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-4 rounded-2xl bg-accent hover:bg-accent/90 text-slate-950 font-black text-sm uppercase tracking-widest shadow-xl shadow-accent/20 transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan Semua Perubahan"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
