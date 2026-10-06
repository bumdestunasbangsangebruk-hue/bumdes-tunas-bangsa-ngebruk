/**
 * Main Controller & Navigation Router
 */
document.addEventListener("DOMContentLoaded", async () => {
  checkAuthStatus();
  await loadUnitsFilter();
  switchMenu('dashboard');
});

async function loadUnitsFilter() {
  const res = await callAPI("GET_UNITS");
  if (res.success && res.data) {
    const select = document.getElementById("filter-unit");
    res.data.forEach(u => {
      select.innerHTML += `<option value="${u.id_unit}">${u.nama_unit}</option>`;
    });
  }
}

function switchMenu(menu) {
  window.currentMenu = menu;
  const titleMap = {
    dashboard: "Dashboard Realtime Direktur",
    pengeluaran: "Pengeluaran Kas/Bank",
    penerimaan: "Penerimaan Kas/Bank",
    mutasi: "Mutasi Internal Rekening",
    jurnal: "Jurnal Umum Manual",
    laba_rugi: "Laporan Laba Rugi Realtime",
    neraca: "Laporan Neraca Posisi Keuangan",
    coa: "Kode Rekening Chart of Accounts (COA)",
    unit_usaha: "Master Unit Usaha BUMDes"
  };

  document.getElementById("page-title").innerText = titleMap[menu] || "Menu System";

  if (menu === "dashboard") renderDashboardView();
  else if (menu === "pengeluaran") renderPengeluaranView();
  else if (menu === "jurnal") renderJurnalManualView();
  else if (menu === "laba_rugi") renderLabaRugiView();
  else if (menu === "coa") renderCOAView();
}

function refreshCurrentView() {
  if (window.currentMenu) switchMenu(window.currentMenu);
}