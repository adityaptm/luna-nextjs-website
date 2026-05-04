import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error("GET Messages Error:", error);
    return NextResponse.json({ success: false, error: "Gagal mengambil pesan" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, message, imageUrl } = await req.json();

    if (!name || !message) {
      return NextResponse.json({ success: false, error: "Nama dan pesan harus diisi!" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('messages')
      .insert([
        { 
          name, 
          message, 
          "imageUrl": imageUrl, // Menggunakan quote agar sesuai dengan case-sensitivity Postgres jika diperlukan
          timestamp: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase Insert Error Detail:", error);
      throw error;
    }

    return NextResponse.json({ success: true, data: data });
  } catch (error) {
    console.error("POST Messages Error Catch Block:", error);
    return NextResponse.json({ success: false, error: "Gagal mengirim pesan" }, { status: 500 });
  }
}
