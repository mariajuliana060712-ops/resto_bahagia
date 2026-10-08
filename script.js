/* ===== KONFIGURASI =====
   GANTI nomor WhatsApp restoran di bawah ini (format internasional: awali 62, tanpa 0 / + / spasi).
   Contoh: 08123456789 -> "628123456789" */
const WA_NUMBER = "6281234567890";

/* ===== DATA MENU =====
   Ganti foto: simpan foto di folder images/ dengan nama yang sama seperti "img",
   atau ubah nilai "img" (boleh URL gambar). Jika file belum ada, otomatis tampil emoji. */
const MENU = [
 {id:1,name:"Rendang Padang",short:"Rendang",origin:"Sumatera Barat",cat:"makanan",price:35000,img:"images/rendang.jpg",emoji:"🍖",desc:"Daging sapi empuk dimasak berjam-jam bersama santan dan rempah pilihan."},
 {id:2,name:"Nasi Liwet",short:"Nasi Liwet",origin:"Solo, Jawa Tengah",cat:"makanan",price:28000,img:"images/nasi-liwet.jpg",emoji:"🍚",desc:"Nasi gurih bersantan dengan ayam suwir, telur, dan labu siam."},
 {id:3,name:"Gudeg Jogja",short:"Gudeg",origin:"Yogyakarta",cat:"makanan",price:30000,img:"images/gudeg.jpg",emoji:"🍛",desc:"Nangka muda dimasak manis legit bersama ayam, telur, dan krecek."},
 {id:4,name:"Soto Betawi",short:"Soto Betawi",origin:"DKI Jakarta",cat:"makanan",price:32000,img:"images/soto-betawi.jpg",emoji:"🍲",desc:"Kuah santan dan susu yang gurih dengan potongan daging sapi."},
 {id:5,name:"Pempek Palembang",short:"Pempek",origin:"Sumatera Selatan",cat:"makanan",price:25000,img:"images/pempek.jpg",emoji:"🐟",desc:"Olahan ikan dan sagu dengan kuah cuko asam, manis, dan pedas."},
 {id:6,name:"Ayam Betutu Bali",short:"Ayam Betutu",origin:"Bali",cat:"makanan",price:35000,img:"images/ayam-betutu.jpg",emoji:"🍗",desc:"Ayam berbumbu base genep, dibungkus daun pisang dan dimasak lama."},
 {id:7,name:"Rawon Jawa Timur",short:"Rawon",origin:"Jawa Timur",cat:"makanan",price:32000,img:"images/rawon.jpg",emoji:"🥘",desc:"Sup daging berkuah hitam dari kluwek, disajikan dengan tauge dan sambal."},
 {id:8,name:"Coto Makassar",short:"Coto Makassar",origin:"Sulawesi Selatan",cat:"makanan",price:30000,img:"images/coto-makassar.jpg",emoji:"🍜",desc:"Sup daging sapi berkuah kacang dan rempah, nikmat bersama ketupat."},
 {id:9,name:"Sate Madura",short:"Sate Madura",origin:"Madura, Jawa Timur",cat:"makanan",price:28000,img:"images/sate-madura.jpg",emoji:"🍢",desc:"Sate ayam bakar dengan bumbu kacang manis gurih dan bawang goreng."},
 {id:10,name:"Gado-Gado",short:"Gado-Gado",origin:"DKI Jakarta",cat:"makanan",price:22000,img:"images/gado-gado.jpg",emoji:"🥗",desc:"Sayur rebus, tahu, tempe, dan telur dengan saus kacang."},
 {id:11,name:"Es Cendol",short:"Es Cendol",origin:"Jawa Barat",cat:"minuman",price:15000,img:"images/es-cendol.jpg",emoji:"🥤",desc:"Cendol hijau, santan, dan gula merah dalam es serut."},
 {id:13,name:"Es Teh Manis",short:"Es Teh",origin:"Nusantara",cat:"minuman",price:8000,img:"images/es-teh.jpg",emoji:"🧋",desc:"Teh seduh segar dengan gula dan es batu."},
 {id:14,name:"Es Jeruk",short:"Es Jeruk",origin:"Nusantara",cat:"minuman",price:10000,img:"images/es-jeruk.jpg",emoji:"🍊",desc:"Perasan jeruk segar dengan es, asam manis menyegarkan."},
 {id:12,name:"Es Pisang Ijo",short:"Es Pisang Ijo",origin:"Sulawesi Selatan",cat:"dessert",price:18000,img:"images/es-pisang-ijo.jpg",emoji:"🍌",desc:"Pisang berbalut adonan hijau, bubur sumsum, sirup, dan es serut."},
 {id:15,name:"Klepon",short:"Klepon",origin:"Jawa",cat:"dessert",price:12000,img:"images/klepon.jpg",emoji:"🟢",desc:"Bola ketan isi gula merah cair, digulung kelapa parut."}
];
const FEATURED = [1,3,4,5,6,9];
const PAY = {kartu:["Visa","Mastercard"],ewallet:["GoPay","OVO","DANA","ShopeePay"],cash:[]};
const PAYNAME = {kartu:"Kartu Debit/Kredit",ewallet:"Dompet Digital",cash:"Cash"};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const rp = n => "Rp" + n.toLocaleString("id-ID");
const find = id => MENU.find(m => m.id == id);
let cart = JSON.parse(localStorage.getItem("cart") || "{}"); // {idMenu: jumlah}
Object.keys(cart).forEach(i => { if (!find(i)) delete cart[i]; });
const total = () => Object.entries(cart).reduce((s,[id,q]) => s + find(id).price * q, 0);
const save = () => { localStorage.setItem("cart", JSON.stringify(cart)); refresh(); };

function toast(t){
 let el = $(".toast");
 if(!el){ el = document.createElement("div"); el.className = "toast"; document.body.append(el); }
 el.textContent = t; el.classList.add("show");
 clearTimeout(el.t); el.t = setTimeout(() => el.classList.remove("show"), 2400);
}
/* Logo pembayaran: placeholder teks. Untuk logo asli, ganti dengan <img src="images/visa.png" height="20"> */
const logo = n => `<span class="plogo ${n.toLowerCase()}">${n}</span>`;

const card = m => `<article class="card"><div class="img"><span>${m.emoji}</span><img src="${m.img}" alt="${m.name}" loading="lazy" onerror="this.remove()"></div>
<div class="body"><small class="origin">📍 ${m.origin}</small><h3>${m.name}</h3><p>${m.desc}</p>
<div class="foot"><b>${rp(m.price)}</b><button type="button" class="btn sm" data-add="${m.id}">Tambah ke Pesanan</button></div></div></article>`;

function renderMenu(f="semua"){
 const g = $("#menuGrid"); if(!g) return;
 g.innerHTML = MENU.filter(m => f == "semua" || m.cat == f).map(card).join("");
}

/* Daftar pilihan di form (checkbox + jumlah) sesuai kategori yang dicentang */
function renderPick(){
 const box = $("#pick"); if(!box) return;
 const sel = $$("input[name=kat]:checked").map(i => i.value);
 box.innerHTML = sel.map(k => `<fieldset class="grp"><legend>${k}</legend>` + MENU.filter(m => m.cat == k).map(m =>
  `<div class="pick-row"><label><input type="checkbox" data-pick="${m.id}" ${cart[m.id] ? "checked" : ""}> ${m.short} <small>${rp(m.price)}</small></label>
  <input type="number" min="1" value="${cart[m.id] || 1}" data-qty="${m.id}" ${cart[m.id] ? "" : "disabled"} aria-label="Jumlah ${m.short}"></div>`).join("") + `</fieldset>`).join("");
}

function renderCart(){
 const ul = $("#cartList"); if(!ul) return;
 const ids = Object.keys(cart);
 ul.innerHTML = ids.length ? ids.map(id => { const m = find(id), q = cart[id];
  return `<li><span>${m.short} x ${q}</span><b>${rp(m.price*q)}</b>
  <span class="btns"><button type="button" data-dec="${id}" aria-label="Kurangi">−</button><button type="button" data-inc="${id}" aria-label="Tambah">+</button><button type="button" data-del="${id}" aria-label="Hapus">🗑</button></span></li>`;
 }).join("") : "<li>Belum ada pesanan. Pilih menu di atas.</li>";
 $("#cartTotal").textContent = rp(total());
}

function refresh(){
 const n = Object.values(cart).reduce((a,b) => a + b, 0);
 $$(".cartCount").forEach(e => e.textContent = n);
 Object.keys(cart).forEach(id => { const c = $(`input[name=kat][value=${find(id).cat}]`); if(c) c.checked = true; });
 renderPick(); renderCart();
}

function renderPay(){
 const o = $("#payOpts"); if(!o) return;
 const v = ($("input[name=bayar]:checked") || {}).value;
 o.innerHTML = (PAY[v] || []).map(n => `<label><input type="radio" name="sub" value="${n}"> ${logo(n)} ${n}</label>`).join("")
  || (v == "cash" ? "<small>Bayar tunai saat pesanan diterima / di restoran.</small>" : "");
}

/* ===== Event ===== */
document.addEventListener("click", e => {
 const t = e.target.closest("button,a"); if(!t) return;
 const d = t.dataset;
 if(d.add){ cart[d.add] = (cart[d.add] || 0) + 1; save(); toast(find(d.add).short + " ditambahkan ke pesanan"); }
 if(d.inc){ cart[d.inc]++; save(); }
 if(d.dec && cart[d.dec] > 1){ cart[d.dec]--; save(); }
 if(d.del){ delete cart[d.del]; save(); }
 if(d.f){ $$("#filters button").forEach(b => b.classList.toggle("on", b == t)); renderMenu(d.f); }
 if(t.classList.contains("burger")){ const o = $("#links").classList.toggle("open"); t.setAttribute("aria-expanded", o); }
 if(t.id == "clearCart"){ cart = {}; save(); }
 if(t.id == "closeModal") $("#modal").classList.remove("show");
 if(t.id == "newOrder"){ cart = {}; save(); $("#orderForm").reset(); renderPay(); $("#modal").classList.remove("show"); }
});
document.addEventListener("change", e => {
 const t = e.target;
 if(t.name == "kat"){ if(!t.checked){ MENU.filter(m => m.cat == t.value).forEach(m => delete cart[m.id]); } save(); }
 if(t.dataset.pick){ if(t.checked) cart[t.dataset.pick] = 1; else delete cart[t.dataset.pick]; save(); }
 if(t.dataset.qty){ cart[t.dataset.qty] = Math.max(1, parseInt(t.value) || 1); save(); }
 if(t.name == "bayar") renderPay();
});

/* ===== Form pemesanan ===== */
const form = $("#orderForm");
if(form){
 $("#tgl").min = new Date(Date.now() - new Date().getTimezoneOffset()*6e4).toISOString().slice(0,10);
 form.addEventListener("submit", e => {
  e.preventDefault();
  const v = id => $(id).value.trim();
  const bayar = ($("input[name=bayar]:checked") || {}).value, sub = ($("input[name=sub]:checked") || {}).value, errs = [];
  if(!v("#nama")) errs.push("Nama lengkap wajib diisi.");
  if(!/^(\+62|62|0)8\d{7,12}$/.test(v("#hp").replace(/[\s-]/g,""))) errs.push("Nomor HP tidak valid (contoh: 08123456789).");
  if(!v("#tgl")) errs.push("Tanggal booking wajib diisi.");
  else if(v("#tgl") < $("#tgl").min) errs.push("Tanggal booking tidak boleh sebelum hari ini.");
  if(!Object.keys(cart).length) errs.push("Pilih minimal satu menu.");
  if(!bayar) errs.push("Pilih metode pembayaran.");
  else if(PAY[bayar].length && !sub) errs.push("Pilih jenis " + (bayar == "kartu" ? "kartu" : "dompet digital") + ".");
  if(!v("#alamat")) errs.push("Alamat pengantaran wajib diisi.");
  const box = $("#errors");
  box.innerHTML = errs.length ? `<div class="err" role="alert"><b>Mohon lengkapi data berikut:</b><ul>${errs.map(x => `<li>${x}</li>`).join("")}</ul></div>` : "";
  if(errs.length){ box.scrollIntoView({behavior:"smooth",block:"center"}); return; }

  const items = Object.entries(cart).map(([id,q]) => `- ${find(id).short} x${q} (${rp(find(id).price*q)})`).join("\n");
  const msg = `HALO, SAYA INGIN MEMESAN\n\nNama: ${v("#nama")}\nNo. HP: ${v("#hp")}\nTanggal Booking: ${v("#tgl")}\n\nPESANAN:\n${items}\n\nTOTAL:\n${rp(total())}\n\nMETODE PEMBAYARAN:\n${PAYNAME[bayar]}${sub ? " - " + sub : ""}\n\nCATATAN:\n${v("#catatan") || "-"}\n\nALAMAT:\n${v("#alamat")}`;
  $("#summary").textContent = msg;
  $("#waBtn").href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  $("#modal").classList.add("show");
  toast("✅ Pesanan berhasil dibuat!");
 });
}

/* ===== Init ===== */
$$("#links a:not(.btn):not(.cartlink)").forEach(a => {
 if(a.getAttribute("href") == (location.pathname.split("/").pop() || "index.html")) a.classList.add("active");
});
const fg = $("#featuredGrid"); if(fg) fg.innerHTML = FEATURED.map(id => card(find(id))).join("");
renderMenu(); refresh();
