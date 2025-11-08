const API_BASE = window.API_BASE || 'http://localhost:5000';

async function loadStatsAndRecent(){
  try{
    const res = await fetch(`${API_BASE}/api/hazard/reports`);
    const items = await res.json();
    if(!Array.isArray(items)) return;
    const total = items.length;
    const resolved = items.filter(h=>h.status==='Resolved').length;
    const active = items.filter(h=>h.status!=='Resolved').length;
    document.getElementById('statTotal').textContent = total;
    document.getElementById('statResolved').textContent = resolved;
    document.getElementById('statActive').textContent = active;

    const recentList = document.getElementById('recentList');
    recentList.innerHTML = '';
    items.slice(0,6).forEach(h=>{
      const div = document.createElement('div');
      div.className = 'card';
      const img = h.imageUrl?`<img src="${h.imageUrl}" style="width:100%;height:140px;object-fit:cover;border-radius:8px;margin-bottom:8px;"/>`:'';
      div.innerHTML = `${img}<b>${h.category}</b> · <i>${h.status}</i><br/>${h.description}`;
      recentList.appendChild(div);
    });
  }catch(e){ /* ignore */ }
}

loadStatsAndRecent();





