import { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import Card from "~/components/Cards";
import FilterSearch from "~/components/FilterSearch";

interface Opportunity {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  location?: string;
  oportunity_type?: string;
  sector?: string;
}

interface Service {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
}

export default function Novedades() {
  const [services, setServices] = useState<Service[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCards, setVisibleCards] = useState(6);

  // Configuración del carrusel
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: true,
    centerMode: true,
    centerPadding: "40px",
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          centerPadding: "30px",
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          centerPadding: "10px",
        },
      },
    ],
  };

  // Traer servicios
  useEffect(() => {
    axios.get("http://3.142.142.153:5000/api/Services")
      .then(res => setServices(res.data))
      .catch(() => setServices([]));
  }, []);

  // Traer oportunidades
  useEffect(() => {
    axios.get("http://3.142.142.153:5000/api/Opportunities")
      .then(res => {
        setOpportunities(res.data);
        setFilteredOpportunities(res.data);
      })
      .catch(() => {
        setOpportunities([]);
        setFilteredOpportunities([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filtrado
  const handleFilter = (filters: {
    query: string;
    location: string;
    type: string;
    sector: string;
  }) => {
    const { query, location, type, sector } = filters;
    const filtered = opportunities.filter((o) => {
      const matchesQuery =
        o.name?.toLowerCase().includes(query.toLowerCase()) ||
        o.description?.toLowerCase().includes(query.toLowerCase());
      const matchesLocation = location ? o.location === location : true;
      const matchesType = type ? o.oportunity_type === type : true;
      const matchesSector = sector ? o.sector === sector : true;
      return matchesQuery && matchesLocation && matchesType && matchesSector;
    });
    setFilteredOpportunities(filtered);
    setVisibleCards(6);
  };

  if (loading) {
    return <p className="text-center text-gray-600 py-12">Cargando contenido...</p>;
  }

  return (
    <div className="flex flex-col items-center bg-[#F7FAFF] min-h-screen">
      {/* Título */}
      <h1 className="text-[#1D1856] text-[70px] font-extrabold pt-8 pb-4">Novedades</h1>
      
      {/* Carrusel de Servicios */}
      <div className="w-full max-w-6xl px-2 md:px-8 py-4">
        <Slider {...sliderSettings}>
          {services.length === 0 ? (
            <div className="p-12 flex items-center justify-center h-64">
              <p className="text-gray-400">No hay servicios disponibles.</p>
            </div>
          ) : (
            services.map((service) => (
              <div key={service.id} className="px-4">
                <div className="bg-white shadow-xl rounded-2xl p-6 h-[370px] flex flex-col items-center justify-between transition-transform duration-300 hover:scale-105 border-2 border-blue-100">
                  <img
                    src={service.imageUrl || "https://picsum.photos/300/150?blur=2"}
                    alt={service.name}
                    className="rounded-lg h-36 w-full object-cover mb-4 shadow-md"
                  />
                  <h3 className="text-xl font-bold text-[#00266B] mb-2 text-center">{service.name}</h3>
                  <p className="text-gray-700 text-sm py-2 text-center line-clamp-4">{service.description}</p>
                </div>
              </div>
            ))
          )}
        </Slider>
      </div>

      {/* Filtro de búsqueda */}
      <div className="w-full max-w-5xl mx-auto mt-10 mb-6">
        <FilterSearch onFilter={handleFilter} />
      </div>

      {/* Grilla de Oportunidades */}
      <h2 className="text-[#1D1856] text-[40px] font-bold mb-6">¡Oportunidades para estudiar!</h2>
{filteredOpportunities.length === 0 ? (
  <p className="text-gray-400 text-lg py-10">No se encontraron oportunidades.</p>
) : (
  <>
    <div className="w-full flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-6 px-2 md:px-4 w-full max-w-6xl">
        {filteredOpportunities.slice(0, visibleCards).map((opportunity) => (
          <div key={opportunity.id} className="flex">
            <Card
              image={opportunity.imageUrl || "https://via.placeholder.com/300"}
              title={opportunity.name}
              description={opportunity.description}
              buttonLink={`/oportunidades/${opportunity.id}`}
              onClick={() => {}}
              // Si tu componente Card acepta className, puedes agregar min-h aquí
              // className="min-h-[370px] flex flex-col"
            />
          </div>
        ))}
      </div>
    </div>
    {/* Espacio entre las tarjetas y el botón */}
    <div className="my-8" />
    {visibleCards < filteredOpportunities.length && (
      <button
        className="mb-10 px-8 py-3 bg-[#FAA307] text-white font-bold rounded hover:bg-[#FFB454] transition-all"
        onClick={() => setVisibleCards((prev) => prev + 6)}
      >
        ▼ Mostrar más resultados
      </button>
    )}
  </>
)}
    </div>
  );
}
