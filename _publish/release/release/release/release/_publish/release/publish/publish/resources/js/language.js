(() => {
  const STORAGE_KEY = "iasi-language";

  const LOCALIZED_PAGES = new Set([
    "index.html",
    "intro.html",
    "challenge.html",
    "contact.html",
  ]);

  const browserLanguage =
    (navigator.language || "en").toLowerCase().startsWith("es")
      ? "es"
      : "en";

  const savedLanguage = localStorage.getItem(STORAGE_KEY);

  const preferredLanguage =
    savedLanguage === "es" || savedLanguage === "en"
      ? savedLanguage
      : browserLanguage;

  // resources/js/language.js -> raíz del sitio
  const siteRoot = new URL("../../", document.currentScript.src);
  const entryUrl = new URL("index.html", siteRoot);

  const homeUrl = (language) =>
    new URL(`pages/locale/${language}/index.html`, siteRoot);

  const pageUrl = (language, page) =>
    new URL(`pages/locale/${language}/${page}`, siteRoot);

  const currentLocale = () => {
    const relativePath =
      window.location.pathname.slice(siteRoot.pathname.length);

    const match =
      relativePath.match(/^pages\/locale\/(es|en)\//i);

    return match ? match[1].toLowerCase() : null;
  };

  const translatedUrl = (language) => {
    const locale = currentLocale();

    if (!locale) {
      return homeUrl(language);
    }

    const relativePath =
      window.location.pathname.slice(siteRoot.pathname.length);

    const translatedPath =
      relativePath.replace(
        /^pages\/locale\/(?:es|en)\//i,
        `pages/locale/${language}/`
      );

    const url = new URL(translatedPath, siteRoot);

    url.search = window.location.search;
    url.hash = window.location.hash;

    return url;
  };

  const canonicalPath = (value) => {
    const url = new URL(value, window.location.href);

    return url.pathname.replace(/\/index\.html$/i, "/");
  };

  const localizedPageName = (href) => {
    if (!href) {
      return null;
    }

    try {
      const url = new URL(href, window.location.href);

      const page =
        url.pathname.split("/").filter(Boolean).pop() || "index.html";

      return LOCALIZED_PAGES.has(page.toLowerCase())
        ? page.toLowerCase()
        : null;
    } catch {
      return null;
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    const language = currentLocale() || preferredLanguage;

    document.querySelectorAll("a").forEach((link) => {
      const label =
        link.textContent.trim().toLowerCase();

      const href =
        link.getAttribute("href") || "";

      // Selector de idioma
      if (label === "es" || label === "español") {
        link.href = translatedUrl("es").href;

        link.addEventListener("click", () => {
          localStorage.setItem(STORAGE_KEY, "es");
        });

        return;
      }

      if (label === "en" || label === "english") {
        link.href = translatedUrl("en").href;

        link.addEventListener("click", () => {
          localStorage.setItem(STORAGE_KEY, "en");
        });

        return;
      }

      // Páginas localizadas
      const page = localizedPageName(href);

      if (page) {
        link.href =
          page === "index.html"
            ? homeUrl(language).href
            : pageUrl(language, page).href;
      }
    });

    // index.html raíz -> home localizada
    const currentPath =
      canonicalPath(window.location.href);

    const entryPath =
      canonicalPath(entryUrl.href);

    if (currentPath === entryPath) {
      window.location.replace(
        homeUrl(preferredLanguage).href
      );
    }
  });
})();
