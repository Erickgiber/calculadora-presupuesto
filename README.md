# Calculadora de presupuesto

Calculadora para fijar el precio de venta de un producto a partir de sus materiales, la mano de obra y el margen de ganancia deseado.

La aplicación es el archivo autocontenido `static/index.html`, que se publica en la raíz del sitio. Incluye inicio, formulario por pasos con producción por unidad o por lote, total o detalle de materiales, filas con Enter, cálculo de margen, guardado local y plantillas visuales. SvelteKit se usa como paso de build para generar el sitio estático que se publica en GitHub Pages.

## Desarrollo

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

El resultado queda en `build/`. Para servirlo bajo una subruta, define `BASE_PATH` (por ejemplo `BASE_PATH=/calculadora-presupuesto npm run build`).

## Despliegue

Cada push a `main` ejecuta el workflow [`deploy.yml`](.github/workflows/deploy.yml), que compila el sitio y lo publica en GitHub Pages.

La ruta anterior `/margen/` redirige a la raíz para no romper enlaces existentes.
