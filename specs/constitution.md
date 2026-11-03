# Constitución de Game Journal

Reglas permanentes de desarrollo. Cambiarlas requiere justificación y aprobación explícita.

## 1. Principios arquitectónicos

1. Modular Monolith; sin microservicios.
2. Frontend y backend separados; contratos explícitos en `packages/contracts`.
3. Separación de responsabilidades: tipos de dominio, datos mock, servicios, componentes visuales y estado de UI viven en capas distintas.
4. La lógica de negocio no vive en componentes visuales (va en hooks, `lib/` o servicios).
5. Componentes reutilizables solo cuando hay un segundo uso real o es parte del Design System.
6. Simplicidad primero: no se añaden abstracciones ni dependencias "por si acaso".
7. Frontend-first: los componentes consumen **servicios**, nunca datos mock directamente (ver ADR-001).

## 2. Convenciones de código

- TypeScript en modo `strict`; prohibido `any` implícito y `@ts-ignore` sin comentario justificado.
- Código, identificadores y nombres de archivo en inglés. Documentación y comunicación en español.
- Componentes React: función + `PascalCase.tsx`; hooks `useXxx.ts`; utilidades `camelCase.ts`.
- Organización del frontend por funcionalidad (`features/<name>/`), con `components/` solo para piezas compartidas.
- Imports con alias `@/` hacia `src/`. Sin dependencias circulares entre features.
- ESLint + Prettier como formato único. Comentarios solo para explicar el *porqué*.

## 3. Calidad

- Una tarea solo se marca completada tras verificarla (build, lint, typecheck, tests y/o comprobación manual según corresponda).
- Cambios pequeños y revisables; una feature por rama/commit lógico.
- No se modifica código funcional sin justificación.

## 4. Testing

- Vitest + Testing Library para frontend.
- Se prueba: servicios, lógica en `lib/`/hooks y componentes del Design System con comportamiento (no snapshots masivos).
- Cada criterio de aceptación de una spec debe poder verificarse mediante test o checklist manual documentada en `tasks.md`.

## 5. Accesibilidad (mínimos obligatorios)

- HTML semántico (`header`, `nav`, `main`, landmarks) y un único `h1` por vista.
- Navegación completa por teclado, foco visible, enlace "saltar al contenido".
- Sección activa indicada con `aria-current="page"` además de estilo visual.
- Contraste mínimo WCAG AA; el color nunca es el único indicador.
- `alt` en imágenes informativas; respetar `prefers-reduced-motion`.
- Elementos decorativos (stickers, texturas) con `aria-hidden`.

## 6. Gestión de dependencias

- Toda dependencia nueva se justifica en el plan de la feature.
- Preferir la plataforma/stdlib antes que una librería.
- Versiones fijadas vía lockfile; sin dependencias abandonadas.
- Dependencias de fases futuras (Express, Mongoose, auth…) **no** se instalan antes de su fase.

## 7. Flujo SDD

Ciclo por feature: **Specify → Clarify → Plan → Tasks → Implement → Verify**.

- Cada feature en `specs/features/NNN-nombre/` con `spec.md`, `plan.md`, `tasks.md`.
- Una spec debe tener: objetivo, contexto, user stories, requisitos funcionales, no funcionales relevantes, criterios de aceptación, casos límite, dependencias y fuera de alcance.
- Sin spec aprobada no hay implementación. Sin aprobación no se amplía el alcance.
- Las ambigüedades relevantes se preguntan; no se inventan requisitos.
- Si cambia una decisión, se actualizan los documentos afectados (y se crea un ADR si es arquitectónica).

## 8. Reglas de implementación

- Implementar solo lo que indica `tasks.md`, en orden, tarea a tarea.
- Estado de tareas: `[ ]` pendiente, `[x]` verificada.
- Las decisiones de producto confirmadas (stack, estilo, frontend-first, una entrada por juego…) no se alteran sin aprobación.
- Estilo visual: Cozy Scrapbook; la estética nunca compromete la usabilidad. Sin decoración excesiva ni animaciones gratuitas.
