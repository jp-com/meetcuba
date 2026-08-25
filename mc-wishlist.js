(function () {
  var STORAGE_KEY = 'meetcuba_wishlist';

  function getWishlist() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (e) { return []; }
  }

  function saveWishlist(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    renderWishlist();
  }

  function slugify(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function isSaved(id) {
    return getWishlist().some(function (i) { return i.id === id; });
  }

  function toggle(item) {
    var items = getWishlist();
    var idx = items.map(function (i) { return i.id; }).indexOf(item.id);
    if (idx > -1) items.splice(idx, 1);
    else items.push(item);
    saveWishlist(items);
  }

  function removeItem(id) {
    saveWishlist(getWishlist().filter(function (i) { return i.id !== id; }));
  }

  function clearAll() {
    saveWishlist([]);
  }

  function fmtPrice(n) {
    return 'HK$' + Math.round(n).toLocaleString('en-US');
  }

  function parsePrice(text) {
    return parseInt(text.replace(/[^0-9]/g, ''), 10) || 0;
  }

  function textWithBreaks(el) {
    return el.innerHTML.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
  }

  function cardData(card) {
    var brand = card.querySelector('.product-card__brand').textContent.trim();
    var name = textWithBreaks(card.querySelector('.product-card__name'));
    var spec = card.querySelector('.product-card__spec').textContent.trim();
    var price = parsePrice(card.querySelector('.product-card__price').textContent);
    return {
      id: slugify(brand + '-' + name + '-' + spec),
      brand: brand,
      name: name,
      spec: spec,
      price: price,
      available: true
    };
  }

  function syncCardStates() {
    document.querySelectorAll('.product-card').forEach(function (card) {
      var toggleEl = card.querySelector('[data-wishlist-toggle]');
      if (!toggleEl) return;
      var saved = isSaved(cardData(card).id);
      toggleEl.textContent = saved ? '♥' : '♡';
      toggleEl.classList.toggle('product-card__wishlist--active', saved);
    });
  }

  function renderWishlist() {
    var items = getWishlist();

    document.querySelectorAll('[data-wishlist-count]').forEach(function (el) {
      el.textContent = items.length;
    });

    syncCardStates();

    var grid = document.getElementById('wishlistGrid');
    if (!grid) return;

    var countLabel = document.getElementById('wishlistCount');
    if (countLabel) countLabel.textContent = items.length + (items.length === 1 ? ' ITEM' : ' ITEMS');

    var empty = document.getElementById('wishlistEmpty');
    var note = document.getElementById('wishlistNote');

    if (items.length === 0) {
      grid.style.display = 'none';
      if (empty) empty.style.display = 'block';
      if (note) note.style.display = 'none';
      return;
    }

    grid.style.display = '';
    if (empty) empty.style.display = 'none';
    if (note) note.style.display = '';

    grid.innerHTML = items.map(function (item) {
      return (
        '<div class="wishlist-card">' +
          '<button class="wishlist-card__remove" data-action="remove" data-id="' + item.id + '" type="button">♥</button>' +
          '<div class="wishlist-card__image"><div class="wishlist-card__image-mark"></div></div>' +
          '<div class="wishlist-card__brand">' + item.brand + '</div>' +
          '<div class="wishlist-card__name">' + item.name + '</div>' +
          (item.spec ? '<div class="wishlist-card__spec">' + item.spec + '</div>' : '') +
          '<div class="wishlist-card__price">' + fmtPrice(item.price) + '</div>' +
          (item.available === false ?
            '<button class="wishlist-card__unavailable" type="button" disabled>CURRENTLY UNAVAILABLE</button>' +
            '<a class="wishlist-card__contact" href="contact.html">CONTACT STORE →</a>'
          :
            '<div class="wishlist-card__row">' +
              '<button class="wishlist-card__add" data-action="add" data-id="' + item.id + '" type="button">ADD TO BAG</button>' +
              '<button class="wishlist-card__more" type="button">···</button>' +
            '</div>'
          ) +
        '</div>'
      );
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderWishlist();

    document.addEventListener('click', function (e) {
      var toggleBtn = e.target.closest('[data-wishlist-toggle]');
      if (!toggleBtn) return;
      e.preventDefault();
      e.stopPropagation();
      var card = toggleBtn.closest('.product-card');
      if (card) toggle(cardData(card));
    });

    var grid = document.getElementById('wishlistGrid');
    if (grid) {
      grid.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;
        var id = btn.getAttribute('data-id');
        var action = btn.getAttribute('data-action');
        if (action === 'remove') removeItem(id);
        if (action === 'add') {
          var item = getWishlist().filter(function (i) { return i.id === id; })[0];
          if (item && window.MeetCubaCart) {
            window.MeetCubaCart.addToCart({
              id: item.id, brand: item.brand, name: item.name,
              spec: item.spec, price: item.price, qty: 1
            });
          }
        }
      });
    }

    var clearBtn = document.getElementById('wishlistClearAll');
    if (clearBtn) clearBtn.addEventListener('click', function (e) { e.preventDefault(); clearAll(); });
  });

  window.MeetCubaWishlist = {
    toggle: toggle,
    isSaved: isSaved,
    removeItem: removeItem,
    clearAll: clearAll,
    getWishlist: getWishlist,
    renderWishlist: renderWishlist
  };
})();
