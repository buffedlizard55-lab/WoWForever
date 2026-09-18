/* WoWForever — small progressive-enhancement helpers.
   No dependencies. If this file fails to load, every page still reads fine. */
(function () {
  'use strict';

  // 1. Mark the current page in the nav.
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === here) a.setAttribute('aria-current', 'page');
  });

  // 2. Stamp the "last verified" date on every element that asks for it.
  var stamp = document.querySelectorAll('[data-snapshot]');
  var SNAPSHOT = '2026-09-18';
  stamp.forEach(function (el) { el.textContent = SNAPSHOT; });

  // 3. Generic filterable table. Markup contract:
  //    <div class="controls" data-filter-for="#id"> containing input[type=search]
  //    and any number of select[data-key] dropdowns.
  //    Target table rows carry data-search="lowercased haystack" and data-<key>="value".
  //    A row is shown only when every active control matches it.
  document.querySelectorAll('[data-filter-for]').forEach(function (bar) {
    var table = document.querySelector(bar.getAttribute('data-filter-for'));
    if (!table) return;
    var input = bar.querySelector('input[type="search"]');
    var selects = Array.prototype.slice.call(bar.querySelectorAll('select[data-key]'));
    var counter = bar.querySelector('.count');

    function apply() {
      // Re-query every time: some tables are rendered by a script that may run
      // before or after this one, so the row list can change after page load.
      var rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr'));
      var q = input ? input.value.trim().toLowerCase() : '';
      var shown = 0;
      rows.forEach(function (tr) {
        var ok = !q || (tr.getAttribute('data-search') || '').indexOf(q) !== -1;
        selects.forEach(function (sel) {
          if (!ok) return;
          var val = sel.value;
          if (val && tr.getAttribute('data-' + sel.getAttribute('data-key')) !== val) ok = false;
        });
        tr.hidden = !ok;
        if (ok) shown++;
      });
      if (counter) {
        counter.textContent = rows.length
          ? shown + ' of ' + rows.length + ' rows shown'
          : 'loading rows\u2026';
      }
    }
    if (input) input.addEventListener('input', apply);
    selects.forEach(function (sel) { sel.addEventListener('change', apply); });
    apply();
  });

  // 4. Copy-to-clipboard for citation blocks.
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var sel = btn.getAttribute('data-copy');
      var el = document.querySelector(sel);
      if (!el || !navigator.clipboard) return;
      navigator.clipboard.writeText(el.textContent.trim()).then(function () {
        var old = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = old; }, 1400);
      });
    });
  });

  // 5. Anchor links for headings inside long pages (table of contents support).
  document.querySelectorAll('.toc a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', a.getAttribute('href'));
    });
  });
})();
