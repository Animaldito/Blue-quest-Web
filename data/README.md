# Catálogo público de destinos

`dive-destinations.v2.json` contiene exclusivamente los campos necesarios para mostrar fichas y filtrar por intereses y meses. No debe contener enlaces de investigación, fuentes, agencias, centros consultados, identificadores de procedencia ni notas internas.

La investigación completa se conserva fuera del repositorio público. No añadirla a esta carpeta ni al despliegue; ocultarla mediante estilos no protege los datos descargados por el navegador.

Las consultas intersectan estación, ventana operativa, recomendación de viaje, categorías y fauna opcional en los mismos meses. Las estaciones corresponden al hemisferio norte. Las modalidades de superficie y botella permanecen separadas.

Para actualizar, consultar la documentación interna y trasladar únicamente contenido destinado al visitante. Ejecutar `node tests/destination-finder.test.cjs` para comprobar privacidad y coincidencias. No modificar meses o categorías al retirar metadatos internos.
