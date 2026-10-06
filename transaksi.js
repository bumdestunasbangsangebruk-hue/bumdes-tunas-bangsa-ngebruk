/**
 * Modul Transaksi: Pengeluaran, Penerimaan, & Mutasi Internal
 */
async function renderPengeluaranView() {
  const coaRes = await callAPI("GET_COA");
  const unitRes = await callAPI("GET_UNITS");
  
  const coaList = coaRes.data || [];
  const unitList = unitRes.data || [];

  const kasBankOptions = coaList.filter(c => c.kelompok === "ASET" && c.status === "AKTIF")
    .map(c => `<option value="${c.kode_akun}">${c.kode_akun} - ${c.nama_akun}</option>`).join("");
    
  const bebanOptions = coaList.filter(c => (c.kelompok === "BEBAN" || c.kelompok === "ASET" || c.kelompok === "KEWAJIBAN") && c.status === "AKTIF")
    .map(c => `<option value="${c.kode_akun}">${c.kode_akun} - ${c.nama_akun}</option>`).join("");

  const unitOptions = unitList.map(u => `<option value="${u.id_unit}">${u.nama_unit}</option>`).join("");

  document.getElementById("view-container").innerHTML = `
    <div class="card card-stat p-4 mb-4">
      <h5 class="fw-bold text-danger mb-3"><i class="bi bi-dash-circle"></i> Form Pengeluaran Kas/Bank</h5>
      <form id="form-pengeluaran" onsubmit="handlePengeluaranSubmit(event)">
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label fw-bold">Tanggal Transaksi</label>
            <input type="date" id="exp-tanggal" class="form-control" required value="${new Date().toISOString().split('T')[0]}">
          </div>
          <div class="col-md-3">
            <label class="form-label fw-bold">Unit Usaha</label>
            <select id="exp-unit" class="form-select" required>${unitOptions}</select>
          </div>
          <div class="col-md-3">
            <label class="form-label fw-bold">Sumber Pembayaran (Debit Kas/Bank)</label>
            <select id="exp-sumber" class="form-select" required>${kasBankOptions}</select>
          </div>
          <div class="col-md-3">
            <label class="form-label fw-bold">Akun Lawan (Kredit Beban/Aset/Utang)</label>
            <select id="exp-lawan" class="form-select" required>${bebanOptions}</select>
          </div>
          <div class="col-md-4">
            <label class="form-label fw-bold">Penerima / Rekanan</label>
            <input type="text" id="exp-penerima" class="form-control" required placeholder="Nama Toko / Penerima">
          </div>
          <div class="col-md-4">
            <label class="form-label fw-bold">Nominal (Rp)</label>
            <input type="number" id="exp-nominal" class="form-control" required min="1" placeholder="0">
          </div>
          <div class="col-md-4">
            <label class="form-label fw-bold">Nomor Bukti / Kuitansi</label>
            <input type="text" id="exp-bukti" class="form-control" placeholder="KW-001">
          </div>
          <div class="col-md-12">
            <label class="form-label fw-bold">Keterangan Transaksi</label>
            <textarea id="exp-keterangan" class="form-control" rows="2" placeholder="Detail keperluan pengeluaran"></textarea>
          </div>
          <div class="col-md-12 text-end">
            <button type="submit" class="btn btn-danger fw-bold"><i class="bi bi-check-circle"></i> Simpan & Posting Pengeluaran</button>
          </div>
        </div>
      </form>
    </div>
  `;
}

async function handlePengeluaranSubmit(e) {
  e.preventDefault();
  const payload = {
    tanggal: document.getElementById("exp-tanggal").value,
    id_unit: document.getElementById("exp-unit").value,
    sumber_kas_bank: document.getElementById("exp-sumber").value,
    akun_lawan: document.getElementById("exp-lawan").value,
    penerima_rekanan: document.getElementById("exp-penerima").value,
    nominal: Number(document.getElementById("exp-nominal").value),
    no_bukti: document.getElementById("exp-bukti").value,
    keterangan: document.getElementById("exp-keterangan").value,
    jenis_pengeluaran: "OPERASIONAL"
  };

  const res = await callAPI("CREATE_EXPENSE", payload);
  alert(res.message);
  if (res.success) renderPengeluaranView();
}