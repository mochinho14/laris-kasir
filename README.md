# Laris: Aplikasi Kasir Pribadi (v2)

Aplikasi kasir (POS) ala Kaspoint, versi sendiri, dibangun ulang
mengikuti struktur aplikasi aslinya: Beranda, Kasir, Riwayat,
Kelola, Laporan. Berbentuk proyek web lengkap (HTML, CSS, JS,
manifest PWA, service worker, ikon) yang bisa dipasang di HP
seperti aplikasi dan jalan offline penuh. Data tersimpan lokal
di browser (localStorage). Tanpa langganan, tanpa server,
tanpa akun. Rincian file dan cara pasang ada di `PANDUAN.md`.

## Cara memakai

Ekstrak ZIP, lalu unggah folder `laris-kasir` ke hosting statis
(Netlify, GitHub Pages, Cloudflare Pages) dan buka dari Chrome
HP untuk memasangnya sebagai aplikasi. Untuk coba cepat, buka
`index.html` langsung juga bisa. Aplikasi terisi data contoh
ala demo: 18 produk retail (Frozen, Minuman, Sembako),
4 pelanggan, dan 3 transaksi contoh (penjualan hari ini
Rp144.000 dengan laba Rp12.000). Ganti dengan data asli lewat
tab Kelola. Panduan lengkap ada di `PANDUAN.md`.

## Fitur per tab

**Beranda**
- Penjualan hari ini (dengan perbandingan ke rata-rata harian),
  laba kotor dan margin, saldo kas, jumlah order pending
- Tren penjualan 7 hari (grafik batang), metode pembayaran 7 hari,
  produk terlaris 7 hari, daftar stok menipis

**Kasir**
- Katalog model daftar dengan pencarian nama atau SKU dan chip
  kategori, sisa stok tampil per produk
- Pilih pelanggan (Umum atau pelanggan terdaftar)
- Bayar Tunai, QRIS, Debit, Kredit, Transfer; kembalian otomatis
  untuk tunai; stok tidak bisa dijual melebihi persediaan
- Tahan order sebagai Pending, lanjutkan lagi dari Riwayat
- Setiap order dapat nomor urut per hari, format SO-YYMMDDNNN
- Struk setelah bayar: cetak atau kirim sebagai teks WhatsApp

**Riwayat**
- Cari nomor order atau pelanggan; saring Semua, Selesai,
  Pending, Dibatalkan
- Ringkasan bulan berjalan: total, jumlah transaksi, rata-rata
- Daftar dikelompokkan per hari (Hari Ini, Kemarin, tanggal)
- Klik order untuk melihat isi; order Selesai bisa dibatalkan
  (stok kembali), order Pending bisa dilanjutkan atau dibuang

**Kelola**
- Produk: tambah, ubah, hapus (nama, SKU, kategori, harga jual,
  harga modal, stok, stok minimum), restock cepat
- Pelanggan: nama dan nomor HP, total belanja per pelanggan
- Stok: saldo dan status aman/menipis per produk, plus riwayat
  mutasi lengkap (stok awal, penjualan, pembatalan, pembelian,
  restock, penyesuaian)
- Pembelian: catat restock dari supplier, stok bertambah otomatis
- Kas: buku kas masuk/keluar manual; saldo kas = kas manual +
  penjualan tunai

**Laporan**
- Penjualan, transaksi, laba kotor, rata-rata per transaksi,
  margin, item terjual, masing-masing dibandingkan hari sebelumnya
- Metode pembayaran, pelanggan belanja terbanyak, penjualan
  per jam (jam teramai), produk terlaris
- Ekspor semua transaksi ke CSV

## Yang tidak ikut disalin

Delapan modul Pro di aplikasi aslinya terkunci di paket Lite
(Pajak dan Service, Printer Dapur, Daftar Meja, Self Order,
Daftar Pekerjaan, Komisi Pekerja, Produksi dan Bahan Baku,
Lampiran Order), jadi tidak dibangun di sini. Sinkronisasi cloud
dan multi-cabang juga tidak ada karena versi ini offline satu
perangkat. Foto produk diganti ubin inisial nama produk.

## Catatan data

- Data memakai kunci penyimpanan `laris-db-v2`.
- Laba dihitung dari harga jual dan modal saat transaksi terjadi.
- Data hanya ada di browser perangkat ini; ekspor CSV berkala
  sebagai cadangan.
