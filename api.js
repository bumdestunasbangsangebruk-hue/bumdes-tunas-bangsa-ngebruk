/**
 * Engine Koneksi API Google Apps Script Realtime
 */
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbyYXCaHWy8ai81cwWOrskv0gQB4RXQqsNhQLDbn81YtymZmjHBOJoB4QY7Q82e3Zyw6KA/exec";

async function callAPI(action, payload = {}) {
  const token = localStorage.getItem("bumdes_token") || "";
  
  if (!GAS_API_URL || GAS_API_URL.includes("GANTI_DENGAN")) {
    alert("URL Google Apps Script belum dikonfigurasi pada js/api.js!");
    return { success: false, message: "URL Backend belum diatur." };
  }

  try {
    const response = await fetch(GAS_API_URL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: action, token: token, payload: payload })
    });
    
    return await response.json();
  } catch (error) {
    console.error("API Call Error:", error);
    return { success: false, message: "Koneksi ke server Google Sheets gagal." };
  }
}