(function(){
  const root = document.documentElement;
  const key = 'roadresq_theme';
  function apply(theme){
    root.classList.remove('dark');
    if(theme==='dark') root.classList.add('dark');
  }
  function current(){ return localStorage.getItem(key) || 'light'; }
  function toggle(){ const next = current()==='light'?'dark':'light'; localStorage.setItem(key,next); apply(next); }
  apply(current());
  window.toggleTheme = toggle;
})();

