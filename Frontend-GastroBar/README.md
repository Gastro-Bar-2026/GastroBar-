# GastroBar — Frontend

## Descripción del proyecto

GastroBar es una aplicación web orientada a ofrecer a los clientes una experiencia sencilla e intuitiva para conocer los servicios del establecimiento e interactuar con su plataforma.

Este repositorio contiene el **frontend** de GastroBar, encargado de la interfaz visual y la interacción del usuario con la aplicación.

## Funcionalidades

- Página de inicio.
- Visualización del menú.
- Inicio de sesión de usuarios.
- Registro de usuarios.
- Interfaz de administración de servicios, según los permisos correspondientes.
- Conexión con el backend mediante solicitudes HTTP.

## Tecnologías utilizadas

- **Vue.js:** construcción de interfaces mediante componentes.
- **Vite:** herramientas para desarrollo y compilación del proyecto.
- **JavaScript:** lógica e interactividad.
- **HTML5:** estructura de las páginas.
- **CSS3:** estilos y diseño visual.
- **npm:** administración de dependencias.

## Requisitos previos

Antes de ejecutar el proyecto, debes tener instalado:

- Node.js.
- npm.
- Git, si deseas clonar el repositorio.

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/Gastro-Bar-2026/GastroBar-.git
   ```

2. Ingresa a la carpeta del frontend:

   ```bash
   cd GastroBar-/Frontend-GastroBar
   ```

3. Instala las dependencias:

   ```bash
   npm install
   ```

4. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abre en el navegador la dirección local que indique Vite, normalmente `http://localhost:5173`.

## Variables de entorno

Para conectar el frontend con el backend, crea un archivo `.env` dentro de `Frontend-GastroBar`.

Configura la variable con la URL de tu backend:

```env
VITE_API_URL=http://localhost:3000/api
```

En producción, utiliza la URL pública del backend desplegado.

**Importante:** las variables que comienzan con `VITE_` quedan disponibles en el código del frontend. No almacenes contraseñas, claves privadas ni secretos en ellas.

## Compilación para producción

Para generar los archivos optimizados del frontend, ejecuta:

```bash
npm run build
```

Vite generará la carpeta `dist`, que contiene los archivos preparados para su publicación.

Para probar la compilación localmente, puedes ejecutar:

```bash
npm run preview
```

## Despliegue en Render

El frontend puede publicarse en Render mediante un servicio de tipo **Static Site**.

Configuración:

| Campo | Valor |
|---|---|
| Repositorio | `Gastro-Bar-2026/GastroBar-` |
| Rama | `actualizacion-completa-backend-frontend` |
| Root Directory | `Frontend-GastroBar` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

Configura la variable `VITE_API_URL` con la URL pública del backend y vuelve a desplegar el frontend después de modificarla.

El backend también debe permitir solicitudes desde el dominio público del frontend mediante su configuración CORS.

## Estructura general

```text
Frontend-GastroBar/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── views/
│   ├── App.vue
│   ├── main.js
│   └── styles.css
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

*Nota: la estructura anterior es orientativa. Ajusta los nombres de carpetas y archivos para que coincidan con los que existen realmente en el proyecto.*

## Equipo de desarrollo

Proyecto académico desarrollado en el marco de la formación del SENA, con trabajo colaborativo y control de versiones mediante Git y GitHub.

## Licencia

Proyecto de uso académico. Las condiciones de distribución o reutilización dependen de las indicaciones del equipo de desarrollo.
