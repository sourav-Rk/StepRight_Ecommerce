import React from "react";
import CustomerDetails from "@/components/AdminComponent/Customers/CustomerDetails";
import { Sidebar } from "lucide-react";
import SalesReport from "@/components/AdminComponent/SalesReport/SalesReport";
import SidePage from "../SidePage";

const SalesPage = () =>{
    return(
        <>
        <SidePage/>
        <SalesReport/>
        </>
    )
}

export default SalesPage