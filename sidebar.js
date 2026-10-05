// Builds the left sidebar on camp pages from the page's own section headings
// (each <section> with an <h2> inside .page-content). Add data-sidebar="..."
// to a section to use a different label than its heading. The active entry follows
// the scroll position. Sidebar layout lives in styles.css (.with-sidebar).
(function () {
  var content = document.querySelector(".page-content");
  var side = document.getElementById("page-sidebar");
  if (!content || !side) return;

  var items = [];
  var sections = content.querySelectorAll("section");
  for (var i = 0; i < sections.length; i++) {
    var heading = sections[i].querySelector(":scope > h2");
    if (!heading) continue;
    if (!sections[i].id) sections[i].id = "section-" + (i + 1);
    items.push({
      section: sections[i],
      text: sections[i].getAttribute("data-sidebar") || heading.textContent.trim(),
    });
  }
  if (!items.length) return;

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var pageTitle = document.querySelector(".hero h1");
  side.innerHTML =
    '<div class="sidebar-label"><span class="lbl-light">On this page</span><span class="lbl-box">In this box</span></div>' +
    (pageTitle ? '<a class="sidebar-title" href="#">' + escapeHtml(pageTitle.textContent) + "</a>" : "") +
    '<nav class="sidebar-links" aria-label="Page sections">' +
    items
      .map(function (item) {
        return '<a href="#' + item.section.id + '">' + escapeHtml(item.text) + "</a>";
      })
      .join("") +
    "</nav>";

  var links = side.querySelectorAll(".sidebar-links a");

  function update() {
    var active = -1;
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) {
      active = items.length - 1;
    } else {
      for (var k = 0; k < items.length; k++) {
        if (items[k].section.getBoundingClientRect().top <= 220) active = k;
      }
    }
    for (var m = 0; m < links.length; m++) {
      links[m].classList.toggle("active", m === active);
    }
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
})();
