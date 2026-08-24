(function () {
  var RECENT_KEY = 'meetcuba_recent_searches';
  var MAX_RECENT = 5;
  var MAX_RESULTS = 4;

  var PRODUCTS = [
    { brand: 'COHIBA', name: 'Siglo VI', spec: '25 Cigars · 150 × 52', price: 'HK$24,500' },
    { brand: 'COHIBA', name: 'Robusto', spec: '25 Cigars · 124 × 50', price: 'HK$14,200' },
    { brand: 'COHIBA', name: '55 Aniversario', spec: '10 Cigars · 130 × 55', price: 'HK$39,500' },
    { brand: 'COHIBA', name: 'Travel Humidor', spec: '1 Humidor', price: 'HK$55,000' },
    { brand: 'COHIBA', name: 'Talisman', spec: '10 Cigars · 154 × 54', price: 'HK$35,500' },
    { brand: 'PARTAGÁS', name: 'Serie D No.4', spec: 'Box of 10 · 124 × 50', price: 'HK$3,000' },
    { brand: 'PARTAGÁS', name: 'Serie D No.4', spec: 'Box of 25 · 124 × 50', price: 'HK$7,500' },
    { brand: 'PARTAGÁS', name: 'Mille Fleurs', spec: 'Box of 10 · 129 × 42', price: 'HK$1,800' },
    { brand: 'PARTAGÁS', name: 'Legado', spec: '25 Cigars · 157 × 48', price: 'HK$16,500' },
    { brand: 'PARTAGÁS', name: 'E Gran Reserva', spec: '15 Cigars · 140 × 54', price: 'HK$42,800' },
    { brand: 'MONTECRISTO', name: 'No.2', spec: '25 Cigars · 156 × 52', price: 'HK$5,500' },
    { brand: 'HOYO DE MONTERREY', name: 'Epicure No.2', spec: '25 Cigars · 124 × 50', price: 'HK$6,200' },
    { brand: 'ROMEO Y JULIETA', name: 'Wide Churchill', spec: '25 Cigars · 130 × 55', price: 'HK$6,000' },
    { brand: 'TRINIDAD', name: 'Fundadores', spec: '12 Cigars · 192 × 40', price: 'HK$4,800' },
    { brand: 'BOLÍVAR', name: 'Belicosos Finos', spec: '25 Cigars · 140 × 52', price: 'HK$5,800' },
    { brand: 'H. UPMANN', name: 'Noellas', spec: '25 Cigars · 135 × 42', price: 'HK$9,800' }
  ];

  var BRANDS = [
    'COHIBA', 'PARTAGÁS', 'MONTECRISTO', 'HOYO DE MONTERREY', 'TRINIDAD',
    'ROMEO Y JULIETA', 'BOLÍVAR', 'H. UPMANN', 'DIPLOMÁTICOS', "QUAI D'ORSAY", 'LA GLORIA CUBANA'
  ];

  var POPULAR_SEARCHES = ['Cohiba', 'Partagás Serie D No.4', 'Montecristo No.2', 'Limited Editions', 'Robusto', 'Romeo y Julieta'];

  function norm(s) { return s.toLowerCase(); }

  function getRecent() {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; }
    catch (e) { return []; }
  }

  function addRecent(query) {
    query = query.trim();
    if (!query) return;
    var list = getRecent().filter(function (q) { return norm(q) !== norm(query); });
    list.unshift(query);
    list = list.slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  }

  var OVERLAY_HTML =
    '<div class="search-overlay" id="searchOverlay">' +
      '<div class="search-overlay__backdrop" id="searchBackdrop"></div>' +
      '<div class="search-overlay__panel">' +
        '<h1 class="search-overlay__title">Search</h1>' +
        '<div class="search-overlay__field" id="searchField">' +
          '<span class="search-overlay__icon-search"></span>' +
          '<input class="search-overlay__input" id="searchInput" type="text" placeholder="Search products, brands…" autocomplete="off">' +
          '<span class="search-overlay__clear" id="searchClear">×</span>' +
        '</div>' +
        '<div class="search-overlay__results" id="searchResults"></div>' +
      '</div>' +
    '</div>';

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderSuggestList(title, items, onClickHandlerName) {
    if (!items.length) return '';
    return (
      '<div class="search-overlay__col-label">' + title + '</div>' +
      '<ul class="search-suggest-list">' +
        items.map(function (item) {
          return '<li class="search-suggest-list__item"><a class="search-suggest-list__link" href="#" data-suggest="' + escapeHtml(item) + '">' + escapeHtml(item) + '</a></li>';
        }).join('') +
      '</ul>'
    );
  }

  function renderSidebar(query) {
    var recent = getRecent();
    return renderSuggestList('POPULAR SEARCHES', POPULAR_SEARCHES) + renderSuggestList('RECENT SEARCHES', recent);
  }

  function renderResults(query) {
    var resultsEl = document.getElementById('searchResults');
    var trimmed = query.trim();
    var sidebarHtml = '<div>' + renderSidebar(trimmed) + '</div>';

    if (!trimmed) {
      resultsEl.innerHTML = '<div></div><div></div>' + sidebarHtml;
      return;
    }

    var q = norm(trimmed);
    var matchedProducts = PRODUCTS.filter(function (p) {
      return norm(p.brand).indexOf(q) !== -1 || norm(p.name).indexOf(q) !== -1;
    });
    var matchedBrands = BRANDS.filter(function (b) { return norm(b).indexOf(q) !== -1; });

    var productsHtml =
      '<div>' +
        '<div class="search-overlay__col-label">PRODUCTS (' + matchedProducts.length + ')</div>' +
        (matchedProducts.length
          ? matchedProducts.slice(0, MAX_RESULTS).map(function (p) {
              return (
                '<a class="search-result" href="product.html">' +
                  '<span class="search-result__image"><span class="search-result__image-mark"></span></span>' +
                  '<span class="search-result__body">' +
                    '<span class="search-result__brand">' + escapeHtml(p.brand) + '</span>' +
                    '<span class="search-result__name">' + escapeHtml(p.name) + '</span>' +
                    '<span class="search-result__spec">' + escapeHtml(p.spec) + '</span>' +
                    '<span class="search-result__price">' + escapeHtml(p.price) + '</span>' +
                  '</span>' +
                  '<span class="search-result__arrow">→</span>' +
                '</a>'
              );
            }).join('')
          : '<div class="search-overlay__empty">No products found.</div>') +
        (matchedProducts.length
          ? '<a class="search-overlay__viewall" href="shop.html?q=' + encodeURIComponent(trimmed) + '" id="searchViewAll">VIEW ALL RESULTS FOR &ldquo;' + escapeHtml(trimmed.toUpperCase()) + '&rdquo; →</a>'
          : '') +
      '</div>';

    var brandsHtml =
      '<div>' +
        '<div class="search-overlay__col-label">BRANDS (' + matchedBrands.length + ')</div>' +
        (matchedBrands.length
          ? matchedBrands.slice(0, MAX_RESULTS + 1).map(function (b) {
              return (
                '<a class="search-brand-result" href="brands.html">' +
                  '<span class="search-brand-result__icon"></span>' +
                  '<span class="search-brand-result__name">' + escapeHtml(titleCase(b)) + '</span>' +
                  '<span class="search-brand-result__arrow">→</span>' +
                '</a>'
              );
            }).join('')
          : '<div class="search-overlay__empty">No brands found.</div>') +
        (matchedBrands.length ? '<a class="search-overlay__viewall" href="brands.html">VIEW ALL BRANDS →</a>' : '') +
      '</div>';

    resultsEl.innerHTML = productsHtml + brandsHtml + sidebarHtml;
  }

  function titleCase(s) {
    return s.replace(/\w\S*/g, function (w) { return w.charAt(0) + w.slice(1).toLowerCase(); });
  }

  function openSearch() {
    var toggle = document.querySelector('[data-search-toggle]');
    var overlay = document.getElementById('searchOverlay');
    var nav = document.querySelector('.nav');
    if (nav) {
      overlay.style.top = Math.round(nav.getBoundingClientRect().bottom) + 'px';
    }
    document.body.classList.add('search-open');
    if (toggle) toggle.textContent = '✕';
    var input = document.getElementById('searchInput');
    renderResults(input.value);
    setTimeout(function () { input.focus(); }, 50);
  }

  function closeSearch() {
    var toggle = document.querySelector('[data-search-toggle]');
    document.body.classList.remove('search-open');
    if (toggle) toggle.textContent = 'SEARCH';
  }

  function isOpen() { return document.body.classList.contains('search-open'); }

  document.addEventListener('DOMContentLoaded', function () {
    var mount = document.getElementById('site-search');
    if (!mount) return;
    mount.outerHTML = OVERLAY_HTML;

    var toggle = document.querySelector('[data-search-toggle]');
    if (toggle) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        isOpen() ? closeSearch() : openSearch();
      });
    }

    document.getElementById('searchBackdrop').addEventListener('click', closeSearch);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) closeSearch();
    });

    var input = document.getElementById('searchInput');
    var field = document.getElementById('searchField');
    var clearBtn = document.getElementById('searchClear');

    input.addEventListener('input', function () {
      field.classList.toggle('search-overlay__field--has-value', input.value.length > 0);
      renderResults(input.value);
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        addRecent(input.value);
        renderResults(input.value);
      }
    });

    clearBtn.addEventListener('click', function () {
      input.value = '';
      field.classList.remove('search-overlay__field--has-value');
      renderResults('');
      input.focus();
    });

    document.getElementById('searchResults').addEventListener('click', function (e) {
      var suggest = e.target.closest('[data-suggest]');
      if (suggest) {
        e.preventDefault();
        var term = suggest.getAttribute('data-suggest');
        input.value = term;
        field.classList.add('search-overlay__field--has-value');
        addRecent(term);
        renderResults(term);
        return;
      }
      var viewAll = e.target.closest('#searchViewAll');
      if (viewAll) addRecent(input.value);
    });
  });
})();
