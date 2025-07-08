import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, json } from "@remix-run/node";
import { RemixServer, Outlet, Meta, Links, ScrollRestoration, Scripts, Link, Form } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import React, { useContext, createContext, useState, lazy, Suspense, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import { UserIcon, CalendarIcon, EnvelopeIcon, LockClosedIcon, EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { FaCheck, FaGoogle, FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const slickStylesHref = "/assets/slick-BQDR39Kr.css";
const slickThemeHref = "/assets/slick-theme-B5v5TVGB.css";
function LoadingComponent() {
  return /* @__PURE__ */ jsx("div", {});
}
const AuthContext = createContext(void 0);
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("");
  const [user, setUser] = useState(null);
  const login = (userData, token) => {
    setIsAuthenticated(true);
    setRole(userData.role || "");
    setUser(userData);
    if (token) {
      localStorage.setItem("token", token);
    }
    localStorage.setItem("user", JSON.stringify(userData));
  };
  const logout = () => {
    setIsAuthenticated(false);
    setRole("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };
  React.useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setIsAuthenticated(true);
      setRole(userData.role || "");
      setUser(userData);
    }
  }, []);
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value: { isAuthenticated, user, role, login, logout }, children });
};
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
const Navbar = lazy(() => import("./Navbar-GWsZ2pg5.js"));
const Footer = lazy(() => import("./Footer-dYCtXwIG.js"));
const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap"
  },
  { rel: "stylesheet", href: slickStylesHref },
  { rel: "stylesheet", href: slickThemeHref }
];
const loader = async ({ request }) => {
  try {
    const response = await fetch("http://3.142.142.153:5000/api/auth/validate-token", {
      headers: { Cookie: request.headers.get("Cookie") || "" },
      credentials: "include"
      // Asegúrate de enviar cookies al backend
    });
    const isAuthenticated = response.ok;
    return json({ isAuthenticated });
  } catch (error) {
    console.error("Error al verificar la autenticación:", error);
    return json({ isAuthenticated: false });
  }
};
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsx("body", { className: "bg-[#fafafa] min-h-screen", children: /* @__PURE__ */ jsxs(AuthProvider, { children: [
      /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(LoadingComponent, {}), children: /* @__PURE__ */ jsx(Navbar, {}) }),
      /* @__PURE__ */ jsx("main", { children }),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {}),
      /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(LoadingComponent, {}), children: /* @__PURE__ */ jsx(Footer, {}) })
    ] }) })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: App,
  links,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const API_BASE_URL = "http://3.142.142.153:5000/api";
const axiosInstance = axios.create({ baseURL: API_BASE_URL });
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
function OportunidadesPage() {
  const [oportunidades, setOportunidades] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axiosInstance.get("/Opportunities").then((res) => setOportunidades(res.data)).catch(() => setOportunidades([])).finally(() => setLoading(false));
  }, []);
  return /* @__PURE__ */ jsx("section", { className: "min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-50 py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-black text-blue-900 mb-6 text-center tracking-tight drop-shadow-lg", children: "Oportunidades" }),
    loading ? /* @__PURE__ */ jsx("div", { className: "flex justify-center py-20", children: /* @__PURE__ */ jsx("span", { className: "text-blue-600 text-lg font-semibold", children: "Cargando oportunidades..." }) }) : oportunidades.length === 0 ? /* @__PURE__ */ jsx("div", { className: "flex justify-center py-20", children: /* @__PURE__ */ jsx("span", { className: "text-gray-500 text-lg font-semibold", children: "No hay oportunidades disponibles." }) }) : /* @__PURE__ */ jsx("div", { className: "grid gap-8 sm:grid-cols-2 md:grid-cols-3", children: oportunidades.map((o) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all border-t-4 border-blue-400 flex flex-col",
        children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: o.imageUrl,
              alt: o.name,
              className: "h-40 w-full object-cover rounded-xl mb-4 border",
              onError: (e) => e.target.src = "/default-op.png"
            }
          ),
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-blue-700 mb-2", children: o.name }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4 flex-1", children: o.description }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "mt-auto bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded shadow-sm transition-all",
              disabled: true,
              title: "Próximamente podrás aplicar",
              children: "Aplicar"
            }
          )
        ]
      },
      o.id
    )) })
  ] }) });
}
function Oportunidades() {
  return /* @__PURE__ */ jsx(OportunidadesPage, {});
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Oportunidades
}, Symbol.toStringTag, { value: "Module" }));
function SuperAdmin() {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    lastName: "",
    email: "",
    password: "",
    dateBirth: "",
    role: "user"
    // Por defecto, el rol será "user"
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const API_BASE_URL2 = "http://3.142.142.153:5000/api";
  const axiosInstance2 = axios.create({
    baseURL: API_BASE_URL2
  });
  axiosInstance2.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  useEffect(() => {
    const fetchData = async () => {
      var _a, _b;
      try {
        const [usersResponse, rolesResponse, userRolesResponse] = await Promise.all([
          axiosInstance2.get("/User"),
          axiosInstance2.get("/Roles"),
          axiosInstance2.get("/UserRoles")
        ]);
        const allUsers = usersResponse.data;
        const roles = rolesResponse.data;
        const userRoles = userRolesResponse.data;
        const userRoleId = (_a = roles.find((role) => role.name === "user")) == null ? void 0 : _a.id;
        const adminRoleId = (_b = roles.find((role) => role.name === "admin")) == null ? void 0 : _b.id;
        if (userRoleId === void 0 || adminRoleId === void 0) {
          console.error("No se encontraron los roles 'user' o 'admin'.");
          return;
        }
        const adminsList = allUsers.filter(
          (user) => userRoles.some((userRole) => userRole.users_id === user.id && userRole.role_id === adminRoleId)
        );
        const usersList = allUsers.filter(
          (user) => userRoles.some((userRole) => userRole.users_id === user.id && userRole.role_id === userRoleId)
        );
        setAdmins(adminsList);
        setUsers(usersList);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      if (isEditing) {
        await axiosInstance2.put(`/User/${formData.id}`, formData);
        setMessage("Usuario actualizado exitosamente.");
      } else {
        const userResponse = await axiosInstance2.post("/auth/register", {
          name: formData.name,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          dateBirth: formData.dateBirth
        });
        const newUser = userResponse.data;
        if (formData.role === "admin") {
          const adminRoleId = 2;
          await axiosInstance2.post("/UserRoles", {
            users_id: newUser.id,
            role_id: adminRoleId
          });
          setMessage("Usuario creado como administrador exitosamente.");
        } else {
          setMessage("Usuario creado exitosamente.");
        }
      }
      refreshUsers();
      resetForm();
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
      if (error.response && error.response.data) {
        setMessage(`Error: ${error.response.data.message || "No se pudo guardar el usuario."}`);
      } else {
        setMessage("Hubo un error al guardar el usuario.");
      }
    }
  };
  const handleEdit = (user) => {
    setFormData({
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      password: "",
      dateBirth: user.dateBirth || "",
      role: "user"
      // Por defecto, se asume que es "user"
    });
    setIsEditing(true);
  };
  const handleDelete = async (id) => {
    try {
      await axiosInstance2.delete(`/User/${id}`);
      setMessage("Usuario eliminado exitosamente.");
      refreshUsers();
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      setMessage("Hubo un error al eliminar el usuario.");
    }
  };
  const refreshUsers = async () => {
    try {
      const response = await axiosInstance2.get("/User");
      setUsers(response.data);
    } catch (error) {
      console.error("Error al refrescar la lista de usuarios:", error);
    }
  };
  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      lastName: "",
      email: "",
      password: "",
      dateBirth: "",
      role: "user"
    });
    setIsEditing(false);
  };
  if (loading) {
    return /* @__PURE__ */ jsx("p", { children: "Cargando datos..." });
  }
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-center text-blue-900 mb-8", children: "Gestión de Usuarios" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mb-8", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold mb-4 text-gray-700", children: [
        isEditing ? "Editar" : "Crear",
        " Usuario"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "name", className: "block text-gray-700 font-semibold mb-2", children: "Nombre" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            id: "name",
            name: "name",
            value: formData.name,
            onChange: handleChange,
            required: true,
            className: "w-full px-4 py-3 border rounded bg-gray-100 text-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "lastName", className: "block text-gray-700 font-semibold mb-2", children: "Apellido" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            id: "lastName",
            name: "lastName",
            value: formData.lastName,
            onChange: handleChange,
            required: true,
            className: "w-full px-4 py-3 border rounded bg-gray-100 text-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "block text-gray-700 font-semibold mb-2", children: "Correo Electrónico" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "email",
            id: "email",
            name: "email",
            value: formData.email,
            onChange: handleChange,
            required: true,
            className: "w-full px-4 py-3 border rounded bg-gray-100 text-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "dateBirth", className: "block text-gray-700 font-semibold mb-2", children: "Fecha de Nacimiento" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "date",
            id: "dateBirth",
            name: "dateBirth",
            value: formData.dateBirth,
            onChange: handleChange,
            required: true,
            className: "w-full px-4 py-3 border rounded bg-gray-100 text-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          }
        )
      ] }),
      !isEditing && /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "password", className: "block text-gray-700 font-semibold mb-2", children: "Contraseña" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "password",
            id: "password",
            name: "password",
            value: formData.password,
            onChange: handleChange,
            required: true,
            className: "w-full px-4 py-3 border rounded bg-gray-100 text-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "role", className: "block text-gray-700 font-semibold mb-2", children: "Rol" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "role",
            name: "role",
            value: formData.role,
            onChange: handleChange,
            className: "w-full px-4 py-3 border rounded bg-gray-100 text-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
            children: [
              /* @__PURE__ */ jsx("option", { value: "user", children: "Usuario" }),
              /* @__PURE__ */ jsx("option", { value: "admin", children: "Administrador" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("button", { type: "submit", className: "bg-blue-500 text-white font-bold py-3 px-5 rounded hover:bg-blue-600 transition duration-200", children: isEditing ? "Actualizar" : "Crear" }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: resetForm, className: "ml-4 bg-gray-500 text-white font-bold py-3 px-5 rounded hover:bg-gray-600 transition duration-200", children: "Cancelar" })
    ] }),
    message && /* @__PURE__ */ jsx("p", { className: "text-center text-green-500 font-bold mb-4", children: message }),
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-blue-900 mb-4", children: "Lista de Administradores" }),
    /* @__PURE__ */ jsxs("table", { className: "table-auto w-full bg-white shadow-md rounded-lg mb-8", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-200 text-gray-700", children: [
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "ID" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Nombre" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Apellido" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Correo" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Fecha de Nacimiento" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Acciones" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: admins.map((admin) => /* @__PURE__ */ jsxs("tr", { className: "border-t", children: [
        /* @__PURE__ */ jsx("td", { className: "px-4 py-2", children: admin.id }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-2", children: admin.name }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-2", children: admin.lastName }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-2", children: admin.email }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-2", children: admin.dateBirth }),
        /* @__PURE__ */ jsxs("td", { className: "px-4 py-2 flex space-x-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleEdit(admin),
              className: "bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600",
              children: "Editar"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleDelete(admin.id),
              className: "bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600",
              children: "Eliminar"
            }
          )
        ] })
      ] }, admin.id)) })
    ] }),
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-blue-900 mb-4", children: "Lista de Usuarios" }),
    /* @__PURE__ */ jsxs("table", { className: "table-auto w-full bg-white shadow-md rounded-lg", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-200 text-gray-700", children: [
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "ID" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Nombre" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Apellido" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Correo" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Fecha de Nacimiento" }),
        /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Acciones" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: users.map((user) => /* @__PURE__ */ jsxs("tr", { className: "border-t", children: [
        /* @__PURE__ */ jsx("td", { className: "px-4 py-2", children: user.id }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-2", children: user.name }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-2", children: user.lastName }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-2", children: user.email }),
        /* @__PURE__ */ jsx("td", { className: "px-4 py-2", children: user.dateBirth }),
        /* @__PURE__ */ jsxs("td", { className: "px-4 py-2 flex space-x-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleEdit(user),
              className: "bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600",
              children: "Editar"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleDelete(user.id),
              className: "bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600",
              children: "Eliminar"
            }
          )
        ] })
      ] }, user.id)) })
    ] })
  ] });
}
function SuperAdminRoute() {
  return /* @__PURE__ */ jsx(SuperAdmin, {});
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SuperAdminRoute
}, Symbol.toStringTag, { value: "Module" }));
function Card({
  image,
  title,
  description,
  buttonLink,
  onClick
}) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-lg rounded-sm w-[450px] h-80 overflow-hidden text-center flex flex-col", children: [
    /* @__PURE__ */ jsx(
      "img",
      {
        src: image,
        alt: title,
        className: "w-full h-[160px] object-cover rounded-lg"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "p-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mt-4", children: title }),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: buttonLink,
            className: "mt-2 inline-block text-[#1D1854] py-1 px-6 border border-[#1D1854] rounded-full hover:bg-[#1D1854] hover:text-white transition",
            children: "Abrir"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-3 h-[60px] text-gray-600 text-sm text-pretty truncate", children: description }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-row-reverse text-[#faa307] font-bold", children: /* @__PURE__ */ jsx(
        "button",
        {
          onClick,
          children: "... ver más"
        }
      ) })
    ] })
  ] });
}
function FilterSearch({ onFilter }) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [sector, setSector] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ query, location, type, sector });
  };
  return /* @__PURE__ */ jsx("div", { className: "p-10", children: /* @__PURE__ */ jsxs(
    Form,
    {
      method: "get",
      onSubmit: handleSubmit,
      className: "border border-[#00266BB5] shadow-md p-9 flex flex-col gap-5",
      children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "query",
            placeholder: "🔍    Busca tu próxima oportunidad",
            value: query,
            onChange: (e) => setQuery(e.target.value),
            className: "border border-gray-300 rounded-full p-2 mx-16 text-black bg-white"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center gap-2", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "date-start", className: "px-4 text-center", children: "¡Filtra tu búsqueda!" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              name: "dateStart",
              id: "date-start",
              className: "border border-gray-300 p-2 text-[#FAA307] bg-white"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              name: "dateEnd",
              id: "date-end",
              className: "border border-gray-300 p-2 text-[#FAA307] bg-white"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "border border-[#D9D9D9]", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "location", className: "px-4", children: "Ubicación" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                name: "location",
                id: "location",
                value: location,
                onChange: (e) => setLocation(e.target.value),
                className: "border border-gray-300 p-2 text-black bg-white",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Todas" }),
                  /* @__PURE__ */ jsx("option", { value: "Medellín", children: "Medellín" }),
                  /* @__PURE__ */ jsx("option", { value: "Bogotá", children: "Bogotá" }),
                  /* @__PURE__ */ jsx("option", { value: "Armenia", children: "Armenia" }),
                  /* @__PURE__ */ jsx("option", { value: "Rionegro", children: "Rionegro" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "border border-[#D9D9D9]", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "type", className: "px-4", children: "Tipo de oportunidad" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                name: "type",
                id: "type",
                value: type,
                onChange: (e) => setType(e.target.value),
                className: "border border-gray-300 p-2 text-black bg-white",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Todas" }),
                  /* @__PURE__ */ jsx("option", { value: "Educativa", children: "Educativa" }),
                  /* @__PURE__ */ jsx("option", { value: "Laboral", children: "Laboral" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "border border-[#D9D9D9]", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "sector", className: "px-4", children: "Sector" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                name: "sector",
                id: "sector",
                value: sector,
                onChange: (e) => setSector(e.target.value),
                className: "border border-gray-300 p-2 text-black bg-white",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Todos" }),
                  /* @__PURE__ */ jsx("option", { value: "Tecnología", children: "Tecnología" }),
                  /* @__PURE__ */ jsx("option", { value: "Ciencias", children: "Ciencias" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-row gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "px-4 py-2 bg-[#FAA307] text-white font-bold rounded",
                children: "Búsqueda"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "reset",
                className: "px-4 py-2 border border-[#D9D9D9] rounded",
                children: /* @__PURE__ */ jsx("a", { href: "/novedades", children: "Limpiar" })
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function Novedades() {
  const [services, setServices] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCards, setVisibleCards] = useState(6);
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4e3,
    pauseOnHover: true,
    arrows: true,
    centerMode: true,
    centerPadding: "40px",
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          centerPadding: "30px"
        }
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          centerPadding: "10px"
        }
      }
    ]
  };
  useEffect(() => {
    axios.get("http://3.142.142.153:5000/api/Services").then((res) => setServices(res.data)).catch(() => setServices([]));
  }, []);
  useEffect(() => {
    axios.get("http://3.142.142.153:5000/api/Opportunities").then((res) => {
      setOpportunities(res.data);
      setFilteredOpportunities(res.data);
    }).catch(() => {
      setOpportunities([]);
      setFilteredOpportunities([]);
    }).finally(() => setLoading(false));
  }, []);
  const handleFilter = (filters) => {
    const { query, location, type, sector } = filters;
    const filtered = opportunities.filter((o) => {
      var _a, _b;
      const matchesQuery = ((_a = o.name) == null ? void 0 : _a.toLowerCase().includes(query.toLowerCase())) || ((_b = o.description) == null ? void 0 : _b.toLowerCase().includes(query.toLowerCase()));
      const matchesLocation = location ? o.location === location : true;
      const matchesType = type ? o.oportunity_type === type : true;
      const matchesSector = sector ? o.sector === sector : true;
      return matchesQuery && matchesLocation && matchesType && matchesSector;
    });
    setFilteredOpportunities(filtered);
    setVisibleCards(6);
  };
  if (loading) {
    return /* @__PURE__ */ jsx("p", { className: "text-center text-gray-600 py-12", children: "Cargando contenido..." });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center bg-[#F7FAFF] min-h-screen", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-[#1D1856] text-[70px] font-extrabold pt-8 pb-4", children: "Novedades" }),
    /* @__PURE__ */ jsx("div", { className: "w-full max-w-6xl px-2 md:px-8 py-4", children: /* @__PURE__ */ jsx(Slider, { ...sliderSettings, children: services.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-12 flex items-center justify-center h-64", children: /* @__PURE__ */ jsx("p", { className: "text-gray-400", children: "No hay servicios disponibles." }) }) : services.map((service) => /* @__PURE__ */ jsx("div", { className: "px-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white shadow-xl rounded-2xl p-6 h-[370px] flex flex-col items-center justify-between transition-transform duration-300 hover:scale-105 border-2 border-blue-100", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: service.imageUrl || "https://picsum.photos/300/150?blur=2",
          alt: service.name,
          className: "rounded-lg h-36 w-full object-cover mb-4 shadow-md"
        }
      ),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-[#00266B] mb-2 text-center", children: service.name }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-700 text-sm py-2 text-center line-clamp-4", children: service.description })
    ] }) }, service.id)) }) }),
    /* @__PURE__ */ jsx("div", { className: "w-full max-w-5xl mx-auto mt-10 mb-6", children: /* @__PURE__ */ jsx(FilterSearch, { onFilter: handleFilter }) }),
    /* @__PURE__ */ jsx("h2", { className: "text-[#1D1856] text-[40px] font-bold mb-6", children: "¡Oportunidades para estudiar!" }),
    filteredOpportunities.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-lg py-10", children: "No se encontraron oportunidades." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "w-full flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-6 px-2 md:px-4 w-full max-w-6xl", children: filteredOpportunities.slice(0, visibleCards).map((opportunity) => /* @__PURE__ */ jsx("div", { className: "flex", children: /* @__PURE__ */ jsx(
        Card,
        {
          image: opportunity.imageUrl || "https://via.placeholder.com/300",
          title: opportunity.name,
          description: opportunity.description,
          buttonLink: `/oportunidades/${opportunity.id}`,
          onClick: () => {
          }
        }
      ) }, opportunity.id)) }) }),
      /* @__PURE__ */ jsx("div", { className: "my-8" }),
      visibleCards < filteredOpportunities.length && /* @__PURE__ */ jsx(
        "button",
        {
          className: "mb-10 px-8 py-3 bg-[#FAA307] text-white font-bold rounded hover:bg-[#FFB454] transition-all",
          onClick: () => setVisibleCards((prev) => prev + 6),
          children: "▼ Mostrar más resultados"
        }
      )
    ] })
  ] });
}
function NovedadesPage() {
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Novedades, {}) });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: NovedadesPage
}, Symbol.toStringTag, { value: "Module" }));
function ServiciosPage() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axiosInstance.get("/Services").then((res) => setServicios(res.data)).catch(() => setServicios([])).finally(() => setLoading(false));
  }, []);
  return /* @__PURE__ */ jsx("section", { className: "min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-50 py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-black text-blue-900 mb-6 text-center tracking-tight drop-shadow-lg", children: "Servicios" }),
    loading ? /* @__PURE__ */ jsx("div", { className: "flex justify-center py-20", children: /* @__PURE__ */ jsx("span", { className: "text-blue-600 text-lg font-semibold", children: "Cargando servicios..." }) }) : servicios.length === 0 ? /* @__PURE__ */ jsx("div", { className: "flex justify-center py-20", children: /* @__PURE__ */ jsx("span", { className: "text-gray-500 text-lg font-semibold", children: "No hay servicios disponibles." }) }) : /* @__PURE__ */ jsx("div", { className: "grid gap-8 sm:grid-cols-2 md:grid-cols-3", children: servicios.map((s) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all border-t-4 border-blue-400 flex flex-col",
        children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: s.imageUrl,
              alt: s.name,
              className: "h-40 w-full object-cover rounded-xl mb-4 border",
              onError: (e) => e.target.src = "/default-serv.png"
            }
          ),
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-blue-700 mb-2", children: s.name }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4 flex-1", children: s.description }),
          /* @__PURE__ */ jsx("span", { className: "inline-block bg-blue-50 text-blue-600 font-bold rounded px-3 py-1 text-xs shadow", children: "Servicio Activo" })
        ]
      },
      s.id
    )) })
  ] }) });
}
function Servicios() {
  return /* @__PURE__ */ jsx(ServiciosPage, {});
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Servicios
}, Symbol.toStringTag, { value: "Module" }));
const airplaneRegister = "/assets/airplaneRegister-C53R1DqA.png";
function Register() {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    dateBirth: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({
    name: false,
    lastName: false,
    dateBirth: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        const response = await axios.get("http://3.142.142.153:5000/api/Benefits");
        setBenefits(response.data);
      } catch (error) {
        console.error("Error al obtener los beneficios:", error);
      }
    };
    fetchBenefits();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: false });
  };
  const handleSubmit = async (e) => {
    var _a;
    e.preventDefault();
    const newErrors = {
      name: formData.name.trim() === "",
      lastName: formData.lastName.trim() === "",
      dateBirth: formData.dateBirth.trim() === "",
      email: formData.email.trim() === "",
      password: formData.password.trim() === "",
      confirmPassword: formData.confirmPassword.trim() === "" || formData.password !== formData.confirmPassword
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) return;
    setLoading(true);
    const userPayload = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      lastName: formData.lastName,
      dateBirth: formData.dateBirth
    };
    try {
      await axios.post("http://3.142.142.153:5000/api/users/register", userPayload);
      alert("Usuario registrado exitosamente. Ahora puedes ingresar.");
      window.location.href = "/ingreso";
    } catch (error) {
      if (error.response) {
        alert(`Error: ${((_a = error.response.data) == null ? void 0 : _a.message) || "Hubo un problema al registrar el usuario"}`);
      } else if (error.request) {
        alert("No se pudo conectar con el servidor. Verifica tu conexión.");
      } else {
        alert("Ocurrió un error inesperado. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("section", { className: "register-section flex flex-col items-center justify-center min-h-screen p-[5%]", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center justify-center w-full h-full", children: [
      /* @__PURE__ */ jsx("div", { className: "w-full md:w-2/5 bg-white p-8 rounded shadow-2xl mb-8 md:mb-0 md:mr-4 min-h-[700px] flex items-center justify-center", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "w-full p-4", children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-bold text-center mb-6 text-black", children: [
          "¿Listo para encontrar tu próxima ",
          /* @__PURE__ */ jsx("span", { className: "text-[#2C395B]", children: "oportunidad?" }),
          " ",
          /* @__PURE__ */ jsx("span", { className: "wave", children: "👋" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative mb-4 flex items-center", children: [
          /* @__PURE__ */ jsx(UserIcon, { className: "h-6 w-6 text-gray-500 mr-3" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "name",
              name: "name",
              placeholder: "Nombre",
              value: formData.name,
              onChange: handleChange,
              className: `w-full px-4 py-3 border rounded bg-[#ececec] text-black text-lg focus:outline-none focus:ring-2 ${errors.name ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`,
              required: true,
              disabled: loading
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative mb-4 flex items-center", children: [
          /* @__PURE__ */ jsx(UserIcon, { className: "h-6 w-6 text-gray-500 mr-3" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              id: "lastName",
              name: "lastName",
              placeholder: "Apellido",
              value: formData.lastName,
              onChange: handleChange,
              className: `w-full px-4 py-3 border rounded bg-[#ececec] text-black text-lg focus:outline-none focus:ring-2 ${errors.lastName ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`,
              required: true,
              disabled: loading
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative mb-4 flex items-center", children: [
          /* @__PURE__ */ jsx(CalendarIcon, { className: "h-6 w-6 text-gray-500 mr-3" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              id: "dateBirth",
              name: "dateBirth",
              placeholder: "Fecha de Nacimiento",
              value: formData.dateBirth,
              onChange: handleChange,
              className: `w-full px-4 py-3 border rounded bg-[#ececec] text-black text-lg focus:outline-none focus:ring-2 ${errors.dateBirth ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`,
              required: true,
              disabled: loading
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative mb-4 flex items-center", children: [
          /* @__PURE__ */ jsx(EnvelopeIcon, { className: "h-6 w-6 text-gray-500 mr-3" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              id: "email",
              name: "email",
              placeholder: "Correo Electrónico",
              value: formData.email,
              onChange: handleChange,
              className: `w-full px-4 py-3 border rounded bg-[#ececec] text-black text-lg focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`,
              required: true,
              disabled: loading
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative mb-4 flex items-center", children: [
          /* @__PURE__ */ jsx(LockClosedIcon, { className: "h-6 w-6 text-gray-500 mr-3" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: showPassword ? "text" : "password",
              id: "password",
              name: "password",
              placeholder: "Contraseña",
              value: formData.password,
              onChange: handleChange,
              className: `w-full px-4 py-3 border rounded bg-[#ececec] text-black text-lg focus:outline-none focus:ring-2 ${errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`,
              required: true,
              disabled: loading
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              tabIndex: -1,
              onClick: () => setShowPassword(!showPassword),
              className: "absolute right-3 top-3 text-gray-500 hover:text-blue-500 flex items-center",
              disabled: loading,
              children: showPassword ? /* @__PURE__ */ jsx(EyeSlashIcon, { className: "h-6 w-6" }) : /* @__PURE__ */ jsx(EyeIcon, { className: "h-6 w-6" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative mb-4 flex items-center", children: [
          /* @__PURE__ */ jsx(LockClosedIcon, { className: "h-6 w-6 text-gray-500 mr-3" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: showConfirmPassword ? "text" : "password",
              id: "confirmPassword",
              name: "confirmPassword",
              placeholder: "Confirmar Contraseña",
              value: formData.confirmPassword,
              onChange: handleChange,
              className: `w-full px-4 py-3 border rounded bg-[#ececec] text-black text-lg focus:outline-none focus:ring-2 ${errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`,
              required: true,
              disabled: loading
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              tabIndex: -1,
              onClick: () => setShowConfirmPassword(!showConfirmPassword),
              className: "absolute right-3 top-3 text-gray-500 hover:text-blue-500 flex items-center",
              disabled: loading,
              children: showConfirmPassword ? /* @__PURE__ */ jsx(EyeSlashIcon, { className: "h-6 w-6" }) : /* @__PURE__ */ jsx(EyeIcon, { className: "h-6 w-6" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: `w-3/4 bg-[#FFBA08] text-white py-3 px-5 rounded hover:bg-yellow-500 mx-auto block text-lg ${loading ? "opacity-50 cursor-not-allowed" : ""}`,
            disabled: loading,
            children: loading ? "Registrando..." : "Crear Cuenta"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center h-[700px]", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: airplaneRegister,
          alt: "Airplane",
          className: "max-w-full h-full object-contain"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "w-full py-8 px-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-center mt-24 mb-24 text-[#2C395B]", children: "¡Obtén los siguientes beneficios!" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-36 mb-20", children: benefits.map((benefit) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          benefit.image_url && /* @__PURE__ */ jsx(
            "img",
            {
              src: benefit.image_url,
              alt: benefit.title,
              className: "w-full h-48 object-cover rounded mb-4"
            }
          ),
          /* @__PURE__ */ jsx("h3", { className: "text-[#FFBA08] font-bold text-lg mb-2", children: benefit.title }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: benefit.description })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-4", children: /* @__PURE__ */ jsx(FaCheck, { className: "text-[#2C395B] text-7xl" }) })
      ] }, benefit.id)) })
    ] })
  ] });
}
function RegistroPage() {
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Register, {}) });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: RegistroPage
}, Symbol.toStringTag, { value: "Module" }));
const loginImage = "/assets/login-Br94nNP3.svg";
function FormLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false
  });
  const [errors, setErrors] = useState({
    email: false,
    password: false
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");
    if (savedEmail && savedPassword) {
      setFormData({
        email: savedEmail,
        password: savedPassword,
        remember: true
      });
    }
  }, []);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
    setErrors({ ...errors, [name]: false });
    setErrorMessage(null);
  };
  const loginWithUserOrAdmin = async () => {
    var _a, _b;
    try {
      const response = await axios.post(
        "http://3.142.142.153:5000/api/users/login",
        {
          email: formData.email,
          password: formData.password
        }
      );
      return { ...response, userType: "Usuario" };
    } catch (error) {
      if (((_b = (_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) && error.response.data.message.includes("El usuario no tiene rol válido.")) {
        try {
          const adminResponse = await axios.post(
            "http://3.142.142.153:5000/api/admins/login",
            {
              email: formData.email,
              password: formData.password
            }
          );
          return { ...adminResponse, userType: "Admin" };
        } catch (adminError) {
          throw adminError;
        }
      } else {
        throw error;
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      email: formData.email.trim() === "",
      password: formData.password.trim() === ""
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }
    setLoading(true);
    try {
      const response = await loginWithUserOrAdmin();
      if (response.status === 200) {
        const { role, token, user } = response.data;
        localStorage.setItem("authToken", token);
        localStorage.setItem("userRole", role);
        if (formData.remember) {
          localStorage.setItem("email", formData.email);
          localStorage.setItem("password", formData.password);
        } else {
          localStorage.removeItem("email");
          localStorage.removeItem("password");
        }
        login({ ...user, role }, token);
        if (role === "Admin" || role === 2) {
          navigate("/admin");
        } else if (role === "Usuario" || role === 1) {
          navigate("/novedades");
        } else if (role === "superadmin") {
          navigate("/super-admin");
        } else {
          setErrorMessage("Rol desconocido. Contacta al administrador.");
        }
      } else {
        setErrorMessage("Hubo un problema al iniciar sesión.");
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || "Credenciales incorrectas");
      } else if (error.request) {
        setErrorMessage("No se pudo conectar con el servidor. Verifica tu conexión.");
      } else {
        setErrorMessage("Ocurrió un error inesperado. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("section", { className: "login-section flex flex-col items-center justify-center min-h-screen", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center justify-center w-full h-full", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center h-[800px] md:w-2/5", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: loginImage,
        alt: "Login",
        className: "max-w-full h-full object-contain"
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "w-full md:w-2/5 bg-white p-8 rounded shadow-2xl mb-8 md:mb-0 md:ml-4 min-h-[700px] flex items-center justify-center", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "w-full p-4", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-center mb-2 text-black", children: "Bienvenido a tu" }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-center mb-6 text-[#2C395B]", children: "Banco de Oportunidades" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 mb-6", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            className: "flex items-center justify-center w-full bg-white border border-gray-300 text-gray-700 py-3 px-5 rounded hover:bg-gray-100 text-lg",
            disabled: true,
            children: [
              /* @__PURE__ */ jsx(FaGoogle, { className: "h-6 w-6 mr-2 text-red-500" }),
              "Ingresa con Google"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            className: "flex items-center justify-center w-full bg-[#1877F2] text-white py-3 px-5 rounded hover:bg-[#145dbf] text-lg",
            disabled: true,
            children: [
              /* @__PURE__ */ jsx(FaFacebook, { className: "h-6 w-6 mr-2" }),
              "Ingresa con Facebook"
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center my-4", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-grow border-t border-gray-300" }),
          /* @__PURE__ */ jsx("span", { className: "mx-4 text-gray-500", children: "o" }),
          /* @__PURE__ */ jsx("div", { className: "flex-grow border-t border-gray-300" })
        ] })
      ] }),
      errorMessage && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-center mb-4", children: errorMessage }),
      /* @__PURE__ */ jsx("div", { className: "relative mb-4 flex items-center", children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "email",
          id: "email",
          name: "email",
          placeholder: "Correo Electrónico",
          value: formData.email,
          onChange: handleChange,
          className: `w-full px-4 py-3 border rounded bg-[#ececec] text-black text-lg focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`,
          required: true
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "relative mb-4 flex items-center", children: /* @__PURE__ */ jsx(
        "input",
        {
          type: "password",
          id: "password",
          name: "password",
          placeholder: "Contraseña",
          value: formData.password,
          onChange: handleChange,
          className: `w-full px-4 py-3 border rounded bg-[#ececec] text-black text-lg focus:outline-none focus:ring-2 ${errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`,
          required: true
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center text-black", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            className: "mr-2",
            name: "remember",
            checked: formData.remember,
            onChange: handleChange
          }
        ),
        "Recordarme"
      ] }) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "w-3/4 bg-[#FFBA08] text-white py-3 px-5 rounded hover:bg-yellow-500 mx-auto block text-lg",
          disabled: loading,
          children: loading ? "Cargando..." : "Ingresar"
        }
      )
    ] }) })
  ] }) });
}
function IngresoPage() {
  return /* @__PURE__ */ jsx(FormLogin, {});
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: IngresoPage
}, Symbol.toStringTag, { value: "Module" }));
function formatDate(value) {
  if (!value) return "";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  try {
    const date = new Date(value);
    if (!isNaN(date.getTime())) return date.toISOString().slice(0, 10);
    return "";
  } catch {
    return "";
  }
}
function Perfil() {
  const { user, login } = useAuth();
  if (!user) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center items-center min-h-[60vh]", children: /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "Cargando perfil..." }) });
  }
  const email = user.email ?? "";
  const [formData, setFormData] = useState({
    name: user.name || "",
    lastName: user.lastName || "",
    email,
    dateBirth: formatDate(user.dateBirth),
    imageUrl: user.imageUrl || "",
    password: ""
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setSuccess("");
    setError("");
  };
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (!email) {
        setError("No se encontró el correo del usuario.");
        return;
      }
      const url = user.role && user.role.toLowerCase() === "admin" ? `http://3.142.142.153:5000/api/admins/email/${encodeURIComponent(email)}` : `http://3.142.142.153:5000/api/users/email/${encodeURIComponent(email)}`;
      const { password, ...rest } = formData;
      const dataToSend = password.trim() === "" ? rest : { ...rest, password };
      if (!dataToSend.dateBirth || dataToSend.dateBirth === "string") {
        dataToSend.dateBirth = "";
      } else if (typeof dataToSend.dateBirth === "string" && !/^\d{4}-\d{2}-\d{2}$/.test(dataToSend.dateBirth)) {
        dataToSend.dateBirth = formatDate(dataToSend.dateBirth);
      }
      await axios.put(url, dataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`
        }
      });
      login({ ...user, ...rest }, localStorage.getItem("authToken") || "");
      setFormData((prev) => ({
        ...prev,
        password: ""
      }));
      setSuccess("¡Datos actualizados!");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Error actualizando. Intenta más tarde.");
      }
    }
  };
  return /* @__PURE__ */ jsx("section", { className: "flex flex-col items-center justify-center py-10 min-h-[80vh]", children: /* @__PURE__ */ jsxs(
    "form",
    {
      className: "bg-white shadow-md rounded p-8 max-w-md w-full",
      onSubmit: handleSave,
      children: [
        formData.imageUrl && /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: formData.imageUrl,
            alt: "Foto de perfil",
            className: "w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-md"
          }
        ) }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-6 text-center", children: "Editar Perfil" }),
        /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-gray-700", children: "Nombre" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full border rounded p-2 bg-white text-black",
              name: "name",
              value: formData.name,
              onChange: handleChange,
              placeholder: "Nombre",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-gray-700", children: "Apellido" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full border rounded p-2 bg-white text-black",
              name: "lastName",
              value: formData.lastName,
              onChange: handleChange,
              placeholder: "Apellido",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-gray-700", children: "Correo" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full border rounded p-2 bg-gray-100 text-black",
              name: "email",
              value: formData.email,
              disabled: true,
              placeholder: "Correo",
              autoComplete: "email"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-gray-700", children: "Fecha de Nacimiento" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full border rounded p-2 bg-white text-black",
              name: "dateBirth",
              value: formData.dateBirth,
              onChange: handleChange,
              type: "date",
              pattern: "\\d{4}-\\d{2}-\\d{2}",
              max: "2100-12-31"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-gray-700", children: "Foto (URL)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full border rounded p-2 bg-white text-black",
              name: "imageUrl",
              value: formData.imageUrl,
              onChange: handleChange,
              placeholder: "URL de Foto"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-gray-700", children: "Contraseña nueva" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-full border rounded p-2 bg-white text-black",
              name: "password",
              value: formData.password,
              onChange: handleChange,
              placeholder: "Dejar en blanco si no desea cambiarla",
              type: "password",
              autoComplete: "new-password"
            }
          )
        ] }),
        success && /* @__PURE__ */ jsx("p", { className: "text-green-600 mb-2", children: success }),
        error && /* @__PURE__ */ jsx("p", { className: "text-red-600 mb-2", children: error }),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700",
            type: "submit",
            children: "Guardar Cambios"
          }
        )
      ]
    }
  ) });
}
function ProfilePage() {
  return /* @__PURE__ */ jsx(Perfil, {});
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ProfilePage
}, Symbol.toStringTag, { value: "Module" }));
function Inicio$1() {
  const [opportunities, setOpportunities] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await axios.get("http://3.142.142.153:5000/api/Opportunities");
        setOpportunities(response.data);
      } catch (error) {
        console.error("Error al obtener las oportunidades:", error);
      } finally {
        setLoadingOpportunities(false);
      }
    };
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://3.142.142.153:5000/api/Services");
        setServices(response.data);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchOpportunities();
    fetchServices();
  }, []);
  const opportunitySettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };
  const serviceSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    // Mostrar un máximo de 4 tarjetas
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        // Pantallas medianas
        settings: {
          slidesToShow: 2
          // Mostrar 2 tarjetas
        }
      },
      {
        breakpoint: 768,
        // Pantallas pequeñas
        settings: {
          slidesToShow: 1
          // Mostrar 1 tarjeta
        }
      }
    ]
  };
  return /* @__PURE__ */ jsxs("section", { className: "relative min-h-screen flex flex-col items-center justify-center bg-white", children: [
    /* @__PURE__ */ jsxs("div", { className: "container max-w-6xl mx-auto px-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-6xl font-bold text-blue-900 mb-6 font-raleway", children: "¡Tu futuro inicia aquí!" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl text-gray-700 leading-relaxed font-raleway", children: "En la Fundación Antivirus para la Deserción creemos que cada persona merece acceso a las mejores oportunidades. Por eso, ofrecemos una plataforma personalizada donde puedes explorar becas, cursos y programas adaptados a tus intereses y necesidades." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-center md:justify-end", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: "app/assets/images/imageHero.svg",
            alt: "Imagen descriptiva",
            className: "max-w-full h-auto"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-12 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6", children: [
        /* @__PURE__ */ jsx("button", { className: "bg-yellow-400 text-white font-semibold py-3 px-6 rounded-lg hover:bg-yellow-500 transition duration-200 font-raleway", children: "Contactános" }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "/about",
            className: "text-lg md:text-xl text-blue-500 hover:text-blue-700 transition duration-200 font-raleway",
            children: "O conoce sobre nosotros"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "py-12 w-full", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-center text-blue-900 mb-8", children: "Oportunidades Destacadas" }),
      loadingOpportunities ? /* @__PURE__ */ jsx("p", { className: "text-center text-gray-600", children: "Cargando oportunidades..." }) : opportunities.length > 0 ? /* @__PURE__ */ jsx(Slider, { ...opportunitySettings, children: opportunities.map((opportunity) => /* @__PURE__ */ jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-md overflow-hidden", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: opportunity.image_url || "https://via.placeholder.com/300",
            alt: opportunity.name,
            className: "w-full h-48 object-cover"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-800 mb-2", children: opportunity.name }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm", children: opportunity.descriptions })
        ] })
      ] }) }, opportunity.id)) }) : /* @__PURE__ */ jsx("p", { className: "text-center text-gray-600", children: "No hay oportunidades disponibles." })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-12 w-full", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-center text-blue-900 mb-8", children: "Nuestros Servicios" }),
      loadingServices ? /* @__PURE__ */ jsx("p", { className: "text-center text-gray-600", children: "Cargando servicios..." }) : services.length > 0 ? /* @__PURE__ */ jsx(Slider, { ...serviceSettings, children: services.map((service) => /* @__PURE__ */ jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-lg overflow-hidden h-[500px] flex flex-col", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: service.imageUrl || "https://via.placeholder.com/300",
            alt: service.name,
            className: "w-full h-64 object-cover"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "p-4 flex flex-col justify-between flex-grow", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-800 mb-2", children: service.name }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm flex-grow", children: service.description })
        ] })
      ] }) }, service.id)) }) : /* @__PURE__ */ jsx("p", { className: "text-center text-gray-600", children: "No hay servicios disponibles." })
    ] }) })
  ] });
}
function Index() {
  return /* @__PURE__ */ jsx("main", { children: /* @__PURE__ */ jsx(Inicio$1, {}) });
}
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index
}, Symbol.toStringTag, { value: "Module" }));
function Inicio() {
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h2", { children: "Pagina principal Inicio" }) });
}
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Inicio
}, Symbol.toStringTag, { value: "Module" }));
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
const emptyData = {
  opportunity: { name: "", description: "", imageUrl: "" },
  service: { name: "", description: "", imageUrl: "" },
  benefit: { name: "", description: "", imageUrl: "" }
};
function Admin() {
  const [opportunities, setOpportunities] = useState([]);
  const [services, setServices] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formType, setFormType] = useState("opportunity");
  const [formData, setFormData] = useState({ ...emptyData.opportunity });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [submitting, setSubmitting] = useState(false);
  const refreshData = async () => {
    try {
      const [opportunitiesResponse, servicesResponse, benefitsResponse] = await Promise.all([
        axiosInstance.get("/Opportunities"),
        axiosInstance.get("/Services"),
        axiosInstance.get("/Benefits")
      ]);
      setOpportunities(opportunitiesResponse.data);
      setServices(servicesResponse.data);
      setBenefits(benefitsResponse.data);
    } catch (error) {
      console.error("Error al refrescar los datos:", error);
    }
  };
  useEffect(() => {
    (async () => {
      await refreshData();
      setLoading(false);
    })();
  }, []);
  const handleChangeType = (e) => {
    const type = e.target.value;
    setFormType(type);
    setFormData({ ...emptyData[type] });
    setIsEditing(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setMessage(""), 2e3);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    let endpoint = "";
    let postData = {};
    if (formType === "opportunity") {
      endpoint = "/Opportunities";
      postData = {
        name: formData.name,
        description: formData.description,
        adicionalDates: "N/A",
        applications: "N/A",
        contactChannels: "N/A",
        guide: "N/A",
        observations: "N/A",
        requirements: "N/A",
        categoriesId: 0,
        statusReviewId: 0,
        opportunityTypeId: 0,
        imageUrl: formData.imageUrl,
        status: true
      };
    } else if (formType === "service") {
      endpoint = "/Services";
      postData = {
        name: formData.name,
        description: formData.description,
        imageUrl: formData.imageUrl
      };
    } else {
      endpoint = "/Benefits";
      postData = {
        name: formData.name,
        description: formData.description,
        imageUrl: formData.imageUrl
      };
    }
    try {
      if (isEditing && formData.id) {
        await axiosInstance.put(`${endpoint}/${formData.id}`, postData);
        showMessage("Elemento actualizado exitosamente.", "success");
      } else {
        await axiosInstance.post(endpoint, postData);
        showMessage("Elemento creado exitosamente.", "success");
      }
      setFormData({ ...emptyData[formType] });
      setIsEditing(false);
      await refreshData();
    } catch (error) {
      console.error("Error al guardar el elemento:", error);
      showMessage("Hubo un error al guardar el elemento.", "error");
    } finally {
      setSubmitting(false);
    }
  };
  const handleEdit = (item, type) => {
    setFormType(type);
    setFormData({ ...item });
    setIsEditing(true);
  };
  const handleDelete = async (id, type) => {
    let endpoint = "";
    if (type === "opportunity") endpoint = "/Opportunities";
    if (type === "service") endpoint = "/Services";
    if (type === "benefit") endpoint = "/Benefits";
    try {
      await axiosInstance.delete(`${endpoint}/${id}`);
      showMessage("Elemento eliminado exitosamente.", "success");
      await refreshData();
    } catch (error) {
      console.error("Error al eliminar el elemento:", error);
      showMessage("Hubo un error al eliminar el elemento.", "error");
    }
  };
  const resetForm = () => {
    setFormData({ ...emptyData[formType] });
    setIsEditing(false);
  };
  if (loading) return /* @__PURE__ */ jsx("p", { children: "Cargando datos..." });
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
    message && /* @__PURE__ */ jsx(
      "div",
      {
        className: `fixed left-1/2 top-8 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg font-bold text-lg 
          ${messageType === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`,
        children: message
      }
    ),
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-center text-blue-900 mb-8", children: "Panel de Administración" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-lg mx-auto mb-6", children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "type", className: "block text-gray-700 font-semibold mb-2", children: "Tipo de elemento:" }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          id: "type",
          value: formType,
          onChange: handleChangeType,
          className: "w-full px-4 py-3 border rounded bg-gray-100 text-gray-700 text-lg",
          disabled: isEditing,
          children: [
            /* @__PURE__ */ jsx("option", { value: "opportunity", children: "Oportunidad" }),
            /* @__PURE__ */ jsx("option", { value: "service", children: "Servicio" }),
            /* @__PURE__ */ jsx("option", { value: "benefit", children: "Beneficio" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mb-8", children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold mb-4 text-gray-700", children: [
        isEditing ? "Editar" : "Crear",
        " ",
        formType === "opportunity" ? "Oportunidad" : formType === "service" ? "Servicio" : "Beneficio"
      ] }),
      /* @__PURE__ */ jsx(Input, { name: "name", label: "Nombre", value: formData.name, onChange: handleChange, required: true }),
      /* @__PURE__ */ jsx(Textarea, { name: "description", label: "Descripción", value: formData.description, onChange: handleChange, required: true }),
      /* @__PURE__ */ jsx(Input, { name: "imageUrl", label: "URL Imagen", value: formData.imageUrl, onChange: handleChange, required: true }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: submitting,
          className: `bg-blue-500 text-white font-bold py-3 px-5 rounded hover:bg-blue-600 transition duration-200 ${submitting ? "opacity-50 cursor-not-allowed" : ""}`,
          children: isEditing ? "Actualizar" : "Crear"
        }
      ),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: resetForm, className: "ml-4 bg-gray-500 text-white font-bold py-3 px-5 rounded hover:bg-gray-600 transition duration-200", children: "Cancelar" })
    ] }),
    /* @__PURE__ */ jsx(
      SectionList,
      {
        title: "Oportunidades",
        items: opportunities,
        type: "opportunity",
        onEdit: handleEdit,
        onDelete: handleDelete
      }
    ),
    /* @__PURE__ */ jsx(
      SectionList,
      {
        title: "Servicios",
        items: services,
        type: "service",
        onEdit: handleEdit,
        onDelete: handleDelete
      }
    ),
    /* @__PURE__ */ jsx(
      SectionList,
      {
        title: "Beneficios",
        items: benefits,
        type: "benefit",
        onEdit: handleEdit,
        onDelete: handleDelete
      }
    )
  ] });
}
function Input(props) {
  return /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
    /* @__PURE__ */ jsx("label", { htmlFor: props.name, className: "block text-gray-700 font-semibold mb-2", children: props.label }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: props.type || "text",
        id: props.name,
        name: props.name,
        value: props.value,
        onChange: props.onChange,
        required: props.required,
        className: "w-full px-4 py-3 border rounded bg-gray-100 text-gray-700 text-lg"
      }
    )
  ] });
}
function Textarea(props) {
  return /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
    /* @__PURE__ */ jsx("label", { htmlFor: props.name, className: "block text-gray-700 font-semibold mb-2", children: props.label }),
    /* @__PURE__ */ jsx(
      "textarea",
      {
        id: props.name,
        name: props.name,
        value: props.value,
        onChange: props.onChange,
        required: props.required,
        className: "w-full px-4 py-3 border rounded bg-gray-100 text-gray-700 text-lg"
      }
    )
  ] });
}
function SectionList({ title, items, type, onEdit, onDelete }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-blue-900 mt-8 mb-4", children: title }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: items.map((item) => /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-lg shadow-md", children: [
      /* @__PURE__ */ jsx("img", { src: item.imageUrl, alt: item.name, className: "w-full h-48 object-cover rounded-lg mb-4" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold", children: item.name }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: item.description }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex justify-between", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => onEdit(item, type), className: "bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600", children: "Editar" }),
        /* @__PURE__ */ jsx("button", { onClick: () => onDelete(item.id, type), className: "bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600", children: "Eliminar" })
      ] })
    ] }, item.id)) })
  ] });
}
function AdminPage() {
  return /* @__PURE__ */ jsx(Admin, {});
}
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AdminPage
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DzVMXWhq.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/index-RUgJCupv.js", "/assets/components-B2hmsSLA.js", "/assets/index-Dou5fCe0.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-CLJQa2O0.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/index-RUgJCupv.js", "/assets/components-B2hmsSLA.js", "/assets/index-Dou5fCe0.js", "/assets/authCOntext-Dl5rGXJ7.js"], "css": ["/assets/root-CccMJ-KW.css"] }, "routes/oportunidades": { "id": "routes/oportunidades", "parentId": "root", "path": "oportunidades", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-C9W6oY1R.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/index-RUgJCupv.js", "/assets/api-BjYky_W3.js", "/assets/index-t--hEgTQ.js"], "css": [] }, "routes/super-admin": { "id": "routes/super-admin", "parentId": "root", "path": "super-admin", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-BjZPA_2o.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/index-RUgJCupv.js", "/assets/index-t--hEgTQ.js"], "css": [] }, "routes/novedades": { "id": "routes/novedades", "parentId": "root", "path": "novedades", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-C_z9cFYh.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/index-RUgJCupv.js", "/assets/index-t--hEgTQ.js", "/assets/index-D-_hNE0N.js", "/assets/components-B2hmsSLA.js", "/assets/index-Dou5fCe0.js"], "css": [] }, "routes/servicios": { "id": "routes/servicios", "parentId": "root", "path": "servicios", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-DNa0C7ti.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/index-RUgJCupv.js", "/assets/api-BjYky_W3.js", "/assets/index-t--hEgTQ.js"], "css": [] }, "routes/registro": { "id": "routes/registro", "parentId": "root", "path": "registro", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-CBkU_Hmb.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/index-RUgJCupv.js", "/assets/index-3o5017id.js", "/assets/index-t--hEgTQ.js"], "css": [] }, "routes/ingreso": { "id": "routes/ingreso", "parentId": "root", "path": "ingreso", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-fKLK3BvL.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/index-RUgJCupv.js", "/assets/index-t--hEgTQ.js", "/assets/index-3o5017id.js", "/assets/authCOntext-Dl5rGXJ7.js", "/assets/index-Dou5fCe0.js"], "css": [] }, "routes/profile": { "id": "routes/profile", "parentId": "root", "path": "profile", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-B7mBcEaS.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/authCOntext-Dl5rGXJ7.js", "/assets/index-RUgJCupv.js", "/assets/index-t--hEgTQ.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-CxKjM1e6.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/index-RUgJCupv.js", "/assets/index-D-_hNE0N.js", "/assets/index-t--hEgTQ.js"], "css": ["/assets/_index-Cs8yHCv6.css"] }, "routes/inicio": { "id": "routes/inicio", "parentId": "root", "path": "inicio", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-CYLmQp48.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js"], "css": [] }, "routes/logout": { "id": "routes/logout", "parentId": "root", "path": "logout", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/logout-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/admin": { "id": "routes/admin", "parentId": "root", "path": "admin", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/route-9T90CF70.js", "imports": ["/assets/jsx-runtime-0DLF9kdB.js", "/assets/index-RUgJCupv.js", "/assets/api-BjYky_W3.js", "/assets/index-t--hEgTQ.js"], "css": [] } }, "url": "/assets/manifest-5e2a7d46.js", "version": "5e2a7d46" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": false, "v3_singleFetch": true, "v3_lazyRouteDiscovery": true, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/oportunidades": {
    id: "routes/oportunidades",
    parentId: "root",
    path: "oportunidades",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/super-admin": {
    id: "routes/super-admin",
    parentId: "root",
    path: "super-admin",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/novedades": {
    id: "routes/novedades",
    parentId: "root",
    path: "novedades",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/servicios": {
    id: "routes/servicios",
    parentId: "root",
    path: "servicios",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/registro": {
    id: "routes/registro",
    parentId: "root",
    path: "registro",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/ingreso": {
    id: "routes/ingreso",
    parentId: "root",
    path: "ingreso",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/profile": {
    id: "routes/profile",
    parentId: "root",
    path: "profile",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route8
  },
  "routes/inicio": {
    id: "routes/inicio",
    parentId: "root",
    path: "inicio",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/logout": {
    id: "routes/logout",
    parentId: "root",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/admin": {
    id: "routes/admin",
    parentId: "root",
    path: "admin",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  }
};
export {
  assetsBuildDirectory as a,
  basename as b,
  entry as e,
  future as f,
  isSpaMode as i,
  mode as m,
  publicPath as p,
  routes as r,
  serverManifest as s,
  useAuth as u
};
