import { useState, useEffect } from "react";
import { EyeIcon, EyeSlashIcon, UserIcon, CalendarIcon, EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { FaCheck } from "react-icons/fa";
import airplaneRegister from "../assets/images/airplaneRegister.png";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    dateBirth: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: false,
    lastName: false,
    dateBirth: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [benefits, setBenefits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        const response = await axios.get("http://3.142.142.153:5000/api/Benefits");
        setBenefits(response.data);
      } catch (error) {
        // Solo loguea, no bloquea
        console.error("Error al obtener los beneficios:", error);
      }
    };
    fetchBenefits();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: formData.name.trim() === "",
      lastName: formData.lastName.trim() === "",
      dateBirth: formData.dateBirth.trim() === "",
      email: formData.email.trim() === "",
      password: formData.password.trim() === "",
      confirmPassword: formData.confirmPassword.trim() === "" || formData.password !== formData.confirmPassword,
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) return;

    setLoading(true);

    const userPayload = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      lastName: formData.lastName,
      dateBirth: formData.dateBirth,
    };

    try {
      await axios.post("http://3.142.142.153:5000/api/users/register", userPayload);
      alert("Usuario registrado exitosamente. Ahora puedes ingresar.");
      window.location.href = "/ingreso";
    } catch (error: any) {
      if (error.response) {
        alert(`Error: ${error.response.data?.message || "Hubo un problema al registrar el usuario"}`);
      } else if (error.request) {
        alert("No se pudo conectar con el servidor. Verifica tu conexión.");
      } else {
        alert("Ocurrió un error inesperado. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="register-section flex flex-col items-center justify-center min-h-screen p-[5%]">
      <div className="flex flex-col md:flex-row items-center justify-center w-full h-full">
        <div className="w-full md:w-2/5 bg-white p-8 rounded shadow-2xl mb-8 md:mb-0 md:mr-4 min-h-[700px] flex items-center justify-center">
          <form onSubmit={handleSubmit} className="w-full p-4">
            <h1 className="text-2xl font-bold text-center mb-6 text-black">
              ¿Listo para encontrar tu próxima <span className="text-[#2C395B]">oportunidad?</span> <span className="wave">👋</span>
            </h1>
            {/* Campos */}
            <div className="relative mb-4 flex items-center">
              <UserIcon className="h-6 w-6 text-gray-500 mr-3" />
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Nombre"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded bg-[#ececec] text-black text-lg focus:outline-none focus:ring-2 ${errors.name ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
                required
                disabled={loading}
              />
            </div>
            <div className="relative mb-4 flex items-center">
              <UserIcon className="h-6 w-6 text-gray-500 mr-3" />
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Apellido"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded bg-[#ececec] text-black text-lg focus:outline-none focus:ring-2 ${errors.lastName ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
                required
                disabled={loading}
              />
            </div>
            <div className="relative mb-4 flex items-center">
              <CalendarIcon className="h-6 w-6 text-gray-500 mr-3" />
              <input
                type="date"
                id="dateBirth"
                name="dateBirth"
                placeholder="Fecha de Nacimiento"
                value={formData.dateBirth}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded bg-[#ececec] text-black text-lg focus:outline-none focus:ring-2 ${errors.dateBirth ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
                required
                disabled={loading}
              />
            </div>
            <div className="relative mb-4 flex items-center">
              <EnvelopeIcon className="h-6 w-6 text-gray-500 mr-3" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Correo Electrónico"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded bg-[#ececec] text-black text-lg focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
                required
                disabled={loading}
              />
            </div>
            <div className="relative mb-4 flex items-center">
              <LockClosedIcon className="h-6 w-6 text-gray-500 mr-3" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded bg-[#ececec] text-black text-lg focus:outline-none focus:ring-2 ${errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
                required
                disabled={loading}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-blue-500 flex items-center"
                disabled={loading}
              >
                {showPassword ? <EyeSlashIcon className="h-6 w-6" /> : <EyeIcon className="h-6 w-6" />}
              </button>
            </div>
            <div className="relative mb-4 flex items-center">
              <LockClosedIcon className="h-6 w-6 text-gray-500 mr-3" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirmar Contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded bg-[#ececec] text-black text-lg focus:outline-none focus:ring-2 ${errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
                required
                disabled={loading}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-blue-500 flex items-center"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeSlashIcon className="h-6 w-6" /> : <EyeIcon className="h-6 w-6" />}
              </button>
            </div>
            <button
              type="submit"
              className={`w-3/4 bg-[#FFBA08] text-white py-3 px-5 rounded hover:bg-yellow-500 mx-auto block text-lg ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? "Registrando..." : "Crear Cuenta"}
            </button>
          </form>
        </div>
        <div className="flex justify-center items-center h-[700px]">
          <img
            src={airplaneRegister}
            alt="Airplane"
            className="max-w-full h-full object-contain"
          />
        </div>
      </div>
      {/* Beneficios */}
      <div className="w-full py-8 px-4">
        <h2 className="text-2xl font-bold text-center mt-24 mb-24 text-[#2C395B]">
          ¡Obtén los siguientes beneficios!
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-36 mb-20">
          {benefits.map((benefit) => (
            <div key={benefit.id} className="flex flex-col">
              <div>
                {benefit.image_url && (
                  <img
                    src={benefit.image_url}
                    alt={benefit.title}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                )}
                <h3 className="text-[#FFBA08] font-bold text-lg mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
              <div className="flex justify-end mt-4">
                <FaCheck className="text-[#2C395B] text-7xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
