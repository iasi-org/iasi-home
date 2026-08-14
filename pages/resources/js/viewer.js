(() => {
  const frame = document.getElementById("iasi-doc-frame");
  const openLink = document.getElementById("iasi-doc-open");
  const title = document.getElementById("iasi-doc-title");
  const message = document.getElementById("iasi-doc-message");

  if (!frame || !openLink || !title || !message) return;

  const params = new URLSearchParams(window.location.search);
  const requested = params.get("doc");
  const requestedTitle = params.get("title") || "Documentación IASI";
  const allowedOrigin = "https://iasi-org.github.io";
  let documentUrl;

  try {
    documentUrl = new URL(requested || "", allowedOrigin);
    const allowedPath = documentUrl.pathname.startsWith("/iasi-quarto-docs/");

    if (documentUrl.origin !== allowedOrigin || !allowedPath) {
      throw new Error("Documentación no permitida");
    }
  } catch (_error) {
    title.textContent = "Documentación no disponible";
    message.dataset.state = "error";
    message.textContent = "No se ha indicado una dirección de documentación válida.";
    frame.remove();
    return;
  }

  title.textContent = requestedTitle;
  document.title = `${requestedTitle} – IASI`;
  openLink.href = documentUrl.href;
  openLink.setAttribute("aria-label", `Abrir ${requestedTitle} en una pestaña nueva`);
  openLink.title = `Abrir ${requestedTitle} en una pestaña nueva`;
  frame.title = requestedTitle;

  frame.addEventListener("load", () => {
    message.dataset.state = "loaded";
  });

  frame.addEventListener("error", () => {
    message.dataset.state = "error";
    message.textContent = "No se pudo mostrar la documentación integrada. Ábrala con el icono ↗.";
  });

  frame.src = documentUrl.href;
})();
