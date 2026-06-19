(function () {
  function $(selector, context) {
    return (context || document).querySelector(selector);
  }

  function $all(selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
  }

  var menuButton = $('[data-menu-toggle]');
  var mobileMenu = $('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
  }

  var slides = $all('[data-hero-slide]');
  var dots = $all('[data-hero-dot]');
  var heroIndex = 0;

  function showHeroSlide(index) {
    if (!slides.length) {
      return;
    }

    heroIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === heroIndex);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === heroIndex);
    });
  }

  if (slides.length) {
    showHeroSlide(0);
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showHeroSlide(index);
      });
    });
    window.setInterval(function () {
      showHeroSlide(heroIndex + 1);
    }, 5600);
  }

  function updateFilters(panel) {
    var input = $('[data-filter-input]', panel);
    var year = $('[data-filter-year]', panel);
    var region = $('[data-filter-region]', panel);
    var cards = $all('[data-search-card]');
    var countEl = $('[data-filter-count]', panel);
    var empty = $('[data-empty-result]');

    function normalize(text) {
      return String(text || '').toLowerCase().trim();
    }

    function applyFilter() {
      var keyword = normalize(input && input.value);
      var selectedYear = year ? year.value : '';
      var selectedRegion = region ? region.value : '';
      var count = 0;

      cards.forEach(function (card) {
        var index = normalize(card.getAttribute('data-index'));
        var cardYear = card.getAttribute('data-year') || '';
        var cardRegion = card.getAttribute('data-region') || '';
        var matched = true;

        if (keyword && index.indexOf(keyword) === -1) {
          matched = false;
        }

        if (selectedYear && cardYear !== selectedYear) {
          matched = false;
        }

        if (selectedRegion && cardRegion !== selectedRegion) {
          matched = false;
        }

        card.style.display = matched ? '' : 'none';
        if (matched) {
          count += 1;
        }
      });

      if (countEl) {
        countEl.textContent = count;
      }

      if (empty) {
        empty.classList.toggle('show', count === 0);
      }
    }

    [input, year, region].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');
    if (query && input) {
      input.value = query;
    }

    applyFilter();
  }

  $all('[data-filter-panel]').forEach(updateFilters);

  var hlsLoaderPromise = null;

  function loadHlsLibrary() {
    if (window.Hls) {
      return Promise.resolve(window.Hls);
    }

    if (hlsLoaderPromise) {
      return hlsLoaderPromise;
    }

    hlsLoaderPromise = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
      script.async = true;
      script.onload = function () {
        resolve(window.Hls);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });

    return hlsLoaderPromise;
  }

  function isHlsSource(src) {
    return /\.m3u8(\?|#|$)/i.test(src || '');
  }

  function attachVideoSource(video, src, status) {
    if (!src) {
      if (status) {
        status.textContent = '未检测到可用视频源';
      }
      return Promise.reject(new Error('missing source'));
    }

    if (!isHlsSource(src)) {
      video.src = src;
      if (status) {
        status.textContent = '正在加载视频源';
      }
      return Promise.resolve();
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      if (status) {
        status.textContent = '正在加载 HLS 视频源';
      }
      return Promise.resolve();
    }

    return loadHlsLibrary().then(function (Hls) {
      if (!Hls || !Hls.isSupported()) {
        throw new Error('hls unsupported');
      }

      var hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      if (status) {
        status.textContent = 'HLS 播放源已绑定';
      }
    });
  }

  $all('[data-player]').forEach(function (player) {
    var video = $('video', player);
    var cover = $('[data-player-cover]', player);
    var status = $('[data-player-status]', player);
    var src = player.getAttribute('data-video-src');
    var loaded = false;

    function startPlayback() {
      if (!video) {
        return;
      }

      var ready = loaded ? Promise.resolve() : attachVideoSource(video, src, status);
      loaded = true;

      ready.then(function () {
        if (cover) {
          cover.classList.add('hidden');
        }
        return video.play();
      }).then(function () {
        if (status) {
          status.textContent = '正在播放';
        }
      }).catch(function () {
        if (status) {
          status.textContent = '视频源加载失败或浏览器阻止自动播放，请检查源地址后重试';
        }
        if (cover) {
          cover.classList.remove('hidden');
        }
      });
    }

    if (cover) {
      cover.addEventListener('click', startPlayback);
    }

    if (video) {
      video.addEventListener('play', function () {
        if (cover) {
          cover.classList.add('hidden');
        }
      });
      video.addEventListener('error', function () {
        if (status) {
          status.textContent = '视频源暂时不可用';
        }
      });
    }
  });
})();
