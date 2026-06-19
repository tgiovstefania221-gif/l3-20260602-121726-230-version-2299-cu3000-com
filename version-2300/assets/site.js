(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupMobileMenu() {
        var button = document.querySelector("[data-mobile-menu]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            var open = nav.classList.toggle("is-open");
            button.setAttribute("aria-expanded", String(open));
        });
    }

    function setupHeroCarousel() {
        var carousel = document.querySelector("[data-hero-carousel]");
        if (!carousel) {
            return;
        }
        var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
        if (slides.length < 2) {
            return;
        }
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, position) {
                slide.classList.toggle("is-active", position === index);
            });
            dots.forEach(function (dot, position) {
                dot.classList.toggle("is-active", position === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, position) {
            dot.addEventListener("click", function () {
                show(position);
                start();
            });
        });

        carousel.addEventListener("mouseenter", stop);
        carousel.addEventListener("mouseleave", start);
        start();
    }

    function setupFiltering() {
        var list = document.querySelector("[data-filter-list]");
        if (!list) {
            return;
        }
        var input = document.querySelector(".site-search-input");
        var sort = document.querySelector(".site-sort-select");
        var count = document.querySelector("[data-result-count]");
        var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
        var initialOrder = cards.slice();

        function normalize(text) {
            return String(text || "").toLowerCase().replace(/\s+/g, " ").trim();
        }

        function applySort() {
            var value = sort ? sort.value : "default";
            var ordered = cards.slice();
            if (value === "default") {
                ordered = initialOrder.slice();
            } else if (value === "year-desc") {
                ordered.sort(function (a, b) {
                    return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
                });
            } else if (value === "year-asc") {
                ordered.sort(function (a, b) {
                    return Number(a.dataset.year || 0) - Number(b.dataset.year || 0);
                });
            } else if (value === "score-desc") {
                ordered.sort(function (a, b) {
                    return Number(b.dataset.score || 0) - Number(a.dataset.score || 0);
                });
            }
            ordered.forEach(function (card) {
                list.appendChild(card);
            });
        }

        function applyFilter() {
            var query = normalize(input ? input.value : "");
            var parts = query.split(" ").filter(Boolean);
            var visible = 0;
            cards.forEach(function (card) {
                var haystack = normalize(card.dataset.search || card.textContent);
                var matched = parts.every(function (part) {
                    return haystack.indexOf(part) !== -1;
                });
                card.classList.toggle("is-hidden-by-filter", !matched);
                if (matched) {
                    visible += 1;
                }
            });
            if (count) {
                count.textContent = "显示 " + visible + " 部内容";
            }
        }

        function update() {
            applySort();
            applyFilter();
        }

        if (input) {
            var params = new URLSearchParams(window.location.search);
            var q = params.get("q");
            if (q) {
                input.value = q;
            }
            input.addEventListener("input", applyFilter);
        }
        if (sort) {
            sort.addEventListener("change", update);
        }
        update();
    }

    ready(function () {
        setupMobileMenu();
        setupHeroCarousel();
        setupFiltering();
    });
})();
