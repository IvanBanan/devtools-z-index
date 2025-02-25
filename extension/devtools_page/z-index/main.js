/* globals browser, chrome, ZRankingTableUI */

(() => {
  const tableUi = new ZRankingTableUI();

  function executeScript (code) {
    return new Promise((resolve, reject) => {
      chrome.devtools.inspectedWindow.eval(code, (result, status) => {
        if (status && status.isException) {
          reject(new Error(status.value));
        }
        resolve(result);
      });
    });
  }

  function getRanking () {
    const code = `(${ZRankingTableUI.buildRanking.toString()})()`;
    return executeScript(code);
  }

  async function updateTable () {
    const ranking = await getRanking();
    tableUi.updateTable({ ranking });
  }

  async function clearTable () {
    tableUi.updateTable({});
  }

  function selectElement (selector) {
    const code = `inspect((Array.from(document.querySelectorAll('${selector.selector}'))).find(el => el.zIndexGuid === '${selector.zIndexGuid}'))`;
    executeScript(code);
  }

  function start () {
    const elTable = document.querySelector('#rankingTable-body');
    tableUi.start({ elTable });
    tableUi.onSelect = (selector) => {
      selectElement(selector);
    };

    chrome.runtime.onMessage.addListener(({ type }) => {
      if (type === 'updateTable') {
        updateTable();
      } else if (type === 'clearTable') {
        clearTable();
      }
    });

    document.addEventListener('click', (event) => {
      const elLink = event.target.closest('a');
      if (elLink) {
        event.preventDefault();
        const url = elLink.href;
        window.open(url);
      }
    });

    updateTable();
  }

  start();
})();
