// import { Form } from "@remix-run/react";

// export default function FilterSearch() {
//   return (
//     <>
//       <div className="p-10">
//         <Form className="border border-[##00266BB5] blur-xs shadow-md p-9 flex flex-col gap-5">
//           <input
//             type="text"
//             name="Search Bar"
//             id=""
//             placeholder="🔍    Busca tu próxima oportunidad"
//             className="border border-gray-300 rounded-full p-2 mx-16 text-black bg-white"
//           />

//           <div className=" flex flex-row items-center gap-2">
//             <label htmlFor="date-start" className="px-4 align-middle text-center">
//               ¡Filtra tu búsqueda!
//             </label>
//             <input
//               type="date"
//               name="dateStart"
//               value="dd-mm-yyyy"
//               className="border border-gray-300 p-2 text-[#FAA307] bg-white"
//             />
//             <input
//               type="date"
//               name="change"
//               value="dd-mm-yyyy"
//               className="border border-gray-300 p-2 text-[#FAA307] bg-white"
//             />
//           </div>

//           <div className="flex flex-row items-center gap-4">
//             <div className="border border-[#D9D9D9]">
//               <label htmlFor="location" className="px-4">
//                 Ubicación
//               </label>
//               <select
//                 name="location"
//                 id="location"
//                 className="border border-gray-300 p-2 text-black bg-white"
//               >
//                 <option value="a">Medellín, Antioquia</option>
//                 <option value="b">B</option>
//               </select>
//             </div>
//             <div className="border border-[#D9D9D9]">
//               <label htmlFor="change" className="px-4">
//                 Tipo de oportunidad
//               </label>
//               <select
//                 name="location"
//                 id="location"
//                 className="border border-gray-300 p-2 text-black bg-white"
//               >
//                 <option value="a">Educativa</option>
//                 <option value="b">B</option>
//               </select>
//             </div>

//             <div className="border border-[#D9D9D9]">
//               <label htmlFor="change" className="px-4">
//                 Sector
//               </label>
//               <select
//                 name="location"
//                 id="location"
//                 className="border border-gray-300 p-2 text-black bg-white"
//               >
//                 <option value="a">Tecnología</option>
//                 <option value="b">B</option>
//               </select>
//             </div>
//             <div className="flex flex-row gap-2">
//               <button className="px-4 py-2 bg-[#FAA307] text-[#fff] font-bold">Búsqueda</button>
//               <button className="px-4 py-2 border border-[#D9D9D9">Limpiar</button>
//             </div>
//           </div>
//         </Form>
//       </div>
//     </>
//   );
// }

import { Form } from "@remix-run/react";
import { useState } from "react";

export default function FilterSearch({ onFilter }: { onFilter: Function }) {
  
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [sector, setSector] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onFilter({ query, location, type, sector});
  }
  
  return (
    <div className="p-10">
      <Form
        method="get"
        onSubmit={handleSubmit}
        className="border border-[#00266BB5] shadow-md p-9 flex flex-col gap-5"
      >
        <input
          type="text"
          name="query"
          placeholder="🔍    Busca tu próxima oportunidad"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-300 rounded-full p-2 mx-16 text-black bg-white"
        />

        <div className="flex flex-row items-center gap-2">
          <label htmlFor="date-start" className="px-4 text-center">
            ¡Filtra tu búsqueda!
          </label>
          <input
            type="date"
            name="dateStart"
            id="date-start"
            className="border border-gray-300 p-2 text-[#FAA307] bg-white"
          />
          <input
            type="date"
            name="dateEnd"
            id="date-end"
            className="border border-gray-300 p-2 text-[#FAA307] bg-white"
          />
        </div>

        <div className="flex flex-row items-center gap-4">
          <div className="border border-[#D9D9D9]">
            <label htmlFor="location" className="px-4">
              Ubicación
            </label>
            <select
              name="location"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border border-gray-300 p-2 text-black bg-white"
            >
              <option value="">Todas</option>
              <option value="Medellín">Medellín</option>
              <option value="Bogotá">Bogotá</option>
              <option value="Armenia">Armenia</option>
              <option value="Rionegro">Rionegro</option>
            </select>
          </div>

          <div className="border border-[#D9D9D9]">
            <label htmlFor="type" className="px-4">
              Tipo de oportunidad
            </label>
            <select
              name="type"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border border-gray-300 p-2 text-black bg-white"
            >
              <option value="">Todas</option>
              <option value="Educativa">Educativa</option>
              <option value="Laboral">Laboral</option>
            </select>
          </div>

          <div className="border border-[#D9D9D9]">
            <label htmlFor="sector" className="px-4">
              Sector
            </label>
            <select
              name="sector"
              id="sector"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="border border-gray-300 p-2 text-black bg-white"
            >
              <option value="">Todos</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Ciencias">Ciencias</option>
            </select>
          </div>

          <div className="flex flex-row gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-[#FAA307] text-white font-bold rounded"
            >
              Búsqueda
            </button>
            <button
              type="reset"
              className="px-4 py-2 border border-[#D9D9D9] rounded"
            >
              <a href="/novedades">
              Limpiar
              </a>
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}
