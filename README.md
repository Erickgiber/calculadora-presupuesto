# Calculadora de presupuesto

Calculadora para fijar el precio de venta de un producto a partir de sus materiales, la mano de obra y el margen de ganancia deseado.

Construida con SvelteKit y Tailwind CSS, se compila como una SPA estática y se publica en GitHub Pages.

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

## Versión Margen

La versión visual revisada está disponible en [`/margen/`](https://erickgiber.github.io/calculadora-presupuesto/margen/) y su archivo autocontenido está en `static/margen/index.html`. Incluye inicio, formulario por pasos, total o detalle de materiales, filas con Enter, cálculo de margen, guardado local y fondo degradado. La aplicación Svelte original sigue disponible en la raíz.
