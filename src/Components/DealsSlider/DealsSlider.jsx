import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import {
  HiOutlineArrowCircleLeft,
  HiOutlineArrowCircleRight,
} from "react-icons/hi";
import "swiper/css";
import "swiper/css/navigation";
import React from "react";

const DealsSlider = () => {
  const prevRef = React.useRef(null);
  const nextRef = React.useRef(null);

  const breakpoints = {
    0: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 1,
      spaceBetween: 30,
    },
    1024: {
      slidesPerView: 1,
      spaceBetween: 40,
    },
    1440: {
      slidesPerView: 2,
      spaceBetween: 60,
    },
  };

  return (
    <div className="overflow-hidden relative pb-16">
      {/* Navigation Buttons - Fixed positioning */}
      <div className="absolute left-0 bottom-0 flex items-center gap-3 z-50">
        <button
          ref={prevRef}
          className="w-[48px] h-[48px] bg-white shadow flex items-center justify-center border-[1px] border-[#8a8a8a] rounded-full cursor-pointer"
        >
          <HiOutlineArrowCircleLeft size={"1.8rem"} />
        </button>
        <button
          ref={nextRef}
          className="w-[48px] h-[48px] bg-white shadow flex items-center justify-center border-[1px] border-[#8a8a8a] rounded-full cursor-pointer"
        >
          <HiOutlineArrowCircleRight size={"1.8rem"} />
        </button>
      </div>

      <Swiper
        modules={[Navigation]}
        loop={true}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        breakpoints={breakpoints}
      >
        <SwiperSlide>
          <div className="relative">
            <img
              className="w-full max-h-[582px] h-full object-cover"
              src="/deals/deals_1.jpg"
              alt="Laptop sale deal"
            />
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 max-w-[217px] w-full bg-white flex flex-col items-center justify-center gap-2.5 py-6 px-4">
              <h5 className="text-base text-[#484848] font-poppins font-normal capitalize">
                01 - Laptop Sale
              </h5>
              <span className="text-xl text-[#484848] font-poppins capitalize font-medium">
                40% OFF
              </span>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="relative">
            <img
              className="w-full max-h-[582px] h-full object-cover"
              src="/deals/deals_2.png"
              alt="Smartphone deal"
            />
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 max-w-[217px] w-full bg-white flex flex-col items-center justify-center gap-2.5 py-6 px-4">
              <h5 className="text-base text-[#484848] font-poppins font-normal capitalize">
                02 - Smartphone Deal
              </h5>
              <span className="text-xl text-[#484848] font-poppins capitalize font-medium">
                35% OFF
              </span>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="relative">
            <img
              className="w-full max-h-[582px] h-full object-cover"
              src="/deals/deals_3.png"
              alt="Accessories sale"
            />
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 max-w-[217px] w-full bg-white flex flex-col items-center justify-center gap-2.5 py-6 px-4">
              <h5 className="text-base text-[#484848] font-poppins font-normal capitalize">
                03 - Accessories Sale
              </h5>
              <span className="text-xl text-[#484848] font-poppins capitalize font-medium">
                50% OFF
              </span>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="relative">
            <img
              className="w-full max-h-[582px] h-full object-cover"
              src="/deals/deals_1.png"
              alt="Gaming gear deal"
            />
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 max-w-[217px] w-full bg-white flex flex-col items-center justify-center gap-2.5 py-6 px-4">
              <h5 className="text-base text-[#484848] font-poppins font-normal capitalize">
                04 - Gaming Gear
              </h5>
              <span className="text-xl text-[#484848] font-poppins capitalize font-medium">
                45% OFF
              </span>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="relative">
            <img
              className="w-full max-h-[582px] h-full object-cover"
              src="/deals/deals_2.png"
              alt="Audio devices deal"
            />
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 max-w-[217px] w-full bg-white flex flex-col items-center justify-center gap-2.5 py-6 px-4">
              <h5 className="text-base text-[#484848] font-poppins font-normal capitalize">
                05 - Audio Devices
              </h5>
              <span className="text-xl text-[#484848] font-poppins capitalize font-medium">
                30% OFF
              </span>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default DealsSlider;