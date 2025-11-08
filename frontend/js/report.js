const API_BASE = (typeof window !== 'undefined' && window.API_BASE) || 'http://localhost:5000';

const latInput = document.getElementById('lat');
const lngInput = document.getElementById('lng');
const statusMsg = document.getElementById('statusMsg');
const form = document.getElementById('reportForm');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');

function setStatus(text, ok=false){
  statusMsg.textContent = text;
  statusMsg.style.color = ok ? '#22c55e' : '#fca5a5';
}

function getLocation(){
  if(!navigator.geolocation){
    setStatus('Geolocation not supported');
    return;
  }
  navigator.geolocation.getCurrentPosition((pos)=>{
    latInput.value = pos.coords.latitude.toFixed(6);
    lngInput.value = pos.coords.longitude.toFixed(6);
  }, ()=> setStatus('Unable to get location'));
}

getLocation();

// Image preview
imageInput?.addEventListener('change', ()=>{
  const file = imageInput.files && imageInput.files[0];
  if(!file) { imagePreview.style.display='none'; return; }
  const url = URL.createObjectURL(file);
  imagePreview.src = url; imagePreview.style.display='block';
});

// Map picker
let pickerMap, pickerMarker;
function initPicker(){
  pickerMap = L.map('pickMap');
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(pickerMap);
  const lat = parseFloat(latInput.value)||20.5937; const lng = parseFloat(lngInput.value)||78.9629;
  pickerMap.setView([lat,lng], latInput.value?14:5);
  pickerMarker = L.marker([lat,lng], { draggable:true }).addTo(pickerMap);
  pickerMarker.on('dragend', ()=>{
    const p = pickerMarker.getLatLng(); latInput.value = p.lat.toFixed(6); lngInput.value = p.lng.toFixed(6);
  });
  pickerMap.on('click', (e)=>{
    pickerMarker.setLatLng(e.latlng); latInput.value = e.latlng.lat.toFixed(6); lngInput.value = e.latlng.lng.toFixed(6);
  });
}

window.addEventListener('load', ()=>{ if(document.getElementById('pickMap')) initPicker(); });

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  setStatus('Submitting...');
  const fd = new FormData(form);
  try{
    const res = await fetch(`${API_BASE}/api/hazard/report`,{ method:'POST', body:fd });
    const data = await res.json();
    if(!res.ok) throw new Error(data.error || 'Failed');
    setStatus('Report submitted successfully!', true);
    form.reset();
    getLocation();
  }catch(err){
    setStatus(err.message || 'Error');
  }
});


