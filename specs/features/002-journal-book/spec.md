# 002 — Journal Book (el diario como libro) · Spec

- **Estado:** Aprobada
- **Fase:** 2 — Core Journal Experience

## 1. Objetivo

Convertir el Diario en el corazón visual de la aplicación: un **libro** que se muestra cerrado con una portada de cuero, se abre y presenta cada videojuego como **dos páginas abiertas** (una doble página por entrada), con una experiencia de lectura cálida y memorable.

## 2. Contexto

- La feature 001 entregó el shell, el Design System y las vistas de solo lectura; la vista `/journal` es hoy una lista de tarjetas.
- El PRD establece que "el diario es el corazón de la aplicación" y la dirección visual Cozy Scrapbook (papel, Polaroids, notas manuscritas, stickers).
- Regla de producto confirmada: **una entrada por videojuego**.
- Frontend-first (ADR-001): los componentes obtienen los datos solo a través de `services/`, con datos mock.
- En esta feature el libro es de **solo lectura**. Crear, editar y guardar entradas (incluida la selección de estrellas) se especificará en una feature posterior.

## 3. User stories

- Como jugador, quiero ver mi diario como un libro cerrado con portada de cuero, para sentir que es un objeto personal.
- Como jugador, quiero abrir el libro y ver la entrada de un videojuego en dos páginas, como un álbum de recuerdos.
- Como jugador, quiero pasar de una entrada a otra como quien pasa las páginas.
- Como jugador, quiero ver de un vistazo la valoración de un juego con estrellas dibujadas a mano.
- Como jugador, quiero leer en la segunda página lo que me gustó y lo que no, las calificaciones por categoría y el estado del juego.
- Como jugador con teclado o lector de pantalla, quiero poder abrir, recorrer y cerrar el libro sin ratón.

## 4. Decisiones

| Tema | Decisión | Motivo |
|---|---|---|
| Alcance | Solo lectura con datos mock | El libro ya implica mucho trabajo visual; la edición se especifica aparte |
| Capturas | 3 marcos Polaroid con imagen de relleno (placeholder) | La subida de imágenes está fuera de alcance |
| "Juegos que podrían gustarte" | Se muestran 3 juegos genéricos de prueba en los datos mock; sin lógica de recomendación | El motor de recomendaciones es fase 4 |
| Portada | Una sola portada de cuero base | La personalización de portadas se pospone a una feature futura |
| Añadir entradas | Fuera de esta feature: el botón o la forma de agregar se define en una spec posterior (ver sección 13) | 002 se limita al núcleo del diario; el alta implica formularios, búsqueda y persistencia |
| Índice / salto directo | No hay índice; la navegación es anterior/siguiente | Basta para el núcleo del diario; un índice puede venir después |

## 5. Requisitos funcionales

**RF-1 Portada.** `/journal` muestra el libro **cerrado** con una portada de aspecto de cuero (textura, costuras, título en relieve). Siempre se carga cerrado. Hay una acción visible para abrirlo (botón y clic/toque sobre la portada).

**RF-2 Apertura y cierre.** Al abrir, el libro muestra la primera doble página con una transición. Existe una acción para **cerrar** el libro y volver a la portada.

**RF-3 Una entrada = una doble página.** Cada entrada del diario ocupa las dos páginas abiertas: página izquierda (primera) y página derecha (segunda).

**RF-4 Primera página.** Contiene:
- nombre del juego;
- carátula del juego (placeholder generado si no hay imagen);
- 3 imágenes tipo Polaroid para capturas (con placeholder si faltan);
- valoración de 5 estrellas (RF-6);
- el texto descriptivo escrito por el usuario (ver Suposiciones).

**RF-5 Segunda página.** Contiene:
- sección **"¿Qué te gustó?"** (texto libre, puede estar vacío);
- sección **"¿Qué no te gustó?"** (texto libre, puede estar vacío);
- calificaciones por categoría: **gameplay, historia, música y gráficos**;
- sección **"Juegos que podrían gustarte"** (3 títulos genéricos de los datos de prueba);
- **estado** del juego (`playing`, `completed`, `backlog`, `abandoned`, `on_hold`).

**RF-6 Estrellas dibujadas a mano.**
- Cinco estrellas en **gris** (sin valorar) y **doradas** (valoradas), según la valoración 1–5 de la entrada.
- Disposición **no lineal**: la 1.ª más arriba, la 2.ª más abajo, la 3.ª más arriba, la 4.ª más abajo, y así, con un aspecto de trazo manual (ligeras variaciones de posición/inclinación).
- El estado (valorada o no) no se comunica solo con el color: la estrella dorada va rellena y la gris es solo contorno.
- Se anuncia a tecnologías de apoyo como texto ("4 de 5 estrellas" / "Sin valoración").

**RF-7 Calificaciones por categoría.** Gameplay, historia, música y gráficos se muestran con una escala de 1–5 (opcional por categoría); si una no existe, se muestra como "sin calificar".

**RF-8 Navegación entre entradas.** Controles de **anterior** y **siguiente** pasan a la entrada vecina con una transición de pasar página. Indicador de posición ("Entrada 2 de 6"). Los controles se deshabilitan en los extremos.

**RF-9 Orden.** Las entradas se presentan de la más reciente a la más antigua (por `loggedAt`), igual que el Diario actual.

**RF-10 Adaptación a pantallas pequeñas.** Cuando no caben dos páginas, se muestra **una página a la vez** (primera y luego segunda de cada entrada) con la misma navegación secuencial.

**RF-11 Estados.** Cargando, error y diario sin entradas (libro con página en blanco y mensaje; ver casos límite).

**RF-12 Datos.** Los datos de la entrada llegan a través de `services/` (hook + lógica en `lib/`). El mock incluye lo necesario (descripción, categorías, capturas vacías, 3 juegos sugeridos genéricos).

## 6. Requisitos no funcionales

- **Arquitectura:** componentes del libro en `features/journal/`; sin acceso directo a datos mock; sin lógica de negocio en componentes visuales.
- **Accesibilidad:**
  - El contenido de las páginas es texto real y legible por lectores de pantalla en orden lógico; un único `h1`; el nombre del juego es un encabezado.
  - Apertura, cierre y navegación se pueden operar con teclado, con foco visible; al abrir o cambiar de entrada el foco se coloca de forma predecible y el cambio se anuncia (`aria-live="polite"`: "Entrada 2 de 6: Hades").
  - Contraste de texto ≥ 4.5:1 sobre el papel y sobre el cuero; contraste de las estrellas y controles ≥ 3:1.
  - Con `prefers-reduced-motion`, las transiciones de abrir/cerrar/pasar página se sustituyen por cambios instantáneos o un fundido.
  - El libro es usable con zoom de texto al 200 %.
- **Rendimiento:** animaciones solo con `transform`/`opacity`; texturas en CSS/SVG ligero; sin imágenes pesadas.
- **Responsive:** utilizable de 360 px a escritorio ancho, sin scroll horizontal de la página.
- **Textos:** todos en `lib/i18n/es.ts`.
- **Dependencias:** sin librerías nuevas (**Suposición:** efectos con CSS, sin librería de "flipbook"); cualquier excepción se justifica en el plan.
- **Estética:** coherente con Cozy Scrapbook; paleta existente ampliada con tonos de cuero y dorado (tokens en `styles.css`, contraste verificado).

## 7. Criterios de aceptación

1. Al entrar en `/journal` se ve el libro **cerrado** con la portada de cuero, y se carga cerrado en cada visita.
2. El libro se abre con ratón, toque y teclado, y se vuelve a cerrar.
3. Tras abrirlo se ve la entrada más reciente como doble página (o una página a la vez en pantallas pequeñas).
4. La primera página muestra nombre, carátula, 3 marcos Polaroid, estrellas y texto descriptivo.
5. La segunda página muestra "¿Qué te gustó?", "¿Qué no te gustó?", las 4 calificaciones, 3 juegos sugeridos de prueba y el estado.
6. Las estrellas reflejan la valoración (doradas rellenas / grises de contorno), están alternadas arriba y abajo, y su texto accesible coincide con la valoración.
7. Anterior/siguiente recorren todas las entradas de la más reciente a la más antigua; se deshabilitan en los extremos; el indicador de posición es correcto.
8. Una entrada sin valoración, sin descripción, sin textos de "qué te gustó / qué no te gustó", sin categorías, sin capturas o sin sugerencias se muestra sin errores ni huecos rotos.
9. Un diario sin entradas muestra el libro con un mensaje de vacío, sin controles de navegación activos.
10. Cargando y error se muestran de forma comprensible.
11. En 360 px el libro muestra una página a la vez y se puede recorrer completo sin scroll horizontal; en ≥ 1024 px se muestran las dos páginas a la vez.
12. Todo se puede operar solo con teclado; los cambios de entrada se anuncian; el foco es visible.
13. Con `prefers-reduced-motion` no hay animaciones de movimiento.
14. Ningún componente importa datos mock; los textos están en el diccionario i18n.
15. `typecheck`, `lint`, `test` y `build` pasan, con tests para la lógica de navegación, las estrellas, y los estados vacío y límite.

## 8. Casos límite

- Diario con 0 entradas; con 1 entrada (anterior y siguiente deshabilitados).
- Entrada sin valoración (cinco estrellas grises, "Sin valoración").
- Entrada con solo el estado y el juego (sin descripción, listas ni categorías).
- Menos de 3 capturas (los marcos restantes quedan con placeholder); más de 3 (se muestran las 3 primeras).
- Título de juego muy largo; descripción muy larga: el contenido de la página no desborda, hace scroll interno visible o se recorta de forma controlada.
- "Qué te gustó" o "qué no te gustó" vacíos (la sección se muestra con un texto de ayuda o se omite sin dejar huecos) o con un texto muy largo.
- Cambio de tamaño de ventana con el libro abierto, cruzando el punto de cambio entre una y dos páginas: se conserva la entrada actual.
- Clics rápidos repetidos en siguiente/anterior durante una transición.
- Recarga: el libro vuelve a estar cerrado.
- Falla el servicio al cargar las entradas.
- Entrada que referencia un juego desconocido (se omite, como en 001).

## 9. Dependencias

- Feature 001 implementada (shell, Design System, servicios mock, i18n).
- Cambios en `packages/contracts` y en los datos mock: calificaciones por categoría, juegos sugeridos de prueba, y textos libres de "qué te gustó / qué no te gustó" en lugar de las listas actuales (ver Suposiciones). Actualizar `data-model.md` al aprobar; con ello queda resuelto su pendiente "texto libre o vocabulario controlado" (texto libre).
- Nuevos tokens de color (cuero, dorado, gris de estrella) con contraste verificado.

## 10. Fuera de alcance

Añadir, crear, editar o eliminar entradas (incluido cualquier botón o acceso para hacerlo); seleccionar estrellas o cambiar cualquier dato; guardar cambios o persistencia; buscar juegos o añadir juegos; subida o gestión real de imágenes; recomendaciones reales y cualquier algoritmo; personalización o selección de estilos de portada; índice, búsqueda o filtros del diario; sonidos; impresión o exportación; backend y autenticación; selector de idioma.

## 11. Suposiciones (modificables)

1. **Texto de la primera página:** el texto que el usuario escribe sobre el juego se guarda en el campo `review` (reseña personal), que la entrada ya tiene; no se crea un campo nuevo para esto. *(Detalle técnico: solo decide dónde se guarda ese texto.)*
2. **Calificaciones por categoría:** exactamente cuatro (gameplay, historia, música, gráficos), cada una opcional y de 1 a 5; nuevo campo opcional de la entrada en `contracts` (por ejemplo `categoryRatings`).
3. **Juegos sugeridos:** nuevo campo opcional con títulos (por ejemplo `suggestedGames: string[]`); en el mock, 3 títulos genéricos de prueba.
4. **Capturas:** se usa el campo `images` existente; sin URLs en el mock se muestran placeholders.
5. **Lo que gustó / no gustó:** son **dos campos de texto libre** (uno para lo que gustó y otro para lo que no), y **pueden estar vacíos**. Sustituyen a las listas `likedAspects` / `dislikedAspects` actuales; el plan define cómo se migran los contratos, los datos mock y las tarjetas que hoy las muestran (Inicio).
6. **`/journal` pasa a ser el libro:** sustituye a la lista de tarjetas. La tarjeta `JournalEntryCard` sigue usándose en el Inicio.
7. **Cierre:** el libro puede cerrarse de nuevo; al cerrarse y reabrirse comienza en la primera entrada.
8. **Móvil:** por debajo de `md`/`lg` (se fijará en el plan) se muestra una página a la vez.
9. **Portada:** muestra el título del diario y el nombre del usuario (por ejemplo "Diario de Alex").

## 12. Preguntas abiertas

Ninguna pendiente de clarificar. Las suposiciones 1–9 fueron confirmadas por el usuario, con la aclaración de la 1 y el ajuste de la 5 (textos libres, pueden estar vacíos).

## 13. Notas para una feature futura: añadir entradas

Ideas recogidas durante la clarificación; **no forman parte del alcance de 002** y se decidirán en su propia spec:

- Botón flotante con forma de lápiz o pluma ("Nueva entrada"), siempre visible y cómodo en móvil.
- Nota adhesiva (post-it) donde se escribe y elige el juego, tras la cual el libro abre una doble página nueva.
- Escribir directamente sobre las páginas del libro (estrellas seleccionables, texto sobre líneas).
- El mismo lápiz como "editar esta página" cuando hay una entrada abierta.
- Accesos secundarios: página en blanco al final del libro, marcapáginas con "+", pluma sobre la portada cerrada.

Esa spec también cubrirá la selección de estrellas, la búsqueda de juegos, la validación y la persistencia local.
