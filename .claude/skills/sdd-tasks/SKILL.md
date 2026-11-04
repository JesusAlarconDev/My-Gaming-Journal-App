---
name: sdd-tasks
description: Fase 4 de SDD en Game Journal. Genera tasks.md dividiendo un plan aprobado en bloques de tareas pequeñas y verificables. Úsala cuando el plan esté aprobado y antes de implementar.
allowed-tools: Read, Glob, Grep, AskUserQuestion, Write(/specs/**), Edit(/specs/**)
---

# SDD · Tasks

Convierte el plan en una lista ordenada de tareas. **No implementa.**

## Requisitos previos

`spec.md` con `Estado: Aprobada` y `plan.md` con `Estado: Aprobado` (valores exactos). Si no, detente e indica qué skill falta (`/sdd-clarify` o `/sdd-plan`).

## Pasos

1. Lee la spec, el plan y `specs/features/001-app-shell/tasks.md` (ejemplo de formato).
2. Escribe `tasks.md` en español, con la cabecera `- **Estado:** Borrador` bajo el título, agrupado en **bloques** con letra (A, B, C…) que sigan el orden de construcción del plan (de abajo arriba: contratos → servicios → lógica/hooks → componentes → vistas → verificación final).
3. Cada tarea:
   - tiene un id (`A1`, `A2`…) y una frase concreta;
   - es lo bastante pequeña para completarse y verificarse de forma independiente;
   - termina con *Verif.:* y **cómo** se comprueba (test concreto, comando, o "manual" / "revisión visual" cuando solo el usuario puede comprobarlo);
   - empieza como `- [ ]`.
4. Añade un bloque final de **Verificación** que cubra: `typecheck`, `lint`, `test`, `build`; cada criterio de aceptación de la spec; accesibilidad; responsive; y actualización de documentos (estado de spec/plan, `data-model.md` si cambió, README si procede).

## Reglas

- Cada criterio de aceptación de la spec debe quedar cubierto por al menos una tarea o verificación; si alguno no lo está, añade la tarea.
- No añadas tareas fuera del alcance de la spec.
- Leyenda al inicio: `[ ]` pendiente · `[x]` completada **y verificada**.

## Al terminar

Muestra el número de bloques y tareas y señala qué verificaciones dependen del usuario. Después pregunta con `AskUserQuestion` (una sola pregunta): «¿Apruebas las tareas?» con las opciones **Aprobar** (recomendada), **Pedir cambios** y **Dejarlas para más tarde**.

- Solo si responde **Aprobar**, cambia a `Estado: Aprobadas` y propón `/sdd-implement`.
- En los otros casos, se quedan en `Borrador` y no se propone `/sdd-implement`.
