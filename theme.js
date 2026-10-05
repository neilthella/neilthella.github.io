// Theme switcher: "light" (default) or "box". Loaded in <head> so the saved
// theme is applied before first paint (no flash). The switch itself is built
// in nav.js; its look is driven by the html[data-theme] attribute.
(function () {
  var KEY = "theme";
  var root = document.documentElement;

  function saved() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function apply(theme) {
    if (theme === "box") root.setAttribute("data-theme", "box");
    else root.removeAttribute("data-theme");
  }

  window.setTheme = function (theme) {
    apply(theme);
    try {
      localStorage.setItem(KEY, theme);
    } catch (e) {}
    var toggles = document.querySelectorAll(".theme-toggle");
    for (var i = 0; i < toggles.length; i++) {
      toggles[i].setAttribute("aria-checked", theme === "box" ? "true" : "false");
    }
  };

  window.getTheme = function () {
    return root.getAttribute("data-theme") === "box" ? "box" : "light";
  };

  apply(saved());
})();
