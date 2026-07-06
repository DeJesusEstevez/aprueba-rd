# Aprueba RD — Simulador del Examen Teórico de Licencia (INTRANT)

App web / PWA que **simula el examen teórico de la licencia de conducir** de la República
Dominicana. El usuario practica preguntas tipo test, ve sus fallos explicados y llega
preparado al examen del INTRANT. Pensada para instalarse en el celular y **empaquetarse a
Google Play** como TWA cuando quieras cobrar por dentro.

**Sitio 100% estático. $0. Sin backend. Sin base de datos.** Todo corre en el navegador del
usuario y **funciona sin internet** una vez cargado. El progreso (preguntas hechas, aciertos,
si compró la versión Pro) se guarda **solo en el dispositivo** con `localStorage`; no se
envía nada a ningún servidor.

---

## ⚡ Antes de publicar: revisa tu número de WhatsApp

El número de WhatsApp ya viene puesto: **18294418256** (el del dueño del proyecto). Se usa en
los botones de **soporte** y **"Hazte Pro"**.

Si necesitas cambiarlo, está en **`index.html`** (no en `app.js`): busca `wa.me/18294418256`
—aparece en los 3 enlaces de WhatsApp de la página— y reemplaza los dígitos por tu número en
formato `1` + código (809/829/849) + número, sin `+` ni espacios. Ejemplo: (829) 441-8256 →
`18294418256`. Las preguntas del examen viven en el arreglo `BANCO` de `app.js`.

---

## 🖥️ Probar en local (antes de subir nada)

Dos formas:

1. **La rápida:** doble clic en `index.html`. Abre y funciona.
2. **La correcta (para probar la PWA / offline):** el Service Worker y el `manifest`
   necesitan servirse por HTTP, no por `file://`. Dentro de la carpeta corre:

   ```bash
   python -m http.server 8000
   ```

   y entra a `http://localhost:8000`. Ahí puedes probar: instalar la app ("Agregar a
   pantalla de inicio"), apagar el WiFi y comprobar que **sigue funcionando offline**.

---

## 🎨 Generar los íconos y la imagen social (gratis, sin herramientas)

El manifest y las redes sociales necesitan **imágenes PNG** que no vienen incluidas (solo
vienen las fuentes `.svg`). Para crearlas:

1. Abre **`assets/generar-imagenes.html`** en el navegador (doble clic).
2. Presiona los botones para **descargar**:
   - `icon-192.png` y `icon-512.png` → ícono de la app (Play y PWA los exigen).
   - `og.png` (1200×630) → la imagen que se ve al compartir el link en WhatsApp/Facebook.
3. Guarda esos 3 archivos: los PNG de íconos **en la raíz** de la carpeta (junto a
   `index.html`) y `og.png` también en la raíz. El diseño ya está dibujado con los colores de
   la marca; solo descargas.

> Sin esto, la app funciona igual, pero el ícono se verá genérico al instalar y el preview al
> compartir saldrá vacío. Hazlo una vez y olvídate.

---

## 🚀 Publicar gratis (elige una)

**Opción A — Netlify (la más fácil, 2 min):**
1. Entra a https://app.netlify.com/drop
2. Arrastra la carpeta `licencia-rd` **completa** (con los PNG ya generados).
3. Listo: te da una URL pública (`algo.netlify.app`). Puedes conectar un dominio propio después.

**Opción B — Vercel:**
1. Sube la carpeta a un repo de GitHub.
2. En vercel.com → "Add New Project" → importa el repo → Deploy (sin configuración; es estático).

**Opción C — GitHub Pages:**
1. Repo nuevo → sube estos archivos.
2. Settings → Pages → Branch `main` / carpeta raíz → Save.

> **Al redesplegar:** arrastra la carpeta **completa** para que suban también los `.svg`,
> los `icon-*.png` y `og.png`. Sin `og.png` los previews de WhatsApp/Facebook salen en blanco.
> Para que la PWA sea instalable, la URL **debe ser HTTPS** (Netlify/Vercel/GitHub Pages ya
> lo dan gratis).

---

## 📱 Empaquetar a Google Play como TWA (cuando quieras cobrar)

Una **TWA** (Trusted Web Activity) es tu misma PWA metida dentro de una app Android nativa.
Es la forma barata y legítima de estar en Play sin reescribir nada. Dos caminos:

### Camino fácil — PWABuilder (recomendado para empezar)
1. Ya con tu PWA publicada en HTTPS, entra a https://www.pwabuilder.com
2. Pega la URL de tu sitio. Te analiza el `manifest` y el Service Worker (por eso importan).
3. Botón **"Package for stores" → Android**. Descargas un `.aab` (el archivo que sube a Play)
   y un `.apk` para probar.
4. PWABuilder te da también el archivo **`assetlinks.json`**: hay que subirlo a tu sitio en
   la ruta `/.well-known/assetlinks.json`. Eso es lo que le quita la barra de dirección del
   navegador a la app (que se vea nativa) y prueba que el dominio es tuyo.

### Camino con más control — Bubblewrap (CLI de Google)
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://TU-SITIO/manifest.webmanifest
bubblewrap build
```
Genera el `.aab` firmado. Requiere tener **JDK** y el **Android SDK** instalados.

### Requisitos mínimos de Play (que ya cubre esta app)
- **PWA válida:** `manifest.webmanifest` con `name`, `short_name`, `start_url`, `display:
  standalone`, `theme_color`, `background_color` e **íconos 192 y 512** → ya incluidos.
- **Service Worker** que cachea el app shell (offline) → `sw.js`, ya incluido.
- **HTTPS** en el dominio → lo da el hosting gratis.
- **`assetlinks.json`** en `/.well-known/` → te lo genera PWABuilder/Bubblewrap.
- **Cuenta de Google Play Console:** pago **único** de US$25 (no es mensual).
- Íconos, screenshots y descripción para la ficha → íconos ya los generas con
  `assets/generar-imagenes.html`.

> **Para cobrar dentro de la app** (la versión Pro): los pagos en Play deben pasar por
> **Google Play Billing**. En una TWA se integra con la **Digital Goods API + Play Billing**
> (PWABuilder tiene una opción para activarlo al empaquetar). Mientras tanto, en la web el
> botón "Hazte Pro" va por **WhatsApp** al dueño. Detalle del modelo en `KIT-DE-VENTA.md`.

---

## 📁 Archivos

| Archivo | Qué hace |
|---|---|
| `index.html` | Una sola página: hero, el problema, **el simulador** (la herramienta), cómo funciona, cómo se gana dinero / Pro, FAQ, footer legal. |
| `styles.css` | Diseño de la marca (tokens de color/tipografía en `:root`). Mobile-first. |
| `app.js` | Lógica del examen: banco de preguntas, selección aleatoria, corrección, explicaciones, puntaje, progreso en `localStorage`, registro del Service Worker, botones WhatsApp. |
| `manifest.webmanifest` | Metadatos PWA (nombre, íconos, colores, standalone). Necesario para instalar y para la TWA. |
| `sw.js` | Service Worker: cachea el app shell (cache-first) para uso **offline**. Nombre de caché versionado. |
| `icon.svg` | Ícono fuente **maskable** (referenciado en el manifest). |
| `favicon.svg` | Ícono de la pestaña del navegador. |
| `og.svg` | Fuente de la imagen social (de aquí sale `og.png`). |
| `assets/generar-imagenes.html` | Página con `<canvas>` que **dibuja y descarga** `icon-192.png`, `icon-512.png` y `og.png`. |
| `icon-192.png` / `icon-512.png` / `og.png` | **Los generas tú** con el archivo de arriba. Íconos de app + preview social. |
| `README.md` | Este archivo. |
| `KIT-DE-VENTA.md` | Monetización, proyección, canales gratis y copys de marketing. |

---

## 🧠 Cómo funciona el simulador

- Un **banco de preguntas** de opción múltiple sobre señales, normas de tránsito y seguridad
  vial, agrupadas por **categorías**.
- El usuario arranca un examen; la app elige preguntas al azar y va corrigiendo.
- Al fallar, muestra **la explicación** (aprender > adivinar).
- Al final: **puntaje**, aciertos/fallos y qué temas reforzar.
- El progreso se guarda en `localStorage` (nada sale del dispositivo).
- La versión **gratis** limita cantidad de exámenes/categorías y muestra anuncios; la **Pro**
  (compra única en Play) los desbloquea y quita anuncios. Ver `KIT-DE-VENTA.md`.

Para editar o ampliar preguntas: todo vive en el arreglo `BANCO` de `app.js`.

---

## ⚖️ Aviso legal

**Aprueba RD es una herramienta de estudio independiente. NO es una app oficial del INTRANT
ni del Gobierno dominicano, ni está afiliada a ellos.** Las preguntas son material de práctica
elaborado para ayudarte a prepararte; **no son necesariamente idénticas** a las del examen
oficial, que el INTRANT puede cambiar sin aviso. Aprobar en esta app **no garantiza** aprobar
el examen real. Verifica siempre los requisitos, tarifas y el temario vigente directamente con
el **INTRANT** (https://intrant.gob.do). Tus datos y tu progreso se guardan **solo en tu
dispositivo**; no se envían a ningún servidor.
