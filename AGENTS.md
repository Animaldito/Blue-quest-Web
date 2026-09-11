# Blue Quest — reglas del proyecto

## Principios de trabajo

- Mantener la web como sitio estático: HTML, CSS y JavaScript sin dependencias innecesarias.
- Guardar siempre los archivos de texto en UTF-8 sin BOM; verificar tildes, eñes y símbolos antes de publicar.
- Conservar la versión en español y el tono profesional, explorador y marítimo de la marca.
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

## Publicación

- La rama `main` se despliega automáticamente en Vercel.
- Sincronizar cambios al final del día o al terminar una mejora estable.
