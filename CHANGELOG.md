# Registro de cambios

## 2026-09-14 — Bitácora sin la nota de estado repetida

- Eliminada la línea inferior de destino y estado en ambos idiomas, junto con su actualización y estilos. Se conservan los estados de la lista y de las fichas, la selección de destinos y la descripción accesible del globo.
- Punto previo: checkpoint/20260914-135257157-antes-quitar-nota-bitacora.

## 2026-09-14 — Encuadres que conservan los rostros

- Reencuadrados Miguel, Cristina y el equipo de la embarcación mediante posiciones individuales, sin modificar los archivos de imagen ni perder la optimización.
- Limitado el formato panorámico en escritorio a 2:1 para retratos y 4:1 para servicios cuando la ventana es ancha y baja. Las columnas y tamaños móviles se conservan; los marcos de cada grupo siguen siendo iguales.
- Comparación con la versión previa a la compresión y revisión en escritorio, portátil, tableta y móvil. Añadidas comprobaciones para proteger estos encuadres.
- Punto previo: checkpoint/20260914-104911207-antes-corregir-encuadres.

## 2026-09-14 — Optimización de todas las fotografías

- Preparadas versiones adaptativas de las 14 fotos visibles, con AVIF de alta calidad y alternativas WebP/JPEG para navegadores antiguos. Originales, proporciones, encuadres y resolución máxima conservados.
- Portada con prioridad de carga, decodificación asíncrona y carga diferida en fotos inferiores. La galería descarga solo la herramienta o vista de mapa seleccionada.
- Caché prolongada para imágenes con nombre vinculado a su contenido; sin claves, API de imágenes ni procesamiento en el servidor.
- Prueba móvil de 390 px y densidad 1: las nueve fotos habituales (portada, servicios, mapa inicial y equipo) pasan de 859.550 a 331.595 bytes, un 61,4 % menos. No incluye fuentes, código, transferencias HTTP ni las otras cinco vistas de tecnología, que se cargan al seleccionarlas. El ahorro varía con la pantalla, densidad de píxeles y navegador.
- A resolución máxima, las 14 fotos pasan de 1.621.618 a 1.336.268 bytes en AVIF (17,6 % menos), sin contar las variantes alternativas que no se descargan simultáneamente.
- Punto previo: checkpoint/20260914-100023298-antes-optimizar-fotografias.

## 2026-09-14 — Tecnología con cuatro herramientas

- Ocultada la máscara con comunicación en español e inglés. Se mantienen batimetría, sonar, cámaras 360° y scooters.
- Menú móvil equilibrado en dos filas de dos botones. Las fotos de la máscara permanecen en el repositorio, fuera del despliegue, para poder recuperarlas.
- Punto previo: checkpoint/20260914-093039700-antes-ocultar-mascara.

## 2026-09-14 — Fotografía real de cámara 360°

- Sustituida la ilustración por la fotografía facilitada de una cámara sobre trípode en el fondo marino, en EN/ES.
- Recorte 8:5 y versiones WebP de 640 × 400 y 960 × 600; misma medida y marco que el resto de herramientas. Corrección suave de luz y contraste mediante CSS, sin reconstruir ni añadir elementos a la fotografía.
- Descartados los retoques generativos por alterar detalles. Conservada la imagen anterior en el historial y fuera del despliegue.
- Punto previo: checkpoint/20260914-090316943-antes-foto-camara-360.

## 2026-09-14 — Apellido de Andreu

- Corregido a Andreu Ferreres en español e inglés, incluido el texto alternativo de su fotografía.
- Punto previo: checkpoint/20260914-085049553-antes-corregir-apellido-andreu.

## 2026-09-14 — Fotografías del equipo y desarrollo de negocio

- Sustituidas las fotos de Aida y Andreu por las nuevas fotografías originales aportadas por el propietario, con encuadres adaptados al diseño existente.
- Actualizados el rol, las credenciales y la biografía de Cristina en español e inglés: Desarrollo de negocio / Business Development.
- Conservadas las fotografías anteriores en el historial y fuera del despliegue activo.
- Punto previo: checkpoint/20260914-082609356-antes-actualizar-equipo-fotos-cristina.

## 2026-09-13 — Fichas animadas de Bitácora

- Incorporadas las cuatro fichas aprobadas, accesibles desde los puntos del globo y la lista de destinos, en español e inglés.
- Raa Atoll y Boa Vista muestran resultados facilitados por Blue Quest. Leyte y Addu Atoll muestran encargos y objetivos previstos, sin presentar resultados futuros como realizados.
- HUD con intro breve de sonar y aparición progresiva; después los datos permanecen visibles. Sin vídeo pesado, pausa ni botón de repetición. Adaptado a móvil y movimiento reducido.
- Cierre por botón, Escape o fondo, con retorno al punto de navegación y conservación de la posición de lectura.
- Punto previo: checkpoint/20260913-181959654-antes-fichas-animadas-bitacora.

## 2026-09-13 — Secciones completas en pantalla

- Ajustados márgenes, fotografías, tarjetas y formulario para que los seis apartados ocupen una pantalla de escritorio, sin asomar los apartados contiguos al navegar por el menú.
- Altura mínima adaptable, alineación de anclas al borde superior y ajuste suave entre secciones. Sin bloquear la rueda ni recortar contenido; móvil, zoom y ventanas pequeñas conservan lectura natural.
- Conservados todos los textos, imágenes, controles y campos. El acceso al método lleva a su sección completa.
- Punto previo: checkpoint/20260913-154632763-antes-secciones-pantalla-completa.

## 2026-09-13 — Retirar el ejemplo ilustrativo

- Eliminado el bloque completo de demostración y su enlace desde la landing en español e inglés. Los dos accesos restantes ocupan el espacio disponible.
- Retirado también el enlace «Servicios y entregables» de la portada; se conserva el botón principal de contacto.
- Limpiados los estilos y las traducciones exclusivos del ejemplo; se mantienen servicios, método, mapas y contacto.
- Punto previo: checkpoint/20260913-152022582-antes-quitar-ejemplo-ilustrativo.

## 2026-09-13 — Menos notas y mapas originales

- Retiradas las notas auxiliares de servicios, método, tecnología y contacto en ambos idiomas. Bitácora conserva el estado de cada destino sin avisos sobre informes pendientes.
- La ficha mantiene su identificación como ejemplo y el formulario conserva la privacidad y los mensajes necesarios ante errores.
- Recuperados los mapas anteriores de relieve, satélite y sonar, con selector accesible y encuadre uniforme. La vista elegida se conserva al cambiar de herramienta o idioma.
- Punto previo: checkpoint/20260913-142441117-antes-limpiar-notas-y-recuperar-mapas.

## 2026-09-13 — Oferta, experiencia y contacto profesional

- Contacto verificado en producción, con alternativa por correo cuando el servicio no esté disponible. Notas técnicas y de pruebas conservadas fuera del repositorio público.
- Verificación publicada: páginas EN/ES y privacidad accesibles, notas internas fuera del despliegue. Una única prueba transaccional detectó remitente no validado en Brevo; el formulario comprueba ahora ese estado y ofrece borrador en vez de envío directo cuando no está activo.
- Newsletter de Brevo guardada con identidad Blue Quest, política EN, consentimiento desmarcado y mensajes más útiles, sin cambiar lista ni reCAPTCHA. Copia de textos/aspecto anterior conservada localmente fuera del repositorio.
- Reorganizada la oferta con servicios, entregables, método y una ficha explícitamente demostrativa. CTA principal hacia consulta de proyectos. No se inventan casos ni certificaciones.
- Conservada la identidad visual y consolidada la hoja de estilos. Menú móvil desplegable de 76 px, controles de tecnología antes de su imagen y retratos más legibles.
- Sustituidas las escenas de servicios y tecnología por ilustraciones generadas identificadas; imágenes responsivas y medios anteriores excluidos del despliegue. El globo deja de redibujarse continuamente cuando está pausado.
- Contacto servidor a servidor con Brevo, remitente/destinatario fijos, validación, token de sesión, control básico de intentos y alternativa por correo. Sin listas de marketing ni campañas.
- Direcciones /en/ y /es/, compatibilidad con raíz y enlaces anteriores, sitemap, metadatos sociales y Organization. Publicación mediante lista de archivos; notas y fuentes de trabajo fuera del dominio.
- Actualizada privacidad para el envío directo. Pruebas de idiomas, galería, newsletter, endpoint y publicación; revisión visual en 320, 390, 768, 1024 y 1440 px.
- Punto previo: checkpoint/20260913-113342721-antes-mejora-integral-empresa-web (8bb6527).
- El dosier de empresa se conserva fuera del repositorio público. El alojamiento comercial y los casos reales requieren acciones del titular.

## 2026-09-12 — Idioma inicial por país

- Añadida detección de país con reglas temporales de Vercel: español para España y países/territorios hispanohablantes; inglés para el resto o país desconocido. No se añaden servicios externos, funciones ni cookies.
- La elección manual tiene prioridad mediante `/es/` y `?lang=en`, también al recargar, seguir enlaces legales o abrir una pestaña sin JavaScript. Conservados otros parámetros, anclas y contenido introducido.
- Actualizada la explicación técnica en privacidad y documentación, sin cambios de diseño ni del formulario externo de newsletter en inglés.
- Pruebas locales de los 21 países/territorios y alternativas; verificados EN / ES, historial, borrador, selección de equipo y páginas legales en navegador, con pantallas de 320, 390 y 1440 px sin desbordamientos ni errores.
- Punto previo: `checkpoint/20260912-192158416-antes-idioma-por-pais`.

## 2026-09-12 — Pies de foto centrados en ventajas

- Sustituidos los nombres duplicados bajo las imágenes por cinco mensajes breves: «Saber dónde buscar», «Detectar antes de ver», «Cada ángulo cuenta», «Más alcance, menos esfuerzo» y «Conectados, más seguros», con adaptación inglesa.
- Conservados los nombres del selector, fotografías, encuadres y medidas. Mensaje inicial, selección de equipo y actualización de idioma usan los nuevos textos.
- Añadida prueba ligera de las cinco ventajas en ambos idiomas. Verificados los diez textos en móvil de 320 px y escritorio de 1440 px, sin recortes ni cambios de altura de la galería.
- Punto previo: `checkpoint/20260912-183814090-antes-pies-de-foto-ventajas`.

## 2026-09-12 — Bitácora y galería de tecnología homogénea

- Sustituido «Nuestras exploraciones» por «Bitácora» / «Field log», en una línea sin repetir el vocabulario de otros títulos. Conservados el subtítulo, el menú y el ancla de expediciones.
- Las cinco herramientas y las tres vistas cartográficas comparten lienzo panorámico 8:5, fondo, borde y tamaño de tarjeta. Encuadres específicos conservan cámara, pantalla de sonar, scooter y máscara; retiradas las franjas blancas de los mapas y el fondo blanco exclusivo del scooter.
- Ajustes de presentación no destructivos, sin regenerar ni distorsionar fotografías, ni alterar colores o datos de los mapas. Espacio de controles reservado para evitar saltos de altura; controles cartográficos ocultos fuera de mapas.
- Verificados selección, imágenes cargadas, medidas idénticas y ausencia de desbordamiento en español e inglés, escritorio y móvil (320–1440 px).
- Punto previo: `checkpoint/20260912-180542415-antes-bitacora-galeria-homogenea`.

## 2026-09-12 — Encabezados de sección unificados

- Nueva frase de Conócenos: «Distintas personas, distintos roles, un mismo objetivo: tu éxito». Inglés: «Different people, different roles, one shared goal: your success».
- Las cinco secciones comparten tipografía, tamaños, contraste y dos columnas con márgenes izquierdos comunes. Frases en una línea y alineadas por abajo en escritorio; debajo del título en pantallas pequeñas.
- Verificadas ambas versiones entre 320 y 1920 px, sin recortes; prueba de idioma ampliada para la nueva frase.
- Punto previo: `checkpoint/20260912-171302869-antes-encabezados-unificados`.

## 2026-09-12 — Frase de Nuestro trabajo en una línea

- Reducido el tamaño adaptable de la frase para mantenerla en una sola línea junto al título en escritorio, con la misma alineación inferior y color.
- En pantallas pequeñas conserva 18 px y saltos naturales bajo el título para evitar recortes. Comprobados español e inglés entre 320 y 1920 px.
- Punto previo: `checkpoint/20260912-170804009-antes-frase-una-linea`.

## 2026-09-12 — Encabezados más compactos

- Frase de Nuestro trabajo al lado del título y alineada por abajo en escritorio; debajo en pantallas pequeñas, conservando tamaño y contraste.
- Expediciones pasa a «Nuestras exploraciones» con «Destinos visitados y próximas prospecciones». Inglés: «Our explorations» y «Past destinations and upcoming surveys».
- Comprobados ambos idiomas de 320 a 1440 px, sin desbordamiento horizontal; pruebas de traducción actualizadas.
- Punto previo: `checkpoint/20260912-170208969-antes-alineacion-y-exploraciones`.

## 2026-09-12 — Frase de Nuestro trabajo junto al título

- Reubicada la frase introductoria debajo del título, alineada a la izquierda, con mayor tamaño y contraste dentro de la paleta existente.
- Conservados texto, traducción y demás secciones. Comprobados ambos idiomas de 320 a 1440 px, sin recortes.
- Punto previo: `checkpoint/20260912-165537072-antes-subtitulo-nuestro-trabajo`.

## 2026-09-12 — Oportunidades en la portada

- Cambiada la frase de portada a «Nuevas oportunidades para resorts y centros de buceo» y «New opportunities for resorts and dive centres»; sin cambios de diseño.
- Punto previo: `checkpoint/20260912-165142801-antes-oportunidades-portada`.

## 2026-09-12 — Newsletter con acceso directo a Brevo

- Sustituido el formulario incrustado por un botón principal que abre el mismo formulario en una pestaña externa. El propietario confirmó error en el iframe y alta correcta fuera de él; la causa interna del rechazo no está determinada.
- Conservados lista, formulario, consentimiento y reCAPTCHA. Sin envíos automáticos, nuevas altas de prueba ni cambios en los contactos durante esta corrección.
- Eliminadas cargas, temporizadores y estilos del iframe. Popup bilingüe con instrucciones, cierre accesible y aviso previo del servicio externo.
- Actualizados privacidad, aviso legal, pruebas y documentación para describir el nuevo recorrido.
- Verificados el enlace real a la pestaña de Brevo, el cierre y la navegación con teclado, y el popup en ambos idiomas de 320 a 1366 px. Pruebas de idiomas, newsletter e icono correctas.
- Punto previo: `checkpoint/20260912-155144096-antes-newsletter-formulario-externo`.

## 2026-09-12 — Equipo en una fila de escritorio

- Cuatro columnas desde 1200 px, dos entre 761 y 1199 px y una en móvil. Conservadas las fotografías panorámicas, los textos y el orden de los perfiles.
- Ajustados márgenes y nombres para el nuevo ancho; filas compartidas de contenido alinean nombres y biografías sin alturas fijas ni texto oculto.
- Comprobados ambos idiomas entre 320 y 1920 px, sin desbordamiento horizontal ni texto recortado; pruebas de idiomas, newsletter e icono correctas.
- Punto previo: `checkpoint/20260912-152936814-antes-equipo-cuatro-columnas`.

## 2026-09-12 — Icono de pestaña actualizado

- Sustituido el símbolo antiguo por el anagrama Q con aleta actual, blanco sobre el turquesa de marca y sin texto para mantener legibilidad a tamaño pequeño.
- Icono vectorial compartido por portada, aviso legal y privacidad en ambos idiomas. URL versionada para solicitar el nuevo icono aunque el navegador conserve el anterior en caché.
- Punto previo: `checkpoint/20260912-144012702-antes-icono-pestana`.

## 2026-09-12 — Newsletter activa con Brevo

- Conectado el formulario inglés aprobado a la lista Newsletter Blue Quest. El alta autorizada se ha comprobado en Brevo; inscripción directa sin email adicional de confirmación, sin enviar campañas.
- Popup disponible en ambos idiomas, indicando que el formulario y las novedades estarán en inglés. Casilla de suscripción obligatoria y desmarcada gestionada por Brevo, con enlace a la política de Blue Quest y reCAPTCHA invisible.
- Permiso separado antes de cargar servicios externos, alternativa «Ahora no» y retirada al cerrar; la web no guarda esa elección ni los correos. Abrir el popup no carga Brevo ni Google.
- Acceso alternativo visible sobre el formulario, aviso de carga lenta, cierre accesible durante el desplazamiento y más espacio útil en móvil.
- Actualizados privacidad y aviso legal en ambos idiomas; requisitos previos a la primera campaña conservados en TODO.
- Pruebas de generación/idiomas y del ciclo de permiso sin red; revisión del popup y formulario en móvil y ordenador. No se ha probado aún una campaña ni su baja.
- Punto previo: `checkpoint/20260912-141320467-antes-activar-newsletter`.

## 2026-09-12 — Más luz con la misma paleta

- Aclarados los fondos marinos mediante mezclas suaves con el blanco existente y luz turquesa tenue; conservados los colores del logo, los botones y los indicadores.
- Superficies diferenciadas para tarjetas, secciones, navegación y campos; bordes y textos secundarios más legibles. Misma estructura y tamaños.
- Menos sombra sobre la fotografía de portada, con transición al nuevo fondo y protección de contraste en la cabecera. Fotografías de servicios menos veladas, sin modificar archivos de imagen ni añadir descargas.
- Popup y páginas legales armonizados; impresión de las páginas legales conservada.
- Revisión visual en móvil y ordenador, ambos idiomas, pruebas de idiomas y regresión del menú en doce anchos. Contraste de los textos de contenido muestreados superior a 4,5:1 incluso sobre la luz ambiental.
- Punto previo: `checkpoint/20260912-120433144-antes-luz-ambiente`.

## 2026-09-12 — Menú móvil sin palabras cortadas

- Eliminada una regla global antigua de `destination-finder.css` que imponía cuatro columnas con `!important`, incluso con el buscador oculto.
- El menú móvil utiliza filas flexibles: cada enlace conserva el nombre completo en una línea y pasa entero a la siguiente fila cuando no cabe. Sin truncar, partir palabras, reducir etiquetas ni ocultar opciones.
- Altura de cabecera medida para ajustar el espacio de portada, el desplazamiento a secciones y el estado activo. Menú de ordenador conservado.
- Pruebas en inglés y español a 280, 320, 360, 375, 390, 414, 480, 481, 540, 640, 740 y 760 px, cambio de orientación y texto del menú al 200 %. Enlaces con zona táctil mínima de 44 px.
- Punto previo: `checkpoint/20260912-111233697-antes-menu-movil`.

## 2026-09-12 — Títulos de sección diferenciados del menú

- Conservados los nombres y anclas del menú lateral.
- Nuevos encabezados: Nuestro trabajo / Our work; Sigue nuestras exploraciones / Where we explore; Así trabajamos / How we work; Conócenos / Meet the team; Pregunta sin compromiso / Let’s talk — no obligation.
- Traducciones adaptadas al tono profesional de Blue Quest; sin cambios en las imágenes ni los demás textos.
- Punto previo: `checkpoint/20260912-110507249-antes-titulos-secciones`.

## 2026-09-12 — Portada de exploración de arrecifes

- Retirado el enlace al aviso legal del lateral, conservando el acceso del pie de página en inglés y español.
- Nueva escena fotorrealista generada para representar prospección de arrecifes recreativos con coral, peces y dos buceadores. Es ilustrativa, no un registro de una expedición real; procedencia en `assets/hero/SOURCES.md`.
- Imagen WebP de 1672 × 940 px y aproximadamente 240 KB; encuadre móvil y capas de contraste adaptados, sin cambios en los textos de la portada.
- La imagen anterior se conserva. Punto previo: `checkpoint/20260912-105537518-antes-portada-arrecife`.
- Comprobados ambos idiomas, seis tamaños de pantalla, enlaces legales del pie, selector, formulario y controles existentes.

## 2026-09-12 — Inglés predeterminado y selector EN / ES

- Traducción revisada de portada, secciones, textos alternativos, formularios, mensajes dinámicos y páginas legales; nombres, datos de contacto e imágenes conservados.
- Seis páginas estáticas en inglés/español, con rutas propias y alternativas de idioma para buscadores. Cambio sin recarga, sin cookies, con conservación de estado y funcionamiento sin JavaScript.
- Controles móviles de al menos 44 px y pruebas a 1440, 1024, 768, 760, 390 y 320 px; comprobación de navegación, globo, equipo, borradores, historial y ausencia de llamadas externas.
- Punto de recuperación `checkpoint/20260912-102734983-antes-web-bilingue`. Newsletter y buscador de destinos permanecen desactivados.

Este archivo resume los cambios permanentes realizados en la web.

## 2026-09-11 — Aviso legal y acceso vertical

- Publicación autorizada expresamente por el titular de sus datos identificativos en la web y el repositorio público.
- Sustituida la frase del lateral por «Aviso legal», con tipografía discreta, disposición vertical y acceso también en móvil y pie de página.
- Añadida página de aviso legal con titularidad, alcance de exploración/consultoría confirmado por el propietario, condiciones de uso, acceso a privacidad, cookies y atención.
- Revisión de cookies y almacenamiento en la web pública y local: sin cookies, localStorage, sessionStorage ni peticiones a terceros en el recorrido comprobado. No se añade un panel de cookies opcionales mientras no se utilicen.
- Se conserva la pausa de newsletter hasta completar consentimiento, aviso y comprobaciones en Brevo. Los requisitos operativos ajenos a la página se mantienen como pendientes, sin afirmar cumplimiento integral.

## 2026-09-11 — Privacidad y contacto de bqexplore.com

- Añadida `privacidad.html` con los datos del responsable facilitados por el propietario, el correo activo y enlaces desde Contacto, newsletter y pie de página.
- Actualizados los destinos de correo a info@bqexplore.com. El formulario sigue preparando un borrador para enviar desde la aplicación de correo, sin envío automático.
- La integración de Brevo queda conservada pero desactivada mediante `data-newsletter-ready="false"`: no carga el formulario ni sus recursos mientras falten su aviso y consentimiento.
- Dominio verificado con www; la conexión HTTPS al dominio raíz presenta un error pendiente de revisión, sin modificar DNS ni correo.

## 2026-09-11 — Formulario de Brevo integrado

- Sustituido el formulario desactivado por el formulario público de Brevo facilitado por el propietario, dentro del popup existente.
- Carga solo al abrir el popup, conserva su estado al reabrir y ofrece un enlace alternativo si no se muestra.
- Los envíos y sus confirmaciones los gestiona Brevo; la web no contiene claves privadas ni guarda correos en su propio almacenamiento.
- Pendiente revisar consentimiento, privacidad y confirmación doble en Brevo. No se han creado suscriptores de prueba ni enviado campañas.
- Integración comprobada en vista previa; publicación pendiente de completar la información de privacidad. Borrador legal conservado fuera del repositorio público.

## 2026-09-11 — Logo reproducible y popup de newsletter

- Pulsar el logo vuelve al inicio y reinicia su intro, respetando movimiento reducido.
- Retirados el nombre duplicado de la portada, «Tu próximo proyecto» y «Hablemos» del lateral.
- Añadido «Apúntate a la newsletter» con diálogo accesible, cierre por botón, Escape y fondo, y retorno del foco.
- Formulario de newsletter preparado pero desactivado: aún no hay una cuenta/lista conectada. No almacena ni transmite correos y no muestra confirmaciones ficticias.

## 2026-09-11 — Logo completo con intro de sonar

- Reunidos el anagrama y BLUE QUEST en el bloque turquesa de la barra lateral, con adaptación móvil.
- Intro original de unos tres segundos: barrido de sonar, trazado del símbolo, aparición del nombre y reflejo final; después queda estático.
- Animación vectorial sin vídeo, sonido ni dependencias nuevas; versión estática con movimiento reducido.
- La vista previa de Envato no pudo reproducirse; no se han utilizado recursos de esa plantilla.

## 2026-09-11 — Retirada de la sección Asesoramiento

- Eliminada la sección y su entrada del menú; los accesos de proyecto llevan ahora a Contacto.
- Contenido anterior recuperable mediante el punto de recuperación.

## 2026-09-11 — Nombres de sección y mayor legibilidad

- Sustituidos los eslóganes de secciones y servicios por nombres directos; conservado el propósito principal en portada.
- Aumentados textos, botones, navegación y encabezados, con ajustes para móvil.
- «Tu destino» permanece oculto.

## 2026-09-11 — Textos breves y selector en pausa

- Simplificados servicios, tecnología, asesoramiento, equipo y contacto; retiradas notas y repeticiones.
- Biografías resumidas en un párrafo por persona, manteniendo sus responsabilidades esenciales.
- «Tu destino» oculto y retirado del menú; su script no se carga. Se conservan sección, fichas y código para reactivación futura.
- Conservado un aviso breve de que el formulario no envía y el buzón aún no está activo.

## 2026-09-11 — Limpieza de minitítulos

- Eliminados los antetítulos de las secciones, el enlace secundario «Conoce nuestro enfoque», la nota de ubicaciones del globo y la categoría redundante de las imágenes de tecnología.
- Conservados encabezados principales, navegación, roles del equipo e instrucciones funcionales.

## 2026-09-11 — Equipo con retratos panorámicos

- Fotografías alineadas con el ancho del texto de cada biografía, en formato horizontal 3:1 y con poca altura.
- Fondos ampliados mediante edición de imagen para adaptar los cuatro retratos al formato; conservadas las versiones anteriores.
- Comprobados márgenes, carga de imágenes y ausencia de desbordamientos en escritorio y móvil.

## 2026-09-11 — Retratos de equipo secundarios

- Reducidos los retratos a 128 × 96 px en escritorio y 104 × 78 px en móvil, con margen dentro de cada perfil.
- Conservados los archivos originales, encuadres proporcionales y biografías; mayor protagonismo del texto.

## 2026-09-11 — Fichas públicas sin referencias internas

- Retirados enlaces, centros, operadores y agencias consultadas de las fichas y del catálogo descargable.
- Investigación conservada fuera del repositorio público; documentación pública sustituida por una descripción funcional.
- Conservados destinos, fauna, temporadas y criterios de búsqueda; añadido control de ausencia de metadatos internos.
- El historial anterior no se reescribe: puede conservar versiones publicadas previamente.

## 2026-09-11 — Cabecera integrada y puntos de recuperación

- Punto de recuperación del estado publicado anterior a los cambios; script portable para crear y listar etiquetas anotadas sin duplicar archivos.
- Protocolo de guardado y sincronización de puntos incorporado a AGENTS.md; recuperación mediante nuevos commits, sin borrar el historial.
- Eliminados los peces dibujados de la marca: tipografía con textura oceánica tenue y reflejo lento, pausable y compatible con movimiento reducido.
- «Exploramos nuevos puntos de buceo recreativo» pasa a ser el titular principal, con énfasis turquesa en nuevos puntos.
- Anagrama blanco, barra lateral de 148 px (144 px en escritorio estrecho) y cabecera transparente sin franja blanca. Navegación móvil más compacta.
- Conservados destinos, tecnología, equipo y formulario.

## 2026-09-11 — Catálogo reconstruido por destinos y rutas reales

- Sustituido el catálogo inicial por 40 fichas de 24 países y territorios con 67 referencias.
- Investigación documental por zonas y rutas concretas; procedencia conservada en documentación interna.
- Separadas las rutas Norte, BDE y St. John's del mar Rojo; rutas de Maldivas y zonas estacionales de Komodo.
- Ventanas de operación, recomendación de viaje y fauna independientes, con coincidencia estricta de todos los intereses en los mismos meses.
- Fichas con puntos de inmersión, formato de viaje, fauna estacional, limitaciones y fuentes; no se prometen avistamientos ni disponibilidad.
- Retirada la base v1 (recuperable en Git), actualizada la documentación y ampliadas las pruebas de procedencia, meses y 140 combinaciones.

## 2026-09-11 — Selector interactivo de destinos

- Investigadas y preparadas 21 fichas de 14 países con 33 referencias, fecha de revisión y limitaciones explícitas.
- Añadida «Tu destino» a la navegación y un flujo por intereses, fauna, época y resultados.
- Límite de tres intereses, coincidencia conjunta por mes, ballenas separadas del tiburón ballena y snorkel separado de botella.
- Carga anticipada y reutilizada del catálogo, fichas desplegables, más resultados bajo demanda y recuperación ante fallo de red.
- Documentados los usos de OBIS/WoRMS, la metodología editorial y el procedimiento de ampliación; sin prometer un inventario mundial ni probabilidades de avistamiento.
- Comprobadas 140 combinaciones y el comportamiento de escritorio y móvil, incluidas validación, ramificación y reintento.

## 2026-09-11 — Cabecera con arrecife vivo

- Coral fijo en la base de BLUE QUEST y pequeños peces animados de izquierda a derecha dentro de las letras, con contorno fino.
- Frase de propósito ampliada y distribución más ancha para aprovechar el espacio de la cabecera.
- Conservada la pausa al pulsar la marca y el respeto al movimiento reducido, sin iconos adicionales.

## 2026-09-11 — Arrecife y propósito en la marca

- Ampliada la firma BLUE QUEST y sustituido su relleno por una fotografía de arrecife con peces.
- Añadida la frase «Exploramos nuevos puntos de buceo recreativo».
- Eliminado el icono de reproducción/pausa; la marca permite pausar el efecto mediante clic o teclado, sin iconos adicionales.
- Conservados el fondo blanco, la alineación del anagrama y el turquesa del acceso a proyectos.

## 2026-09-11 — Marca fotográfica y cabecera alineada

- Igualada la altura del bloque del anagrama y la cabecera; alineación lateral también en móvil.
- Fondo blanco limpio y BLUE QUEST como elemento principal, con fotografía submarina integrada en las letras.
- Reflejo periódico cada ocho segundos, control de pausa y respeto a movimiento reducido.
- Acceso a proyectos más discreto, en DM Sans y con el turquesa exacto del titular sobre fondo oscuro para mantener legibilidad.
- Comprobadas alineación, colores, animación, formulario y navegación de 320 a 1440 px.

## 2026-09-11 — Cabecera translúcida y servicios fotográficos

- Franja superior blanca translúcida, destello de entrada y acceso destacado a «Tu próximo proyecto» en verde oscuro.
- BLUE QUEST sustituye el lema superior; el bloque de marca conserva únicamente el anagrama animado.
- Retirada la numeración decorativa en menú, secciones, fichas, equipo y pasos; conservadas las fechas y los datos.
- Encabezados ampliados con tamaños adaptables a móvil.
- Fotografías estrechas de resort, barca con buceadores y pecio sustituyen los iconos de servicios, con transparencia suave.
- Comprobadas navegación, carga de imágenes, formulario y preferencia de movimiento reducido.

## 2026-09-11 — Fotografías reales del equipo

- Sustituidos los retratos de muestra por las cuatro fotografías aportadas, editadas con IA para luz, nitidez y encuadre.
- Cristina al timón, Miguel con neopreno, Aida junto a la roca y Andreu en la ciudad.
- Imágenes WebP locales, en color y con proporción 4:3, sin rótulos provisionales.

## 2026-09-11 — Máscara en inmersión

- Sustituida la fotografía de catálogo por un submarinista utilizando una Neptune durante una inmersión.
- Retirada la superposición del comunicador para mostrar una única escena, coherente con cámara y scooter.

## 2026-09-11 — Perfiles profesionales del equipo

- Eliminado el bloque «Preparar también lo que no se ve».
- Integradas las responsabilidades de seguridad, superficie, logística, permisos, seguros y medios especializados en los perfiles correspondientes.
- Revisadas biografías y áreas de responsabilidad; terminología uniforme con «submarinista» y sin «in situ».
- Conservadas las titulaciones aportadas, las fotografías y el resto de la web.

## 2026-09-11 — Equipo, contacto e imágenes en inmersión

- The Team: cuatro perfiles, responsabilidades por áreas y retratos de muestra identificados.
- Navegación ampliada con Equipo y Contacto, adaptada a móvil.
- Formulario local para preparar, copiar y abrir un borrador en el cliente de correo; no envía datos, no usa servicios externos ni almacena consultas.
- Buzón info@bluequest.com pendiente de activación por indicación del usuario; aviso visible y sin confirmaciones falsas de envío.
- Fotografías de scooter con buceador en sidemount y cámara 360° con buceador.

## 2026-09-11 — Tecnología centrada en aplicaciones

- Eliminados los nombres de fabricantes y modelos de los textos y descripciones accesibles del apartado de tecnología.
- Presentación por categorías y aplicaciones, como selección ilustrativa de herramientas, sin afirmar cantidades de equipos.
- Conservadas todas las fotografías, su orden y los créditos fotográficos y fuentes documentales.

## 2026-09-11 — Orden y fotografía de equipos

- Orden: mapa batimétrico, sonar, cámaras 360°, scooter y máscara de comunicación; mapa seleccionado al entrar.
- Retirados los enlaces públicos a imágenes y fichas, conservando las fuentes en la documentación.
- Sustituida la imagen de estudio de DJI por una fotografía de la Osmo 360 II en uso con empuñadura.

## 2026-09-11 — Fotografías de tecnología

- Galería de imágenes oficiales seleccionables: DJI Osmo 360 II, Garmin LiveScope XR, Subnado Plus doble, Neptune II y GSM G.Divers.
- Navionics con vistas alternativas de relieve, satélite e imagen sonar.
- Imágenes locales, textos alternativos y créditos enlazados. Verificadas todas las selecciones en móvil y escritorio.

## 2026-09-11 — Identidad animada

- Emblema vectorial original basado en la referencia de Q con aleta, con firma BLUE QUEST / EXPLORE FURTHER.
- Introducción breve al cargar: aparece el anillo, emerge la aleta y se revela el nombre; después queda estático.
- Destello al pasar el ratón o enfocar con teclado, sin vídeo, dependencias ni reproducción continua.
- Adaptación al bloque de marca de escritorio y móvil; se respeta la preferencia de movimiento reducido.

## 2026-09-11 — Navegación de exploración

- Rediseño inspirado en la referencia facilitada: marca turquesa, barra lateral fija numerada y accesos inferiores en portada.
- Conservados los cuatro apartados, los destinos y las interacciones del globo y los equipos.
- Cabecera compacta en móvil, enlaces accesibles y apartado activo al desplazarse.
- Tipografías alojadas localmente con sus licencias para eliminar la dependencia de Google Fonts en ejecución.
- Verificado en escritorio (1440 px) y móvil (390 px): sin desbordamientos ni errores JavaScript; destinos y acordeones operativos.

## 2026-09-11 — Corrección UTF-8 publicada

### Corregido

- Reparada la codificación de los textos de `index.html` y `app.js`.
- Los caracteres españoles y símbolos de interfaz se guardan en UTF-8 sin BOM.
