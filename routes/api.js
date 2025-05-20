const express = require("express");
const router = express.Router();
const db = require("../db"); // Import database connection

// Get semua produk
router.get("/products", async (req, res) => {
  const [produk] = await db.query("SELECT * FROM produk");
  res.json(produk);
});

// Post untuk pembelian produk
router.post("/products", async (req, res) => {
  const { produk_id, quantity } = req.body;
  try {
    const [[produk]] = await db.query("SELECT * FROM produk WHERE id = ?", [
      produk_id,
    ]);

    console.log(produk);
    const total = produk.harga * quantity;

    await db.query(
      "INSERT INTO pembelian (produk_id, jumlah, total_harga) VALUES (?, ?, ?)",
      [produk_id, quantity, total]
    );

    await db.query("UPDATE stock SET jumlah = jumlah - ? WHERE produk_id = ?", [
      quantity,
      produk_id,
    ]);

    res.json({ message: "Pembelian berhasil", total_harga: total });
  } catch (error) {
    res.status(500).json({ message: "Pembelian gagal", error: error.message });
  }
});

// Post membatalkan pembelian
router.post("/cancel", async (req, res) => {
  const { pembelian_id } = req.body;
  try {
    const [[row]] = await db.query(
      "SELECT produk_id, jumlah FROM pembelian WHERE id = ?",
      [pembelian_id]
    );
    if (!row) {
      return res.status(404).json({ message: "Pembelian tidak ditemukan" });
    }

    await db.query("UPDATE stock SET jumlah = jumlah + ? WHERE produk_id = ?", [
      row.jumlah,
      row.produk_id,
    ]);
    await db.query("UPDATE pembelian SET status = 'dibatalkan' WHERE id = ?", [
      pembelian_id,
    ]);

    res.json({ message: "Pembelian berhasil dibatalkan" });
  } catch (error) {
    res.status(500).json({ message: "Pembatalan gagal", error: error.message });
  }
});

// Get semua pembelian
router.get("/purchases", async (req, res) => {
const [pembelian] = await db.query(
    `SELECT p.id, p.jumlah, p.total_harga, pr.nama AS nama_produk, p.created_at as tanggal, p.status
     FROM pembelian p 
     JOIN produk pr ON p.produk_id = pr.id`
);
res.json(pembelian);
});



// Get stock produk
router.get("/stock", async (req, res) => {
  const [stock] = await db.query(
    `SELECT s.jumlah, pr.nama AS nama_produk, pr.harga, pr.id
     FROM stock s 
     JOIN produk pr ON s.produk_id = pr.id`
  );
  res.json(stock);
});

// Get pembelian diverifikasi
router.post('/purchases/verify', async (req, res) => {
    const { pembelian_id } = req.body;
    try {
        await db.query("UPDATE pembelian SET status = 'berhasil' WHERE id = ?", [
        pembelian_id,
        ]);
        res.json({ message: "Pembelian diverifikasi" });
    } catch (error) {
        res.status(500).json({ message: "Verifikasi gagal", error: error.message });
    }
})

module.exports = router;