// import { redirect } from "@remix-run/node";
// import { tokenCookie } from "~/utils/cookies";

// export const loader = async () => {
//   return redirect("/", {
//     headers: {
//       "Set-Cookie": await tokenCookie.serialize("", { maxAge: 0 }), // Elimina la cookie
//     },
//   });
// };

// export default function LogoutPage() {
//   return null; // No se necesita renderizar nada, ya que el loader maneja la redirección
// }