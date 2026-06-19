(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  document.querySelectorAll("[data-hero-slider]").forEach(function (slider) {
    const slides = Array.from(slider.querySelectorAll(".hero-slide"));
    const dots = Array.from(slider.querySelectorAll(".hero-dot"));
    const prev = slider.querySelector(".hero-prev");
    const next = slider.querySelector(".hero-next");
    let index = 0;
    let timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle("active", itemIndex === index);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle("active", itemIndex === index);
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

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.dataset.slide || 0));
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    show(0);
    start();
  });

  document.querySelectorAll(".movie-list-section").forEach(function (section) {
    const search = section.querySelector(".movie-search");
    const cards = Array.from(section.querySelectorAll(".movie-card"));
    const chips = Array.from(section.querySelectorAll(".filter-chip"));
    const empty = section.querySelector(".empty-state");
    const filters = {};

    function normalize(value) {
      return String(value || "")
        .toLowerCase()
        .trim();
    }

    function update() {
      const query = normalize(search ? search.value : "");
      let visibleCount = 0;

      cards.forEach(function (card) {
        const haystack = normalize(
          [
            card.dataset.title,
            card.dataset.tags,
            card.dataset.region,
            card.dataset.type,
            card.dataset.channel,
            card.dataset.year,
          ].join(" "),
        );
        let matched = !query || haystack.indexOf(query) !== -1;

        Object.keys(filters).forEach(function (field) {
          const value = filters[field];
          if (value && value !== "all") {
            matched =
              matched && normalize(card.dataset[field]) === normalize(value);
          }
        });

        card.style.display = matched ? "" : "none";
        if (matched) {
          visibleCount += 1;
        }
      });

      if (empty) {
        empty.style.display = visibleCount === 0 ? "block" : "none";
      }
    }

    if (search) {
      search.addEventListener("input", update);
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        const field = chip.dataset.filterField || "channel";
        filters[field] = chip.dataset.filter || "all";
        chips
          .filter(function (item) {
            return (item.dataset.filterField || "channel") === field;
          })
          .forEach(function (item) {
            item.classList.toggle("active", item === chip);
          });
        update();
      });
    });

    update();
  });
})();

function initPlayer(url) {
  const video = document.getElementById("movie-player");
  const overlay = document.querySelector(".player-overlay");

  if (!video || !url) {
    return;
  }

  let hls = null;

  function attach() {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(url);
      hls.attachMedia(video);
      return;
    }

    video.src = url;
  }

  function play() {
    if (!video.src && !(hls && hls.media)) {
      attach();
    }

    if (overlay) {
      overlay.classList.add("hidden");
    }

    const started = video.play();
    if (started && typeof started.catch === "function") {
      started.catch(function () {
        if (overlay) {
          overlay.classList.remove("hidden");
        }
      });
    }
  }

  attach();

  if (overlay) {
    overlay.addEventListener("click", play);
  }

  document.querySelectorAll(".detail-watch").forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      const playerBlock = document.getElementById("player");
      if (playerBlock) {
        playerBlock.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      play();
    });
  });

  video.addEventListener("play", function () {
    if (overlay) {
      overlay.classList.add("hidden");
    }
  });

  video.addEventListener("pause", function () {
    if (overlay && video.currentTime === 0) {
      overlay.classList.remove("hidden");
    }
  });
}
