import Footer from "@/components/UserComponent/LandingPage/Footer";
import Header from "@/components/UserComponent/LandingPage/Header";
import CategoryProduct from "@/components/UserComponent/Product/CategoryProduct";
import React from "react";

const ShoppingAllPage = () =>{
    return(
        <>
        <Header/>
        <CategoryProduct
        name={"Shop All"}/>
        <Footer/>
        </>
    )
}

export default ShoppingAllPage