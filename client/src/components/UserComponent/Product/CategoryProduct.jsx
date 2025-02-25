import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { useNavigate, useParams  } from "react-router-dom";
import { getProducts, getProductsByCategory } from "@/Api/User/productApi";
//import { getHighTop, getProducts, getProductsByCategory, getRunningShoe, getSneaker } from "@/Api/User/productApi";

const CategoryProduct = () => {
  const {categoryId} = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState(name || "Shop All");


  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 6;
  const navigate = useNavigate();
  

  // Function to fetch products based on category id
  const fetchProducts = async () => {
    setLoading(true);
    try {

      const response = await getProductsByCategory(categoryId, currentPage, productsPerPage);
      console.log(response)
      setCategoryName(response.products[0].category.name)
      setProducts(response.products);
      setTotalPages(response.totalPages);

    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  //function to fetch all products
  const fetchAllProducts = async() =>{
    setLoading(true);
    try{
      const response = await getProducts(currentPage, productsPerPage);
      setProducts(response.products);
      setTotalPages(response.totalPages);
    }
    catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (categoryId) {
      fetchProducts();
    }
    else{
      fetchAllProducts();
    }
  }, [categoryId, currentPage]);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">{categoryName}</h1>

      {/* Filters and Sorting */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-gray-200 rounded-md">Filter</button>
          <select className="px-4 py-2 bg-gray-200 rounded-md">
            <option>Sort by: Best selling</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
        <span className="text-gray-600">{products.length} products</span>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="text-gray-600">Loading...</span>
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product-detail/${product._id}`)}
                className="cursor-pointer"
              >
                <ProductCard
                  name={product.name}
                  rating={4.5}
                  regularPrice={product.variants[0].regularPrice}
                  salePrice={product.variants[0].regularPrice + 500}
                  imageUrl={product.images[0]}
                  variants={product.variants}
                />
              </div>
            ))}
          </div>


          {/* Pagination */}
          <div className="flex justify-center mt-8">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-4 py-2 rounded-md ${
                  currentPage === i + 1 ? "bg-black text-white" : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryProduct;