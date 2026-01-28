import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar, FaShoppingCart, FaMinus, FaPlus } from "react-icons/fa";
import HomeNavbar from "../HomeNavbar/HomeNavbar.jsx";
import Footer from "../Footer/Footer.jsx";
import { productAPI } from "../../services/productAPI";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch product detail từ API
  useEffect(() => {
    // Scroll to top khi chuyển product
    window.scrollTo(0, 0);
    
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        // Reset states
        setProduct(null);
        setQuantity(1);
        setSelectedOption("");

        // Fetch product detail
        const response = await productAPI.getProductDetail(id);
        const productData = response.data.data;

        // Map ProductDetailDTO to component format
        const mappedProduct = {
          _id: productData.id,
          name: productData.name,
          description: productData.shortDescription || productData.name,
          fullDescription: productData.description || productData.shortDescription || "No description available",
          discountPrice: productData.specialPrice || productData.price,
          originalPrice: productData.oldPrice || productData.price,
          images: productData.thumbnailUrl || productData.images?.[0]?.url || '/placeholder.jpg',
          imageUrls: productData.images?.map(img => img.url) || [productData.thumbnailUrl].filter(Boolean),
          star: productData.averageRating || 5,
          stock: productData.stockQuantity || 0,
          category: productData.categories?.[0]?.name || "General",
          sku: productData.sku,
          slug: productData.slug,
          brandName: productData.brand?.name,
          weight: productData.weight,
          dimensions: productData.dimensions,
          // Build specifications from attributes + specification field
          specifications: {
            ...(productData.specification ? { "Specifications": productData.specification } : {}),
            ...(productData.weight ? { "Weight": `${productData.weight} kg` } : {}),
            ...(productData.dimensions ? { "Dimensions": productData.dimensions } : {}),
            ...(productData.attributes?.reduce((acc, attr) => {
              acc[attr.name] = attr.value;
              return acc;
            }, {}) || {}),
          },
          // Options from product options
          options: productData.options?.map(opt => ({
            name: opt.name,
            value: opt.id,
            values: opt.values,
          })) || [],
        };

        setProduct(mappedProduct);

        // Fetch related products
        try {
          const relatedRes = await productAPI.getRelatedProducts(id, 4);
          setRelatedProducts(relatedRes.data.data || []);
        } catch (err) {
          console.log("Related products not available");
        }

      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetail();
    }
  }, [id]);

  const handleQuantityChange = (type) => {
    if (type === "increase" && quantity < (product?.stock || 0)) {
      setQuantity(quantity + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    console.log(`Added ${quantity} x ${product.name} to cart`);
    // TODO: Integrate with cart API
  };

  // Loading state
  if (loading) {
    return (
      <>
        <HomeNavbar />
        <div className="w-full bg-white pt-[150px] pb-[100px] min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <>
        <HomeNavbar />
        <div className="w-full bg-white pt-[150px] pb-[100px] min-h-screen">
          <div className="lg:container mx-auto px-4 text-center">
            <h2 className="text-2xl text-red-600 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The product you're looking for doesn't exist."}</p>
            <Link to="/product" className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800">
              Back to Products
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HomeNavbar />

      <div className="w-full bg-white pt-[150px] pb-[100px] min-h-screen">
        <div className="lg:container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link to="/" className="text-[#8a8a8a] hover:text-black">
                  Home
                </Link>
              </li>
              <li className="text-[#8a8a8a]">/</li>
              <li>
                <Link to="/product" className="text-[#8a8a8a] hover:text-black">
                  Products
                </Link>
              </li>
              <li className="text-[#8a8a8a]">/</li>
              <li className="text-[#484848] capitalize">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="flex flex-col gap-4">
              <div className="w-full h-[500px] bg-white border border-gray-200 rounded-lg overflow-hidden p-8 flex items-center justify-center">
                <img
                  className="w-full h-full object-contain"
                  src={product.images}
                  alt={product.name}
                  onError={(e) => e.target.src = '/placeholder.jpg'}
                />
              </div>
              {/* Thumbnail images */}
              <div className="flex gap-4">
                {(product.imageUrls?.slice(0, 4) || [product.images]).map((img, i) => (
                  <div
                    key={i}
                    className="w-20 h-20 border border-gray-200 rounded-lg overflow-hidden p-2 cursor-pointer hover:border-black transition-colors"
                  >
                    <img
                      className="w-full h-full object-contain"
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      onError={(e) => e.target.src = '/placeholder.jpg'}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-6">
              {/* Title and Rating */}
              <div>
                <h1 className="text-3xl text-[#484848] font-poppins font-medium capitalize mb-3">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(Math.ceil(product.star))].map((_, index) => (
                      <FaStar key={index} size="1rem" color="#fca120" />
                    ))}
                  </div>
                  <span className="text-sm text-[#8a8a8a]">
                    ({product.star}.0) • {product.stock} in stock
                  </span>
                </div>
                {product.sku && (
                  <p className="text-sm text-[#8a8a8a] mt-2">SKU: {product.sku}</p>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl text-[#484848] font-poppins font-semibold">
                  ${product.discountPrice}
                </span>
                {product.originalPrice > product.discountPrice && (
                  <>
                    <span className="text-xl text-[#8a8a8a] line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="text-sm text-red-600 font-medium">
                      Save ${(product.originalPrice - product.discountPrice).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg text-[#484848] font-poppins font-medium mb-2">
                  Description
                </h3>
                <p className="text-base text-[#8a8a8a] font-poppins font-normal leading-relaxed">
                  {product.fullDescription}
                </p>
              </div>

              {/* Brand */}
              {product.brandName && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#8a8a8a]">Brand: </span>
                  <span className="text-sm text-[#484848] font-medium">{product.brandName}</span>
                </div>
              )}

              {/* Category */}
              {product.category && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#8a8a8a]">Category: </span>
                  <span className="text-sm text-[#484848] font-medium">{product.category}</span>
                </div>
              )}

              {/* Options (Variations) */}
              {product.options && product.options.length > 0 && (
                <div>
                  <h3 className="text-lg text-[#484848] font-poppins font-medium mb-3">
                    Options
                  </h3>
                  <div className="flex gap-3 flex-wrap">
                    {product.options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedOption(option.value)}
                        className={`px-4 py-2 border rounded-lg font-poppins text-sm capitalize transition-colors ${
                          selectedOption === option.value
                            ? "border-black bg-black text-white"
                            : "border-gray-300 text-[#484848] hover:border-gray-400"
                        }`}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div>
                <h3 className="text-lg text-[#484848] font-poppins font-medium mb-3">
                  Quantity
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange("decrease")}
                      className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <FaMinus size="0.8rem" />
                    </button>
                    <span className="px-6 py-3 text-[#484848] font-poppins font-medium min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange("increase")}
                      className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                      disabled={quantity >= product.stock}
                    >
                      <FaPlus size="0.8rem" />
                    </button>
                  </div>
                  <span className="text-sm text-[#8a8a8a]">
                    {product.stock} available
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex items-center justify-center gap-3 w-full py-4 bg-black text-white font-poppins font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaShoppingCart size="1.2rem" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              {/* Specifications */}
              {Object.keys(product.specifications).length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg text-[#484848] font-poppins font-medium mb-4">
                    Specifications
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between gap-x-9 py-2 border-b border-gray-100"
                        >
                          <span className="text-sm text-[#8a8a8a] font-poppins">
                            {key}
                          </span>
                          <span className="text-sm text-[#484848] font-poppins font-medium text-right">
                            {value}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="text-3xl text-[#484848] font-poppins font-medium mb-8">
                Related Products
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/product/${rel.id}`}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={rel.thumbnailUrl || '/placeholder.jpg'}
                      alt={rel.name}
                      className="w-full h-48 object-contain mb-4"
                      onError={(e) => e.target.src = '/placeholder.jpg'}
                    />
                    <h3 className="text-sm font-medium text-[#484848] mb-2">
                      {rel.name}
                    </h3>
                    <p className="text-lg font-semibold text-[#484848]">
                      ${rel.price}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;