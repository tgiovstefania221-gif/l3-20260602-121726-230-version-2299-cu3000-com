(function () {
  var mobileButton = document.querySelector('.mobile-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (mobileButton && mobileNav) {
    mobileButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dots button'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === current);
    });
  }

  var prev = document.querySelector('[data-hero-prev]');
  var next = document.querySelector('[data-hero-next]');

  if (prev) {
    prev.addEventListener('click', function () {
      showSlide(current - 1);
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      showSlide(current + 1);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(current + 1);
    }, 5000);
  }

  function applyFilter() {
    var input = document.querySelector('[data-filter-input]');
    var category = document.querySelector('[data-filter-category]');
    var year = document.querySelector('[data-filter-year]');
    var region = document.querySelector('[data-filter-region]');
    var type = document.querySelector('[data-filter-type]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-title]'));
    var empty = document.querySelector('[data-empty-state]');
    var keyword = input ? input.value.trim().toLowerCase() : '';
    var categoryValue = category ? category.value : '';
    var yearValue = year ? year.value : '';
    var regionValue = region ? region.value : '';
    var typeValue = type ? type.value : '';
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = (card.getAttribute('data-title') || '').toLowerCase();
      var cardCategory = card.getAttribute('data-category') || '';
      var cardYear = card.getAttribute('data-year') || '';
      var cardRegion = card.getAttribute('data-region') || '';
      var cardType = card.getAttribute('data-type') || '';
      var matched = true;

      if (keyword && haystack.indexOf(keyword) === -1) {
        matched = false;
      }

      if (categoryValue && cardCategory !== categoryValue) {
        matched = false;
      }

      if (yearValue && cardYear !== yearValue) {
        matched = false;
      }

      if (regionValue && cardRegion !== regionValue) {
        matched = false;
      }

      if (typeValue && cardType !== typeValue) {
        matched = false;
      }

      card.classList.toggle('hidden-card', !matched);

      if (matched) {
        visible += 1;
      }
    });

    if (empty) {
      empty.classList.toggle('show', visible === 0);
    }
  }

  ['input', 'change'].forEach(function (eventName) {
    document.addEventListener(eventName, function (event) {
      if (event.target.matches('[data-filter-input], [data-filter-category], [data-filter-year], [data-filter-region], [data-filter-type]')) {
        applyFilter();
      }
    });
  });

  Array.prototype.slice.call(document.querySelectorAll('[data-video-player]')).forEach(function (shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('.big-play');
    var overlay = shell.querySelector('.player-overlay');
    var source = shell.getAttribute('data-video-src');
    var loaded = false;

    function hideOverlay() {
      if (overlay) {
        overlay.classList.add('hidden');
      }
    }

    function loadAndPlay() {
      if (!video || !source) {
        return;
      }

      if (!loaded) {
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({ enableWorker: true });
          hls.loadSource(source);
          hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else {
          video.src = source;
        }

        loaded = true;
      }

      hideOverlay();
      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          if (video.controls) {
            video.focus();
          }
        });
      }
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        loadAndPlay();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', loadAndPlay);
    }

    if (video) {
      video.addEventListener('play', hideOverlay);
    }
  });
})();
