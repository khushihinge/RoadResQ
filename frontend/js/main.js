// frontend/js/main.js

const API_BASE = (typeof window !== 'undefined' && window.API_BASE) || 'http://localhost:5000';

const map = L.map('map');
let markersLayer = L.layerGroup().addTo(map);

function init() {
  // Center roughly on India for default
  map.setView([20.5937, 78.9629], 5);

  // Add OpenStreetMap base tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  // Load all hazards initially
  loadHazards();
}

async function loadHazards() {
  const cat = document.getElementById('filterCategory')?.value || '';
  const status = document.getElementById('filterStatus')?.value || '';

  const params = new URLSearchParams();
  if (cat) params.set('category', cat);
  if (status) params.set('status', status);

  // ✅ Correct API endpoint
  const url = `${API_BASE}/api/hazard/reports${params.toString() ? `?${params.toString()}` : ''}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Failed to load data');
    renderMarkers(data);
  } catch (e) {
    console.error('Error loading hazards:', e);
    alert('Failed to load map data. Check console for details.');
  }
}

function renderMarkers(items) {
  markersLayer.clearLayers();

  if (!items.length) {
    alert('No hazards found for the selected filters.');
    return;
  }

  const markerPositions = [];

  items.forEach((h) => {
    if (!h.latitude || !h.longitude) return;

    // 🌈 Softer pastel colors (matches admin dashboard)
    const color =
      h.status === 'Resolved'
        ? '#038517ff' // soft green
        : h.status === 'In Progress'
        ? '#f6a205ff' // soft yellow
        : '#e80e0eff'; // soft red

    const icon = L.divIcon({
      className: '',
      html: `
        <div style="
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: ${color};
          box-shadow: 0 0 0 4px rgba(0,0,0,0.1);
        "></div>
      `,
    });

    const marker = L.marker([h.latitude, h.longitude], { icon });

    const img = h.imageUrl
      ? `<img src="${h.imageUrl}" style="max-width:160px;border-radius:8px;margin-top:6px;"/>`
      : '';

    marker.bindPopup(`
      <b>${h.category}</b> · <i>${h.status}</i><br/>
      ${h.description}<br/>
      <b>Severity:</b> ${h.severity}<br/>
      ${img}
    `);

    markersLayer.addLayer(marker);
    markerPositions.push([h.latitude, h.longitude]);
  });

  // 🗺️ Auto-zoom to fit all markers
  if (markerPositions.length) {
    const bounds = L.latLngBounds(markerPositions);
    map.fitBounds(bounds, { padding: [40, 40] });
  }
}

// 🔁 Refresh & filters
document.getElementById('refreshBtn')?.addEventListener('click', loadHazards);
document.getElementById('filterCategory')?.addEventListener('change', loadHazards);
document.getElementById('filterStatus')?.addEventListener('change', loadHazards);

init();


