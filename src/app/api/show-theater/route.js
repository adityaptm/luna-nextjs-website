import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 60; // Cache data selama 1 menit

export async function GET() {
  try {
    const base =
      process.env.JKT48CONNECT_BASE_URL ||
      "https://v2.jkt48connect.com/api/jkt48";
    const apiKey = process.env.JKT48CONNECT_PRIORITY_TOKEN || "sJbpVqLinYlp";

    // 1. Cek keberadaan Key
    if (!apiKey) {
      console.error(
        "DEBUG ERROR: JKT48CONNECT_PRIORITY_TOKEN tidak ditemukan di .env.local",
      );
      return NextResponse.json(
        { success: false, message: "Server .env not configured" },
        { status: 500 },
      );
    }

    // 2. Fetch data member Lana (dengan cara pengiriman Key ganda)
    // Menambahkan apikey di URL DAN di Header x-api-key, ditambah timeout 10 detik
    const res1 = await fetch(`${base}/member/lana?priority_token=${apiKey}`, {
      method: "GET",
      headers: {
        "x-priority-token": apiKey,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(10000),
      next: { revalidate: 60 },
    });

    // Jika masih 401 atau 500, berarti Key memang ditolak atau server pusat bermasalah
    if (!res1.ok) {
      const errorText = await res1.text().catch(() => "Unknown error");
      console.error(`DEBUG: Upstream returned ${res1.status} - ${errorText}`);
      
      let friendlyMessage = `JKT48Connect Error: ${res1.status}.`;
      if (res1.status === 500) {
        friendlyMessage = "Server JKT48Connect sedang bermasalah (500). Coba lagi nanti ya!";
      } else if (res1.status === 401 || res1.status === 403) {
        friendlyMessage = "Token API tidak valid atau kadaluarsa.";
      }

      return NextResponse.json(
        {
          success: false,
          message: friendlyMessage,
        },
        { status: res1.status },
      );
    }

    const body1 = await res1.json();
    const shows = body1?.data?.upcomingTheater || body1?.upcomingTheater || [];

    if (shows.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Tidak ada jadwal",
        data: null,
      });
    }

    // 3. Ambil Detail Show pertama
    const showId = shows[0].id;
    const res2 = await fetch(`${base}/theater/${showId}?priority_token=${apiKey}`, {
      headers: { "x-priority-token": apiKey },
      signal: AbortSignal.timeout(10000),
    });

    const body2 = await res2.json();
    const show = body2?.data || body2;

    // 4. Mapping data bersih untuk frontend
    return NextResponse.json({
      success: true,
      data: {
        title: show.title || "TBA",
        date: show.date || "",
        poster: show.poster || show.setlist?.poster || "",
        members: show.members || show.lineup || [],
      },
    });
  } catch (err) {
    console.error("CRITICAL ROUTE ERROR:", err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
