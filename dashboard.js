/**
 * Modul Dashboard Realtime Direktur
 */
async function renderDashboardView() {
  const selectedUnit = document.getElementById("filter-unit").value;
  const res = await callAPI("GET_DASHBOARD", { id_unit: selectedUnit });

  if (!res.success) {
    document.getElementById("view-container").innerHTML = `<div class="alert alert-danger">${res.message}</div>`;
    return;
  }

  const d = res.data;

  document.getElementById("view-container").innerHTML = `
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="card card-stat bg-primary text-white p-3">
          <small>Total Kas & Bank</small>
          <h4 class="fw-bold m-0">Rp${d.kas_bank.toLocaleString()}</h4>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card card-stat bg-success text-white p-3">
          <small>Total Pendapatan</small>
          <h4 class="fw-bold m-0">Rp${d.pendapatan.toLocaleString()}</h4>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card card-stat bg-danger text-white p-3">
          <small>Total Beban</small>
          <h4 class="fw-bold m-0">Rp${d.beban.toLocaleString()}</h4>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card card-stat ${d.laba_rugi >= 0 ? 'bg-info' : 'bg-warning'} text-white p-3">
          <small>Laba / Rugi Bersih</small>
          <h4 class="fw-bold m-0">Rp${d.laba_rugi.toLocaleString()}</h4>
        </div>
      </div>
    </div>

    <div class="alert ${d.is_balanced ? 'alert-success' : 'alert-danger'} text-center fw-bold">
      STATUS NERACA KEUANGAN: ${d.is_balanced ? 'BALANCE (SEIMBANG)' : 'TIDAK BALANCE - Harap Periksa Jurnal Penyesuaian'}
    </div>
  `;
}