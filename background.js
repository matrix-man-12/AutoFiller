// Listener for Keyboard Shortcuts defined in manifest.json
chrome.commands.onCommand.addListener((command) => {
  if (command === 'autofill-now') {
    executeActionInActiveTab('trigger_autofill');
  } else if (command === 'autoclear-now') {
    executeActionInActiveTab('trigger_autoclear');
  }
});

// Listener for Messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'trigger_autofill' || message.action === 'trigger_autoclear') {
    executeActionInActiveTab(message.action);
  }
});

/**
 * Dynamically injects content.js into the active tab using the scripting API
 * and then sends it the action directive (autofill or autoclear).
 */
async function executeActionInActiveTab(action) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) return;
    
    // We cannot inject scripts into chrome-specific URLs
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
      console.warn("AutoFiller: Cannot inject script into restricted browser pages.");
      return;
    }

    // Inject the content script logic. If it's already injected, it just runs it again 
    // which is harmless if we structure content.js to be idempotent.
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });

    // Wait slightly to ensure script is fully loaded, then dispatch action
    setTimeout(() => {
        chrome.tabs.sendMessage(tab.id, { action: action });
    }, 50);
    
  } catch (error) {
    console.error("AutoFiller Background Error: ", error);
  }
}
