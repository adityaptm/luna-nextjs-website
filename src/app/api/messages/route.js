import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import fs from "fs";
import path from "path";

const messagesFilePath = path.join(process.cwd(), "src/data/messages.json");

function getLocalMessages() {
  try {
    if (fs.existsSync(messagesFilePath)) {
      const data = fs.readFileSync(messagesFilePath, "utf-8");
      return JSON.parse(data || "[]");
    }
  } catch (err) {
    console.error("Local messages read error:", err);
  }
  return [];
}

function saveLocalMessage(newMsg) {
  try {
    const list = getLocalMessages();
    const updated = [newMsg, ...list];
    fs.writeFileSync(messagesFilePath, JSON.stringify(updated, null, 2), "utf-8");
    return newMsg;
  } catch (err) {
    console.error("Local messages save error:", err);
  }
  return newMsg;
}

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: false });

      if (!error && data) {
        return NextResponse.json({ success: true, data });
      }
    }

    // Fallback to local storage
    const localData = getLocalMessages();
    return NextResponse.json({ success: true, data: localData });
  } catch (error) {
    console.error("GET Messages Error:", error);
    const localData = getLocalMessages();
    return NextResponse.json({ success: true, data: localData });
  }
}

export async function POST(req) {
  try {
    const { name, message, imageUrl } = await req.json();

    if (!name || !message) {
      return NextResponse.json({ success: false, error: "Nama dan pesan harus diisi!" }, { status: 400 });
    }

    const newEntry = {
      id: Date.now(),
      name,
      message,
      imageUrl: imageUrl || null,
      timestamp: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('messages')
          .insert([
            { 
              name, 
              message, 
              "imageUrl": imageUrl,
              timestamp: newEntry.timestamp
            }
          ])
          .select()
          .single();

        if (!error && data) {
          return NextResponse.json({ success: true, data });
        }
      } catch (sbErr) {
        console.warn("Supabase insert failed, falling back to local file:", sbErr);
      }
    }

    // Fallback save to local messages.json
    saveLocalMessage(newEntry);
    return NextResponse.json({ success: true, data: newEntry });
  } catch (error) {
    console.error("POST Messages Error:", error);
    return NextResponse.json({ success: false, error: "Gagal mengirim pesan" }, { status: 500 });
  }
}
