import ProductDB from "../../Models/productSchema.js";
import CategoryDB from "../../Models/categorySchema.js";

//get products with category : sneaker
export const getSneakerProducts = async (req, res) =>{
    try{

        // find the category with name sneaker
        const sneakerCategory = await CategoryDB.findOne({
            name : { $regex: /^sneaker(s)?$/i},
            isActive : true,
        })

        if(!sneakerCategory){
            return res.status(404).json({message : "Sneaker category not found"});
        }

        const products = await ProductDB.find({category : sneakerCategory._id}).limit(6)
           .populate("category", "name")
           .populate("brand", "name");
         
        return res.status(200).json({
            message : "Products fetched successfully",
            products
        })   
    }
    catch(error){
        console.log("Error fetching sneaker products",error);
        return res.status(500).json({message : "Internal server error", error : error.message});
    }
}

// Endpoint to fetch specific categories in order
export const getCategoryToDisplay = async(req, res) =>{
  try{
    const categoryNames = ["Sneaker", "High Tops", "Running Shoe"];

    // Fetch categories from the database that match the names
    const categories = await CategoryDB.find({ name: { $in: categoryNames } });

    // Sort the categories in the desired order
    const sortedCategories = categoryNames.map((name) =>
      categories.find((category) => category.name === name)
    );

    // Remove any undefined values (in case a category is not found)
    const filteredCategories = sortedCategories.filter((category) => category);

    res.status(200).json({ categories: filteredCategories });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
}

//get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 6; 
    const skip = (page - 1) * limit; 

    
    const category = await CategoryDB.findOne({
      _id: categoryId,
      isActive: true, 
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found or inactive" });
    }

  
    const products = await ProductDB.find({ category: category._id, isActive : true })
      .skip(skip)
      .limit(limit)
      .populate("category", "name") 
      .populate("brand", "name isActive"); 


    const filteredProducts = products.filter(
      (product) => product?.brand?.isActive === true
    );


    const totalProducts = await ProductDB.aggregate([
      {
        $match: {
          category: category._id, 
          isActive: true,
          brand: { $exists: true, $ne: null }, 
        },
      },
      {
        $lookup: {
          from: "brands", 
          localField: "brand",
          foreignField: "_id",
          as: "brandDetails",
        },
      },
      {
        $unwind: "$brandDetails", 
      },
      {
        $match: {
          "brandDetails.isActive": true,
           
        },
      },
      {
        $count: "total", 
      },
    ]);

    const total = totalProducts[0]?.total || 0; 

   
    return res.status(200).json({
      message: "Products fetched successfully",
      products: filteredProducts,
      totalPages: Math.ceil(total / limit), 
      currentPage: page, 
    });
  } catch (error) {
    console.log("Error fetching products by category:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


//to get all products
export const getProducts = async (req, res) =>{
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        const products = await ProductDB.aggregate([
            {
              $lookup: {
                from: "categories", 
                localField: "category",
                foreignField: "_id",
                as: "categoryDetails",
              },
            },
            {
              $lookup: {
                from: "brands", 
                localField: "brand",
                foreignField: "_id",
                as: "brandDetails",
              },
            },
            {
              $unwind: "$categoryDetails", 
            },
            {
              $unwind: "$brandDetails", 
            },
            {
              $match: {
                "categoryDetails.isActive": true, 
                "brandDetails.isActive": true,
                "isActive": true,   
              },
            },
            {
              $skip: skip, 
            },
            {
              $limit: limit, 
            },
            {
              $project: {
                name: 1,
                description: 1,
                category: { name: 1, isActive: 1 },
                brand: { name: 1, isActive: 1 },
                offer: 1,
                images: 1,
                isActive: 1,
                variants: 1,
                totalStock: { $sum: "$variants.quantity" },
              },
            },
          ]);

          
      
          // count total products with active categories and brands
          const totalProducts = await ProductDB.aggregate([
            {
              $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "categoryDetails",
              },
            },
            {
              $lookup: {
                from: "brands",
                localField: "brand",
                foreignField: "_id",
                as: "brandDetails",
              },
            },
            {
              $unwind: "$categoryDetails", 
            },
            {
              $unwind: "$brandDetails",
            },
            {
              $match: {
                "categoryDetails.isActive": true, 
                "brandDetails.isActive": true,
                "isActive": true,  
              },
            },
            {
              $count: "total", 
            },
          ]);

          const total = totalProducts[0]?.total || 0;

        return res.status(200).json({
            message : "products fetched successfully",
             products : products,
             totalPages : Math.ceil(total / limit),
             currentPage : page,
            });

    }
    catch(error){
        console.log("Error fetching the products",error);
        return res.status(500).json({message : "Internal server error",})
    }
}

//get a particular product
export const getProductDetails = async(req, res) =>{
    try{
         const {id} = req.params;

         const product = await ProductDB.findById(id)
          .populate("category", "name")
          .populate("brand", "name");

          if(!product) {
            return res.status(404).json({message : "Product Not found"});
          }

          return res.status(200).json({
            message : "Product fetched Successfully",
            product,
          })
    }
    catch(error){
        console.error("Error fetching product details",error);
        return res.status(500).json({message : "Internal server error"});
    }
}

//get related products
export const getRelatedProducts = async (req, res) =>{
    try{
        const {category, exclude} = req.query;
   

        if(!category){
           return res.status(400).json({message : "Category is required"});
        }

        //find the product with the category by excluding the current product
        const products = await ProductDB.find({
            category,
            _id : {$ne: exclude}
        })
         .populate("category", "name")
         .populate("brand", "name");

         return res.status(200).json({
            message : "Related products fetched successfully",
            products,
         });

    }
    catch(error){
        console.log("Error fetching related products");
        res.status(500).json({message : "Internal server error"});
    }
}





