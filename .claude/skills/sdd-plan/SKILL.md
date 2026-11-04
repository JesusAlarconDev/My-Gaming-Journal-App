---
name: sdd-plan
description: Fase 3 de SDD en Game Journal. Redacta plan.md (enfoque técnico, estructura, dependencias, verificación, riesgos) a partir de una spec.md aprobada. Úsala cuando la spec esté aprobada y antes de generar tareas.
allowed-tools: Read, Glob, Grep, AskUserQuestion, Write(/specs/**), Edit(/specs/**)
---

# SDD · Plan

Define **cómo** se construirá la feature. **No implementa.**

## Requisitos previos

La cabecera de `spec.md` debe decir exactamente `Estado: Aprobada` y no tener preguntas abiertas importantes. Con cualquier otro valor (`Borrador`, `Clarificada`…), detente y propón `/sdd-clarify`.

## Pasos

1. Lee la spec, `specs/constitution.md`, `specs/architecture/architecture.md`, `specs/architecture/data-model.md` y `specs/features/001-app-shell/plan.md` (ejemplo de formato).
2. Inspecciona el código real de `apps/web` y `packages/contracts` que la feature tocará: reutiliza lo existente (componentes de `components/ui/`, `services/`, `lib/i18n`, tokens de `styles.css`) antes de proponer piezas nuevas.
3. Escribe `plan.md` en español con:
   - **Enfoque** general y orden de construcción;
   - **Cambios por área**: contratos, servicios, hooks/lib, componentes, features/rutas, textos i18n;
   - **Decisiones técnicas** en tabla (decisión, justificación, alternativa descartada);
   - **Dependencias nuevas**: cada una justificada; prefiere la plataforma y lo ya instalado;
   - **Impacto en documentos base** (`data-model.md`, `architecture.md`, ADR nuevo si cambia una decisión arquitectónica);
   - **Estrategia de verificación**: tests automáticos y checklist manual, cubriendo cada criterio de aceptación;
   - **Riesgos** y cómo mitigarlos.

## Reglas

- Respeta la regla central de la arquitectura: los componentes no tocan datos ni almacenamiento directamente; todo pasa por una interfaz en `services/`.
- Mantén TypeScript estricto, accesibilidad (constitución §5) y textos centralizados.
- No cambies decisiones confirmadas sin justificarlo y pedir aprobación.
- Verifica la versión y compatibilidad (Node 22.14, ver `CLAUDE.md`) antes de proponer una dependencia.
- Si algo del plan requiere una decisión del usuario, pregúntala (`AskUserQuestion`) en lugar de decidir por él.

## Al terminar

Escribe el plan con `Estado: Borrador`. Resume el plan y destaca las decisiones que requieren su visto bueno. Después pregunta con `AskUserQuestion` (una sola pregunta): «¿Apruebas el plan?» con las opciones **Aprobar** (recomendada), **Pedir cambios** y **Dejarlo para más tarde**.

- Solo si responde **Aprobar**, cambia a `Estado: Aprobado` y propón `/sdd-tasks`.
- En los otros casos, el plan se queda en `Borrador` y no se propone `/sdd-tasks`.
- Si el plan ya estaba `Aprobado` y se rehace de fondo, vuelve a `Borrador` y hay que reaprobarlo (y revisar `tasks.md` si existe).
