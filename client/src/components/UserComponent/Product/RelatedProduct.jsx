// RelatedProduct.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../Product/ProductCard";
import { getRelatedProducts } from "@/Api/User/productApi";

const RelatedProduct = ({ categoryId, currentProductId }) => {

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await getRelatedProducts(categoryId, currentProductId);
        setRelatedProducts(response.products);
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchRelated();
    }
  }, [categoryId, currentProductId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p>Loading related products...</p>
      </div>
    );
  }

  if (!relatedProducts.length) {
    return (
      <div className="py-8 text-center">
        <p>No related products found.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white px-4 py-8 md:px-6 lg:px-8">
      {/* Heading */}
      <h2 className="text-3xl text-left ml-14 md:text-4xl font-bold text-black mb-16 mt-12">
        YOU MAY ALSO LIKE
      </h2>

      {/* Product Grid */}
      <div className="grid lg:grid-cols-3  gap-x-10 gap-y-20 ml-14">
        {relatedProducts.slice(0, 3).map((product, index) => (
          <div key={index}
          onClick={() => navigate(`/product-detail/${product._id}`)}
          >
          <ProductCard
              name={product.name}
              regularPrice={product.variants[0].regularPrice} 
              salePrice={product.variants[0].regularPrice+500}
              rating={4.5} 
              imageUrl={product.images[0]} 
              variants={product.variants}
            />
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default RelatedProduct;
