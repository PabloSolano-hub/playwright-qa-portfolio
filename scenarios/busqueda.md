# Escenarios de negocio — Búsqueda

### ESC-BUSQUEDA-001 — Buscar productos por palabra clave

- Prioridad: Alta
- Precondiciones: ninguna (la búsqueda está disponible para cualquier visitante)
- Pasos:
  1. Abrir la página principal.
  2. Escribir «pliers» en el buscador.
  3. Pulsar «Search».
- Resultado esperado: se muestra el texto «Searched for: pliers» y todos los productos listados contienen «pliers» en su nombre.
- Automatizado en: tests/e2e/search.spec.ts
- Nota: el texto de búsqueda aparece antes de que se actualice la lista; durante un instante se ven resultados anteriores. El test espera a la respuesta de la API y valida la lista con aserciones que reintentan.
