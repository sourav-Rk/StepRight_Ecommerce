import { Edit2, Search, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { blockProduct, getProducts } from "@/Api/Admin/productApi"; // Make sure to implement toggleProductStatusAPI
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ConfirmSwitch from "../Modal/ConfirmSwitch";
import { message } from "antd";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 5;
  const navigate = useNavigate();

  // Fetch products from backend when currentPage or productsPerPage changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getProducts(currentPage, productsPerPage);
        setProducts(response.products);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.log("Error fetching products", error);
        message.error("Failed to fetch products");
      }
      setLoading(false);
    };
    fetchProducts();
  }, [currentPage, productsPerPage]);

  // Toggle product active status
  const toggleProductStatus = async (productId) => {
    try {
      
      await blockProduct(productId);
      setProducts((prev) =>
        prev.map((product) =>
          product._id === productId ? { ...product, isActive: !product.isActive } : product
        )
      );
    } catch (error) {
      message.error("Error updating product status");
      console.error("Error updating product status", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 md:ml-64 mt-20 p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-auto">
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-10 pr-4 py-2"
          />
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
        <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/admin/add/products')}>
          Add New Product
        </Button>
      </div>

      {/* Table / Grid Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="min-w-full">
          {/* Desktop Header */}
          <div className="hidden md:grid md:grid-cols-10 gap-6 p-4 bg-gray-50 border-b">
            <div className="font-semibold text-center">Sl No</div>
            <div className="font-semibold text-center">Image</div>
            <div className="font-semibold text-center">Item Name</div>
            <div className="font-semibold text-center">Category</div>
            <div className="font-semibold text-center">Brand</div>
            <div className="font-semibold text-center">Price & Sizes</div>
            <div className="font-semibold text-center">Total Stock</div>
            <div className="font-semibold text-center">Offer</div>
            <div className="font-semibold text-center">Status</div>
            <div className="font-semibold text-center">Actions</div>
          </div>

          {/* Products List */}
          {products.map((product, index) => (
            <div
              key={product._id}
              className="grid grid-cols-1 md:grid-cols-10 gap-6 p-4 border-b hover:bg-gray-50 transition-colors items-center"
            >
              {/* Sl No */}
              <div className="text-center md:block">
                {(currentPage - 1) * productsPerPage + index + 1}
              </div>
              {/* Image */}
              <div className="flex justify-center items-center">
                <img
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  width={60}
                  height={60}
                  className="rounded-lg object-cover"
                />
              </div>
              {/* Name */}
              <div className="font-medium text-center">{product.name}</div>
              {/* Category */}
              <div className="text-gray-600 text-center">
                {product.category?.name || "No Category"}
              </div>
              {/* Brand */}
              <div className="text-gray-600 text-center">
                {product.brand?.name || "No Brand"}
              </div>
              {/* Price & Sizes Accordion */}
              <div className="text-center">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="prices">
                    <AccordionTrigger className="hover:no-underline">
                      <span className="text-sm font-medium">View Prices</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {product.variants.map((variant, idx) => (
                          <div key={variant.id || idx} className="flex justify-between text-sm">
                            <span>{variant.size}:</span>
                            <span>₹{Number(variant.regularPrice).toFixed(2)}</span>
                            
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              {/* Total Stock */}
              <div className="text-center">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="stock">
                    <AccordionTrigger className="hover:no-underline">
                      <span className="text-sm font-semibold">{product.totalStock}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {product.variants.map((variant, idx) => (
                          <div key={variant.id || idx} className="flex justify-between text-sm">
                            <span>{variant.size}:</span>
                            <span>{variant.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              {/* Offer */}
              <div className="text-blue-600 font-medium text-center">{product.offer}%</div>
              {/* Status */}
              <div className="text-center">
                {product.isActive ? (
                  <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                )}
              </div>
              {/* Actions */}
              <div className="flex justify-center items-center space-x-4">
                <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => navigate(`/admin/edit-product/${product._id}`)}>
                  <Edit2 className="h-5 w-5" />
                  <span className="sr-only">Edit</span>
                </Button>
                <div className="flex items-center">
                <ConfirmSwitch
                  checked={product.isActive}
                  name={product.name}
                  onToggle={() => toggleProductStatus(product._id)}
                />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-8">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          <ChevronLeft className="h-6 w-6" />
          Prev
        </Button>
        <span className="text-gray-600 font-semibold text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default ProductList;
