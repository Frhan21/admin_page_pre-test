const db = require('./db');

async function seedDatabase() {
  try {
    // Drop tables if exist
    await db.query(`DROP TABLE IF EXISTS pembelian`);
    await db.query(`DROP TABLE IF EXISTS stock`);
    await db.query(`DROP TABLE IF EXISTS produk`);

    // Create tables
    await db.query(`
      CREATE TABLE produk (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(100) NOT NULL,
        harga INT NOT NULL
      )
    `);

    await db.query(`
      CREATE TABLE stock (
        id INT AUTO_INCREMENT PRIMARY KEY,
        produk_id INT,
        jumlah INT NOT NULL,
        FOREIGN KEY (produk_id) REFERENCES produk(id)
      )
    `);

    await db.query(`
      CREATE TABLE pembelian (
        id INT AUTO_INCREMENT PRIMARY KEY,
        produk_id INT,
        jumlah INT,
        total_harga INT,
        status ENUM('pending','berhasil', 'dibatalkan') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (produk_id) REFERENCES produk(id)
      )
    `);

    // Insert products
    const produk = [
      ['Sabun Mandi', 5000],
      ['Shampoo', 12000],
      ['Pasta Gigi', 8000],
      ['Tissue', 7000],
      ['Sikat Gigi', 3000],
      ['Minyak Goreng 1L', 14000],
      ['Gula Pasir 1Kg', 13000],
      ['Tepung Terigu 1Kg', 9000],
      ['Susu Bubuk', 25000],
      ['Mie Instan', 2500]
    ];

    await db.query(`INSERT INTO produk (nama, harga) VALUES ?`, [produk]);

    // Get all product ids
    const [rows] = await db.query(`SELECT id FROM produk`);

    // Insert initial stock: 100 for each product
    const stockData = rows.map(row => [row.id, 100]);
    await db.query(`INSERT INTO stock (produk_id, jumlah) VALUES ?`, [stockData]);

    console.log("✅ Seeder berhasil dijalankan.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeder gagal:", err);
    process.exit(1);
  }
}

seedDatabase();
