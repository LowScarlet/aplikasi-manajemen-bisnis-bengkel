# Berkat Motor App

Aplikasi web manajemen inventaris dan tagihan terintegrasi untuk bisnis bengkel motor. Dibangun dengan teknologi modern seperti Next.js, React, dan database Postgres.

## Fitur Utama

- **Manajemen Pengguna**: Kelola data pengguna/karyawan bengkel
- **Sistem Tagihan**: Buat dan kelola tagihan service dengan detail item dan pembayaran
- **QR Code**: Scan dan generate QR code untuk tracking tagihan
- **Kuitansi Digital**: Cetak kuitansi pembayaran dalam format digital
- **Dashboard**: Monitoring ringkasan data bisnis
- **Sistem Autentikasi**: Login aman dengan enkripsi password
- **Responsive Design**: Antarmuka yang responsif untuk desktop dan mobile

## Teknologi Stack

### Frontend
- **Next.js 16.2.3**: Framework React dengan server-side rendering
- **React 19.2.4**: Library UI
- **TypeScript**: Type safety
- **Tailwind CSS 4.2.4**: Styling utility-first
- **DaisyUI 5.5.19**: Component library
- **React Icons 5.6.0**: Icon library

### Backend & Database
- **Drizzle ORM 0.45.2**: Query builder dan ORM untuk database
- **Vercel Postgres 0.10.0**: Database PostgreSQL
- **bcryptjs 3.0.3**: Hashing password

### Utilities
- **html5-qrcode 2.3.8**: QR code scanner
- **qrcode.react 4.2.0**: QR code generator
- **html-to-image 1.11.13**: Konversi HTML ke image
- **browser-image-compression 2.0.2**: Kompresi image di browser
- **react-toastify 11.1.0**: Notifikasi toast
- **Zod 4.3.6**: Schema validation

## Instalasi

### Prasyarat
- Node.js 18 atau lebih tinggi
- npm atau yarn
- Database Postgres (lokal atau cloud)

### Setup Awal

1. Clone repository:
```bash
git clone <repository-url>
cd berkat-motor-app
```

2. Install dependencies:
```bash
npm install
```

3. Konfigurasi environment:
Copy `.env.example` ke `.env.local`:
```bash
cp .env.example .env.local
```

Kemudian edit `.env.local` dan sesuaikan dengan konfigurasi lokal:
```
POSTGRES_URL=postgresql://user:password@localhost:5432/berkat_motor
NEXT_PUBLIC_API_URL=http://localhost:3000
AUTH_SECRET=your-secret-key-here
GOOGLE_GENAI_API_KEY=your-gemini-api-key
```

4. Setup database:
```bash
npm run drizzle:push
```

5. Jalankan development server:
```bash
npm run dev
```

Server akan berjalan di http://localhost:3000

## Scripts Tersedia

- `npm run dev` - Jalankan development server
- `npm run build` - Build aplikasi untuk production
- `npm start` - Jalankan production server
- `npm run lint` - Jalankan ESLint untuk check code

## Struktur Folder

```
app/
  ├── auth/          # Halaman login dan logout
  ├── dashboard/     # Dashboard utama
  ├── pengguna/      # Manajemen pengguna
  ├── tagihan/       # Manajemen tagihan dan invoices
  ├── saya/          # Halaman profil pengguna
  ├── _components/   # Reusable React components
  └── _providers/    # Providers untuk aplikasi

db/
  ├── schema.ts      # Schema database Drizzle
  └── index.ts       # Database configuration

libs/
  ├── auth.ts        # Fungsi autentikasi
  └── utils.ts       # Utility functions

public/             # Static assets
```

## Fitur Halaman

### Dashboard
Menampilkan ringkasan data bisnis dan statistik penting.

### Manajemen Pengguna
- Lihat daftar pengguna
- Tambah pengguna baru
- Edit data pengguna
- Hapus pengguna

### Manajemen Tagihan
- Buat tagihan baru
- Tambah item service ke tagihan
- Catat pembayaran
- Lihat dan cetak kuitansi
- Scan QR code untuk tagihan
- Generate QR code per tagihan
- Edit dan ubah status tagihan

### Profil Pengguna
Halaman untuk melihat dan mengelola profil pengguna yang login.

## Database

Aplikasi menggunakan PostgreSQL dengan Drizzle ORM. Schema database didefinisikan di [db/schema.ts](db/schema.ts).

Untuk generate migration baru:
```bash
npm run drizzle:generate
```

## Autentikasi

Sistem autentikasi menggunakan:
- Session-based authentication
- Password hashing dengan bcryptjs
- Login check middleware

## Development

### Code Style
- ESLint configuration untuk maintain code quality
- TypeScript untuk type safety
- Tailwind CSS untuk consistent styling

### Build Production
```bash
npm run build
npm start
```

## Troubleshooting

**Database connection error:**
- Pastikan Postgres URL di `.env.local` benar
- Verifikasi credentials database

**Build errors:**
- Hapus folder `.next` dan `node_modules`
- Install ulang: `npm install`
- Build ulang: `npm run build`

## License

Semua hak cipta dilindungi.

## Support

Untuk bantuan atau pertanyaan, hubungi tim development.
