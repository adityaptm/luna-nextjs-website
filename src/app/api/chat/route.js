import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ reply: "Hmm, kamu nanya apa tadi? Aku kurang denger nih!" });
    }

    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyBeEo01O1zAR8gA7areWrL4mcMp2adSf0E";
    
    if (!apiKey) {
      console.error("GEMINI_API_KEY tidak ditemukan di environment variables");
      return NextResponse.json({ reply: "Luna lagi maintenance sebentar, coba lagi ya!" });
    }

    // Menggunakan Gemini 3.1 sesuai dengan contoh yang berhasil
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`;

    const prompt = `Kamu adalah Luna, asisten pribadi Aurhel Alana (JKT48 Gen 12). 
    Gaya bicara santai, ceria, friendly, panggil diri kamu 'aku'. Jawab dalam bahasa Indonesia yang natural.
    Hanya jawab seputar Alana dan JKT48 saja. Kalau ditanya di luar topik itu, arahkan balik ke topik Lana.
    Data Lana: lahir 14 September 2006 di Bekasi, zodiak Virgo, tinggi 162cm.
    Suka strawberry, warna favorit pink. Debut theater 1 Maret 2024 (set Aitakatta).
    Member JKT48 Generasi 12. Nama lengkap: Aurhel Alana.
    Pesan user: ${message}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    
    if (!response.ok || data.error) {
      console.error("Gemini API Error Status:", response.status);
      console.error("Gemini API Error Detail:", JSON.stringify(data.error, null, 2));
      
      if (response.status === 429) {
        return NextResponse.json({ reply: "Aduh, banyak banget yang tanya Luna nih 😅 Tunggu 1 menit ya biar aku istirahat dulu!" });
      }

      if (response.status === 400) {
        return NextResponse.json({ reply: "Waduh, pertanyaannya kurang aku mengerti. Coba tanya yang lain ya!" });
      }
      
      return NextResponse.json({ reply: `Ups, ada masalah teknis nih (${response.status}). Coba lagi ya!` });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!reply) {
      return NextResponse.json({ reply: "Luna lagi bingung mau jawab apa. Tanya yang lain yuk!" });
    }

    return NextResponse.json({ reply: reply.replace(/[*#`]/g, '').trim() });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ reply: "Koneksi ke Luna gagal nih. Coba refresh dan tanya lagi ya!" }, { status: 500 });
  }
}
