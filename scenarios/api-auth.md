# Escenarios de negocio — API de autenticación

Cada test registra su propio usuario por API y lo elimina al terminar. Nunca se envían contraseñas incorrectas a una cuenta compartida: tras tres intentos fallidos la cuenta queda bloqueada para todos (ver ESC-API-AUTH-007).

Todas las peticiones envían `Accept: application/json`: sin esta cabecera, la API responde a los errores de validación con una redirección 302 a una página HTML en lugar de un 422 en JSON.

### ESC-API-AUTH-001 — Inicio de sesión con credenciales válidas

- Prioridad: Alta
- Precondiciones: usuario de prueba registrado por API
- Pasos:
  1. Enviar `POST /users/login` con el correo y la contraseña del usuario.
- Resultado esperado: respuesta 200 con un `access_token` JWT, `token_type` «bearer» y `expires_in` de 300 segundos.
- Automatizado en: tests/api/auth.spec.ts

### ESC-API-AUTH-002 — Inicio de sesión con contraseña incorrecta

- Prioridad: Alta
- Precondiciones: usuario de prueba registrado por API
- Pasos:
  1. Enviar `POST /users/login` con el correo del usuario y una contraseña incorrecta.
- Resultado esperado: respuesta 401 con `{"error": "Unauthorized"}` y sin token.
- Automatizado en: tests/api/auth.spec.ts

### ESC-API-AUTH-003 — El perfil solo se devuelve a usuarios autenticados

- Prioridad: Alta
- Precondiciones: usuario de prueba registrado por API
- Pasos:
  1. Enviar `GET /users/me` sin token.
  2. Iniciar sesión y repetir la petición con el token.
- Resultado esperado: sin token, 401; con token, 200 y el perfil del usuario (id y correo).
- Automatizado en: tests/api/auth.spec.ts

### ESC-API-AUTH-004 — Registro de un usuario nuevo

- Prioridad: Alta
- Precondiciones: ninguna (los datos se generan con Faker)
- Pasos:
  1. Enviar `POST /users/register` con un usuario nuevo.
  2. Iniciar sesión con sus credenciales y consultar `GET /users/me`.
- Resultado esperado: el registro responde 201 con los datos del usuario y sin la contraseña; el inicio de sesión funciona y el perfil corresponde al usuario creado.
- Limpieza: el usuario se elimina al final con la cuenta de administrador.
- Automatizado en: tests/api/auth.spec.ts

### ESC-API-AUTH-005 — Registro con un correo ya existente

- Prioridad: Media
- Precondiciones: usuario de prueba registrado por API
- Pasos:
  1. Enviar `POST /users/register` con un usuario nuevo que reutiliza el correo del usuario existente.
- Resultado esperado: respuesta 409 con el mensaje «A customer with this email address already exists.».
- Automatizado en: tests/api/auth.spec.ts

### ESC-API-AUTH-006 — El cierre de sesión invalida el token

- Prioridad: Media
- Precondiciones: usuario de prueba registrado por API
- Pasos:
  1. Iniciar sesión y comprobar que `GET /users/me` responde 200.
  2. Enviar `GET /users/logout` con ese token.
  3. Repetir `GET /users/me` con el mismo token.
- Resultado esperado: el cierre de sesión responde 200 y, después, el mismo token recibe 401.
- Automatizado en: tests/api/auth.spec.ts

### ESC-API-AUTH-007 — Bloqueo de la cuenta tras tres intentos fallidos

- Prioridad: Alta
- Precondiciones: usuario de prueba registrado por API (desechable: queda bloqueado)
- Pasos:
  1. Enviar tres veces `POST /users/login` con una contraseña incorrecta.
  2. Enviar un cuarto intento con la contraseña incorrecta.
  3. Enviar un intento con la contraseña correcta.
- Resultado esperado: los tres primeros intentos responden 401; el cuarto responde 423 con «Account locked, too many failed attempts. Please contact the administrator.»; con la cuenta bloqueada, la contraseña correcta también recibe 423.
- Automatizado en: tests/api/auth.spec.ts
- Nota: este comportamiento se descubrió al bloquear por error la cuenta pública `customer@practicesoftwaretesting.com` con un test negativo. Desde entonces la suite usa solo usuarios propios.
