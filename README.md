# Blue Quest Web
Sitio de exploración y consultoría subacuática para resorts y centros de buceo. HTML, CSS y JavaScript, con una única función de servidor para contacto.
## Edición y publicación
1. Leer AGENTS.md, comprobar el estado y las novedades de origin/main.
2. Crear un checkpoint con scripts/checkpoint.cjs antes de una mejora.
3. Editar content/es/*.html y translations.js. No editar los HTML generados.
4. Ejecutar node scripts/build-site.cjs y las pruebas de tests/.
5. Revisar móvil y escritorio en ambos idiomas. Guardar un commit y sincronizar con git push --follow-tags origin main.
Vercel publica únicamente dist/ (50 archivos previstos, incluidas las licencias tipográficas). El script rechaza archivos inesperados en esa carpeta: no colocar notas ni fuentes internas dentro. Las funciones de api/ se despliegan aparte, no como archivos estáticos. El repositorio de GitHub sigue siendo público: los expedientes, investigación y datos privados deben conservarse fuera de él.
## Idiomas
Las direcciones estables son /en/ y /es/, incluidas las páginas legales. La raíz sigue seleccionando español para los 21 países/territorios hispanohablantes configurados y entrega inglés en el resto. Las antiguas direcciones y ?lang=en siguen siendo compatibles. Los enlaces manuales llevan a /en/ o /es/ sin guardar cookies ni preferencias en el navegador.
El selector conserva campos, equipo seleccionado, anclas e historial. Sitemap, canonical y hreflang usan las direcciones estables; la raíz es la alternativa automática.
## Diseño
En escritorio (desde 1024 × 640 px), cada sección tiene una altura mínima de una pantalla y un diseño compacto. Las anclas del menú alinean el comienzo con el borde superior. El contenido puede crecer si se amplía el texto, aparece un borrador de contacto o se reduce la ventana; no se oculta para forzar el ajuste. En móvil se mantiene la lectura vertical natural.
styles.css contiene un único sistema de colores, espaciado, tarjetas y puntos de adaptación. Se conserva azul/turquesa, anagrama blanco e intro repetible. En móvil, el menú de 76 px se despliega con un botón. Sin JavaScript los enlaces permanecen visibles. Los controles de tecnología preceden a la imagen, y el equipo mantiene cuatro columnas grandes, dos intermedias y una en móvil.
La portada da prioridad al contacto. Servicios y método explican el alcance sin inventar resultados. El ejemplo de entregable se ha retirado. Tu destino sigue desactivado; no se carga su catálogo.
## Fotografías y evidencias
Los retratos proceden de imágenes del titular previamente retocadas y ahora optimizadas. Las nuevas escenas de servicios y tecnología son ilustraciones generadas, identificadas como tales, no material de expediciones reales ni prueba de propiedad de equipos. Los originales anteriores se conservan en Git, pero los medios no utilizados no se despliegan.
No publicar casos, clientes, certificaciones, hallazgos o permisos sin documentación y autorización. Faltan materiales propios publicables de Raa Atoll y Boa Vista.
## Contacto
Consultar CONTACT.md. El servidor utiliza BREVO_API_KEY desde Vercel y envía únicamente a info@bqexplore.com. Nunca incluir esa clave en HTML, JavaScript público, Git ni capturas. Sin servicio disponible, el visitante puede copiar su consulta o preparar un correo; no se muestra un falso envío satisfactorio.
La aceptación del proveedor no garantiza entrega. Revisar el registro transaccional y la bandeja del destinatario. El contacto no da de alta en la newsletter.
## Newsletter y privacidad
Un único formulario de Brevo, en inglés, se abre en pestaña externa. Mantener consentimiento desmarcado inicialmente, enlace de privacidad y reCAPTCHA. No reintroducir el iframe que fallaba ni cargar proveedores externos al abrir el popup. No enviar campañas sin autorización específica.
Aviso legal y privacidad siguen enlazados al pie. No se añade analítica ni publicidad en esta mejora.
## Pruebas
- node tests/languages.test.cjs
- node tests/geo-language.test.cjs
- node tests/technology.test.cjs
- node tests/newsletter.test.cjs
- node tests/contact.test.cjs
- node tests/publication.test.cjs
- node tests/favicon.test.cjs
Las pruebas de contacto simulan el proveedor y no envían correos. Revisar adicionalmente el sitio publicado y realizar solo pruebas reales autorizadas.
## Decisiones pendientes del titular
- Alojamiento compatible con uso comercial: el proyecto figura en Vercel Hobby.
- Casos reales, autorización de imágenes y validación de procedimientos de campo.
- Seguimiento comercial y, si procede, protección distribuida del formulario.
