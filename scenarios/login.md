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
- Nota de CI: en los runners de GitHub, Cloudflare muestra una verificación anti-bot («Performing security verification») tras la redirección del login; primero solo a Chromium en modo headless y después a los tres navegadores. Por eso este escenario se excluye del CI (etiqueta `@cloudflare-ci`) y se ejecuta en local con los tres navegadores. En CI, el inicio de sesión sigue cubierto por los tests de API (ESC-API-AUTH-001 a 007) y la sesión autenticada por ESC-CHECKOUT-001. No se intenta eludir la protección del sitio. Solución definitiva prevista: ejecutar Toolshop en una instancia propia (Docker) dentro del CI.
