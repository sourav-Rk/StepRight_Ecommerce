import { addCategory, getCategory, blockCategory, addOffer, editCategory } from "@/Api/Admin/categoryApi";

import React, { createContext, useContext, useEffect, useState } from "react";

import { message } from "antd";

import "antd/dist/reset.css"; 

const CategoryContext = createContext();

export const CategoryProvider = ({children}) =>{
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(false);
    
    //get categories
    const fetchCategories = async (page = 1, limit = 5) =>{
        try{
            const response = await getCategory(page, limit);
            setCategories(response.categories)
        }
        catch(error){
            console.log("Error fetching categories",error);
            message.error("failed to fetch categories");
        }
    }
    
    //add new category
    const addNewCategory = async(formData) =>{
        if(!formData.name || !formData.description){
            message.error("All fields are required");
            return;
        }
        setLoading(true);

        try{
            const response = await addCategory(formData);
            console.log(response)
            message.success(response.message);
            await fetchCategories();
        }
        catch(error){
            message.error(error?.message || "Error adding category")
        }
        finally{
            setLoading(false)
        }
    }
 
    //block or unblock the user
     const blockOrUnblockCategory = async(id) =>{
        try{

            const response = await blockCategory(id);

            // Update the categories state
            setCategories(prevCategories => 
                prevCategories.map(category => 
                    category._id === id ? { ...category, isActive: !category.isActive } : category
                )
            );
            
        }
        catch(error){
            message.error("error updating status");
            console.log("error updating status",error);
        }
     }

     //add offer
     const offerAdd = async(id,offer) =>{
        try{
            const response = await addOffer(id,offer);

            message.success(response.message);

            await fetchCategories()
        }
        catch(error){
           console.log("error adding offer");
           message.error("error updating offer")
        }
     }

     //edit category
     const categoryEdit = async (categoryId, data) => {
        try{
           const response = await editCategory(categoryId, data);

            message.success(response.message);

            await fetchCategories();
        }
        catch(error){
            console.log('error updating category',error);
            message.error(error?.message || "Error updating category")
        }
     }



    useEffect(() =>{
        fetchCategories()
    },[]);

    return (
        <CategoryContext.Provider value={{
            categories,
            setCategories,
             loading, 
             addNewCategory, 
             blockOrUnblockCategory, 
             offerAdd,
             categoryEdit
             }}>
            {children}
        </CategoryContext.Provider>
    )
}

export const useCategory = () => useContext(CategoryContext);