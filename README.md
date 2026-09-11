# Blue Quest Web

Sitio web estático de Blue Quest, dedicado a la exploración subacuática, expediciones y asesoramiento para resorts y centros de buceo.

## Selector «Tu destino»

Nueva sección `#tu-destino`: hasta tres intereses combinables, detalle opcional de fauna y estación del hemisferio norte. Devuelve fichas con meses coincidentes. Las experiencias de snorkel se presentan aparte del buceo con botella.

Catálogo público: 40 fichas de zonas y rutas en 24 países y territorios. Muestra características y temporadas, sin información de investigación interna. No es un inventario mundial exhaustivo ni una garantía de avistamiento.

La búsqueda se ejecuta en el navegador con una única carga del catálogo. No envía respuestas ni necesita claves de API. Para probarla localmente, servir la carpeta por HTTP; abrir `index.html` directamente como archivo no permite cargar el JSON en todos los navegadores.

Prueba de datos y filtros: `node tests/destination-finder.test.cjs`.

## Publicación

El sitio se publica automáticamente desde la rama `main` de GitHub mediante Vercel:

- Producción: https://blue-quest-web.vercel.app/
- Repositorio: https://github.com/Animaldito/Blue-quest-Web

## Estructura

- `index.html`: contenido y estructura de la página.
- `styles.css`: estilos, diseño adaptable y animaciones.
- `app.js`: interacciones de la página y destinos.
- `destination-finder.js` y `destination-finder.css`: flujo por fases y fichas de rutas.
- `data/dive-destinations.v2.json`: catálogo documentado, ventanas de viaje y temporadas de fauna independientes.
- `world.js`: datos y renderizado del globo.
- `ocean.png`: imagen principal.
- `assets/technology/`: imágenes oficiales de equipos y cartografía, con procedencia en `SOURCES.md`.
- `quest-mark.svg`: emblema vectorial Q con aleta. La variante animada está integrada en la cabecera mediante SVG y CSS; termina en un logo estático y respeta movimiento reducido.
- `fonts/`: tipografías Barlow Condensed y DM Sans y sus licencias, servidas localmente.
- `AGENTS.md`: reglas de trabajo para Codex.
- `TODO.md`: lista priorizada de mejoras pendientes.
- `CHANGELOG.md`: registro de cambios permanentes.

## Copias y recuperación

Cada mejora guardada conserva su versión en Git. Antes de cambios importantes se añade un punto `checkpoint/*` con `node scripts/checkpoint.cjs nombre-breve`; se sincroniza al publicar con `git push --follow-tags origin main`. No duplica la web ni necesita llamadas a IA. Procedimiento y límites en [BACKUP.md](BACKUP.md). Los cambios aún sin guardar en Git no quedan incluidos.

## Trabajo local

Los archivos de texto usan UTF-8 sin BOM. Tras una modificación significativa, se revisa localmente y se sincroniza con GitHub. Vercel genera el despliegue automáticamente.

La navegación lateral fija incluye Tu destino, The Team y Contacto; la portada ofrece tres accesos inferiores. En móvil, los apartados se presentan en una cabecera compacta. El menú resalta la sección actual durante el desplazamiento.

## Equipo y contacto

Los cuatro retratos activos de assets/team son fotografías facilitadas por el usuario y retocadas con IA, optimizadas en WebP. Las funciones ampliadas y necesidades de personal adicional se documentan en TEAM-OPERATIONS.md para validación.

El formulario prepara un borrador local con destino a info@bluequest.com, permite copiarlo y abre la aplicación de correo mediante mailto. No hay backend ni envío automático. El buzón todavía no existe: mantener el aviso visible hasta activarlo y verificar recepción. No se almacenan ni transmiten los datos del formulario desde la web.
