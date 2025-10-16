Secure Hono & Drizzle Todo App
License: MIT Technology: Hono Database: Drizzle ORM

Aplikasi daftar tugas sederhana (To-do List) full-stack yang dibangun dengan backend Hono (dijalankan di Node.js/Bun) dan Drizzle ORM untuk PostgreSQL, dengan autentikasi berbasis JWT Cookies.

🌟 Fitur Utama
Autentikasi Aman: Sign Up dan Login menggunakan JWT yang disimpan dalam HTTP-only cookies.

CRUD Tasks: Membuat, mengambil, mengubah status, dan menghapus tugas.

Authorisasi: Setiap tugas terikat pada user.id dan hanya dapat dimodifikasi oleh pemiliknya.

Client-Side Vanilla JS: Frontend diimplementasikan dengan HTML murni dan JavaScript tanpa framework modern.

🛠️ Persiapan dan Instalasi
Proyek ini membutuhkan Node.js (disarankan) atau Bun untuk menjalankannya.

1. Klon Repositori
Perintah klon repositori: git clone [URL_REPOSITORY_ANDA]

Lalu masuk ke direktori: cd nama-folder-proyek

2. Instal Dependensi
Anda harus menginstal semua dependensi yang digunakan proyek ini:

Perintah instalasi: npm install hono @hono/node-server postgres jwt bcryptjs drizzle-orm dotenv

Perintah instalasi Drizzle Kit: npm install -D drizzle-kit

3. Konfigurasi Environment (.env)
Buat file bernama .env di root folder proyek dan isi dengan variabel-variabel sensitif Anda (tanpa tanda kutip):

DATABASE_URL=postgres://[USER]:[PASSWORD]@[HOST]:[PORT]/[DB_NAME] JWT_SECRET=Tulis_Kunci_Rahasia_yang_Sangat_Panjang_disini_untuk_JWT

⚙️ Menjalankan Proyek
1. Migrasi Database (Wajib)
Jalankan skrip Drizzle untuk menerapkan skema database: npx drizzle-kit push:pg

2. Seed Database (Opsional)
Untuk mengisi database dengan data awal: node db/seed.js

3. Memulai Server
Jalankan server backend: node index.js

Server akan berjalan di http://localhost:3000 (atau port yang Anda atur).

🧭 Struktur Proyek
.
├── db/                        # Logika Drizzle ORM
│   ├── index.js               # Inisialisasi DB connection
│   └── schema.js              # Definisi skema tabel (users, todos)
├── drizzle/                   # Folder hasil migrasi Drizzle Kit
├── public/                    # Frontend (Static Files)
│   ├── index.html             # Landing page
│   ├── login/index.html
│   └── todos/index.html       # Halaman utama aplikasi
├── index.js                   # Main Server Hono (termasuk routing API)
└── .env                       # Environment Variables (tidak di commit)

