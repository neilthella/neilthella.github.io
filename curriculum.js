/** AI was used in developing this website, however NO AI was used in the materials. The materials are human-made from trial and error after years of running camps and workshops. **/

// Renders a day-by-day materials navigator (tab bar + resource links) into
// the element with id `elId`. `days` is an array of:
//   { label: "P", title: "...", resources: [
//       { label: "...", url: "...", type: "PDF", description: "...", download: false, previewUrl: "..." }
//       // `type` is a short badge; `description` is optional and shows as a
//       // small, muted line under the link so it doesn't feel obstructive.
//       // `download`: false (default) opens the link in a new tab to view;
//       // true forces the browser to save it as a file instead. Note: some
//       // hosts (e.g. certain Google Docs export URLs) set response headers
//       // that force a download no matter what this is set to.
//       // `count` (optional): a number shown in a small colored ticker at the
//       // right of the row, e.g. count: 24, with a symbol (slides icon for
//       // type "slides", a page icon otherwise). Set `unit: "..."` to show
//       // a word instead of the symbol.
//       // `previewUrl` (optional): a separate URL to use for the inline eye
//       // preview, for cases where `url` itself can't be embedded (forces a
//       // download, blocks framing, etc). If `url` is a Google Docs export
//       // link, a working Google Docs "preview" URL is derived automatically
//       // and you don't need to set this yourself.
//   ]}
// Google Docs / Slides links also get a format selector under the box:
// "Slides/PDF" uses each resource's `url` as written, "PPTX/DOCX" swaps in
// Microsoft export links, and "ODP/ODT" swaps in open-format export links,
// relabeling the badges. Previews always use the original `url`.
// `options.scroll` (optional): instead of showing one day at a time, list
// every day in a fixed-height scrolling frame. The tab bar stays pinned at
// the top, the active tab follows the scroll position, and clicking a tab
// scrolls to that day. Set the frame height with .curriculum-box.scrolling
// in styles.css.
// Call this once per page, after the target element exists in the DOM.
function renderCurriculumNav(elId, days, options) {
  var el = document.getElementById(elId);
  if (!el) return;
  var scrollMode = !!(options && options.scroll);
  var current = 0;
  var selectDay = function () {};
  var format = "view"; // "view" = Slides/PDF, "office" = PPTX/DOCX, "open" = ODP/ODT

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var eyeIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z"></path>' +
    '<circle cx="12" cy="12" r="3"></circle>' +
    "</svg>";

  var slidesIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="3" y="4" width="18" height="12" rx="2"></rect>' +
    '<path d="M12 16v4M8 20h8"></path>' +
    "</svg>";

  var pagesIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M6 3h8l4 4v14H6z"></path>' +
    '<path d="M14 3v4h4"></path>' +
    "</svg>";

  function isPdf(r) {
    return (
      (r.type && r.type.toUpperCase() === "PDF") ||
      /\.pdf(\?|#|$)/i.test(r.url) ||
      /format=pdf/i.test(r.url)
    );
  }

  function isSlides(r) {
    return (
      (r.type && r.type.toLowerCase() === "slides") ||
      /^https:\/\/docs\.google\.com\/presentation\//i.test(r.url)
    );
  }

  // PDFs and slides get the eye button for an inline preview.
  function canPreview(r) {
    return isPdf(r) || isSlides(r);
  }

  // Google's own document/spreadsheet/presentation "export" links force a
  // download (they set a Content-Disposition header), so they can't be
  // embedded in an iframe. Google's "/preview" URL for the same file is
  // built for embedding instead, so swap to that for the inline preview.
  function getPreviewUrl(r) {
    if (r.previewUrl) return r.previewUrl;
    var match = r.url.match(/^https:\/\/docs\.google\.com\/(document|spreadsheets|presentation)\/d\/([^/]+)/i);
    if (match) {
      // Slides previews use the /edit view; documents and sheets use /preview.
      var suffix = match[1].toLowerCase() === "presentation" ? "/edit" : "/preview";
      return "https://docs.google.com/" + match[1] + "/d/" + match[2] + suffix;
    }
    return r.url;
  }

  function googleFile(url) {
    var m = String(url).match(/^https:\/\/docs\.google\.com\/(document|presentation)\/d\/([^/?#]+)/i);
    return m ? { kind: m[1].toLowerCase(), id: m[2] } : null;
  }

  // What a resource shows right now, given the Slides/PDF vs PPTX/DOCX
  // selector. Only the link and the badges change; previews always keep
  // using the resource's original URL (see getPreviewUrl).
  var exportExts = {
    office: { presentation: "pptx", document: "docx" },
    open: { presentation: "odp", document: "odt" },
  };

  function viewOf(r) {
    var view = { url: r.url, label: r.type || "", slides: isSlides(r), converted: false };
    var file = googleFile(r.url);
    if (format === "view" || !file) return view;
    var ext = exportExts[format][file.kind];
    if (file.kind === "presentation") {
      view.url = "https://docs.google.com/presentation/d/" + file.id + "/export/" + ext;
      if (r.type) view.label = ext.toUpperCase();
      view.converted = true;
    } else {
      view.url = /format=pdf/i.test(r.url)
        ? r.url.replace(/format=pdf/i, "format=" + ext)
        : "https://docs.google.com/document/d/" + file.id + "/export?format=" + ext;
      if (r.type && r.type.toUpperCase() === "PDF") view.label = ext.toUpperCase();
    }
    return view;
  }

  function tagClassFor(view) {
    return view.label ? " tag-" + view.label.toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  }

  function countClassFor(view) {
    return view.converted ? " count-pptx" : view.slides ? " count-slides" : "";
  }

  // Descriptions support line breaks (\n) and bullet lists: any line that
  // starts with "•" becomes a list item; consecutive bullet lines are grouped.
  function formatDescription(text) {
    var lines = String(text).replace(/\\n/g, "\n").split(/\r?\n/);
    var html = "";
    var textLines = [];
    var bullets = [];

    function flushText() {
      if (textLines.length) html += textLines.join("<br>");
      textLines = [];
    }
    function flushBullets() {
      if (bullets.length) {
        html += '<ul class="resource-bullets"><li>' + bullets.join("</li><li>") + "</li></ul>";
      }
      bullets = [];
    }

    lines.forEach(function (line) {
      var bullet = line.match(/^\s*•\s*(.*)$/);
      if (bullet) {
        flushText();
        bullets.push(escapeHtml(bullet[1]));
      } else {
        flushBullets();
        textLines.push(escapeHtml(line));
      }
    });
    flushText();
    flushBullets();
    return html;
  }

  function resourcesHtmlFor(day, di) {
    if (!day.resources || !day.resources.length) {
      return '<p class="placeholder">Hey there, it looks like I haven\'t added any materials to this section yet. Check back later!</p>';
    }
    return (
      '<ul class="resource-list">' +
      day.resources
        .map(function (r, ri) {
          var v = viewOf(r);
          var typeTag = r.type
            ? '<span class="tag res-tag' + tagClassFor(v) + '">' + escapeHtml(v.label) + "</span>"
            : "";
          var desc = r.description
            ? '<div class="resource-desc">' + formatDescription(r.description) + "</div>"
            : "";
          var linkAttrs = r.download
            ? ' download rel="noopener noreferrer"'
            : ' target="_blank" rel="noopener noreferrer"';
          var linkIcon = r.download ? " ⤓" : " ↗";
          var countHtml = r.count
            ? '<span class="resource-count' + countClassFor(v) + '">' +
              (r.unit ? "" : v.slides ? slidesIcon : pagesIcon) +
              escapeHtml(r.count) +
              (r.unit ? " " + escapeHtml(r.unit) : "") +
              "</span>"
            : "";
          var previewId = elId + "-preview-" + di + "-" + ri;
          var eyeButton = canPreview(r)
            ? '<button type="button" class="resource-eye" data-preview-id="' +
              previewId +
              '" aria-expanded="false" aria-label="Preview ' +
              escapeHtml(r.label) +
              '">' +
              eyeIcon +
              "</button>"
            : "";
          var previewHtml = canPreview(r)
            ? '<div class="resource-preview" id="' + previewId + '" hidden>' +
              '<iframe src="' + escapeHtml(getPreviewUrl(r)) + '" title="' + escapeHtml(r.label) + '" loading="lazy"></iframe>' +
              "</div>"
            : "";
          return (
            '<li data-d="' + di + '" data-r="' + ri + '">' +
            '<div class="resource-row">' + typeTag +
            '<a class="res-link" href="' + escapeHtml(v.url) + '"' + linkAttrs + ">" +
            escapeHtml(r.label) +
            '<span class="resource-icon">' + linkIcon + "</span>" +
            "</a>" +
            eyeButton +
            countHtml +
            "</div>" +
            desc +
            previewHtml +
            "</li>"
          );
        })
        .join("") +
      "</ul>"
    );
  }

  function tabsHtmlFor(activeIndex) {
    return days
      .map(function (d, i) {
        var activeClass = i === activeIndex ? " active" : "";
        return (
          '<button type="button" class="day-tab' + activeClass + '" data-i="' + i + '">' +
          escapeHtml(d.label) +
          "</button>"
        );
      })
      .join("");
  }

  function bindEyeButtons(onToggle) {
    var eyeButtons = el.querySelectorAll(".resource-eye");
    for (var j = 0; j < eyeButtons.length; j++) {
      eyeButtons[j].addEventListener("click", function (e) {
        var btn = e.currentTarget;
        var preview = document.getElementById(btn.getAttribute("data-preview-id"));
        if (!preview) return;
        var isHidden = preview.hasAttribute("hidden");
        preview.toggleAttribute("hidden");
        btn.setAttribute("aria-expanded", isHidden ? "true" : "false");
        btn.classList.toggle("active", isHidden);
        if (onToggle) onToggle();
      });
    }
  }

  // Updates links and badges in place (so open previews keep their state).
  function applyFormat() {
    var items = el.querySelectorAll("li[data-d]");
    for (var n = 0; n < items.length; n++) {
      var li = items[n];
      var r = days[parseInt(li.getAttribute("data-d"), 10)].resources[parseInt(li.getAttribute("data-r"), 10)];
      var v = viewOf(r);
      li.querySelector(".res-link").setAttribute("href", v.url);
      var tag = li.querySelector(".res-tag");
      if (tag) {
        tag.textContent = v.label;
        tag.className = "tag res-tag" + tagClassFor(v);
      }
      var count = li.querySelector(".resource-count");
      if (count) count.className = "resource-count" + countClassFor(v);
    }
  }

  // The Slides/PDF vs PPTX/DOCX selector, attached under the box. Only shown
  // when at least one resource is a Google Doc or Slides file.
  function buildFormatToggle() {
    var convertible = days.some(function (d) {
      return (d.resources || []).some(function (r) {
        return googleFile(r.url);
      });
    });
    if (!convertible) return;

    var toggle = document.createElement("div");
    toggle.className = "format-toggle";
    toggle.innerHTML =
      '<div class="format-opts" role="group" aria-label="File format">' +
      '<button type="button" class="format-opt active" data-format="view">Google (Slides/PDF)</button>' +
      '<button type="button" class="format-opt" data-format="office">Microsoft (PPTX/DOCX)</button>' +
      '<button type="button" class="format-opt" data-format="open">Open Source (ODP/ODT)</button>' +
      "</div>";
    el.insertAdjacentElement("afterend", toggle);

    var opts = toggle.querySelectorAll(".format-opt");
    for (var k = 0; k < opts.length; k++) {
      opts[k].addEventListener("click", function (e) {
        format = e.currentTarget.getAttribute("data-format");
        for (var m = 0; m < opts.length; m++) {
          opts[m].classList.toggle("active", opts[m] === e.currentTarget);
        }
        applyFormat();
      });
    }
  }

  function renderPaged() {
    selectDay = function (index) {
      current = index;
      renderPaged();
    };
    var day = days[current];

    el.innerHTML =
      '<div class="day-tabs">' + tabsHtmlFor(current) + "</div>" +
      '<div class="day-panel">' +
      "<h3>" + escapeHtml(day.title) + "</h3>" +
      (day.description ? '<p class="day-desc">' + escapeHtml(day.description) + "</p>" : "") +
      resourcesHtmlFor(day, current) +
      "</div>";

    var tabButtons = el.querySelectorAll(".day-tab");
    for (var i = 0; i < tabButtons.length; i++) {
      tabButtons[i].addEventListener("click", function (e) {
        current = parseInt(e.currentTarget.getAttribute("data-i"), 10);
        renderPaged();
      });
    }

    bindEyeButtons();
  }

  function renderScrolling() {
    var sectionsHtml = days
      .map(function (day, di) {
        return (
          '<section class="day-panel day-section" data-i="' + di + '">' +
          '<h3><span class="day-badge">' + escapeHtml(day.label) + "</span>" + escapeHtml(day.title) + "</h3>" +
          (day.description ? '<p class="day-desc">' + escapeHtml(day.description) + "</p>" : "") +
          resourcesHtmlFor(day, di) +
          "</section>"
        );
      })
      .join("");

    el.classList.add("scrolling");
    el.innerHTML =
      '<div class="day-tabs">' + tabsHtmlFor(0) + "</div>" +
      '<div class="day-scroll">' + sectionsHtml + "</div>";

    var scroller = el.querySelector(".day-scroll");
    var sections = el.querySelectorAll(".day-section");
    var tabButtons = el.querySelectorAll(".day-tab");
    // Index chosen by a tab click. Near the end of the list the frame can't
    // scroll far enough to put the last days at the top, so scroll position
    // alone can't say which tab was meant; this holds the choice until the
    // user scrolls by hand.
    var lockedIndex = null;

    function setActive(index) {
      if (index === current) return;
      current = index;
      for (var t = 0; t < tabButtons.length; t++) {
        tabButtons[t].classList.toggle("active", t === index);
      }
    }

    function onScroll() {
      if (lockedIndex !== null) return;
      var atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;
      if (atBottom) {
        setActive(sections.length - 1);
        return;
      }
      var active = 0;
      for (var s = 0; s < sections.length; s++) {
        if (sections[s].offsetTop <= scroller.scrollTop + 8) active = s;
      }
      setActive(active);
    }

    function unlock() {
      lockedIndex = null;
    }

    selectDay = function (index) {
      lockedIndex = index;
      scroller.scrollTop = sections[index].offsetTop;
      setActive(index);
    };

    for (var i = 0; i < tabButtons.length; i++) {
      tabButtons[i].addEventListener("click", function (e) {
        selectDay(parseInt(e.currentTarget.getAttribute("data-i"), 10));
      });
    }

    scroller.addEventListener("scroll", onScroll);
    ["wheel", "touchstart", "mousedown", "keydown"].forEach(function (evt) {
      scroller.addEventListener(evt, unlock, { passive: true });
    });
    bindEyeButtons();
  }

  if (scrollMode) {
    renderScrolling();
  } else {
    renderPaged();
  }
  buildFormatToggle();

  // The numbered circles in the Modules list link to the matching day here.
  var badges = document.querySelectorAll(".module-badge[data-day]");
  for (var b = 0; b < badges.length; b++) {
    badges[b].addEventListener("click", function (e) {
      var label = e.currentTarget.getAttribute("data-day");
      for (var d = 0; d < days.length; d++) {
        if (days[d].label === label) {
          e.preventDefault();
          selectDay(d);
          el.scrollIntoView();
          return;
        }
      }
    });
  }
}
