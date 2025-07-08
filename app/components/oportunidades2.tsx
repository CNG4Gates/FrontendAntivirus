// import { useState } from "react";
// import oportunidad1 from "../assets/images/oportunidad1.svg";
// import oportunidad2 from "../assets/images/oportunidad2.svg";
// import nodo from "../assets/images/nodo.svg";

// const oportunidadesData = [
//   {
//     img: nodo,
//     title: "Nodo EAFIT",
//     description: "Participa en programas de formación y talleres en la Universidad EAFIT en el área de la tecnología para potenciar tus habilidades y conocimientos. ¡Inscríbete hoy!",
//     link: "https://es.nodoeafit.com"
//   },
//   {
//     img: oportunidad1,
//     title: "Becas vélezreyes+",
//     description: "Ofrecen apoyo financiero a estudiantes destacados. Solicita tu beca y alcanza tus metas educativas.",
//     link: "https://velezreyesmas.com"
//   },
//   {
//     img: oportunidad2,
//     title: "Comfama",
//     description: "Accede a programas educativos y recreativos con Comfama, la oportunidad perfecta para tu crecimiento personal y profesional.",
//     link: "https://www.comfama.com/servicio-de-empleo/"
//   },
//   {
//     img: oportunidad2,
//     title: "Comfama",
//     description: "Accede a programas educativos y recreativos con Comfama, la oportunidad perfecta para tu crecimiento personal y profesional.",
//     link: "https://www.comfama.com/servicio-de-empleo/"
//   }
// ];

// export default function Oportunidades() {
//   const [showAll, setShowAll] = useState(false);

//   const displayedOportunidades = showAll ? oportunidadesData : oportunidadesData.slice(0, 3);

//   return (
//     <section className="oportunidades-section">
//       <h1 className="text-4xl font-bold text-center my-8 text-custom-color">¡Mira estas oportunidades!</h1>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         {displayedOportunidades.map((oportunidad, index) => (
//           <div key={index} className="oportunidad-card">
//             <img src={oportunidad.img} alt={oportunidad.title} className="oportunidad-image" />
//             <h2 className="text-2xl font-semibold text-custom-color">{oportunidad.title}</h2>
//             <p className="text-custom-color">{oportunidad.description}</p>
//             <a href={oportunidad.link} className="oportunidad-link" target="_blank" rel="noopener noreferrer">Más información</a>
//           </div>
//         ))}
//       </div>
//       {oportunidadesData.length > 3 && (
//         <div className="text-center mt-8">
//           <button
//             onClick={() => setShowAll(!showAll)}
//             className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
//           >
//             {showAll ? "Mostrar menos" : "Más oportunidades"}
//           </button>
//         </div>
//       )}
//     </section>
//   );
// }
