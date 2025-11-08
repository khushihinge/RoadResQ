// js/admin.js

const loginForm = document.getElementById("loginForm");
const loginMsg = document.getElementById("loginMsg");
const loginCard = document.getElementById("loginCard");
const adminCard = document.getElementById("adminCard");
const searchInput = document.getElementById("search");
const statusFilter = document.getElementById("adminFilterStatus");
const reloadBtn = document.getElementById("reload");
const tableBody = document.getElementById("hazardTableBody");

// --- ADMIN LOGIN HANDLER ---
loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = e.target.email.value.trim();
  const password = e.target.password.value.trim();

  try {
    const res = await fetch(`${window.API_BASE}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      loginMsg.textContent = data.error || "Invalid credentials";
      loginMsg.style.color = "#ef4444";
      return;
    }

    localStorage.setItem("adminToken", data.token);
    loginMsg.textContent = "✅ Login successful!";
    loginMsg.style.color = "#16a34a";

    // Show admin dashboard after short delay
    setTimeout(() => {
      loginCard.style.display = "none";
      adminCard.style.display = "block";
      loadHazards();
    }, 700);
  } catch (err) {
    console.error("Login error:", err);
    loginMsg.textContent = "❌ Server error. Try again.";
  }
});

// --- FETCH & DISPLAY HAZARDS ---
async function loadHazards() {
  try {
    const res = await fetch(`${window.API_BASE}/api/hazard/reports`);
    const data = await res.json();

    window.allHazards = data; // store globally for search/filter

    renderTable(data);
    updateSummary(data);
  } catch (err) {
    console.error("Failed to load hazards:", err);
  }
}

// --- RENDER TABLE ---
function renderTable(hazards) {
  tableBody.innerHTML = "";

  if (!hazards.length) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:gray;">No records found</td></tr>`;
    return;
  }

  hazards.forEach((h) => {
    const row = document.createElement("tr");

    const statusClass =
      h.status === "Resolved"
        ? "resolved"
        : h.status === "In Progress"
        ? "in-progress"
        : "pending";

    row.innerHTML = `
      <td>${h.category}</td>
      <td>${h.description}</td>
      <td>${h.severity}</td>
      <td><span class="status-badge ${statusClass}">${h.status}</span></td>
      <td>${new Date(h.createdAt).toLocaleDateString()}</td>
      <td>
        <select class="statusSel">
          <option ${h.status === "Pending" ? "selected" : ""}>Pending</option>
          <option ${h.status === "In Progress" ? "selected" : ""}>In Progress</option>
          <option ${h.status === "Resolved" ? "selected" : ""}>Resolved</option>
        </select>
        <button class="button small" onclick="updateStatus('${
          h._id
        }', this.previousElementSibling.value)">Update</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// --- UPDATE STATUS ---
async function updateStatus(id, newStatus) {
  try {
    const token = localStorage.getItem("adminToken");
    const res = await fetch(`${window.API_BASE}/api/hazard/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) throw new Error("Failed to update status");

    loadHazards(); // refresh after update
  } catch (err) {
    console.error(err);
    alert("Error updating status");
  }
}

// --- SEARCH + FILTER HANDLERS ---
function applyFilters() {
  if (!window.allHazards) return;

  const searchText = searchInput.value.trim().toLowerCase();
  const selectedStatus = statusFilter.value;

  let filtered = window.allHazards;

  if (searchText) {
    filtered = filtered.filter((h) =>
      h.description.toLowerCase().includes(searchText)
    );
  }

  if (selectedStatus) {
    filtered = filtered.filter((h) => h.status === selectedStatus);
  }

  renderTable(filtered);
  updateSummary(filtered);
}

searchInput?.addEventListener("input", applyFilters);
statusFilter?.addEventListener("change", applyFilters);
reloadBtn?.addEventListener("click", () => loadHazards());

// --- UPDATE SUMMARY COUNTS ---
function updateSummary(data) {
  const total = data.length;
  const resolved = data.filter((h) => h.status === "Resolved").length;
  const active = total - resolved;

  document.getElementById("adminTotal").textContent = total;
  document.getElementById("adminResolved").textContent = resolved;
  document.getElementById("adminActive").textContent = active;
}






