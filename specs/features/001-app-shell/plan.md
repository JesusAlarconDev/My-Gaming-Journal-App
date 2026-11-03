# 001 — App Shell & Design System · Plan

- **Estado:** Borrador (depende de la aprobación de `spec.md`)

## 1. Enfoque

Construir de abajo arriba: monorepo → contratos → servicios mock → Design System → layout/rutas → vistas. Cada paso es verificable de forma independiente.

## 2. Estructura a crear

```
package.json                    # workspaces: apps/*, packages/*
tsconfig.base.json
.gitignore, .editorconfig, .prettierrc, eslint config
packages/contracts/
  package.json
  src/{index.ts, user.ts, game.ts, journal-entry.ts}
apps/web/
  index.html, vite.config.ts, tsconfig*.json, tailwind config
  src/
    main.tsx
    app/{App.tsx, router.tsx, layout/{AppLayout,Sidebar,Header,MobileNav}.tsx}
    components/{ui/*, decor/Sticker.tsx}
    features/{dashboard,journal,collection,profile}/
    hooks/
    lib/
    services/{types.ts, mock/{data/*, *.service.ts}, index.ts}
    styles/{tokens, global}.css
    test/setup.ts
```

## 3. Decisiones técnicas del plan

| Tema | Decisión | Justificación |
|---|---|---|
| Gestor | npm workspaces | Ya instalado, sin tooling extra |
| Build | Vite + `@vitejs/plugin-react` | Stack confirmado |
| Estilos | Tailwind CSS con tokens en `theme.extend` / CSS variables | Stack confirmado; tokens centralizados |
| Rutas | `react-router-dom` (data router o `BrowserRouter`; el más simple) | Necesario para navegación |
| Servicios | Interfaces en `services/types.ts`; `services/index.ts` exporta la implementación activa (mock) | ADR-001 |
| Acceso a datos en UI | Hook genérico `useAsync`/hooks por feature → servicio | Sin librería de fetching aún |
| Iconos | `lucide-react` | Ligera, tree-shakeable (aprobado) |
| Fuentes | `@fontsource/*` autohospedadas: Fraunces (títulos), DM Sans (UI), Caveat (acentos manuscritos) | Sin CDN, mejor privacidad/rendimiento (elección delegada al agente) |
| Textos / i18n | Diccionarios por idioma en `lib/i18n/` (es primero, en preparado) accedidos vía un hook `useT`; sin librería externa en 001 | Evita dependencias; migrable a i18next si hiciera falta |
| Tests | Vitest + Testing Library + happy-dom | Constitución |
| Lint/format | ESLint (typescript-eslint, react-hooks, jsx-a11y) + Prettier | `jsx-a11y` refuerza accesibilidad |
| Texturas/decoración | CSS (gradientes, SVG inline ligeros); sin imágenes pesadas | Rendimiento |
| Portadas mock | Placeholders generados (SVG/gradiente con inicial) | Sin hotlinking |

## 4. Design tokens iniciales (a validar en contraste)

Colores: `cream` (fondo), `paper` (superficies), `cocoa` (texto/oscuros), `sage`, `rose`, `orange` (acentos). Se verificará contraste AA para texto sobre cada fondo antes de usarlos.
Tipografía: editorial (títulos), sans moderna (UI), manuscrita (acentos puntuales).
Radios suaves, sombras sutiles tipo papel, ligera rotación (±1–2°) en Polaroids solo con `motion-safe`.

## 5. Servicios mock

- `GameService`: `listGames()`, `getGame(id)`.
- `JournalService`: `listEntries()`.
- `UserService`: `getCurrentUser()`.
- Devuelven `Promise`; datos tipados con `contracts`. Pequeño retardo opcional para ejercitar estados de carga.

## 6. Navegación responsive

- ≥ `md`: Sidebar fija a la izquierda + Header superior.
- < `md`: Header compacto + barra de navegación inferior (4 ítems). *(sujeto a respuesta de pregunta abierta 2)*

## 7. Estrategia de verificación

- Automática: `typecheck`, `lint`, `test`, `build`.
- Tests: servicios mock; navegación (ruta activa + `aria-current`); componentes con lógica (`RatingStars`, `PolaroidCard` con datos incompletos); vistas con estados vacío/carga.
- Manual: checklist de teclado, responsive (360 / 768 / 1280), `prefers-reduced-motion`, contraste.

## 8. Riesgos del plan

- Complejidad visual excesiva en la primera iteración → empezar con pocas decoraciones y refinar.
- Contraste de la paleta cálida → medir antes de fijar tokens.
- Versiones de Tailwind/Vite/React Router cambian rápido → verificar versiones actuales al instalar y fijarlas en lockfile.
