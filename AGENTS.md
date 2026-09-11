# Blue Quest — reglas del proyecto

## Principios de trabajo

- Mantener la web como sitio estático: HTML, CSS y JavaScript sin dependencias innecesarias.
- Guardar siempre los archivos de texto en UTF-8 sin BOM; verificar tildes, eñes y símbolos antes de publicar.
- Conservar la versión en español y el tono profesional, explorador y marítimo de la marca.
- No modificar imágenes, enlaces de contacto ni el diseño global sin una petición expresa.

## Antes de sincronizar con GitHub

- Revisar los cambios en `index.html`, `styles.css` y `app.js`.
- Comprobar que la web carga y que no hay caracteres mal codificados como `Ã` o `â`.
- Actualizar `CHANGELOG.md` para cambios permanentes y `TODO.md` para tareas pendientes o completadas.

## Publicación

- La rama `main` se despliega automáticamente en Vercel.
- Sincronizar cambios al final del día o al terminar una mejora estable.
