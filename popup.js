document.addEventListener('DOMContentLoaded', () => {
  const btnAutoFill = document.getElementById('btn-autofill');
  const btnAutoClear = document.getElementById('btn-autoclear');
  const btnOptions = document.getElementById('btn-options');

  btnAutoFill.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'trigger_autofill' });
    window.close();
  });

  btnAutoClear.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'trigger_autoclear' });
    window.close();
  });

  btnOptions.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
});
