/**
 * Modul Autentikasi dan Manajemen Sesi
 */
function checkAuthStatus() {
  const token = localStorage.getItem("bumdes_token");
  if (!token) {
    const modal = new bootstrap.Modal(document.getElementById("loginModal"));
    modal.show();
  }
}

async function handleLoginSubmit() {
  const u = document.getElementById("login-username").value;
  const p = document.getElementById("login-password").value;

  const res = await callAPI("LOGIN", { username: u, password: p });
  if (res.success) {
    localStorage.setItem("bumdes_token", res.token);
    localStorage.setItem("bumdes_user", JSON.stringify(res.user));
    bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();
    location.reload();
  } else {
    alert(res.message);
  }
}

function logout() {
  localStorage.clear();
  location.reload();
}