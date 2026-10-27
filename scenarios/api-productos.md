# Escenarios de negocio — API de productos

### ESC-API-PROD-001 — Listado de productos paginado

- Prioridad: Alta
- Precondiciones: ninguna
- Pasos:
  1. Enviar `GET /products?page=1`.
- Resultado esperado: respuesta 200 con la página 1, 9 productos por página, un total mayor que una página y cada producto con id, nombre, precio y disponibilidad.
- Automatizado en: tests/api/products.spec.ts

### ESC-API-PROD-002 — Consultar un producto por su id

- Prioridad: Alta
- Precondiciones: existe un producto (se obtiene del listado)
- Pasos:
  1. Enviar `GET /products/{id}`.
- Resultado esperado: respuesta 200 con el mismo id, nombre y precio que en el listado.
- Automatizado en: tests/api/products.spec.ts

### ESC-API-PROD-003 — Consultar un producto inexistente

- Prioridad: Media
- Precondiciones: ninguna
- Pasos:
  1. Enviar `GET /products/{id}` con un id que no existe.
- Resultado esperado: respuesta 404 con el mensaje «Requested item not found».
- Automatizado en: tests/api/products.spec.ts

### ESC-API-PROD-004 — Buscar productos por palabra clave

- Prioridad: Alta
- Precondiciones: ninguna
- Pasos:
  1. Enviar `GET /products/search?q=pliers`.
- Resultado esperado: respuesta 200 con al menos un producto y todos los nombres contienen «pliers».
- Automatizado en: tests/api/products.spec.ts

### ESC-API-PROD-005 — Filtrar productos por categoría

- Prioridad: Media
- Precondiciones: existe un producto (su categoría se usa como filtro)
- Pasos:
  1. Enviar `GET /products?by_category={id}`.
- Resultado esperado: respuesta 200 con al menos un producto y todos pertenecen a esa categoría.
- Automatizado en: tests/api/products.spec.ts
