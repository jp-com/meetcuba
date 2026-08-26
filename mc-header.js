(function () {
  var HEADER_HTML =
    '<div class="topbar">' +
      '<div class="topbar__left u-label"><span>HONG KONG</span></div>' +
      '<div class="topbar__center u-label">COMPLIMENTARY DELIVERY IN HONG KONG ON ORDERS OVER HK$2,000</div>' +
      '<div class="topbar__right u-label">' +
        '<span>EN</span>' +
        '<a class="u-label" href="wishlist.html">WISHLIST (<span data-wishlist-count>0</span>)</a>' +
        '<button class="bag-toggle u-label" data-bag-toggle type="button">BAG (<span data-bag-count>0</span>)</button>' +
      '</div>' +
    '</div>' +
    '<nav class="nav">' +
      '<div class="nav__links nav__links--left u-label">' +
        '<button class="nav__search-toggle" data-search-toggle type="button" aria-label="Search"></button>' +
        '<a class="nav__link" data-nav-item="shop" href="shop.html">SHOP</a>' +
        '<a class="nav__link" data-nav-item="brands" href="brands.html">BRANDS</a>' +
      '</div>' +
      '<a class="nav__logo" href="index.html">' +
        '<div class="nav__logo-main">MEET CUBA</div>' +
        '<div class="nav__logo-sub">HONG KONG</div>' +
      '</a>' +
      '<div class="nav__links nav__links--right u-label">' +
        '<span>SPECIAL EDITIONS</span>' +
        '<a class="nav__link" data-nav-item="store" href="store.html">OUR STORE</a>' +
      '</div>' +
    '</nav>';

  var mount = document.getElementById('site-header');
  if (mount) {
    mount.outerHTML = HEADER_HTML;

    var active = document.body.getAttribute('data-nav-active');
    if (active) {
      var link = document.querySelector('[data-nav-item="' + active + '"]');
      if (link) link.classList.add('nav__link--active');
    }
  }
})();
