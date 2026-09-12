# Blue Quest Web

Sitio web estático de Blue Quest, dedicado a la exploración subacuática, expediciones y asesoramiento para resorts y centros de buceo.

## Luz y paleta

El bloque `Ambient light` al final de `styles.css` controla la luminosidad: mezcla los tonos marinos existentes con el blanco de la web, manteniendo el turquesa de marca. Las superficies y el velo de portada se ajustan por separado, sin filtros globales, cambios de imagen ni animaciones adicionales. `legal.css` aplica el mismo criterio a las páginas legales y conserva su estilo de impresión.

## Idiomas — detección por país y selector manual

El menú móvil distribuye enlaces completos en filas según el ancho disponible, sin partir palabras ni truncar nombres. Su altura se mide para que las anclas no queden ocultas debajo. No volver a definir estilos de `.sidebar` desde `destination-finder.css`: la antigua regla de cuatro columnas causaba recortes aunque el buscador estuviera oculto.

Prueba de regresión con Playwright y Microsoft Edge disponibles: `node tests/mobile-navigation.browser.cjs`, con la web servida en `http://127.0.0.1:4173`. Se pueden indicar `BQ_TEST_URL`, `BQ_PLAYWRIGHT_PATH` y, opcionalmente, `BQ_SCREENSHOT_DIR`. Revisa ambos idiomas, etiquetas de una sola línea dentro de sus botones, áreas táctiles, anclas, orientación, texto ampliado y menú de ordenador.

La portada y las páginas legales tienen archivos ingleses desde `/` y españoles en `/es/`. Vercel selecciona español al entrar desde España, los países hispanohablantes de América (incluido Puerto Rico) y Guinea Ecuatorial; el resto, incluido Brasil, recibe inglés. Un país desconocido también conserva inglés. La IP puede reflejar una VPN o un viaje, no el idioma personal.

`vercel.json` usa cuatro redirecciones temporales basadas en `x-vercel-ip-country`, sin funciones, paquetes ni llamadas a proveedores adicionales. Solo afecta a la portada y las dos páginas legales, nunca a imágenes, scripts, estilos o rutas españolas. Los enlaces ingleses llevan `?lang=en` para saltarse la detección; los españoles usan `/es/`. Se conservan las URL canónicas y los enlaces `hreflang` ingleses permiten acceder expresamente a inglés desde cualquier país.

El selector EN / ES cambia los textos sin recargar ni perder la selección del globo, las imágenes o el borrador de contacto. Los enlaces conservan la elección, otros parámetros y el fragmento; recargar y volver/avanzar también funcionan. No se guardan preferencias en cookies ni almacenamiento local: una visita nueva a la raíz sin `?lang=en` vuelve a aplicar el país. Los enlaces estáticos también respetan la elección sin JavaScript.

Prueba sin red: `node tests/geo-language.test.cjs` comprueba 21 países/territorios, alternativas, ausencia de bucles, enlaces y navegación. La detección real requiere Vercel; el servidor estático local no dispone de país. La prueba de reglas es una simulación, no una conexión desde cada país. Recuperación previa: `checkpoint/20260912-192158416-antes-idioma-por-pais`.

Los seis HTML están prerenderizados y se pueden leer sin JavaScript. Hay enlaces de idioma reales, etiquetas `lang`, URL canónica y alternativas `hreflang`. Los mensajes dinámicos y ayudas de accesibilidad también se traducen. No se traducen nombres propios, correos ni lo que escribe el visitante. El navegador y los servicios externos conservan su propia interfaz.

Edición: `content/es/index.html`, `content/es/aviso-legal.html`, `content/es/privacidad.html`; traducciones: `translations.js`; comportamiento compartido: `language.js` y `language.css`. Generar con `node scripts/build-languages.cjs`; verificar sin escribir con `node scripts/build-languages.cjs --check` o `node tests/languages.test.cjs`. No requiere dependencias ni servicios de traducción. Los archivos generados se guardan en Git; Vercel sirve directamente estos archivos.

El buscador «Tu destino» sigue oculto y no carga el catálogo. La newsletter utiliza un único formulario externo en inglés, por decisión del propietario, y avisa de que las comunicaciones serán en inglés. Los textos propios del popup sí siguen el idioma de la web.

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

La navegación lateral fija incluye Qué hacemos, Expediciones, Tecnología, The Team y Contacto; la portada ofrece tres accesos inferiores. En móvil, los apartados se presentan en una cabecera compacta. El menú resalta la sección actual durante el desplazamiento.

## Equipo y contacto

Los cuatro retratos activos de assets/team son fotografías facilitadas por el usuario y retocadas con IA, optimizadas en WebP. Las funciones ampliadas y necesidades de personal adicional se documentan en TEAM-OPERATIONS.md para validación.

El formulario prepara un borrador local con destino a info@bqexplore.com, permite copiarlo y abre la aplicación de correo mediante mailto. El propietario confirma que el buzón está activo. No hay backend ni envío automático: el visitante confirma el envío en su aplicación de correo. La web no guarda estos campos en almacenamiento propio.

## Newsletter y privacidad

El aviso legal está en `/aviso-legal.html` y la política en `/privacidad.html`, con versiones en `/es/`. El titular ha autorizado expresamente publicar su identificación, NIF, domicilio y correo. Las altas están activas mediante el enlace `#newsletter-form-link`: Brevo recibe los correos en la lista **Newsletter Blue Quest**. El formulario en inglés exige email y consentimiento desmarcado inicialmente, enlaza la política y usa reCAPTCHA v3. Se ha comprobado un alta autorizada y su llegada a la lista; no se han enviado campañas. La configuración actual guarda el alta directamente, sin email de confirmación.

La web no carga Brevo ni Google al navegar o abrir el popup. Ofrece **Abrir formulario de suscripción / Ahora no**, indicando que el formulario se abre en una pestaña externa. Es un enlace normal con `target="_blank"` y `rel="noopener noreferrer"`, sin apertura programática ni iframe. Cerrar el popup no cierra la pestaña de Brevo, no cancela una suscripción ni borra cookies de esos proveedores. No hay claves privadas, API propia de suscriptores ni almacenamiento de correos en el repositorio o navegador.

El propietario comprobó que el mismo formulario fallaba incrustado y confirmaba la suscripción al abrirlo directamente. Por ello se ha retirado el acceso incrustado; no se ha determinado la causa interna del rechazo ni debilitado reCAPTCHA. No reintroducir el iframe sin una prueba real autorizada de envío en ese contexto. Recuperación previa: `checkpoint/20260912-155144096-antes-newsletter-formulario-externo`.

Antes de la primera campaña: completar la verificación telefónica que solicita Brevo, confirmar remitente/dominio, revisar seguimiento y comprobar el enlace de baja. Mantener los requisitos operativos de privacidad de `TODO.md`. La conexión del formulario no autoriza campañas automáticas ni garantiza la entregabilidad de futuros envíos.

Recuperación previa a la activación: `checkpoint/20260912-141320467-antes-activar-newsletter`; procedimiento en `BACKUP.md`.

Comprobaciones sin red ni altas: `node tests/languages.test.cjs` y `node tests/newsletter.test.cjs`. Revisar además el formulario externo en móvil y ordenador tras cambiar su diseño o configuración en Brevo.
