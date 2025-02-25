import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; 
import { Pencil, CheckCircle, XCircle } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";
import ConfirmSwitch from "../Modal/ConfirmSwitch";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCategory } from "@/Context/CategoryContext";
import { getCategory } from "@/Api/Admin/categoryApi";
import { message } from "antd";
import "antd/dist/reset.css"; // Ensures styles are applied

const CategoryTable = () => {
  // state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; 

  // Local state for the offer and edit modals
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [offer, setOffer] = useState("");
  const [selectedEditCategory, setSelectedEditCategory] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", description: "" });

  // functions and categories from context
  const { blockOrUnblockCategory, offerAdd, categoryEdit, setCategories } = useCategory();
  const { categories } = useCategory();

  // Fetch paginated categories every time the current page changes.
  useEffect(() => {
    const fetchPaginatedCategories = async () => {
      try {
        const response = await getCategory(currentPage, limit);
        setCategories(response.categories);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.log("Error fetching paginated categories", error);
        message.error("Failed to fetch categories");
      }
    };
    fetchPaginatedCategories();
  }, [currentPage, limit, setCategories]);

  // For the offer modal
  const openOfferModal = (index) => {
    setSelectedCategory(categories[index]);
  };

  const handleOfferSubmit = async (categoryId, offerValue) => {
    if (offerValue.trim() === "" || isNaN(offerValue) || Number(offerValue) < 0) {
      message.error("Enter a valid offer percentage");
      return;
    }
    await offerAdd(categoryId, offerValue);
    setSelectedCategory(null);
    setOffer("");
  };

  // For the edit modal
  const openEditModal = (category) => {
    setSelectedEditCategory(category);
    setEditFormData({ name: category.name, description: category.description });
  };

  const handleEditSubmit = async (categoryId) => {
    if (!editFormData.name || !editFormData.description) {
      message.error("All fields are required");
      return;
    }
    await categoryEdit(categoryId, editFormData);
    setSelectedEditCategory(null);
    setEditFormData({ name: "", description: "" });
  };

  return (
    <Card className="shadow-xl bg-white rounded-2xl p-6 w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Category List</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop view */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border">Sl No</th>
                <th className="p-3 border">Category Name</th>
                <th className="p-3 border">Description</th>
                <th className="p-3 border">Offer (%)</th>
                <th className="p-3 border">Add Offer</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr key={category._id} className="border text-center">
                  <td className="p-3 border">{(currentPage - 1) * limit + index + 1}</td>
                  <td className="p-3 border">{category.name}</td>
                  <td className="p-3 border truncate max-w-xs">{category.description}</td>
                  <td className="p-3 border">{category.offer}%</td>
                  <td className="p-3 border">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button onClick={() => openOfferModal(index)} className="text-red-500 hover:text-rose-700">
                          Add Offer
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Enter Offer Percentage</DialogTitle>
                          <DialogDescription>
                            Enter a valid offer for <strong>{selectedCategory?.name}</strong>
                          </DialogDescription>
                        </DialogHeader>
                        <Input
                          type="number"
                          value={offer}
                          onChange={(e) => setOffer(e.target.value)}
                          placeholder="Enter offer"
                        />
                        <Button
                          onClick={() => handleOfferSubmit(selectedCategory._id, offer)}
                          className="mt-4"
                        >
                          Save
                        </Button>
                      </DialogContent>
                    </Dialog>
                  </td>
                  <td className="p-3 border">
                    {category.isActive ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                    )}
                  </td>
                  <td className="p-3 border">
                    <div className="flex justify-center items-center space-x-2">
                      <Dialog open={!!selectedEditCategory} onOpenChange={(open) => !open && setSelectedEditCategory(null)}>
                        <DialogTrigger asChild>
                          <button onClick={() => openEditModal(category)} className="p-1 bg-green-100 rounded-full" aria-label="Edit">
                            <Pencil className="w-5 h-5 text-green-500" />
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                            <DialogDescription>
                              Update the category details.
                            </DialogDescription>
                          </DialogHeader>
                          <Input
                            type="text"
                            value={editFormData.name}
                            onChange={(e) =>
                              setEditFormData({ ...editFormData, name: e.target.value })
                            }
                            placeholder="Category Name"
                          />
                          <Textarea
                            value={editFormData.description}
                            onChange={(e) =>
                              setEditFormData({ ...editFormData, description: e.target.value })
                            }
                            placeholder="Category Description"
                            className="mt-2"
                          />
                          <Button onClick={() => handleEditSubmit(selectedEditCategory._id)} className="mt-4">
                            Save
                          </Button>
                        </DialogContent>
                      </Dialog>
                      <ConfirmSwitch
                      checked={category.isActive}
                      name={category.name}
                      onToggle={() => blockOrUnblockCategory(category._id)}
                    />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination controls */}
          <div className="flex justify-between items-center mt-4">
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
      </CardContent>
    </Card>
  );
};

export default CategoryTable;
