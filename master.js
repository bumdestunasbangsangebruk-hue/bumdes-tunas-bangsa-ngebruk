/**
 * Modul Master Data: COA & Unit Usaha
 */
async function renderCOAView() {
  const res = await callAPI("GET_COA");
  const list = res.data || [];

  let rows = list.map(c => `
    <tr>
      <td><strong>${c.kode_akun}</strong></td>
      <td>${c.nama_akun}</td>
      <td><span class="badge bg-secondary">${c.kelompok}</span></td>
      <td>${c.saldo_normal}</td>
      <td><span class="badge ${c.status === 'AKTIF' ? 'bg-success' : 'bg-danger'}">${c.status}</span></td>
      <td>${c.keterangan || '-'}</td>
    </tr>
  `).join("");

  document.getElementById("view-container").innerHTML = `
    <div class="card card-stat p-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-bold mb-0"><i class="bi bi-diagram-3"></i> Kode Rekening COA</h5>
        <button class="btn btn-success btn-sm" onclick="showAddCOAModal()"><i class="bi bi-plus-lg"></i> Tambah Akun COA</button>
      </div>
      <table class="table table-striped table-hover align-middle">
        <thead class="table-dark">
          <tr><th>Kode</th><th>Nama Akun</th><th>Kelompok</th><th>Saldo Normal</th><th>Status</th><th>Keterangan</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}