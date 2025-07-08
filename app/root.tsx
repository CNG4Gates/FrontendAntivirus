import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import "./tailwind.css";
import slickStylesHref from "./styles/slick.css?url";
import slickThemeHref from "./styles/slick-theme.css?url";
import { lazy, Suspense } from "react";
import LoadingComponent from "./components/Loading.component";
import { AuthProvider } from "./utils/authCOntext"; // Importar el AuthProvider


// IMPORTS DINÁMICOS CORRECTOS
const Navbar = lazy(() => import("./components/Navbar"));
const Footer = lazy(() => import("./components/Footer"));

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap",
  },
  { rel: "stylesheet", href: slickStylesHref },
  { rel: "stylesheet", href: slickThemeHref },
];

export const loader: LoaderFunction = async ({ request }) => {
  try {
    // Llama al backend para verificar si el usuario está autenticado
    const response = await fetch("http://3.142.142.153:5000/api/auth/validate-token", {
      headers: { Cookie: request.headers.get("Cookie") || "" },
      credentials: "include", // Asegúrate de enviar cookies al backend
    });

    // Si el backend devuelve 200, el usuario está autenticado
    const isAuthenticated = response.ok;
    return json({ isAuthenticated });
  } catch (error) {
    console.error("Error al verificar la autenticación:", error);
    return json({ isAuthenticated: false });
  }
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-[#fafafa] min-h-screen">
        <AuthProvider>
          <Suspense fallback={<LoadingComponent />}>
            <Navbar />
          </Suspense>

          <main>
            {children}
          </main>

          <ScrollRestoration />
          <Scripts />
          <Suspense fallback={<LoadingComponent />}>
            <Footer />
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}

// Para Remix, normalmente exportas App como el componente principal:
export default function App() {
  return <Outlet />;
}
