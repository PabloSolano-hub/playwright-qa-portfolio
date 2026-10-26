# Escenarios de negocio — Filtros del catálogo

### ESC-FILTRO-001 — Filtrar productos por categoría

- Prioridad: Media
- Precondiciones: ninguna
- Pasos:
  1. Abrir la página principal.
  2. Marcar la categoría «Hammer» en el panel de filtros.
- Resultado esperado: la lista se actualiza y todos los productos mostrados pertenecen a la categoría «Hammer» (su nombre contiene «hammer»).
- Automatizado en: tests/e2e/filter.spec.ts
