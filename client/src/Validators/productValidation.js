export const validateProductForm = (formData) => {
    let errors = {};
  
    // Validate Name
    if (!formData.name.trim()) {
      errors.name = "Product name is required";
    }
  
    // Validate Description
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }
  
    // Validate Category
    if (!formData.category.trim()) {
      errors.category = "Category is required";
    }
  
    // Validate Brand
    if (!formData.brand.trim()) {
      errors.brand = "Brand is required";
    }
  
    // Validate Offer (must be a positive number)
    if (formData.offer ==="" || formData.offer === null) {
      errors.offer = "Offer is required";
    } else if (isNaN(formData.offer)) {
      errors.offer = "Offer must be a number";
    } 
  
    return errors;
  };
  


  export const validateVariant = (variant) => {
    let errors = {};
  
    if (!variant.size) {
      errors.size = "Size is required";
    }
  
    if (!variant.regularPrice) {
      errors.regularPrice = "Regular price is required";
    } else if (variant.regularPrice < 0) {
      errors.regularPrice = "Regular price cannot be negative";
    }
  
    if (!variant.quantity) {
      errors.quantity = "Quantity is required";
    } else if (variant.quantity < 0) {
      errors.quantity = "Quantity cannot be negative";
    }
  
    return errors;
  };
  