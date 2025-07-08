🎓 Bootcamp Platform Frontend
Frontend moderno para la plataforma educativa Bootcamp Platform, construido en React + Remix + Vite.
Consume el backend Antivirus API y provee una experiencia web para estudiantes, admins e instituciones.

🚀 Demo en Vivo
Frontend: http://3.142.142.153:3000/

Backend API: http://3.142.142.153:5000/

🗂️ Tabla de Contenidos
Características

Stack Tecnológico

Primeros Pasos

Configuración de Variables de Entorno

Estructura del Proyecto

Consumo de la API

Autenticación

Notas de Seguridad

Equipo de Desarrollo

✨ Características
React + Remix (SSR y CSR)

Consumo de API .NET Core (CORS Ready)

Autenticación JWT (token)

Vistas protegidas y públicas

Gestión de usuarios y admins

Registro/Login con validación

Listado de bootcamps, instituciones, oportunidades, servicios y beneficios

UI responsive y moderna

Integración directa con API Backend

Despliegue en EC2 (IIS/Node)

💻 Stack Tecnológico
Frontend: React 18 + Remix + Vite

Estilos: TailwindCSS, Bootstrap 5, react-slick (carruseles)

API: Consume Bootcamp Platform Backend

Autenticación: JWT

Despliegue: AWS EC2

🏁 Primeros Pasos
Requisitos
Node.js 18+

npm 9+

Git

Instalación local
bash
Copiar
Editar
# 1. Clona el repo
git clone <url-de-tu-repo-frontend>
cd AntivirusFrontend/Frontend-Antivirus

# 2. Instala dependencias
npm install

# 3. Crea el archivo de variables de entorno (si aplica)
# Por defecto usa http://3.142.142.153:5000/ como backend

# 4. Inicia en desarrollo
npm run dev

# 5. Accede en http://localhost:3000/
Build Producción
bash
Copiar
Editar
npm run build
Ejecución en producción
bash
Copiar
Editar
npm run start
# O en EC2:
node build/server/index.js
Nota: Asegúrate de que el puerto 3000 esté abierto en el Security Group de AWS.

⚡️ Configuración de Variables de Entorno
Puedes agregar un archivo .env en la raíz para configurar el endpoint del backend:

ini
Copiar
Editar
VITE_API_BASE_URL=http://3.142.142.153:5000/
🗃️ Estructura del Proyecto
java
Copiar
Editar
AntivirusFrontend/
├── public/
├── app/
│   ├── components/
│   ├── routes/
│   ├── styles/
│   ├── utils/
│   └── ...
├── build/
├── node_modules/
├── package.json
└── README.md
⚡ Ejemplo de Consumo de la API
Los endpoints de autenticación y recursos se consumen directamente usando fetch/axios.

Registro de usuario
js
Copiar
Editar
await axios.post(`${API_URL}/api/users/register`, {
  email: "usuario@demo.com",
  password: "superseguro123",
  name: "Juan",
  lastName: "Pérez",
  dateBirth: "2000-01-01"
});
Login de usuario
js
Copiar
Editar
const res = await axios.post(`${API_URL}/api/users/login`, {
  email: "usuario@demo.com",
  password: "superseguro123"
});
const token = res.data.token;
Uso de JWT en peticiones protegidas
js
Copiar
Editar
await axios.get(`${API_URL}/api/bootcamps`, {
  headers: { Authorization: `Bearer ${token}` }
});
🔐 Autenticación
Registro: /api/users/register, /api/admins/register (públicos)

Login: /api/users/login, /api/admins/login (públicos)

El resto de endpoints requieren JWT (usuarios o admins)

Incluye el token JWT en el header:

makefile
Copiar
Editar
Authorization: Bearer TU_TOKEN_JWT
📚 Documentación de la API
Consulta toda la documentación de la API backend en:
http://3.142.142.153:5000/swagger

📝 Notas de Seguridad
NO compartas tus tokens JWT.

No subas .env con claves sensibles a tu repositorio.

El login/registro es público, pero toda administración requiere token.

Asegúrate de tener HTTPS en producción.

Controla permisos de usuario/admin desde backend.

👥 Equipo de Desarrollo
Anthony Muñoz

María Camila Botero

María Alejandra Infante

Santiago Martínez

Esteban Montoya

María Melisa Serna

Geny Marcela Vargas


# Welcome to Remix!

- 📖 [Remix docs](https://remix.run/docs)

## Development

Run the dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.



