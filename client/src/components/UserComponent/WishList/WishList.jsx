import { useState, useEffect } from "react";
import { getWishlist, removeFromWishlist } from "@/Api/User/wishlistApi";
import { message } from "antd";
import { ShoppingCart, Trash2, Heart, AlertCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { addToCart } from "@/Api/User/cartApi";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setIsLoading(true);
        const response = await getWishlist();
        console.log(response);
        setWishlist(response.wishlist.products || []);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, []);

   //function to add product to the cart
   const handleAddToCart = async(productId,size) => {
    
      const payLoad = {
        productId : productId,
        size : size
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
 

  const handleRemoveFromWishlist = async (productId, size) => {
    try {
      const response = await removeFromWishlist(productId,size);
      message.success(response.message);
    } catch (error) {
      message.error(error?.message);
      console.error("Error removing from wishlist:", error);
    }
  };

  // Helper function to check if the selected size has quantity > 0
  const isSizeInStock = (product, size) => {
    if (!product || !product.variants) return false;
    
    const selectedVariant = product.variants.find(variant => variant.size === size);
    return selectedVariant && selectedVariant.quantity > 0;
  };

  //  function to get available quantity
  const getAvailableQuantity = (product, size) => {
    if (!product || !product.variants) return 0;
    
    const selectedVariant = product.variants.find(variant => variant.size === size);
    return selectedVariant ? selectedVariant.quantity : 0;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex flex-col items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-gradient-to-b min-h-screen">
      {/* Header Section */}
      <div className="mb-8 border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Heart className="w-6 h-6 text-rose-500 mr-3" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Wishlist</h1>
          </div>
          <span className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
          </span>
        </div>
        <p className="mt-2 text-gray-500">Items you've saved for later</p>
      </div>

      {/* Empty State */}
      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 flex items-center justify-center bg-rose-50 rounded-full mb-4">
            <Heart className="w-10 h-10 text-rose-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 max-w-md mb-6">Explore our collection and heart your favorite items</p>
          <button onClick={() => navigate("/shop-all")} className="bg-gray-800 hover:bg-gray-900 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 flex items-center">
            Browse Products <ChevronRight className="ml-2 w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {wishlist.map((item) => {
            // Check if this size is in stock
            const inStock = isSizeInStock(item.productId, item.size);
            const availableQty = getAvailableQuantity(item.productId, item.size);
            
            return (
              <div 
                key={item.productId._id + item.size} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Product Image */}
                  <div className="md:w-48 h-48 relative overflow-hidden flex-shrink-0">
                    <img
                      src={item.productId.images[0] || "/api/placeholder/400/400"}
                      alt={item.productId.name}
                      className="w-full h-full object-cover"
                    />
                    {item.productId.offer > 0 && (
                      <div className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded">
                        SALE
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info & Actions */}
                  <div className="flex-grow p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.productId.name}</h3>
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <span className="mr-4">Size: <span className="font-medium text-gray-700">{item.size}</span></span>
                            {inStock ? (
                              <span className="text-green-600 flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                In Stock ({availableQty})
                              </span>
                            ) : (
                              <span className="text-red-500 flex items-center">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Out of Stock
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">                        
                            <div>
                             
                            </div>                                               
                        </div>
                      </div>
                      
                      <p className="text-xl font-bold text-gray-900">
                              ₹{(item.productId.variants?.find(v => v.size === item.size)?.regularPrice || 0) }
                              </p>                           
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-2">
                      <button
                        onClick={() => handleAddToCart(item.productId._id, item.size)}
                        className={`flex-1 flex items-center justify-center gap-2 ${
                          inStock 
                            ? "bg-gray-800 hover:bg-gray-900" 
                            : "bg-gray-300 cursor-not-allowed"
                        } text-white px-6 py-3 rounded-lg transition-colors duration-200`}
                        disabled={!inStock}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>{inStock ? "Add to Cart" : "Out of Stock"}</span>
                      </button>
                      <button
                        onClick={() => handleRemoveFromWishlist(item.productId._id, item.size)}
                        className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Bottom Nav */}
      {wishlist.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
          <button onClick={() => navigate("/cart")} className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center transition-colors">
            <ShoppingCart className="w-4 h-4 mr-2" />
            View Cart
          </button>
          <button onClick={() => navigate("/shop-all")} className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center transition-colors">
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;