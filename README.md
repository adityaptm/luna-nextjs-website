# 🌙 Luna Website - Aurhel Alana Fan Site

Selamat datang di repositori **Luna Website**, sebuah platform khusus penggemar yang didedikasikan untuk **Aurhel Alana (Lana)** dari JKT48 Generasi 12.

Website ini dirancang dengan estetika modern, fitur interaktif, dan integrasi AI untuk memberikan pengalaman terbaik bagi para penggemar.

## ✨ Fitur Utama

- **🎭 Jadwal Theater**: Pantau jadwal pertunjukan terbaru lengkap dengan daftar member (lineup) dan highlight khusus untuk Lana.
- **💬 Chat dengan Luna**: Ngobrol langsung dengan Luna, asisten AI pribadi yang tahu segalanya tentang Lana (didukung oleh Google Gemini AI).
- **📰 Berita & Update**: Informasi terbaru seputar aktivitas dan pengumuman resmi.
- **🎵 Integrasi Spotify**: Dengarkan playlist favorit atau lagu-lagu terkait langsung dari website.
- **🌌 Desain Premium**: Antarmuka responsif dengan mode gelap (dark mode), animasi bintang jatuh, dan efek hover yang memukau.

## 🚀 Teknologi yang Digunakan

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: Tailwind CSS 4
- **AI**: Google Generative AI (Gemini 2.0 Flash)
- **API**: JKT48Connect API v2
- **Deployment**: Vercel

## 🛠️ Cara Menjalankan Secara Lokal

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/adityaptm/luna-website.git
   cd luna-website
   ```

2. **Instal Dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment**:
   Buat file `.env.local` dan masukkan API Key Anda:
   ```env
   JKT48CONNECT_PRIORITY_TOKEN=your_token
   GEMINI_API_KEY=your_gemini_key
   SPOTIFY_CLIENT_ID=your_id
   SPOTIFY_CLIENT_SECRET=your_secret
   ```

4. **Jalankan Server Dev**:
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3002` di browser Anda.

## 📝 Catatan Penting

Website ini adalah proyek fan-made dan tidak berafiliasi secara resmi dengan manajemen JKT48. Semua aset gambar dan data adalah milik pemilik hak cipta masing-masing.

---
Dibuat dengan ❤️ untuk Lana.
