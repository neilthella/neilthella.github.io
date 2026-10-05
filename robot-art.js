// Animated illustrations for the Robotics Camp modules list. Each
// <div class="module-art" data-art="NAME"> is filled with an inline SVG:
//   assemble - scattered parts fly together into the robot once scrolled into view
//   drive    - side-view robot driving forward forever
//   sense    - same robot shuttling between a wall (ultrasonic) and a bumper (touch)
//              while a light sensor reads the line below
//   gears    - meshing, turning gears
//   trophy   - twinkling trophy
// Animations live in styles.css (classes starting with "ra-").
(function () {
  var W = 220;
  var H = 170;

  function svgWrap(cls, inner, defs) {
    return (
      '<svg class="ra-svg ' + cls + '" viewBox="0 0 ' + W + " " + H + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      (defs ? "<defs>" + defs + "</defs>" : "") +
      inner +
      "</svg>"
    );
  }

  // ---- robot parts, in robot-local coordinates (wheel bottom at y = 43) ----
  var WHEEL = { x: -8, y: 26, r: 17 };
  var CASTER = { x: 36, y: 27 };

  var parts = {
    chassis:
      '<rect x="-42" y="8" width="84" height="14" rx="3" fill="#5f6670" stroke="#3f444b" stroke-width="1.5"/>' +
      '<circle cx="-28" cy="15" r="2.4" fill="#c9ccd1"/><circle cx="0" cy="15" r="2.4" fill="#c9ccd1"/><circle cx="28" cy="15" r="2.4" fill="#c9ccd1"/>',
    brick:
      '<rect x="-30" y="-22" width="60" height="30" rx="5" fill="#dcdcdc" stroke="#7a7a7a" stroke-width="1.5"/>' +
      '<rect x="-24" y="-15" width="26" height="12" rx="2" fill="#4b5563"/>' +
      '<rect x="-21" y="-12" width="12" height="3" rx="1" fill="#9aa7b4"/>' +
      '<rect x="-24" y="-27" width="7" height="5" rx="1" fill="#555"/><rect x="-14" y="-27" width="7" height="5" rx="1" fill="#555"/>' +
      '<rect x="-4" y="-27" width="7" height="5" rx="1" fill="#555"/><rect x="6" y="-27" width="7" height="5" rx="1" fill="#555"/>' +
      '<circle cx="14" cy="-13" r="2.6" fill="#a9adb3"/><circle cx="21" cy="-13" r="2.6" fill="#a9adb3"/>' +
      '<circle cx="14" cy="-5" r="2.6" fill="#a9adb3"/><circle cx="21" cy="-5" r="2.6" fill="#a9adb3"/>',
    wheel: function (spinClass) {
      return (
        '<g class="' + spinClass + '" style="transform-origin:' + WHEEL.x + "px " + WHEEL.y + 'px">' +
        '<g transform="translate(' + WHEEL.x + "," + WHEEL.y + ')">' +
        '<circle r="17" fill="#2b2b2b"/><circle r="10.5" fill="#d3d3d3" stroke="#888" stroke-width="1"/>' +
        '<path d="M0,-9 V9 M-7.8,-4.5 L7.8,4.5 M-7.8,4.5 L7.8,-4.5" stroke="#8a8a8a" stroke-width="1.6" stroke-linecap="round"/>' +
        '<circle r="3" fill="#555"/>' +
        "</g></g>"
      );
    },
    caster:
      '<circle cx="' + CASTER.x + '" cy="' + CASTER.y + '" r="6" fill="#cfd2d6" stroke="#7a7a7a" stroke-width="1.3"/>' +
      '<path d="M' + CASTER.x + ',22 V' + (CASTER.y - 6) + '" stroke="#7a7a7a" stroke-width="2"/>',
    ultrasonic:
      '<rect x="42" y="-3" width="14" height="19" rx="3.5" fill="#1f1f1f" stroke="#000" stroke-width="1"/>' +
      '<circle cx="51" cy="2.5" r="3.4" fill="#2b2b2b" stroke="#c0392b" stroke-width="1.7"/>' +
      '<circle cx="51" cy="11" r="3.4" fill="#2b2b2b" stroke="#c0392b" stroke-width="1.7"/>',
    arm:
      '<rect x="-46" y="-34" width="7" height="46" rx="2" fill="#f0f0f0" stroke="#9a9a9a" stroke-width="1.3"/>' +
      '<rect x="-52" y="-34" width="17" height="6" rx="2" fill="#f0f0f0" stroke="#9a9a9a" stroke-width="1.3"/>' +
      '<circle cx="-42.5" cy="6" r="1.8" fill="#9a9a9a"/>',
    light:
      '<polygon points="17,34 23,34 30,43 10,43" fill="rgba(220,60,50,0.28)"/>' +
      '<rect x="13" y="22" width="14" height="12" rx="2" fill="#dcdcdc" stroke="#777" stroke-width="1.3"/>' +
      '<ellipse cx="20" cy="33" rx="4.5" ry="1.8" fill="#2b2b2b" stroke="#c0392b" stroke-width="1.4"/>',
    touch:
      '<rect x="-52" y="5" width="10" height="14" rx="2" fill="#dcdcdc" stroke="#777" stroke-width="1.3"/>' +
      '<rect x="-58" y="9" width="7" height="6" rx="1" fill="#c0392b" stroke="#8e2a20" stroke-width="1"/>'
  };

  // A part that starts scattered (--tx/--ty/--rot) and flies to place when the
  // svg gets the "ra-assembled" class. (ox, oy) is the part's rotation center.
  function flyPart(inner, tx, ty, rot, ox, oy, delay) {
    return (
      '<g class="ra-part" style="--tx:' + tx + "px;--ty:" + ty + "px;--rot:" + rot + "deg;--d:" + delay + "s;transform-origin:" + ox + "px " + oy + 'px">' +
      inner + "</g>"
    );
  }

  var floorLine = function (y) {
    return '<rect x="14" y="' + y + '" width="192" height="3" rx="1.5" fill="#bdb9ae"/>';
  };

  // ---- 1: assemble ----
  function assemble() {
    var inner =
      floorLine(138) +
      '<g transform="translate(110,95)">' +
      flyPart(parts.chassis, 40, 38, 12, 0, 15, 0.1) +
      flyPart(parts.wheel(""), 58, -22, 90, WHEEL.x, WHEEL.y, 0.2) +
      flyPart(parts.caster, -46, 22, 0, CASTER.x, CASTER.y, 0.3) +
      flyPart(parts.brick, -48, -40, -18, 0, -7, 0) +
      flyPart(parts.ultrasonic, -55, -52, 25, 49, 6.5, 0.15) +
      flyPart(parts.arm, 92, -38, 40, -44, -14, 0.25) +
      "</g>";
    return svgWrap("ra-assemble", inner);
  }

  // ---- 2: drive ----
  function drive() {
    var dashes = "";
    for (var x = -40; x < W + 40; x += 40) {
      dashes += '<rect x="' + x + '" y="138" width="22" height="4" rx="2" fill="#c4c2bb"/>';
    }
    var speed =
      '<g class="ra-speed" stroke="#c9c6bd" stroke-width="2.5" stroke-linecap="round">' +
      '<line x1="22" y1="82" x2="44" y2="82"/><line x1="12" y1="98" x2="40" y2="98"/><line x1="26" y1="114" x2="46" y2="114"/>' +
      "</g>";
    var inner =
      '<rect x="0" y="128" width="' + W + '" height="3" fill="#8a8a85"/>' +
      '<g class="ra-ground">' + dashes + "</g>" +
      speed +
      '<g transform="translate(112,85)">' +
      parts.chassis + parts.wheel("ra-spin") + parts.caster + parts.brick +
      "</g>";
    return svgWrap("ra-drive", inner);
  }

  // ---- 3: sense ----
  function sense() {
    var waves =
      '<g stroke="#4a8fc7" stroke-width="2.4" fill="none" stroke-linecap="round">' +
      '<path class="ra-ping ra-ping-1" d="M60,0 Q64,6.5 60,13"/>' +
      '<path class="ra-ping ra-ping-2" d="M66,-4 Q72,6.5 66,17"/>' +
      '<path class="ra-ping ra-ping-3" d="M72,-8 Q80,6.5 72,21"/>' +
      "</g>";
    var wall = function (x) {
      return '<rect x="' + x + '" y="62" width="8" height="66" rx="1.5" fill="#bdb8ac" stroke="#8d887b" stroke-width="1.2"/>';
    };
    var inner =
      wall(10) + wall(198) +
      '<rect x="18" y="128" width="180" height="5" fill="#1f1f1f"/>' +
      '<rect x="18" y="133" width="180" height="9" fill="#e6e2d9"/>' +
      '<g transform="translate(76,85)"><g class="ra-shuttle">' +
      parts.chassis + parts.touch + parts.wheel("ra-wheel-shuttle") + parts.caster + parts.light + parts.brick + parts.ultrasonic + waves +
      "</g></g>";
    return svgWrap("ra-sense", inner);
  }

  // ---- 4: gears ----
  function gearPath(cx, cy, R, r, n, phase) {
    var step = 360 / n;
    var pts = [];
    for (var i = 0; i < n; i++) {
      var a = phase + i * step;
      [[r, -0.46], [R, -0.2], [R, 0.2], [r, 0.46]].forEach(function (p) {
        var ang = ((a + p[1] * step) * Math.PI) / 180;
        pts.push((cx + p[0] * Math.cos(ang)).toFixed(1) + "," + (cy + p[0] * Math.sin(ang)).toFixed(1));
      });
    }
    return pts.join(" ");
  }

  function gears() {
    var R = 24;
    var r = 19;
    var n = 10;
    var colors = ["#1f5fae", "#3a9a3f", "#d8392b", "#f08a24", "#4ea3e0"];
    var icons = [
      // magnifier
      '<circle cx="-1.5" cy="-1.5" r="4.6" fill="none" stroke="#1f5fae" stroke-width="2"/><path d="M2,2 L6.5,6.5" stroke="#1f5fae" stroke-width="2.2" stroke-linecap="round"/>',
      // bulb
      '<circle cx="0" cy="-2" r="4.6" fill="none" stroke="#3a9a3f" stroke-width="2"/><path d="M-2.4,4 H2.4 M-1.6,6.6 H1.6" stroke="#3a9a3f" stroke-width="1.8" stroke-linecap="round"/>',
      // globe
      '<circle r="6" fill="none" stroke="#d8392b" stroke-width="1.8"/><ellipse rx="2.6" ry="6" fill="none" stroke="#d8392b" stroke-width="1.4"/><path d="M-6,0 H6" stroke="#d8392b" stroke-width="1.4"/>',
      // handshake (two clasped bars)
      '<rect x="-7" y="-2.5" width="9" height="4.6" rx="2.2" transform="rotate(-18)" fill="#f08a24"/><rect x="-2" y="-2" width="9" height="4.6" rx="2.2" transform="rotate(18)" fill="#f08a24" opacity="0.8"/>',
      // people
      '<circle cx="0" cy="-3.5" r="2.5" fill="#4ea3e0"/><path d="M-4.6,5 Q0,-1.6 4.6,5 Z" fill="#4ea3e0"/><circle cx="-6" cy="-1.5" r="1.8" fill="#4ea3e0"/><circle cx="6" cy="-1.5" r="1.8" fill="#4ea3e0"/>'
    ];
    var centers = [[28, 70], [68, 86], [108, 70], [148, 86], [188, 70]];

    var phase = 0;
    var body = "";
    var statics = "";
    for (var i = 0; i < centers.length; i++) {
      var cx = centers[i][0];
      var cy = centers[i][1];
      body +=
        '<g class="' + (i % 2 === 0 ? "ra-gear-cw" : "ra-gear-ccw") + '" style="transform-origin:' + cx + "px " + cy + 'px">' +
        '<polygon points="' + gearPath(cx, cy, R, r, n, phase) + '" fill="' + colors[i] + '" stroke="rgba(0,0,0,0.18)" stroke-width="1" stroke-linejoin="round"/>' +
        "</g>";
      statics +=
        '<circle cx="' + cx + '" cy="' + cy + '" r="13" fill="#fff"/>' +
        '<g transform="translate(' + cx + "," + cy + ')">' + icons[i] + "</g>";
      if (i < centers.length - 1) {
        var alpha = (Math.atan2(centers[i + 1][1] - cy, centers[i + 1][0] - cx) * 180) / Math.PI;
        phase = (((2 * alpha + 162 - phase) % 36) + 36) % 36;
      }
    }

    var arrow = function (d, color, id) {
      return '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="1.8" stroke-linecap="round" marker-end="url(#ra-ah-' + id + ')"/>';
    };
    var marker = function (id, color) {
      return '<marker id="ra-ah-' + id + '" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" fill="' + color + '"/></marker>';
    };
    var defs = marker("b", "#1f5fae") + marker("r", "#d8392b") + marker("l", "#4ea3e0");
    var arrows =
      arrow("M24,40 Q48,14 82,34", "#1f5fae", "b") +
      arrow("M104,40 Q128,14 162,34", "#d8392b", "r") +
      arrow("M70,126 Q108,152 150,128", "#4ea3e0", "l");
    return svgWrap("ra-gears", arrows + body + statics, defs);
  }

  // ---- 5 / F: trophy ----
  function trophy() {
    var sparkle = function (x, y, delay, s) {
      return (
        '<g transform="translate(' + x + "," + y + ") scale(" + s + ')">' +
        '<path class="ra-twinkle" style="animation-delay:' + delay + 's" d="M0,-7 L1.6,-1.6 L7,0 L1.6,1.6 L0,7 L-1.6,1.6 L-7,0 L-1.6,-1.6 Z" fill="#f6c945"/>' +
        "</g>"
      );
    };
    var confetti = "";
    var cols = ["#1f5fae", "#3a9a3f", "#d8392b", "#f08a24", "#4ea3e0", "#d8392b"];
    var xs = [20, 48, 84, 138, 172, 200];
    for (var i = 0; i < xs.length; i++) {
      confetti +=
        '<rect class="ra-confetti" x="' + xs[i] + '" y="0" width="5" height="8" rx="1" fill="' + cols[i] + '" ' +
        'style="transform-origin:' + (xs[i] + 2.5) + "px 4px;--fd:" + (4.2 + (i % 3) * 0.9) + "s;--dl:-" + i * 0.8 + 's"/>';
    }
    var defs =
      '<linearGradient id="ra-gold" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#fbe27a"/><stop offset="0.5" stop-color="#eab12a"/><stop offset="1" stop-color="#b97d0e"/></linearGradient>';
    var cup =
      '<g class="ra-bob">' +
      '<path d="M70,48 C46,46 46,80 74,84" fill="none" stroke="url(#ra-gold)" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M150,48 C174,46 174,80 146,84" fill="none" stroke="url(#ra-gold)" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M68,38 H152 C152,78 136,98 110,102 C84,98 68,78 68,38 Z" fill="url(#ra-gold)" stroke="#a8730d" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M78,46 C78,72 88,86 100,92" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="4" stroke-linecap="round"/>' +
      '<polygon points="110,52 114.2,62.2 125,63 116.8,70 119.4,80.5 110,74.8 100.6,80.5 103.2,70 95,63 105.8,62.2" fill="#fff3b0" stroke="#c9961a" stroke-width="1.3" stroke-linejoin="round"/>' +
      '<rect x="102" y="101" width="16" height="20" fill="url(#ra-gold)" stroke="#a8730d" stroke-width="1.5"/>' +
      '<rect x="82" y="119" width="56" height="10" rx="2.5" fill="url(#ra-gold)" stroke="#a8730d" stroke-width="1.5"/>' +
      '<rect x="72" y="128" width="76" height="14" rx="3" fill="#7a4a1e" stroke="#4d2d10" stroke-width="1.5"/>' +
      '<rect x="96" y="132" width="28" height="6" rx="1.5" fill="#e9c46a"/>' +
      "</g>";
    return svgWrap("ra-trophy", confetti + cup + sparkle(48, 34, "0s", 1) + sparkle(176, 40, "0.5s", 0.85) + sparkle(158, 18, "1s", 0.7) + sparkle(38, 92, "1.4s", 0.75) + sparkle(190, 100, "0.8s", 0.6), defs);
  }

  var builders = { assemble: assemble, drive: drive, sense: sense, gears: gears, trophy: trophy };

  var targets = document.querySelectorAll(".module-art[data-art]");
  for (var t = 0; t < targets.length; t++) {
    var build = builders[targets[t].getAttribute("data-art")];
    if (build) targets[t].innerHTML = build();
  }

  // The robot assembles once its illustration scrolls above ~72% of the
  // viewport, and scatters again if you scroll back up past that point.
  var assembling = document.querySelectorAll('.module-art[data-art="assemble"] .ra-svg');
  function checkAssemble() {
    for (var a = 0; a < assembling.length; a++) {
      var top = assembling[a].getBoundingClientRect().top;
      assembling[a].classList.toggle("ra-assembled", top < window.innerHeight * 0.72);
    }
  }
  if (assembling.length) {
    window.addEventListener("scroll", checkAssemble, { passive: true });
    window.addEventListener("resize", checkAssemble);
    checkAssemble();
  }
})();
