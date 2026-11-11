# Calculadora de presupuesto

Calculadora para fijar el precio de venta de un producto a partir de sus materiales, la mano de obra y el margen de ganancia deseado.

La aplicación está hecha con SvelteKit, Svelte 5 y TypeScript. Se compila como un sitio estático y se publica en GitHub Pages. Funciona en teléfono, tablet y escritorio, e incluye:

- Formulario por pasos con producción por unidad o por lote.
- Materiales como total o en detalle.
- Cálculo del margen.
- Historial y preferencias guardados en el navegador.
- Plantillas visuales con modo claro u oscuro.

## Desarrollo

```sh
bun install
bun run dev
```

## Verificación

```sh
bun run check
bun run lint
bun run build
bun run preview
```

El resultado queda en `build/`. Para servirlo bajo una subruta, define `BASE_PATH` (por ejemplo `BASE_PATH=/calculadora-presupuesto bun run build`).

## Estructura

- `src/routes/`: páginas de la aplicación.
- `src/lib/calculation/`: modelo, cálculo del precio y validaciones.
- `src/lib/state/`: estado global (cálculo en curso, historial y preferencias).
- `src/lib/storage/`: persistencia en `localStorage`, compatible con los datos ya guardados.
- `src/lib/components/`: componentes reutilizables.
- `src/lib/styles/`: tokens de diseño, paletas y fondos decorativos.

Las reglas para agentes de IA están en [`AGENTS.md`](AGENTS.md).

## Despliegue

Cada push a `main` ejecuta el workflow [`deploy.yml`](.github/workflows/deploy.yml), que compila el sitio y lo publica en GitHub Pages. La ruta anterior `/margen/` redirige a la raíz para no romper enlaces existentes.
