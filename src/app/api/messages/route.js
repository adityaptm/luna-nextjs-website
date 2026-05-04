import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) throw error;

    // Map spotifyid back to spotifyId for frontend
    const formattedData = (data || []).map(msg => ({
      ...msg,
      spotifyId: msg.spotifyid
    }));

    return NextResponse.json({ success: true, data: formattedData });
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

    const { data, error } = await supabase
      .from('messages')
      .insert([
        { 
          name, 
          message, 
          song, 
          spotifyid: spotifyId, // Postgres uses lowercase if not quoted
          timestamp: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase Insert Error Detail:", error);
      throw error;
    }

    // Map back for the response
    const formattedData = {
      ...data,
      spotifyId: data.spotifyid
    };

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("POST Messages Error Catch Block:", error);
    return NextResponse.json({ success: false, error: "Gagal mengirim pesan" }, { status: 500 });
  }
}
