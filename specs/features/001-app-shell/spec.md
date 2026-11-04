# 001 — App Shell & Design System · Spec

- **Estado:** Implementada
- **Fase:** 1 — Frontend Foundation

## 1. Objetivo

Crear la estructura visual y funcional de Game Journal: aplicación React con navegación, layout responsive, Design System inicial y vistas iniciales alimentadas por datos mock.

## 2. Contexto

Primera feature del producto. Establece la identidad Cozy Scrapbook y las convenciones (servicios, tokens, estructura de features) sobre las que se construirán las siguientes. Ver `prd.md`, `architecture.md` y ADR-001.

## 3. User stories

- Como jugador, quiero ver un shell con navegación clara para moverme entre Dashboard, Journal, Collection y Profile.
- Como jugador, quiero identificar de un vistazo en qué sección estoy.
- Como jugador, quiero usar la app cómodamente en móvil y escritorio.
- Como jugador, quiero una primera impresión cálida (cuaderno personal), no un panel de SaaS.
- Como desarrollador, quiero componentes compartidos y servicios desacoplados del mock para construir las siguientes features sin rehacer pantallas.

## 4. Requisitos funcionales

**RF-1 Aplicación y rutas.** SPA React con rutas: `/` (Dashboard), `/journal`, `/collection`, `/profile`. Ruta desconocida → vista "No encontrado" con enlace al inicio.

**RF-2 Layout.** Layout general con Sidebar, Header y área de contenido (`main`).
- Escritorio: Sidebar fija lateral.
- Móvil: la navegación principal se presenta de forma adaptada (barra inferior o menú desplegable; se fija en el plan).

**RF-3 Navegación.** Enlaces a las 4 secciones; la sección activa se distingue visualmente y con `aria-current="page"`.

**RF-4 Design System inicial.** Tokens (paleta, tipografías, radios, sombras, espaciado) y componentes compartidos mínimos: `Button`, `Card`, `PolaroidCard` (tarjeta de juego), `Badge/StatusBadge`, `RatingStars` (solo lectura), `PageHeader`, `EmptyState`, `Sticker` (decorativo). Solo los necesarios para las vistas de esta feature.

**RF-5 Dashboard inicial.** Saludo/portada del diario, resumen simple (p. ej. nº de juegos, jugando ahora) y últimas entradas del diario, desde mock.

**RF-6 Vista inicial de Journal.** Lista de entradas mock como tarjetas (juego, estado, rating, fecha, extracto de reseña). Solo lectura.

**RF-7 Vista inicial de My Collection.** Cuadrícula de juegos mock como Polaroids. Solo lectura.

**RF-8 Vista inicial de My Profile.** Datos básicos del usuario mock y estadísticas simples. Solo lectura.

**RF-9 Datos mock desacoplados.** Los componentes y hooks acceden a datos solo a través de `services/` (interfaces + implementación mock). Tipos de dominio en `packages/contracts`.

**RF-10 Estados de carga/vacío.** Cada vista maneja carga, vacío y error básico (el mock puede simularlos).

## 5. Requisitos no funcionales

- **Responsive:** funcional desde 360 px hasta escritorio ancho.
- **Accesibilidad:** cumplir mínimos de la constitución (landmarks, teclado, foco visible, skip link, contraste AA, `prefers-reduced-motion`).
- **Rendimiento:** sin librerías pesadas de animación/UI; texturas ligeras; fuentes autohospedadas.
- **Mantenibilidad:** TypeScript strict, estructura por features, sin `any`.
- **Estética:** Cozy Scrapbook con la paleta definida; decoración discreta.
- **Textos centralizados** (no dispersos en componentes), preparados para español e inglés. En 001 se entrega la UI en español con estructura de recursos lista para añadir inglés; el selector de idioma queda fuera de alcance.

## 6. Criterios de aceptación

1. `npm run dev` arranca la app sin errores; `build`, `lint`, `typecheck` y `test` pasan.
2. Existen las rutas `/`, `/journal`, `/collection`, `/profile` y una vista 404.
3. La navegación entre secciones funciona con ratón, teclado y táctil, sin recarga de página.
4. La sección activa se identifica visualmente y con `aria-current="page"`.
5. El layout es usable en 360 px y en ≥1280 px, sin scroll horizontal.
6. `Button`, `Card`, `PolaroidCard`, `StatusBadge`, etc. se reutilizan en más de una vista.
7. Ningún componente importa datos mock directamente; solo `services/` lo hace.
8. No existe código de backend, auth ni llamadas de red.
9. Verificación de accesibilidad básica: navegación por teclado completa, foco visible, skip link, un `h1` por vista, contraste AA en los tokens principales.
10. Con `prefers-reduced-motion`, las animaciones se reducen/eliminan.

## 7. Casos límite

- Reseña muy larga → se trunca en tarjeta sin romper el layout.
- Título de juego muy largo → truncado con elipsis/línea múltiple limitada.
- Lista vacía (sin entradas o sin juegos) → `EmptyState`.
- Entrada sin rating, sin portada o sin fechas → render correcto con valores por defecto.
- Ruta inexistente → 404.
- Recarga directa en `/journal` etc. funciona (el servidor de dev hace fallback a `index.html`).
- Zoom de texto al 200 % sin pérdida de contenido.
- Fallo simulado del servicio → mensaje de error no bloqueante.

## 8. Dependencias

- Node ≥ 22, npm ≥ 11 (disponibles).
- Decisiones pendientes de aprobar: tipografías, idioma de UI, imágenes placeholder, iconos (ver `architecture.md` §6).
- Documentos base aprobados (constitución, PRD, arquitectura, data model, ADR-001).

## 9. Fuera de alcance

Autenticación; CRUD de videojuegos y de entradas (crear/editar/borrar); integración con proveedores externos; persistencia; upload de imágenes; recomendaciones; backend; modo oscuro; i18n completo; búsqueda y filtros.

## 10. Preguntas abiertas

Resueltas:

- Navegación móvil: barra inferior.
- Idioma: español e inglés a futuro; 001 se entrega solo en español con la estructura preparada. Selector de idioma en una feature posterior.
- Relación Collection ↔ Journal: fuera de alcance; en 001 Collection muestra juegos mock sin lógica de relación.
- Proveedor de datos: feature posterior.
