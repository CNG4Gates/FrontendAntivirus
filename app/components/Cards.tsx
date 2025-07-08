import { Link } from "@remix-run/react";

type CardProps = {
  image: string;
  title: string;
  description: string;
  buttonLink: string;
  onClick: () => void;
};

export default function Card({
  image,
  title,
  description,
  buttonLink,
  onClick
}: CardProps) {
  return (
    <div className="bg-white shadow-lg rounded-sm w-[450px] h-80 overflow-hidden text-center flex flex-col">
      <img
        src={image}
        alt={title}
        className="w-full h-[160px] object-cover rounded-lg"
      />
      <div className="p-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold mt-4">{title}</h2>
          <Link
            to={buttonLink}
            className="mt-2 inline-block text-[#1D1854] py-1 px-6 border border-[#1D1854] rounded-full hover:bg-[#1D1854] hover:text-white transition"
          >
            Abrir
          </Link>
        </div>
        <div className="mt-3 h-[60px] text-gray-600 text-sm text-pretty truncate">
          {description}
        </div>
        <div className="flex flex-row-reverse text-[#faa307] font-bold">
          <button
          onClick={onClick}>
            ... ver más
          </button>
        </div>
      </div>
    </div>
  );
}
