import React from 'react';
import { Star, Heart } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ProductGrid = () => {
  const products = [
    {
      id: 1,
      name: "Nike Air Max 270",
      image: "/api/placeholder/300/300",
      regularPrice: 199.99,
      salePrice: 149.99,
      rating: 4.5,
      reviews: 128,
    },
    {
      id: 2,
      name: "Adidas Ultra Boost",
      image: "/api/placeholder/300/300",
      regularPrice: 189.99,
      salePrice: 159.99,
      rating: 4.8,
      reviews: 256,
    },
    {
      id: 3,
      name: "Jordan Retro 4",
      image: "/api/placeholder/300/300",
      regularPrice: 229.99,
      salePrice: 189.99,
      rating: 4.7,
      reviews: 164,
    },
    {
      id: 4,
      name: "Puma RS-X",
      image: "/api/placeholder/300/300",
      regularPrice: 159.99,
      salePrice: 129.99,
      rating: 4.3,
      reviews: 98,
    },
    {
      id: 5,
      name: "New Balance 990",
      image: "/api/placeholder/300/300",
      regularPrice: 179.99,
      salePrice: 149.99,
      rating: 4.6,
      reviews: 145,
    },
    {
      id: 6,
      name: "Reebok Classic",
      image: "/api/placeholder/300/300",
      regularPrice: 149.99,
      salePrice: 119.99,
      rating: 4.4,
      reviews: 112,
    }
  ];

  const calculateDiscount = (regular, sale) => {
    return Math.round(((regular - sale) / regular) * 100);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-300 fill-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="w-screen max-w-full bg-gray-50 py-16 px-4 md:px-10">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Best Selling Sneakers
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden shadow-lg rounded-lg">
              <CardContent className="p-0">
                {/* Product Image Container */}
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-105"
                  />
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                    -{calculateDiscount(product.regularPrice, product.salePrice)}%
                  </Badge>
                  <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg transition-transform duration-300 hover:scale-110">
                    <Heart size={20} className="text-gray-600" />
                  </button>
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  
                  {/* Pricing */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-bold text-red-600">
                      ${product.salePrice}
                    </span>
                    <span className="text-gray-500 line-through">
                      ${product.regularPrice}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(product.rating)}</div>
                    <span className="text-sm text-gray-600">({product.reviews})</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
