# Contacto transaccional

El sitio es estático salvo `api/contact.js`, una función de Vercel.

- Guardar `BREVO_API_KEY` solo en las variables del servidor de Vercel, en Production. Tipo Secret recomendado; el titular ha preferido mantenerla como Config. No copiar su valor al repositorio ni al navegador.
- El remitente y destinatario están fijados en `info@bqexplore.com`. El email del visitante es exclusivamente Reply-To. No se crean suscriptores ni se envían campañas.
- Brevo debe permitir correo transaccional y el remitente debe estar autorizado. Una clave configurada no demuestra por sí sola que el proveedor acepte el envío.
- Tras cambiar una variable, desplegar de nuevo. Revisar el estado del envío en Brevo y confirmar llegada al buzón.

## Estados

- GET /api/contact: disponibilidad y token firmado; nunca devuelve la clave.
- POST /api/contact: valida campos, origen, tamaño y sesión antes de enviar texto plano.
- Sin conexión: conserva la consulta y permite copiarla o abrir el correo.
- Aceptado por Brevo no equivale a entrega al buzón. No se hace reintento automático de una petición cuyo resultado es incierto.

## Límites conocidos

La limitación de tres intentos por diez minutos e IP derivada, y la protección contra repetición de token, residen en la instancia de la función. No son controles distribuidos ni persistentes entre arranques. Complementarlos con reglas del proveedor o almacenamiento distribuido si el tráfico o el abuso lo requieren. No vender este mecanismo como protección completa contra bots. No se instala un nuevo proveedor de rastreo ni se desactiva el reCAPTCHA de la newsletter.

Cada envío incluye además una clave de idempotencia estable para la misma sesión y contenido, procesada por Brevo dentro de la ventana que documenta el proveedor. Reduce duplicados entre instancias, pero no es una garantía ilimitada ni permite afirmar entrega tras un resultado incierto.

## Verificación

Ejecutar `node tests/contact.test.cjs`: pruebas con proveedor simulado, sin correo real. Para verificar producción, enviar una sola consulta identificada como prueba al buzón de Blue Quest y revisar el registro transaccional.
