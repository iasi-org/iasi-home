(() => {
  const STORAGE_KEY = "iasi-language";

  const browserLanguage =
    (navigator.language || "en").toLowerCase().startsWith("es") ? "es" : "en";

  const savedLanguage = localStorage.getItem(STORAGE_KEY);

  const preferredLanguage =
    savedLanguage === "es" || savedLanguage === "en"
      ? savedLanguage
      : browserLanguage;

  /*
   * resources/js/language.js
   * Dos niveles arriba está la raíz del sitio.
   */
  const siteRoot = new URL("../../", document.currentScript.src);

  const entryUrl = new URL("index.html", siteRoot);

  const spanishHomeUrl = new URL("index_es.html", siteRoot);
  const englishHomeUrl = new URL("index_en.html", siteRoot);

  const spanishContactUrl = new URL("pages/common/contact_es.html", siteRoot);
  const englishContactUrl = new URL("pages/common/contact_en.html", siteRoot);

  const canonicalPath = (value) => {
    const url = new URL(value, window.location.href);
    return url.pathname.replace(/\/index\.html$/i, "/");
  };

  document.addEventListener("DOMContentLoaded", () => {

    /*
     * Ajustamos enlaces dependientes del idioma.
     */
    document.querySelectorAll("a").forEach((link) => {
      const label = link.textContent.trim().toLowerCase();
      const ariaLabel = (link.getAttribute("aria-label") || "").toLowerCase();
      const href = link.getAttribute("href") || "";

      if (label === "es" || label === "español") {
        link.href = spanishHomeUrl.href;

        link.addEventListener("click", () => {
          localStorage.setItem(STORAGE_KEY, "es");
        });
      }

      if (label === "en" || label === "english") {
        link.href = englishHomeUrl.href;

        link.addEventListener("click", () => {
          localStorage.setItem(STORAGE_KEY, "en");
        });
      }

      /*
       * Icono de contacto.
       */
      if (
        ariaLabel.includes("contact") ||
        /contact(?:_es|_en)?\.html$/i.test(href)
      ) {
        link.href =
          preferredLanguage === "es"
            ? spanishContactUrl.href
            : englishContactUrl.href;
      }
    });

    const currentPath = canonicalPath(window.location.href);

    const entryPath = canonicalPath(entryUrl.href);
    const spanishHomePath = canonicalPath(spanishHomeUrl.href);
    const englishHomePath = canonicalPath(englishHomeUrl.href);

    const isEntryPage = currentPath === entryPath;
    const isSpanishHome = currentPath === spanishHomePath;
    const isEnglishHome = currentPath === englishHomePath;

    /*
     * Solo redirigimos automáticamente en:
     *
     *   /index.html
     *   /index_es.html
     *   /index_en.html
     */
    if (!isEntryPage && !isSpanishHome && !isEnglishHome) return;

    if (isEntryPage) {
      window.location.replace(
        preferredLanguage === "es"
          ? spanishHomeUrl.href
          : englishHomeUrl.href
      );
      return;
    }

    if (preferredLanguage === "en" && isSpanishHome) {
      window.location.replace(englishHomeUrl.href);
      return;
    }

    if (preferredLanguage === "es" && isEnglishHome) {
      window.location.replace(spanishHomeUrl.href);
    }
  });
})();