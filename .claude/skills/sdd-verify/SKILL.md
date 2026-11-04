---
name: sdd-verify
description: Fase 6 de SDD en Game Journal. Verifica una feature implementada contra su spec (criterios de aceptación, calidad, accesibilidad, alcance) y actualiza el estado de los documentos. Úsala al terminar la implementación o cuando se pida revisar una feature.
---

# SDD · Verify

Comprueba con evidencia que lo implementado cumple la spec. **No añade funcionalidad.**

## Pasos

1. Lee `spec.md`, `plan.md` y `tasks.md` de la feature.
2. **Calidad automática** (desde la raíz): `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npx prettier --check .`. Anota los resultados reales.
3. **Criterios de aceptación:** recórrelos uno a uno. Para cada uno, indica la evidencia: test que lo cubre (archivo y nombre), comando ejecutado o comprobación manual pendiente del usuario. Un criterio sin evidencia no se da por cumplido.
4. **Reglas del proyecto** (comprueba con búsquedas, no de memoria):
   - ningún componente importa datos mock ni accede a almacenamiento directamente (solo `services/`);
   - sin textos de UI fijos en componentes (todo en `lib/i18n/es.ts`);
   - un único `h1` por vista, `useDocumentTitle`, landmarks, foco visible, `aria-current` donde aplique;
   - contraste ≥ 4.5:1 en combinaciones de color nuevas;
   - sin dependencias fuera del plan, sin código de fases futuras;
   - sin alcance añadido respecto a la spec.
5. **Checklist para el usuario:** lista lo que solo él puede verificar (aspecto, responsive 360/768/1280 px, teclado, reducción de movimiento) con pasos concretos.
6. **Documentos y estados:** cuando la verificación automática esté en verde y no quede ningún criterio incumplido, pregunta con `AskUserQuestion` (una sola pregunta): «¿Confirmas las comprobaciones manuales y damos la feature por implementada?» con las opciones **Confirmar** y **Aún no / hay cambios**. Solo con **Confirmar**:
   - marca `[x]` las tareas verificadas (las manuales que el usuario acaba de confirmar);
   - pon `Estado: Implementada` en `spec.md`, `Implementado` en `plan.md` e `Implementadas` en `tasks.md`;
   - revisa que `data-model.md`, `architecture.md`, README y `CLAUDE.md` sigan siendo coherentes.

   Si responde **Aún no**, no cambies ningún estado.

## Informe

Entrega: resultados de los comandos, tabla criterio → evidencia (cumplido / pendiente del usuario / incumplido), desviaciones del plan, deuda o riesgos detectados. Si algo incumple, propón la corrección pero no la apliques sin que el usuario lo pida.
