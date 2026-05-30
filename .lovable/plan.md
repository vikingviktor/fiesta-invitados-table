## Página de regalo de viaje (Japón & China)

Una página nueva y discreta, accesible solo por enlace directo (sin entrada en la navbar), donde los invitados que quieran contribuir al viaje de luna de miel encontrarán los datos de pago.

### Ruta y acceso
- Nueva ruta `/viaje` registrada en `src/App.tsx` (antes del catch-all).
- **No** se añade enlace en `Navbar.tsx` — solo accesible compartiendo el link manualmente.
- Sí se incluye `<ScrollToTop />` (ya global) y se mantiene el `<Navbar />` oculto: la página será standalone, sin navbar superior, con un pequeño link "← Volver" al home en la esquina.

### Contenido (tono mixto elegante)
Estructura vertical centrada, estilo coherente con el resto de la web (cream `#f8f6f1`, marrones, Cinzel para titulares sin bold, Uncial Antiqua para detalles decorativos):

1. **Título**: "Nuestra próxima aventura" / equivalente traducido.
2. **Texto introductorio** (2–3 frases): tras la boda en la Comarca, partimos hacia Tierras del Este — Japón y China. Si quieres acompañarnos en espíritu y contribuir al viaje, te dejamos abajo nuestras opciones. Sin presión, vuestra presencia ya es el mejor regalo.
3. **Tarjeta destacada — IBAN (opción principal)**:
   - Etiqueta "Transferencia bancaria"
   - IBAN en monospace + botón "Copiar" (con feedback toast)
   - Campo titular
4. **Dos tarjetas secundarias más pequeñas, lado a lado en desktop / apiladas en móvil**:
   - **Bizum**: número de teléfono + botón copiar
   - **PayPal**: usuario o enlace `paypal.me/...` + botón copiar / abrir
5. **Cierre breve**: "Arigatō / 谢谢 / Gracias" decorativo.

Los valores reales (IBAN, Bizum, PayPal) se dejan como **constantes en la parte superior del archivo** con placeholders claros (`PENDING_IBAN`, etc.) para que los rellenes fácilmente luego.

### Internacionalización
Añadir nuevas claves al `LanguageContext` para los 6 idiomas (es, en, it, zh, de, ml):
- `viaje.title`
- `viaje.intro1`, `viaje.intro2`
- `viaje.iban.label`, `viaje.iban.holder`
- `viaje.bizum.label`
- `viaje.paypal.label`
- `viaje.copy`, `viaje.copied`
- `viaje.closing`
- `viaje.back`

Para `zh` se usará el script chino correctamente; para `ml` (malayalam) traducción nativa.

### Componentes y archivos a crear/editar
- **Crear** `src/pages/Viaje.tsx` — página completa, sin dependencia de Navbar.
- **Crear** `src/components/viaje/PaymentCard.tsx` — tarjeta reutilizable con label, valor, y botón copiar (usa `navigator.clipboard` + `useToast`).
- **Editar** `src/App.tsx` — añadir `<Route path="/viaje" element={<Viaje />} />` antes del catch-all.
- **Editar** `src/contexts/LanguageContext.tsx` — añadir las claves de traducción en los 6 idiomas.

### Detalles técnicos
- Sin backend ni base de datos: página 100% estática.
- Sin tracking de quién contribuye (los pagos se ven en la cuenta bancaria normal).
- Selector de idioma sí se incluye en la página (esquina superior) para que cada invitado lo vea en su idioma.
- SEO: `<title>` y meta description discretos; sin indexar (`<meta name="robots" content="noindex">`) ya que es contenido privado.

### Lo que NO se hace
- No se modifica la navbar.
- No se añade ningún easter egg ni animación pesada (página sobria por respeto al propósito).
- No se integra pasarela de pago real — solo se muestran datos para que el invitado pague por su cuenta.