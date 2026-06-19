(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var menuButton = document.querySelector("[data-menu-button]");
        var nav = document.querySelector("[data-nav]");

        if (menuButton && nav) {
            menuButton.addEventListener("click", function () {
                nav.classList.toggle("is-open");
            });
        }

        var hero = document.querySelector("[data-hero]");

        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
            var current = 0;
            var timer = null;

            function show(index) {
                if (!slides.length) {
                    return;
                }

                current = (index + slides.length) % slides.length;

                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === current);
                });

                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === current);
                });
            }

            function play() {
                clearInterval(timer);
                timer = setInterval(function () {
                    show(current + 1);
                }, 5200);
            }

            var next = hero.querySelector("[data-hero-next]");
            var prev = hero.querySelector("[data-hero-prev]");

            if (next) {
                next.addEventListener("click", function () {
                    show(current + 1);
                    play();
                });
            }

            if (prev) {
                prev.addEventListener("click", function () {
                    show(current - 1);
                    play();
                });
            }

            dots.forEach(function (dot) {
                dot.addEventListener("click", function () {
                    show(Number(dot.getAttribute("data-hero-dot")));
                    play();
                });
            });

            show(0);
            play();
        }

        Array.prototype.slice.call(document.querySelectorAll("[data-filter-input]")).forEach(function (input) {
            var targetSelector = input.getAttribute("data-filter-target");
            var root = targetSelector ? document.querySelector(targetSelector) : document;
            var cards = root ? Array.prototype.slice.call(root.querySelectorAll("[data-card]")) : [];

            input.addEventListener("input", function () {
                var value = input.value.trim().toLowerCase();

                cards.forEach(function (card) {
                    var haystack = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
                    card.classList.toggle("is-hidden", value && haystack.indexOf(value) === -1);
                });
            });
        });
    });

    window.startMoviePlayer = function (videoId, overlayId, source) {
        var video = document.getElementById(videoId);
        var overlay = document.getElementById(overlayId);
        var started = false;
        var hls = null;

        if (!video || !overlay || !source) {
            return;
        }

        function activate() {
            if (started) {
                video.play().catch(function () {});
                return;
            }

            started = true;
            overlay.classList.add("is-hidden");

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }

            video.play().catch(function () {});
        }

        overlay.addEventListener("click", activate);
        video.addEventListener("click", function () {
            if (!started) {
                activate();
            }
        });

        window.addEventListener("pagehide", function () {
            if (hls) {
                hls.destroy();
            }
        });
    };
})();
