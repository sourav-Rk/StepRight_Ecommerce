import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { addToWishlist, getWishlist, removeFromWishlist } from '@/Api/User/wishlistApi';
import { message } from 'antd';

const ProductCard = ({ 
  id,
  name,
  rating,
  reviewCount,
  regularPrice,
  salePrice ,
  imageUrl,
  variants
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  //to check the product is out of stock or not
  const isOutOfStock = variants && variants.length > 0 ? variants.every((v) => Number(v.quantity) ===0 ) : false;
  
  //to check the product is limited stock or not
  const isLimitedStock = variants && variants.length > 0 
  ? variants.every((v) => Number(v.quantity) < 5 && Number(v.quantity) > 0)
  : false;

    // Check wishlist status on component mount
    useEffect(() => {
      const checkWishlistStatus = async () => {
        try {
          const response = await getWishlist();
          const wishlistItems = response?.wishlist?.products || [];
          
          const isProductInWishlist = wishlistItems.some(item => 
            item?.productId?._id === id &&  
            item?.size === (variants[0]?.size || '')
          );
          
          setIsLiked(isProductInWishlist);
        } catch (error) {
          console.error("Error fetching wishlist:", error);
          setIsLiked(false);
        }
      };
    
      checkWishlistStatus();
    }, [id, variants]);

  const handleWishlistToggle = async () => {
    try {
      if (!isLiked) {
        const response = await addToWishlist(id, variants[0].size);
        message.success(response.message);
        setIsLiked(true); 
      } else {
        const response = await removeFromWishlist(id, variants[0].size);
        message.success(response.message);
        setIsLiked(false);
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      message.error(error?.message || "Something went wrong!");
    }
  };

  // Generate stars based on rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="text-yellow-400">★</span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="text-yellow-400">⭐</span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300">★</span>
        );
      }
    }
    return stars;
  };

  const discountPercent = 
  regularPrice && salePrice && salePrice < regularPrice 
    ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
    : 0;

  return (
    <Card 
      className="relative w-96 rounded-sm overflow-hidden transform transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Wishlist Button */}
      <button
        onClick={(event) => {
          event.stopPropagation(); 
          setIsLiked(!isLiked);
          handleWishlistToggle(event)
        }}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-transform hover:scale-110"
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
          }`}
        />
      </button>

         {/* Discount Badge - only show if discountPercent > 0 */}
         {discountPercent > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-3 py-1 text-sm font-bold rounded-full shadow-lg animate-bounce">
          {discountPercent}% OFF
        </div>
      )}

      {/* Product Image */}
      <div className="relative overflow-hidden h-80">
        <img
          src={imageUrl}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-serif text-2xl font-bold">Out of Stock</span>
          </div>
        )}

         {/* Limited Stock Badge */}
         {!isOutOfStock && isLimitedStock && (
          <div className="absolute top-0 left-0 bg-red-500 text-white px-3 py-1 text-xs font-bold rounded-br-lg shadow-md animate-pulse">
            Limited Stock
          </div>
        )}
        
      </div>

      {/* Product Details */}
      <div className="p-4 bg-white">
        <h3 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-2">
          {name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex mr-2">
            {renderStars()}
          </div>
          <span className="text-sm text-gray-600">({reviewCount})</span>
        </div>
  
        {/* Price */}
        <div className="flex items-center gap-2">

          <span className="text-xl font-bold text-gray-900">
          ₹{salePrice} 
          </span>
   
          <span className="text-gray-950 line-through text-sm">
            ₹{regularPrice}
          </span>
  
       
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;