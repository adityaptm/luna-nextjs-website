import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 60;

export async function GET() {
  try {
    const base =
      process.env.JKT48CONNECT_BASE_URL ||
      "https://v2.jkt48connect.com/api/jkt48";
    const apiKey = process.env.JKT48CONNECT_PRIORITY_TOKEN || "sJbpVqLinYlp";

    let res;
    try {
      res = await fetch(`${base}/theater?priority_token=${apiKey}`, {
        method: "GET",
        headers: {
          "x-priority-token": apiKey,
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(12000),
        next: { revalidate: 60 },
      });
    } catch (fetchErr) {
      // Network error or timeout — return gracefully so the UI can show a friendly state
      console.warn("SHOW-THEATER: External API unreachable:", fetchErr.message);
      return NextResponse.json({
        success: true,
        message: "Layanan jadwal sedang tidak dapat dijangkau. Coba lagi nanti.",
        data: null,
      });
    }

    if (!res.ok) {
      return NextResponse.json({
        success: true,
        message: "Upstream service unavailable",
        data: null,
      });
    }

    let body;
    try {
      body = await res.json();
    } catch {
      return NextResponse.json({ success: true, data: null });
    }

    const allShows = body.data || body.theater || (Array.isArray(body) ? body : []);

    if (allShows.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Tidak ada jadwal",
        data: null,
      });
    }

    // Filter shows for Lana (Aurhel Alana)
    const now = new Date();
    const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const lanaShows = allShows
      .filter((show) => {
        const lineup = show.lineup || show.members || [];
        const hasLana = lineup.some(
          (m) =>
            (m.name && m.name.toLowerCase().includes("alana")) ||
            m.url_key === "lana" ||
            String(m.id || m.member_id) === "33"
        );
        if (!hasLana) return false;

        const showDate = new Date(show.date);
        return showDate >= cutoff;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (lanaShows.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Tidak ada jadwal upcoming untuk Lana",
        data: null,
      });
    }

    const formattedShows = lanaShows.map((show) => ({
      id: show.schedule_id || show.id || show.reference_code,
      title: show.title || "TBA",
      date: show.date || "",
      startTime: show.start_time || "",
      poster: show.poster || show.banner || "",
      members: show.lineup || show.members || [],
      idnTheater: show.idnTheater || null,
      url: show.reference_code
        ? `https://jkt48.com/purchase/schedule/show?code=${show.reference_code}`
        : null,
    }));

    return NextResponse.json({ success: true, data: formattedShows });
  } catch (err) {
    console.error("SHOW-THEATER ERROR:", err.message);
    // Return graceful null instead of 500
    return NextResponse.json({
      success: true,
      message: "Gagal mengambil jadwal. Coba lagi nanti.",
      data: null,
    });
  }
}
