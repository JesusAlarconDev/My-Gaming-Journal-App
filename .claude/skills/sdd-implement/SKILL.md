---
name: sdd-implement
description: Fase 5 de SDD en Game Journal. Implementa las tareas de tasks.md en orden, un bloque cada vez, verificando cada tarea antes de marcarla. Úsala cuando spec, plan y tasks estén aprobados y el usuario pida implementar o continuar con el siguiente bloque.
---

# SDD · Implement

Implementa **solo** lo que dicen `tasks.md` y la spec aprobada.

## Requisitos previos

`spec.md` con `Estado: Aprobada`, `plan.md` con `Estado: Aprobado` y `tasks.md` con `Estado: Aprobadas` (valores exactos). Si alguno falta o tiene otro valor, detente e indica la skill que corresponde. Lee también `CLAUDE.md` y `specs/constitution.md`.

Esta skill **no cambia los estados** de los documentos: `Implementada/o/as` lo fija `/sdd-verify`. Si durante la implementación hay que modificar de fondo la spec, el plan o las tareas, párate, propón el cambio y, si lo aprueba, el documento vuelve a `Borrador` y se reaprueba con su skill.

## Bucle de trabajo

1. Identifica el siguiente bloque pendiente (o el que indique el usuario). Trabaja bloque a bloque.
2. Implementa cada tarea en orden, siguiendo el estilo del código existente (nombres, comentarios escasos, alias `@/`, textos en `lib/i18n/es.ts`, componentes de `components/ui/` reutilizados).
3. Escribe los tests que pide la verificación de la tarea.
4. Verifica antes de marcar: `npm run typecheck`, `npm run lint`, `npm test` y, al cerrar el bloque, `npm run build` y `npx prettier --check .`. Corrige lo que falle; no marques con fallos.
5. Marca `[x]` en `tasks.md` **solo** las tareas verificadas. Las tareas cuya verificación es manual o visual se dejan `[ ]` hasta que el usuario las confirme; indícale qué revisar y dónde (por ejemplo `http://localhost:5173/`, con el servidor de desarrollo en segundo plano).
6. Al cerrar el bloque, resume qué se hizo, qué se verificó (con resultados reales), desvíos respecto al plan y qué queda pendiente del usuario.

## Reglas

- No amplíes el alcance ni añadas funcionalidades futuras. Si aparece algo necesario que no está en la spec, párate y pregúntalo.
- No cambies código funcional ajeno sin justificarlo; no borres archivos del usuario sin preguntar (los temporales propios, anunciándolo, sí).
- Si el plan resulta inviable, explica por qué y propón la corrección en el plan; no te desvíes en silencio.
- Dependencias: solo las del plan, con versiones compatibles con Node 22.14.
- **No ejecutes `git commit` ni `git push` por tu cuenta.** Cuando el bloque esté listo, ofrece el mensaje de commit en inglés (sin `Co-Authored-By`), muéstralo y espera la orden del usuario.
- Informa con fidelidad: si un test falla o algo se omitió, dilo con la salida real.
