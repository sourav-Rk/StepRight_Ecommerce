import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { message } from "antd";
import "antd/dist/reset.css"; 
import { addBrand } from "@/Api/Admin/brandApi.js";

const BrandAdd = () => {

  const [brandName, setBrandName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

      // Validate form fields
      const validateForm = () => {
    
        let validationErrors = {};
        if (!brandName.trim()) {
          validationErrors.name = "brand name is required";
        }
        else if (!/^[A-Za-z\s]+$/.test(brandName.trim())) {
          validationErrors.name = "brand name must contain only letters";
        }
  
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
      };

  const handleSubmit = async(e) => {

    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try{
        const response = await addBrand(brandName);
        message.success(response.message)
        setBrandName("")
    }
    catch(error){
        console.log(error)
        setServerError(error?.message);
        message.error(error.message)
    }
    finally{
        setLoading(false)
    }
  };

  return (
    <div className="flex justify-center ml-60 mt-8">
      <Card className="shadow-xl bg-white rounded-2xl p-6 mb-6 w-full max-w-2xl"> {/* Adjust width as needed */}
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Add Brand</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <Input
              type="text"
              name="name"
              placeholder="Enter brand name"
              value={brandName}
              onChange={(e) => {
                setBrandName(e.target.value);
                if (errors.name) {
                  setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
                }
              }}
              
            />
            {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
              {serverError && (
                  <p className="text-red-500 text-sm mt-1">{serverError}</p>
              )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Adding..." : "Add Brand"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandAdd;