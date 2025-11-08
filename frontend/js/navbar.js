(function(){
  const btn = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if(btn && links){
    btn.addEventListener('click', ()=>{
      const visible = links.style.display==='flex' || links.style.display==='block';
      links.style.display = visible ? 'none' : 'flex';
    });
  }
  // Highlight active link
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(a=>{
    const href = a.getAttribute('href');
    if(href===path) a.classList.add('active');
  });
})();





