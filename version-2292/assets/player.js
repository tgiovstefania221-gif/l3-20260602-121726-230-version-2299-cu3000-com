(function () {
  function setupPlayer(wrapper) {
    var video = wrapper.querySelector('video');
    var trigger = wrapper.querySelector('.player-trigger');
    var message = wrapper.parentElement.querySelector('.player-message');
    var hls = null;
    var initialized = false;

    function setMessage(text) {
      if (message) {
        message.textContent = text || '';
      }
    }

    function initialize() {
      if (initialized || !video) {
        return;
      }

      var source = video.getAttribute('data-src');
      initialized = true;

      if (!source) {
        setMessage('视频暂时不可用');
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (!data || !data.fatal) {
            return;
          }
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            setMessage('视频加载中，请稍候');
            hls.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            setMessage('视频正在恢复，请稍候');
            hls.recoverMediaError();
          } else {
            setMessage('视频暂时不可用');
            hls.destroy();
          }
        });
        return;
      }

      video.src = source;
    }

    function play() {
      initialize();
      if (!video) {
        return;
      }
      var action = video.play();
      if (action && typeof action.catch === 'function') {
        action.catch(function () {
          setMessage('点击视频区域继续播放');
        });
      }
    }

    if (trigger) {
      trigger.addEventListener('click', function () {
        play();
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });
      video.addEventListener('play', function () {
        if (trigger) {
          trigger.classList.add('is-hidden');
        }
        setMessage('');
      });
      video.addEventListener('pause', function () {
        if (trigger) {
          trigger.classList.remove('is-hidden');
        }
      });
      video.addEventListener('ended', function () {
        if (trigger) {
          trigger.classList.remove('is-hidden');
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  document.querySelectorAll('.player-box').forEach(setupPlayer);
})();
