# Modelo de datos — Game Journal

Modelo **conceptual**. En la fase 1 se expresa como tipos TypeScript en `packages/contracts`. No hay persistencia todavía (MongoDB llega en la fase 3).

## Relaciones

```
User 1 ──── N JournalEntry N ──── 1 Game
User 1 ──── 0..1 UserTasteProfile   (futuro)
```

Restricción: **una única `JournalEntry` por par (`userId`, `gameId`)**, editable.

## User

| Campo | Tipo | Notas |
|---|---|---|
| id | string | |
| displayName | string | |
| avatarUrl? | string | |
| preferences | objeto | Preferencias básicas (por definir en spec de Profile) |
| createdAt | ISO date | |

## Game

| Campo | Tipo | Notas |
|---|---|---|
| id | string | Identificador interno |
| title | string | |
| coverUrl? | string | Placeholder local en mock |
| platforms | string[] | |
| genres | string[] | |
| releaseYear? | number | |
| externalId? / source? | string | Reservado para proveedor externo (pendiente) |

Los campos exactos de `Game` se refinarán al elegir proveedor.

## JournalEntry

| Campo | Tipo | Notas |
|---|---|---|
| id | string | |
| userId | string | |
| gameId | string | |
| status | `GameStatus` | `playing`, `completed`, `backlog`, `abandoned`, `on_hold` (alineado con el PRD) |
| rating? | 1–5 | Entero |
| review? | string | Texto descriptivo del usuario; primera página del libro del diario |
| loggedAt | ISO date | Fecha de registro |
| startedAt? | ISO date | |
| completedAt? | ISO date | Coherente con `startedAt` |
| playtimeMinutes? | number | ≥ 0 |
| likedText? | string | Texto libre: qué te gustó. Vacío o ausente = sin texto |
| dislikedText? | string | Texto libre: qué no te gustó. Vacío o ausente = sin texto |
| categoryRatings? | `CategoryRatings` | `Partial<Record<RatingCategory, 1–5>>`; categorías: `gameplay`, `story`, `music`, `graphics`. Cada una es opcional |
| suggestedGames? | string[] | Títulos de juegos que podrían gustar. En la fase 1 son datos de prueba; las recomendaciones reales llegan en la fase 4 |
| images | string[] | URLs de capturas (el libro muestra las 3 primeras); el upload queda fuera de alcance |

Invariantes: `rating` y cada valor de `categoryRatings` ∈ {1..5}; `completedAt ≥ startedAt`; `playtimeMinutes ≥ 0`.

Cambio de la feature 002: `likedAspects`/`dislikedAspects` (listas de cadenas) se sustituyen por `likedText`/`dislikedText` (texto libre).

## UserTasteProfile (futuro, no implementar)

Preferencias calculadas del usuario (géneros, aspectos valorados, etc.) derivadas de sus entradas. Se define en la fase 4.

## Pendiente de confirmar

- Qué significa "My Collection" respecto al Journal (¿juegos con entrada? ¿incluye juegos sin jugar?). Fuera del alcance de 001; se decide en una feature posterior.
