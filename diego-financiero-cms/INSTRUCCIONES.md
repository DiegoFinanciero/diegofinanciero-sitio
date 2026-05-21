# 🚀 Diego Financiero — Guía de Configuración y Uso del CMS

---

## PASO 1 — Crear cuenta en GitHub (5 min)

1. Ve a https://github.com y crea una cuenta gratuita
2. Verifica tu email
3. Crea un repositorio nuevo:
   - Haz clic en el botón verde "New"
   - Nombre: `diegofinanciero`
   - Visibilidad: **Public**
   - Haz clic en "Create repository"

---

## PASO 2 — Subir los archivos a GitHub (5 min)

En la página de tu repositorio vacío, verás la opción "uploading an existing file":

1. Haz clic en "uploading an existing file"
2. Arrastra TODA la carpeta `netlify-deploy` (o su contenido)
3. Asegúrate de que estén todos estos archivos:
   ```
   index.html
   netlify.toml
   _redirects
   admin/
     index.html
     config.yml
   content/
     blog/
     herramientas/
     videos/
     podcast/
   img/
     foto.jpg
     foto-wide.jpg
     logo.jpg
     uploads/
   ```
4. Abajo escribe "Subida inicial del sitio" y haz clic en **"Commit changes"**

---

## PASO 3 — Conectar GitHub con Netlify (3 min)

1. Ve a https://app.netlify.com
2. Haz clic en **"Add new site" → "Import an existing project"**
3. Elige **GitHub**
4. Autoriza Netlify y selecciona el repositorio `diegofinanciero`
5. En configuración de build deja todo en blanco (no hay build)
6. Haz clic en **"Deploy site"**

✅ Tu sitio ya está publicado con una URL temporal (algo como `amazing-name-123.netlify.app`)

---

## PASO 4 — Activar Netlify Identity (para el panel de administración)

1. En Netlify, ve a **Site settings → Identity**
2. Haz clic en **"Enable Identity"**
3. En "Registration" selecciona **"Invite only"** (para que solo tú puedas entrar)
4. Baja hasta "Git Gateway" y haz clic en **"Enable Git Gateway"**

---

## PASO 5 — Crear tu usuario administrador

1. En Netlify → Identity → haz clic en **"Invite users"**
2. Escribe tu email y envía la invitación
3. Revisa tu correo y acepta la invitación
4. Crea tu contraseña

---

## PASO 6 — Acceder al panel de administración

Ve a: `https://TU-SITIO.netlify.app/admin/`

(Reemplaza TU-SITIO por tu URL de Netlify, o por `diegofinanciero.cl` cuando tengas el dominio)

Inicia sesión con tu email y contraseña.

---

## CÓMO USAR EL PANEL

### Escribir un artículo de blog:
1. Entra a `/admin/`
2. Haz clic en "📝 Blog"
3. Haz clic en "New Blog"
4. Escribe el título, elige la categoría, escribe el contenido
5. Haz clic en "Publish"
6. En 60 segundos aparece en tu sitio

### Agregar una herramienta:
1. Haz clic en "🛠️ Herramientas"
2. "New Herramientas"
3. Completa el nombre, ícono, tipo (gratis/patreon/próximamente) y descripción
4. Publish

### Agregar un episodio del podcast:
1. Haz clic en "🎙️ Podcast"
2. Completa número, título, invitado, descripción, duración y links
3. Publish

### Agregar un video:
1. Haz clic en "🎬 Videos"
2. Pega la URL de YouTube y agrega descripción
3. Publish

---

## FLUJO AUTOMÁTICO

```
Tú publicas en /admin
        ↓
Decap CMS guarda en GitHub
        ↓
Netlify detecta el cambio
        ↓
Tu sitio se actualiza en < 60 segundos
```

---

## SOPORTE

Si algo no funciona, revisa:
- Que "Git Gateway" esté habilitado en Netlify Identity
- Que hayas aceptado la invitación al email
- Que el archivo `admin/config.yml` esté correctamente subido a GitHub

