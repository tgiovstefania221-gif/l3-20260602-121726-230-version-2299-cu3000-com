(function(){
var menuButtons=document.querySelectorAll('[data-menu-btn]');
menuButtons.forEach(function(btn){btn.addEventListener('click',function(){var target=document.querySelector(btn.getAttribute('data-menu-btn'));if(target){target.classList.toggle('open');}})});
var slides=document.querySelectorAll('[data-hero-slide]');
var dots=document.querySelectorAll('[data-hero-dot]');
if(slides.length){var current=0;function show(i){slides[current].classList.remove('active');if(dots[current])dots[current].classList.remove('active');current=(i+slides.length)%slides.length;slides[current].classList.add('active');if(dots[current])dots[current].classList.add('active')}dots.forEach(function(dot,i){dot.addEventListener('click',function(){show(i)})});setInterval(function(){show(current+1)},5600)}
function norm(v){return (v||'').toString().toLowerCase().trim()}
var input=document.querySelector('[data-filter-input]');
var region=document.querySelector('[data-filter-region]');
var year=document.querySelector('[data-filter-year]');
var type=document.querySelector('[data-filter-type]');
var empty=document.querySelector('[data-empty]');
var cards=document.querySelectorAll('[data-card]');
function applyFilter(){var q=norm(input&&input.value),r=norm(region&&region.value),y=norm(year&&year.value),t=norm(type&&type.value),shown=0;cards.forEach(function(card){var text=norm(card.getAttribute('data-search')),ok=true;if(q&&text.indexOf(q)<0)ok=false;if(r&&norm(card.getAttribute('data-region'))!==r)ok=false;if(y&&norm(card.getAttribute('data-year'))!==y)ok=false;if(t&&norm(card.getAttribute('data-type'))!==t)ok=false;card.style.display=ok?'':'none';if(ok)shown++});if(empty){empty.classList.toggle('hidden',shown!==0)}}
[input,region,year,type].forEach(function(el){if(el){el.addEventListener('input',applyFilter);el.addEventListener('change',applyFilter)}});
document.querySelectorAll('[data-player]').forEach(function(box){var video=box.querySelector('video');var button=box.querySelector('[data-play]');var url=video&&video.getAttribute('data-m3u8');var ready=false;function play(){if(!video||!url)return;if(!ready){if(window.Hls&&window.Hls.isSupported()){var hls=new window.Hls({maxBufferLength:30});hls.loadSource(url);hls.attachMedia(video);hls.on(window.Hls.Events.MANIFEST_PARSED,function(){video.play().catch(function(){})})}else{video.src=url;video.play().catch(function(){})}ready=true}else{video.play().catch(function(){})}box.classList.add('is-playing')}if(button){button.addEventListener('click',play)}if(video){video.addEventListener('play',function(){box.classList.add('is-playing')});video.addEventListener('pause',function(){if(video.currentTime===0){box.classList.remove('is-playing')}})}});
})();