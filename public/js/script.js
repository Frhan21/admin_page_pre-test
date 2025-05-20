// Menampilkan pesan alert
function showAlert(message, isError = false) {
  const alertContainer = document.getElementById("alertContainer");
  alertContainer.textContent = message;
  alertContainer.style.display = "block";

  if (isError) {
    alertContainer.classList.add("alert-error");
  } else {
    alertContainer.classList.remove("alert-error");
  }

  // Sembunyikan alert setelah 5 detik
  setTimeout(() => {
    alertContainer.style.display = "none";
  }, 5000);
}

// Load daftar produk
async function loadProduk() {
  try {
    const res = await fetch("/api/stock");
    if (!res.ok) throw new Error("Gagal memuat data produk");

    const data = await res.json();
    console.log(data);

    const list = document.getElementById("produkList");
    const select = document.getElementById("productSelect");
    list.innerHTML = "";
    select.innerHTML = "";

    data.forEach((p, i) => {
      // Hanya tampilkan produk dengan stok tersedia
      if (p.jumlah && p.jumlah > 0) {
        // Tampilan tabel produk
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${i + 1}</td>
                    <td>${p.nama_produk}</td>
                    <td>Rp ${p.harga.toLocaleString("id-ID")}</td>
                    <td>${p.jumlah}</td>
                  `;
        list.appendChild(row);

        // Opsi untuk select
        const option = document.createElement("option");
        option.value = p.id;
        option.textContent = `${p.nama_produk} - Rp ${p.harga.toLocaleString(
          "id-ID"
        )}`;
        select.appendChild(option);
      }
    });
  } catch (error) {
    console.error("Error:", error);
    showAlert("Gagal memuat data produk: " + error.message, true);
  }
}

// Load daftar pembelian
async function loadPembelian() {
  try {
    const res = await fetch("/api/purchases");
    if (!res.ok) throw new Error("Gagal memuat data pembelian");

    const data = await res.json();

    const jumlahPembelian = document.getElementById("jumlahPembelian");
    const totalPembelian = data
      .filter((p) => p.status === "berhasil")
      .reduce((total, p) => total + p.total_harga, 0);
    jumlahPembelian.textContent = `Jumlah Pembelian: Rp ${totalPembelian.toLocaleString(
      "id-ID"
    )}`;

    const list = document.getElementById("pembelianList");
    list.innerHTML = "";

    data.forEach((p) => {
      const tanggal = new Date(p.tanggal).toLocaleString("id-ID");

      const row = document.createElement("tr");
      row.innerHTML = `
                        <td>${p.id}</td>
                        <td>${p.nama_produk}</td>
                        <td>${p.jumlah}</td>
                        <td>Rp ${p.total_harga.toLocaleString("id-ID")}</td>
                        <td>
                          ${new Date(p.tanggal).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })} 
                          ${new Date(p.tanggal).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        <td>
                          <span style="
                            ${
                              p.status === "pending"
                                ? "color: orange; font-weight: bold;"
                                : ""
                            }
                            ${
                              p.status === "berhasil"
                                ? "color: green; font-weight: bold;"
                                : ""
                            }
                            ${
                              p.status === "batal" || p.status === "dibatalkan"
                                ? "color: red; font-weight: bold;"
                                : ""
                            }
                          ">
                            ${p.status}
                          </span>
                        </td>
                        <td>
                          ${
                            p.status === "pending"
                              ? `
                            <button class="btn-success" onclick="ubahStatusBerhasil(${p.id})">Berhasil</button>
                            <button class="btn-cancel" onclick="batalkanPembelian(${p.id})">Batalkan</button>
                            `
                              : p.status === "berhasil"
                              ? `<span style="color:green;">Selesai</span>`
                              : `<span style="color:gray;">Dibatalkan</span>`
                          }
                        </td>
                      `;
      list.appendChild(row);
    });
  } catch (error) {
    console.error("Error:", error);
    showAlert("Gagal memuat data pembelian: " + error.message, true);
  }
}

// Proses pembelian produk
document.getElementById("beliForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const produk_id = document.getElementById("productSelect").value;
  const quantity = parseInt(document.getElementById("jumlah").value, 10);

  if (quantity <= 0) {
    showAlert("Jumlah pembelian harus lebih dari 0", true);
    return;
  }

  try {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ produk_id, quantity }),
    });

    const result = await res.json();

    if (res.ok) {
      showAlert(result.message);
      document.getElementById("jumlah").value = "";
      // Refresh data
      loadProduk();
      loadPembelian();
    } else {
      showAlert(result.error || "Terjadi kesalahan", true);
    }
  } catch (error) {
    console.error("Error:", error);
    showAlert("Gagal melakukan pembelian: " + error.message, true);
  }
});

async function ubahStatusBerhasil(pembelian_id) {
  if (!confirm(`Ubah status pembelian ID ${pembelian_id} menjadi berhasil?`)) {
    return;
  }

  try {
    const res = await fetch("/api/purchases/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pembelian_id }),
    });

    const result = await res.json();

    if (res.ok) {
      showAlert(result.message);
      loadProduk();
      loadPembelian();
    } else {
      showAlert(result.error || "Terjadi kesalahan", true);
    }
  } catch (error) {
    console.error("Error:", error);
    showAlert("Gagal mengubah status: " + error.message, true);
  }
}

// Fungsi untuk batalkan pembelian
async function batalkanPembelian(pembelian_id) {
  if (
    !confirm(
      `Apakah Anda yakin ingin membatalkan pembelian ID ${pembelian_id}?`
    )
  ) {
    return;
  }

  try {
    const res = await fetch("/api/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pembelian_id }),
    });

    const result = await res.json();

    if (res.ok) {
      showAlert(result.message);
      // Refresh data
      loadProduk();
      loadPembelian();
    } else {
      showAlert(result.error || "Terjadi kesalahan", true);
    }
  } catch (error) {
    console.error("Error:", error);
    showAlert("Gagal membatalkan pembelian: " + error.message, true);
  }
}

// Inisialisasi
document.addEventListener("DOMContentLoaded", () => {
  loadProduk();
  loadPembelian();
});
