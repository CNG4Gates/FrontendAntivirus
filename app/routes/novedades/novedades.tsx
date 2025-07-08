// import { json, redirect } from "@remix-run/node";
// import { useLoaderData } from "@remix-run/react";
// import { tokenCookie } from "~/utils/cookies";
// import Novedades from "~/components/Novedades";

// import type { LoaderFunction } from "@remix-run/node";

// export const loader: LoaderFunction = async ({ request }) => {
//   const cookieHeader = request.headers.get("Cookie");
//   const token = await tokenCookie.parse(cookieHeader);

//   // Si no hay token, redirige al usuario al login
//   if (!token) {
//     return redirect("/ingreso");
//   }

//   // Opcional: Verifica si el token es válido (puedes hacer una solicitud a tu API para validarlo)
//   try {
//     const response = await fetch("http://3.142.142.153:5000/api/auth/validate-token", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Token inválido");
//     }
//   } catch (error) {
//     console.error("Error al validar el token:", error);
//     return redirect("/ingreso");
//   }

//   return json({ token });
// };

// export default function OportunidadesRoute() {
//   const { token } = useLoaderData(); // Obtiene el token del loader

//   return <Novedades token={token} />; // Pasa el token al componente Novedades
// }