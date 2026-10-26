# Escenarios de negocio — Inicio de sesión

### ESC-LOGIN-001 — Inicio de sesión con credenciales válidas

- Prioridad: Alta
- Precondiciones: usuario cliente registrado (`customer@practicesoftwaretesting.com`); sin sesión iniciada
- Pasos:
  1. Abrir la página de inicio de sesión (`/auth/login`).
  2. Introducir el correo electrónico y la contraseña del cliente.
  3. Pulsar «Login».
- Resultado esperado: el usuario es redirigido a «My account», el título de la página es «My account» y el menú de usuario muestra su nombre («Jane Doe»).
- Automatizado en: tests/e2e/login.spec.ts
