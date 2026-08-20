(() => {
  const frame = document.getElementById("iasi-doc-frame");

  if (!frame) return;

  const params = new URLSearchParams(window.location.search);
  const requested = params.get("doc");
  const requestedTitle = params.get("title") || "Documentación IASI";
  const allowedOrigin = "https://iasi-org.github.io";
  let documentUrl;

  try {
    documentUrl = new URL(requested || "", allowedOrigin);

    if (documentUrl.origin !== allowedOrigin) {
      throw new Error("Documentación no permitida");
    }
  } catch (_error) {
    frame.remove();
    return;
  }

  document.title = `${requestedTitle} – IASI`;
  frame.title = requestedTitle;
  frame.src = documentUrl.href;
})();
