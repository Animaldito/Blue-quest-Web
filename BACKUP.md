# Recuperación de versiones

Usamos el historial de Git y puntos anotados `checkpoint/*`, conservados en el PC y en GitHub cuando se sincronizan. No copiamos carpetas completas, imágenes ni vídeos por cada cambio. Las etiquetas reutilizan los archivos ya guardados; no requieren IA, servicios de pago ni tareas periódicas.

## Antes de una mejora

1. Comprobar que el trabajo anterior está guardado y que no hay cambios ajenos pendientes. Traer las novedades del otro PC sin sobrescribir ediciones locales.
2. Ejecutar `node scripts/checkpoint.cjs antes-del-cambio` desde el repositorio. Se detiene si hay archivos sin guardar en Git, incluidos archivos nuevos no ignorados.
3. Hacer la mejora y comprobarla. Guardar solo archivos revisados en un commit y publicar mediante `git push --follow-tags origin main`, que incluye los puntos anotados asociados a su historial.

El punto anterior a esta renovación de cabecera es `checkpoint/2026-09-11-antes-cabecera-editorial`.

El punto previo al cambio bilingüe del 12 de septiembre de 2026 es `checkpoint/20260912-102734983-antes-web-bilingue`, sobre la versión `661427b`. Incluye la web española, el aviso legal, los recursos y la integración de newsletter desactivada. Se publica en GitHub junto con la mejora. Para deshacer únicamente el cambio de idioma, revertir el commit `Add English-first bilingual website with Spanish switch` tras verificar su identificador y que no haya cambios posteriores incompatibles. No restaura ni modifica la configuración externa del dominio, correo o Brevo.

## Si no gusta el resultado

Pedir «vuelve a la versión anterior» o indicar el cambio que se quiere deshacer. No hay que volver a generar la web.

- Consultar los puntos: `node scripts/checkpoint.cjs --list`.
- Para una mejora guardada en un único commit normal: comprobar su identificador y ejecutar `git revert <identificador>`. Se crea una nueva versión que deshace esa mejora sin borrar el historial. Resolver y revisar cualquier conflicto antes de publicar; `git revert --abort` cancela un revert incompleto.
- Para volver a un punto más antiguo, comparar primero los cambios posteriores y acordar cuáles se descartan. No ejecutar una restauración global ni un `reset --hard` automáticamente: podría eliminar mejoras posteriores que se quieren conservar.
- Antes de revertir, guardar el trabajo pendiente y crear otro checkpoint. Probar la versión recuperada y sincronizarla como una mejora normal. Vercel desplegará ese nuevo commit.

## Alcance y límites

Protege los archivos versionados de la web, incluidos código, textos e imágenes. No protege archivos ignorados, cambios aún sin guardar, credenciales ni la configuración externa de Vercel/GitHub. Nunca añadir secretos para incluirlos en una copia. No es un respaldo independiente de toda la cuenta: si se pierde el PC, GitHub permite recuperar lo que se haya sincronizado.

En el otro PC, actualizar el mismo repositorio y ejecutar `git fetch origin --tags` para consultar los mismos puntos. No forzar pushes ni borrar etiquetas de recuperación. Revisar solo el resumen y el cambio relevante mantiene breve el trabajo de recuperación y evita releer toda la web.
