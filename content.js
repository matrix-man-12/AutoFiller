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

  // --- Utility: sleep for ms ---
  function sleep(ms) {
    return ms > 0 ? new Promise(resolve => setTimeout(resolve, ms)) : Promise.resolve();
  }

  async function executeAutoFill() {
    const data = await chrome.storage.local.get('apps');
    if (!data.apps) return;

    const currentUrl = window.location.href;
    
    for (const app of data.apps) {
      if (!app.enabled) continue;

      for (const rule of app.rules) {
        if (!rule.enabled) continue;

        const patterns = rule.urlPatterns ? rule.urlPatterns.map(p => p.value) : [rule.urlPattern];
        const isMatched = patterns.some(pattern => isMatch(currentUrl, pattern, rule.matchType));

        if (isMatched) {
          // Process fields sequentially to respect wait times
          for (const field of rule.fields) {
            if (!field.enabled) continue;

            try {
              // Wait before this field
              await sleep(field.waitBefore || 0);

              const element = getElement(field.selector);
              if (!element) {
                console.warn(`AutoFiller: Element not found -> ${field.selector}`);
                continue;
              }

              const elementType = field.elementType || 'input';

              if (elementType === 'input') {
                // --- Input / Textarea: fill value ---
                if (!canFillInput(element)) continue;

                let contentToFill = field.content || '';
                
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
                
                fillElement(element, contentToFill);

              } else if (elementType === 'button') {
                // --- Button / Link: dispatch interaction event ---
                dispatchInteraction(element, field.interactionType || 'click');

              } else if (elementType === 'dropdown') {
                // --- Dropdown: open action -> wait -> select option ---
                dispatchInteraction(element, field.dropdownAction || 'click');
                await sleep(field.waitAfterOpen || 0);
                
                // Set the option value
                if (field.optionValue !== undefined && field.optionValue !== '') {
                  element.value = field.optionValue;
                  element.dispatchEvent(new Event('input', { bubbles: true }));
                  element.dispatchEvent(new Event('change', { bubbles: true }));
                }
              }

            } catch (err) {
              console.warn(`AutoFiller: Error processing field -> ${field.selector}`, err);
            }
          }
        }
      }
    }
  }

  async function executeAutoClear() {
    const data = await chrome.storage.local.get('apps');
    if (!data.apps) return;

    const currentUrl = window.location.href;
    
    for (const app of data.apps) {
      if (!app.enabled) continue;

      for (const rule of app.rules) {
        if (!rule.enabled) continue;

        const patterns = rule.urlPatterns ? rule.urlPatterns.map(p => p.value) : [rule.urlPattern];
        const isMatched = patterns.some(pattern => isMatch(currentUrl, pattern, rule.matchType));

        if (isMatched) {
          for (const field of rule.fields) {
            if (!field.enabled) continue;
            
            // Only clear input-type fields
            const elementType = field.elementType || 'input';
            if (elementType !== 'input') continue;

            try {
              const element = getElement(field.selector);
              if (canFillInput(element)) {
                clearElement(element);
              }
            } catch (err) {
              console.warn(`AutoFiller: Invalid selector or element not found -> ${field.selector}`, err);
            }
          }
        }
      }
    }
  }

  // --- Helper Methods ---

  function getElement(selector) {
    const s = selector.trim();
    if (s.startsWith('//') || s.startsWith('(/')) {
      // Handle XPath logic directly
      try {
        const result = document.evaluate(s, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return result.singleNodeValue;
      } catch (e) {
        console.warn('AutoFiller: Invalid XPath expression', e);
        return null;
      }
    }
    // Handle CSS Selector. browser querySelector natively supports highly complex Level 4 CSS Selectors
    return document.querySelector(s);
  }

  /**
   * Checks if an element can receive text input (for input/textarea type fields only)
   */
  function canFillInput(element) {
    if (!element) return false;
    const isFormEl = ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName);
    const isContentEditable = element.isContentEditable;
    return isFormEl || isContentEditable;
  }

  /**
   * Dispatches an interaction event on an element
   */
  function dispatchInteraction(element, interactionType) {
    switch (interactionType) {
      case 'click':
        element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        break;
      case 'focus':
        element.focus();
        element.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
        break;
      case 'mousedown':
        element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
        break;
      case 'mouseup':
        element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
        break;
      case 'keydown':
        element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true }));
        break;
      case 'keyup':
        element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true }));
        break;
      default:
        element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    }
  }

  function fillElement(element, content) {
    if (element.tagName === 'SELECT') {
      element.value = content;
    } else if (element.isContentEditable) {
      element.innerText = content;
    } else {
      element.value = content;
    }
    // Emulate genuine user inputs for frameworks like React, Vue, Angular
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function clearElement(element) {
    if (element.tagName === 'SELECT') {
      element.value = '';
    } else if (element.isContentEditable) {
      element.innerText = '';
    } else {
      element.value = '';
    }
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
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
