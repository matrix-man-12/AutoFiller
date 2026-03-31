// Theme pre-initialization to prevent FOUC (Flash Of Unstyled Content)
// This runs before React mounts to set the correct theme attribute on <html>
(function() {
  try {
    var t = localStorage.getItem('autofiller-theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } catch (e) {
    // Silently fail in restricted environments
  }
})();
