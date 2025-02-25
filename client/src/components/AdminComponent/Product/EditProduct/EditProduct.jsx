import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ImageCropper from "../ImageCropper";
import AddVariant from "../AddVariant";
import { getProductEdit, productService } from "@/Api/Admin/productApi.js";
import CategoryDropdown from "../CategoryDropDown";
import BrandDropdown from "../BrandDropDown";
import { message } from "antd";
import "antd/dist/reset.css"; 
import {validateProductForm} from "@/Validators/productValidation.js"

const EditProduct = () => {
  const { id: productId } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    offer: "",
    images: [],
    variants: [],
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [cropImage, setCropImage] = useState(null);
  const [variants, setVariants] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate()

  // fetch product details on mount and when productId changes
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await getProductEdit(productId);
        console.log(response);
        
        setFormData({
        ...response.product,
        category: response.product.category._id, 
        brand: response.product.brand._id,
      });

         
        setVariants(response.product.variants || []);
    
        if (response.product.images) {
          setSelectedImages(response.product.images.map((url) => ({ url })));
        }
      } catch (error) {
        console.error("Error fetching product details", error);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  // Handle input changes for text fields.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
    
  };

  // Handle category selection.
  const handleCategorySelect = (categoryId) => {
    setFormData((prev) => ({ ...prev, category: categoryId }));
  };

  // Handle brand selection.
  const handleBrandSelect = (brandId) => {
    setFormData((prev) => ({ ...prev, brand: brandId }));
  };

  // Handle variant changes.
  const handleVariantChange = (id, data) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === id ? { ...variant, ...data } : variant
      )
    );
  };

  // Add a new variant.
  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        id: Date.now(),
        size: "",
        regularPrice: "",
        quantity: "",
      },
    ]);
  };

  // Delete a variant.
  const handleDeleteVariant = (id) => {
    setVariants(variants.filter((variant) => variant.id !== id));
  };

  // Handle image upload.
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 3) {
      message.error("Maximum 3 images allowed");
      return;
    }
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCropImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image cropping.
  const handleCropComplete = (croppedImageUrl) => {
    fetch(croppedImageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "cropped_image.jpg", { type: "image/jpeg" });
        setSelectedImages([...selectedImages, { url: croppedImageUrl, file }]);
        setCropImage(null);
      });
  };


  // Remove an image.
const removeImage = (index) => {
  setSelectedImages((prevImages) => {

    const removedImage = prevImages[index];

    const newImages = prevImages.filter((_, i) => i !== index);


    if (removedImage && !removedImage.file) {
      setFormData((prevData) => ({
        ...prevData,
        images: prevData.images.filter((url) => url !== removedImage.url),
      }));
    }
    return newImages;
  });
};

  // Handle form submission for editing product.
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateProductForm(formData);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setLoading(false);
        return;
      }
      
    setLoading(true);

    try {
     
      if (!formData.name || !formData.description || !formData.category || !formData.brand || variants.length === 0) {
        message.error("Please fill all required fields");
        return;
      }

      const newImages = selectedImages.filter((img) => img.file);

      let uploadedImages = formData.images;

      if(newImages.length>0){
        try{
            const uploadResponse = await productService.uploadImages(newImages);
            const newUploadedImages = uploadResponse.data.map((image)=>image.url);
            uploadedImages = [...formData.images,...newUploadedImages];
        }
        catch(error){
          message.error("Failed to upload images , Please try again");
          return;
        }
       
      }

      const productData = {
        ...formData,
        images: uploadedImages.length > 0 ? uploadedImages : formData.images,
        variants: variants.map(({ id, ...rest }) => rest), 
      };

      //  API call to edit the product.
      const response = await productService.editProduct(productId, productData);
      message.success(response.message);
      navigate('/admin/products')

    } catch (error) {
      console.error("Full Error Object:", error);
      setServerError(error?.message);
      message.error(error?.message || "Error updating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 md:ml-64 mt-16">
      <div className="p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-black p-6">
          <h1 className="text-2xl font-bold text-gray-950 mb-6">Edit Product</h1>
           
          {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                
              />
               {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                className="min-h-[100px]"
                
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>

            {/* Category and Brand */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CategoryDropdown 
                selectedCategory={formData.category}
                onSelectCategory={handleCategorySelect}
              />

              <BrandDropdown
                selectedBrand={formData.brand}
                onSelectBrand={handleBrandSelect}
              />
              {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
              {errors.brand && <p className="text-red-500 text-sm">{errors.brand}</p>}
              
            </div>

            {/* Offer */}
            <div className="space-y-2">
              <Label htmlFor="offer">Offer Percentage</Label>
              <Input
                id="offer"
                name="offer"
                type="number"
                value={formData.offer}
                onChange={handleInputChange}
                placeholder="Enter offer percentage"
                min="0"
                max="100"
              />
              {errors.offer && <p className="text-red-500 text-sm">{errors.offer}</p>}
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <Label>Product Images</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[0, 1, 2].map((boxIndex) => (
                    <div
                      key={boxIndex}
                      className="aspect-square relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
                    >
                      {selectedImages[boxIndex] ? (
                        <div className="relative group h-full">
                          <img
                            src={selectedImages[boxIndex].url}
                            alt={`Product ${boxIndex + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(boxIndex)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center justify-center h-full">
                          <div className="flex flex-col items-center space-y-2">
                            <Upload className="h-8 w-8 text-gray-400" />
                            <span className="text-sm text-gray-500 text-center">
                              Image {boxIndex + 1}
                              <br />
                              Click to upload
                            </span>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={selectedImages.length >= 3}
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Add Product Variant */}
            <div className="flex flex-row sm:flex-col items-start border-b pb-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-950 mb-2 sm:mb-0">Product Variants</h2>
              <button
                type="button"
                onClick={handleAddVariant}
                className="px-4 py-2 bg-blue-950 text-white rounded hover:bg-blue-900 transition"
              >
                Add Variant
              </button>
            </div>

            {/* Render Variants */}
            <div className="space-y-4">
              {variants.map((variant) => (
                <AddVariant
                  key={variant.id}
                  variant={variant}
                  onChange={(data) => handleVariantChange(variant.id, data)}
                  onDelete={() => handleDeleteVariant(variant.id)}
                />
              ))}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full md:w-auto" disabled={loading}>
              {loading ? "Updating Product..." : "Update Product"}
            </Button>
          </form>
        </div>
      </div>

      {cropImage && (
        <ImageCropper
          image={cropImage}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropImage(null)}
        />
      )}
    </div>
  );
};

export default EditProduct;
