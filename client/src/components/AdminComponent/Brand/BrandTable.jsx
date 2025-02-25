import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, CheckCircle, XCircle } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { blockBrand, getBrand } from "@/Api/Admin/brandApi";
import EditModal from "./Modal/EditModal";
import ConfirmSwitch from "../Modal/ConfirmSwitch";
import { message } from "antd";
import "antd/dist/reset.css"; 

const BrandTable = () => {
  const [brands, setBrands] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [brandToEdit, setBrandToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [brandsPerPage, setBrandsPerPage] = useState(4); 
  const [totalPages, setTotalPages] = useState(1);
  const limit = 4

 
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getBrand(currentPage, brandsPerPage);
        setBrands(data.brands);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.log("Error fetching brands:", error);
        message.error("Failed to fetch brands");
      }
    };
    fetchBrands();
  }, [currentPage, brandsPerPage]);

  const toggleBrandStatus = async(id) => {
    try{
        const response = await blockBrand(id);
        setBrands(brands.map((b) => (b._id === id ? { ...b, isActive: !b.isActive } : b)));      
    }
    catch(error){
       console.log("error in updating the status",error);
       message.error(error.message)
    }

  };

  const openEditModal = (brand) => {
    setBrandToEdit(brand);
    setEditModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <Card className="shadow-xl bg-white rounded-2xl p-6 max-w-screen-md ml-[508px]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Brand List</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full border-collapse text-sm">
          <thead>
              <tr className="bg-gray-100">
              <th className="p-3 border">Sl No</th>
              <th className="p-3 border">Brand Name</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
              </tr>
          </thead>
          <tbody>
            {brands.map((brand, index) => (
              <tr key={brand._id} className="border text-center">
                <td className="p-3 border">{(currentPage - 1) * limit + index + 1}</td>
                <td className="p-3 border">{brand.name}</td>
                <td className="p-3 border">
                  {brand.isActive ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                  )}
                </td>
                <td className="p-3 border">
                  <div className="flex justify-center items-center space-x-2">
                    <button onClick={() => openEditModal(brand)} className="p-1 bg-green-100 rounded-full" aria-label="Edit">
                      <Pencil className="w-5 h-5 text-green-700" />
                    </button>
                    <ConfirmSwitch
                      checked={brand.isActive}
                      name={brand.name}
                      onToggle={() => toggleBrandStatus(brand._id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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
              onClick={() => setCurrentPage((prev) => prev +1)}
            >
              Next
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
      </CardContent>

      {editModalOpen && brandToEdit && (
        <EditModal
          brand={brandToEdit}
          onClose={() => setEditModalOpen(false)}
          onSave={(updatedBrand) =>
          setBrands(brands.map((b) => (b.id === updatedBrand.id ? updatedBrand : b)))
          }
        />
      )}

    </Card>
  );
};

export default BrandTable;

