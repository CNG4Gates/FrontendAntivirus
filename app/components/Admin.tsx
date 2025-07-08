import { useEffect, useState } from "react";
import axiosInstance from "../utils/api";

// Interfaces según Swagger
interface Opportunity {
  id?: number;
  name: string;
  description: string;
  imageUrl: string;
}

interface Service {
  id?: number;
  name: string;
  description: string;
  imageUrl: string;
}

interface Benefit {
  id?: number;
  name: string;
  description: string;
  imageUrl: string;
}

type FormType = "opportunity" | "service" | "benefit";

const emptyData = {
  opportunity: { name: "", description: "", imageUrl: "" },
  service: { name: "", description: "", imageUrl: "" },
  benefit: { name: "", description: "", imageUrl: "" },
};

export default function Admin() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [formType, setFormType] = useState<FormType>("opportunity");
  const [formData, setFormData] = useState<any>({ ...emptyData.opportunity });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [submitting, setSubmitting] = useState(false);

  // Fetch all data
  const refreshData = async () => {
    try {
      const [opportunitiesResponse, servicesResponse, benefitsResponse] = await Promise.all([
        axiosInstance.get("/Opportunities"),
        axiosInstance.get("/Services"),
        axiosInstance.get("/Benefits"),
      ]);
      setOpportunities(opportunitiesResponse.data);
      setServices(servicesResponse.data);
      setBenefits(benefitsResponse.data);
    } catch (error: any) {
      console.error("Error al refrescar los datos:", error);
    }
  };

  // Fetch on mount
  useEffect(() => {
    (async () => {
      await refreshData();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cambia tipo de formulario y limpia
  const handleChangeType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as FormType;
    setFormType(type);
    setFormData({ ...emptyData[type] });
    setIsEditing(false);
  };

  // Cambios de inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const showMessage = (msg: string, type: "success" | "error" = "success") => {
    setMessage(msg);
    setMessageType(type);
    // Scroll al top si hay mensaje
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setMessage(""), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    let endpoint = "";
    let postData = {};

    if (formType === "opportunity") {
      endpoint = "/Opportunities";
      postData = {
        name: formData.name,
        description: formData.description,
        adicionalDates: "N/A",
        applications: "N/A",
        contactChannels: "N/A",
        guide: "N/A",
        observations: "N/A",
        requirements: "N/A",
        categoriesId: 0,
        statusReviewId: 0,
        opportunityTypeId: 0,
        imageUrl: formData.imageUrl,
        status: true,
      };
    } else if (formType === "service") {
      endpoint = "/Services";
      postData = {
        name: formData.name,
        description: formData.description,
        imageUrl: formData.imageUrl,
      };
    } else {
      endpoint = "/Benefits";
      postData = {
        name: formData.name,
        description: formData.description,
        imageUrl: formData.imageUrl,
      };
    }

    try {
      if (isEditing && formData.id) {
        await axiosInstance.put(`${endpoint}/${formData.id}`, postData);
        showMessage("Elemento actualizado exitosamente.", "success");
      } else {
        await axiosInstance.post(endpoint, postData);
        showMessage("Elemento creado exitosamente.", "success");
      }
      setFormData({ ...emptyData[formType] });
      setIsEditing(false);
      await refreshData();
    } catch (error: any) {
      console.error("Error al guardar el elemento:", error);
      showMessage("Hubo un error al guardar el elemento.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Editar
  const handleEdit = (item: any, type: FormType) => {
    setFormType(type);
    setFormData({ ...item });
    setIsEditing(true);
  };

  // Eliminar
  const handleDelete = async (id: number, type: FormType) => {
    let endpoint = "";
    if (type === "opportunity") endpoint = "/Opportunities";
    if (type === "service") endpoint = "/Services";
    if (type === "benefit") endpoint = "/Benefits";
    try {
      await axiosInstance.delete(`${endpoint}/${id}`);
      showMessage("Elemento eliminado exitosamente.", "success");
      await refreshData();
    } catch (error: any) {
      console.error("Error al eliminar el elemento:", error);
      showMessage("Hubo un error al eliminar el elemento.", "error");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({ ...emptyData[formType] });
    setIsEditing(false);
  };

  if (loading) return <p>Cargando datos...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Toast/Mensaje de éxito/error */}
      {message && (
        <div
          className={`fixed left-1/2 top-8 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg font-bold text-lg 
          ${messageType === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
        >
          {message}
        </div>
      )}

      <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">Panel de Administración</h1>

      {/* Tipo de formulario */}
      <div className="max-w-lg mx-auto mb-6">
        <label htmlFor="type" className="block text-gray-700 font-semibold mb-2">Tipo de elemento:</label>
        <select
          id="type"
          value={formType}
          onChange={handleChangeType}
          className="w-full px-4 py-3 border rounded bg-gray-100 text-gray-700 text-lg"
          disabled={isEditing}
        >
          <option value="opportunity">Oportunidad</option>
          <option value="service">Servicio</option>
          <option value="benefit">Beneficio</option>
        </select>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-700">{isEditing ? "Editar" : "Crear"} {formType === "opportunity" ? "Oportunidad" : formType === "service" ? "Servicio" : "Beneficio"}</h2>
        <Input name="name" label="Nombre" value={formData.name} onChange={handleChange} required />
        <Textarea name="description" label="Descripción" value={formData.description} onChange={handleChange} required />
        <Input name="imageUrl" label="URL Imagen" value={formData.imageUrl} onChange={handleChange} required />
        <button
          type="submit"
          disabled={submitting}
          className={`bg-blue-500 text-white font-bold py-3 px-5 rounded hover:bg-blue-600 transition duration-200 ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isEditing ? "Actualizar" : "Crear"}
        </button>
        <button type="button" onClick={resetForm} className="ml-4 bg-gray-500 text-white font-bold py-3 px-5 rounded hover:bg-gray-600 transition duration-200">
          Cancelar
        </button>
      </form>

      {/* Listados */}
      <SectionList
        title="Oportunidades"
        items={opportunities}
        type="opportunity"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <SectionList
        title="Servicios"
        items={services}
        type="service"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <SectionList
        title="Beneficios"
        items={benefits}
        type="benefit"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

// Helpers Components
function Input(props: any) {
  return (
    <div className="mb-4">
      <label htmlFor={props.name} className="block text-gray-700 font-semibold mb-2">{props.label}</label>
      <input
        type={props.type || "text"}
        id={props.name}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        required={props.required}
        className="w-full px-4 py-3 border rounded bg-gray-100 text-gray-700 text-lg"
      />
    </div>
  );
}

function Textarea(props: any) {
  return (
    <div className="mb-4">
      <label htmlFor={props.name} className="block text-gray-700 font-semibold mb-2">{props.label}</label>
      <textarea
        id={props.name}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        required={props.required}
        className="w-full px-4 py-3 border rounded bg-gray-100 text-gray-700 text-lg"
      ></textarea>
    </div>
  );
}

function SectionList({ title, items, type, onEdit, onDelete }: any) {
  return (
    <>
      <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item: any) => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
            <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 className="text-lg font-bold">{item.name}</h3>
            <p className="text-gray-600">{item.description}</p>
            <div className="mt-4 flex justify-between">
              <button onClick={() => onEdit(item, type)} className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600">Editar</button>
              <button onClick={() => onDelete(item.id, type)} className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
