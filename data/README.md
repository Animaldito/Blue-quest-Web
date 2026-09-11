# Catálogo del selector de destinos

La fuente de verdad es `dive-destinations.v2.json`. Sustituye al catálogo inicial. El navegador carga el archivo una vez bajo demanda; no necesita API externa, claves ni base alojada.

## Procedencia y alcance

Catálogo curado a partir de agencias de viajes de buceo, con fichas documentadas mediante centros y operadores locales. No es un censo mundial ni una lista de viajes contratables en tiempo real. Véase la investigación en `docs/DESTINATION-RESEARCH.md`.

Una referencia de agencia puede respaldar el país o archipiélago, no necesariamente el producto exacto ni una relación comercial con el operador de la ficha.

## Contrato v2

- `schemaVersion`: estructura. `version`: revisión editorial.
- `seasons`: meses numéricos 1–12 según estaciones del hemisferio norte. Mantener esta convención visible.
- `categories`: pelagica, macro, corales, pecios. Consultas de una a tres distintas.
- `targets`: tiburones, ballenas, mantas. Elección opcional única, solo cuando se incluye pelagica.
- `destinations[].scope`: `route`, `destination` o `site`. Una ruta y una base pueden combinar varias inmersiones; no se atribuye todo a cada punto.
- `tripStyle`, `operator`, `sites`: formato de viaje, operador documental y puntos que lo caracterizan. No constituyen reserva ni programa garantizado.
- `mode`: `scuba` o `snorkel`. Presentar grupos separados.
- `operatingMonths`: ventana del programa o actividad descrita por el operador; no calendario legal universal ni plazas confirmadas.
- `recommendedMonths`: selección de viaje dentro de esa ventana. Puede priorizar condiciones climáticas y ser más estrecha. Explicar por qué en `seasonBasis`.
- `categoryMonths`: ventana por interés. Los hábitats, pecios y sujetos macro no necesitan migración estacional para ser relevantes, pero la descripción del centro no equivale a registros mensuales de observación.
- `featureEvidence`: fuentes y fundamento editorial de cada categoría.
- `wildlife`: especie/grupo, meses documentados, fuentes y notas. `target` es opcional; macro y orcas pueden mostrarse sin activar un filtro taxonómico inapropiado.
- `targetMonths`: unión de los meses de los elementos de `wildlife` con ese `target`. No copiar automáticamente `recommendedMonths`: viajar y encontrar un animal son dimensiones diferentes.
- `pelagicTargets`: grupos que tienen evidencia en `wildlife`.
- `partialMonths`: meses con ventana parcial. Explicar extremos en `seasonLabel`, `seasonBasis` o `caution`; los arrays no autorizan una fecha concreta.
- `agencySourceIds`: descubrimiento comercial del destino.
- `operatorSourceIds`: centros y operadores que describen sus rutas o puntos.
- `travelSourceIds`: sustento de la ventana de viaje.
- `sourceIds`: unión de todas las referencias de la ficha, incluida fauna y fuentes estacionales.
- `sources`: identificador, editor, título, URL, tipo y fecha de consulta. `agency` distingue los catálogos, `operator` la documentación propia de centros/barcos y `local-guide` la guía complementaria con aportaciones locales.
- `reviewStatus: agency-discovered-operator-documented` significa revisión documental; NO aprobación científica ni validación humana del equipo.
- `checkedOn`: fecha de consulta, no fecha de cada dato ni promesa de actualidad del calendario.
- `image`: nulo hasta disponer de una imagen pertinente con permiso de uso.

“Vida pelágica” es una etiqueta de experiencia para grandes encuentros, no una clasificación científica del hábitat de todos los animales incluidos. No etiquetar tiburón ballena como ballena ni móbulas distintas de las mantas como mantas.

## Reglas de coincidencia

Exigir todas las categorías seleccionadas y el grupo de fauna opcional. Intersectar, en el mismo mes:

`estación ∩ operación ∩ viaje recomendado ∩ cada interés ∩ fauna elegida`

Si no hay intersección, no devolver la ficha. No relajar filtros sin avisar ni combinar meses separados dentro de una estación. Ordenar por cantidad de meses compatibles y por nombre; no es una probabilidad de encuentro.

`matchDestinations(data, query)` está aislada en `destination-finder.js`, no muta datos y se prueba sin navegador. La interfaz reutiliza la carga anticipada y permite reintentar un fallo conservando respuestas. El conteo visible se calcula desde el catálogo, no está duplicado en HTML.

## Actualización

1. Localizar el destino en una agencia; consultar después al operador local o de vida a bordo.
2. Distinguir ruta, zona, modalidad y puntos. Crear otra ficha si el ámbito cambia de forma material.
3. Documentar cada interés, la ventana del viaje y las temporadas de animales. Registrar discrepancias; omitir una etiqueta si no queda respaldada.
4. Actualizar la versión editorial, investigación, README, CHANGELOG y TODO. No presentar una consulta reciente como renovación de un calendario antiguo.
5. Ejecutar `node tests/destination-finder.test.cjs` y probar el selector por HTTP en móvil/escritorio, incluido fallo y reintento de carga.
6. Revisar con personas cualificadas fauna, condiciones, permisos y modalidades antes de usar la ficha como propuesta concreta de viaje.

La versión v1 se retira del sitio para no mantener dos bases aparentemente vigentes; permanece recuperable en el historial de Git.
