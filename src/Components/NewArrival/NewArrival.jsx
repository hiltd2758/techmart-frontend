import { FaStar } from "react-icons/fa";

const NewArrival = () => {
  const newArrivalsCategories = [
    {
      id: 1,
      name: "Gaming Laptops",
      category: "laptops",
    },
    {
      id: 2,
      name: "Flagship Phones",
      category: "smartphones",
    },
    {
      id: 3,
      name: "Wireless Earbuds",
      category: "audio",
    },
    {
      id: 4,
      name: "Smartwatches",
      category: "wearables",
    },
    {
      id: 5,
      name: "Accessories",
      category: "accessories",
    },
  ];

const products = [
  {
    _id: "1",
    name: 'MacBook Pro 16" M3 Max',
    description: "Apple M3 Max chip, 36GB RAM, 1TB SSD",
    discountPrice: 5000,
    images: "/arrivals/arrival_1.jpg",
    star: 5,
    stock: 15,
  },
  {
    _id: "2",
    name: "iPhone 15 Pro Max 256GB",
    description: "Titanium Blue, A17 Pro chip, 48MP camera",
    discountPrice: 300,
    images: "/arrivals/arrival_3.png",
    star: 5,
    stock: 25,
  },
  {
    _id: "3",
    name: "Samsung Galaxy S24 Ultra",
    description: "512GB, AI camera, S Pen included",
    discountPrice: 200,
    images: "/arrivals/arrival_2.jpg",
    star: 4,
    stock: 30,
  },
  {
    _id: "4",
    name: "AirPods Pro Gen 2",
    description: "Active Noise Cancellation, USB-C charging",
    discountPrice: 100,
    images: "/arrivals/arrival_4.jpg",
    star: 5,
    stock: 50,
  },
  {
    _id: "5",
    name: "Dell XPS 15",
    description: "Intel i9, RTX 4060, 32GB RAM, 1TB SSD",
    discountPrice: 300,
    images: "/arrivals/arrival_5.jpg",
    star: 4,
    stock: 12,
  },
  {
    _id: "6",
    name: "Apple Watch Series 9",
    description: "GPS + Cellular, 45mm, Midnight Aluminum",
    discountPrice: 100,
    images: "/arrivals/arrival_6.jpg",
    star: 5,
    stock: 35,
  },
];


  return (
    <div className="w-full bg-white pt-[150px] pb-[150px]">
      <div className="lg:container mx-auto">
        {/* header title */}
        <div className="text-center mb-10">
          <h3 className="text-3xl text-[#484848] font-normal capitalize mb-5">
            new arrivals
          </h3>
          <p className="text-base text-[#8a8a8a] font-poppins font-normal">
            Discover the latest tech products with cutting-edge features and
            unbeatable prices.
          </p>
        </div>

        {/* categories */}
        <div className="flex items-center justify-center gap-10 mb-10">
          { newArrivalsCategories.map((category) => (
            <button className={`text-base font-poppins font-normal capitalize cursor-pointer ${category.id === 2? 'px-6 py-2.5 bg-black rounded-sm text-white': 'text-[#8a8a8a]'}`} key={category.id}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* products grid */}
{/* products grid */}
<div className="grid grid-cols-3 gap-8">
  {products.map((product) => (
    <div
      key={product._id}
      className="bg-white shadow-lg p-5 rounded-md"
    >
      {/* Container ảnh với padding và border */}
      <div className="w-full h-[244px] mb-2.5 flex items-center justify-center bg-white border border-gray-200 rounded-md overflow-hidden p-4">
        <img
          className="w-full h-full object-contain"
          src={product.images}
          alt={product.name}
        />
      </div>
              <div>
                <div className="flex items-center justify-between gap-8">
                  <div>
                    <h4 className="text-xl text-[#484848] font-poppins font-medium capitalize mb-2">
                      {product.name}
                    </h4>
                    <p className="text-base text-[#8a8a8a] font-poppins font-normal">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(Math.ceil(product.star))].map((_, index) => (
                      <span key={index}>
                        <FaStar size={"1.5rem"} color="#fca120" />
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-5">
                  <p className="text-2xl text-[#484848] font-poppins font-medium">
                    ${product.discountPrice}
                  </p>
                  {product.stock > 0 ? (
                    <span className="text-base text-[#ff4646] font-poppins capitalize font-normal">
                      stock:{product.stock}
                    </span>
                  ) : (
                    <span className="text-base text-[#ff4646] font-poppins capitalize font-normal">
                      almost sold out
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* view more button */}
        <div className="mt-10 flex items-center justify-center">
          <button className="text-base text-white font-poppins font-normal capitalize px-8 py-2.5 bg-black rounded-md cursor-pointer">
            view more
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewArrival;
