# Game Journal — Product Requirements Document

**Versión:** 0.2
**Estado:** Draft (pendiente de aprobación)
**Tipo:** Personal Web Application

## 0. Decisiones de producto confirmadas

| Tema | Decisión |
|---|---|
| Stack | MERN: React + TypeScript + Vite, Tailwind, Node + Express + TypeScript, MongoDB + Mongoose |
| Arquitectura | Monorepo, Modular Monolith |
| Estrategia | Frontend-first con datos mock (ver ADR-001) |
| Entradas | Una entrada por videojuego, editable |
| Autenticación | Posterior (fase 3) |
| Idioma de la UI | Español e inglés. Se arranca con textos centralizados (i18n-ready); el selector de idioma llega en una feature posterior |
| Iconos | `lucide-react` |
| Navegación móvil | Barra inferior |
| Estados de juego | Playing, Completed, Backlog, Abandoned, On Hold |
| Tipografías y portadas placeholder | Las define el agente en el plan de 001 (ver `plan.md`) |
| Proveedor de datos de videojuegos | Se evaluará e integrará en una feature propia, posterior a 001 |
| Relación Collection ↔ Journal | Fuera del alcance de 001; se define en una feature posterior |

## 1. Visión del producto

Game Journal es un diario personal de videojuegos que permite registrar, organizar y recordar las experiencias vividas en diferentes juegos.

Su propuesta combina tres conceptos:

- Diario personal de videojuegos.
- Colección y seguimiento de juegos.
- Sistema personalizado de descubrimiento y recomendaciones.

La aplicación debe sentirse como un cuaderno personal donde cada videojuego representa una experiencia que merece ser recordada.

## 2. Problema que resuelve

Las plataformas tradicionales de seguimiento de videojuegos se concentran principalmente en estadísticas, colecciones y valoraciones.

Game Journal busca ofrecer una experiencia más personal:

- Recordar qué juegos has jugado.
- Guardar lo que sentiste y pensaste sobre ellos.
- Conservar capturas y momentos favoritos.
- Comprender progresivamente tus preferencias.
- Descubrir juegos que realmente coincidan con tus gustos.

## 3. Público objetivo

Jugadores que disfrutan descubrir videojuegos, registrar sus experiencias y recordar los mundos que han explorado.

El producto prioriza inicialmente una experiencia individual y personal. Las funcionalidades sociales no forman parte del MVP.

## 4. Objetivos del MVP

1. Permitir registrar videojuegos en un diario personal.
2. Permitir valorar y escribir reseñas.
3. Guardar capturas e imágenes asociadas a cada experiencia.
4. Organizar juegos según su estado.
5. Ofrecer una interfaz cozy, intuitiva y visualmente memorable.
6. Establecer las bases de datos necesarias para construir un recomendador personalizado posteriormente.

## 5. Funcionalidades principales

### 5.1. Journal

Diario principal donde se muestran las experiencias registradas.

Cada entrada debe contener:

- Videojuego.
- Calificación de 1 a 5 estrellas.
- Reseña personal.
- Fecha de registro.
- Tiempo jugado (opcional).
- Estado del juego.
- Aspectos que gustaron o no gustaron.
- Capturas e imágenes.

### 5.2. Game Collection

Colección de videojuegos del usuario.

Estados iniciales:

- Playing.
- Completed.
- Backlog.
- Abandoned.
- On Hold.

Debe permitir consultar, filtrar y organizar los videojuegos.

En la feature 001 la colección es de solo lectura y se muestra con datos mock. La relación exacta entre Collection y Journal (si la colección incluye juegos sin entrada) se decidirá en una feature posterior.

### 5.3. Game Details

Información general de cada videojuego:

- Nombre.
- Portada.
- Descripción.
- Géneros.
- Plataformas.
- Fecha de lanzamiento.
- Desarrollador.

Los datos podrán obtenerse de un proveedor externo de información de videojuegos. La elección e integración del proveedor se tratará en una feature dedicada; hasta entonces se usan datos mock.

### 5.4. My Taste

Sección destinada a representar los gustos del usuario.

En futuras iteraciones deberá mostrar:

- Géneros favoritos.
- Temáticas preferidas.
- Mecánicas favoritas.
- Preferencias narrativas.
- Características que suele valorar positivamente.
- Características que suele evitar.

### 5.5. Recommendations

Sistema de recomendaciones personalizado.

Su objetivo es recomendar videojuegos basándose en:

- Juegos valorados positivamente.
- Reseñas personales.
- Aspectos favoritos.
- Géneros y características de videojuegos.
- Historial de juegos registrados.

Las recomendaciones deberán explicar por qué un videojuego podría gustarle al usuario.

Esta funcionalidad se desarrollará después del MVP.

## 6. Experiencia visual

Dirección artística:

**Cozy + Nostalgic + Scrapbook + Gaming.**

Características:

- Apariencia de cuaderno digital.
- Texturas de papel sutiles.
- Tarjetas inspiradas en fotografías Polaroid.
- Stickers y elementos decorativos.
- Tipografía editorial combinada con tipografía moderna.
- Animaciones suaves.
- Paleta de colores cálidos y desaturados.

Colores de referencia:

- Warm Cream.
- Paper White.
- Dark Cocoa / Warm Brown.
- Sage Green.
- Dusty Rose / Dusty Pink.
- Muted Orange / Soft Orange.
- Muted Blue (acento secundario, confirmado).

Idioma: la interfaz estará disponible en español e inglés. Los textos se centralizan desde el inicio para que el selector de idioma pueda añadirse después sin reescribir componentes.

La experiencia debe priorizar legibilidad, accesibilidad y facilidad de navegación. Las animaciones no deben entorpecer el uso.

## 7. Alcance del MVP

Incluido:

- Estructura general de la aplicación.
- Navegación.
- Dashboard inicial.
- Journal.
- Colección de videojuegos.
- Búsqueda y selección de juegos.
- Creación y edición de entradas.
- Valoraciones.
- Reseñas.
- Estados de videojuegos.
- Diseño responsive.

Preparación arquitectónica:

- Autenticación.
- Persistencia MongoDB.
- Almacenamiento de imágenes.
- Integración con proveedor externo de videojuegos.

No incluido inicialmente:

- Recomendaciones mediante IA.
- Embeddings.
- Collaborative filtering.
- Funcionalidades sociales.
- Aplicación móvil nativa.
- Integración con plataformas de gaming para sincronización automática.

### Entrega por fases

El alcance del MVP se entrega de forma incremental (Fase 0 Foundation, 1 Frontend Foundation, 2 Core Journal Experience, 3 Backend Integration, 4 Personalized Discovery). La primera feature es **001 App Shell & Design System**: estructura, navegación, Design System y vistas iniciales de solo lectura con datos mock. Búsqueda de juegos, creación/edición de entradas, proveedor externo, autenticación y persistencia se especificarán en features posteriores.

## 8. Indicadores de éxito

- Un usuario puede registrar y editar una entrada sin dificultad.
- Puede consultar su colección y filtrar sus juegos.
- Las entradas conservan correctamente sus valoraciones y reseñas.
- La experiencia es usable en escritorio y dispositivos móviles.
- La arquitectura permite añadir nuevas funcionalidades sin modificar innecesariamente las existentes.

## 9. Principios del producto

1. El diario es el corazón de la aplicación.
2. La experiencia personal tiene prioridad sobre las estadísticas.
3. Registrar un juego debe ser rápido y sencillo.
4. Las recomendaciones deben basarse en preferencias reales.
5. La aplicación debe evolucionar progresivamente.
6. Evitar complejidad innecesaria durante el MVP.
