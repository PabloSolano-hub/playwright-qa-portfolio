# Escenarios de negocio — Proceso de compra

### ESC-CHECKOUT-001 — Compra completa con pago contra reembolso

- Prioridad: Alta
- Precondiciones: usuario cliente autenticado; carrito con un producto en stock que no es de alquiler, preparado por API (`POST /carts` + `POST /carts/{id}`) y asociado a la sesión del navegador
- Pasos:
  1. Abrir el carrito (`/checkout`), comprobar que contiene el producto y pulsar «Proceed to checkout».
  2. En el paso de identificación, continuar como usuario ya autenticado.
  3. En la dirección de facturación, seleccionar «Spain» e introducir código postal y número; el resto de campos se completa automáticamente.
  4. Elegir «Cash on Delivery» y confirmar.
  5. Confirmar el pedido.
- Resultado esperado: se muestra «Payment was successful» y, tras confirmar, «Thanks for your order!» con un número de factura con formato `INV-<número>`.
- Automatizado en: tests/e2e/checkout.spec.ts
- Defectos observados en la aplicación (documentados, no ocultados):
  - Al entrar en el paso de dirección, el perfil (`GET /users/me`) se carga dos veces y cada carga reinicia el formulario, borrando el código postal y el número ya introducidos por el usuario.
  - La consulta de código postal (`GET /postcode-lookup`) se envía dos veces con los mismos parámetros.
  - El Page Object reintenta el relleno hasta que los datos se mantienen (`expect(...).toPass()`).
