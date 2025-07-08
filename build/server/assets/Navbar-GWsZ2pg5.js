import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useLocation, Link } from "@remix-run/react";
import { FaSignOutAlt, FaUserShield } from "react-icons/fa";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { l as logoAntivirus } from "./logo-DoS4Hc2T.js";
import { u as useAuth } from "./server-build-DqycjrNH.js";
import "node:stream";
import "@remix-run/node";
import "isbot";
import "react-dom/server";
import "react";
import "axios";
import "react-slick";
import "@heroicons/react/24/outline";
import "react-router-dom";
const btnLogin = "/assets/btnLogin-BEDgwhGB.svg";
const btnRegister = "/assets/btnRegister-CoIBLEU9.svg";
function Navbar() {
  const location = useLocation();
  const { isAuthenticated, role, user, logout } = useAuth();
  const iconSize = 32;
  const handleLogout = () => {
    logout();
    window.location.href = "/ingreso";
  };
  const getAvatar = () => {
    if (user && user.imageUrl)
      return /* @__PURE__ */ jsx(Link, { to: "/profile", title: "Editar perfil", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: user.imageUrl,
          alt: "avatar",
          className: "w-8 h-8 rounded-full object-cover border-2 border-blue-300 cursor-pointer"
        }
      ) });
    if (role && role.toLowerCase() === "admin")
      return /* @__PURE__ */ jsx(Link, { to: "/profile", title: "Editar perfil", children: /* @__PURE__ */ jsx(
        FaUserShield,
        {
          size: iconSize,
          className: "text-blue-700 bg-white rounded-full border-2 border-blue-400 p-1 cursor-pointer"
        }
      ) });
    return /* @__PURE__ */ jsx(Link, { to: "/profile", title: "Editar perfil", children: /* @__PURE__ */ jsx(
      UserCircleIcon,
      {
        width: iconSize,
        height: iconSize,
        className: "text-gray-400 bg-white rounded-full border-2 border-blue-300 cursor-pointer"
      }
    ) });
  };
  const getFullName = () => {
    if (!user) return "";
    const name = user.name ? String(user.name) : "";
    const lastName = user.lastName ? String(user.lastName) : "";
    return `${name} ${lastName}`.trim();
  };
  location.pathname === "/novedades";
  const isLoginPage = location.pathname === "/ingreso";
  const isRegisterPage = location.pathname === "/registro";
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("nav", { className: "relative flex", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-4 bg-[linear-gradient(90deg,#00266B_19.38%,#4E6291_37.55%,#5F77AB_82.93%,#708BC6_96.28%)] h-16 w-full z-0" }),
    /* @__PURE__ */ jsxs("ul", { className: "flex font-raleway font-bold text-white w-5/12 justify-evenly items-center z-10", children: [
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:underline underline-offset-4 transition-all", children: "Inicio" }) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/oportunidades", className: "hover:underline underline-offset-4 transition-all", children: "Oportunidades" }) }),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/servicios", className: "hover:underline underline-offset-4 transition-all", children: "Servicios" }) }),
      isAuthenticated && !isLoginPage && !isRegisterPage && /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/novedades", className: "hover:underline underline-offset-4 transition-all", children: "Novedades" }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "w-2/12 flex justify-center z-10", children: /* @__PURE__ */ jsx("img", { className: "w-28", src: logoAntivirus, alt: "logo" }) }),
    /* @__PURE__ */ jsx("ul", { className: "flex items-center justify-evenly z-10 min-w-[270px] font-raleway font-bold text-white", children: isAuthenticated ? /* @__PURE__ */ jsxs(Fragment, { children: [
      role && role.toLowerCase() === "admin" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          Link,
          {
            to: "/admin",
            className: "px-4 py-2 hover:underline underline-offset-4 transition-all",
            style: { color: "white" },
            children: "Administrar Contenido"
          }
        ) }),
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          Link,
          {
            to: "/super-admin",
            className: "px-4 py-2 hover:underline underline-offset-4 transition-all",
            style: { color: "white" },
            children: "Gestión de Usuarios"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2 ml-2", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleLogout,
            className: "flex items-center px-3 py-2 hover:underline underline-offset-4 transition-all font-bold",
            style: { color: "#ff1744", background: "transparent", border: "none" },
            title: "Salir",
            children: [
              /* @__PURE__ */ jsx(FaSignOutAlt, { className: "mr-1", size: 18 }),
              /* @__PURE__ */ jsx("span", { className: "hidden md:inline", children: "Salir" })
            ]
          }
        ),
        getAvatar(),
        /* @__PURE__ */ jsx(Link, { to: "/profile", title: "Editar perfil", children: /* @__PURE__ */ jsx("span", { className: "text-xs text-white font-semibold max-w-[110px] truncate cursor-pointer", children: getFullName() }) })
      ] })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      !isLoginPage && /* @__PURE__ */ jsx("li", { className: "mr-12", children: /* @__PURE__ */ jsx(Link, { to: "/ingreso", children: /* @__PURE__ */ jsx("img", { className: "w-32", src: btnLogin, alt: "btn" }) }) }),
      !isRegisterPage && /* @__PURE__ */ jsx("li", { className: "ml-12", children: /* @__PURE__ */ jsx(Link, { to: "/registro", children: /* @__PURE__ */ jsx("img", { className: "w-32", src: btnRegister, alt: "btn" }) }) })
    ] }) })
  ] }) });
}
export {
  Navbar as default
};
