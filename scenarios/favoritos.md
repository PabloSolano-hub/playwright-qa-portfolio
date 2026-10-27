# Escenarios de negocio — Favoritos

Generados con la skill `manual-to-scenario` a partir del caso manual «CP-27 Favoritos» (ver `.claude/skills/manual-to-scenario/examples/favoritos/`). Cada test usa su propio usuario registrado por API, para que los favoritos no se compartan entre tests ni navegadores en paralelo; al terminar se borran los favoritos y después el usuario.

### ESC-FAVORITOS-001 — Añadir un producto a favoritos

- Prioridad: Media
- Precondiciones: usuario autenticado, recién registrado por API y sin favoritos; existe un producto en stock que no es de alquiler (se obtiene por API)
- Pasos:
  1. Abrir la ficha del producto.
  2. Pulsar «Add to favorites».
  3. Abrir «My account» > «Favorites» (`/account/favorites`).
- Resultado esperado: se muestra el aviso «Product added to your favorites list.» y la página de favoritos contiene únicamente ese producto.
- Automatizado en: tests/e2e/favorites.spec.ts

### ESC-FAVORITOS-002 — Añadir de nuevo un producto que ya es favorito

- Prioridad: Baja
- Precondiciones: usuario autenticado, recién registrado por API, con el producto ya marcado como favorito (`POST /favorites`)
- Pasos:
  1. Abrir la ficha del producto.
  2. Pulsar «Add to favorites».
  3. Abrir «My account» > «Favorites».
- Resultado esperado: se muestra el aviso «Product already in your favorites list.» (la API responde 409) y el producto aparece una sola vez en favoritos.
- Automatizado en: tests/e2e/favorites.spec.ts
