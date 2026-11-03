# ADR-001 — Estrategia Frontend-first con datos mock

- **Estado:** Propuesta (pendiente de aprobación junto con el resto de la base documental)
- **Fecha:** 2026-11-02

## Contexto

Game Journal depende de una experiencia visual y emocional (scrapbook). Los requisitos de dominio aún se están descubriendo y el proveedor de datos de videojuegos no está decidido. Construir backend, base de datos y autenticación primero fijaría contratos prematuramente.

## Decisión

Comenzar por el frontend usando **datos mock**, sin Express, MongoDB, autenticación, upload ni integraciones externas. El acceso a datos se aísla tras **interfaces de servicio** en `apps/web/src/services/`, con tipos de dominio definidos en `packages/contracts`.

## Razones

1. Validar rápido el diseño y la experiencia, que es el diferenciador del producto.
2. Descubrir la forma real de los datos antes de fijar API y esquemas.
3. Menor complejidad y dependencias en la fase inicial.
4. Permitir decidir el proveedor de datos de juegos con más información.

## Consecuencias

- (+) Iteración visual rápida; contratos informados por uso real.
- (+) Sustituir `MockService` por `HttpService` no debe requerir cambios en pantallas.
- (−) Riesgo de que el mock diverja de la API real → mitigado tipando el mock con `contracts`.
- (−) Sin persistencia, los cambios no sobreviven a recargas en esta fase.

## Reglas derivadas

- Los componentes **no** importan datos mock directamente.
- Los servicios devuelven `Promise` (aunque el mock sea síncrono) para mantener la misma firma que el futuro HTTP.
- La transición a la fase 3 requiere nueva spec y aprobación.
