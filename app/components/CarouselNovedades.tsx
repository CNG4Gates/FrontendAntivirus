import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

export default function Carousel() {
  const images = [
    "https://www.womex.com/virtual/image/logo/big/comfama_big_73321.png",
    "https://www.eafit.edu.co/nodo/PublishingImages/logo-nodo-an.gif",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Logo_EAFIT.svg/2560px-Logo_EAFIT.svg.png",
  ];

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={-30}
      slidesPerView={1.5}
      centeredSlides={true}
      loop={true}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000 }}
      className="w-full max-w-screen-xl"
    >
      {images.map((src, index) => (
        <SwiperSlide
          key={index}
          className="flex justify-center items-center transition-transform duration-300"
        >
          <div className="flex justify-center items-center w-full h-96">
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover bg-black rounded-3xl shadow-lg shadow-gray-400 transition-transform duration-300 scale-90 swiper-slide-active:scale-100"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
