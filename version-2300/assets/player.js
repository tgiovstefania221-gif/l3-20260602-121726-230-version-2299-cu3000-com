import { H as Hls } from "./vendor/hls.js";

function setupPlayers() {
    var players = document.querySelectorAll("[data-player]");
    players.forEach(function (shell) {
        var video = shell.querySelector("video");
        var button = shell.querySelector("[data-play-button]");
        var status = shell.querySelector("[data-player-status]");
        var source = shell.getAttribute("data-video-url");
        var hlsInstance = null;

        function setStatus(text) {
            if (status) {
                status.textContent = text;
            }
        }

        function start() {
            if (!video || !source) {
                setStatus("当前页面没有可用播放源。");
                return;
            }

            if (button) {
                button.classList.add("is-hidden");
            }
            setStatus("正在加载播放源...");

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
                video.play().catch(function () {
                    setStatus("请再次点击播放器开始播放。");
                });
                setStatus("播放源已加载。");
                return;
            }

            if (Hls && Hls.isSupported()) {
                hlsInstance = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
                hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
                    setStatus("播放源已加载。");
                    video.play().catch(function () {
                        setStatus("请再次点击播放器开始播放。");
                    });
                });
                hlsInstance.on(Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        setStatus("播放源加载失败，请稍后重试。");
                    }
                });
                return;
            }

            video.src = source;
            video.play().catch(function () {
                setStatus("当前浏览器可能不支持该播放格式。");
            });
        }

        if (button) {
            button.addEventListener("click", start, { once: true });
        }

        window.addEventListener("pagehide", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
                hlsInstance = null;
            }
        });
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupPlayers);
} else {
    setupPlayers();
}
