import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import DealsSlider from "../DealsSlider/DealsSlider.jsx";
const Deals = () => {
  return (
    <div className="w-full min-h-[782px] bg-white pt-[100px] py-10">
      <div className="lg:container mx-auto px-4">
        <div className="flex justify-between gap-8">
          {/* Deals Content */}
          <div className="deals_wrapper max-w-[600px]">
            <h3 className="text-5xl text-[#484848] font-normal capitalize mb-5">
              Deals of the Month
            </h3>
            <p className="text-base text-[#8a8a8a] font-poppins font-normal mb-10 max-w-[444px] w-full h-auto">
              Get ready for unbeatable discounts on top tech products! Save up
              to 50% on laptops, smartphones, and accessories. Limited stock
              available - grab yours before time runs out!
            </p>
            <Link
              to={"/product"}
              className="text-base text-white font-poppins font-normal capitalize px-8 py-2.5 bg-black rounded-lg"
            >
              View All Products
            </Link>

            {/* Countdown Timer */}
            <div className="mt-10">
              <h5 className="text-[27px] text-[#484848] font-poppins font-medium capitalize mb-4">
                Hurry, Before It's Too Late!
              </h5>
              <div className="flex items-center gap-8 cursor-pointer">
                {/* Days */}
                <div className="days flex flex-col gap-2.5 items-center justify-center">
                  <h5 className="w-[76px] h-[76px] rounded-sm bg-white shadow text-[#484848] text-3xl font-normal flex items-center justify-center">
                    02
                  </h5>
                  <p className="text-[22px] text-[#484848] font-poppins capitalize font-normal">
                    Days
                  </p>
                </div>

                {/* Hours */}
                <div className="hr flex flex-col gap-2.5 items-center justify-center">
                  <h5 className="w-[76px] h-[76px] rounded-sm bg-white shadow text-[#484848] text-3xl font-normal flex items-center justify-center">
                    02
                  </h5>
                  <p className="text-[22px] text-[#484848] font-poppins capitalize font-normal">
                    hours
                  </p>
                </div>

                {/* Minutes */}
                <div className="mins flex flex-col gap-2.5 items-center justify-center">
                  <h5 className="w-[76px] h-[76px] rounded-sm bg-white shadow text-[#484848] text-3xl font-normal flex items-center justify-center">
                    02
                  </h5>
                  <p className="text-[22px] text-[#484848] font-poppins capitalize font-normal">
                    minutes
                  </p>
                </div>

                {/* Seconds */}
                <div className="secs flex flex-col gap-2.5 items-center justify-center">
                  <h5 className="w-[76px] h-[76px] rounded-sm bg-white shadow text-[#484848] text-3xl font-normal flex items-center justify-center">
                    02
                  </h5>
                  <p className="text-[22px] text-[#484848] font-poppins capitalize font-normal">
                    seconds
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* slider */}
          <DealsSlider />
        </div>
      </div>
    </div>
  );
};

export default Deals;
