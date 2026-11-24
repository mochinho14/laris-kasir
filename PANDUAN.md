# Panduan Laris: Aplikasi Kasir Pribadi

## Isi paket

| File | Fungsi |
| --- | --- |
| `index.html` | Kerangka halaman dan semua tampilan tab |
| `style.css` | Seluruh gaya tampilan |
| `app.js` | Seluruh logika aplikasi (kasir, stok, laporan, data) |
| `manifest.json` | Identitas aplikasi untuk dipasang di HP (PWA) |
| `sw.js` | Service worker: menyimpan aplikasi di perangkat supaya bisa dibuka offline |
| `icon-192.png`, `icon-512.png` | Ikon aplikasi di layar utama HP |
| `README.md` | Ringkasan fitur |
| `PANDUAN.md` | Dokumen ini |

## Cara menjalankan

**Paling sederhana:** buka `index.html` dari pengelola file atau
browser. Semua fitur kasir langsung jalan. Catatan: mode file
lokal seperti ini tidak bisa dipasang jadi aplikasi dan mode
offline PWA tidak aktif, tetapi datanya tetap tersimpan.

**Supaya bisa dipasang di HP dan offline penuh (disarankan):**
unggah satu folder ini ke hosting statis apa pun, misalnya
Netlify, GitHub Pages, atau Cloudflare Pages, lalu buka alamatnya
dari Chrome di HP. Setelah itu:

1. Ketuk menu titik tiga di Chrome.
2. Pilih "Tambahkan ke Layar Utama" atau "Instal aplikasi".
3. Ikon Laris muncul di layar utama seperti aplikasi biasa,
   terbuka layar penuh, dan tetap bisa dipakai tanpa internet
   setelah kunjungan pertama.

Di laptop, folder ini juga bisa dijalankan dengan server lokal
apa pun, contohnya `python3 -m http.server` dari dalam folder.

## Alur pemakaian harian

1. **Siapkan data** di tab Kelola: periksa produk (nama, SKU,
   kategori, harga jual, harga modal, stok, stok minimum) dan
   pelanggan tetap. Produk contoh boleh dihapus atau diubah.
2. **Jualan** di tab Kasir: klik produk atau cari nama/SKU,
   pilih pelanggan, pilih metode bayar, untuk tunai isi uang
   diterima (kembalian dihitung otomatis), lalu Bayar. Struk
   muncul dan bisa dicetak atau dikirim lewat WhatsApp.
3. **Pelanggan berikutnya menunggu?** Ketuk Tahan (Pending),
   order tersimpan dan bisa dilanjutkan dari tab Riwayat.
4. **Restock** di Kelola, bagian Pembelian: stok bertambah dan
   tercatat di riwayat mutasi. Restock cepat juga bisa dari
   tombol + Stok di daftar produk.
5. **Tutup hari** di tab Laporan: cek penjualan, laba, margin,
   metode pembayaran, jam teramai, lalu ekspor CSV sebagai
   cadangan dan bahan olah di Excel/Sheets.

## Yang perlu diketahui

- Nomor order dibuat otomatis per hari dengan format
  SO-YYMMDDNNN, contohnya SO-261124001.
- Membatalkan order dari Riwayat mengembalikan stoknya dan
  tercatat di mutasi sebagai Pembatalan.
- Saldo Kas di Beranda = catatan Buku Kas (Kelola, bagian Kas)
  ditambah semua penjualan Tunai yang selesai.
- Laba dihitung dari selisih harga jual dan harga modal yang
  tercatat saat transaksi terjadi. Mengubah harga produk hari
  ini tidak mengubah laporan kemarin.
- Data tersimpan di localStorage browser pada perangkat dan
  alamat yang sama. Membersihkan data browser, mengganti HP,
  atau membuka dari alamat lain berarti mulai dari kosong,
  jadi ekspor CSV secara berkala.
- Nama toko untuk struk diatur di tab Laporan.

## Batasan versi ini

Satu perangkat dan satu pengguna, setara aplikasi kasir offline.
Tidak ada sinkronisasi antarperangkat, multi-cabang, atau peran
staf. Delapan modul Pro aplikasi aslinya (Pajak dan Service,
Printer Dapur, Daftar Meja, Self Order, Daftar Pekerjaan, Komisi
Pekerja, Produksi dan Bahan Baku, Lampiran Order) memang
terkunci di paket Lite aslinya dan tidak dibangun di sini.
