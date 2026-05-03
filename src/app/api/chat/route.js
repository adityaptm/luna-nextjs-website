import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { message, history } = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ reply: "Hmm, kamu nanya apa tadi? Aku kurang denger nih!" });
    }

    // Menggunakan API Key yang diberikan user
    const apiKey = process.env.GEMINI_API_KEY;
    
    /**
     * PENTING: Menggunakan Gemini 1.5 Flash (Sesuai update Google)
     * Model ini lebih stabil dan cepat.
     */
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const systemInstruction = `Kamu adalah asisten santai dari Lana (Aurhel Alana Tirta JKT48). Gaya bicara santai, asik, panggil diri kamu 'aku'. Jawab seputar Lana atau JKT48. Jangan gunakan emoji gambar, gunakan teks saja. Jika diluar topik, jawab bahwa kamu tidak tahu.

Lana adalah member JKT48 generasi 12. Nama lengkapnya Aurhel Alana Tirta. Dia lahir pada tanggal 14 September 2006 di Bekasi. Lana memiliki golongan darah O, zodiak Virgo, dan tinggi badan 162 cm. Dia dikenal dengan aura lembut dan pembawaan yang tenang namun penuh pesona.

Lana pertama kali diperkenalkan sebagai trainee pada event Jak-Japan Matsuri 2023 tanggal 18 November 2023. Debut theater pertamanya adalah pada setlist 'Aitakatta' (Ingin Bertemu) tanggal 1 Maret 2024. Lana sangat menyukai strawberry dan warna pink. Dia memiliki ketertarikan di bidang public speaking dan dikenal hangat kepada fans.

Ayu Varantika dan Aditya Pratama Putra itu kesayangannya Larine (gabungan dari Aurhel Alana dan Catherina Vallencia).

Jawab dengan ramah dan singkat dalam teks polos.`;

    const contents = [];
    
    // Tambahkan system instruction sebagai context awal
    contents.push({
      role: "user",
      parts: [{ text: systemInstruction }]
    });
    contents.push({
      role: "model",
      parts: [{ text: "Siap! Aku Luna, asisten santai Lana. Ada yang mau kamu tanyakan tentang Lana atau JKT48?" }]
    });

    if (history && Array.isArray(history)) {
      history.forEach(msg => {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      });
    }

    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();
    
    if (!apiKey) {
      return NextResponse.json({ reply: "Aduh, sepertinya API Key-nya belum terpasang di Vercel nih. Cek Environment Variables ya!" });
    }

    if (!response.ok || data.error) {
      console.error("Gemini API Error Detail:", JSON.stringify(data.error, null, 2));
      
      const errorMsg = data.error?.message || "Unknown error";
      const statusCode = response.status;
      
      if (statusCode === 429) {
        return NextResponse.json({ reply: "Aduh, banyak banget yang tanya Luna nih 😅 Tunggu 1 menit ya biar aku istirahat dulu!" });
      }
      
      return NextResponse.json({ reply: `Maaf, ada kendala koneksi ke Gemini (${statusCode}: ${errorMsg}). Coba lagi bentar ya!` });
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
