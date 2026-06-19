(function () {
    var toggle = document.querySelector('.menu-toggle');
    var panel = document.querySelector('.mobile-panel');
    if (toggle && panel) {
        toggle.addEventListener('click', function () {
            panel.classList.toggle('open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    if (slides.length) {
        var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
        var index = 0;
        var show = function (next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === index);
            });
        };
        var prev = document.querySelector('.hero-prev');
        var next = document.querySelector('.hero-next');
        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
            });
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
            });
        });
        window.setInterval(function () {
            show(index + 1);
        }, 5200);
    }

    var grid = document.querySelector('[data-filter-grid]');
    if (grid) {
        var input = document.querySelector('[data-page-search]');
        var chips = Array.prototype.slice.call(document.querySelectorAll('[data-filter-chip]'));
        var select = document.querySelector('[data-year-select]');
        var noResult = document.querySelector('.no-result');
        var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-title]'));
        var apply = function () {
            var query = input ? input.value.trim().toLowerCase() : '';
            var activeChip = document.querySelector('[data-filter-chip].active');
            var filter = activeChip ? activeChip.getAttribute('data-filter-chip') : 'all';
            var year = select ? select.value : 'all';
            var count = 0;
            cards.forEach(function (card) {
                var text = [card.getAttribute('data-title'), card.getAttribute('data-genre'), card.getAttribute('data-region'), card.getAttribute('data-category'), card.getAttribute('data-year')].join(' ').toLowerCase();
                var okQuery = !query || text.indexOf(query) !== -1;
                var okFilter = filter === 'all' || text.indexOf(filter.toLowerCase()) !== -1;
                var okYear = year === 'all' || card.getAttribute('data-year') === year;
                var ok = okQuery && okFilter && okYear;
                card.style.display = ok ? '' : 'none';
                if (ok) {
                    count += 1;
                }
            });
            if (noResult) {
                noResult.style.display = count ? 'none' : 'block';
            }
        };
        if (input) {
            var params = new URLSearchParams(window.location.search);
            var q = params.get('q');
            if (q) {
                input.value = q;
            }
            input.addEventListener('input', apply);
        }
        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                chips.forEach(function (item) {
                    item.classList.remove('active');
                });
                chip.classList.add('active');
                apply();
            });
        });
        if (select) {
            select.addEventListener('change', apply);
        }
        apply();
    }

    var shell = document.querySelector('.video-shell');
    if (shell) {
        var video = shell.querySelector('video');
        var start = shell.querySelector('.play-cover');
        if (video) {
            var url = video.getAttribute('data-src');
            if (url) {
                if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                    hls.loadSource(url);
                    hls.attachMedia(video);
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = url;
                } else {
                    video.src = url;
                }
            }
            var play = function () {
                shell.classList.add('is-playing');
                var run = video.play();
                if (run && run.catch) {
                    run.catch(function () {});
                }
            };
            if (start) {
                start.addEventListener('click', play);
            }
            video.addEventListener('play', function () {
                shell.classList.add('is-playing');
            });
            video.addEventListener('pause', function () {
                if (!video.ended) {
                    shell.classList.remove('is-playing');
                }
            });
        }
    }
})();
