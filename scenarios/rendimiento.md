# Escenarios de negocio — Rendimiento

El sistema bajo prueba es una demo pública y compartida, así que la prueba de carga es **deliberadamente pequeña**: comprueba que la API de productos responde con tiempos razonables bajo un uso ligero, no busca su límite. Nunca se ejecuta en cada push ni en el CI diario: solo a mano (`workflow_dispatch` o `npm run test:perf`) o cuando cambia el propio script.

### ESC-PERF-001 — La API de productos responde bajo carga ligera

- Prioridad: Media
- Precondiciones: k6 instalado (en CI lo instala `grafana/setup-k6-action`); fuera de la ventana de reinicio horario de la base de datos de la demo (minutos 58 a 02 UTC), que el script detecta y rechaza
- Pasos:
  1. Obtener por API la primera página de productos para conocer ids reales.
  2. Durante 1 minuto, con hasta 3 usuarios virtuales y 1-3 s de pausa entre iteraciones (≈4 peticiones/s en el pico), repetir:
     1. `GET /products?page=<aleatoria>`,
     2. `GET /products/<id aleatorio>`,
     3. `GET /products/search?q=<término aleatorio>`.
- Resultado esperado:
  - menos del 1 % de peticiones fallidas;
  - más del 99 % de checks correctos (status 200, datos coherentes);
  - p95 del tiempo de respuesta por debajo de 1500 ms en cada endpoint (listado, detalle y búsqueda).
- Automatizado en: performance/products-load.js (workflow `.github/workflows/performance.yml`)
