import Footer from "@/components/UserComponent/LandingPage/Footer";
import Header from "@/components/UserComponent/LandingPage/Header";
import InfoAccordion from "@/components/UserComponent/Product/InfoAccordion";
import ProductDetails from "@/components/UserComponent/Product/ProductDetail/ProductDetail";
import RelatedProduct from "@/components/UserComponent/Product/RelatedProduct";
import React from "react";

const ProductDetailPage = () =>{
    return(
        <>
        <Header/>
        <ProductDetails/>
        <Footer/>
        </>
    )
}

export default ProductDetailPage