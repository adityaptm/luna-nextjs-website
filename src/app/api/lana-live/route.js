import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 30;

export async function GET() {
  try {
    const base = process.env.JKT48CONNECT_BASE_URL || "https://v2.jkt48connect.com/api/jkt48";
    const apiKey = process.env.JKT48CONNECT_PRIORITY_TOKEN || "sJbpVqLinYlp";

    let res;
    try {
      res = await fetch(`${base}/live?priority_token=${apiKey}&apikey=${apiKey}`, {
        method: "GET",
        headers: {
          "x-priority-token": apiKey,
          "x-api-key": apiKey,
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(8000),
        next: { revalidate: 30 },
      });
    } catch (fetchErr) {
      // Network error or timeout — return gracefully
      console.warn("LANA LIVE: External API unreachable:", fetchErr.message);
      return NextResponse.json({ success: true, data: null });
    }

    if (!res.ok) {
      return NextResponse.json({ success: true, data: null });
    }

    let liveData;
    try {
      liveData = await res.json();
    } catch {
      return NextResponse.json({ success: true, data: null });
    }

    const data = Array.isArray(liveData) ? liveData : (liveData.data || []);

    const lanaLive = data.find((live) =>
      live.name?.toLowerCase().includes("lana") ||
      live.url_key?.toLowerCase().includes("lana")
    );

    return NextResponse.json({ success: true, data: lanaLive || null });
  } catch (err) {
    console.error("LANA LIVE API ERROR:", err.message);
    // Return graceful null instead of 500 so the UI doesn't break
    return NextResponse.json({ success: true, data: null });
  }
}
