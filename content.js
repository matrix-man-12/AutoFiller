// content.js
// This script is temporarily injected into the active tab via background.js when the command is triggered.

// To prevent multiple listener registrations if injected multiple times
if (typeof window.hasAutoFillerListener === 'undefined') {
  window.hasAutoFillerListener = true;

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'trigger_autofill') {
      executeAutoFill();
    } else if (message.action === 'trigger_autoclear') {
      executeAutoClear();
    }
  });

  async function executeAutoFill() {
    const data = await chrome.storage.local.get('apps');
    if (!data.apps) return;

    const currentUrl = window.location.href;
    
    data.apps.forEach(app => {
      if (!app.enabled) return;

      app.rules.forEach(rule => {
        if (!rule.enabled) return;

        if (isMatch(currentUrl, rule.urlPattern, rule.matchType)) {
          rule.fields.forEach(field => {
            if (!field.enabled) return;

            try {
              const element = document.querySelector(field.selector);
              if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
                let contentToFill = field.content;
                
                if (field.appendTimestamp) {
                  const now = new Date();
                  const dd = String(now.getDate()).padStart(2, '0');
                  const mmm = now.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                  const yyyy = now.getFullYear();
                  const hh = String(now.getHours()).padStart(2, '0');
                  const min = String(now.getMinutes()).padStart(2, '0');
                  const ss = String(now.getSeconds()).padStart(2, '0');
                  const timestampStr = `${dd}${mmm}${yyyy} ${hh}:${min}:${ss}`;
                  contentToFill += (contentToFill.length > 0 ? ' ' : '') + timestampStr;
                }
                
                element.value = contentToFill;
                
                // Emulate genuine user inputs for frameworks like React, Vue, Angular
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
              }
            } catch (err) {
              console.warn(`AutoFiller: Invalid selector or element not found -> ${field.selector}`, err);
            }
          });
        }
      });
    });
  }

  async function executeAutoClear() {
    const data = await chrome.storage.local.get('apps');
    if (!data.apps) return;

    const currentUrl = window.location.href;
    
    data.apps.forEach(app => {
      if (!app.enabled) return;

      app.rules.forEach(rule => {
        if (!rule.enabled) return;

        if (isMatch(currentUrl, rule.urlPattern, rule.matchType)) {
          rule.fields.forEach(field => {
            if (!field.enabled) return;

            try {
              const element = document.querySelector(field.selector);
              if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
                element.value = '';
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
              }
            } catch (err) {
              console.warn(`AutoFiller: Invalid selector or element not found -> ${field.selector}`, err);
            }
          });
        }
      });
    });
  }

  /**
   * Matches currentUrl against criteria using the selected Match Type
   */
  function isMatch(url, pattern, matchType) {
    if (matchType === 'exact') {
      return url === pattern;
    } else if (matchType === 'startsWith') {
      return url.startsWith(pattern);
    } else if (matchType === 'wildcard') {
      // Escape Regex special characters EXCEPT the asterisk
      const escapeRegex = (string) => string.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
      // Convert wildcard * to Regex .*
      const regexPattern = "^" + escapeRegex(pattern).replace(/\*/g, '.*') + "$";
      const regex = new RegExp(regexPattern);
      return regex.test(url);
    }
    return false;
  }
}
