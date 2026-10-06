# 💧 Cek Tagihan Air — Tirta Hita Buleleng

> Portal digital untuk memudahkan pelanggan Perumda Air Minum Tirta Hita Buleleng dalam mengecek tagihan air, memantau pemakaian, melihat riwayat tagihan, serta mendapatkan informasi layanan secara praktis.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

---

## 📌 Tentang Project

**Cek Tagihan Air** adalah aplikasi web yang dirancang sebagai portal layanan pelanggan digital untuk Perumda Air Minum Tirta Hita Buleleng.

Aplikasi menyediakan dua sisi utama:

- **Portal Pelanggan** — pelanggan memasukkan nomor pelanggan 8 digit untuk melihat informasi pelanggan, tagihan, status pembayaran, pemakaian air, dan riwayat.
- **Portal Administrator** — petugas dapat masuk menggunakan akun Supabase Auth dan mengelola data pelanggan serta data tagihan.

Project ini menggunakan **Next.js App Router** sebagai framework utama dan **Supabase** sebagai backend untuk database serta autentikasi.

---

## ✨ Fitur Utama

### 👤 Portal Pelanggan

- 🔎 Pencarian pelanggan menggunakan nomor pelanggan 8 digit
- 🧾 Melihat rincian tagihan air
- 💰 Melihat nominal tagihan dan status pembayaran
- 📅 Melihat riwayat tagihan berdasarkan periode
- 💧 Memantau penggunaan air dalam satuan m³
- 📈 Grafik pemakaian air 3, 6, hingga 12 bulan
- 📊 Menampilkan tren penggunaan dibandingkan bulan sebelumnya
- ⚠️ Informasi status sambungan berdasarkan kondisi tagihan
- 📱 Responsive untuk desktop dan perangkat mobile
- 💬 Akses langsung ke Customer Service melalui WhatsApp
- 🆘 Tautan ke pusat bantuan resmi Tirta Hita Buleleng

### 🛡️ Portal Administrator

- 🔐 Login administrator menggunakan Supabase Authentication
- 👥 Manajemen data pelanggan
- 🧾 Manajemen data tagihan
- ➕ Tambah data pelanggan dan tagihan
- ✏️ Edit data pelanggan dan tagihan
- 🗑️ Hapus data
- 📋 Melihat riwayat transaksi pelanggan
- 🔎 Pencarian dan filter data
- 📱 Dashboard admin responsive

---

## 🏗️ Arsitektur

```text
┌──────────────────────────┐
│      Web Browser         │
│   Customer / Admin       │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│      Next.js 16          │
│   React + TypeScript     │
│      App Router          │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│        Supabase          │
│                          │
│  ┌────────┐ ┌─────────┐  │
│  │  Auth  │ │Database │  │
│  └────────┘ └─────────┘  │
└────────────┬─────────────┘
             │
             ▼
      Customer & Bill Data
```

---

## 🛠️ Tech Stack

| Teknologi | Penggunaan |
|---|---|
| **Next.js 16** | Framework web dan routing |
| **React 19** | UI dan component-based development |
| **TypeScript 5.7** | Static typing |
| **Supabase** | Database PostgreSQL dan Authentication |
| **@supabase/ssr** | Integrasi Supabase pada Next.js |
| **Tailwind CSS 4** | Styling dan utility CSS |
| **Lucide React** | Icon system |
| **Vercel Analytics** | Web analytics |

---

## 📂 Struktur Project

```text
cek-tagihan/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx       # Login administrator
│   │   └── page.tsx           # Dashboard administrator
│   ├── globals.css             # Global styling
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Portal pelanggan
│
├── components/
│   └── ui/                     # Komponen UI
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Supabase browser client
│   │   └── server.ts           # Supabase server client
│   └── utils.ts
│
├── public/
│   └── logo.png
│
├── supabase/
│   └── schema.sql              # Struktur database & seed data
│
├── .env.example
├── components.json
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/tonypradipta/cek-tagihan.git
cd cek-tagihan
```

### 2. Install Dependencies

Menggunakan npm:

```bash
npm install
```

Atau menggunakan pnpm:

```bash
pnpm install
```

### 3. Konfigurasi Environment

Salin file environment:

```bash
cp .env.example .env.local
```

Kemudian isi konfigurasi Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> Jangan commit file `.env.local` atau kredensial Supabase ke repository.

### 4. Setup Database Supabase

Buka project Supabase Anda, kemudian jalankan isi:

```text
supabase/schema.sql
```

Schema tersebut membuat tabel utama:

- `customers`
- `bills`

Beserta index, Row Level Security (RLS), policy, dan data contoh awal.

### 5. Jalankan Development Server

```bash
npm run dev
```

Buka:

```text
http://localhost:3000
```

Portal administrator tersedia di:

```text
http://localhost:3000/admin/login
```

---

## 🔐 Authentication

Login administrator menggunakan **Supabase Auth** dengan email dan password.

Alur login:

```text
Admin
  │
  ▼
/admin/login
  │
  ▼
Supabase Auth
  │
  ├── Gagal ──► Tampilkan pesan error
  │
  └── Berhasil
          │
          ▼
      /admin
```

Akun administrator harus dibuat terlebih dahulu melalui sistem Authentication pada project Supabase.

---

## 🗄️ Database

Database menggunakan PostgreSQL yang disediakan oleh Supabase.

### Customers

| Field | Keterangan |
|---|---|
| `id` | UUID pelanggan |
| `customer_number` | Nomor pelanggan unik |
| `name` | Nama pelanggan |
| `email` | Email pelanggan |
| `phone` | Nomor telepon |
| `address` | Alamat pelanggan |
| `tariff` | Golongan tarif |
| `created_at` | Waktu pembuatan data |

### Bills

| Field | Keterangan |
|---|---|
| `id` | UUID tagihan |
| `customer_id` | Relasi ke pelanggan |
| `billing_month` | Periode tagihan |
| `due_date` | Tanggal jatuh tempo |
| `amount` | Nominal tagihan |
| `usage_m3` | Pemakaian air dalam m³ |
| `status` | `unpaid`, `paid`, atau `overdue` |
| `created_at` | Waktu pembuatan data |

Relasi utama:

```text
customers
    │
    │ 1
    │
    │ N
    ▼
  bills
```

---

## 🔒 Row Level Security

Project telah menyediakan konfigurasi **Row Level Security (RLS)** pada tabel `customers` dan `bills`.

Policy yang tersedia:

- Public dapat membaca data yang diperlukan untuk fitur pengecekan tagihan.
- User terautentikasi mendapatkan akses penuh untuk kebutuhan administrasi.

> **Catatan keamanan:** konfigurasi RLS pada `supabase/schema.sql` saat ini mengizinkan pembacaan publik pada data pelanggan dan tagihan. Untuk penggunaan production dengan data pelanggan sebenarnya, policy sebaiknya diperketat agar hanya data yang diperlukan yang dapat diakses publik dan informasi sensitif tidak terekspos.

---

## 📜 Available Scripts

| Command | Fungsi |
|---|---|
| `npm run dev` | Menjalankan development server |
| `npm run build` | Membuat production build |
| `npm run start` | Menjalankan production server |

---

## 🔄 User Flow

### Pelanggan

```text
Landing Page
     │
     ▼
Masukkan Nomor Pelanggan
     │
     ▼
Validasi 8 Digit
     │
     ▼
Cari Data Customer
     │
     ▼
Dashboard Pelanggan
     │
     ├── Beranda
     ├── Tagihan
     └── Riwayat
```

### Administrator

```text
Login Admin
    │
    ▼
Supabase Authentication
    │
    ▼
Dashboard Admin
    │
    ├── Data Pelanggan
    │     ├── Tambah
    │     ├── Edit
    │     └── Hapus
    │
    └── Data Tagihan
          ├── Tambah
          ├── Edit
          └── Hapus
```

---

## 🌐 Integrasi Layanan

Aplikasi menyediakan akses ke:

- **Website resmi Tirta Hita Buleleng** sebagai pusat informasi dan bantuan.
- **WhatsApp Customer Service** untuk komunikasi dengan pelanggan.

URL layanan dapat ditemukan dan dikonfigurasi pada `app/page.tsx`.

---

## 📦 Deployment

Project dapat dideploy ke platform yang mendukung Next.js, seperti **Vercel**.

Build production:

```bash
npm run build
npm run start
```

Pastikan environment variables Supabase telah dikonfigurasi pada platform deployment.

---

## ⚠️ Catatan Production

Sebelum aplikasi digunakan dengan data pelanggan sebenarnya, disarankan untuk:

- Memperketat RLS dan policy database.
- Menghindari akses publik ke data pribadi pelanggan yang tidak diperlukan.
- Membuat role/permission administrator yang lebih granular.
- Menambahkan audit log untuk perubahan data.
- Memvalidasi input pelanggan dan tagihan di sisi server.
- Menambahkan rate limiting pada endpoint/query publik.
- Memisahkan seed data development dari database production.
- Menambahkan monitoring dan error tracking.

---

## 🔮 Pengembangan Selanjutnya

Beberapa fitur yang dapat dikembangkan:

- [ ] Notifikasi tagihan melalui WhatsApp
- [ ] Pembayaran online
- [ ] Download atau cetak invoice
- [ ] Export laporan ke Excel/PDF
- [ ] Dashboard statistik untuk administrator
- [ ] Role-based access control
- [ ] Audit log aktivitas admin
- [ ] Notifikasi jatuh tempo
- [ ] Riwayat pembayaran yang lebih detail
- [ ] Optimasi keamanan dan privacy data

---

## 🤝 Contributing

Kontribusi sangat terbuka untuk pengembangan project.

1. Fork repository.
2. Buat branch baru:

```bash
git checkout -b feature/nama-fitur
```

3. Commit perubahan:

```bash
git commit -m "feat: tambah nama fitur"
```

4. Push branch:

```bash
git push origin feature/nama-fitur
```

5. Buat Pull Request.

---

## 📄 License

Repository ini belum memiliki file license resmi. Jika project akan didistribusikan secara publik, tambahkan file `LICENSE` dan tentukan lisensi yang sesuai.

---

## 👨‍💻 Author

**Tony Pradipta**

- GitHub: [@tonypradipta](https://github.com/tonypradipta)
- Repository: [cek-tagihan](https://github.com/tonypradipta/cek-tagihan)

---

<p align="center">
  Dibuat untuk mendukung digitalisasi layanan informasi pelanggan<br>
  <strong>Perumda Air Minum Tirta Hita Buleleng</strong>
</p>
