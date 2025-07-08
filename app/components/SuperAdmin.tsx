import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  dateBirth?: string;
}

interface Role {
  id: number;
  name: string;
}

interface UserRole {
  users_id: number;
  role_id: number;
}

export default function SuperAdmin() {
  const [admins, setAdmins] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<{
    id: number | null;
    name: string;
    lastName: string;
    email: string;
    password: string;
    dateBirth: string;
    role: string; // Campo para seleccionar el rol
  }>({
    id: null,
    name: "",
    lastName: "",
    email: "",
    password: "",
    dateBirth: "",
    role: "user", // Por defecto, el rol será "user"
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const API_BASE_URL = "http://3.142.142.153:5000/api";

  // Configurar Axios para incluir el token JWT
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
  });

  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Obtener usuarios, roles y relaciones usuario-rol
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, rolesResponse, userRolesResponse] = await Promise.all([
          axiosInstance.get("/User"),
          axiosInstance.get("/Roles"),
          axiosInstance.get("/UserRoles"),
        ]);

        const allUsers: User[] = usersResponse.data;
        const roles: Role[] = rolesResponse.data;
        const userRoles: UserRole[] = userRolesResponse.data;

        // Obtener los IDs de los roles "user" y "admin"
        const userRoleId = roles.find((role) => role.name === "user")?.id;
        const adminRoleId = roles.find((role) => role.name === "admin")?.id;

        if (userRoleId === undefined || adminRoleId === undefined) {
          console.error("No se encontraron los roles 'user' o 'admin'.");
          return;
        }

        // Filtrar usuarios por rol
        const adminsList = allUsers.filter((user) =>
          userRoles.some((userRole) => userRole.users_id === user.id && userRole.role_id === adminRoleId)
        );

        const usersList = allUsers.filter((user) =>
          userRoles.some((userRole) => userRole.users_id === user.id && userRole.role_id === userRoleId)
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isEditing) {
        // Actualizar usuario
        await axiosInstance.put(`/User/${formData.id}`, formData);
        setMessage("Usuario actualizado exitosamente.");
      } else {
        // Crear usuario
        const userResponse = await axiosInstance.post("/auth/register", {
          name: formData.name,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          dateBirth: formData.dateBirth,
        });

        const newUser = userResponse.data;

        // Si se seleccionó "Administrador", actualizar el rol
        if (formData.role === "admin") {
          const adminRoleId = 2; // ID del rol "admin"
          await axiosInstance.post("/UserRoles", {
            users_id: newUser.id,
            role_id: adminRoleId,
          });
          setMessage("Usuario creado como administrador exitosamente.");
        } else {
          setMessage("Usuario creado exitosamente.");
        }
      }
      refreshUsers();
      resetForm();
    } catch (error: any) {
      console.error("Error al guardar el usuario:", error);
      if (error.response && error.response.data) {
        setMessage(`Error: ${error.response.data.message || "No se pudo guardar el usuario."}`);
      } else {
        setMessage("Hubo un error al guardar el usuario.");
      }
    }
  };

  const handleEdit = (user: User) => {
    setFormData({
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      password: "",
      dateBirth: user.dateBirth || "",
      role: "user", // Por defecto, se asume que es "user"
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/User/${id}`);
      setMessage("Usuario eliminado exitosamente.");
      refreshUsers();
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      setMessage("Hubo un error al eliminar el usuario.");
    }
  };

  const refreshUsers = async () => {
    try {
      const response = await axiosInstance.get("/User");
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
      role: "user",
    });
    setIsEditing(false);
  };

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">Gestión de Usuarios</h1>

      {/* Formulario para crear o editar usuarios */}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-700">{isEditing ? "Editar" : "Crear"} Usuario</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded bg-gray-100 text-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="block text-gray-700 font-semibold mb-2">Apellido</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded bg-gray-100 text-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded bg-gray-100 text-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="dateBirth" className="block text-gray-700 font-semibold mb-2">Fecha de Nacimiento</label>
          <input
            type="date"
            id="dateBirth"
            name="dateBirth"
            value={formData.dateBirth}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded bg-gray-100 text-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {!isEditing && (
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded bg-gray-100 text-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="role" className="block text-gray-700 font-semibold mb-2">Rol</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded bg-gray-100 text-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white font-bold py-3 px-5 rounded hover:bg-blue-600 transition duration-200">
          {isEditing ? "Actualizar" : "Crear"}
        </button>
        <button type="button" onClick={resetForm} className="ml-4 bg-gray-500 text-white font-bold py-3 px-5 rounded hover:bg-gray-600 transition duration-200">
          Cancelar
        </button>
      </form>

      {message && <p className="text-center text-green-500 font-bold mb-4">{message}</p>}

      {/* Tabla de administradores */}
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Lista de Administradores</h2>
      <table className="table-auto w-full bg-white shadow-md rounded-lg mb-8">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Apellido</th>
            <th className="px-4 py-2">Correo</th>
            <th className="px-4 py-2">Fecha de Nacimiento</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id} className="border-t">
              <td className="px-4 py-2">{admin.id}</td>
              <td className="px-4 py-2">{admin.name}</td>
              <td className="px-4 py-2">{admin.lastName}</td>
              <td className="px-4 py-2">{admin.email}</td>
              <td className="px-4 py-2">{admin.dateBirth}</td>
              <td className="px-4 py-2 flex space-x-2">
                <button
                  onClick={() => handleEdit(admin)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(admin.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tabla de usuarios */}
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Lista de Usuarios</h2>
      <table className="table-auto w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Apellido</th>
            <th className="px-4 py-2">Correo</th>
            <th className="px-4 py-2">Fecha de Nacimiento</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="px-4 py-2">{user.id}</td>
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.lastName}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.dateBirth}</td>
              <td className="px-4 py-2 flex space-x-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}