/** AI was used in developing this website, however NO AI was used in the materials. The materials are human-made from trial and error after years of running camps and workshops. **/

// Renders a fading image slideshow into the element with id `elId`.
// `images` is an array of image paths (or data URIs); each is shown for
// `intervalMs` (default 5000) before fading out and the next fading in.
// The box's size/shape is controlled entirely by CSS on #<elId> (see
// .slideshow-box) — images are cropped to fill it via object-fit: cover.
//
// Every image is preloaded up front. The slideshow starts on whichever image
// finishes loading first, and only ever advances to images that are already
// loaded, so a slow image never leaves the previous one stuck on screen.

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function renderSlideshow(elId, images, intervalMs) {
  var el = document.getElementById(elId);
  if (!el || !images || !images.length) return;
  images = shuffle(images.slice());
  intervalMs = intervalMs || 5000;
  var fadeMs = 600;

  var img = document.createElement("img");
  img.alt = "";
  img.style.opacity = "0";
  el.appendChild(img);

  var loaded = [];
  var current = -1;
  var started = false;

  function nextLoadedIndex() {
    for (var step = 1; step <= images.length; step++) {
      var k = (current + step) % images.length;
      if (loaded[k]) return k;
    }
    return current;
  }

  function show(k) {
    current = k;
    img.src = images[k];
    img.style.opacity = "1";
  }

  function advance() {
    var k = nextLoadedIndex();
    if (k === current) return;
    img.style.opacity = "0";
    setTimeout(function () {
      show(k);
    }, fadeMs);
  }

  function start(k) {
    if (started) return;
    started = true;
    show(k);
    if (images.length > 1) setInterval(advance, intervalMs);
  }

  images.forEach(function (src, k) {
    var pre = new Image();
    pre.onload = function () {
      loaded[k] = true;
      start(k);
    };
    pre.src = src;
  });
}
