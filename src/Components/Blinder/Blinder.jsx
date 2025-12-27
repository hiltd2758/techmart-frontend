import React from 'react'
import { Link } from 'react-router-dom'
import {FaHandHoldingHeart} from 'react-icons/fa'
import { FaAward } from 'react-icons/fa'
import { FaShippingFast } from 'react-icons/fa'
import { IoCall } from 'react-icons/io5'

const Blinder = () => {
  return (
    <div className='w-full pb-[150px]'>
      <div className="lg:container mx-auto">

        {/* top wrapper */}
        <div className="flex items-center">
          <div className="w-1/2 min-h-[570px]">
            <img
              className="w-full h-full object-cover min-h-[570px]"
              src="/blinder/macbook_pro.png"
              alt="MacBook Pro M3 Max featured product"
            />
          </div>

          <div className="w-1/2 min-h-[570px] bg-[#f5f5f5] p-8 flex justify-center flex-col">
            <span className="text-base text-black font-poppins font-normal capitalize mb-5 block">
              Featured Product
            </span>

            <h3 className="text-5xl text-[#484848] font-normal capitalize mb-5">
              MacBook Pro 16" M3 Max
            </h3>

            <span className="text-base text-black font-poppins font-normal uppercase underline mb-5">
              Specifications
            </span>

            <p className="text-base text-[#767676] font-poppins font-normal mb-5 max-w-[515px] w-full">
              Experience unprecedented performance with Apple's M3 Max chip. 
              Featuring 36GB unified memory, 1TB SSD storage, and stunning 
              16-inch Liquid Retina XDR display. Perfect for professionals 
              and creators.
            </p>

            <p className="text-base text-[#767676] font-poppins font-normal capitalize mb-5">
              Configuration:
              <span className="inline-block px-4 py-2 bg-black rounded-sm text-white ml-3">
                M3 Max / 36GB / 1TB
              </span>
            </p>

            <p className="text-2xl text-black mb-5 font-semibold">
              Price: <span className="text-red-600">$5,499</span>
              <span className="text-base text-gray-500 line-through ml-3">$6,499</span>
            </p>

            <Link
              to="/products/macbook-pro-m3-max"
              className="text-base text-white font-poppins font-medium capitalize px-6 py-2.5 bg-black rounded-lg max-w-[207px] w-full flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              Buy Now
            </Link>
          </div>
        </div>

      </div>

      {/* bottom wrapper - Benefits */}
      <div className="w-full bg-white min-h-[200px] h-full flex items-center justify-center shadow-lg">
        <div className="lg:container mx-auto">
          <div className="flex items-center justify-between gap-8">
            
            {/* Authentic Products */}
            <div className="flex items-center gap-3">
              <button><FaHandHoldingHeart size='2.5rem' color='black' /></button>
              <div>
                <h4 className="text-xl text-[#484848] font-poppins font-medium capitalize mb-2">
                  Authentic Products
                </h4>
                <span className="text-base text-[#484848] font-poppins font-normal">
                  100% genuine guarantee
                </span>
              </div>
            </div>

            {/* Warranty */}
            <div className="flex items-center gap-3">
              <button><FaAward size='2.5rem' color='black' /></button>
              <div>
                <h4 className="text-xl text-[#484848] font-poppins font-medium capitalize mb-2">
                  Warranty Protection
                </h4>
                <span className="text-base text-[#484848] font-poppins font-normal">
                  Up to 2 years warranty
                </span>
              </div>
            </div>

            {/* Free Shipping */}
            <div className="flex items-center gap-3">
              <button><FaShippingFast size='2.5rem' color='black' /></button>
              <div>
                <h4 className="text-xl text-[#484848] font-poppins font-medium capitalize mb-2">
                  Free Shipping
                </h4>
                <span className="text-base text-[#484848] font-poppins font-normal">
                  Orders over $500
                </span>
              </div>
            </div>

            {/* Support */}
            <div className="flex items-center gap-3">
              <button><IoCall size='2.5rem' color='black' /></button>
              <div>
                <h4 className="text-xl text-[#484848] font-poppins font-medium capitalize mb-2">
                  Expert Support
                </h4>
                <span className="text-base text-[#484848] font-poppins font-normal">
                  24/7 tech assistance
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Blinder