// ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { getProductDetails } from "@/Api/User/productApi";
import { Lens } from "@/components/ui/lens";
import RelatedProduct from "../RelatedProduct";
import InfoAccordion from "../InfoAccordion";
import { message } from "antd";
import { addToCart } from "@/Api/User/cartApi";
import { Heart } from "lucide-react";
import { addToWishlist } from "@/Api/User/wishlistApi";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [hovering, setHovering] = useState(false);

  //to fetch the product
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getProductDetails(id);
        setProduct(data.product);
        if (data.product.variants && data.product.variants.length > 0) {
          const availableVariant = data.product.variants.find(
            (v) => Number(v.quantity) > 0
          );
          setSelectedVariant(availableVariant || data.product.variants[0]);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

  //function to add product to the cart
  const handleAddToCart = async() => {

     if(!selectedVariant){
      message.error("Please select a size before adding to the cart");
      return;
     }

     const payLoad = {
       productId : id,
       size : selectedVariant.size
     };

     try{
      const response = await addToCart(payLoad);
      message.success(response.message)
     }
     catch(error){
       message.error(error?.message);
       console.log(error)
     }
  }

  const nextImage = () => {
    if (product?.images?.length) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images?.length) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + product.images.length) % product.images.length
      );
    }
  };

  //function to handle add to wishlist
  const handleAddToWishlist = async(producId,size) => {
    console.log("details",producId,size);
     try{
       const response = await addToWishlist(producId,size);
       message.success(response.message);
     }
     catch(error){
       message.error(error?.message);
       console.log("Error adding wishlist",error)
     }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-red-500">Product not found.</p>
      </div>
    );
  }

   // Calculate discount percentage for selected variant if applicable
   const discountPercent =
   selectedVariant &&
   selectedVariant.salePrice < selectedVariant.regularPrice
     ? Math.round(
         ((selectedVariant.regularPrice - selectedVariant.salePrice) /
           selectedVariant.regularPrice) *
           100
       )
     : 0;


  return (
    <>
    <div className="max-w-7xl mx-auto p-4 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images Carousel Section */}
        <div className="relative">
          <div className="relative aspect-square overflow-hidden rounded-lg mb-4">

              {/* Discount Badge - Moved Inside the Image Container */}
           

                      <Lens hovering={hovering} setHovering={setHovering}>
                        <img
                          src={product.images[currentImageIndex]}
                          alt="image"
                          width={500}
                          height={500}
                          className="w-full h-full object-cover" />
                      </Lens>

            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border ${
                  currentImageIndex === idx ? "border-blue-500" : "border-transparent"
                }`}
              >
                <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-950">{product.brand?.name}</p>
          <h1 className="flex items-center text-3xl font-bold text-black bg p-2 rounded">
            {product.name}
            {selectedVariant && Number(selectedVariant.quantity) < 5 && (
              <span className="ml-4 text-red-500 text-lg animate-bounce">
                Limited Stock
              </span>
            )}
          </h1>
          {/* Dummy rating & reviews */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, idx) => (
                <span key={idx} className="text-yellow-400">★</span>
              ))}
            </div>
            <span className="text-sm text-gray-300">(100 reviews)</span>
          </div>
        </div>


          <div className="flex items-baseline gap-4">
            {selectedVariant && (
              <>
                <span className="text-2xl font-bold">
                ₹{Number(selectedVariant.salePrice).toFixed(2)}                
                </span>
                <span className="text-lg text-gray-400 line-through">
                ₹{Number(selectedVariant.regularPrice).toFixed(2)}          
                </span>
                {discountPercent > 0 && (
        <span className="text-xl font-bold animate-bounce text-green-500">
          {discountPercent}% OFF
        </span>
      )}
              </>
            )}
          </div>           

          {/* Sizes (variants) Selection */}
          <div>
            <h3 className="text-sm font-medium mb-3">Available Sizes</h3>
            <div className="grid grid-cols-3 gap-2">
              {product.variants.map((variant, idx) => (
                <button
                  key={idx}
                  onClick={() => variant.quantity > 0 && setSelectedVariant(variant)}
                  disabled={variant.quantity === 0}
                  className={`py-3 px-4 rounded-lg border text-sm ${
                    selectedVariant?.size === variant.size
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  } ${variant.quantity === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {variant.size}
                </button>
              ))}
            </div>
            {selectedVariant && (
              <div className="mt-10 text-md text-green-600 text-center ">
                Available Quantity: {selectedVariant.quantity}
              </div>
            )}
          </div>


          <div className="prose prose-sm">
            <h3 className="text-lg font-medium mb-2">Product Description</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Features</h3>
            <ul className="space-y-2">
              {product.features ? (
                product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Free Shipping</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">30 Days Return</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleAddToCart} className="w-full  bg-black text-white py-4 rounded-lg font-medium hover:bg-blue-950 transition">
              Add to Cart
            </Button>

            <Button
            onClick={() => handleAddToWishlist(product._id,selectedVariant.size)}
            className="w-full flex items-center justify-center bg-red-500 text-white py-4 rounded-lg font-medium hover:bg-red-600 transition"
          >
            <Heart className="w-5 h-5 mr-2" /> Wishlist
          </Button>
          </div>
        </div>
      </div>
    </div>
     
     <InfoAccordion/>
     {product && (
        <RelatedProduct 
            categoryId={product.category?._id} 
            currentProductId={product._id} 
        />
        )}
        </>
  );
};

export default ProductDetails;
