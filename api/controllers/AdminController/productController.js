import ProductDB from "../../Models/productSchema.js";
import CategoryDB from "../../Models/categorySchema.js";
import BrandDB from "../../Models/brandSchema.js";
import mongoose from "mongoose";

//to fetch the products
export const getProducts = async(req,res) =>{
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const totalProducts = await ProductDB.countDocuments();
        const products = await ProductDB.find().sort({ createdAt: -1 })
             .populate('category' , 'name')
             .populate('brand' , 'name')
             .skip(skip)
             .limit(limit);

        // Map through products and add totalStock field
        const productsWithStock = products.map(product => {
            const productObj = product.toObject(); // Convert document to plain object
            productObj.totalStock = productObj.variants.reduce((acc, variant) => acc + variant.quantity, 0);
            return productObj;
        });


        return res.status(200).json({
            message :"products fetched successfully",
            products : productsWithStock,
            totalProducts,
            totalPages : Math.ceil(totalProducts / limit),
            currentPage : page,
            });

    }
    catch(error){
        return res.status(500).json({message :"Something went wrong! please try again later"});
    }
}

//get a particular product
export const getProductEdit = async(req, res) =>{
    try{
        const {id} = req.params;
        const product = await ProductDB.findById(id)
            .populate("category", "name")
            .populate("brand", "name");
        
        if(!product){
            return res.status(404).json({message : "Product not found"})
        }

        return res.status(200).json({message : "product fetch successfully",product});

    }
    catch(error){
        console.error("Error fetching the product",error);
        return res.status(500).json({message : "internal server error"});
    }
}

//To add the product
export const addProduct = async(req, res) =>{
    try{
    
        const {name, description, category, brand, offer, images, variants} = req.body;
         
        //validate the requred fields
        if(!name || !description || !category || !brand || !variants || !Array.isArray(variants) || variants.length === 0 || !images || !Array.isArray(images)){
            return res.status(400).json({ message : "Missing required fields"});
        }
         
        //check if a product with the same name,category,and brand exists
        const existingProduct = await ProductDB.findOne({
            name : { $regex: new RegExp(`^${name.trim()}$`,"i")},
            category,
            brand,
        });
        if(existingProduct){
            return res.status(400).json({message : "Product already exists"});
        }

         // validate category and brand
         const isValidCategory = await mongoose.model('Category').findById(category);
         if (!isValidCategory) {
             return res.status(400).json({ message: "Invalid category" });
         }
 
         const isValidBrand = await mongoose.model('Brand').findById(brand);
         if (!isValidBrand) {
             return res.status(400).json({ message: "Invalid brand" });
         }
         
         //validate offer
         if (offer && (typeof offer !== 'number' || offer < 0)) {
             return res.status(400).json({ message: "Offer must be a non-negative number" });
         }
        
        //validate variants
        const sizeSet = new Set();
        for(let i = 0; i < variants.length; i++){
            const variant = variants[i];

            if(!variant.size || variant.regularPrice == "" || variant.quantity === ""){
                return res.status(400).json({message : `variant ${i+1} is missing required fields`})
            };

            const sizeKey = variant.size.toString().toLowerCase();
            if(sizeSet.has(sizeKey)){
                return res.status(400).json({message : `Duplicate variant size : ${variant.size}`});
            }
            sizeSet.add(sizeKey);

            //validate numeric values
            if(Number(variant.regularPrice) < 0){
                return res.status(400).json({message : `Regular price for variant ${variant.size} cannot be negative`});
            }
            if(Number(variant.quantity) < 0){
                return res.status(400).json({message : `Quantity for variant ${variant.size} cannot be negative`});
            }
        }

        const newProduct = new ProductDB({
            name,
            description,
            category,
            brand,
            offer : offer || 0,
            images : images || [],
            variants,
        });

        const savedProduct = await newProduct.save();

        return res.status(201).json({
            message : "Product added successfully",
            product : savedProduct,
        });
    }
    catch(error){
        console.error("Error adding product",error);
        return res.status(500).json({message : "Internal server error", error : error.message});
    }
}

//edit the product
export const editProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, category, brand, offer, images, variants } = req.body;
      
      // Validate required fields
      if (!name || !description || !category || !brand || !variants || !Array.isArray(variants) || variants.length === 0 || !images || !Array.isArray(images)) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      // Validate category and brand
      const isValidCategory = await mongoose.model('Category').findById(category);
      if (!isValidCategory) {
        return res.status(400).json({ message: "Invalid category" });
      }
  
      const isValidBrand = await mongoose.model('Brand').findById(brand);
      if (!isValidBrand) {
        return res.status(400).json({ message: "Invalid brand" });
      }
      
      // Validate offer (convert to number)
      const numericOffer = Number(offer);
      if (offer !== undefined && (isNaN(numericOffer) || numericOffer < 0)) {
        return res.status(400).json({ message: "Offer must be a non-negative number" });
      }
  
      // Validate variants
      const sizeSet = new Set();
      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i];
  
        if (!variant.size || variant.regularPrice == null || variant.quantity == null) {
          return res.status(400).json({ message: `Variant ${i + 1} is missing required fields` });
        }
  
        const sizeKey = variant.size.toString().toLowerCase();
        if (sizeSet.has(sizeKey)) {
          return res.status(400).json({ message: `Duplicate variant size: ${variant.size}` });
        }
        sizeSet.add(sizeKey);
  
        // Validate numeric values
        if (Number(variant.regularPrice) < 0) {
          return res.status(400).json({ message: `Regular price for variant ${variant.size} cannot be negative` });
        }
        if (Number(variant.quantity) < 0) {
          return res.status(400).json({ message: `Quantity for variant ${variant.size} cannot be negative` });
        }
      }
  
      // Check for duplicate product
      const duplicateProduct = await ProductDB.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
        category,
        brand,
      });
      if (duplicateProduct) {
        return res.status(400).json({ message: "Product already exists" });
      }
  
      // Instead of using findByIdAndUpdate, retrieve the product document,
      // update its fields, then call save() so that the pre-save hook runs.
      const product = await ProductDB.findById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      product.name = name;
      product.description = description;
      product.category = category;
      product.brand = brand;
      product.offer = numericOffer || 0;
      product.variants = variants;
      if (images && Array.isArray(images) && images.length > 0) {
        product.images = images;
      }
  
      // Calling save() will trigger the pre-save hook to recalculate salePrice.
      await product.save();
  
      return res.status(200).json({
        message: "Product updated successfully",
      });
    } catch (error) {
      console.log("Error updating product", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  };
  

//fetch the categories
export const getCategoryDropDown = async (req,res) =>{
    try{
          
        const categories = await CategoryDB.find({isActive : true});

        return res.status(200).json({
            message : "categories fetched successfully",
             categories : categories,
            });
    }
    catch(error){
        return res.status(500).json({message : "internaaal server error"})
    }
}

//fetch the brand
export const getBrandDropDown = async (req, res) =>{
    try{
        const brands = await BrandDB.find({isActive : true});

        return res.status(200).json({
            message : "brands fetched successfully",
            brands : brands
        })
    }
    catch(error){
        return res.status(500).json({message : "internal server error"});
        console.log(error)
    }
}

//blocl or unblock the product
export const blockProduct = async(req, res) =>{
    try{
        const {id} = req.params;

        const product = await ProductDB.findById(id);

        if(!product){
            return res.status(404).json({message : "Product not found"});
        }

        product.isActive = !product.isActive;

        await product.save();

        return res.status(200).json({message : `${product.name} has been ${product.isActive} ? "blocked" : "unblocked"`});
    }
    catch(error){
        return res.status(500).json({message : "Internal server error . please try again" })
    }
}




