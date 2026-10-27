# Escenarios de negocio — Inicio de sesión

### ESC-LOGIN-001 — Inicio de sesión con credenciales válidas

- Prioridad: Alta
- Precondiciones: usuario de prueba dedicado, registrado por API al inicio de la ejecución (no se usa la cuenta pública compartida); sin sesión iniciada
- Pasos:
  1. Abrir la página de inicio de sesión (`/auth/login`).
  2. Introducir el correo electrónico y la contraseña del usuario de prueba.
  3. Pulsar «Login».
- Resultado esperado: el usuario es redirigido a «My account», el título de la página es «My account» y el menú de usuario muestra su nombre y apellido.
- Automatizado en: tests/e2e/login.spec.ts
- Nota de CI: en los runners de GitHub, Cloudflare muestra una verificación anti-bot («Performing security verification») a Chromium en modo headless tras la redirección del login, por lo que en CI este escenario se excluye solo del job de Chromium (etiqueta `@cloudflare-chromium-ci`). Se sigue ejecutando en CI con Firefox y WebKit y en local con los tres navegadores. No se intenta eludir la protección del sitio. Solución definitiva prevista: ejecutar Toolshop en una instancia propia (Docker) dentro del CI.
