import ProductDB from "../../Models/productSchema.js";

import { errorHandler } from "../../utils/error.js";

export const advancedSearchProducts = async(req, res, next) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page-1) * limit;

        //sorting
        const sortBy = req.query.sortBy || "newArrivals";
        let sortStage = {};

        switch(sortBy){
            case "popularity":
                sortStage = {createdAt : -1}
                break;
            case "priceLowToHigh" :
                sortStage ={"variants.regularPrice" : 1};
                break;
            case "priceHighToLow" :
                sortStage={"variants.regularPrice" : -1}   
                break;
            case "featured" :
                sortStage = {createdAt:-1}
                break;
            case "newArrival" :
                sortStage ={createdAt : -1}
                break
            case "aToz":
                sortStage={name : 1}
                break;
            case "ztoA" :
                sortStage ={name : -1}
                break;
            default : 
            sortStage ={createdAt : -1211}            
                         
        }
        const pipeLine = [
            // lookup categoryy and brand details
            {
                $lookup : {
                    from : "categories",
                    localField :"category",
                    foreignField : "_id",
                    as : "categoryDetails"
                }
            },
            {
                $lookup : {
                    from : "brands",
                    localField : "brand",
                    foreignField : "_id",
                    as : "brandDetails"
                }
            },
            {$unwind : "$categoryDetails"},
            {$unwind : "$brandDetails"},
            
            //match active products and apply sort
            {
                $match : {
                    "categoryDetails.isActive" : true,
                    "brandDetails.isActive" : true,
                    isActive : true,
                },
            },
            {$sory : sortStage},
            {$skip : skip},
            {$limit : limit},

            //project the fields
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
            }
        ];

        const products = await ProductDB.aggregate(pipeLine);

        //count total matching documents
        const countPipeLine = [
            {
                $lookup : {
                    from : "categories",
                    localField :"category",
                    foreignField : "_id",
                    as : "categoryDetails"
                }
            },
            {
                $lookup :{
                    from : "brands",
                    localFiels : "brand",
                    foreignField : "_id",
                    as : "brandDetails"
                }
            },
            {$unwind : "$categoryDetails"},
            {$unwind : "$brandDetails"},
            {
                $match : {
                    "categoryDetails.isActive" : true,
                    "brandDetails.isActive" : true,
                    isActive : true
                }
            },
            {$count : "total"},
        ];

        const totalProductResult = await ProductDB.aggregate(countPipeLine);
        const total = totalProductResult[0]?.total || 0;

        return res.status(200).json({
            message : "Products fetched successfully",
            products,
            totalPages : Math.ceil(total/limit),
            currentPage : page,
        });
    }catch(error) {
        console.log("Error in advanced search products", error);
        return next(errorHandler(500,"Something went wrong ! Please try again"));
    }
};

