import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 3600; // Cache birthday selama 1 jam

export async function GET() {
  try {
    const base = process.env.JKT48CONNECT_BASE_URL || "https://v2.jkt48connect.com/api/jkt48";
    const apiKey = process.env.JKT48CONNECT_PRIORITY_TOKEN || "sJbpVqLinYlp";

    let res;
    try {
      res = await fetch(`${base}/birthday?priority_token=${apiKey}&apikey=${apiKey}`, {
        method: "GET",
        headers: {
          "x-priority-token": apiKey,
          "x-api-key": apiKey,
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(8000),
        next: { revalidate: 3600 },
      });
    } catch (fetchErr) {
      console.warn("BIRTHDAY API: External API unreachable:", fetchErr.message);
      return NextResponse.json({
        success: true,
        message: "Layanan birthday sedang offline.",
        data: [],
      });
    }

    if (!res.ok) {
      return NextResponse.json({
        success: true,
        message: "Upstream service unavailable",
        data: [],
      });
    }

    let birthdayData = [];
    try {
      birthdayData = await res.json();
    } catch {
      return NextResponse.json({ success: true, data: [] });
    }

    return NextResponse.json({
      success: true,
      data: Array.isArray(birthdayData) ? birthdayData : (birthdayData.data || []),
    });
  } catch (err) {
    console.error("BIRTHDAY API ERROR:", err.message);
    return NextResponse.json({ success: true, data: [] });
  }
}
