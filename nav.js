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

  document.write(
    '<nav><div class="nav-inner">' +
      '<a class="brand" href="index.html">Neil\'s Camp-in-a-Box</a>' +
      '<div class="nav-links">' + linksHtml + "</div>" +
      "</div></nav>"
  );
})();
