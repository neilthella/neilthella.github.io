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
//
// By default each image fades out to nothing and then the next fades in. Pass
// { crossfade: true } as a 4th argument to fade the next image in over the
// current one instead, with no blank moment in between. In that mode the first
// image also appears instantly (no fade-in) as soon as it has loaded.

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function renderSlideshow(elId, images, intervalMs, options) {
  var el = document.getElementById(elId);
  if (!el || !images || !images.length) return;
  images = shuffle(images.slice());
  intervalMs = intervalMs || 5000;
  var crossfade = !!(options && options.crossfade);
  var fadeMs = crossfade ? 1000 : 600;
  var transition = "opacity " + fadeMs / 1000 + "s ease";

  function makeLayer() {
    var layer = document.createElement("img");
    layer.alt = "";
    layer.style.opacity = "0";
    layer.style.transition = transition;
    el.appendChild(layer);
    return layer;
  }

  var img = makeLayer();
  var back = crossfade ? makeLayer() : null;

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

  function show(k, instant) {
    current = k;
    img.src = images[k];
    if (instant) {
      img.style.transition = "none";
      img.style.opacity = "1";
      void img.offsetWidth;
      img.style.transition = transition;
    } else {
      img.style.opacity = "1";
    }
  }

  // Fades the next image in on top of the current one, then clears the old
  // layer so the two never dip through the background mid-fade.
  function crossfadeTo(k) {
    var outgoing = img;
    var incoming = back;
    current = k;
    incoming.style.zIndex = "2";
    outgoing.style.zIndex = "1";
    incoming.src = images[k];
    incoming.style.opacity = "1";
    img = incoming;
    back = outgoing;
    setTimeout(function () {
      outgoing.style.transition = "none";
      outgoing.style.opacity = "0";
      void outgoing.offsetWidth;
      outgoing.style.transition = transition;
    }, fadeMs);
  }

  function advance() {
    var k = nextLoadedIndex();
    if (k === current) return;
    if (crossfade) {
      crossfadeTo(k);
      return;
    }
    img.style.opacity = "0";
    setTimeout(function () {
      show(k);
    }, fadeMs);
  }

  function start(k) {
    if (started) return;
    started = true;
    show(k, crossfade);
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
