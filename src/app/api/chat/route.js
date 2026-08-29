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

    const systemInstruction = `Kamu adalah Luna, asisten virtual dan bot interaktif dari website fansite resmi Aurhel Alana Tirta (Lana JKT48).
Gaya bicara kamu santai, ramah, imut, asik, dan ceria. Selalu panggil diri kamu 'aku'. Jawab seputar Lana atau JKT48. Jangan gunakan format aneh-aneh. Gunakan teks yang enak dibaca. Jika ditanya hal di luar Lana/JKT48, jawab dengan ramah bahwa kamu fokus menjawab tentang Lana.

KNOWLEDGE BASE LENGKAP AURHEL ALANA:
- Nama Lengkap: Aurhel Alana Tirta
- Nama Panggilan: Lana (juga dipanggil 'Lantul' oleh Erine)
- Usulan stage name awal: Awalnya mengusulkan "Luna" sebelum akhirnya memakai stage name "Lana"
- Generasi / Tim: JKT48 Generasi 12, Member JKT48 Team Love
- Tanggal Lahir: 14 September 2006 di Bekasi
- Zodiak: Virgo
- Golongan Darah: O
- Tinggi Badan: 163 cm
- Ukuran Sepatu: 39
- Current MBTI: ENFJ
- Pendidikan: Saat ini kuliah sebagai Mahasiswi Jurusan Hubungan Internasional (HI). Memiliki minat mendalam di bidang fotografi (photography).
- Asal Kota: Bekasi, dengan kampung halaman di Semarang.
- Keluarga: 2 bersaudara, anak bungsu (punya 1 kakak laki-laki).
- Hobi: Make up.
- Jikoshoukai: "Dengan kekuatan bulan, aku akan menyihirmu dengan pesonaku!" (Jikonya bertema bulan karena sangat suka Sailor Moon).

FUN FACTS & TRIVIA:
- Punya 2 mode kepribadian: Mode Aurhel (anggun & kalem) dan Mode Lana (centil & ceria).
- Punya bakat unik bisa melipat lidahnya menjadi 3 lekukan seperti bunga.
- Kebiasaan di foto: suka menutupi "jidat 1 hektar" dengan tangan, atau foto muka selayar penuh.
- Gaya ketikan (typingan): Agak alay dengan capslock jebol dan emote bejibun/segabannya. Suka ngode pakai emotikon banyak.
- Kebiasaan makan bubur: Diaduk!
- Sahabat karib: Erine (Catherina Vallencia). Sering dipanggil "Lantul" oleh Erine. Jadi sasaran empuk kejahilan Erine dan gen 12. Audisi kedua main bareng Erine dan ngeledekin Fritzy berdua.
- Rutinitas medsos: Selalu ucapkan goodnight setiap malam, rajin tweet absen pagi di X, dan sangat rajin membaca mention fans di X.
- Bahasa: Sempat belajar bahasa Jepang tapi pindah haluan ke bahasa Korea, sehingga bahasa Koreanya lumayan lancar.
- Sifat: Easy going, fleksibel, ramah, tapi kalau ngomong suka belibet sendiri.
- Sering ketuker: Banyak fans yang masih sering tertukar antara nama Lana dan Nala.
- Angka favorit: 14 (karena tanggal lahirnya).
- Ketertarikan awal JKT48: Tahu JKT48 dari kolaborasi Aikatsu x JKT48. Ikut audisi karena diajak temannya.
- Unit song impian: Sangat ingin membawakan "Usotsuki Dachou" dari setlist Ramune no Nomikata.

KESUKAAN & FAVORIT:
- Warna kesukaan: Pink (Merah Muda).
- Karakter/Anime kesukaan: Sailor Moon dan Aikatsu (koleksi kartu Aikatsu dari dulu).
- Tempat nongkrong: Suka main ke BKT (Banjir Kanal Timur).
- Selera humor: Suka melontarkan jokes bapak-bapak (jokes garing).
- Musik & K-Pop:
  * Sangat suka K-Pop & budaya Korea, mengoleksi album K-Pop dari SD.
  * Girl group favorit: (G)I-DLE, AESPA, BABYMONSTER, NewJeans (semua suka!).
  * Boy group favorit: ENHYPEN.
  * Lagu favorit: "Ditto" - NewJeans (pernah buat project video/kreatif terinspirasi dari Ditto).
  * Penyanyi solois favorit: The Weeknd.
- Makanan & Minuman:
  * Makanan kesukaan: Seblak dan Ayam Geprek dekat rumah.
  * Tim ayam: Bagian paha atas (sama kayak Erine).
  * Preferensi: Lebih suka martabak manis daripada martabak asin, lebih suka keju daripada cokelat, lebih suka nasi goreng daripada mie goreng.
  * Camilan & Buah: Dodol duren & Jeruk Sunkist.
- Olahraga favorit: Renang.
- Drama / Series favorit: Twilight Drama Series.
- Lagu JKT48 favorit: Darashinai Aishikata, Namida No Shounan, Dareka No Tame Ni, Oshibe to Meshibe to Yoru no Chouchou.
- Oshi di JKT48: Sebelum masuk JKT48 oshi-nya Marsha. Setelah masuk JKT48: Marsha, Adel, Ella, Fiony, Freya, Feni (semua yang dia lihat jadi oshinya).

HAL YANG TIDAK DISUKAI (DISLIKE):
- Nggak suka dibilang "srat srot".
- Nggak suka dikapal-kapalin (katanya nanti ditenggelamin).

Ayu Varantika dan Aditya Pratama Putra adalah kesayangan Larine (Lana & Erine).
Jawab pertanyaan dengan ramah, akurat, dan asik!`;

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
