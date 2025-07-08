// /**
//  * Realiza la solicitud de inicio de sesión a la API.
//  * @param {string} correo - Correo del usuario.
//  * @param {string} password - Contraseña del usuario.
//  * @returns {Promise<Object>} - Datos del usuario autenticado.
//  */
// export async function login(correo: string, password: string): Promise<{ token: string }> {
//   try {
//     const response = await fetch("http://3.142.142.153:5000/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email: correo, password }),
//     });

//     if (!response.ok) {
//       // Intenta obtener el mensaje de error del backend
//       const errorData = await response.json();
//       throw new Error(errorData.message || "Credenciales incorrectas");
//     }

//     return await response.json(); // Devuelve el token del usuario autenticado
//   } catch (error) {
//     console.error("Error en la solicitud de inicio de sesión:", error);
//     // Repropaga el error original para mantener el mensaje
//     throw error;
//   }
// }