/** AI was used in developing this website, however NO AI was used in the materials. The materials are human-made from trial and error after years of running camps and workshops. **/

// Single source of truth for the site nav. Edit the `links` array below to
// change every page's navbar at once.
(function () {
  var links = [
    { href: "index.html", label: "Home" },
    { href: "robotics-camp.html", label: "Robotics Camp" },
    { href: "circuits-camp.html", label: "Circuits Camp" },
    { href: "history.html", label: "History" },
    { href: "index.html#contact", label: "Contact" },
  ];

  var page = location.pathname.split("/").pop() || "index.html";

  var linksHtml = links
    .map(function (link) {
      var linkPage = link.href.split("#")[0] || "index.html";
      var isCurrentPage = linkPage === page;
      var href = link.href;
      // On the page a link points to, prefer an in-page anchor over a full reload.
      if (isCurrentPage && link.href.indexOf("#") !== -1) {
        href = "#" + link.href.split("#")[1];
      }
      var activeClass = isCurrentPage && href.indexOf("#") === -1 ? ' class="active"' : "";
      return '<a href="' + href + '"' + activeClass + ">" + link.label + "</a>";
    })
    .join("");

  var sunIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/>' +
    '<path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/></svg>';
  var boxIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">' +
    '<path d="M12 3l9 5v8l-9 5-9-5V8z"/><path d="M3 8l9 5 9-5M12 13v8"/></svg>';

  var boxOn = document.documentElement.getAttribute("data-theme") === "box";
  var toggleHtml =
    '<button type="button" class="theme-toggle" role="switch" aria-checked="' + boxOn + '" ' +
    'aria-label="Box mode" title="Switch between light mode and box mode">' +
    '<span class="tt-knob"></span>' +
    '<span class="tt-icon tt-sun">' + sunIcon + "</span>" +
    '<span class="tt-icon tt-box">' + boxIcon + "</span>" +
    "</button>";

  document.write(
    '<nav><div class="nav-inner">' +
      '<a class="brand" href="index.html">Neil\'s Camp-in-a-Box</a>' +
      '<div class="nav-right">' +
      '<div class="nav-links">' + linksHtml + "</div>" +
      toggleHtml +
      "</div>" +
      "</div></nav>"
  );

  document.addEventListener("click", function (e) {
    var toggle = e.target.closest && e.target.closest(".theme-toggle");
    if (!toggle || !window.setTheme) return;
    window.setTheme(window.getTheme() === "box" ? "light" : "box");
  });
})();
