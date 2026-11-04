# 002 — Journal Book · Plan

- **Estado:** Aprobado

## 1. Enfoque

Construir de abajo arriba y de lo estático a lo animado, para poder verificar cada capa antes de añadir la siguiente:

1. Contratos y datos mock (nuevos campos, migración de `likedAspects`/`dislikedAspects`).
2. Tokens visuales y textos.
3. Lógica pura de navegación del libro (`lib/book.ts`), sin React.
4. Piezas visuales: estrellas dibujadas a mano, Polaroids de capturas, calificaciones, páginas 1 y 2.
5. Doble página y adaptación a una sola página.
6. Portada de cuero y abrir/cerrar.
7. Controles, teclado y accesibilidad.
8. Animaciones (abrir/cerrar y pasar página) **al final**, como capa visual añadida; sin ellas el libro ya es plenamente funcional.
9. Integración en `/journal` y verificación.

No cambia ninguna interfaz de `services/`: `JournalService.listEntries()` y `useLibrary` ya entregan las entradas ordenadas de más reciente a más antigua.

## 2. Cambios por área

### 2.1 Contratos (`packages/contracts`)

`JournalEntry` pasa a:

| Campo | Cambio |
|---|---|
| `likedAspects: string[]`, `dislikedAspects: string[]` | **Se eliminan** |
| `likedText?: string`, `dislikedText?: string` | **Nuevos**: texto libre, opcionales (vacío = sin texto) |
| `categoryRatings?: CategoryRatings` | **Nuevo**. `RATING_CATEGORIES = ['gameplay','story','music','graphics']`, `RatingCategory`, `CategoryRatings = Partial<Record<RatingCategory, Rating>>` |
| `suggestedGames?: string[]` | **Nuevo**: títulos (en 002, datos de prueba) |
| `review`, `images`, `status`, `rating`… | Sin cambios. `review` es el texto de la primera página; `images` alimenta las capturas |

### 2.2 Datos mock (`services/mock/data/entries.ts`)

- Migrar los aspectos actuales a `likedText` / `dislikedText` (frases cortas), dejando alguna entrada con uno o ambos vacíos.
- `categoryRatings`: completas en 3 entradas, parciales en 1, ausentes en 2.
- `suggestedGames`: constante `SAMPLE_SUGGESTED_GAMES` con 3 títulos genéricos de prueba, usada en la mayoría de entradas; una entrada sin sugerencias.
- `images` sigue vacío (placeholders). Los casos con imágenes (1, 3 o más de 3) se cubren en tests de componente con URLs ficticias, no en los datos mock.
- Se mantienen los casos límite de 001 (sin valoración, sin reseña, título largo, reseña larga).

### 2.3 Lógica (`apps/web/src/lib/`)

`lib/book.ts` (puro, con tests):

- `type BookLayout = 'spread' | 'single'`; `type BookPosition = { entryIndex: number; side: 'first' | 'second' }`.
- `nextPosition(position, layout, total)`, `previousPosition(...)`, `canGoNext`, `canGoPrevious`: en `spread` un paso es una entrada; en `single` un paso es una página (primera → segunda → siguiente entrada).
- `clampPosition(position, total)` (por si cambia el número de entradas).
- `positionLabel(position, layout, total)` para el indicador y el anuncio.
- `BOOK_SPREAD_MIN_WIDTH = 720` (px): ancho mínimo **del contenedor del libro** para mostrar doble página.
- `captureSlots(images)`: devuelve siempre 3 posiciones (imagen o `undefined`), ignorando las sobrantes.
- `starOffsets`: constantes de desplazamiento y giro por estrella (arriba/abajo alternadas con pequeñas variaciones).

Cambia el cálculo de `buildLibrary`/`computeStats` solo si los tests lo exigen; en principio no.

### 2.4 Hooks (`apps/web/src/hooks/`)

- `useBookLayout()`: mide el ancho del contenedor con `ResizeObserver` y devuelve `[ref, layout]`.
- `usePrefersReducedMotion()`: `matchMedia('(prefers-reduced-motion: reduce)')` con `useSyncExternalStore`.

### 2.5 Componentes (`apps/web/src/features/journal/`)

| Pieza | Responsabilidad |
|---|---|
| `JournalPage.tsx` | Ruta `/journal`: `PageHeader` (el `h1`), estados cargando/error, y `JournalBook` |
| `JournalBook.tsx` | Estado abierto/cerrado y posición; controla foco, anuncios y animaciones; recibe `layout` opcional para forzarlo en tests |
| `BookCover.tsx` | Portada de cuero como botón "Abrir el diario": título "Diario de {nombre}" |
| `BookSpread.tsx` | Una o dos páginas según el layout |
| `EntryFirstPage.tsx` | Nombre, carátula (`CoverPlaceholder`/imagen), 3 capturas, estrellas, texto |
| `EntrySecondPage.tsx` | "¿Qué te gustó?", "¿Qué no te gustó?", calificaciones, sugeridos, estado (`StatusBadge`) |
| `HandDrawnStars.tsx` | Estrellas en SVG, alternadas arriba/abajo, doradas rellenas / grises de contorno |
| `CaptureFrame.tsx` | Marco Polaroid de captura (imagen con `alt` o placeholder) |
| `CategoryRatings.tsx` | Las cuatro categorías con mini-estrellas de lectura |
| `BookControls.tsx` | Anterior, siguiente, indicador, cerrar |
| `PageTurnOverlay.tsx` | Capa visual `aria-hidden` con la animación de pasar página y de abrir/cerrar |
| `book.css` | Perspectiva 3D, `@keyframes`, texturas de cuero y papel (CSS puro) |

- `JournalEntryCard` (Inicio) se adapta a `likedText`/`dislikedText`: muestra cada texto con su etiqueta, truncado a pocas líneas, o nada si está vacío. El componente `AspectList` desaparece.
- `RatingStars` (existente) se mantiene para tarjetas y Polaroids; las estrellas del libro son un componente propio porque su dibujo y su disposición son distintos.

### 2.6 Rutas

Sin rutas nuevas: `/journal` pasa de lista a libro. La tabla de `app/routes.tsx` no cambia.

### 2.7 Textos (`lib/i18n/es.ts`)

Se retiran `journal.liked`, `journal.disliked`, `journal.loggedOn`, `journal.playtime`, `journal.noReview` solo si dejan de usarse (la tarjeta del Inicio los sigue usando; se conservan los que use). Se añade un grupo `book`: portada ("Diario de {name}", "Mi diario", "Abrir el diario"), controles ("Entrada anterior", "Entrada siguiente", "Página anterior/siguiente", "Cerrar el diario"), indicador ("Entrada {n} de {total}", "Página {p} de 2"), anuncio, secciones ("¿Qué te gustó?", "¿Qué no te gustó?", "Calificaciones", "Juegos que podrían gustarte"), categorías (Gameplay, Historia, Música, Gráficos), "Sin calificar", textos de ayuda para campos vacíos, capturas ("Captura {n} de {title}"), diario vacío.

### 2.8 Tokens y estilos (`styles.css` + `book.css`)

Nuevos tokens en `@theme`, con contraste ya calculado:

| Token | Valor | Uso | Contraste |
|---|---|---|---|
| `--color-page` | `#fbf5e6` | Papel de las páginas | cocoa 12.15:1; cocoa-soft 6.47:1 |
| `--color-leather` | `#5a3825` | Portada | cream 9.06:1 |
| `--color-leather-dark` | `#3b2316` | Sombras y bordes de la portada | emboss 9.92:1 |
| `--color-emboss` | `#ecd29c` | Título en relieve y costuras | sobre cuero 7.04:1 |
| `--color-gold` | `#e2a62a` | Relleno de estrella valorada | — |
| `--color-gold-deep` | `#85590a` | Contorno de estrella dorada | 5.63:1 sobre página |
| `--color-star-gray` | `#857f77` | Contorno de estrella sin valorar | 3.64:1 sobre página |

Textura de cuero y de papel: gradientes CSS y un SVG ligero (`feTurbulence`) en `data:` URI usado como `background-image` (se rasteriza una vez). Sin imágenes externas.

## 3. Decisiones técnicas

| Decisión | Justificación | Alternativa descartada |
|---|---|---|
| Animaciones y 3D con **CSS puro** (`perspective`, `rotateY`, `backface-visibility`) | Sin dependencias, control total de accesibilidad y movimiento reducido, solo `transform` | Librería de flipbook (p. ej. react-pageflip): peso, control limitado de a11y, mantenimiento |
| **El DOM real siempre muestra la entrada actual**; la animación es una capa visual `aria-hidden` y `inert` encima, que desaparece al terminar | Lectores de pantalla y tests ven siempre contenido correcto; la animación es prescindible | Renderizar las páginas en tránsito en el DOM accesible: duplicados y confusión |
| La posición cambia **al iniciar** la navegación, no al acabar la animación | El anuncio, el indicador y los controles reflejan el estado real de inmediato | Cambiar al terminar: desfase entre lo visual y lo anunciado |
| **Layout por ancho del contenedor** (≥ 720 px → doble página) con `ResizeObserver` | La barra lateral reduce el ancho útil; un `@media` por viewport daría resultados incorrectos | Media query de viewport (`lg`/`xl`) |
| Navegación en **`lib/book.ts` puro** | Testeable sin DOM; cumple "lógica fuera de los componentes" | Estado ad hoc dentro del componente |
| Un paso en `single` = una **página**; en `spread` = una **entrada** | Coincide con RF-8/RF-10 | Mostrar siempre doble página reducida en móvil: ilegible |
| Controles con **`aria-disabled`** en los extremos, no `disabled` | El foco no se pierde al llegar al final | `disabled`: el foco cae al `body` |
| El foco **no se mueve** al pasar de entrada (queda en el botón) y se anuncia con `role="status"`/`aria-live="polite"`; al **abrir**, el foco va al contenedor de la entrada; al **cerrar**, vuelve a la portada | Predecible para teclado y lectores | Mover el foco en cada paso: interrumpe la lectura repetida |
| Flechas ← → como atajo dentro del libro | Cómodo con teclado; los botones siguen siendo el camino principal (suposición de la spec) | Solo botones |
| Estrellas como **SVG propio** con desplazamientos fijos por posición | Aspecto manual reproducible y testeable; no depende del azar | Aleatorio por render: inestable; reutilizar `RatingStars` (lucide): no es "a mano" |
| **Un `h1` visible** ("Diario") sobre el libro con `PageHeader`; el nombre del juego es `h2` y las secciones de la segunda página `h3` | Consistente con el resto de vistas y la regla de un solo `h1` | `h1` oculto o dentro de la portada |
| Carátula de la entrada: `coverUrl` si existe, si no `CoverPlaceholder` | Reutiliza lo existente | Imagen nueva |
| Sin cambios en las interfaces de `services/` | Los nuevos datos viajan dentro de `JournalEntry` | Nuevo servicio solo para el libro |

## 4. Dependencias nuevas

**Ninguna.** Se usan `lucide-react`, `react-router-dom` y las APIs del navegador (`ResizeObserver`, `matchMedia`). Se comprobará durante la implementación que `happy-dom` (tests) ofrece ambas o se añadirán stubs en `test/setup.ts`.

## 5. Impacto en documentos base

- **`data-model.md`:** actualizar `JournalEntry` (campos nuevos, eliminación de `likedAspects`/`dislikedAspects`) y cerrar el pendiente "texto libre o vocabulario controlado" (texto libre). Se hace al cerrar el bloque de contratos.
- **`architecture.md`:** sin cambios. No hace falta ADR: no cambia ninguna decisión arquitectónica (CSS puro dentro del stack).
- **`README.md` / `CLAUDE.md`:** `CLAUDE.md` se deja como está (indicación del usuario); se anota para revisarlo al cerrar la feature.
- **`spec.md` de 001:** sin cambios.

## 6. Estrategia de verificación

### Automática

| Criterio de la spec | Cómo se verifica |
|---|---|
| 1–2 Cerrado al entrar; abrir/cerrar con ratón y teclado | Test de `JournalBook`: portada primero; clic y `Enter`/`Space` abren; cerrar vuelve a la portada; recarga (nuevo render) vuelve a cerrado |
| 3 Más reciente primero | Test con los datos mock |
| 4–5 Contenido de ambas páginas | Tests de `EntryFirstPage` y `EntrySecondPage` con entrada completa |
| 6 Estrellas | Test de `HandDrawnStars`: nº de rellenas, `aria-label`, desplazamiento alterno por posición |
| 7 Navegación y extremos | Tests de `lib/book.ts` y del componente (`aria-disabled`, indicador, orden) |
| 8 Datos incompletos | Tests con entrada mínima; capturas 0/1/3/>3 |
| 9 Diario vacío | Test de vista con servicio vacío |
| 10 Cargando / error | Tests de `JournalPage` (patrón de `views.test.tsx`) |
| 11 Una página en móvil / dos en ancho | Tests con `layout` forzado; test de `useBookLayout` con `ResizeObserver` simulado |
| 12 Teclado y anuncios | Test de flechas, de la región `aria-live` y del foco al abrir/cerrar |
| 13 Movimiento reducido | Test con `matchMedia` simulado: no se monta `PageTurnOverlay`; test con temporizadores simulados de que la capa se retira |
| 14 Sin mocks directos / textos i18n | Búsquedas (`grep`) en la verificación final |
| 15 `typecheck`, `lint`, `test`, `build`, `prettier` | Comandos |
| Contrastes de los tokens nuevos | Test que lee los tokens de `styles.css` y comprueba los umbrales de la tabla 2.8 |

### Manual (la hace el usuario)

- Aspecto: portada de cuero, páginas, Polaroids, estrellas a mano.
- Animaciones de abrir, cerrar y pasar página (fluidez en escritorio y móvil real).
- Responsive a 360 / 768 / 1280 px, sin scroll horizontal, cambio de una a dos páginas al redimensionar.
- Teclado completo y, si es posible, lector de pantalla.
- "Reducir movimiento" activado en el sistema.
- Zoom de texto al 200 %.

## 7. Riesgos

| Riesgo | Mitigación |
|---|---|
| El efecto 3D de pasar página es lo más delicado (z-order, `backface-visibility`, Safari) | Construirlo al final como capa independiente; versión inicial mínima (una hoja que gira) y refinar; si falla en algún navegador, degradar a fundido |
| Rendimiento en móviles (sombras, texturas, 3D) | Solo `transform`/`opacity`, `will-change` únicamente durante la animación, textura rasterizada como `background-image`, sombras sencillas |
| Contenido que no cabe en una página (reseña larga) | Zona de texto con scroll interno y foco alcanzable; se prueba con la reseña larga de los mock |
| Doble contenido (capa animada y DOM real) confunde a lectores | Capa `aria-hidden` + `inert`; test de que en el árbol accesible solo hay una entrada |
| `happy-dom` no implementa `ResizeObserver`/`matchMedia` como se necesita | Prop `layout` forzable y stubs en el setup; el cálculo de ancho queda aislado en un hook |
| Migración de `likedAspects`/`dislikedAspects` rompe tests y la tarjeta del Inicio | Hacer la migración en el primer bloque, con `typecheck` y tests en verde antes de seguir |
| Estética que dañe la legibilidad | Tokens con contraste verificado, texto siempre sobre `--color-page`, manuscrita solo en acentos |
| Ancho de 720 px poco adecuado en algún equipo | Constante única `BOOK_SPREAD_MIN_WIDTH`, fácil de ajustar tras la revisión del usuario |
