import { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


export default function Inicio() {
  interface Opportunity {
    id: number;
    name: string;
    descriptions: string;
    image_url?: string;
  }

  interface Service {
    id: number;
    name: string;
    description: string;
    imageUrl?: string;
  }

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState<boolean>(true);
  const [loadingServices, setLoadingServices] = useState<boolean>(true);

  useEffect(() => {
    // Obtener las oportunidades desde el backend
    const fetchOpportunities = async () => {
      try {
        const response = await axios.get("http://3.142.142.153:5000/api/Opportunities");
        setOpportunities(response.data);
      } catch (error) {
        console.error("Error al obtener las oportunidades:", error);
      } finally {
        setLoadingOpportunities(false);
      }
    };

    // Obtener los servicios desde el backend
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://3.142.142.153:5000/api/Services");
        setServices(response.data);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchOpportunities();
    fetchServices();
  }, []);

  // Configuración del carrusel de oportunidades
  const opportunitySettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Configuración del carrusel de servicios
  const serviceSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Mostrar un máximo de 4 tarjetas
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // Pantallas medianas
        settings: {
          slidesToShow: 2, // Mostrar 2 tarjetas
        },
      },
      {
        breakpoint: 768, // Pantallas pequeñas
        settings: {
          slidesToShow: 1, // Mostrar 1 tarjeta
        },
      },
    ],
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Sección principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-6 font-raleway">
              ¡Tu futuro inicia aquí!
            </h1>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-raleway">
              En la Fundación Antivirus para la Deserción creemos que cada persona merece acceso a las mejores oportunidades. Por eso, ofrecemos una plataforma personalizada donde puedes explorar becas, cursos y programas adaptados a tus intereses y necesidades.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <img
              src="app/assets/images/imageHero.svg"
              alt="Imagen descriptiva"
              className="max-w-full h-auto"
            />
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <button className="bg-yellow-400 text-white font-semibold py-3 px-6 rounded-lg hover:bg-yellow-500 transition duration-200 font-raleway">
            Contactános
          </button>
          <a
            href="/about"
            className="text-lg md:text-xl text-blue-500 hover:text-blue-700 transition duration-200 font-raleway"
          >
            O conoce sobre nosotros
          </a>
        </div>
      </div>

      {/* Carrusel de oportunidades */}
      <section className="py-12 w-full">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
            Oportunidades Destacadas
          </h2>

          {loadingOpportunities ? (
            <p className="text-center text-gray-600">Cargando oportunidades...</p>
          ) : opportunities.length > 0 ? (
            <Slider {...opportunitySettings}>
              {opportunities.map((opportunity) => (
                <div key={opportunity.id} className="p-4">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Imagen de la oportunidad */}
                    <img
                      src={opportunity.image_url || "https://via.placeholder.com/300"}
                      alt={opportunity.name}
                      className="w-full h-48 object-cover"
                    />

                    {/* Nombre de la oportunidad */}
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {opportunity.name}
                      </h3>

                      {/* Descripción de la oportunidad */}
                      <p className="text-gray-600 text-sm">
                        {opportunity.descriptions}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <p className="text-center text-gray-600">No hay oportunidades disponibles.</p>
          )}
        </div>
      </section>

      {/* Carrusel de servicios */}
      <section className="py-12 w-full">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
            Nuestros Servicios
          </h2>

          {loadingServices ? (
            <p className="text-center text-gray-600">Cargando servicios...</p>
          ) : services.length > 0 ? (
            <Slider {...serviceSettings}>
              {services.map((service) => (
                <div key={service.id} className="p-4">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[500px] flex flex-col">
                    {/* Imagen del servicio */}
                    <img
                      src={service.imageUrl || "https://via.placeholder.com/300"}
                      alt={service.name}
                      className="w-full h-64 object-cover"
                    />

                    {/* Contenido del servicio */}
                    <div className="p-4 flex flex-col justify-between flex-grow">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {service.name}
                      </h3>
                      <p className="text-gray-600 text-sm flex-grow">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <p className="text-center text-gray-600">No hay servicios disponibles.</p>
          )}
        </div>
      </section>
    </section>
  );
}