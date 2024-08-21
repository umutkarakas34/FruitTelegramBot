// public/scripts/disable-console.js

(function() {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
  
    console.log = function(...args) {
      if (!args[0] || !args[0].includes('[Telegram.WebView]')) {
        originalLog.apply(console, args);
      }
    };
  
    console.warn = function(...args) {
      if (!args[0] || !args[0].includes('[Telegram.WebView]')) {
        originalWarn.apply(console, args);
      }
    };
  
    console.error = function(...args) {
      if (!args[0] || !args[0].includes('[Telegram.WebView]')) {
        originalError.apply(console, args);
      }
    };
  })();
  