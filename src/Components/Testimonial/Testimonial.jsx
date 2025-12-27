import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import "swiper/css";
import "swiper/css/navigation";
import { useRef } from "react";
import { FaStar } from "react-icons/fa";

const Testimonial = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      image: "/customers/customer_1.jpg",
      review:
        "Bought MacBook Pro M3 Max from TechMart. Fast shipping, authentic product, and excellent customer support. Highly recommended!",
      name: "Michael Chen",
      role: "Software Engineer",
      rating: 5,
    },
    {
      id: 2,
      image: "/customers/customer_4.jpg",
      review:
        "Amazing experience! Got my iPhone 15 Pro Max at a great price. The warranty coverage and tech support are top-notch.",
      name: "Sarah Johnson",
      role: "Marketing Director",
      rating: 5,
    },
    {
      id: 3,
      image: "/customers/customer_3.jpg",
      review:
        "Best tech store online! Purchased Dell XPS 15 for my team. Quick delivery and genuine products. Will buy again.",
      name: "David Martinez",
      role: "Startup Founder",
      rating: 5,
    },
    {
      id: 4,
      image: "/customers/customer_2.jpg",
      review:
        "Excellent service! The AirPods Pro I ordered arrived perfectly packaged. Customer support answered all my questions promptly.",
      name: "Emily Watson",
      role: "Content Creator",
      rating: 5,
    },
  ];

  const breakpoints = {
    0: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    1440: {
      slidesPerView: 2,
      spaceBetween: 40,
    },
  };

  return (
    <div className="w-full min-h-[840px] h-full bg-[#fafafa] overflow-hidden pt-[100px] pb-[58px]">
      <div className="lg:container mx-auto">
        {/* header title */}
        <div className="w-full flex flex-col items-center mb-[80px]">
          <h3 className="text-5xl text-[#484848] font-normal capitalize mb-5">
            What Our Customers Say
          </h3>
          <p className="text-base text-[#8a8a8a] font-poppins font-normal max-w-[614px] w-full text-center">
            Join thousands of satisfied customers who trust TechMart for their
            tech needs. Read their experiences with our products and services.
          </p>
        </div>

        {/* sliders */}
        <div className="w-full h-auto relative pb-20">
          <div className="absolute left-1/2 transform translate-x-1/2 bottom-0 flex items-center gap-5 z-50">
            <div>
              <button
                ref={prevRef}
                className="w-[48px] h-[48px] bg-white shadow flex items-center justify-center border-[1px] border-[#8a8a8a] rounded-full cursor-pointer"
              >
                <IoIosArrowBack size={"1.8rem"} />
              </button>
            </div>
            <div>
              <button
                ref={nextRef}
                className="w-[48px] h-[48px] bg-white shadow flex items-center justify-center border-[1px] border-[#8a8a8a] rounded-full cursor-pointer"
              >
                <IoIosArrowForward size={"1.8rem"} />
              </button>
            </div>
          </div>

          <Swiper
            modules={[Navigation]}
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
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="flex items-center justify-between p-8 bg-white shadow-2xl min-w-[764px] w-full min-h-[400px] h-full rounded-lg gap-10">
                  <div className="relative max-w-[242px] w-full min-h-[242px] h-full testimonial_img">
                    <img
                      className="max-w-[242px] w-full min-h-[242px] h-full object-cover relative z-10 rounded-lg"
                      src={testimonial.image}
                      alt={`${testimonial.name} - TechMart customer`}
                    />
                  </div>
                  <div className="flex flex-col gap-6">
                    <p className="text-base text-black font-poppins font-normal">
                      "{testimonial.review}"
                    </p>
                    <span className="flex items-center gap-1.5 pb-5 border-b-[1px] border-[#484848] max-w-[230px] w-full">
                      {[...Array(testimonial.rating)]?.map((_, index) => (
                        <FaStar key={index} size={"1.5rem"} color="#fca120" />
                      ))}
                    </span>
                    <h4 className="text-4xl text-[#484848] font-normal capitalize">
                      {testimonial.name}
                    </h4>
                    <span className="text-base text-[#484848] font-poppins font-normal capitalize">
                      {testimonial.role}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
