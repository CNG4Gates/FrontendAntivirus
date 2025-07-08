import { Link, useLocation } from "@remix-run/react";
import { FaSignOutAlt, FaUserShield } from "react-icons/fa";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import logo from "../assets/images/logo.svg";
import btnLogin from "../assets/images/btnLogin.svg";
import btnRegister from "../assets/images/btnRegister.svg";
import { useAuth } from "../utils/authCOntext";

export default function Navbar() {
  const location = useLocation();
  const { isAuthenticated, role, user, logout } = useAuth();
  const iconSize = 32;

  const handleLogout = () => {
    logout();
    window.location.href = "/ingreso";
  };

  const getAvatar = () => {
    if (user && user.imageUrl)
      return (
        <Link to="/profile" title="Editar perfil">
          <img
            src={user.imageUrl}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover border-2 border-blue-300 cursor-pointer"
          />
        </Link>
      );
    if (role && role.toLowerCase() === "admin")
      return (
        <Link to="/profile" title="Editar perfil">
          <FaUserShield
            size={iconSize}
            className="text-blue-700 bg-white rounded-full border-2 border-blue-400 p-1 cursor-pointer"
          />
        </Link>
      );
    return (
      <Link to="/profile" title="Editar perfil">
        <UserCircleIcon
          width={iconSize}
          height={iconSize}
          className="text-gray-400 bg-white rounded-full border-2 border-blue-300 cursor-pointer"
        />
      </Link>
    );
  };

  const getFullName = () => {
    if (!user) return "";
    const name = user.name ? String(user.name) : "";
    const lastName = user.lastName ? String(user.lastName) : "";
    return `${name} ${lastName}`.trim();
  };

  const isNovedadesPage = location.pathname === "/novedades";
  const isLoginPage = location.pathname === "/ingreso";
  const isRegisterPage = location.pathname === "/registro";

  return (
    <div>
      <nav className="relative flex">
        {/* Background Gradient */}
        <div className="absolute top-4 bg-[linear-gradient(90deg,#00266B_19.38%,#4E6291_37.55%,#5F77AB_82.93%,#708BC6_96.28%)] h-16 w-full z-0"></div>
        {/* IZQUIERDA */}
        <ul className="flex font-raleway font-bold text-white w-5/12 justify-evenly items-center z-10">
          <li>
            <Link to="/" className="hover:underline underline-offset-4 transition-all">Inicio</Link>
          </li>
          <li>
            <Link to="/oportunidades" className="hover:underline underline-offset-4 transition-all">Oportunidades</Link>
          </li>
          <li>
            <Link to="/servicios" className="hover:underline underline-offset-4 transition-all">Servicios</Link>
          </li>
          {isAuthenticated && !isLoginPage && !isRegisterPage && (
            <li>
              <Link to="/novedades" className="hover:underline underline-offset-4 transition-all">Novedades</Link>
            </li>
          )}
        </ul>
        {/* CENTRO */}
        <div className="w-2/12 flex justify-center z-10">
          <img className="w-28" src={logo} alt="logo" />
        </div>
        {/* DERECHA */}
        <ul className="flex items-center justify-evenly z-10 min-w-[270px] font-raleway font-bold text-white">
          {isAuthenticated ? (
            <>
              {/* Opciones admin */}
              {role && role.toLowerCase() === "admin" && (
                <>
                  <li>
                    <Link
                      to="/admin"
                      className="px-4 py-2 hover:underline underline-offset-4 transition-all"
                      style={{ color: "white" }}
                    >
                      Administrar Contenido
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/super-admin"
                      className="px-4 py-2 hover:underline underline-offset-4 transition-all"
                      style={{ color: "white" }}
                    >
                      Gestión de Usuarios
                    </Link>
                  </li>
                </>
              )}
              {/* Perfil pequeño y logout */}
              <li className="flex items-center gap-2 ml-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 hover:underline underline-offset-4 transition-all font-bold"
                  style={{ color: "#ff1744", background: "transparent", border: "none" }}
                  title="Salir"
                >
                  <FaSignOutAlt className="mr-1" size={18} />
                  <span className="hidden md:inline">Salir</span>
                </button>
                {getAvatar()}
                <Link to="/profile" title="Editar perfil">
                  <span className="text-xs text-white font-semibold max-w-[110px] truncate cursor-pointer">
                    {getFullName()}
                  </span>
                </Link>
              </li>
            </>
          ) : (
            <>
              {!isLoginPage && (
                <li className="mr-12">
                  <Link to="/ingreso">
                    <img className="w-32" src={btnLogin} alt="btn" />
                  </Link>
                </li>
              )}
              {!isRegisterPage && (
                <li className="ml-12">
                  <Link to="/registro">
                    <img className="w-32" src={btnRegister} alt="btn" />
                  </Link>
                </li>
              )}
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}
