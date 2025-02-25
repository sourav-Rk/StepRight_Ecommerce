import React from "react";
import CustomerDetails from "@/components/AdminComponent/Customers/CustomerDetails";
import { Sidebar } from "lucide-react";

const CustomerPage = () =>{
    return(
        <>
        <Sidebar/>
        <CustomerDetails/>
        </>
    )
}

export default CustomerPage