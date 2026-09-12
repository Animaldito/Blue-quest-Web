# Blue Quest — reglas del proyecto

## Principios de trabajo

- Mantener la web como sitio estático: HTML, CSS y JavaScript sin dependencias innecesarias.
- Guardar siempre los archivos de texto en UTF-8 sin BOM; verificar tildes, eñes y símbolos antes de publicar.
- Idioma inicial por país en Vercel: español para países hispanohablantes e inglés para el resto o país desconocido. La elección explícita EN / ES tiene prioridad. Conservar ambos idiomas y el tono profesional, explorador y marítimo de la marca.
- Editar los textos y estructura en `content/es/*.html` y sus traducciones revisadas en `translations.js`; ejecutar `node scripts/build-languages.cjs`. No editar directamente los seis HTML generados en raíz y `es/`.
- Mantener `window.BQ.t` en los textos de interacción, sin traducir datos escritos por visitantes. El idioma se conserva en la URL (`/es/` o `?lang=en`), no en cookies/almacenamiento. Las rutas y anclas existentes se mantienen compatibles. Conservar la excepción `lang=en` en `vercel.json` y los enlaces estáticos; verificar `node tests/geo-language.test.cjs` al cambiar idiomas o rutas. No aplicar redirecciones geográficas a recursos ni rutas españolas.
- Verificar con `node tests/languages.test.cjs` y comprobar ambas versiones en móvil/ordenador antes de publicar. «Tu destino» sigue desactivado. La newsletter está activa con un único formulario de Brevo y comunicaciones en inglés, por decisión del propietario. El formulario se abre mediante un enlace explícito en una pestaña externa; no incrustarlo ni cargar Brevo/reCAPTCHA dentro de Blue Quest. Cerrar el popup no cierra esa pestaña ni da de baja al suscriptor. No enviar campañas sin autorización.
- No modificar imágenes, enlaces de contacto ni el diseño global sin una petición expresa.

## Puntos de recuperación (obligatorio antes de una mejora)

- Revisar el estado local y las novedades de origin/main sin sobrescribir cambios del otro PC.
- Con el árbol limpio, ejecutar `node scripts/checkpoint.cjs nombre-breve` antes de editar. Usar el Node disponible en el entorno; no cambiar la política de ejecución del equipo.
- Si hay cambios sin guardar, preservarlos y resolver su guardado antes de crear el punto; no afirmar que una etiqueta los incluye.
- Guardar mejoras coherentes en commits y sincronizar con `git push --follow-tags origin main` para conservar también los puntos de recuperación.
- Para volver atrás, consultar `BACKUP.md`: preferir `git revert` con revisión y un nuevo commit, sin borrar historial ni forzar la rama.
- Mantener este flujo ligero: listar puntos y revisar el diff necesario, sin copias completas ni releer todo el repositorio.

## Antes de sincronizar con GitHub

- Revisar los cambios en `index.html`, `styles.css` y `app.js`.
- Comprobar que la web carga y que no hay caracteres mal codificados como `Ã` o `â`.
- Actualizar `CHANGELOG.md` para cambios permanentes y `TODO.md` para tareas pendientes o completadas.

## Investigación de destinos

- Las fuentes, centros, operadores consultados y agencias son información interna: no incluirlos en HTML, JavaScript, JSON, documentación pública ni comentarios enviados al repositorio.
- La investigación se conserva fuera del checkout público; consultar la copia local interna antes de actualizar contenidos. No publicar copias de respaldo de esa documentación.
- Ocultar en pantalla no basta: comprobar también los datos enviados al navegador. Mantener las temporadas y criterios de búsqueda al limpiar metadatos.

## Publicación

- La rama `main` se despliega automáticamente en Vercel.
- Sincronizar cambios al final del día o al terminar una mejora estable.
