import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const revalidate = 60;

const annPath = path.join(process.cwd(), "src/data/announcements.json");

function getLocalAnnouncements() {
  try {
    if (fs.existsSync(annPath)) {
      const data = JSON.parse(fs.readFileSync(annPath, "utf-8"));
      return data
        .filter((a) => a.published !== false)
        .map((a) => ({
          id: String(a.id),
          title: a.title,
          category: a.category || "Official",
          url: "#",
          content: a.content,
          date: a.date || new Date().toISOString(),
          isCustom: true,
        }));
    }
  } catch {}
  return [];
}

export async function GET() {
  const localAnnouncements = getLocalAnnouncements();

  try {
    const base = process.env.JKT48CONNECT_BASE_URL || "https://v2.jkt48connect.com/api/jkt48";
    const apiKey = process.env.JKT48CONNECT_PRIORITY_TOKEN || "sJbpVqLinYlp";

    let externalNews = [];
    try {
      const res = await fetch(`${base}/news?priority_token=${apiKey}&apikey=${apiKey}`, {
        method: "GET",
        headers: {
          "x-priority-token": apiKey,
          "x-api-key": apiKey,
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(8000),
        next: { revalidate: 60 },
      });

      if (res.ok) {
        const newsData = await res.json();
        externalNews = newsData.news || [];
      }
    } catch (fetchErr) {
      console.warn("External News fetch skipped:", fetchErr.message);
    }

    const combined = [...localAnnouncements, ...externalNews];

    return NextResponse.json({
      success: true,
      data: combined,
    });
  } catch (err) {
    console.error("NEWS API ERROR:", err.message);
    return NextResponse.json({
      success: true,
      data: localAnnouncements,
    });
  }
}
