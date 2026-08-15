(() => {
  const STORAGE_KEY = "iasi-language";

  const browserLanguage =
    (navigator.language || "en").toLowerCase().startsWith("es")
      ? "es"
      : "en";

  const savedLanguage = localStorage.getItem(STORAGE_KEY);

  const preferredLanguage =
    savedLanguage === "es" || savedLanguage === "en"
      ? savedLanguage
      : browserLanguage;

  /*
   * language.js vive en:
   *
   *   pages/resources/js/language.js
   *
   * Tres niveles arriba está la raíz del sitio.
   * Así funciona también cuando el sitio vive bajo /iasi-home/.
   */
  const siteRoot = new URL(
    "../../../",
    document.currentScript.src
  );

  const entryUrl = new URL("index.html", siteRoot);

  const spanishHomeUrl = new URL(
    "pages/en/index_es.html",
    siteRoot
  );

  const englishHomeUrl = new URL(
    "pages/en/index_en.html",
    siteRoot
  );

  const canonicalPath = (value) => {
    const url = new URL(value, window.location.href);

    return url.pathname.replace(
      /\/index\.html$/i,
      "/"
    );
  };

  document.addEventListener("DOMContentLoaded", () => {
    /*
     * Ajustamos los enlaces ES / EN de la navbar.
     */
    document.querySelectorAll("a").forEach((link) => {
      const label = link.textContent
        .trim()
        .toLowerCase();

      if (label === "es" || label === "español") {
        link.href = spanishHomeUrl.href;

        link.addEventListener("click", () => {
          localStorage.setItem(
            STORAGE_KEY,
            "es"
          );
        });
      }

      if (label === "en" || label === "english") {
        link.href = englishHomeUrl.href;

        link.addEventListener("click", () => {
          localStorage.setItem(
            STORAGE_KEY,
            "en"
          );
        });
      }
    });

    const currentPath =
      canonicalPath(window.location.href);

    const entryPath =
      canonicalPath(entryUrl.href);

    const spanishHomePath =
      canonicalPath(spanishHomeUrl.href);

    const englishHomePath =
      canonicalPath(englishHomeUrl.href);

    const isEntryPage =
      currentPath === entryPath;

    const isSpanishHome =
      currentPath === spanishHomePath;

    const isEnglishHome =
      currentPath === englishHomePath;

    /*
     * Solo actuamos en:
     *
     *   /index.html
     *   /pages/en/index_es.html
     *   /pages/en/index_en.html
     *
     * Las demás páginas permanecen donde están.
     */
    if (
      !isEntryPage &&
      !isSpanishHome &&
      !isEnglishHome
    ) {
      return;
    }

    /*
     * Entrada inicial.
     */
    if (isEntryPage) {
      window.location.replace(
        preferredLanguage === "es"
          ? spanishHomeUrl.href
          : englishHomeUrl.href
      );

      return;
    }

    /*
     * Corrige la home según la preferencia guardada.
     */
    if (
      preferredLanguage === "en" &&
      isSpanishHome
    ) {
      window.location.replace(
        englishHomeUrl.href
      );

      return;
    }

    if (
      preferredLanguage === "es" &&
      isEnglishHome
    ) {
      window.location.replace(
        spanishHomeUrl.href
      );
    }
  });
})();
