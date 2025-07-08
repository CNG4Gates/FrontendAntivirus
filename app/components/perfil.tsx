import { useAuth } from "../utils/authCOntext";
import { useState } from "react";
import axios from "axios";

// Utilidad para dar formato seguro a la fecha
function formatDate(value: any) {
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

export default function Perfil() {
  const { user, login } = useAuth();

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="text-gray-500">Cargando perfil...</span>
      </div>
    );
  }

  // Garantiza que el email siempre sea string
  const email = user.email ?? "";

  const [formData, setFormData] = useState({
    name: user.name || "",
    lastName: user.lastName || "",
    email: email,
    dateBirth: formatDate(user.dateBirth),
    imageUrl: user.imageUrl || "",
    password: "",
  });

  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Evento tipado correctamente
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setSuccess("");
    setError("");
  };

  // Evento tipado correctamente
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!email) {
        setError("No se encontró el correo del usuario.");
        return;
      }

      // Usa endpoint por correo (no por ID)
      const url =
        user.role && user.role.toLowerCase() === "admin"
          ? `http://3.142.142.153:5000/api/admins/email/${encodeURIComponent(email)}`
          : `http://3.142.142.153:5000/api/users/email/${encodeURIComponent(email)}`;

      const { password, ...rest } = formData;

      // Elimina password si está vacío
      const dataToSend = password.trim() === "" ? rest : { ...rest, password };

      // Asegura que la fecha esté en formato correcto o vacío
      if (!dataToSend.dateBirth || dataToSend.dateBirth === "string") {
        dataToSend.dateBirth = "";
      } else if (
        typeof dataToSend.dateBirth === "string" &&
        !/^\d{4}-\d{2}-\d{2}$/.test(dataToSend.dateBirth)
      ) {
        // Re-formatea si no es formato válido
        dataToSend.dateBirth = formatDate(dataToSend.dateBirth);
      }

      await axios.put(url, dataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
      });

      // Actualiza el user globalmente (sin password)
      login({ ...user, ...rest }, localStorage.getItem("authToken") || "");

      // Limpia campo password
      setFormData((prev) => ({
        ...prev,
        password: "",
      }));

      setSuccess("¡Datos actualizados!");
    } catch (err: any) {
      // Intenta mostrar mensaje de backend si lo hay
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Error actualizando. Intenta más tarde.");
      }
    }
  };

  return (
    <section className="flex flex-col items-center justify-center py-10 min-h-[80vh]">
      <form
        className="bg-white shadow-md rounded p-8 max-w-md w-full"
        onSubmit={handleSave}
      >
        {/* Foto de perfil */}
        {formData.imageUrl && (
          <div className="flex justify-center mb-6">
            <img
              src={formData.imageUrl}
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-md"
            />
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6 text-center">Editar Perfil</h2>

        <div className="mb-4">
          <label className="block text-gray-700">Nombre</label>
          <input
            className="w-full border rounded p-2 bg-white text-black"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Apellido</label>
          <input
            className="w-full border rounded p-2 bg-white text-black"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Apellido"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Correo</label>
          <input
            className="w-full border rounded p-2 bg-gray-100 text-black"
            name="email"
            value={formData.email}
            disabled // solo visual
            placeholder="Correo"
            autoComplete="email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Fecha de Nacimiento</label>
          <input
            className="w-full border rounded p-2 bg-white text-black"
            name="dateBirth"
            value={formData.dateBirth}
            onChange={handleChange}
            type="date"
            pattern="\d{4}-\d{2}-\d{2}"
            max="2100-12-31"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Foto (URL)</label>
          <input
            className="w-full border rounded p-2 bg-white text-black"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="URL de Foto"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Contraseña nueva</label>
          <input
            className="w-full border rounded p-2 bg-white text-black"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Dejar en blanco si no desea cambiarla"
            type="password"
            autoComplete="new-password"
          />
        </div>
        {success && <p className="text-green-600 mb-2">{success}</p>}
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          type="submit"
        >
          Guardar Cambios
        </button>
      </form>
    </section>
  );
}
