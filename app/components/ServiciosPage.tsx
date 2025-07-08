import { useEffect, useState } from "react";
import axiosInstance from "../utils/api";

interface Service {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

export default function ServiciosPage() {
  const [servicios, setServicios] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get("/Services")
      .then(res => setServicios(res.data))
      .catch(() => setServicios([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-black text-blue-900 mb-6 text-center tracking-tight drop-shadow-lg">
          Servicios
        </h1>
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="text-blue-600 text-lg font-semibold">Cargando servicios...</span>
          </div>
        ) : servicios.length === 0 ? (
          <div className="flex justify-center py-20">
            <span className="text-gray-500 text-lg font-semibold">No hay servicios disponibles.</span>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {servicios.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all border-t-4 border-blue-400 flex flex-col"
              >
                <img
                  src={s.imageUrl}
                  alt={s.name}
                  className="h-40 w-full object-cover rounded-xl mb-4 border"
                  onError={(e) => ((e.target as HTMLImageElement).src = "/default-serv.png")}
                />
                <h2 className="text-xl font-bold text-blue-700 mb-2">{s.name}</h2>
                <p className="text-gray-600 mb-4 flex-1">{s.description}</p>
                <span className="inline-block bg-blue-50 text-blue-600 font-bold rounded px-3 py-1 text-xs shadow">
                  Servicio Activo
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
