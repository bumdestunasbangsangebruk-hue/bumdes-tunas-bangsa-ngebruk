/**
 * Modul Laporan Keuangan Realtime (Laba Rugi & Neraca Posisi Keuangan)
 */
async function renderLabaRugiView() {
  const selectedUnit = document.getElementById("filter-unit").value;
  const res = await callAPI("GET_INCOME_STATEMENT", { id_unit: selectedUnit });
  
  if (!res.success) {
    document.getElementById("view-container").innerHTML = `<div class="alert alert-danger">${res.message}</div>`;
    return;
  }

  const data = res.data;
  let pendapatanRows = "", bebanRows = "";

  for (let k in data.pendapatan) {
    pendapatanRows += `<tr><td>${k} - ${data.pendapatan[k].nama}</td><td class="text-end">Rp${data.pendapatan[k].total.toLocaleString()}</td></tr>`;
  }

  for (let k in data.beban) {
    bebanRows += `<tr><td>${k} - ${data.beban[k].nama}</td><td class="text-end">Rp${data.beban[k].total.toLocaleString()}</td></tr>`;
  }

  document.getElementById("view-container").innerHTML = `
    <div class="card card-stat p-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-bold mb-0"><i class="bi bi-file-earmark-bar-graph"></i> Laporan Laba Rugi Realtime</h5>
        <button class="btn btn-outline-secondary btn-sm" onclick="window.print()"><i class="bi bi-printer"></i> Cetak / PDF</button>
      </div>
      <table class="table table-bordered">
        <thead class="table-dark"><tr><th>PENDAPATAN OPERASIONAL</th><th class="text-end">TOTAL (RP)</th></tr></thead>
        <tbody>${pendapatanRows || '<tr><td colspan="2" class="text-muted text-center">Belum ada pendapatan terposting</td></tr>'}</tbody>
        <tfoot class="table-success fw-bold"><tr><td>TOTAL PENDAPATAN</td><td class="text-end">Rp${data.total_pendapatan.toLocaleString()}</td></tr></tfoot>
      </table>

      <table class="table table-bordered mt-3">
        <thead class="table-dark"><tr><th>BEBAN OPERASIONAL</th><th class="text-end">TOTAL (RP)</th></tr></thead>
        <tbody>${bebanRows || '<tr><td colspan="2" class="text-muted text-center">Belum ada beban terposting</td></tr>'}</tbody>
        <tfoot class="table-danger fw-bold"><tr><td>TOTAL BEBAN</td><td class="text-end">Rp${data.total_beban.toLocaleString()}</td></tr></tfoot>
      </table>

      <div class="alert ${data.laba_bersih >= 0 ? 'alert-success' : 'alert-danger'} text-center fw-bold fs-5 mt-3">
        LABA / (RUGI) BERSIH: Rp${data.laba_bersih.toLocaleString()}
      </div>
    </div>
  `;
}