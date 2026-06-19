(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
    var current = 0;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }
  });

  var params = new URLSearchParams(window.location.search);
  var query = params.get('q') || '';
  var localSearch = document.querySelector('[data-local-search]');
  var emptyState = document.querySelector('[data-empty-state]');

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function filterList(value) {
    var keyword = normalize(value);
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-filter-item]'));
    var visible = 0;

    items.forEach(function (item) {
      var text = normalize(item.getAttribute('data-search') || item.textContent);
      var matched = !keyword || text.indexOf(keyword) !== -1;
      item.hidden = !matched;
      if (matched) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle('is-visible', items.length > 0 && visible === 0);
    }
  }

  if (localSearch) {
    var input = localSearch.querySelector('input[type="search"]');
    var button = localSearch.querySelector('button');

    if (input) {
      input.value = query;
      filterList(query);
      input.addEventListener('input', function () {
        filterList(input.value);
      });
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        if (input) {
          filterList(input.value);
        }
      });
    }
  } else if (query) {
    filterList(query);
  }
})();
