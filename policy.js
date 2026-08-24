(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.policy-toc__link'));
  var sections = links.map(function (link) {
    return document.getElementById(link.getAttribute('href').slice(1));
  });

  function setActive(id) {
    links.forEach(function (link) {
      link.classList.toggle('policy-toc__link--active', link.getAttribute('href') === '#' + id);
    });
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-15% 0px -70% 0px' });

    sections.forEach(function (section) {
      if (section) observer.observe(section);
    });
  }

  if (links.length) setActive(links[0].getAttribute('href').slice(1));
})();
