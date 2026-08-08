# iasi-home

Página de entrada del ecosistema IASI.

## Estructura

- `_quarto.yml`: configuración del website.
- `_quarto-html.yml`: configuración específica del formato HTML.
- `iasi.yml`: configuración específica de IASI Quarto.
- `index.qmd`: portada en castellano.
- `en/index.qmd`: portada en inglés.
- `styles.css`: estilos comunes.

## Desarrollo local

```bash
quarto preview
```

## Render

```bash
quarto render
```

La publicación está pensada para GitHub Pages.


## Detección de idioma

En la primera visita:

- Navegador en español (`es*`) → español.
- Cualquier otro idioma → inglés.

La selección manual `ES | EN` se guarda en `localStorage` y prevalece sobre
el idioma del navegador.
