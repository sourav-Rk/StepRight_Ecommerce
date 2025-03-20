import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { advancedSearch } from "@/Api/User/productApi";
import { ChevronDown } from "lucide-react";
import { message } from "antd";
import SearchBar from "./SearchBar";
import FilterPanel from "./FilterPanel";
import Filter from "./Filter";

const CategoryProduct = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("Shop All");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const [totalPages, setTotalPages] = useState(1);

  const [sortBy, setSortBy] = useState("newArrivals");
  const [searchTerm, setSearchTerm] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);

  // Read parameters from URL
  useEffect(() => {
    const sortByParam = searchParams.get("sortBy") || "newArrivals";
    const pageParam = parseInt(searchParams.get("page")) || 1;
    const searchParam = searchParams.get("search") || "";
    setSortBy(sortByParam);
    setCurrentPage(pageParam);
    setSearchTerm(searchParam); 
  }, [searchParams]);

  const fetchAdvancedProducts = async () => {
    setLoading(true);
    try {
      const categoriesParam = searchParams.get("categories");
      const brandsParam = searchParams.get("brands");
      const pageParam = parseInt(searchParams.get("page")) || 1;
      const searchParam = searchParams.get("search") || "";
      const limit = productsPerPage;

      const response = await advancedSearch({
        sortBy,
        page: pageParam,
        limit,
        categoryId,
        categories: categoriesParam,
        brands: brandsParam,
        name: searchParam, 
      });

      console.log("products:",response)
      if (response.products.length > 0 && response.products[0].category) {
        setCategoryName(response.products[0].category);
      }

      setAllProducts(response.products);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.log("Failed to fetch products", error);
      message.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when params change
  useEffect(() => {
    fetchAdvancedProducts();
  }, [categoryId, searchParams]);   

  const updateQueryParams = (paramsObj) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(paramsObj).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  // Handlers
  const handleSortChange = (e) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    updateQueryParams({ sortBy: newSortBy, page: 1 });
  };

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    updateQueryParams({ search: newSearchTerm, page: 1 });
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    updateQueryParams({ page: pageNumber });
  };

  // Filter Panel Apply Handler
  const handleApplyFilters = (filters) => {
    const params = {
      categories: filters.categories?.join(",") || "",
      brands: filters.brands?.join(",") || "",
      sortBy: filters.sortBy,
    };
    updateQueryParams(params);
    setShowFilter(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 font-serif">
        {categoryId ? categoryName : "Shop All"}
      </h1>

      <SearchBar
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
      />

      <button
        onClick={() => setShowFilter(true)}
        className="px-4 mb-2 py-2 bg-black text-white rounded-md"
      >
        Open Filters
      </button>
       
       {!categoryId ?(
        <FilterPanel
        isOpen={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={handleApplyFilters}
      />
       ):(
        <Filter
          isOpen={showFilter}
          onClose={()=> setShowFilter(false)}
          onApply={handleApplyFilters}
        />
       )}
      

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="text-gray-600">Loading...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product-detail/${product._id}`)}
                className="cursor-pointer"
              >
                <ProductCard
                  id={product._id}
                  name={product.name}
                  rating={product?.averageRating || 0}
                  reviewCount={product?.reviewCount}
                  regularPrice={product.variants[0].regularPrice}
                  salePrice={product.variants[0].salePrice}
                  imageUrl={product.images[0]}
                  variants={product.variants}
                />
              </div>
            ))}
          </div>

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