# Blue Quest Web

Sitio web estático de Blue Quest, dedicado a la exploración subacuática, expediciones y asesoramiento para resorts y centros de buceo.

## Publicación

El sitio se publica automáticamente desde la rama `main` de GitHub mediante Vercel:

- Producción: https://blue-quest-web.vercel.app/
- Repositorio: https://github.com/Animaldito/Blue-quest-Web

## Estructura

- `index.html`: contenido y estructura de la página.
- `styles.css`: estilos, diseño adaptable y animaciones.
- `app.js`: interacciones de la página y destinos.
- `world.js`: datos y renderizado del globo.
- `ocean.png`: imagen principal.
- `assets/technology/`: imágenes oficiales de equipos y cartografía, con procedencia en `SOURCES.md`.
- `quest-mark.svg`: emblema vectorial Q con aleta. La variante animada está integrada en la cabecera mediante SVG y CSS; termina en un logo estático y respeta movimiento reducido.
- `fonts/`: tipografías Barlow Condensed y DM Sans y sus licencias, servidas localmente.
- `AGENTS.md`: reglas de trabajo para Codex.
- `TODO.md`: lista priorizada de mejoras pendientes.
- `CHANGELOG.md`: registro de cambios permanentes.

## Trabajo local

Los archivos de texto usan UTF-8 sin BOM. Tras una modificación significativa, se revisa localmente y se sincroniza con GitHub. Vercel genera el despliegue automáticamente.

La navegación lateral fija muestra seis apartados, incluidos The Team y Contacto; la portada ofrece tres accesos inferiores. En móvil, los seis apartados se presentan en una cabecera compacta. El menú resalta la sección actual durante el desplazamiento.

## Equipo y contacto

Los cuatro retratos de assets/team son provisionales y están identificados en la web. Las funciones ampliadas y necesidades de personal adicional se documentan en TEAM-OPERATIONS.md para validación.

El formulario prepara un borrador local con destino a info@bluequest.com, permite copiarlo y abre la aplicación de correo mediante mailto. No hay backend ni envío automático. El buzón todavía no existe: mantener el aviso visible hasta activarlo y verificar recepción. No se almacenan ni transmiten los datos del formulario desde la web.
