# Escenarios de negocio — API de favoritos

Cubren en CI las reglas de negocio de `ESC-FAVORITOS-001/002`, cuyos tests de interfaz se excluyen del CI por el challenge de Cloudflare en las páginas de `/account` (ver `scenarios/favoritos.md`). Cada test usa su propio usuario registrado por API; al terminar se borran sus favoritos y después el usuario.

### ESC-API-FAV-001 — Añadir un producto a favoritos

- Prioridad: Media
- Precondiciones: usuario autenticado, recién registrado por API y sin favoritos; producto en stock que no es de alquiler
- Pasos:
  1. Enviar `POST /favorites` con el id del producto.
  2. Consultar `GET /favorites`.
- Resultado esperado: la creación responde 201 y la lista contiene únicamente ese producto.
- Automatizado en: tests/api/favorites.spec.ts

### ESC-API-FAV-002 — Rechazar un favorito duplicado

- Prioridad: Baja
- Precondiciones: usuario autenticado, recién registrado por API, con el producto ya en favoritos
- Pasos:
  1. Enviar de nuevo `POST /favorites` con el mismo producto.
  2. Consultar `GET /favorites`.
- Resultado esperado: la API responde 409 y la lista sigue teniendo un solo favorito.
- Automatizado en: tests/api/favorites.spec.ts
