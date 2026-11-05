# CLAUDE.md

Este archivo ofrece orientación a Claude Code (claude.ai/code) cuando trabaja con el código de este repositorio.

## Proyecto

Game Journal: un diario personal de videojuegos con estética "cozy scrapbook". Es un monorepo con npm workspaces (`apps/web`, `packages/contracts`). Solo existe el frontend, que funciona con **datos mock**. `apps/api` (Express + MongoDB), la autenticación, la persistencia y los proveedores externos de juegos no se han construido todavía a propósito (ver `specs/decisions/ADR-001-frontend-first.md`).

## Flujo de trabajo (Spec Driven Development)

- El trabajo sigue Specify → Clarify → Plan → Tasks → Implement → Verify. Cada feature vive en `specs/features/NNN-nombre/` con `spec.md`, `plan.md` y `tasks.md`. **No se implementa nada sin una spec aprobada**, y no se amplía el alcance. `specs/constitution.md` contiene las reglas permanentes.
- Cada documento lleva `- **Estado:** …` en su cabecera, con un vocabulario cerrado. Solo la skill indicada cambia el estado, y siempre tras preguntar al usuario con `AskUserQuestion`:

  | Documento  | Ciclo de estados                                         | Quién lo cambia                                                                              |
  | ---------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
  | `spec.md`  | `Borrador` → `Clarificada` → `Aprobada` → `Implementada` | specify crea `Borrador`; clarify fija `Clarificada` y `Aprobada`; verify fija `Implementada` |
  | `plan.md`  | `Borrador` → `Aprobado` → `Implementado`                 | plan (aprobación); verify                                                                    |
  | `tasks.md` | `Borrador` → `Aprobadas` → `Implementadas`               | tasks (aprobación); verify                                                                   |

  Si se edita de fondo un documento `Aprobado`, vuelve a `Borrador` y hay que reaprobarlo (y revisar los documentos que dependen de él).

- Las features 001 (`001-app-shell`) y 002 (`002-journal-book`) están implementadas. La siguiente feature necesita una spec nueva y la aprobación del usuario antes de empezar.
- Una tarea se marca `[x]` en `tasks.md` solo después de verificarla. Las comprobaciones visuales (aspecto, responsive) las verifica el usuario, no Claude.
- Se habla con el usuario en español; el código, los identificadores y los mensajes de commit van en inglés.
- No ejecutar nunca `git commit` por iniciativa propia. El usuario quiere ver el mensaje exacto del commit antes de que se ejecute, y ha pedido que no se añada la línea `Co-Authored-By`.
- Las decisiones de producto confirmadas (stack, estilo Cozy Scrapbook, una entrada editable por juego, autenticación posterior) no cambian sin justificación y aprobación.

## Comandos

Ejecutar desde la raíz del repositorio:

```bash
npm install
npm run dev          # Vite en http://localhost:5173
npm run build        # tsc + vite build (apps/web)
npm run typecheck    # todos los workspaces
npm run lint         # eslint . (incluye jsx-a11y)
npm test             # vitest run (apps/web)
npx prettier --check .
```

Un solo archivo de test, o un test por nombre:

```bash
npm test -w @game-journal/web -- src/lib/library.test.ts
npm test -w @game-journal/web -- -t "patrón"
```

Problemas conocidos:

- Pasar flags a través del script raíz (`npm run dev -- --port 5199`) no los reenvía bien. Para flags personalizados, ejecutar `npx vite --port 5199` desde `apps/web`.
- Los tests usan **happy-dom**, no jsdom: con Node 22.14, jsdom 30 (por `undici` 8) hace fallar el worker de vitest, y vitest 4 + jsdom provocó un bug del resolvedor de npm. No volver a jsdom sin comprobarlo antes.
- TypeScript está fijado en ~6.0 y ESLint en 9, porque typescript-eslint (`<6.1`) y eslint-plugin-jsx-a11y (`eslint <=9`) todavía no soportan versiones mayores más nuevas.
- Si `npm install` falla con `Cannot read properties of null (reading 'edgesOut')`, borrar `node_modules` y `package-lock.json` y reinstalar.

## Arquitectura

La regla clave: **los componentes nunca tocan datos mock.** El flujo es

`página/componente → hook → interfaz de servicio (src/services/types.ts) → servicio mock → datos mock`

- `apps/web/src/services/index.ts` exporta el objeto `services` activo (implementación mock con un retardo simulado de 250 ms). Cambiar a servicios HTTP en la fase de backend no debería obligar a tocar ninguna vista. Por eso los métodos de servicio devuelven `Promise`, y el mock devuelve copias hechas con `structuredClone`. Solo `services/` puede importar desde `services/mock`.
- Los tipos de dominio (`User`, `Game`, `JournalEntry`, `GameStatus`, `CategoryRatings`) viven en `packages/contracts` y se consumen como código fuente TypeScript (`main` apunta a `src/index.ts`; no hay paso de build). Se importan como `@game-journal/contracts`. Los datos mock están tipados con ellos.
- La carga de datos pasa por `hooks/useAsync` (`loading | success | error`). La función de carga que se le pasa **debe ser referencialmente estable** (función a nivel de módulo o `useCallback`); una función nueva vuelve a disparar la carga. `hooks/useLibrary` carga juegos y entradas y ejecuta la lógica pura de `lib/library.ts` (`buildLibrary`, `computeStats`) para producir la colección, el diario (de más reciente a más antiguo) y las estadísticas. La lógica de negocio va en `lib/` o en hooks, no en los componentes.
- Rutas: `app/routes.tsx` exporta la tabla de rutas (para que los tests usen `createMemoryRouter`); `app/App.tsx` la envuelve en `createBrowserRouter`. `AppLayout` aporta el enlace "saltar al contenido", la Sidebar (escritorio), la MobileNav (barra inferior, por debajo de `md`) y el Header, y da foco a `<main>` al cambiar de ruta. Las páginas de cada feature están en `features/<nombre>/`; los componentes compartidos con conocimiento del dominio están en `components/`, y las piezas genéricas del Design System en `components/ui/`.
- Todo el texto de la interfaz está en `lib/i18n/es.ts`, y se usa con `useT()` / `t(clave, params)` (las claves se comprueban en tiempo de compilación; admite marcadores `{nombre}`). Solo existe el español; la estructura está preparada para añadir inglés y un selector de idioma (una feature futura). Nunca escribir textos visibles al usuario directamente en los componentes.
- Los estilos usan Tailwind CSS v4, con los tokens definidos en `@theme` dentro de `apps/web/src/styles.css` (paleta `cream/paper/cocoa/sage/rose/orange/blue` más las variantes `*-deep`, fuentes `display/sans/hand`, `shadow-paper`). Los pares de color de texto se comprobaron contra WCAG AA; al añadir combinaciones de color nuevas hay que volver a comprobar el contraste (≥ 4.5:1). Los elementos decorativos llevan `aria-hidden` y el movimiento (inclinación, elevación al pasar el ratón) se condiciona con `motion-safe:`.
- `/journal` es **un libro** (`features/journal/JournalBook.tsx`): portada cerrada, una doble página por entrada en pantallas anchas (≥ 720 px de ancho del libro; una sola página por debajo) y capturas de una en una con flechas hasta 550 px. La navegación es lógica pura y testeada en `lib/book.ts`; el diseño se mide sobre el contenedor con `hooks/useBookLayout` (`ResizeObserver`; devuelve `[ref, layout, compact]`) y el movimiento reducido con `hooks/usePrefersReducedMotion`. El DOM real siempre muestra la entrada actual: las animaciones (abrir/cerrar la portada, pasar página) son **capas decorativas** (`aria-hidden`, `inert`, `pointer-events: none`, solo `transform`/`opacity`) que se retiran con `animationend` y un temporizador de seguridad (`BOOK_ANIMATION_SAFETY_MS`), y se omiten con movimiento reducido. Mientras animan se ignoran las pulsaciones. Los estilos del libro (papel, cuero, hojas, fotogramas clave) están en `features/journal/book.css`; los tokens propios (`page`, `leather`, `gold`, `star-gray`, `star-off`…) en `styles.css`, con contraste comprobado en `styles.test.ts` (las estrellas sin valorar `star-off` son una excepción documentada: el estado siempre se anuncia como texto).

## Convenciones a tener en cuenta

- TypeScript estricto (`noUncheckedIndexedAccess`, `verbatimModuleSyntax`); usar el alias `@/` para `apps/web/src`.
- Cada vista renderiza exactamente un `h1` (mediante `PageHeader`) y llama a `useDocumentTitle`. No usar `<header>` dentro del contenido de las páginas: contaría como un segundo landmark de banner en los tests.
- Los tests viven junto al código (`*.test.ts(x)`). Por defecto no hacen falta temporizadores simulados (solo los tests de animaciones del libro, que usan `vi.useFakeTimers()` para el temporizador de seguridad): los tests de servicios usan `createMockServices()` sin retardo, y los tests de vistas sobrescriben los servicios con `vi.spyOn(services.x, 'method')`. **Los tests parten de movimiento reducido** (`window.matchMedia` simulado en `test/setup.ts`): para probar animaciones hay que llamar a `allowMotion()` de `test/motion.ts`. Hay que esperar a la interfaz asíncrona (por ejemplo el saludo del header) antes de terminar un test, para evitar actualizaciones de estado tardías.
