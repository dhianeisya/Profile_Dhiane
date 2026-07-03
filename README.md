# Website Profile Pribadi (React + Vite + Supabase) - Tugas 12

Website Profile Pribadi yang modern, responsive, dilengkapi dengan Content Management System (CMS) Admin untuk manajemen artikel, beroperasi dengan backend **Vercel Serverless Functions**, database cloud **Supabase PostgreSQL**, serta mengimplementasikan fitur PWA (Service Worker & Push Notifications).

---

## 🚀 Fitur Utama

- **Frontend Modern**: Menggunakan **React + Vite** (SPA) dengan **React Router v6** untuk navigasi halaman yang cepat dan mulus.
- **CMS Admin (Dashboard)**: Melakukan manajemen artikel secara dinamis (Create, Read, Update, Delete) yang terhubung langsung ke database.
- **Backend Serverless**: Seluruh API diproses menggunakan **Vercel Serverless Functions** di direktori `/api`.
- **Database Cloud**: Menyimpan data user (admin) dan artikel menggunakan **Supabase PostgreSQL**.
- **Progressive Web App (PWA)**: Dilengkapi dengan `manifest.json` dan `service-worker.js` untuk caching offline, penanganan push notifications, dan kemampuan instalasi web.
- **Desain Premium & Responsive**: Dilengkapi dengan transisi visual yang halus, animasi typing effect, dark mode switcher, dan responsive mobile layout.

---

## 📁 Struktur Folder Project

```text
api/                  # Vercel Serverless Functions (Node.js)
├── supabase.js       # Client instansiasi Supabase
├── login.js          # POST /api/login
├── register.js       # POST /api/register
├── artikel.js        # GET /api/artikel & GET /api/artikel?id=
├── tambahArtikel.js  # POST /api/tambahArtikel
├── editArtikel.js    # PUT /api/editArtikel
└── hapusArtikel.js   # DELETE /api/hapusArtikel
public/               # Static assets untuk PWA & service worker
├── foto.jpeg         # Foto profil utama
├── manifest.json     # PWA Manifest
├── service-worker.js # Service worker (Caching & Push Notifications)
├── icon-192.png      # Icon PWA 192x192
└── icon-512.png      # Icon PWA 512x512
src/                  # Aplikasi utama React
├── components/       # Komponen reusable (Navbar, Footer, ContactForm, ArticleCard, Toast)
├── pages/            # View halaman utama (Home, Login, Dashboard, ArticleDetail)
├── services/         # Client request API ke /api/* (api.js)
├── styles/           # CSS stylesheet global (styles.css)
├── App.jsx           # Konfigurasi routing utama
└── main.jsx          # Render root React & registrasi service worker
package.json          # Node dependencies & npm scripts
vite.config.js        # Konfigurasi bundling Vite & Proxy localhost
vercel.json           # Konfigurasi routing rewrite rules Vercel
.env.example          # Template konfigurasi environment variables
.gitignore            # File exclusion Git
README.md             # Dokumentasi proyek
```

---

## 🛠️ Langkah Instalasi & Konfigurasi

### 1. Kloning & Install Dependensi
Buka terminal pada direktori proyek Anda dan jalankan perintah:
```bash
npm install
```

### 2. Konfigurasi Database Supabase
Pastikan Anda sudah memiliki database Supabase PostgreSQL. Jalankan query SQL berikut pada **SQL Editor** Supabase Anda untuk membuat tabel:
```sql
-- Membuat tabel users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

-- Membuat tabel artikel
CREATE TABLE artikel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul TEXT,
  isi TEXT,
  tanggal TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Menambahkan akun admin default
INSERT INTO users (username, password) VALUES
('admin', 'admin123'),
('user', 'user123');

-- Menambahkan data artikel contoh
INSERT INTO artikel (judul, isi) VALUES
('Pentingnya Literasi Digital di Era Modern', 'Di era digital saat ini, teknologi telah menjadi bagian yang tidak terpisahkan dari kehidupan sehari-hari. Hampir semua aktivitas, mulai dari belajar, bekerja, hingga berkomunikasi, memanfaatkan internet dan perangkat digital. Oleh karena itu, literasi digital menjadi keterampilan yang sangat penting untuk dimiliki oleh setiap individu.');
```

### 3. Konfigurasi File Environment `.env`
Buat file bernama `.env` di root folder proyek, lalu salin variabel dari `.env.example` dan masukkan credential Supabase Anda:
```env
SUPABASE_URL=https://gwobbdxtymaqoslnoxis.supabase.co
SUPABASE_ANON_KEY=sb_publishable_OHYw_lO8S8xnJKoydDqTTA_udqzvqgU
```

---

## 💻 Menjalankan Aplikasi Secara Lokal

Anda dapat menjalankan proyek secara lokal menggunakan perintah di bawah ini:

### Opsi A: Menggunakan Vite Dev Server (Khusus Frontend)
```bash
npm run dev
```

### Opsi B: Menggunakan Vercel CLI (Direkomendasikan untuk uji coba API + Frontend)
Gunakan perintah berikut untuk memproses serverless function `/api` dan frontend SPA React secara bersamaan:
```bash
vercel dev
```

Aplikasi akan berjalan di `http://localhost:3000`.

---

## 🚀 Langkah Deployment ke Vercel

Untuk melakukan deployment langsung ke cloud hosting Vercel:
1. Pastikan Anda telah menginstal Vercel CLI (`npm install -g vercel`).
2. Login ke akun Vercel Anda (`vercel login`).
3. Jalankan perintah deploy untuk mempublikasikan proyek ke produksi:
   ```bash
   vercel --prod
   ```
4. Tambahkan environment variables `SUPABASE_URL` dan `SUPABASE_ANON_KEY` pada dashboard pengaturan proyek Anda di Vercel agar backend di cloud dapat terhubung ke database.
