import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/data/messages.json");

async function ensureFile() {
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, JSON.stringify([]));
  }
}

export async function GET() {
  try {
    await ensureFile();
    const data = await fs.readFile(DATA_PATH, "utf-8");
    let messages = [];
    try {
      messages = data ? JSON.parse(data) : [];
    } catch {
      messages = [];
    }
    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error("GET Messages Error:", error);
    return NextResponse.json({ success: false, error: "Gagal mengambil pesan" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, message, song, spotifyId } = await req.json();

    if (!name || !message) {
      return NextResponse.json({ success: false, error: "Nama dan pesan harus diisi!" }, { status: 400 });
    }

    await ensureFile();
    const data = await fs.readFile(DATA_PATH, "utf-8");
    let messages = [];
    try {
      messages = data ? JSON.parse(data) : [];
    } catch {
      messages = [];
    }

    const newMessage = {
      id: Date.now(),
      name,
      message,
      song,
      spotifyId,
      timestamp: new Date().toISOString()
    };

    messages.unshift(newMessage); // Tambahkan ke awal array (terbaru di atas)
    await fs.writeFile(DATA_PATH, JSON.stringify(messages, null, 2));

    return NextResponse.json({ success: true, data: newMessage });
  } catch (error) {
    console.error("POST Messages Error:", error);
    return NextResponse.json({ success: false, error: "Gagal mengirim pesan" }, { status: 500 });
  }
}
