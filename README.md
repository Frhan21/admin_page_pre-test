# 🛒 Admin Page Pembelian Produk

Sistem web sederhana untuk mengelola data produk, stok, dan transaksi pembelian di toko. Dibangun menggunakan Node.js, Express.js, dan MySQL, dengan tampilan UI berbasis HTML (Single Page App).

---

## 📦 Fitur Utama

- Menampilkan daftar produk dari database
- Menampilkan stok produk
- Form input pembelian produk
- Menampilkan riwayat pembelian
- SPA (Single Page App) menggunakan HTML + JavaScript + Fetch API

---

## 🧰 Teknologi yang Digunakan

- **Backend**: Node.js, Express.js
- **Database**: MySQL (AvianDB)
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Template**: Tanpa template engine, murni HTML statis

---

## 📁 Struktur Direktori

admin_page/
├── app.js # Entry point Express
├── db.js # Koneksi ke database
├── seed.js # Seeder data awal produk dan stok
├── routes/
│ └── api.js # API routes (produk, stok, pembelian)
├── public/
│ ├── index.html # Tampilan utama (SPA)
│ ├── script.js # Logika interaksi API
│ └── style.css # Desain bebas (optional)
├── .env # Konfigurasi koneksi MySQL
└── README.md # Dokumentasi proyek

## ⚙️ Setup dan Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/username/admin-page.git
cd admin-page
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfiguras `.env`

Buat file .env atau copy dari file .env.example

```bash
cp .env.example .env
```

```bash
DB_HOST=your_host
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=admin_pembelian
DB_PORT=your_port
```

### 4. Jalankan seeder database

Kalau kamu menggunakan database sendiri maka silahkan jalankan

```bash
node seed.js
```

Seeder ini akan membuat:

- Tabel produk, stok dan pembelian
- Menambahkan stok produk awal sebanyak 100

### 5. Jalankan Server

```bash
npm run dev
```

##📌 Endpoint API

| Method | Endpoint       | Description                  |
| ------ | -------------- | ---------------------------- |
| GET    | /api/products  | Get all products             |
| POST   | /api/products  | Purchase a product           |
| POST   | /api/cancel    | Cancel a purchase            |
| GET    | /api/stock     | To access all product stocks |
| GET    | /api/purchases | Get All purchases process    |

##🧪 Contoh Penggunaan API

```http
POST /api/purchases
Content-Type: application/json

{
  "produk_id": 1,
  "jumlah": 2,
  "total_harga": 125000, 
  "status": "pending"
}
```

## 👨‍💻 Pengembangan Lanjutan
* Tambahkan autentikasi admin 
* Fitur batal pembelian 
* Export laporan ke excel/PDF
* Konversi PWA atau React SPA
* Responsif untuk Mobile 

#📝 Lisensi
MIT License © 2025

#🙌 Kontributor
Jika Anda ingin README ini disertai **tangkapan layar**, **GIF demo**, atau **badge GitHub**, saya bisa bantu tambahkan. Tinggal beri tahu saja!

Sukses untuk pengembangan selanjutnya!