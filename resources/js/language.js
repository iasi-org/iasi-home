(() => {
  // Preferred language is persisted so an explicit ES/EN choice always wins
  // over the browser language on subsequent visits.
  const STORAGE_KEY = "iasi-language";

  const browserLanguage =
    (navigator.language || "en").toLowerCase().startsWith("es")
      ? "es"
      : "en";

  const savedLanguage = localStorage.getItem(STORAGE_KEY);
  const preferredLanguage = savedLanguage || browserLanguage;

  // Quarto may expose an index page either as /index.html or simply as /.
  // Normalize both forms so we can compare destinations reliably.
  const canonicalPath = (value) => {
    const url = new URL(value, window.location.href);
    return url.pathname.replace(/\/index\.html$/i, "/");
  };

  document.addEventListener("DOMContentLoaded", () => {
    let spanishLink = null;
    let englishLink = null;

    // Locate the ES/EN navbar links and remember explicit user choices.
    document.querySelectorAll("a").forEach((link) => {
      const label = link.textContent.trim().toLowerCase();

      if (label === "es" || label === "español") {
        spanishLink = link;
        link.addEventListener("click", () => {
          localStorage.setItem(STORAGE_KEY, "es");
        });
      }

      if (label === "en" || label === "english") {
        englishLink = link;
        link.addEventListener("click", () => {
          localStorage.setItem(STORAGE_KEY, "en");
        });
      }
    });

    // Automatic language redirection applies ONLY to the two landing pages.
    // Internal documents such as Manifesto, Principles, Contact, artifacts or
    // the bilingual manifesto must remain where the user navigated to them.
    //
    // This avoids the previous behaviour where opening, for example,
    // principles.html could be interpreted as a language change and send the
    // user back to the English or Spanish home page.
    if (!spanishLink || !englishLink) {
      return;
    }

    const currentPath = canonicalPath(window.location.href);
    const spanishHomePath = canonicalPath(spanishLink.href);
    const englishHomePath = canonicalPath(englishLink.href);

    const isSpanishHome = currentPath === spanishHomePath;
    const isEnglishHome = currentPath === englishHomePath;

    if (!isSpanishHome && !isEnglishHome) {
      return;
    }

    if (preferredLanguage === "en" && isSpanishHome) {
      window.location.replace(englishLink.href);
      return;
    }

    if (preferredLanguage === "es" && isEnglishHome) {
      window.location.replace(spanishLink.href);
    }
  });
})();
