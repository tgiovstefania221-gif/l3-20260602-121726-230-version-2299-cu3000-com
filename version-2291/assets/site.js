(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var copies = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-copy]'));
        var posters = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-poster]'));
        var thumbs = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-thumb]'));
        var current = 0;

        var activate = function (index) {
            current = index;
            copies.forEach(function (item, position) {
                item.classList.toggle('active', position === index);
            });
            posters.forEach(function (item, position) {
                item.classList.toggle('active', position === index);
            });
            thumbs.forEach(function (item, position) {
                item.classList.toggle('active', position === index);
            });
        };

        thumbs.forEach(function (button, index) {
            button.addEventListener('click', function () {
                activate(index);
            });
        });

        if (copies.length > 1) {
            window.setInterval(function () {
                activate((current + 1) % copies.length);
            }, 5200);
        }
    }

    var keywordFilter = document.getElementById('keywordFilter');
    var yearFilter = document.getElementById('yearFilter');
    var typeFilter = document.getElementById('typeFilter');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card[data-search]'));
    var noResults = document.querySelector('[data-no-results]');

    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q');

    if (initialQuery && keywordFilter) {
        keywordFilter.value = initialQuery;
    }

    var applyFilters = function () {
        var keyword = keywordFilter ? keywordFilter.value.trim().toLowerCase() : '';
        var year = yearFilter ? yearFilter.value : '';
        var type = typeFilter ? typeFilter.value : '';
        var visible = 0;

        cards.forEach(function (card) {
            var text = (card.getAttribute('data-search') || '').toLowerCase();
            var itemYear = card.getAttribute('data-year') || '';
            var itemType = card.getAttribute('data-type') || '';
            var matched = true;

            if (keyword && text.indexOf(keyword) === -1) {
                matched = false;
            }

            if (year && itemYear !== year) {
                matched = false;
            }

            if (type && itemType !== type) {
                matched = false;
            }

            card.classList.toggle('hidden-card', !matched);

            if (matched) {
                visible += 1;
            }
        });

        if (noResults) {
            noResults.classList.toggle('show', visible === 0);
        }
    };

    [keywordFilter, yearFilter, typeFilter].forEach(function (control) {
        if (control) {
            control.addEventListener('input', applyFilters);
            control.addEventListener('change', applyFilters);
        }
    });

    if (cards.length) {
        applyFilters();
    }

    var video = document.querySelector('.movie-player');
    var cover = document.querySelector('[data-player-cover]');
    var playButton = document.querySelector('[data-play-button]');

    if (video && cover && playButton) {
        var source = video.getAttribute('data-stream');
        var ready = false;

        var prepareVideo = function () {
            if (ready || !source) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    maxBufferLength: 30,
                    enableWorker: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }

            ready = true;
        };

        var startVideo = function () {
            prepareVideo();
            cover.classList.add('is-hidden');
            video.controls = true;
            var playPromise = video.play();

            if (playPromise && playPromise.catch) {
                playPromise.catch(function () {});
            }
        };

        cover.addEventListener('click', startVideo);
        playButton.addEventListener('click', startVideo);
        video.addEventListener('click', function () {
            if (!ready || video.paused) {
                startVideo();
            }
        });
    }
})();
