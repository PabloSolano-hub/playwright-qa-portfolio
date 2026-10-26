# Escenarios de negocio — API del carrito

Cada test crea su propio carrito con `POST /carts` y lo elimina al terminar.

### ESC-API-CART-001 — Un carrito nuevo está vacío

- Prioridad: Alta
- Precondiciones: ninguna
- Pasos:
  1. Crear un carrito con `POST /carts`.
  2. Consultarlo con `GET /carts/{id}`.
- Resultado esperado: respuesta 200 con el mismo id y sin productos.
- Automatizado en: tests/api/cart.spec.ts

### ESC-API-CART-002 — Añadir un producto al carrito

- Prioridad: Alta
- Precondiciones: carrito vacío; producto en stock que no es de alquiler
- Pasos:
  1. Enviar `POST /carts/{id}` con el producto y cantidad 2.
  2. Consultar el carrito.
- Resultado esperado: la adición responde 200 y el carrito contiene una línea con ese producto y cantidad 2.
- Automatizado en: tests/api/cart.spec.ts

### ESC-API-CART-003 — Actualizar la cantidad de un producto

- Prioridad: Media
- Precondiciones: carrito con un producto (cantidad 1)
- Pasos:
  1. Enviar `PUT /carts/{id}/product/quantity` con cantidad 5.
  2. Consultar el carrito.
- Resultado esperado: respuesta 200 y la línea del carrito tiene cantidad 5.
- Automatizado en: tests/api/cart.spec.ts

### ESC-API-CART-004 — Eliminar un producto del carrito

- Prioridad: Media
- Precondiciones: carrito con un producto
- Pasos:
  1. Enviar `DELETE /carts/{id}/product/{productId}`.
  2. Consultar el carrito.
- Resultado esperado: respuesta 204 y el carrito queda vacío.
- Automatizado en: tests/api/cart.spec.ts

### ESC-API-CART-005 — Rechazar cantidades no válidas

- Prioridad: Media
- Precondiciones: carrito vacío
- Pasos:
  1. Enviar `POST /carts/{id}` con cantidad 0 y, en otra ejecución, con cantidad -1.
- Resultado esperado: respuesta 422 con el error «The quantity field must be at least 1.» en el campo `quantity`.
- Automatizado en: tests/api/cart.spec.ts

### ESC-API-CART-006 — Rechazar un producto inexistente

- Prioridad: Media
- Precondiciones: carrito vacío
- Pasos:
  1. Enviar `POST /carts/{id}` con un id de producto que no existe.
- Resultado esperado: respuesta 422 con el error «The selected product id is invalid.» en el campo `product_id`.
- Automatizado en: tests/api/cart.spec.ts

### ESC-API-CART-007 — Consultar un carrito inexistente

- Prioridad: Baja
- Precondiciones: ninguna
- Pasos:
  1. Enviar `GET /carts/{id}` con un id que no existe.
- Resultado esperado: respuesta 404 con el mensaje «Requested item not found».
- Automatizado en: tests/api/cart.spec.ts
