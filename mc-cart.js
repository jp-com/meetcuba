(function () {
  var STORAGE_KEY = 'meetcuba_cart';
  var FREE_DELIVERY_THRESHOLD = 2000;

  function getCart() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (e) { return []; }
  }

  function saveCart(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    renderCart();
  }

  function addToCart(item) {
    var items = getCart();
    var existing = items.filter(function (i) { return i.id === item.id; })[0];
    if (existing) { existing.qty += item.qty; }
    else { items.push(item); }
    saveCart(items);
    openCart();
  }

  function updateQty(id, delta) {
    var items = getCart();
    var item = items.filter(function (i) { return i.id === id; })[0];
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    saveCart(items);
  }

  function removeItem(id) {
    saveCart(getCart().filter(function (i) { return i.id !== id; }));
  }

  function fmtPrice(n) {
    return 'HK$' + Math.round(n).toLocaleString('en-US');
  }

  function renderCart() {
    var items = getCart();
    var totalQty = items.reduce(function (s, i) { return s + i.qty; }, 0);

    document.querySelectorAll('[data-bag-count]').forEach(function (el) {
      el.textContent = totalQty;
    });

    var list = document.getElementById('cartItems');
    if (!list) return;

    var itemsLabel = document.getElementById('cartItemsLabel');
    itemsLabel.textContent = totalQty + (totalQty === 1 ? ' ITEM' : ' ITEMS');

    if (items.length === 0) {
      list.innerHTML = '<div class="cart-empty">Your bag is empty.</div>';
    } else {
      list.innerHTML = items.map(function (item) {
        return (
          '<div class="cart-item">' +
            '<div class="cart-item__image"><div class="cart-item__image-mark"></div></div>' +
            '<div class="cart-item__body">' +
              '<div class="cart-item__brand">' + item.brand + '</div>' +
              '<div class="cart-item__name">' + item.name + '</div>' +
              '<div class="cart-item__spec">' + item.spec + '</div>' +
              '<div class="cart-item__row">' +
                '<div class="cart-qty">' +
                  '<button class="cart-qty__btn" data-action="dec" data-id="' + item.id + '" type="button">−</button>' +
                  '<span class="cart-qty__value">' + item.qty + '</span>' +
                  '<button class="cart-qty__btn" data-action="inc" data-id="' + item.id + '" type="button">+</button>' +
                '</div>' +
                '<div class="cart-item__price">' + fmtPrice(item.price * item.qty) + '</div>' +
              '</div>' +
              '<button class="cart-item__remove" data-action="remove" data-id="' + item.id + '" type="button">Remove</button>' +
            '</div>' +
          '</div>'
        );
      }).join('');
    }

    var subtotal = items.reduce(function (s, i) { return s + i.price * i.qty; }, 0);
    document.getElementById('cartSubtotal').textContent = fmtPrice(subtotal);

    var pct = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100));
    document.getElementById('cartProgressFill').style.width = pct + '%';

    var deliveryText = document.getElementById('cartDeliveryText');
    var deliveryCheck = document.getElementById('cartDeliveryCheck');
    if (subtotal >= FREE_DELIVERY_THRESHOLD) {
      deliveryText.textContent = 'Complimentary Hong Kong delivery unlocked';
      deliveryCheck.style.display = '';
    } else {
      deliveryText.textContent = 'Add ' + fmtPrice(FREE_DELIVERY_THRESHOLD - subtotal) + ' more for free delivery';
      deliveryCheck.style.display = 'none';
    }
  }

  function openCart() { document.body.classList.add('cart-open'); }
  function closeCart() { document.body.classList.remove('cart-open'); }

  document.addEventListener('DOMContentLoaded', function () {
    renderCart();

    document.querySelectorAll('[data-bag-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function (e) { e.preventDefault(); openCart(); });
    });

    var closeBtn = document.getElementById('cartClose');
    if (closeBtn) closeBtn.addEventListener('click', closeCart);

    var overlay = document.getElementById('cartOverlay');
    if (overlay) overlay.addEventListener('click', closeCart);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeCart();
    });

    var list = document.getElementById('cartItems');
    if (list) {
      list.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;
        var id = btn.getAttribute('data-id');
        var action = btn.getAttribute('data-action');
        if (action === 'inc') updateQty(id, 1);
        if (action === 'dec') updateQty(id, -1);
        if (action === 'remove') removeItem(id);
      });
    }
  });

  window.MeetCubaCart = {
    addToCart: addToCart,
    updateQty: updateQty,
    removeItem: removeItem,
    openCart: openCart,
    closeCart: closeCart,
    renderCart: renderCart,
    getCart: getCart
  };
})();
