// Interactive pair of illustrations in the Circuits modules list: hold the
// button in module 2 and the LED in module 1 lights up, with dotted wires
// running between the two. Styles live in styles.css (classes starting "bt-").
(function () {
  var btnHolder = document.querySelector('.module-art[data-art="button"]');
  var ledHolder = document.querySelector('.module-art[data-art="led"]');
  if (!btnHolder || !ledHolder) return;

  // Button and LED are cropped from the original drawing (images/).
  ledHolder.innerHTML =
    '<svg class="ra-svg bt-svg" viewBox="0 0 220 170" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<defs><radialGradient id="bt-halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ff6a5a" stop-opacity="0.8"/><stop offset="1" stop-color="#ff6a5a" stop-opacity="0"/></radialGradient></defs>' +
    '<circle class="bt-halo" cx="145" cy="47" r="52" fill="url(#bt-halo)"/>' +
    '<image class="bt-led" href="images/circuits-module-1.png" x="2" y="14" width="216" height="105"/>' +
    "</svg>";

  btnHolder.innerHTML =
    '<svg class="ra-svg bt-svg" viewBox="0 0 220 170" xmlns="http://www.w3.org/2000/svg">' +
    '<g class="bt-hint" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="3">' +
    '<path d="M100,30 L110,40 L120,30" stroke="#9a9a9a"/><path d="M100,20 L110,30 L120,20" stroke="#c4c4c4"/></g>' +
    '<g class="bt-button" tabindex="0" role="button" aria-label="Push button: hold it to light the LED in the module above">' +
    '<rect x="70" y="64" width="80" height="94" fill="transparent"/>' +
    '<image class="bt-btn-img" href="images/circuits-button.png" x="80" y="70" width="60" height="76"/>' +
    "</g></svg>";

  var btnSvg = btnHolder.querySelector("svg");
  var ledSvg = ledHolder.querySelector("svg");
  var button = btnSvg.querySelector(".bt-button");

  // Dotted wires drawn over the whole list, from the button's legs up to the LED's legs.
  var list = btnHolder.closest(".module-list");
  var link = null;
  if (list) {
    list.style.position = "relative";
    link = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    link.setAttribute("class", "bt-link");
    link.setAttribute("aria-hidden", "true");
    list.appendChild(link);
  }

  function anchor(svg, x, y) {
    var r = svg.getBoundingClientRect();
    var lr = list.getBoundingClientRect();
    var s = r.width / 220;
    return { x: r.left - lr.left + x * s, y: r.top - lr.top + y * s };
  }

  function drawLink() {
    if (!link) return;
    var lr = list.getBoundingClientRect();
    link.setAttribute("width", lr.width);
    link.setAttribute("height", lr.height);
    var top = anchor(btnSvg, 131, 74);
    var bottom = anchor(btnSvg, 131, 150);
    var leftTip = anchor(ledSvg, 12, 105);
    var rightTip = anchor(ledSvg, 206, 116);
    var rightEdge = anchor(ledSvg, 220, 0).x;
    var d1 = "M" + top.x + "," + top.y + " C" + top.x + "," + (top.y - 40) + " " + leftTip.x + "," + (leftTip.y + 50) + " " + leftTip.x + "," + leftTip.y;
    var d2 = "M" + bottom.x + "," + bottom.y + " C" + (bottom.x + 60) + "," + (bottom.y + 18) + " " + (rightEdge + 28) + "," + (rightTip.y + 80) + " " + rightTip.x + "," + rightTip.y;
    var wire = function (d) {
      return '<path class="bt-wire" d="' + d + '" fill="none" stroke="#111" stroke-width="2.8" stroke-linecap="butt" stroke-dasharray="2.8 4.6"/>';
    };
    link.innerHTML = wire(d1) + wire(d2);
  }

  drawLink();
  window.addEventListener("resize", drawLink);
  window.addEventListener("load", drawLink);
  if (window.ResizeObserver && list) new ResizeObserver(drawLink).observe(list);

  var lit = [btnSvg, ledSvg].concat(link ? [link] : []);

  function press() {
    lit.forEach(function (el) { el.classList.add("is-pressed"); });
    btnSvg.classList.add("has-pressed");
  }
  function release() {
    lit.forEach(function (el) { el.classList.remove("is-pressed"); });
  }

  button.addEventListener("pointerdown", function (e) {
    press();
    if (button.setPointerCapture) button.setPointerCapture(e.pointerId);
  });
  ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (evt) {
    button.addEventListener(evt, release);
  });
  button.addEventListener("keydown", function (e) {
    if ((e.key === " " || e.key === "Enter") && !e.repeat) {
      e.preventDefault();
      press();
    }
  });
  button.addEventListener("keyup", release);
  button.addEventListener("blur", release);
})();
