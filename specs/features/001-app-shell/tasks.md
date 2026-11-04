# 001 — App Shell & Design System · Tasks

Leyenda: `[ ]` pendiente · `[x]` completada **y verificada**. No empezar sin aprobación de spec y plan.

## Bloque A — Fundación del monorepo
- [x] A1. Inicializar Git, `.gitignore`, `.editorconfig`, `package.json` raíz con workspaces. *Verif.: `npm install` sin errores.*
- [x] A2. `tsconfig.base.json` en modo strict. *Verif.: `tsc --noEmit` ejecutable.*
- [x] A3. ESLint + Prettier (con `jsx-a11y`). *Verif.: `npm run lint` pasa.*

## Bloque B — Contratos
- [x] B1. Crear `packages/contracts` con tipos `User`, `Game`, `JournalEntry`, `GameStatus`. *Verif.: typecheck; importable desde `apps/web`.*

## Bloque C — App web base
- [x] C1. Scaffold Vite + React + TS en `apps/web`. *Verif.: `npm run dev` muestra la app.*
- [x] C2. Configurar Tailwind + tokens + fuentes autohospedadas. *Verif.: tokens visibles en una página de prueba.*
- [x] C3. Configurar Vitest + Testing Library. *Verif.: un test de humo pasa.*

## Bloque D — Servicios mock
- [x] D1. Definir interfaces en `services/types.ts`. *Verif.: typecheck.*
- [x] D2. Datos mock tipados (≈6–8 juegos, ≈5–6 entradas, 1 usuario; incluir casos límite: sin rating, reseña larga, título largo, sin fechas). *Verif.: typecheck.*
- [x] D3. Implementar servicios mock + `services/index.ts`. *Verif.: tests unitarios de servicios.*
- [x] D4. Hook `useAsync` (carga/error/datos). *Verif.: test.*

## Bloque E — Design System
- [ ] E1. Estilos globales, fondo papel/textura sutil, `focus-visible`, `prefers-reduced-motion`. *Verif.: manual.*
- [x] E2. `Button`, `Card`, `Badge/StatusBadge`. *Verif.: tests + revisión visual.*
- [x] E3. `RatingStars` (lectura) y `PolaroidCard`. *Verif.: tests con datos incompletos.*
- [ ] E4. `PageHeader`, `EmptyState`, `Sticker` (decorativo, `aria-hidden`). *Verif.: revisión visual + a11y.*

## Bloque F — Layout y rutas
- [ ] F1. Router con 4 rutas + 404. *Verif.: test de rutas.*
- [ ] F2. `AppLayout` con `Sidebar`, `Header`, `main`, skip link. *Verif.: landmarks correctos.*
- [ ] F3. Navegación móvil. *Verif.: manual a 360 px.*
- [ ] F4. Estado activo (`aria-current`) y estilo. *Verif.: test.*

## Bloque G — Vistas
- [ ] G1. Dashboard. *Verif.: render con datos, vacío y error.*
- [ ] G2. Journal. *Verif.: idem.*
- [ ] G3. My Collection. *Verif.: idem.*
- [ ] G4. My Profile. *Verif.: idem.*
- [ ] G5. Centralizar textos de UI. *Verif.: revisión.*

## Bloque H — Verificación final
- [ ] H1. `typecheck`, `lint`, `test`, `build` pasan.
- [ ] H2. Checklist de accesibilidad (teclado, foco, skip link, `h1` único, contraste AA, reduced motion).
- [ ] H3. Revisión responsive (360 / 768 / 1280) sin scroll horizontal.
- [ ] H4. Confirmar que ningún componente importa mock directamente y que no hay red/backend.
- [ ] H5. Actualizar `README.md` raíz y marcar spec como "Implementada".
