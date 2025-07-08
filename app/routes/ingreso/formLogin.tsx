import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import loginImage from "../../assets/images/login.svg";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useAuth } from "../../utils/authCOntext";

export default function FormLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");
    if (savedEmail && savedPassword) {
      setFormData({
        email: savedEmail,
        password: savedPassword,
        remember: true,
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrors({ ...errors, [name]: false });
    setErrorMessage(null);
  };

  // FUNCIÓN para intentar login como usuario y si falla, como admin
  const loginWithUserOrAdmin = async () => {
    // 1. Intentar como usuario normal
    try {
      const response = await axios.post(
        "http://3.142.142.153:5000/api/users/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );
      return { ...response, userType: "Usuario" }; // Si funciona, retorna la respuesta
    } catch (error: any) {
      // Si NO fue por "el usuario no tiene rol válido", intenta como admin
      if (
        error?.response?.data?.message &&
        error.response.data.message.includes("El usuario no tiene rol válido.")
      ) {
        // 2. Intentar como admin
        try {
          const adminResponse = await axios.post(
            "http://3.142.142.153:5000/api/admins/login",
            {
              email: formData.email,
              password: formData.password,
            }
          );
          return { ...adminResponse, userType: "Admin" };
        } catch (adminError: any) {
          // Si también falla como admin, lanzamos el error original
          throw adminError;
        }
      } else {
        throw error;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      email: formData.email.trim() === "",
      password: formData.password.trim() === "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    setLoading(true);

    try {
      const response = await loginWithUserOrAdmin();
      if (response.status === 200) {
        // Trae el user, role y token del backend
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
    } catch (error: any) {
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

  return (
    <section className="login-section flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col md:flex-row items-center justify-center w-full h-full">
        <div className="flex justify-center items-center h-[800px] md:w-2/5">
          <img
            src={loginImage}
            alt="Login"
            className="max-w-full h-full object-contain"
          />
        </div>

        <div className="w-full md:w-2/5 bg-white p-8 rounded shadow-2xl mb-8 md:mb-0 md:ml-4 min-h-[700px] flex items-center justify-center">
          <form onSubmit={handleSubmit} className="w-full p-4">
            <h1 className="text-2xl font-bold text-center mb-2 text-black">
              Bienvenido a tu
            </h1>
            <h2 className="text-xl font-bold text-center mb-6 text-[#2C395B]">
              Banco de Oportunidades
            </h2>

            <div className="flex flex-col gap-4 mb-6">
              <button
                type="button"
                className="flex items-center justify-center w-full bg-white border border-gray-300 text-gray-700 py-3 px-5 rounded hover:bg-gray-100 text-lg"
                disabled
              >
                <FaGoogle className="h-6 w-6 mr-2 text-red-500" />
                Ingresa con Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center w-full bg-[#1877F2] text-white py-3 px-5 rounded hover:bg-[#145dbf] text-lg"
                disabled
              >
                <FaFacebook className="h-6 w-6 mr-2" />
                Ingresa con Facebook
              </button>
              <div className="flex items-center justify-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 text-gray-500">o</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
            </div>

            {errorMessage && (
              <p className="text-red-500 text-center mb-4">{errorMessage}</p>
            )}

            <div className="relative mb-4 flex items-center">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Correo Electrónico"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded bg-[#ececec] text-black text-lg focus:outline-none focus:ring-2 ${
                  errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                }`}
                required
              />
            </div>

            <div className="relative mb-4 flex items-center">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded bg-[#ececec] text-black text-lg focus:outline-none focus:ring-2 ${
                  errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                }`}
                required
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-black">
                <input
                  type="checkbox"
                  className="mr-2"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                Recordarme
              </label>
            </div>

            <button
              type="submit"
              className="w-3/4 bg-[#FFBA08] text-white py-3 px-5 rounded hover:bg-yellow-500 mx-auto block text-lg"
              disabled={loading}
            >
              {loading ? "Cargando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
