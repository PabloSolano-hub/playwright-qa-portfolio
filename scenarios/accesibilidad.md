# Escenarios de negocio — Accesibilidad

Auditorías automáticas con axe-core sobre las páginas principales, con las reglas WCAG 2.0 y 2.1 de nivel A y AA (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`), la referencia habitual en la UE (EN 301 549).

Criterio común de todos los escenarios: **el test falla ante cualquier violación nueva**. Los defectos ya conocidos del sitio (aplicación de terceros que no podemos corregir) se listan abajo y en `src/utils/accessibility.ts`; no rompen el CI, pero aparecen como anotaciones en el informe, y el resultado completo de axe se adjunta en JSON a cada test. Si un defecto conocido deja de aparecer, el informe lo señala para revisar la lista.

Las páginas de `/account` no se auditan: en CI reciben el challenge de Cloudflare (ver `scenarios/login.md`).

### ESC-A11Y-001 — Página de inicio accesible

- Prioridad: Media
- Precondiciones: ninguna
- Pasos:
  1. Abrir la página de inicio y esperar a que se muestren los productos.
  2. Ejecutar la auditoría axe (WCAG 2.0/2.1 A + AA).
- Resultado esperado: ninguna violación aparte de los defectos conocidos DEF-A11Y-001 y DEF-A11Y-002.
- Automatizado en: tests/a11y/main-pages.a11y.spec.ts

### ESC-A11Y-002 — Ficha de producto accesible

- Prioridad: Media
- Precondiciones: producto en stock que no es de alquiler (se obtiene por API)
- Pasos:
  1. Abrir la ficha del producto.
  2. Ejecutar la auditoría axe.
- Resultado esperado: ninguna violación aparte de DEF-A11Y-001.
- Automatizado en: tests/a11y/main-pages.a11y.spec.ts

### ESC-A11Y-003 — Página de inicio de sesión accesible

- Prioridad: Alta
- Precondiciones: ninguna
- Pasos:
  1. Abrir `/auth/login` y esperar al formulario.
  2. Ejecutar la auditoría axe.
- Resultado esperado: ninguna violación aparte de DEF-A11Y-001 y DEF-A11Y-003.
- Automatizado en: tests/a11y/main-pages.a11y.spec.ts

### ESC-A11Y-004 — Carrito accesible

- Prioridad: Media
- Precondiciones: carrito con un producto, preparado por API (un carrito vacío no muestra contenido que auditar)
- Pasos:
  1. Abrir el carrito (`/checkout`) y esperar a que se muestre el producto.
  2. Ejecutar la auditoría axe.
- Resultado esperado: ninguna violación aparte de DEF-A11Y-001 y DEF-A11Y-004.
- Automatizado en: tests/a11y/main-pages.a11y.spec.ts

### ESC-A11Y-005 — Formulario de contacto accesible

- Prioridad: Media
- Precondiciones: ninguna
- Pasos:
  1. Abrir `/contact` y esperar al formulario.
  2. Ejecutar la auditoría axe.
- Resultado esperado: ninguna violación aparte de DEF-A11Y-001.
- Automatizado en: tests/a11y/main-pages.a11y.spec.ts

## Defectos de accesibilidad encontrados

| ID           | Regla axe (impacto)                     | Elemento                                                           | Páginas                                 | Descripción                                                                                                                                                            |
| ------------ | --------------------------------------- | ------------------------------------------------------------------ | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DEF-A11Y-001 | `label-content-name-mismatch` (serious) | botón de idioma `#language`                                        | todas                                   | El `aria-label` «Select language» no contiene el texto visible «EN»; un usuario de control por voz que diga «EN» no lo activa (WCAG 2.5.3).                            |
| DEF-A11Y-002 | `list` (serious)                        | listas de filtros de categoría `.checkbox > ul`                    | inicio                                  | Los `<ul>` contienen hijos que no son `<li>`; los lectores de pantalla anuncian mal la estructura (WCAG 1.3.1).                                                        |
| DEF-A11Y-003 | `button-name` (critical)                | botón «mostrar contraseña» (icono de ojo) `.btn-outline-secondary` | login                                   | Botón sin nombre accesible: un lector de pantalla solo anuncia «botón» (WCAG 4.1.2).                                                                                   |
| DEF-A11Y-004 | `label-content-name-mismatch` (serious) | enlace del carrito en la cabecera `a[data-test="nav-cart"]`        | carrito (cabecera con carrito no vacío) | El `aria-label` «cart» no contiene el texto visible (número de artículos) (WCAG 2.5.3). Descubierto por la propia auditoría al ejecutarla con un carrito con producto. |
