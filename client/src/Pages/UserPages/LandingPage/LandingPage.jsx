import React from "react";
import Header from "@/components/UserComponent/LandingPage/Header";
import Banner from "@/components/UserComponent/LandingPage/Banner"
import ProductGrid from "@/components/UserComponent/LandingPage/ProductGrid";
import CollectionsGrid from "@/components/UserComponent/LandingPage/CollectionsGrid";
import Footer from "@/components/UserComponent/LandingPage/Footer";
import ImageCarousel from "@/components/UserComponent/LandingPage/ImageCarousel";
import BestSellingSneakers from "@/components/UserComponent/LandingPage/BestSellingSneakers";

const LandingPage = () =>{
    return(
        <>
        <Header/>
        <Banner/>
        <ImageCarousel/>
        <BestSellingSneakers/>
        <CollectionsGrid/>
        <Footer/>
        </>
    )
}

export default LandingPage