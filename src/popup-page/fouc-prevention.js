try {
  chrome.storage.local.get('themeMode', function(result) {
    var mode = result.themeMode || 'light';
    var isDark = mode === 'dark' ||
      (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.body.style.backgroundColor = '#1e1e1e';
    }
  });
} catch(e) {}
