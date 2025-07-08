import { useEffect, useState } from "react";
import axiosInstance from "../utils/api";

interface Opportunity {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

export default function OportunidadesPage() {
  const [oportunidades, setOportunidades] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get("/Opportunities")
      .then(res => setOportunidades(res.data))
      .catch(() => setOportunidades([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-black text-blue-900 mb-6 text-center tracking-tight drop-shadow-lg">
          Oportunidades
        </h1>
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="text-blue-600 text-lg font-semibold">Cargando oportunidades...</span>
          </div>
        ) : oportunidades.length === 0 ? (
          <div className="flex justify-center py-20">
            <span className="text-gray-500 text-lg font-semibold">No hay oportunidades disponibles.</span>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {oportunidades.map((o) => (
              <div
                key={o.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all border-t-4 border-blue-400 flex flex-col"
              >
                <img
                  src={o.imageUrl}
                  alt={o.name}
                  className="h-40 w-full object-cover rounded-xl mb-4 border"
                  onError={(e) => ((e.target as HTMLImageElement).src = "/default-op.png")}
                />
                <h2 className="text-xl font-bold text-blue-700 mb-2">{o.name}</h2>
                <p className="text-gray-600 mb-4 flex-1">{o.description}</p>
                <button
                  className="mt-auto bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded shadow-sm transition-all"
                  disabled
                  title="Próximamente podrás aplicar"
                >
                  Aplicar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
