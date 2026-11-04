---
name: sdd-clarify
description: Fase 2 de SDD en Game Journal. Resuelve las ambigüedades y preguntas abiertas de una spec.md haciendo preguntas al usuario y actualizando el documento. Úsala tras sdd-specify y antes de planificar.
allowed-tools: Read, Glob, Grep, AskUserQuestion, Write(/specs/**), Edit(/specs/**)
---

# SDD · Clarify

Convierte las dudas de una spec en decisiones documentadas. **No planifica ni implementa.**

## Pasos

1. Identifica la feature (argumento del usuario o la `spec.md` en estado `Borrador` más reciente) y léela entera, junto con `specs/constitution.md` y `specs/product/prd.md`.
2. Reúne las ambigüedades relevantes:
   - la sección **Preguntas abiertas** y las **Suposiciones**;
   - requisitos que admiten dos interpretaciones;
   - criterios de aceptación no comprobables;
   - casos límite sin comportamiento definido;
   - choques con decisiones ya confirmadas (PRD, ADR, `data-model.md`).
3. Pregunta con `AskUserQuestion`: máximo 4 preguntas por tanda, 2–4 opciones concretas, con tu recomendación primero y su motivo. Solo decisiones que cambien el resultado; lo que tenga un valor por defecto razonable se decide y se menciona.
4. Actualiza `spec.md` con las respuestas:
   - mueve cada pregunta resuelta a una sección **Decisiones** (decisión + motivo breve) o intégrala en los requisitos;
   - ajusta requisitos, criterios de aceptación, casos límite y fuera de alcance;
   - deja en **Preguntas abiertas** solo lo que siga sin resolver.
5. Si una respuesta contradice un documento base (`prd.md`, `data-model.md`, ADR), dilo y propón actualizarlo; no lo cambies en silencio.

## Reglas

- No inventes respuestas por el usuario.
- Si aparecen nuevas ambigüedades, haz otra tanda; no cierres con dudas importantes.
- Si la spec ya estaba `Aprobada` y se reabre aquí, vuelve a `Clarificada` y hay que reaprobarla; avisa de que `plan.md` y `tasks.md` (si existen) deben revisarse.

## Estados y aprobación

1. Cuando no queden preguntas relevantes, pon `Estado: Clarificada`.
2. Pregunta con `AskUserQuestion` (una sola pregunta): «¿Apruebas la spec?» con las opciones **Aprobar** (recomendada), **Pedir cambios** y **Dejarla para más tarde**.
3. Solo si responde **Aprobar**, cambia a `Estado: Aprobada`. En los otros casos la spec se queda en `Clarificada` y no se propone plan.
4. Tras `Aprobada`, propón `/sdd-plan`.
