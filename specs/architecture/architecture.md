# Arquitectura — Game Journal

## 1. Resumen

Monorepo MERN con **Modular Monolith**. En la fase 1 solo existe el frontend; el backend se incorpora en la fase 3.

| Capa | Tecnología | Estado |
|---|---|---|
| Frontend | React + TypeScript + Vite | Fase 1 |
| Estilos | Tailwind CSS | Fase 1 |
| Backend | Node.js + Express + TypeScript | Fase 3 |
| Base de datos | MongoDB + Mongoose | Fase 3 |
| Contratos | `packages/contracts` (tipos + validación compartidos) | Fase 1 (tipos), 3 (validación) |

## 2. Estructura del repositorio

```
game-journal/
├─ apps/
│  ├─ web/                  # React + Vite (se crea en 001)
│  │  └─ src/
│  │     ├─ app/            # bootstrap, router, providers, layout raíz
│  │     ├─ components/     # Design System y componentes compartidos
│  │     ├─ features/       # dashboard/, journal/, collection/, profile/
│  │     ├─ hooks/
│  │     ├─ lib/            # utilidades puras
│  │     ├─ services/       # interfaz + implementación mock (luego HTTP)
│  │     └─ types/
│  └─ api/                  # Express (se crea en fase 3)
│     └─ src/{config,modules,middleware,shared}/
├─ packages/
│  └─ contracts/            # tipos de dominio compartidos (se crea en 001)
├─ specs/                   # documentación SDD
├─ README.md
└─ package.json             # npm workspaces
```

`apps/api` **no se crea** hasta la fase 3.

## 3. Decisiones técnicas relevantes

1. **npm workspaces** (sin Turborepo/Nx/pnpm): suficiente para 2 apps + 1 paquete; npm ya está instalado.
2. **`packages/contracts` desde el inicio**: los tipos de dominio (`Game`, `JournalEntry`, `User`…) viven aquí, de modo que el backend los reutilice sin reescribir pantallas. En la fase 1 contiene solo tipos TypeScript; la validación (p. ej. Zod) se añade en la fase 3 cuando exista un borde de red que validar.
3. **Capa de servicios con interfaz**: `services/` expone interfaces (`GameService`, `JournalService`…) y una implementación mock. Los componentes/hooks solo conocen la interfaz; sustituir mock por HTTP no toca las pantallas (ADR-001).
4. **React Router** para rutas (`/`, `/journal`, `/collection`, `/profile`).
5. **Estado**: estado local + hooks sobre servicios. Sin Redux/Zustand hasta que haya una necesidad demostrada. Para cache de servidor en fase 3 se evaluará TanStack Query.
6. **Tailwind con design tokens** (colores, tipografías, sombras) definidos en la configuración; los componentes del Design System consumen tokens, no valores sueltos.
7. **Testing**: Vitest + Testing Library; ESLint + Prettier.

## 4. Flujo de datos (fase 1)

```
Componente (feature) → hook → Service (interfaz) → MockService → mock data (JSON/TS)
```

Fase 3: `MockService` se reemplaza por `HttpService` → API Express → MongoDB. La capa superior no cambia.

## 5. Dependencias iniciales (solo las necesarias para 001)

`react`, `react-dom`, `react-router-dom`, `tailwindcss`, `vite`, `typescript`, `vitest`, `@testing-library/react`, `eslint`, `prettier`. Nada de backend, auth ni librerías de UI/animación hasta que se justifiquen.

## 6. Decisiones pendientes

| # | Tema | Propuesta | Cuándo decidir |
|---|---|---|---|
| 1 | Tipografías (editorial + moderna + manuscrita) | **Delegado al agente:** Fraunces (editorial), DM Sans (UI), Caveat (manuscrita, solo acentos), vía `@fontsource` (sin CDN) | Plan 001 |
| 2 | Idioma de la UI | **Decidido:** español e inglés. Textos centralizados; selector de idioma en feature posterior | — |
| 3 | Imágenes mock (portadas) | **Delegado al agente:** placeholders locales (SVG/gradiente), sin hotlinking | Plan 001 |
| 4 | Proveedor de datos de juegos | Evaluar IGDB, RAWG, etc. en una feature propia | Feature posterior a 001 |
| 5 | Librería de iconos | **Decidido:** `lucide-react` | — |
| 6 | Validación en contracts | Zod | Fase 3 |

## 7. Riesgos

- **Estética vs. usabilidad/accesibilidad**: texturas, rotaciones y manuscrita pueden dañar contraste y legibilidad. Mitigación: tokens con contraste AA verificado, manuscrita solo en acentos.
- **Derivar el modelo mock del modelo real**: mock con forma distinta a la futura API obliga a reescribir. Mitigación: mock tipado con `contracts`.
- **Sobreingeniería de contracts/monorepo**: mantener `contracts` solo con tipos en fase 1.
- **Dependencia de datos externos**: licencias/límites de APIs de videojuegos. Se difiere la decisión.
- **Rendimiento de efectos visuales** en móvil (sombras, texturas). Mitigación: texturas ligeras (CSS/SVG), probar en móvil.
- **Autenticación tardía**: el modelo ya incluye `userId` en las entradas; el mock usará un usuario fijo.
