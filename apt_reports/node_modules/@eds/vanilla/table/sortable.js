/* global eventListener, removeClass, addClass, removeSiblingClass, findParentByClass */
(() => {
  const sortableTable = document.getElementsByClassName('table sortable');

  const sort = (table) => {
    const sortedTable = table.getElementsByTagName('tbody')[0];
    const asc = Array.from(table.getElementsByClassName('asc'));
    const desc = Array.from(table.getElementsByClassName('desc'));
    const elements = Array.from(new Set(asc.concat(desc)));
    const rows = Array.from(sortedTable.getElementsByTagName('tr'));

    for (let i = 0; i < elements.length; i += 1) {
      const sortColumns = [...elements[i].parentNode.children].indexOf(elements[i]);
      rows.sort((a, b) => {
        const aContent = a.getElementsByTagName('td')[sortColumns].innerText.toUpperCase();
        const bContent = b.getElementsByTagName('td')[sortColumns].innerText.toUpperCase();
        if (elements[i].classList.contains('desc')) {
          return aContent < bContent;
        } else if (elements[i].classList.contains('asc')) {
          return aContent > bContent;
        }
        return 0;
      });
    }

    sortedTable.innerHTML = rows.map(row => `<tr>${row.innerHTML}</tr>`).join('');
  };

  eventListener(sortableTable, 'click', ({ target }) => {
    if (target.tagName !== 'th') {
      return;
    }
    const targetTable = findParentByClass(target, /(table.*sortable|sortable.*table)/);
    removeSiblingClass(target, 'asc');
    removeSiblingClass(target, 'desc');
    if (target.classList.contains('desc')) {
      removeClass(target, 'desc');
      addClass(target, 'asc');
    } else if (target.classList.contains('asc')) {
      removeClass(target, 'asc');
      addClass(target, 'desc');
    } else {
      addClass(target, 'asc');
    }
    sort(targetTable);
  });
})();
