(function () {
  var FOOTER_HTML =
    '<footer class="footer">' +
      '<div class="footer__top">' +
        '<div>' +
          '<div class="footer__brand-name">MEET CUBA</div>' +
          '<div class="footer__brand-sub">HONG KONG</div>' +
          '<div class="footer__brand-copy">Fine cigars. Rare finds.<br>Personal service.</div>' +
          '<div class="footer__social"></div>' +
        '</div>' +
        '<div>' +
          '<div class="footer__col-title">SHOP</div>' +
          '<a class="footer__col-link" href="shop.html">All Cigars</a>' +
          '<a class="footer__col-link" href="#">Accessories</a>' +
          '<a class="footer__col-link" href="#">New Arrivals</a>' +
          '<a class="footer__col-link" href="#">Gift Cards</a>' +
        '</div>' +
        '<div>' +
          '<div class="footer__col-title">BRANDS</div>' +
          '<a class="footer__col-link" href="brands.html">Cohiba</a>' +
          '<a class="footer__col-link" href="brands.html">Partagás</a>' +
          '<a class="footer__col-link" href="brands.html">Montecristo</a>' +
          '<a class="footer__col-link" href="brands.html">All Brands</a>' +
        '</div>' +
        '<div>' +
          '<div class="footer__col-title">CUSTOMER CARE</div>' +
          '<a class="footer__col-link" href="delivery.html">Delivery</a>' +
          '<a class="footer__col-link" href="delivery.html">Returns</a>' +
          '<a class="footer__col-link" href="#">FAQ</a>' +
          '<a class="footer__col-link" href="contact.html">Contact Us</a>' +
        '</div>' +
        '<div>' +
          '<div class="footer__col-title">OUR STORE</div>' +
          '<a class="footer__col-link" href="store.html">About Us</a>' +
          '<a class="footer__col-link" href="store.html">Visit Us</a>' +
          '<a class="footer__col-link" href="store.html">Private Appointments</a>' +
        '</div>' +
        '<div>' +
          '<div class="footer__col-title">NEWSLETTER</div>' +
          '<div class="footer__newsletter-copy">Be the first to know about new arrivals and exclusive releases.</div>' +
          '<div class="footer__newsletter-form">' +
            '<input class="footer__newsletter-input" type="email" placeholder="Enter your email">' +
            '<span class="footer__newsletter-submit">→</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="footer__bottom">' +
        '<span>© 2026 MEET CUBA HONG KONG. ALL RIGHTS RESERVED.</span>' +
        '<div class="footer__bottom-links">' +
          '<a href="terms.html">TERMS &amp; CONDITIONS</a>' +
          '<a href="privacy.html">PRIVACY POLICY</a>' +
          '<a href="delivery.html">DELIVERY &amp; RETURNS</a>' +
          '<a href="cookies.html">COOKIES</a>' +
          '<span>18+ ONLY</span>' +
        '</div>' +
      '</div>' +
    '</footer>';

  document.addEventListener('DOMContentLoaded', function () {
    var mount = document.getElementById('site-footer');
    if (mount) mount.outerHTML = FOOTER_HTML;
  });
})();
