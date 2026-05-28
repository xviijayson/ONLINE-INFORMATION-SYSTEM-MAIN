// ===== SHARED UTILITIES =====

// --- Toast Notifications ---
export function showToast(msg, type = "info") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const t = document.createElement("div");
  const icons = { success: "✅", error: "❌", info: "ℹ️" };
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type] || "ℹ️"}</span><span>${msg}</span>`;
  container.appendChild(t);
  setTimeout(() => { t.style.opacity = "0"; t.style.transition = "opacity .3s"; setTimeout(() => t.remove(), 300); }, 3500);
}

// --- Modal helpers ---
export function openModal(id) { document.getElementById(id)?.classList.add("open"); }
export function closeModal(id) { document.getElementById(id)?.classList.remove("open"); }

// --- Generate Unique Client ID: YYYYMMXXXX (no dashes) ---
export function generateClientId(seq) {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const n = String(seq).padStart(4, "0");
  return `${y}${m}${n}`;
}

// --- Format date to readable ---
export function formatDate(val) {
  if (!val) return "—";
  const d = val.toDate ? val.toDate() : new Date(val);
  return d.toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" });
}

// --- Export table data to Excel via SheetJS CDN ---
export function exportToExcel(data, filename = "clients.xlsx") {
  const script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
  script.onload = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clients");
    // Auto column widths
    const cols = Object.keys(data[0] || {}).map(k => ({ wch: Math.max(k.length, 14) }));
    ws["!cols"] = cols;
    XLSX.writeFile(wb, filename);
  };
  if (window.XLSX) {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clients");
    XLSX.writeFile(wb, filename);
  } else {
    document.head.appendChild(script);
  }
}

// --- Auth guard: check role and redirect ---
export async function guardPage(auth, db, requiredRole, { getDoc, doc }) {
  return new Promise((resolve, reject) => {
    const unsub = auth.onAuthStateChanged(async user => {
      unsub();
      if (!user) { window.location.href = "../index.html"; return reject(); }
      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) { window.location.href = "../index.html"; return reject(); }
      const data = snap.data();
      if (requiredRole && data.role !== requiredRole && !(requiredRole === "user" && data.role === "admin")) {
        window.location.href = "../index.html"; return reject();
      }
      resolve({ user, userData: data });
    });
  });
}