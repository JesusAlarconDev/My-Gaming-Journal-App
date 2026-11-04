# 002 — Journal Book · Tasks

- **Estado:** Aprobadas

Leyenda: `[ ]` pendiente · `[x]` completada **y verificada**. Las tareas con verificación *manual* las confirma el usuario. No empezar sin aprobación de spec, plan y tareas.

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

## Bloque D — Piezas visuales del libro
- [ ] D1. Componente `HandDrawnStars` (SVG, alternadas arriba/abajo, doradas rellenas / grises de contorno, texto accesible "N de 5 estrellas" o "Sin valoración"). *Verif.: tests (nº de rellenas, etiqueta, desplazamientos alternos) + revisión visual.*
- [ ] D2. Componente `CaptureFrame` (marco Polaroid con imagen y `alt`, o placeholder). *Verif.: tests con y sin imagen.*
- [ ] D3. Componente `CategoryRatings` (gameplay, historia, música, gráficos con mini-estrellas o "Sin calificar"). *Verif.: tests con categorías completas, parciales y ausentes.*
- [ ] D4. `book.css` base: papel de la página, sombras y lomo del libro (sin animación). *Verif.: `build`; el aspecto se revisa en F2.*

## Bloque E — Páginas
- [ ] E1. `EntryFirstPage`: nombre del juego, carátula (imagen o `CoverPlaceholder`), 3 capturas, estrellas y texto (`review`), con scroll interno accesible si el texto no cabe. *Verif.: tests con entrada completa, mínima, título largo, reseña larga y sin reseña.*
- [ ] E2. `EntrySecondPage`: "¿Qué te gustó?", "¿Qué no te gustó?" (con texto de ayuda si están vacíos), calificaciones, "Juegos que podrían gustarte" (se omite sin sugeridos) y estado con `StatusBadge`. *Verif.: tests con los 5 estados, textos vacíos y largos, sin sugeridos.*

## Bloque F — Doble página y adaptación
- [ ] F1. `BookSpread`: en `spread` muestra las dos páginas; en `single`, una sola, con una cabecera corrida del juego en la segunda. *Verif.: tests con `layout` forzado (en el árbol accesible solo hay una entrada).*
- [ ] F2. Revisión visual de la doble página y de la página única a 360 / 768 / 1280 px con datos mock. *Verif.: manual (usuario).*

## Bloque G — Portada y abrir/cerrar
- [ ] G1. `BookCover`: portada de cuero en CSS, título "Diario de {nombre}" (o "Mi diario"), botón "Abrir el diario". *Verif.: tests (nombre accesible; se activa con clic, `Enter` y `Space`).*
- [ ] G2. `JournalBook` (sin animación): inicia cerrado, abre, cierra, reabre desde la primera entrada; foco al contenedor de la entrada al abrir y de vuelta a la portada al cerrar. *Verif.: tests (cerrado al montar, abrir/cerrar, foco, nuevo montaje vuelve a cerrado).*
- [ ] G3. Revisión visual de la portada (cuero, costuras, relieve). *Verif.: manual (usuario).*

## Bloque H — Controles y accesibilidad
- [ ] H1. `BookControls`: anterior, siguiente (`aria-disabled` en los extremos), indicador y cerrar, con etiquetas distintas en `single` ("Página") y `spread` ("Entrada"). *Verif.: tests de extremos y etiquetas.*
- [ ] H2. Conectar la navegación en `JournalBook` con `lib/book.ts`: orden de más reciente a más antigua, ignorar pulsaciones repetidas durante la transición y región `aria-live` ("Entrada 2 de 6: Hades"). *Verif.: tests con datos mock (orden, indicador, anuncio, 1 entrada).*
- [ ] H3. Atajo de teclado ← → dentro del libro. *Verif.: test.*
- [ ] H4. Estados cargando, error y diario vacío (libro con página en blanco, mensaje y controles inactivos). *Verif.: tests de `JournalBook`/vista.*

## Bloque I — Animaciones (capa visual)
- [ ] I1. `PageTurnOverlay` para pasar página en `spread` (siguiente y anterior): capa `aria-hidden`/`inert`, retirada con `animationend` y un temporizador de seguridad. *Verif.: tests con temporizadores simulados (capa montada y retirada; el árbol accesible conserva una sola entrada) + manual.*
- [ ] I2. Pasar página en `single`. *Verif.: tests + manual.*
- [ ] I3. Animación de abrir y cerrar la portada. *Verif.: tests + manual.*
- [ ] I4. Movimiento reducido: sin capa animada y con cambio instantáneo. *Verif.: test con `matchMedia` en `reduce` + manual con la opción del sistema.*
- [ ] I5. Revisión de fluidez en escritorio y en un móvil real. *Verif.: manual (usuario).*

## Bloque J — Integración
- [ ] J1. `JournalPage`: `PageHeader` (único `h1`), título del documento y `JournalBook` en `/journal`, sustituyendo la lista; actualizar `views.test.tsx` (Diario) y retirar los textos i18n sin uso. *Verif.: tests de vista (cargando, error, vacío, con datos) y `routes.test.tsx`.*

## Bloque K — Verificación final
- [ ] K1. `typecheck`, `lint`, `test`, `build` y `prettier --check` pasan.
- [ ] K2. Tabla criterio → evidencia de los 15 criterios de aceptación de la spec.
- [ ] K3. Checklist de accesibilidad: teclado completo, foco visible, anuncios, un único `h1`, contraste de tokens, movimiento reducido, zoom al 200 %. *Verif.: manual (usuario) para teclado, zoom y movimiento reducido.*
- [ ] K4. Revisión responsive (360 / 768 / 1280) sin scroll horizontal y cambio de una a dos páginas al redimensionar conservando la entrada. *Verif.: manual (usuario).*
- [ ] K5. Búsquedas: ningún componente importa datos mock, sin textos de UI fijos fuera de `lib/i18n/es.ts`, sin dependencias nuevas ni código de fases futuras.
- [ ] K6. Documentos: estado de spec, plan y tareas a *Implementada/o/as*, `data-model.md` coherente y anotar la revisión pendiente de `CLAUDE.md`.

## Cobertura de los criterios de aceptación

| Criterio | Tareas |
|---|---|
| 1 Cerrado al entrar | G2 |
| 2 Abrir y cerrar (ratón, toque, teclado) | G1, G2, I3 |
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
