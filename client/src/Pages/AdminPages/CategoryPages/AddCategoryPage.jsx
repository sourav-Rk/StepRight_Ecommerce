import React from "react";

import AddCategory from "@/components/AdminComponent/Category/AddCategory";
import Sidebar from "@/components/AdminComponent/Sidebar";
import { CategoryProvider } from "@/Context/CategoryContext.jsx";

const AddCategoryPage = () =>{
    return(
        <>
        <CategoryProvider>
        <Sidebar/>
        <AddCategory/>
        </CategoryProvider>
       
        </>
    )
}

export default AddCategoryPage