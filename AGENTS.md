# Reglas para agentes de IA

Estas reglas aplican a cualquier agente (Codex, Cursor, Copilot, Claude Code, Gemini u otro) que trabaje en este repositorio. Si algo de este archivo choca con una instrucción explícita del usuario, gana el usuario.

## 1. No romper lo que ya funciona

- Cambia solo lo que se pidió. No reescribas, renombres ni "mejores" código que no forma parte de la tarea.
- No cambies textos, cálculos, validaciones ni flujos existentes sin que se pida.
- Los datos guardados en `localStorage` deben seguir abriéndose:
  - Las claves `margen-calculos` y `margen-preferencias` y sus campos en español (`producto`, `modoProduccion`, `itemsMateriales`, `tema`, `plantilla`, etc.) no se cambian.
  - Si agregas un campo, léelo con un valor por defecto para que los registros antiguos sigan funcionando. La traducción entre el formato guardado y el modelo en inglés vive solo en `src/lib/storage/`.
- Antes de terminar, ejecuta y deja en verde: `bun run check`, `bun run lint` y `bun run build`.
- Si tocas la interfaz, revísala en teléfono (390 px), tablet (820 px) y escritorio (1440 px), sin desbordamiento horizontal a 320 px.

## 2. Ahorrar tokens

- Usa el mapa del proyecto (sección 4) para ir directo al archivo. No explores el repositorio completo.
- Lee solo los archivos y las secciones que necesitas. No vuelvas a leer lo que ya leíste.
- Prefiere ediciones pequeñas y puntuales a reescribir archivos completos.
- Respuestas breves: qué cambiaste, dónde y cómo lo verificaste. Sin resúmenes largos ni repetir el código.
- Si la tarea es ambigua o hay más de una interpretación razonable, **pregunta antes de implementar**. Una pregunta corta cuesta menos que rehacer el trabajo.

## 3. Calidad del código

- Código en inglés (variables, funciones, tipos, archivos, carpetas y rutas). Los textos que ve el usuario, en español.
- Sin comentarios en el código, tampoco directivas como `eslint-disable` o `svelte-ignore`. Resuelve la causa.
- Nada sin usar: ni variables, ni funciones, ni exportaciones, ni componentes, ni estilos, ni dependencias. Si algo queda huérfano, elimínalo.
- Funciones pequeñas con una sola responsabilidad y nombres descriptivos.
- Reutiliza antes de crear: revisa `src/lib/components/ui/` y `src/lib/calculation/` antes de escribir algo nuevo.
- Svelte 5 con runas (`$state`, `$derived`, `$props`, `$effect`) y TypeScript estricto, sin `any`.
- Navegación con `resolve()` de `$app/paths` y rutas tipadas (`RouteId`).
- Estilos:
  - Dentro de cada componente (`<style>` con alcance local). En `src/lib/styles/app.css` van solo los tokens y las primitivas compartidas (`.card`, `.surface-form`, `.eyebrow`, `.help`, `.money`, etc.).
  - Colores siempre con variables `--app-*`. Las paletas por plantilla y modo están en `src/lib/styles/themes.css`.
  - Diseño desde el teléfono hacia arriba, con cortes en `720px` (tablet) y `1024px` (escritorio).
- Accesibilidad: etiquetas en los campos, `aria-*` donde corresponda, objetivos táctiles de al menos 44 px y foco visible.
- Formato con Prettier (`bun run format`). Respeta el estilo existente: tabulaciones y comillas simples.

## 4. Mapa del proyecto

| Ruta                     | Contenido                                                                 |
| ------------------------ | ------------------------------------------------------------------------- |
| `src/routes/`            | Páginas: inicio, `calculator/*` (pasos del cálculo), historial y cuenta   |
| `src/lib/calculation/`   | Modelo del cálculo, precio y validaciones (funciones puras)               |
| `src/lib/state/`         | Estado global con runas: cálculo en curso, historial y preferencias       |
| `src/lib/storage/`       | Lectura y escritura en `localStorage`, compatibles con los datos antiguos |
| `src/lib/components/ui/` | Componentes genéricos: `Button`, `FormField`, `ChoiceCards`, etc.         |
| `src/lib/components/*/`  | Componentes por dominio: `layout`, `calculator` y `account`               |
| `src/lib/theme/`         | Plantillas visuales, modo claro u oscuro y su aplicación al documento     |
| `src/lib/format/`        | Formato de números, dinero y fechas                                       |
| `src/lib/styles/`        | Tokens, paletas (`themes.css`) y fondos decorativos (`patterns.css`)      |

## 5. Herramientas y git

- Usa Bun en local (`bun install`, `bun run …`). El lockfile oficial es `package-lock.json`: si cambias dependencias, actualízalo con `npm install --package-lock-only`.
- Mensajes de commit y PR en español, sin firmas ni atribuciones de herramientas o agentes.
- No hagas commit, push ni merge si el usuario no lo pide.
