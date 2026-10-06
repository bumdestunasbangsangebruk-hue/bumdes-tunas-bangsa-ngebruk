/**
 * Modul Jurnal Umum Manual Multi-Line
 */
let journalRows = [];

async function renderJurnalManualView() {
  const coaRes = await callAPI("GET_COA");
  const unitRes = await callAPI("GET_UNITS");
  
  window.coaOptionsHTML = (coaRes.data || []).filter(c => c.status === "AKTIF")
    .map(c => `<option value="${c.kode_akun}">${c.kode_akun} - ${c.nama_akun}</option>`).join("");
    
  const unitOptions = (unitRes.data || []).map(u => `<option value="${u.id_unit}">${u.nama_unit}</option>`).join("");

  document.getElementById("view-container").innerHTML = `
    <div class="card card-stat p-4 mb-4">
      <h5 class="fw-bold text-warning mb-3"><i class="bi bi-journal-text"></i> Form Jurnal Umum Manual</h5>
      <form id="form-jurnal" onsubmit="handleJurnalSubmit(event)">
        <div class="row g-3 mb-3">
          <div class="col-md-3">
            <label class="form-label fw-bold">Tanggal Jurnal</label>
            <input type="date" id="jnl-tanggal" class="form-control" required value="${new Date().toISOString().split('T')[0]}">
          </div>
          <div class="col-md-3">
            <label class="form-label fw-bold">Unit Usaha</label>
            <select id="jnl-unit" class="form-select" required>${unitOptions}</select>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-bold">Keterangan Umum</label>
            <input type="text" id="jnl-keterangan" class="form-control" required placeholder="Catatan penyesuaian / jurnal manual">
          </div>
        </div>

        <table class="table table-bordered align-middle">
          <thead class="table-light">
            <tr>
              <th style="width:35%">Akun COA</th>
              <th style="width:25%">Debit (Rp)</th>
              <th style="width:25%">Kredit (Rp)</th>
              <th style="width:15%">Aksi</th>
            </tr>
          </thead>
          <tbody id="jnl-table-body"></tbody>
          <tfoot>
            <tr class="fw-bold">
              <td class="text-end">Total:</td>
              <td id="jnl-total-debit" class="text-success">0</td>
              <td id="jnl-total-kredit" class="text-danger">0</td>
              <td></td>
            </tr>
            <tr>
              <td colspan="4" id="jnl-balance-status" class="text-center alert alert-secondary py-2 m-0">Selisih: Rp0 (BALANCE)</td>
            </tr>
          </tfoot>
        </table>

        <div class="d-flex justify-content-between mt-3">
          <button type="button" class="btn btn-outline-primary" onclick="addJournalRow()"><i class="bi bi-plus-lg"></i> Tambah Baris</button>
          <button type="submit" class="btn btn-warning fw-bold"><i class="bi bi-check-circle"></i> Validasi & Posting Jurnal</button>
        </div>
      </form>
    </div>
  `;

  journalRows = [];
  addJournalRow();
  addJournalRow();
}

function addJournalRow() {
  const tbody = document.getElementById("jnl-table-body");
  const rowIndex = journalRows.length;
  
  const tr = document.createElement("tr");
  tr.id = `row-${rowIndex}`;
  tr.innerHTML = `
    <td><select class="form-select jnl-akun" required>${window.coaOptionsHTML}</select></td>
    <td><input type="number" class="form-control jnl-debit" value="0" min="0" onchange="calculateJournalTotals()"></td>
    <td><input type="number" class="form-control jnl-kredit" value="0" min="0" onchange="calculateJournalTotals()"></td>
    <td class="text-center"><button type="button" class="btn btn-sm btn-outline-danger" onclick="removeJournalRow(${rowIndex})"><i class="bi bi-trash"></i></button></td>
  `;
  tbody.appendChild(tr);
  journalRows.push(rowIndex);
}

function calculateJournalTotals() {
  let totalDebit = 0, totalKredit = 0;
  document.querySelectorAll(".jnl-debit").forEach(el => totalDebit += Number(el.value || 0));
  document.querySelectorAll(".jnl-kredit").forEach(el => totalKredit += Number(el.value || 0));

  document.getElementById("jnl-total-debit").innerText = "Rp" + totalDebit.toLocaleString();
  document.getElementById("jnl-total-kredit").innerText = "Rp" + totalKredit.toLocaleString();

  const diff = Math.abs(totalDebit - totalKredit);
  const statusEl = document.getElementById("jnl-balance-status");

  if (diff < 0.01 && totalDebit > 0) {
    statusEl.className = "text-center alert alert-success py-2 m-0 fw-bold";
    statusEl.innerText = "JURNAL BALANCE! Siap Diposting.";
  } else {
    statusEl.className = "text-center alert alert-danger py-2 m-0 fw-bold";
    statusEl.innerText = `JURNAL TIDAK BALANCE! Selisih Debit-Kredit: Rp${diff.toLocaleString()}`;
  }
}

async function handleJurnalSubmit(e) {
  e.preventDefault();
  const details = [];
  const rows = document.querySelectorAll("#jnl-table-body tr");

  rows.forEach(r => {
    details.push({
      kode_akun: r.querySelector(".jnl-akun").value,
      debit: Number(r.querySelector(".jnl-debit").value || 0),
      kredit: Number(r.querySelector(".jnl-kredit").value || 0)
    });
  });

  const payload = {
    tanggal: document.getElementById("jnl-tanggal").value,
    id_unit: document.getElementById("jnl-unit").value,
    keterangan: document.getElementById("jnl-keterangan").value,
    details: details
  };

  const res = await callAPI("CREATE_GENERAL_JOURNAL", payload);
  alert(res.message);
  if (res.success) renderJurnalManualView();
}