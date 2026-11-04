# Game Journal

> Tu diario personal de los mundos que has jugado.

Game Journal es un diario personal de videojuegos con estética _cozy scrapbook_: registra tus experiencias, guarda recuerdos, valora tus juegos y, más adelante, descubre nuevos títulos según tus gustos.

## Estado

Fase 1 — Frontend Foundation. La feature [`001-app-shell`](specs/features/001-app-shell/spec.md) (shell, Design System y vistas iniciales de solo lectura) está implementada con **datos mock**. Todavía no hay backend, autenticación ni persistencia (ver [ADR-001](specs/decisions/ADR-001-frontend-first.md)).

## Requisitos

- Node.js ≥ 22.12
- npm ≥ 10

## Puesta en marcha

```bash
npm install
npm run dev        # http://localhost:5173
```

## Scripts (desde la raíz)

| Comando             | Qué hace                                      |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo de `apps/web`          |
| `npm run build`     | Typecheck + build de producción de `apps/web` |
| `npm run typecheck` | Comprobación de tipos de todos los workspaces |
| `npm run lint`      | ESLint (incluye `jsx-a11y`)                   |
| `npm test`          | Tests de `apps/web` (Vitest)                  |
| `npm run format`    | Prettier                                      |

## Estructura

```
apps/
  web/                 React + TypeScript + Vite + Tailwind
    src/
      app/             router, layout y navegación
      components/      Design System y componentes compartidos
      features/        dashboard, journal, collection, profile
      hooks/           hooks compartidos
      lib/             utilidades puras (formato, lógica, i18n)
      services/        interfaces de acceso a datos + implementación mock
packages/
  contracts/           tipos de dominio compartidos (User, Game, JournalEntry)
specs/                 documentación Spec Driven Development
```

`apps/api` (Express + MongoDB) se creará en la fase 3.

## Documentación (SDD)

- [Constitución](specs/constitution.md): reglas permanentes de desarrollo
- [PRD](specs/product/prd.md): visión, alcance y roadmap
- [Arquitectura](specs/architecture/architecture.md) y [modelo de datos](specs/architecture/data-model.md)
- [ADR-001: Frontend-first](specs/decisions/ADR-001-frontend-first.md)
- Features: [`001-app-shell`](specs/features/001-app-shell/) (`spec.md`, `plan.md`, `tasks.md`)

Flujo de trabajo: Specify → Clarify → Plan → Tasks → Implement → Verify. No se implementa nada sin una spec aprobada.

## Datos mock y servicios

Los componentes nunca importan datos mock: consumen interfaces de `src/services/` (`GameService`, `JournalService`, `UserService`). En la fase de backend se sustituirá la implementación mock por servicios HTTP sin tocar las pantallas.
