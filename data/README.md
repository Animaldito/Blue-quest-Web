# Catálogo del selector de destinos

La fuente de verdad es `dive-destinations.v1.json`. El navegador la carga una vez bajo demanda; no hay dependencia de API externa ni base de datos alojada.

## Contrato

- `schemaVersion`: versión de la estructura. `version`: revisión editorial del contenido.
- `seasons`: estaciones del hemisferio norte y meses numéricos 1–12.
- `categories`: pelagica, macro, corales, pecios. La consulta admite de una a tres categorías distintas.
- `targets`: tiburones, ballenas, mantas. Filtro opcional de elección única, solo con pelagica.
- `destinations[].scope`: `site` o `destination`; un destino puede requerir diferentes inmersiones.
- `mode`: `scuba` o `snorkel`. Los resultados se agrupan por modalidad, nunca se mezclan sin aviso.
- `recommendedMonths`: ventana editorial respaldada por las fuentes; no significa apertura legal ni presencia/ausencia mensual.
- `categoryMonths` y `targetMonths`: ventanas documentadas por interés y grupo de fauna. En esta primera edición comparten la ventana de la ficha; la estructura admite temporadas distintas al ampliar la investigación.
- `partialMonths`: meses en los que solo una parte entra en la ventana. `seasonLabel` y `caution` deben explicar el límite; los arrays de meses no autorizan fechas concretas.
- `sourceIds`: referencias a `sources`, con entidad, título, enlace, tipo y fecha de consulta. Los textos son síntesis editoriales, no citas literales.
- `reviewStatus`: `editorial-source-checked` NO significa revisión científica de todas las afirmaciones ni validación de Aida o del resto del equipo.
- `image`: nulo hasta disponer de un activo pertinente con permiso de uso. No usar fotos genéricas como si fueran pruebas del destino.

## Reglas de búsqueda

Para cada ficha, exigir todas las categorías seleccionadas y el grupo de fauna si se indica. Intersectar los meses de la estación con `recommendedMonths`, los arrays de cada categoría y el del grupo de fauna. Descartar si la intersección queda vacía. Ordenar por cantidad de meses coincidentes y por nombre; no interpretar el orden como probabilidad de encuentro.

La función `matchDestinations(data, query)` está aislada en `destination-finder.js` y se puede probar sin navegador. Devuelve fichas, intereses coincidentes, meses útiles y meses parciales. No muta la base original ni inventa alternativas parciales.

## Actualizar

1. Investigar la zona precisa y contrastar actividad, temporada y modalidad. No transferir automáticamente datos de todo un país a un punto.
2. Añadir fuentes y referencias; anotar discrepancias y fechas parciales.
3. Actualizar versión y documentación. Mantener nombre y alcance estables o crear otra ficha.
4. Ejecutar `node tests/destination-finder.test.cjs` y comprobar el selector en navegador.
5. Actualizar el conteo visible, este catálogo, la investigación y el registro de cambios si cambia la cobertura.

No importar datos de OBIS sin guardar la licencia, atribución, fecha, procedencia y calidad de los registros. La revisión documental inicial no ejecuta ninguna descarga de ocurrencias.
