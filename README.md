# 🎓 Bootcamp Platform Frontend - Antivirus para la Deserción
Frontend moderno para la plataforma educativa Antivirus para la deserción, construido en React + Remix + Vite.

Consume el backend Antivirus API y provee una experiencia web para estudiantes, administradores e instituciones.

## 🚀 Demo en Vivo
Frontend: http://3.142.142.153:3000/

Backend API: http://3.142.142.153:5000/

## 🗂️ Tabla de Contenidos

- [Características](#-características)
- [Stack Tecnológico](#-stack-tecnológico)
- [Primeros Pasos](#-Primeros-Pasos)
- [Configuración de Variables de Entorno](#-Configuración-de-Variables-de-Entorno)
- [Estructura del Proyecto](#-Estructura-del-Proyecto)
- [Consumo de la API](#-Ejemplo-de-Consumo-de-la-API)
- [Autenticación](#-Autenticación)
- [Notas de Seguridad](#-Notas-de-Seguridad)
- [Equipo de Desarrollo](#-Equipo-de-Desarrollo)

## ✨ Características

### 💻 Tecnologías
* React + Remix (SSR y CSR)
* Consumo de API .NET Core (CORS Ready)
* Integración directa con API Backend
* Despliegue en EC2 (IIS/Node)

### 🔐 Seguridad
* Autenticación JWT (token)
* Vistas protegidas y públicas
* Registro/Login con validación

### 👥 Experiencia de Usuario
* Gestión de usuarios y admins
* Listado de bootcamps, instituciones, oportunidades, servicios y beneficios
* UI responsive y moderna

## 💻 Stack Tecnológico

* **Frontend**: React 18 + Remix + Vite
* **Estilos**: TailwindCSS, Bootstrap 5, react-slick (carruseles)
* **API**: Consume Bootcamp Platform Backend
* **Autenticación**: JWT
* **Despliegue**: AWS EC2

## 🏁 Primeros Pasos

### Requisitos

- Node.js 18+
- npm 9+
- Git

### Instalación local

1. **Clona el repositorio**
```bash
  git clone <url-de-tu-repo-frontend>
  cd AntivirusFrontend/Frontend-Antivirus
```

2. **Instala dependencias**
```bash
  npm install
```

3. **Crea el archivo de variables de entorno (si aplica)**
```bash
  Por defecto usa http://3.142.142.153:5000/ como backend
```

4. **Ejecutar el programa**

-  Iniciar en desarrollo
```bash
  npm run dev
  Accede en http://localhost:3000/
```

6. **Build Producción**
```bash
npm run build
```
7. **Ejecución en producción**

```bash
npm run start
```
* O en EC2:
```bash
node build/server/index.js
```

---
**⚠️ Nota**: 

*Asegúrate de que el puerto 3000 esté abierto en el Security Group de AWS.*

---

## ⚡️Configuración de Variables de Entorno

Puedes agregar un archivo .env en la raíz para configurar el endpoint del backend:
```js
VITE_API_BASE_URL = http://3.142.142.153:5000/
```

## 🗃️ Estructura del Proyecto

```
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
```
## ⚡ Ejemplo de Consumo de la API

Los endpoints de autenticación y recursos se consumen directamente usando fetch/axios.

**Registro de usuario**

```js
await axios.post(`${API_URL}/api/users/register`, {
  email: "usuario@demo.com",
  password: "superseguro123",
  name: "Juan",
  lastName: "Pérez",
  dateBirth: "2000-01-01"
});
```

**Login de usuario**

```js
const res = await axios.post(`${API_URL}/api/users/login`, {
  email: "usuario@demo.com",
  password: "superseguro123"
});
const token = res.data.token;
```

**Uso de JWT en peticiones protegidas**
```js
await axios.get(`${API_URL}/api/bootcamps`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

## 🔐 Autenticación

* **Registro**: /api/users/register, /api/admins/register (públicos)
* **Login**: /api/users/login, /api/admins/login (públicos)

  * *El resto de endpoints requieren JWT (usuarios o admins)*
  * *Incluye el token JWT en el header:* `Authorization: Bearer TU_TOKEN_JWT`

## 📚 Documentación de la API

Consulta toda la documentación de la API backend en:

`http://3.142.142.153:5000/swagger`


## 📝 Notas de Seguridad

* NO compartas tus tokens JWT.
* No subas .env con claves sensibles a tu repositorio.
* El login/registro es público, pero toda administración requiere token.
* Asegúrate de tener HTTPS en producción.
* Controla permisos de usuario/admin desde backend.

## 👥 Equipo de Desarrollo

* [Anthony Muñoz](https://github.com/AnthonyCarmine)
* [María Camila Botero](https://github.com/mcamilabotero3)
* [María Alejandra Infante](https://github.com/MarialeInf)
* [Santiago Martínez](https://github.com/SantiagoMartinez22)
* [Esteban Montoya](https://github.com/emontoyab)
* [María Melisa Serna](https://github.com/Pantone7427)
* [Geny Marcela Vargas](https://github.com/genyvarsua)
