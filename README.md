# Blue Quest Web

Sitio web estático de Blue Quest, dedicado a la exploración subacuática, expediciones y asesoramiento para resorts y centros de buceo.

## Idiomas — inglés por defecto

La portada y las páginas legales se sirven en inglés desde `/`; sus versiones españolas están en `/es/`. El selector EN / ES cambia los textos sin recargar ni perder la selección del globo, las imágenes o el borrador de contacto. Los enlaces conservan el idioma y el fragmento; volver/avanzar del navegador también funciona. No se guardan preferencias en cookies ni almacenamiento local: una visita nueva a `/` siempre empieza en inglés.

Los seis HTML están prerenderizados y se pueden leer sin JavaScript. Hay enlaces de idioma reales, etiquetas `lang`, URL canónica y alternativas `hreflang`. Los mensajes dinámicos y ayudas de accesibilidad también se traducen. No se traducen nombres propios, correos ni lo que escribe el visitante. El navegador y los servicios externos conservan su propia interfaz.

Edición: `content/es/index.html`, `content/es/aviso-legal.html`, `content/es/privacidad.html`; traducciones: `translations.js`; comportamiento compartido: `language.js` y `language.css`. Generar con `node scripts/build-languages.cjs`; verificar sin escribir con `node scripts/build-languages.cjs --check` o `node tests/languages.test.cjs`. No requiere dependencias ni servicios de traducción. Los archivos generados se guardan en Git; Vercel sirve directamente estos archivos.

El buscador «Tu destino» sigue oculto y no carga el catálogo. La newsletter permanece desactivada: antes de activarla hay que terminar consentimiento, probar el alta y preparar formularios/confirmaciones de Brevo en ambos idiomas. Una página no puede traducir el contenido de un formulario externo de otro dominio.

Recuperación previa al cambio bilingüe: `checkpoint/20260912-102734983-antes-web-bilingue`. La mejora se guarda como un único commit para revertirla de forma controlada; ver `BACKUP.md`.

## Selector «Tu destino»

Nueva sección `#tu-destino`: hasta tres intereses combinables, detalle opcional de fauna y estación del hemisferio norte. Devuelve fichas con meses coincidentes. Las experiencias de snorkel se presentan aparte del buceo con botella.

Catálogo público: 40 fichas de zonas y rutas en 24 países y territorios. Muestra características y temporadas, sin información de investigación interna. No es un inventario mundial exhaustivo ni una garantía de avistamiento.

La búsqueda se ejecuta en el navegador con una única carga del catálogo. No envía respuestas ni necesita claves de API. Para probarla localmente, servir la carpeta por HTTP; abrir `index.html` directamente como archivo no permite cargar el JSON en todos los navegadores.

Prueba de datos y filtros: `node tests/destination-finder.test.cjs`.

## Publicación

El sitio se publica automáticamente desde la rama `main` de GitHub mediante Vercel:

- Dominio público: https://www.bqexplore.com/
- Dirección de Vercel: https://blue-quest-web.vercel.app/
- Repositorio: https://github.com/Animaldito/Blue-quest-Web

## Estructura

- `index.html`: contenido y estructura de la página.
- `styles.css`: estilos, diseño adaptable y animaciones.
- `app.js`: interacciones de la página y destinos.
- `privacidad.html` y `legal.css`: información de privacidad y su presentación, con selector de idioma y sin formularios propios.
- `aviso-legal.html`: identificación del titular, uso del sitio, cookies y acceso a privacidad. Acceso desde el pie de página; retirado del lateral.
- `destination-finder.js` y `destination-finder.css`: flujo por fases y fichas de rutas.
- `data/dive-destinations.v2.json`: catálogo documentado, ventanas de viaje y temporadas de fauna independientes.
- `world.js`: datos y renderizado del globo.
- `assets/hero/reef-survey.webp`: portada actual, escena ilustrativa generada de prospección de arrecife; procedencia en `assets/hero/SOURCES.md`. No corresponde a una expedición real documentada.
- `ocean.png`: imagen anterior conservada para recuperación.
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

El formulario prepara un borrador local con destino a info@bqexplore.com, permite copiarlo y abre la aplicación de correo mediante mailto. El propietario confirma que el buzón está activo. No hay backend ni envío automático: el visitante confirma el envío en su aplicación de correo. La web no guarda estos campos en almacenamiento propio.

## Newsletter y privacidad

El aviso legal está en `/aviso-legal.html` y la política en `/privacidad.html`. El titular ha autorizado expresamente publicar su identificación, NIF, domicilio y correo en el sitio y GitHub. Brevo se integra con su formulario público, sin claves privadas y cargando solo al abrir el popup. Las altas están en pausa con `data-newsletter-ready="false"` en el diálogo: no se carga el iframe ni se ofrece el enlace al formulario.

En la revisión del 11/09/2026 no se detectaron cookies, claves de almacenamiento local o de sesión, ni peticiones a otros orígenes en el recorrido habitual de la web pública y la vista previa. Repetir la revisión antes de incorporar integraciones, CAPTCHA o analítica; instalar bloqueo y gestión del consentimiento cuando proceda, no un aviso decorativo.

Antes de activarlo, completar en Brevo consentimiento y aviso con enlace a la política, verificar lista, confirmación y baja, y revisar los pendientes de `TODO.md`. Al activar, actualizar también el apartado Newsletter de la política. La conexión del formulario no da acceso administrativo a Brevo ni autoriza campañas automáticas.
