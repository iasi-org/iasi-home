document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll(".quarto-navbar-tools a[aria-label]")
    .forEach((link) => {
      link.title = link.getAttribute("aria-label");
    });
});
