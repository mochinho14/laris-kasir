// ---------- util dasar ----------
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
const rp = n => 'Rp' + new Intl.NumberFormat('id-ID').format(Math.round(n || 0));
// kelas warna pastel per kategori produk (bahasa warna Warm Workspace)
function katClass(kategori) {
  const k = (kategori || '').toLowerCase();
  if (k.includes('frozen')) return 'cat-biru';
  if (k.includes('minuman')) return 'cat-kuning';
  if (k.includes('sembako')) return 'cat-peach';
  return 'cat-netral';
}
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function pad2(n) { return String(n).padStart(2, '0'); }
function nowLocal(d) {
  d = d || new Date();
  return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()) +
    'T' + pad2(d.getHours()) + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds());
}
function dateStr(d) { return nowLocal(d).slice(0, 10); }
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function setStatus(id, msg, ok) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.className = 'status ' + (ok ? 'ok' : 'err');
}

// ---------- hitungan inti (murni) ----------
function hitungTotal(items) { return items.reduce((s, i) => s + i.hargaJual * i.qty, 0); }
function hitungLaba(items) { return items.reduce((s, i) => s + (i.hargaJual - i.hargaModal) * i.qty, 0); }
function hitungKembalian(bayar, total) { return bayar - total; }
function genNoOrder(waktu, semuaNo) {
  const tgl = waktu.slice(2, 4) + waktu.slice(5, 7) + waktu.slice(8, 10);
  const prefix = 'SO-' + tgl;
  let max = 0;
  for (const no of semuaNo) {
    if (no && no.startsWith(prefix)) {
      const n = parseInt(no.slice(prefix.length), 10);
      if (!isNaN(n) && n > max) max = n;
    }
  }
  return prefix + String(max + 1).padStart(3, '0');
}
function persenDelta(now, prev) {
  if (prev === 0) return now > 0 ? 100 : 0;
  return (now - prev) / Math.abs(prev) * 100;
}
function fmtDelta(now, prev) {
  const d = persenDelta(now, prev);
  const sign = d > 0 ? '+' : '';
  return { text: sign + (Math.round(d * 10) / 10) + '% vs sebelumnya', cls: d >= 0 ? 'up' : 'down' };
}

// ---------- seed ----------
const KEY = 'laris-db-v2';
function seed() {
  const P = (nama, sku, kategori, hargaJual, hargaModal, stok) =>
    ({ id: uid() + sku, nama, sku, kategori, hargaJual, hargaModal, stok, stokMin: 10 });
  const produk = [
    P('Bellfood French Fries 1Kg', 'FRZ01', 'Frozen', 38000, 34000, 147),
    P('Bernardi Patty Bun 6 pcs', 'FRZ02', 'Frozen', 16000, 14000, 133),
    P('Fiesta Nugget 500g', 'FRZ03', 'Frozen', 35000, 32000, 147),
    P('Kimbo Sosis Sapi 500g', 'FRZ04', 'Frozen', 45000, 39500, 124),
    P('Vida Baso Sapi', 'FRZ05', 'Frozen', 32000, 27500, 134),
    P('Yona Beef Patty 1kg', 'FRZ06', 'Frozen', 36000, 33000, 129),
    P('Coca Cola', 'MIN01', 'Minuman', 16000, 13500, 150),
    P('Fanta 1L', 'MIN02', 'Minuman', 16000, 13500, 136),
    P('Larutan Penyegar Kaki Tiga', 'MIN03', 'Minuman', 8000, 7500, 135),
    P('Nescafe Latte Can', 'MIN04', 'Minuman', 9500, 9000, 145),
    P('Susu Ultra Plain UHT 1L', 'MIN05', 'Minuman', 18000, 15500, 154),
    P('Teh Pucuk 330ml', 'MIN06', 'Minuman', 3000, 2200, 130),
    P('Filma Margarin 200g', 'SEM01', 'Sembako', 7500, 6800, 147),
    P('Gulaku Gula Pasir 1Kg', 'SEM02', 'Sembako', 17500, 16500, 159),
    P('Kecap Bango', 'SEM03', 'Sembako', 32000, 28000, 158),
    P('Kopi Kapal Api Hitam 100g', 'SEM04', 'Sembako', 12000, 10500, 141),
    P('Minyak Goreng Tropical 2L', 'SEM05', 'Sembako', 35000, 30500, 133),
    P('Teh Sariwangi Celup', 'SEM06', 'Sembako', 12000, 10200, 134)
  ];
  const byName = n => produk.find(p => p.nama === n);
  const item = (nama, qty) => {
    const p = byName(nama);
    return { produkId: p.id, nama: p.nama, hargaJual: p.hargaJual, hargaModal: p.hargaModal, qty };
  };
  const today = new Date(); today.setHours(12, 0, 0, 0);
  const yest = addDays(new Date(), -1);
  const t1waktu = nowLocal(today);
  const t2waktu = dateStr(yest) + 'T13:15:00';
  const t3waktu = dateStr(yest) + 'T12:00:00';
  const items1 = [item('Bellfood French Fries 1Kg', 1), item('Yona Beef Patty 1kg', 1),
    item('Fiesta Nugget 500g', 1), item('Gulaku Gula Pasir 1Kg', 1),
    item('Nescafe Latte Can', 1), item('Larutan Penyegar Kaki Tiga', 1)];
  const items2 = [item('Susu Ultra Plain UHT 1L', 2), item('Kopi Kapal Api Hitam 100g', 1)];
  const items3 = [item('Teh Pucuk 330ml', 4), item('Filma Margarin 200g', 2)];
  const mk = (no, waktu, pelanggan, items, metode, bayar) => ({
    id: uid() + no, no, waktu, pelanggan, items,
    total: hitungTotal(items), laba: hitungLaba(items),
    metode, bayar, kembali: hitungKembalian(bayar, hitungTotal(items)), status: 'Selesai'
  });
  const nos = [];
  const no3 = genNoOrder(t3waktu, nos); nos.push(no3);
  const no2 = genNoOrder(t2waktu, nos); nos.push(no2);
  const no1 = genNoOrder(t1waktu, nos); nos.push(no1);
  const transaksi = [
    mk(no3, t3waktu, 'Umum', items3, 'Tunai', 30000),
    mk(no2, t2waktu, 'Maya Putri', items2, 'QRIS', hitungTotal(items2)),
    mk(no1, t1waktu, 'Budi Santoso', items1, 'Tunai', 150000)
  ];
  const mutasi = [];
  for (const p of produk) {
    mutasi.push({ id: uid(), waktu: dateStr(yest) + 'T08:00:00', produkId: p.id, nama: p.nama,
      tipe: 'Stok awal', qty: p.stok, saldo: p.stok, ket: 'Data contoh awal' });
  }
  for (const t of transaksi) {
    for (const i of t.items) {
      const p = byName(i.nama);
      p.stok -= i.qty;
      mutasi.push({ id: uid(), waktu: t.waktu, produkId: p.id, nama: p.nama,
        tipe: 'Penjualan', qty: -i.qty, saldo: p.stok, ket: t.no });
    }
  }
  return {
    settings: { namaToko: 'Toko Demo Laris' },
    produk,
    pelanggan: [
      { id: uid() + 'a', nama: 'Budi Santoso', hp: '089999999901' },
      { id: uid() + 'b', nama: 'Doni Pratama', hp: '089999999902' },
      { id: uid() + 'c', nama: 'Maya Putri', hp: '089999999903' },
      { id: uid() + 'd', nama: 'Andi Wijaya', hp: '089999999904' }
    ],
    transaksi,
    tahan: [],
    pembelian: [],
    kas: [{ id: uid(), waktu: dateStr(yest) + 'T08:00:00', tipe: 'masuk', ket: 'Saldo awal kas', jumlah: 2500000 }],
    mutasi
  };
}
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  const d = seed();
  localStorage.setItem(KEY, JSON.stringify(d));
  return d;
}
let DB = load();
function save() { localStorage.setItem(KEY, JSON.stringify(DB)); }
function produkById(id) { return DB.produk.find(p => p.id === id); }
function semuaNo() {
  return [...DB.transaksi.map(t => t.no), ...DB.tahan.map(t => t.no)];
}
function catatMutasi(p, tipe, qty, ket) {
  DB.mutasi.push({ id: uid(), waktu: nowLocal(), produkId: p.id, nama: p.nama,
    tipe, qty, saldo: p.stok, ket: ket || '' });
}
function trxSelesai() { return DB.transaksi.filter(t => t.status === 'Selesai'); }
function trxPada(tgl) { return trxSelesai().filter(t => t.waktu.slice(0, 10) === tgl); }
function ringkas(rows) {
  return {
    total: rows.reduce((s, t) => s + t.total, 0),
    laba: rows.reduce((s, t) => s + t.laba, 0),
    trx: rows.length,
    item: rows.reduce((s, t) => s + t.items.reduce((a, i) => a + i.qty, 0), 0)
  };
}
function saldoKas() {
  const manual = DB.kas.reduce((s, k) => s + (k.tipe === 'masuk' ? k.jumlah : -k.jumlah), 0);
  const tunai = trxSelesai().filter(t => t.metode === 'Tunai').reduce((s, t) => s + t.total, 0);
  return manual + tunai;
}

// ---------- tab utama ----------
document.querySelectorAll('#tabs button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('active', b === btn));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
    renderAll();
  });
});
function gotoTab(name) {
  document.querySelector('#tabs button[data-tab="' + name + '"]').click();
}

// ---------- beranda ----------
function renderBeranda() {
  const hariIni = dateStr(new Date());
  const r = ringkas(trxPada(hariIni));
  document.getElementById('b-jual').textContent = rp(r.total);
  document.getElementById('b-jual-meta').textContent = r.trx + ' transaksi, ' + r.item + ' item';
  let total7 = 0;
  for (let i = 1; i <= 7; i++) total7 += ringkas(trxPada(dateStr(addDays(new Date(), -i)))).total;
  const rata = total7 / 7;
  const dd = document.getElementById('b-jual-delta');
  if (rata > 0) {
    const d = fmtDelta(r.total, rata);
    dd.textContent = d.text.replace('vs sebelumnya', 'vs rata-rata harian');
    dd.className = 'delta ' + d.cls;
  } else dd.textContent = '';
  document.getElementById('b-laba').textContent = rp(r.laba);
  document.getElementById('b-laba-meta').textContent = 'Margin ' + (r.total ? Math.round(r.laba / r.total * 1000) / 10 : 0) + '%';
  document.getElementById('b-kas').textContent = rp(saldoKas());
  document.getElementById('b-pending').textContent = DB.tahan.length;
  // tren 7 hari
  const namaHari = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = addDays(new Date(), -i);
    days.push({ label: namaHari[d.getDay()], tgl: dateStr(d), total: ringkas(trxPada(dateStr(d))).total, today: i === 0 });
  }
  const max = Math.max(...days.map(d => d.total), 1);
  const totalTren = days.reduce((s, d) => s + d.total, 0);
  const trxTren = days.reduce((s, d) => s + trxPada(d.tgl).length, 0);
  document.getElementById('b-tren-meta').textContent =
    'Total ' + rp(totalTren) + ' dari ' + trxTren + ' transaksi, rata-rata ' + rp(totalTren / 7) + ' per hari';
  document.getElementById('b-tren').innerHTML = days.map(d =>
    '<div class="col' + (d.today ? ' today' : '') + '"><div class="dv">' + (d.total ? rp(d.total) : '') +
    '</div><div class="bar" style="height:' + Math.round(d.total / max * 88) + '%"></div><div class="dl">' +
    d.label + '</div></div>'
  ).join('');
  // metode 7 hari
  const rows7 = trxSelesai().filter(t => t.waktu.slice(0, 10) >= dateStr(addDays(new Date(), -6)));
  renderMetode(document.getElementById('b-metode'), rows7);
  // terlaris 7 hari
  renderTerlaris(document.getElementById('b-laris'), rows7);
  // stok menipis
  const low = DB.produk.filter(p => p.stok <= p.stokMin);
  document.getElementById('b-stok').innerHTML = low.length
    ? low.map(p => '<div class="bar-row"><span class="nm">' + esc(p.nama) + '</span><span class="badge low">sisa ' + p.stok + '</span></div>').join('')
    : '<p class="sub" style="margin:0">Semua stok dalam batas aman.</p>';
}
function renderMetode(el, rows) {
  const total = rows.reduce((s, t) => s + t.total, 0);
  if (!rows.length) { el.innerHTML = '<div class="empty">Belum ada penjualan pada periode ini.</div>'; return; }
  const agg = {};
  for (const t of rows) {
    agg[t.metode] = agg[t.metode] || { jumlah: 0, kali: 0 };
    agg[t.metode].jumlah += t.total; agg[t.metode].kali++;
  }
  el.innerHTML = Object.entries(agg).sort((a, b) => b[1].jumlah - a[1].jumlah).map(([m, v]) =>
    '<div class="bar-row"><span class="nm">' + esc(m) + ' (' + v.kali + 'x)</span>' +
    '<span class="tr"><span class="fl" style="display:block;width:' + Math.round(v.jumlah / total * 100) + '%"></span></span>' +
    '<span class="vl">' + rp(v.jumlah) + ' (' + Math.round(v.jumlah / total * 100) + '%)</span></div>'
  ).join('');
}
function renderTerlaris(el, rows) {
  const agg = {};
  for (const t of rows) for (const i of t.items) {
    agg[i.nama] = agg[i.nama] || { qty: 0, uang: 0 };
    agg[i.nama].qty += i.qty; agg[i.nama].uang += i.hargaJual * i.qty;
  }
  const top = Object.entries(agg).sort((a, b) => b[1].qty - a[1].qty).slice(0, 5);
  if (!top.length) { el.innerHTML = '<div class="empty">Belum ada penjualan pada periode ini.</div>'; return; }
  const max = top[0][1].qty;
  el.innerHTML = top.map(([n, v], idx) =>
    '<div class="bar-row"><span class="nm">' + (idx + 1) + '. ' + esc(n) + '</span>' +
    '<span class="tr"><span class="fl" style="display:block;width:' + Math.round(v.qty / max * 100) + '%"></span></span>' +
    '<span class="vl">' + rp(v.uang) + ' (' + v.qty + 'x)</span></div>'
  ).join('');
}

// ---------- kasir ----------
let cart = [];
let filterKategori = 'Semua';
function cartItems() {
  return cart.map(c => {
    const p = produkById(c.produkId);
    return { produkId: c.produkId, nama: p ? p.nama : '(terhapus)',
             hargaJual: p ? p.hargaJual : 0, hargaModal: p ? p.hargaModal : 0, qty: c.qty };
  });
}
function renderKatalog() {
  const cats = ['Semua', ...new Set(DB.produk.map(p => p.kategori).filter(Boolean))];
  document.getElementById('chips').innerHTML = cats.map(c =>
    '<button data-cat="' + esc(c) + '"' + (c === filterKategori ? ' class="active"' : '') + '>' + esc(c) + '</button>'
  ).join('');
  const q = document.getElementById('cari').value.trim().toLowerCase();
  const list = DB.produk.filter(p =>
    (filterKategori === 'Semua' || p.kategori === filterKategori) &&
    (!q || p.nama.toLowerCase().includes(q) || (p.sku || '').toLowerCase().includes(q)));
  const box = document.getElementById('produk-list');
  if (!list.length) { box.innerHTML = '<div class="empty">Tidak ada produk yang cocok.</div>'; return; }
  box.innerHTML = list.map(p => {
    const habis = p.stok <= 0;
    const low = !habis && p.stok <= p.stokMin;
    const initials = p.nama.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
    return '<button class="prod-row" data-add="' + p.id + '"' + (habis ? ' disabled' : '') + '>' +
      '<span class="avatar ' + katClass(p.kategori) + '">' + esc(initials) + '</span><span class="info"><span class="n">' + esc(p.nama) +
      '</span><br><span class="h">' + rp(p.hargaJual) + '</span> ' +
      '<span class="s' + (low || habis ? ' low' : '') + '">' + (habis ? 'stok habis' : 'sisa ' + p.stok + (low ? ' (menipis)' : '')) + '</span></span>' +
      '<span class="add-btn">+</span></button>';
  }).join('');
}
function renderCart() {
  fillPelangganSelect();
  const box = document.getElementById('cart-items');
  const items = cartItems();
  if (!items.length) {
    box.innerHTML = '<div class="empty">Keranjang kosong. Klik produk untuk menambahkan.</div>';
  } else {
    box.innerHTML = items.map(i =>
      '<div class="cart-item"><div><div class="nm">' + esc(i.nama) + '</div>' +
      '<div class="dt">' + rp(i.hargaJual) + ' x ' + i.qty + ' = ' + rp(i.hargaJual * i.qty) + '</div></div>' +
      '<div class="qty"><button data-dec="' + i.produkId + '">-</button><span>' + i.qty + '</span>' +
      '<button data-inc="' + i.produkId + '">+</button>' +
      '<button data-del="' + i.produkId + '" title="Buang">x</button></div></div>'
    ).join('');
  }
  document.getElementById('cart-total').textContent = rp(hitungTotal(items));
  updateKembalian();
}
function fillPelangganSelect() {
  const sel = document.getElementById('cart-pelanggan');
  const cur = sel.value || 'Umum';
  sel.innerHTML = '<option value="Umum">Umum</option>' + DB.pelanggan.map(p =>
    '<option value="' + esc(p.nama) + '"' + (p.nama === cur ? ' selected' : '') + '>' + esc(p.nama) + '</option>'
  ).join('');
  if (cur !== 'Umum' && !DB.pelanggan.some(p => p.nama === cur)) sel.value = 'Umum';
}
function updateKembalian() {
  const metode = document.getElementById('metode').value;
  const total = hitungTotal(cartItems());
  const tunai = metode === 'Tunai';
  document.getElementById('tunai-box').style.display = tunai ? '' : 'none';
  const line = document.getElementById('kembalian-line');
  if (tunai) {
    const bayar = parseFloat(document.getElementById('bayar').value) || 0;
    if (bayar > 0 || total > 0) {
      line.style.display = '';
      const k = hitungKembalian(bayar, total);
      document.getElementById('kembalian').textContent = rp(k);
      line.classList.toggle('neg', k < 0);
    } else line.style.display = 'none';
  } else line.style.display = 'none';
}
document.getElementById('cari').addEventListener('input', renderKatalog);
document.getElementById('metode').addEventListener('change', updateKembalian);
document.getElementById('bayar').addEventListener('input', updateKembalian);
function terapkanPenjualan(trx) {
  for (const i of trx.items) {
    const p = produkById(i.produkId);
    if (p) { p.stok -= i.qty; catatMutasi(p, 'Penjualan', -i.qty, trx.no); }
  }
}
document.getElementById('bayar-btn').addEventListener('click', () => {
  const items = cartItems();
  if (!items.length) { setStatus('kasir-msg', 'Keranjang masih kosong.', false); return; }
  for (const i of items) {
    const p = produkById(i.produkId);
    if (!p || i.qty > p.stok) { setStatus('kasir-msg', 'Stok ' + i.nama + ' tidak cukup untuk transaksi ini.', false); return; }
  }
  const total = hitungTotal(items);
  const metode = document.getElementById('metode').value;
  let bayar = total, kembali = 0;
  if (metode === 'Tunai') {
    bayar = parseFloat(document.getElementById('bayar').value) || 0;
    kembali = hitungKembalian(bayar, total);
    if (kembali < 0) { setStatus('kasir-msg', 'Uang diterima kurang ' + rp(-kembali) + ' dari total.', false); return; }
  }
  const waktu = nowLocal();
  const trx = {
    id: uid(), no: genNoOrder(waktu, semuaNo()), waktu,
    pelanggan: document.getElementById('cart-pelanggan').value || 'Umum',
    items, total, laba: hitungLaba(items), metode, bayar, kembali, status: 'Selesai'
  };
  terapkanPenjualan(trx);
  DB.transaksi.push(trx);
  lastTrx = trx;
  cart = [];
  document.getElementById('bayar').value = '';
  save(); renderCart(); renderKatalog();
  showStruk(trx);
});
document.getElementById('tahan-btn').addEventListener('click', () => {
  const items = cartItems();
  if (!items.length) { setStatus('kasir-msg', 'Keranjang masih kosong, tidak ada yang ditahan.', false); return; }
  const waktu = nowLocal();
  DB.tahan.push({
    id: uid(), no: genNoOrder(waktu, semuaNo()), waktu,
    pelanggan: document.getElementById('cart-pelanggan').value || 'Umum',
    items
  });
  cart = [];
  save(); renderCart();
  setStatus('kasir-msg', 'Order ditahan sebagai Pending. Lanjutkan dari tab Riwayat, filter Pending.', true);
});

// ---------- struk ----------
let lastTrx = null;
function strukText(t) {
  const lines = [DB.settings.namaToko, t.no, t.waktu.replace('T', ' ').slice(0, 16),
    'Pelanggan: ' + t.pelanggan, '------------------------------'];
  for (const i of t.items) lines.push(i.nama + ' x' + i.qty + ' = ' + rp(i.hargaJual * i.qty));
  lines.push('------------------------------');
  lines.push('Total: ' + rp(t.total));
  lines.push(t.metode + ': ' + rp(t.bayar));
  lines.push('Kembali: ' + rp(t.kembali));
  lines.push('Terima kasih sudah berbelanja');
  return lines.join('\n');
}
function showStruk(t) {
  document.getElementById('st-toko').textContent = DB.settings.namaToko;
  document.getElementById('st-no').textContent = t.no;
  document.getElementById('st-waktu').textContent = t.waktu.replace('T', ' ').slice(0, 16);
  document.getElementById('st-pelanggan').textContent = 'Pelanggan: ' + t.pelanggan;
  document.getElementById('st-items').innerHTML = t.items.map(i =>
    '<div class="r"><span>' + esc(i.nama) + ' x' + i.qty + '</span><span>' + rp(i.hargaJual * i.qty) + '</span></div>'
  ).join('');
  document.getElementById('st-total').textContent = rp(t.total);
  document.getElementById('st-metode').textContent = t.metode;
  document.getElementById('st-bayar').textContent = rp(t.bayar);
  document.getElementById('st-kembali').textContent = rp(t.kembali);
  document.getElementById('struk-overlay').classList.add('open');
}
document.getElementById('st-tutup').addEventListener('click', () =>
  document.getElementById('struk-overlay').classList.remove('open'));
document.getElementById('st-cetak').addEventListener('click', () => window.print());
document.getElementById('st-wa').addEventListener('click', () => {
  if (!lastTrx) return;
  window.open('https://wa.me/?text=' + encodeURIComponent(strukText(lastTrx)), '_blank');
});

// ---------- riwayat ----------
let filterRiwayat = 'Semua';
let openDetail = null;
document.getElementById('r-cari').addEventListener('input', renderRiwayat);
function labelHari(tgl) {
  const today = dateStr(new Date());
  const yest = dateStr(addDays(new Date(), -1));
  const namaHari = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
  const d = new Date(tgl + 'T00:00:00');
  const base = namaHari[d.getDay()] + ' ' + tgl.slice(8, 10) + '/' + tgl.slice(5, 7);
  if (tgl === today) return 'HARI INI, ' + base;
  if (tgl === yest) return 'KEMARIN, ' + base;
  return base;
}
function renderRiwayat() {
  const bulan = dateStr(new Date()).slice(0, 7);
  const rowsBulan = trxSelesai().filter(t => t.waktu.slice(0, 7) === bulan);
  const rb = ringkas(rowsBulan);
  document.getElementById('r-bulan-total').textContent = rp(rb.total);
  document.getElementById('r-bulan-trx').textContent = rb.trx;
  document.getElementById('r-bulan-rata').textContent = rb.trx ? rp(rb.total / rb.trx) : 'Rp0';
  const q = document.getElementById('r-cari').value.trim().toLowerCase();
  const entries = [];
  for (const t of DB.transaksi) entries.push({ kind: t.status, data: t });
  for (const t of DB.tahan) entries.push({ kind: 'Pending', data: t });
  const filtered = entries.filter(e => {
    if (filterRiwayat !== 'Semua' && e.kind !== filterRiwayat) return false;
    if (q && !(e.data.no.toLowerCase().includes(q) || (e.data.pelanggan || '').toLowerCase().includes(q))) return false;
    return true;
  }).sort((a, b) => b.data.waktu.localeCompare(a.data.waktu));
  const box = document.getElementById('r-list');
  if (!filtered.length) { box.innerHTML = '<div class="empty">Tidak ada order pada filter ini.</div>'; return; }
  let html = '', lastDay = '';
  for (const e of filtered) {
    const t = e.data;
    const day = t.waktu.slice(0, 10);
    if (day !== lastDay) { html += '<div class="day-label">' + labelHari(day) + '</div>'; lastDay = day; }
    const total = e.kind === 'Pending' ? hitungTotal(t.items) : t.total;
    html += '<div class="order-row" data-detail="' + t.id + '"><div><div class="no">' + esc(t.no) +
      ' <span class="badge ' + (e.kind === 'Selesai' ? 'selesai' : e.kind === 'Pending' ? 'pending' : 'batal') + '">' + e.kind + '</span></div>' +
      '<div class="meta">' + esc(t.pelanggan || 'Umum') + ' - ' + t.waktu.slice(11, 16) +
      (e.kind === 'Pending' ? '' : ' - ' + esc(t.metode)) + '</div></div>' +
      '<div class="amt">' + rp(total) + '</div></div>';
    if (openDetail === t.id) {
      html += '<div class="order-detail">' +
        t.items.map(i => '<div>' + esc(i.nama) + ' x' + i.qty + ' = ' + rp(i.hargaJual * i.qty) + '</div>').join('') +
        '<div style="margin-top:8px">';
      if (e.kind === 'Selesai') html += '<button class="link red" data-batalkan="' + t.id + '">Batalkan order (stok kembali)</button>';
      if (e.kind === 'Pending') {
        html += '<button class="link" data-lanjut="' + t.id + '">Lanjutkan di kasir</button> ' +
                '<button class="link red" data-buang="' + t.id + '">Buang</button>';
      }
      html += '</div></div>';
    }
  }
  box.innerHTML = html;
}

// ---------- kelola ----------
document.querySelectorAll('#k-chips button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#k-chips button').forEach(b => b.classList.toggle('active', b === btn));
    ['produk', 'pelanggan', 'stok', 'pembelian', 'kas'].forEach(k =>
      document.getElementById('k-' + k).style.display = k === btn.dataset.k ? '' : 'none');
    renderKelola();
  });
});
function renderKelola() { renderProduk(); renderPelanggan(); renderStok(); renderPembelian(); renderKas(); }

// produk
function renderProduk() {
  const cats = new Set(DB.produk.map(p => p.kategori).filter(Boolean));
  document.getElementById('katalog-meta').textContent =
    DB.produk.length + ' produk aktif di ' + cats.size + ' kategori. Harga modal dipakai untuk menghitung laba.';
  const t = document.getElementById('pr-tabel');
  if (!DB.produk.length) { t.innerHTML = '<tr><td class="empty">Belum ada produk.</td></tr>'; return; }
  t.innerHTML = '<tr><th>Produk</th><th>SKU</th><th>Kategori</th><th>Jual</th><th>Modal</th><th>Stok</th><th></th></tr>' +
    DB.produk.map(p =>
      '<tr><td>' + esc(p.nama) + '</td><td>' + esc(p.sku || '-') + '</td><td>' + esc(p.kategori) + '</td><td>' + rp(p.hargaJual) +
      '</td><td>' + rp(p.hargaModal) + '</td><td>' +
      (p.stok <= p.stokMin ? '<span class="badge low">' + p.stok + ' (menipis)</span>' : '<span class="badge ok">' + p.stok + '</span>') +
      '</td><td><button class="link" data-restock="' + p.id + '">+ Stok</button> ' +
      '<button class="link" data-edit="' + p.id + '">Ubah</button> ' +
      '<button class="link red" data-delp="' + p.id + '">Hapus</button></td></tr>'
    ).join('');
}
document.getElementById('pr-batal').addEventListener('click', () => {
  document.getElementById('pr-id').value = '';
  document.getElementById('form-title').textContent = 'Tambah Produk';
  document.getElementById('pr-batal').style.display = 'none';
  ['pr-nama', 'pr-sku', 'pr-kategori', 'pr-jual', 'pr-modal', 'pr-stok'].forEach(id => document.getElementById(id).value = '');
});
document.getElementById('pr-simpan').addEventListener('click', () => {
  const id = document.getElementById('pr-id').value;
  const nama = document.getElementById('pr-nama').value.trim();
  const sku = document.getElementById('pr-sku').value.trim();
  const kategori = document.getElementById('pr-kategori').value.trim();
  const jual = parseFloat(document.getElementById('pr-jual').value);
  const modal = parseFloat(document.getElementById('pr-modal').value);
  const stok = parseInt(document.getElementById('pr-stok').value, 10);
  const stokMin = parseInt(document.getElementById('pr-stokmin').value, 10);
  if (!nama) { setStatus('pr-msg', 'Nama produk wajib diisi.', false); return; }
  if (isNaN(jual) || isNaN(modal) || isNaN(stok)) { setStatus('pr-msg', 'Harga jual, harga modal, dan stok harus angka.', false); return; }
  if (id) {
    const p = produkById(id);
    const delta = stok - p.stok;
    Object.assign(p, { nama, sku, kategori, hargaJual: jual, hargaModal: modal, stok, stokMin: isNaN(stokMin) ? 10 : stokMin });
    if (delta !== 0) catatMutasi(p, 'Penyesuaian', delta, 'Ubah produk');
    setStatus('pr-msg', 'Produk "' + nama + '" diperbarui.', true);
  } else {
    const p = { id: uid(), nama, sku, kategori, hargaJual: jual, hargaModal: modal, stok, stokMin: isNaN(stokMin) ? 10 : stokMin };
    DB.produk.push(p);
    catatMutasi(p, 'Stok awal', stok, 'Produk baru');
    setStatus('pr-msg', 'Produk "' + nama + '" ditambahkan.', true);
  }
  save();
  document.getElementById('pr-batal').click();
  renderProduk(); renderKatalog();
});

// pelanggan
function renderPelanggan() {
  const t = document.getElementById('pl-tabel');
  if (!DB.pelanggan.length) { t.innerHTML = '<tr><td class="empty">Belum ada pelanggan terdaftar.</td></tr>'; return; }
  const belanja = {};
  for (const tr of trxSelesai()) belanja[tr.pelanggan] = (belanja[tr.pelanggan] || 0) + tr.total;
  t.innerHTML = '<tr><th>Nama</th><th>Nomor HP</th><th>Total Belanja</th><th></th></tr>' +
    DB.pelanggan.map(p =>
      '<tr><td>' + esc(p.nama) + '</td><td>' + esc(p.hp || '-') + '</td><td>' + rp(belanja[p.nama] || 0) +
      '</td><td><button class="link red" data-delplg="' + p.id + '">Hapus</button></td></tr>'
    ).join('');
}
document.getElementById('pl-tambah').addEventListener('click', () => {
  const nama = document.getElementById('pl-nama').value.trim();
  const hp = document.getElementById('pl-hp').value.trim();
  if (!nama) { setStatus('pl-msg', 'Nama pelanggan wajib diisi.', false); return; }
  if (DB.pelanggan.some(p => p.nama.toLowerCase() === nama.toLowerCase())) {
    setStatus('pl-msg', 'Pelanggan dengan nama itu sudah ada.', false); return;
  }
  DB.pelanggan.push({ id: uid(), nama, hp });
  save();
  document.getElementById('pl-nama').value = '';
  document.getElementById('pl-hp').value = '';
  setStatus('pl-msg', 'Pelanggan "' + nama + '" ditambahkan.', true);
  renderPelanggan(); renderCart();
});

// stok dan mutasi
function renderStok() {
  const menipis = DB.produk.filter(p => p.stok <= p.stokMin).length;
  document.getElementById('stok-meta').textContent =
    DB.produk.length + ' item dilacak, ' + (DB.produk.length - menipis) + ' aman, ' + menipis + ' menipis.';
  const t = document.getElementById('st-tabel');
  t.innerHTML = '<tr><th>Produk</th><th>Saldo Stok</th><th>Minimum</th><th>Status</th></tr>' +
    DB.produk.map(p =>
      '<tr><td>' + esc(p.nama) + '</td><td>' + p.stok + '</td><td>' + p.stokMin + '</td><td>' +
      (p.stok <= p.stokMin ? '<span class="badge low">Menipis</span>' : '<span class="badge ok">Aman</span>') + '</td></tr>'
    ).join('');
  const sel = document.getElementById('mut-produk');
  const cur = sel.value;
  sel.innerHTML = '<option value="">Semua produk</option>' + DB.produk.map(p =>
    '<option value="' + p.id + '"' + (p.id === cur ? ' selected' : '') + '>' + esc(p.nama) + '</option>'
  ).join('');
  const rows = DB.mutasi.filter(m => !cur || m.produkId === cur).slice(-40).reverse();
  const mt = document.getElementById('mut-tabel');
  if (!rows.length) { mt.innerHTML = '<tr><td class="empty">Belum ada mutasi.</td></tr>'; return; }
  mt.innerHTML = '<tr><th>Waktu</th><th>Produk</th><th>Tipe</th><th>Jumlah</th><th>Saldo</th><th>Keterangan</th></tr>' +
    rows.map(m =>
      '<tr><td>' + esc(m.waktu.replace('T', ' ').slice(0, 16)) + '</td><td>' + esc(m.nama) + '</td><td>' + esc(m.tipe) +
      '</td><td>' + (m.qty > 0 ? '+' : '') + m.qty + '</td><td>' + m.saldo + '</td><td>' + esc(m.ket || '') + '</td></tr>'
    ).join('');
}
document.getElementById('mut-produk').addEventListener('change', renderStok);

// pembelian
function renderPembelian() {
  const sel = document.getElementById('pb-produk');
  const cur = sel.value;
  sel.innerHTML = DB.produk.map(p =>
    '<option value="' + p.id + '"' + (p.id === cur ? ' selected' : '') + '>' + esc(p.nama) + '</option>'
  ).join('');
  const t = document.getElementById('pb-tabel');
  if (!DB.pembelian.length) { t.innerHTML = '<tr><td class="empty">Belum ada pembelian tercatat.</td></tr>'; return; }
  t.innerHTML = '<tr><th>Waktu</th><th>Produk</th><th>Jumlah</th><th>Harga Beli</th><th>Total</th><th>Supplier</th></tr>' +
    DB.pembelian.slice().reverse().map(b =>
      '<tr><td>' + esc(b.waktu.replace('T', ' ').slice(0, 16)) + '</td><td>' + esc(b.nama) + '</td><td>' + b.qty +
      '</td><td>' + rp(b.hargaBeli) + '</td><td>' + rp(b.qty * b.hargaBeli) + '</td><td>' + esc(b.supplier || '-') + '</td></tr>'
    ).join('');
}
document.getElementById('pb-simpan').addEventListener('click', () => {
  const p = produkById(document.getElementById('pb-produk').value);
  const qty = parseInt(document.getElementById('pb-qty').value, 10);
  const harga = parseFloat(document.getElementById('pb-harga').value);
  const supplier = document.getElementById('pb-supplier').value.trim();
  if (!p) { setStatus('pb-msg', 'Pilih produk dulu.', false); return; }
  if (isNaN(qty) || qty <= 0 || isNaN(harga) || harga < 0) { setStatus('pb-msg', 'Jumlah dan harga beli harus angka yang benar.', false); return; }
  p.stok += qty;
  DB.pembelian.push({ id: uid(), waktu: nowLocal(), produkId: p.id, nama: p.nama, qty, hargaBeli: harga, supplier });
  catatMutasi(p, 'Pembelian', qty, supplier ? 'Supplier: ' + supplier : 'Pembelian');
  save();
  setStatus('pb-msg', 'Pembelian ' + p.nama + ' x' + qty + ' tersimpan. Stok sekarang ' + p.stok + '.', true);
  renderPembelian(); renderStok(); renderKatalog(); renderProduk();
});

// kas
function renderKas() {
  const t = document.getElementById('ks-tabel');
  if (!DB.kas.length) { t.innerHTML = '<tr><td class="empty">Belum ada catatan kas manual.</td></tr>'; return; }
  t.innerHTML = '<tr><th>Waktu</th><th>Jenis</th><th>Keterangan</th><th>Jumlah</th><th></th></tr>' +
    DB.kas.slice().reverse().map(k =>
      '<tr><td>' + esc(k.waktu.replace('T', ' ').slice(0, 16)) + '</td><td>' + (k.tipe === 'masuk' ? 'Masuk' : 'Keluar') +
      '</td><td>' + esc(k.ket) + '</td><td>' + (k.tipe === 'masuk' ? '+' : '-') + rp(k.jumlah).slice(2) +
      '</td><td><button class="link red" data-delkas="' + k.id + '">Hapus</button></td></tr>'
    ).join('');
}
document.getElementById('ks-simpan').addEventListener('click', () => {
  const tipe = document.getElementById('ks-tipe').value;
  const ket = document.getElementById('ks-ket').value.trim();
  const jumlah = parseFloat(document.getElementById('ks-jumlah').value);
  if (!ket) { setStatus('ks-msg', 'Keterangan wajib diisi.', false); return; }
  if (isNaN(jumlah) || jumlah <= 0) { setStatus('ks-msg', 'Jumlah harus angka lebih dari 0.', false); return; }
  DB.kas.push({ id: uid(), waktu: nowLocal(), tipe, ket, jumlah });
  save();
  document.getElementById('ks-ket').value = '';
  document.getElementById('ks-jumlah').value = '';
  setStatus('ks-msg', 'Catatan kas tersimpan. Saldo kas sekarang ' + rp(saldoKas()) + '.', true);
  renderKas();
});

// ---------- laporan ----------
function renderLaporan() {
  const tglInput = document.getElementById('lp-tanggal');
  if (!tglInput.value) tglInput.value = dateStr(new Date());
  document.getElementById('lp-toko').value = DB.settings.namaToko;
  const tgl = tglInput.value;
  const prev = dateStr(addDays(new Date(tgl + 'T00:00:00'), -1));
  const a = ringkas(trxPada(tgl));
  const b = ringkas(trxPada(prev));
  const rataA = a.trx ? a.total / a.trx : 0, rataB = b.trx ? b.total / b.trx : 0;
  const marginA = a.total ? a.laba / a.total * 100 : 0, marginB = b.total ? b.laba / b.total * 100 : 0;
  const set = (id, val, dId, now, prevVal, isPct) => {
    document.getElementById(id).textContent = val;
    const d = fmtDelta(now, prevVal);
    const el = document.getElementById(dId);
    el.textContent = isPct ? (now - prevVal >= 0 ? '+' : '') + (Math.round((now - prevVal) * 10) / 10) + ' poin vs sebelumnya' : d.text;
    el.className = 'delta ' + ((now - prevVal) >= 0 ? 'up' : 'down');
  };
  set('lp-jual', rp(a.total), 'lp-jual-d', a.total, b.total);
  set('lp-trx', a.trx, 'lp-trx-d', a.trx, b.trx);
  set('lp-laba', rp(a.laba), 'lp-laba-d', a.laba, b.laba);
  set('lp-rata', rp(rataA), 'lp-rata-d', rataA, rataB);
  set('lp-margin', (Math.round(marginA * 10) / 10) + '%', 'lp-margin-d', marginA, marginB, true);
  set('lp-item', a.item, 'lp-item-d', a.item, b.item);
  const rows = trxPada(tgl);
  renderMetode(document.getElementById('lp-metode'), rows);
  // pelanggan terbanyak
  const aggP = {};
  for (const t of rows) aggP[t.pelanggan] = (aggP[t.pelanggan] || 0) + t.total;
  const topP = Object.entries(aggP).sort((x, y) => y[1] - x[1]).slice(0, 3);
  document.getElementById('lp-pelanggan').innerHTML = topP.length
    ? topP.map(([n, v], idx) => '<div class="bar-row"><span class="nm">' + (idx + 1) + '. ' + esc(n) + '</span><span class="vl" style="flex:1">' + rp(v) + '</span></div>').join('')
    : '<div class="empty">Belum ada penjualan pada tanggal ini.</div>';
  // per jam
  const perJam = {};
  for (const t of rows) {
    const jam = t.waktu.slice(11, 13);
    perJam[jam] = (perJam[jam] || 0) + t.total;
  }
  const jamRows = Object.entries(perJam).sort((x, y) => y[1] - x[1]);
  if (jamRows.length) {
    document.getElementById('lp-jam-meta').textContent = 'Jam teramai: ' + jamRows[0][0] + '.00 (' + rp(jamRows[0][1]) + ')';
    const max = jamRows[0][1];
    document.getElementById('lp-jam').innerHTML = jamRows.map(([j, v]) =>
      '<div class="bar-row"><span class="nm">Jam ' + j + '.00</span>' +
      '<span class="tr"><span class="fl" style="display:block;width:' + Math.round(v / max * 100) + '%"></span></span>' +
      '<span class="vl">' + rp(v) + '</span></div>'
    ).join('');
  } else {
    document.getElementById('lp-jam-meta').textContent = '';
    document.getElementById('lp-jam').innerHTML = '<div class="empty">Belum ada penjualan pada tanggal ini.</div>';
  }
  renderTerlaris(document.getElementById('lp-laris'), rows);
  const tb = document.getElementById('lp-tabel');
  if (!rows.length) { tb.innerHTML = '<tr><td class="empty">Tidak ada transaksi pada tanggal ini.</td></tr>'; return; }
  tb.innerHTML = '<tr><th>No Order</th><th>Jam</th><th>Pelanggan</th><th>Isi</th><th>Total</th><th>Laba</th><th>Metode</th></tr>' +
    rows.slice().reverse().map(t =>
      '<tr><td>' + esc(t.no) + '</td><td>' + esc(t.waktu.slice(11, 16)) + '</td><td>' + esc(t.pelanggan) + '</td><td>' +
      esc(t.items.map(i => i.nama + ' x' + i.qty).join(', ')) + '</td><td>' + rp(t.total) +
      '</td><td>' + rp(t.laba) + '</td><td>' + esc(t.metode) + '</td></tr>'
    ).join('');
}
document.getElementById('lp-tanggal').addEventListener('change', renderLaporan);
document.getElementById('lp-toko').addEventListener('change', e => {
  DB.settings.namaToko = e.target.value.trim() || 'Toko Saya';
  save();
  setStatus('lp-msg', 'Nama toko disimpan: ' + DB.settings.namaToko, true);
});
document.getElementById('lp-ekspor').addEventListener('click', () => {
  if (!DB.transaksi.length) { setStatus('lp-msg', 'Belum ada transaksi untuk diekspor.', false); return; }
  const head = 'No Order;Waktu;Pelanggan;Status;Metode;Produk;Qty;Harga Jual;Subtotal;Total Transaksi;Laba Transaksi\n';
  const lines = [];
  for (const t of DB.transaksi) {
    for (const i of t.items) {
      lines.push([t.no, t.waktu.replace('T', ' ').slice(0, 19), t.pelanggan, t.status, t.metode,
        i.nama, i.qty, i.hargaJual, i.hargaJual * i.qty, t.total, t.laba].join(';'));
    }
  }
  const blob = new Blob(['\ufeff' + head + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'laporan-penjualan.csv';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  setStatus('lp-msg', 'File laporan-penjualan.csv terunduh (' + DB.transaksi.length + ' transaksi).', true);
});

// ---------- klik global ----------
document.addEventListener('click', e => {
  const add = e.target.closest('[data-add]');
  if (add) {
    const p = produkById(add.getAttribute('data-add'));
    const row = cart.find(c => c.produkId === p.id);
    const qtyNow = row ? row.qty : 0;
    if (qtyNow + 1 > p.stok) { setStatus('kasir-msg', 'Stok ' + p.nama + ' tidak cukup.', false); return; }
    if (row) row.qty++; else cart.push({ produkId: p.id, qty: 1 });
    renderCart(); return;
  }
  const cat = e.target.closest('[data-cat]');
  if (cat) { filterKategori = cat.getAttribute('data-cat'); renderKatalog(); return; }
  const inc = e.target.closest('[data-inc]');
  if (inc) {
    const id = inc.getAttribute('data-inc');
    const p = produkById(id); const row = cart.find(c => c.produkId === id);
    if (row && p && row.qty + 1 > p.stok) { setStatus('kasir-msg', 'Stok ' + p.nama + ' tidak cukup.', false); return; }
    if (row) row.qty++;
    renderCart(); return;
  }
  const dec = e.target.closest('[data-dec]');
  if (dec) {
    const id = dec.getAttribute('data-dec');
    const row = cart.find(c => c.produkId === id);
    if (row) { row.qty--; if (row.qty <= 0) cart = cart.filter(c => c.produkId !== id); }
    renderCart(); return;
  }
  const del = e.target.closest('[data-del]');
  if (del) { cart = cart.filter(c => c.produkId !== del.getAttribute('data-del')); renderCart(); return; }
  const rf = e.target.closest('[data-rf]');
  if (rf) {
    filterRiwayat = rf.getAttribute('data-rf');
    document.querySelectorAll('#r-chips button').forEach(b => b.classList.toggle('active', b === rf));
    renderRiwayat(); return;
  }
  const det = e.target.closest('[data-detail]');
  if (det && !e.target.closest('button')) {
    const id = det.getAttribute('data-detail');
    openDetail = openDetail === id ? null : id;
    renderRiwayat(); return;
  }
  const lanjut = e.target.closest('[data-lanjut]');
  if (lanjut) {
    const t = DB.tahan.find(x => x.id === lanjut.getAttribute('data-lanjut'));
    if (t) {
      cart = t.items.map(i => ({ produkId: i.produkId, qty: i.qty }));
      DB.tahan = DB.tahan.filter(x => x.id !== t.id);
      openDetail = null;
      save(); renderCart(); gotoTab('kasir');
      setStatus('kasir-msg', 'Order pending ' + t.no + ' dilanjutkan. Pelanggan: ' + t.pelanggan + '.', true);
    }
    return;
  }
  const buang = e.target.closest('[data-buang]');
  if (buang) {
    DB.tahan = DB.tahan.filter(x => x.id !== buang.getAttribute('data-buang'));
    openDetail = null;
    save(); renderRiwayat(); return;
  }
  const batalkan = e.target.closest('[data-batalkan]');
  if (batalkan) {
    const trx = DB.transaksi.find(x => x.id === batalkan.getAttribute('data-batalkan'));
    if (trx && confirm('Batalkan order ' + trx.no + '? Stok akan dikembalikan.')) {
      trx.status = 'Dibatalkan';
      for (const i of trx.items) {
        const p = produkById(i.produkId);
        if (p) { p.stok += i.qty; catatMutasi(p, 'Pembatalan', i.qty, trx.no); }
      }
      save(); renderRiwayat();
      setStatus('r-msg', 'Order ' + trx.no + ' dibatalkan dan stok dikembalikan.', true);
    }
    return;
  }
  const rs = e.target.closest('[data-restock]');
  if (rs) {
    const p = produkById(rs.getAttribute('data-restock'));
    const n = parseInt(prompt('Tambah stok ' + p.nama + ' sebanyak:', '10'), 10);
    if (!isNaN(n) && n > 0) {
      p.stok += n; catatMutasi(p, 'Restock manual', n, '');
      save(); renderProduk(); renderKatalog(); renderStok();
      setStatus('pr-msg', 'Stok ' + p.nama + ' sekarang ' + p.stok + '.', true);
    }
    return;
  }
  const ed = e.target.closest('[data-edit]');
  if (ed) {
    const p = produkById(ed.getAttribute('data-edit'));
    document.getElementById('pr-id').value = p.id;
    document.getElementById('pr-nama').value = p.nama;
    document.getElementById('pr-sku').value = p.sku || '';
    document.getElementById('pr-kategori').value = p.kategori;
    document.getElementById('pr-jual').value = p.hargaJual;
    document.getElementById('pr-modal').value = p.hargaModal;
    document.getElementById('pr-stok').value = p.stok;
    document.getElementById('pr-stokmin').value = p.stokMin;
    document.getElementById('form-title').textContent = 'Ubah Produk';
    document.getElementById('pr-batal').style.display = '';
    return;
  }
  const dp = e.target.closest('[data-delp]');
  if (dp) {
    const p = produkById(dp.getAttribute('data-delp'));
    if (confirm('Hapus produk ' + p.nama + '?')) {
      DB.produk = DB.produk.filter(x => x.id !== p.id);
      cart = cart.filter(c => c.produkId !== p.id);
      save(); renderProduk(); renderKatalog(); renderCart();
    }
    return;
  }
  const dplg = e.target.closest('[data-delplg]');
  if (dplg) {
    const p = DB.pelanggan.find(x => x.id === dplg.getAttribute('data-delplg'));
    if (p && confirm('Hapus pelanggan ' + p.nama + '? Riwayat belanjanya tetap tersimpan.')) {
      DB.pelanggan = DB.pelanggan.filter(x => x.id !== p.id);
      save(); renderPelanggan(); renderCart();
    }
    return;
  }
  const dkas = e.target.closest('[data-delkas]');
  if (dkas) {
    DB.kas = DB.kas.filter(x => x.id !== dkas.getAttribute('data-delkas'));
    save(); renderKas(); return;
  }
});

function renderAll() {
  renderBeranda(); renderKatalog(); renderCart(); renderRiwayat(); renderKelola(); renderLaporan();
}
renderAll();

// ---------- service worker (offline PWA) ----------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

// ---------- drawer navigasi (gaya POS) ----------
const drawerEl = document.getElementById('tabs');
const overlayEl = document.getElementById('drawer-overlay');
const TAB_TITLES = { beranda: 'Beranda', kasir: 'Kasir', riwayat: 'Riwayat', kelola: 'Kelola', laporan: 'Laporan' };
function syncChrome() {
  const aktif = document.querySelector('#tabs button.active');
  if (aktif) document.getElementById('topbar-title').textContent = TAB_TITLES[aktif.dataset.tab] || 'Laris';
  const nama = (DB.settings && DB.settings.namaToko) || 'Toko Saya';
  document.getElementById('drawer-name').textContent = nama;
  const awal = nama.trim().charAt(0).toUpperCase() || 'L';
  document.getElementById('drawer-avatar').textContent = awal;
  document.getElementById('topbar-avatar').textContent = awal;
}
function openDrawer() { drawerEl.classList.add('open'); overlayEl.classList.add('show'); syncChrome(); }
function closeDrawer() { drawerEl.classList.remove('open'); overlayEl.classList.remove('show'); }
document.getElementById('menu-btn').addEventListener('click', openDrawer);
overlayEl.addEventListener('click', closeDrawer);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
document.querySelectorAll('#tabs button').forEach(b =>
  b.addEventListener('click', () => { closeDrawer(); syncChrome(); }));
syncChrome();
