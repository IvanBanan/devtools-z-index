/* globals browser */

(() => {
  function sendMessage (type) {
    chrome.runtime.sendMessage({ type });
  }

  async function createSidebarPane (title) {
    const htmlPath = '/devtools_page/z-index/index.html';

    let pane;

    const sidebarAvailable = navigator.userAgent.match(' Chrome/');
    if (sidebarAvailable) {
      pane = await new Promise((resolve) => {
        // seems polyfill does not support this?
        chrome.devtools.panels.elements.createSidebarPane(title, resolve);
      });
      // Chrome has `setPage()` 🙂
      pane.setPage(htmlPath);
    } else {
      // Firefox does not have `setPage()` so... 😢
      pane = chrome.devtools.panels.create(title, '', htmlPath);
    }

    return pane;
  }

  async function start () {
    const pane = await createSidebarPane('z-index');
    pane.onShown.addListener(() => sendMessage('updateTable'));
    pane.onHidden.addListener(() => sendMessage('clearTable'));
    chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
      sendMessage('updateTable');
    });
  }

  start();

})();
