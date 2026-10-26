# Escenarios de negocio — Carrito

### ESC-CARRITO-001 — Añadir un producto al carrito

- Prioridad: Alta
- Precondiciones: existe al menos un producto en stock que no es de alquiler (se obtiene por API)
- Pasos:
  1. Abrir la ficha del producto.
  2. Pulsar «Add to cart».
  3. Abrir el carrito desde el icono de la cabecera.
- Resultado esperado: el contador del carrito muestra «1» y el carrito contiene una única línea con el producto añadido y cantidad 1.
- Automatizado en: tests/e2e/cart.spec.ts
