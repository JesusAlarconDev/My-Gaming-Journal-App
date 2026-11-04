---
name: sdd-specify
description: Fase 1 de SDD en Game Journal. Redacta el borrador de spec.md de una feature nueva (specs/features/NNN-nombre/). Úsala cuando el usuario quiera especificar, definir o empezar una nueva feature, antes de planificar o escribir código.
argument-hint: "[descripción de la feature]"
allowed-tools: Read, Glob, Grep, AskUserQuestion, Write(/specs/**), Edit(/specs/**)
---

# SDD · Specify

Crea el borrador de `spec.md` de una feature. **No planifica ni implementa.**

## Entrada

Descripción de la feature indicada por el usuario: $ARGUMENTS

Si está vacía, pregunta qué feature quiere especificar. Las fases siguientes (`clarify`, `plan`, `tasks`, `implement`, `verify`) no reciben argumentos: se ejecutan en esta misma conversación sobre la feature que se acaba de crear.

## Antes de escribir

1. Lee `specs/constitution.md`, `specs/product/prd.md`, `specs/architecture/data-model.md` y `specs/architecture/architecture.md`.
2. Lee `specs/features/001-app-shell/spec.md`: es el ejemplo de formato y nivel de detalle esperado.
3. Lista `specs/features/` y usa el siguiente número libre (`NNN-nombre-en-kebab-case`).
4. Si el alcance de la feature no está claro, pregunta al usuario antes de redactar (usa `AskUserQuestion`).

## Contenido obligatorio de `spec.md`

Cabecera con **Estado** (`Borrador`) y **Fase** del roadmap, y estas secciones, en español:

1. Objetivo
2. Contexto
3. User stories
4. Requisitos funcionales (`RF-n`, verificables)
5. Requisitos no funcionales relevantes
6. Criterios de aceptación (numerados, comprobables con test o checklist)
7. Casos límite
8. Dependencias
9. Fuera de alcance
10. Preguntas abiertas

## Reglas

- No inventes requisitos importantes: si falta información, anótala en **Preguntas abiertas** en lugar de suponerla. Si asumes algo menor, márcalo como "Suposición".
- No amplíes el alcance más allá de lo pedido; lo demás va a **Fuera de alcance**.
- Respeta las decisiones confirmadas del PRD (stack, estilo, una entrada por juego, frontend-first mientras no se apruebe backend).
- Los textos de UI van en español (`lib/i18n/es.ts`); los identificadores en inglés.
- Si la feature cambia el modelo de datos o una decisión arquitectónica, indícalo en la spec; la actualización de `data-model.md` o un ADR se hace al aprobarla.

## Al terminar

La spec queda en `Estado: Borrador`; esta skill nunca la aprueba. Resume la spec en pocas líneas, lista las **Preguntas abiertas** y propón pasar a `/sdd-clarify`. No continúes a plan ni tareas.
