import React from "react";
import SidePage from "../SidePage";
import BrandAdd from "@/components/AdminComponent/Brand/BrandAdd";
import BrandTable from "@/components/AdminComponent/Brand/BrandTable";

const BrandPage = () =>{
    return(
        <>
        <SidePage/>
        <BrandAdd/>
        <BrandTable/>
        </>
    )
}

export default BrandPage