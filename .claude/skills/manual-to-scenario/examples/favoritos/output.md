# Salida de la skill (ejecución real sobre `input.md`)

Resumen generado al final de la ejecución, tal como lo recibe el revisor. Los archivos citados forman parte del repositorio.

## Resumen para revisión — ESC-FAVORITOS-001, ESC-FAVORITOS-002

- **Caso manual:** CP-27 Favoritos: añadir un producto a favoritos, verlo en «Favoritos» y que un segundo clic no lo duplique.
- **Escenarios creados:** `ESC-FAVORITOS-001` (añadir) y `ESC-FAVORITOS-002` (añadir de nuevo sin duplicar) en `scenarios/favoritos.md`. El caso manual mezclaba dos comportamientos, así que se separó en dos escenarios.
- **Código:**
  - nuevo `src/api/favorites-client.ts`;
  - nuevo `src/pages/favorites.page.ts`;
  - `src/pages/product.page.ts` (+ `addToFavorites()`, `toast()`);
  - `src/fixtures/test.ts` (+ `favoritesPage`, `userToken`, `favoritesApi`);
  - nuevo `tests/e2e/favorites.spec.ts` (con cabecera `DRAFT`).
- **Validación:** lint ✅ · tsc ✅ · format ✅ · spec 4/4 passed (`--repeat-each=2`, chromium) · suite completa API 20/20 y E2E chromium 9/9.
- **Supuestos:**
  - área «favoritos»;
  - prioridad Media para 001 y Baja para 002;
  - «cualquier producto» = un producto en stock y no de alquiler obtenido por API;
  - «un mensaje» = el toast «Product added to your favorites list.»;
  - «no debería duplicarse» = la página de favoritos muestra el producto una sola vez.
- **Dudas para el autor del caso:**
  - ¿El aviso de duplicado («Product already in your favorites list.») es el comportamiento esperado, o el botón debería quitar el favorito (toggle)?
  - ¿Hace falta cubrir también el borrado desde «Favoritos» (botón `delete`)?
- **Comportamiento de la app a tener en cuenta:**
  - El toast no tiene `data-test`; se localiza por rol `alert` y texto.
  - En el segundo clic conviven dos toasts (el anterior aún visible), por eso se filtra por texto.
  - La API responde 409 al duplicado.
  - Un usuario con favoritos no se puede borrar (409): el fixture borra los favoritos antes que el usuario.
  - Con el usuario dedicado compartido, los tres navegadores en paralelo competirían por los mismos favoritos, así que cada test usa su propio usuario registrado.
- **Pendiente antes de quitar el DRAFT:**
  - [ ] Confirmar con el autor el comportamiento del segundo clic (aviso vs. toggle).
  - [ ] Confirmar las prioridades.
  - [ ] Revisar que los textos del toast son contrato estable y no copy que pueda cambiar.
  - [x] Ver el primer run de CI en firefox/webkit (no instalados en local) y confirmar que `/account/favorites` no recibe el challenge de Cloudflare.

## Resultado del primer run de CI (después de la revisión)

- El punto pendiente se confirmó: en CI, `/account/favorites` recibe el challenge de Cloudflare en los tres navegadores. La parte de la ficha de producto (`POST /favorites` + toast) sí pasó.
- Decisión del dueño del repositorio:
  - los tests de interfaz se etiquetan `@cloudflare-ci` (se ejecutan en local);
  - las reglas de negocio se cubren en CI con `ESC-API-FAV-001/002` (`tests/api/favorites.spec.ts`).
- Esta lección se añadió a las salvaguardas de `SKILL.md`: si el flujo pasa por `/account`, proponer desde el principio un test de API equivalente.
