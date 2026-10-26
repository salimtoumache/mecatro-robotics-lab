(function () {
  try {
    var d = document.documentElement, q = new URLSearchParams(location.search);
    var theme = q.get('theme') || window.localStorage.getItem('mb-theme');
    if (theme !== 'light' && theme !== 'dark') theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    d.setAttribute('data-theme', theme);
  } catch (e) { }
})();
