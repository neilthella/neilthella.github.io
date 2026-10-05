/** AI was used in developing this website, however NO AI was used in the materials. The materials are human-made from trial and error after years of running camps and workshops. **/

// Single source of truth for the site footer. Edit the text below to change
// every page's footer at once.
(function () {
  var year = new Date().getFullYear();
  var email = "neil.the.20@gmail.com";

  var mailIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
      '<rect x="2.5" y="5" width="19" height="14" rx="2"></rect>' +
      '<path d="M3 6.5l9 6.5 9-6.5"></path>' +
    "</svg>";

  document.write(
    "<footer><div class=\"footer-inner\" id=\"contact\">" +
      '<div class="footer-top">' +
        '<span class="footer-copy">&copy; ' + year + " Neil Thella</span>" +
        '<a class="footer-mail" href="mailto:' + email + '" aria-label="Email">' + mailIcon + "</a>" +
      "</div>" +
      '<p class="footer-disclaimer">Disclosure: This web interface was designed with AI-assistance, however the workshop materials published on this website are handmade from years of actual workshops and summer camps (NOT LLM or AI-assisted). Do not re-publish materials without permission.</p>' +
    "</div></footer>"
  );
})();
