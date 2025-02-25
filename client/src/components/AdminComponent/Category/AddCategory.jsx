import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCategory } from "@/Context/CategoryContext.jsx";
import CategoryTable from "./CategoryTable";

const AddCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const [errors, setErrors] = useState({}); 

  const {loading, addNewCategory} = useCategory()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

      setErrors((prevErrors) => ({
        ...prevErrors,
        [e.target.name]: "",
      }));
  
  };


    // Validate form fields
  const validateForm = () => {
    
    let validationErrors = {};
    if (!formData.name.trim()) {
      validationErrors.name = "Category name is required";
    }
    else if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
      validationErrors.name = "Category name must contain only letters";
    }

    if (!formData.description.trim()) {
      validationErrors.description = "Description is required";
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    await addNewCategory(formData)
    setFormData({ name: "", description: "" });
   
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 p-6 ml-56">
      <div className="w-full max-w-4xl mx-auto"> {/* Shifted to right */}
        <Card className="shadow-xl bg-white rounded-2xl p-6 mb-6">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Add Category</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Category Name</label>
                <Input name="name" placeholder="Enter category name" value={formData.name} onChange={handleChange} />

                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}

              </div>
              <div>
                <label className="block font-semibold mb-2">Description</label>
                <Textarea name="description" placeholder="Enter category description" value={formData.description} onChange={handleChange}  />

                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}

              </div>
              <Button type="submit" className="w-full text-lg py-3" disabled={loading}>
                {loading ? "Adding..." : "Add Category"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <CategoryTable/>
      </div>
    </div>
  );
};

export default AddCategory;
