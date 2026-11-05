# 002 — Journal Book · Tasks

- **Estado:** Aprobadas

Leyenda: `[ ]` pendiente · `[x]` completada **y verificada**. Las tareas con verificación *manual* las confirma el usuario. No empezar sin aprobación de spec, plan y tareas.

Las tareas **C5, C6, D5, E3 y F3** se añadieron tras la revisión visual de F2 (RF-13: capturas de una en una en libros de ≤ 550 px). F3 se hace antes de repetir F2.

Las tareas **G4, G5 y G6** se añadieron tras la revisión visual de G3 (título "My Gaming Journal", pestaña para abrir en la esquina inferior derecha y X para cerrar en la esquina superior derecha). G3 se repite al terminarlas.

Los bloques siguen el orden del plan: datos → tokens y textos → lógica → piezas visuales → páginas → doble página → portada → controles → animaciones → integración → verificación. Las animaciones (bloque I) van al final: sin ellas el libro ya es funcional.

## Bloque A — Contratos y datos mock
- [x] A1. En `packages/contracts`, eliminar `likedAspects`/`dislikedAspects` de `JournalEntry` y añadir `likedText?`, `dislikedText?`, `categoryRatings?` (`RATING_CATEGORIES`, `RatingCategory`, `CategoryRatings`) y `suggestedGames?`. *Verif.: `typecheck` de `packages/contracts`.*
- [x] A2. Migrar los datos mock: textos de "gustó / no gustó" (con alguno vacío), `categoryRatings` (3 completas, 1 parcial, 2 ausentes) y `SAMPLE_SUGGESTED_GAMES` (3 títulos genéricos) en la mayoría de entradas, dejando una sin sugeridos. *Verif.: `typecheck`.*
- [x] A3. Adaptar `JournalEntryCard` (Inicio) a `likedText`/`dislikedText` (truncados, o nada si están vacíos), retirar `AspectList` y ajustar el helper de `library.test.ts`. *Verif.: `typecheck` y los tests existentes en verde.*
- [x] A4. Ampliar los tests de servicios mock: nuevos campos, entrada sin sugeridos, categorías parciales y ausentes. *Verif.: `npm test` (servicios).*
- [x] A5. Actualizar `specs/architecture/data-model.md` (campos nuevos, eliminación de las listas, pendiente de "texto libre" resuelto). *Verif.: revisión del documento.*

## Bloque B — Tokens y textos
- [x] B1. Añadir en `styles.css` los tokens `page`, `leather`, `leather-dark`, `emboss`, `gold`, `gold-deep` y `star-gray` con los valores del plan. *Verif.: `build`.*
- [x] B2. Test que lee los tokens de `styles.css` y comprueba los umbrales de contraste del plan (texto ≥ 4.5:1; estrellas ≥ 3:1). *Verif.: `npm test` (contraste).*
- [x] B3. Añadir el grupo `book` en `lib/i18n/es.ts` (portada, controles, indicador, anuncio, secciones, categorías, "Sin calificar", textos de ayuda, capturas, diario vacío) y retirar las claves que dejen de usarse. *Verif.: `typecheck` y búsqueda de claves sin uso.*

## Bloque C — Lógica y hooks
- [x] C1. Crear `lib/book.ts`: `BookLayout`, `BookPosition`, `BOOK_SPREAD_MIN_WIDTH`, `nextPosition`, `previousPosition`, `canGoNext`, `canGoPrevious`, `clampPosition` y `positionLabel`. *Verif.: `lib/book.test.ts` (spread y single, extremos, 0 y 1 entradas, cambio de layout conserva la entrada).*
- [x] C2. Añadir `captureSlots(images)` (siempre 3 posiciones, ignora las sobrantes) y `starOffsets` (desplazamiento y giro por estrella). *Verif.: tests con 0, 1, 3 y más de 3 imágenes; offsets alternos arriba/abajo.*
- [x] C3. Hook `usePrefersReducedMotion`. *Verif.: test con `matchMedia` simulado.*
- [x] C4. Hook `useBookLayout` (medición con `ResizeObserver`); añadir stubs en `test/setup.ts` si `happy-dom` no los ofrece. *Verif.: test con `ResizeObserver` simulado (≥ 720 px → `spread`, menos → `single`).*
- [x] C5. *(RF-13)* En `lib/book.ts` añadir `BOOK_COMPACT_MAX_WIDTH = 550`, `isCompactWidth(width)`, `stepCapture(index, direction)` y `canStepCapture(index, direction)` (se detiene en los extremos, sin vuelta circular). *Verif.: tests en `lib/book.test.ts` (550 es estrecho, 551 no; pasos hacia ambos lados; extremos; índice fuera de rango).*
- [x] C6. *(RF-13)* `useBookLayout` devuelve también `compact` (`[ref, layout, compact]`); los dos primeros valores no cambian. *Verif.: test con `ResizeObserver` simulado (550 → `compact`; 551 → no; cambio al redimensionar; `layout` sin cambios).*

## Bloque D — Piezas visuales del libro
- [x] D1. Componente `HandDrawnStars` (SVG, alternadas arriba/abajo, doradas rellenas / grises de contorno, texto accesible "N de 5 estrellas" o "Sin valoración"). *Verif.: tests (nº de rellenas, etiqueta, desplazamientos alternos) + revisión visual.*
- [x] D2. Componente `CaptureFrame` (marco Polaroid con imagen y `alt`, o placeholder). *Verif.: tests con y sin imagen.*
- [x] D3. Componente `CategoryRatings` (gameplay, historia, música, gráficos con mini-estrellas o "Sin calificar"). *Verif.: tests con categorías completas, parciales y ausentes.*
- [x] D4. `book.css` base: papel de la página, sombras y lomo del libro (sin animación). *Verif.: `build`; el aspecto se revisa en F2.*
- [x] D5. *(RF-13)* Componente `CaptureCarousel` (controlado: `index` y `onIndexChange`): una sola captura en un `CaptureFrame` grande, botones izquierda/derecha con nombre accesible y `aria-disabled` en los extremos, indicador "Captura N de 3" en región `aria-live="polite"`; sin ninguna captura, un único marco vacío sin botones ni indicador. Añadir las claves `book.previousCapture`, `book.nextCapture` y `book.captureIndicator` en `lib/i18n/es.ts`. *Verif.: tests (una sola imagen visible, botones, extremos, indicador y anuncio, clics repetidos, sin capturas, con 1 y 2 imágenes) + revisión visual en F2.*

## Bloque E — Páginas
- [x] E1. `EntryFirstPage`: nombre del juego, carátula (imagen o `CoverPlaceholder`), 3 capturas, estrellas y texto (`review`), con scroll interno accesible si el texto no cabe. *Verif.: tests con entrada completa, mínima, título largo, reseña larga y sin reseña.*
- [x] E2. `EntrySecondPage`: "¿Qué te gustó?", "¿Qué no te gustó?" (con texto de ayuda si están vacíos), calificaciones, "Juegos que podrían gustarte" (se omite sin sugeridos) y estado con `StatusBadge`. *Verif.: tests con los 5 estados, textos vacíos y largos, sin sugeridos.*
- [x] E3. *(RF-13)* `EntryFirstPage` recibe `compactCaptures`: `false` → las 3 capturas en fila; `true` → `CaptureCarousel`. El índice de la captura actual vive en la página y se conserva al alternar entre ambos modos. *Verif.: tests (1 marco visible frente a 3; índice conservado al alternar; sin capturas; con más de 3 imágenes solo se recorren las 3 primeras).*

## Bloque F — Doble página y adaptación
- [x] F1. `BookSpread`: en `spread` muestra las dos páginas; en `single`, una sola, con una cabecera corrida del juego en la segunda. *Verif.: tests con `layout` forzado (en el árbol accesible solo hay una entrada).*
- [x] F3. *(RF-13)* `BookSpread` recibe `compactCaptures` y lo pasa a la primera página, con `key` por entrada para reiniciar la captura al cambiar de entrada; `JournalBook` (G2) lo obtiene de `useBookLayout`. *Verif.: tests de `BookSpread` (el flag llega a la primera página; la captura se reinicia al cambiar de entrada).*
- [x] F2. Revisión visual de la doble página y de la página única a 360 / 550 / 551 / 768 / 1280 px con datos mock, incluido el carrusel de capturas (≤ 550 px). *Verif.: manual (usuario).*

## Bloque G — Portada y abrir/cerrar
- [x] G1. `BookCover`: portada de cuero en CSS, título "Diario de {nombre}" (o "Mi diario"), botón "Abrir el diario". *Verif.: tests (nombre accesible; se activa con clic, `Enter` y `Space`).*
- [x] G2. `JournalBook` (sin animación; obtiene `layout` y `compact` de `useBookLayout` y los acepta como props para forzarlos en tests): inicia cerrado, abre, cierra, reabre desde la primera entrada; foco al contenedor de la entrada al abrir y de vuelta a la portada al cerrar. *Verif.: tests (cerrado al montar, abrir/cerrar, foco, nuevo montaje vuelve a cerrado).*
- [x] G4. *(cambio tras G3)* `BookCover`: título fijo "My Gaming Journal" (se retira `ownerName` y su uso en `JournalBook`) y acción "Abrir el diario" como **pestaña en la esquina inferior derecha**, dentro del mismo botón de la portada. Ajustar `es.ts` (`book.cover.title`) y retirar `titleFallback`. *Verif.: tests de `BookCover` y `JournalBook` actualizados (nombre accesible "My Gaming Journal Abrir el diario"; abre con clic).* 
- [x] G5. *(cambio tras G3)* `BookIconButton` (botón redondo de icono, sin borde, con la sombra de papel y `aria-disabled`) y uso en `CaptureCarousel`. *Verif.: tests de `CaptureCarousel` en verde sin cambios de comportamiento.*
- [x] G6. *(cambio tras G3)* Cierre con una **X en la esquina superior derecha** de las páginas en `JournalBook` (nombre accesible "Cerrar el diario"), en lugar del botón bajo el libro; los títulos que quedan debajo llevan margen derecho. *Verif.: tests de `JournalBook` (cierra, foco vuelve a la portada, un solo botón de cierre) + revisión visual en G3.*
- [x] G3. Revisión visual de la portada (cuero, costuras, relieve, pestaña de abrir) y de la X de cierre. *Verif.: manual (usuario).*

## Bloque H — Controles y accesibilidad
- [x] H1. `BookControls` (con `BookIconButton`): anterior, siguiente (`aria-disabled` en los extremos) e indicador, con etiquetas distintas en `single` ("Página") y `spread` ("Entrada"). *Verif.: tests de extremos y etiquetas.*
- [x] H2. Conectar la navegación en `JournalBook` con `lib/book.ts`: orden de más reciente a más antigua y región `aria-live` ("Entrada 2 de 6: Hades"). *Verif.: tests con datos mock (orden, indicador, anuncio, 1 entrada).*
- [x] H3. Atajo de teclado ← → dentro del libro. *Verif.: test.*
- [x] H4. Estados cargando, error y diario vacío (libro con página en blanco, mensaje y controles inactivos). *Verif.: tests de `JournalBook`/vista.*

## Bloque I — Animaciones (capa visual)
- [x] I1. `PageTurnOverlay` para pasar página en `spread` (siguiente y anterior): capa `aria-hidden`/`inert`, retirada con `animationend` y un temporizador de seguridad. Mientras la capa está montada se ignoran las pulsaciones repetidas de anterior/siguiente (cláusula movida desde H2: sin transición no hay nada que ignorar). *Verif.: tests con temporizadores simulados (capa montada y retirada; pulsaciones repetidas ignoradas durante la transición; el árbol accesible conserva una sola entrada) + manual.*
- [x] I2. Pasar página en `single`. *Verif.: tests + manual.*
- [x] I3. Animación de abrir y cerrar la portada. *Verif.: tests + manual.*
- [x] I4. Movimiento reducido: sin capa animada y con cambio instantáneo. *Verif.: test con `matchMedia` en `reduce` + manual con la opción del sistema.*
- [x] I5. Revisión de fluidez en escritorio y en un móvil real. *Verif.: manual (usuario).*

## Bloque J — Integración
- [x] J1. `JournalPage`: `PageHeader` (único `h1`), título del documento y `JournalBook` en `/journal`, sustituyendo la lista; actualizar `views.test.tsx` (Diario) y retirar los textos i18n sin uso. *Verif.: tests de vista (cargando, error, vacío, con datos) y `routes.test.tsx`.*

## Bloque K — Verificación final
- [ ] K1. `typecheck`, `lint`, `test`, `build` y `prettier --check` pasan.
- [ ] K2. Tabla criterio → evidencia de los 16 criterios de aceptación de la spec.
- [ ] K3. Checklist de accesibilidad: teclado completo, foco visible, anuncios, un único `h1`, contraste de tokens, movimiento reducido, zoom al 200 %. *Verif.: manual (usuario) para teclado, zoom y movimiento reducido.*
- [ ] K4. Revisión responsive (360 / 550 / 551 / 768 / 1280) sin scroll horizontal, con una captura a la vez hasta 550 px y tres en fila desde 551 y cambio de una a dos páginas al redimensionar conservando la entrada. *Verif.: manual (usuario).*
- [ ] K5. Búsquedas: ningún componente importa datos mock, sin textos de UI fijos fuera de `lib/i18n/es.ts`, sin dependencias nuevas ni código de fases futuras.
- [ ] K6. Documentos: estado de spec, plan y tareas a *Implementada/o/as*, `data-model.md` coherente y anotar la revisión pendiente de `CLAUDE.md`.

## Cobertura de los criterios de aceptación

| Criterio | Tareas |
|---|---|
| 1 Cerrado al entrar | G2 |
| 2 Abrir y cerrar (ratón, toque, teclado) | G1, G2, G4, G6, I3 |
| 3 Más reciente primero | H2 |
| 4 Primera página | E1 |
| 5 Segunda página | E2 |
| 6 Estrellas | D1 |
| 7 Navegación y extremos | C1, H1, H2 |
| 8 Datos incompletos | D2, D3, E1, E2 |
| 9 Diario vacío | H4 |
| 10 Cargando y error | H4, J1 |
| 11 Una página en móvil, dos en ancho | C1, C4, F1, F2, K4 |
| 12 Teclado y anuncios | G2, H1, H2, H3, K3 |
| 13 Movimiento reducido | C3, I4 |
| 14 Sin mocks directos ni textos fijos | B3, K5 |
| 15 `typecheck`, `lint`, `test`, `build` | K1 |
| 16 Capturas de una en una en ≤ 550 px | C5, C6, D5, E3, F2, F3, K4 |
