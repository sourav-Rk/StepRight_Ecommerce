import React from "react";
import {Routes, Route, Navigate} from "react-router-dom"

import LoginPage from "@/Pages/AdminPages/LoginPage/LoginPage.jsx";

import CustomerPage from "@/Pages/AdminPages/CustomerPage/CustomerPage";
import DashboardPage from "@/Pages/AdminPages/DashboardPage/DashboardPage";
import AdminLoginPrivate from "./ProtectedRouting/Admin/AdminLoginPrivate";
import AdminPrivate from "./ProtectedRouting/Admin/AdminPrivate";
import AddCategoryPage from "@/Pages/AdminPages/CategoryPages/AddCategoryPage";
import BrandPage from "@/Pages/AdminPages/BrandPage/BrandPage";
import ProductPage from "@/Pages/AdminPages/ProductPage/ProductPage";
import ProductListPage from "@/Pages/AdminPages/ProductPage/ProductListPage";
import SizePage from "@/Pages/AdminPages/SizePage/SizePage";
import EditProductPage from "@/Pages/AdminPages/ProductPage/ProductEditPage";
import NotFound from "@/components/Common/NotFound";
import OrderListPage from "@/Pages/AdminPages/OrderListPage/OrderListPage";
import OrderDetailsPage from "@/Pages/AdminPages/OrderListPage/OrderDetailsPage";



const AdminRoute = () => {

     return(

        <Routes>
            <Route path="/login" element={<AdminLoginPrivate><LoginPage /></AdminLoginPrivate>}/>
            <Route path="/dashboard" element={<AdminPrivate><DashboardPage/></AdminPrivate>}/>
            <Route path="/customers" element={<AdminPrivate><CustomerPage/></AdminPrivate>}/>
            <Route path="/category" element ={<AdminPrivate><AddCategoryPage/></AdminPrivate>} />
            <Route path="/brands" element={<AdminPrivate><BrandPage/></AdminPrivate>}/>
            <Route path="/add/products" element={<AdminPrivate><ProductPage/></AdminPrivate>} />
            <Route path="products" element={<AdminPrivate><ProductListPage/></AdminPrivate>} />
            <Route path="/size" element={<AdminPrivate><SizePage/></AdminPrivate>} />
            <Route path="/edit-product/:id" element={<AdminPrivate><EditProductPage/></AdminPrivate>}/>
            
            <Route path="/orders" element={<AdminPrivate><OrderListPage/></AdminPrivate>}/>
            <Route path="/orders/:orderId" element={<AdminPrivate><OrderDetailsPage/></AdminPrivate>}/>
            <Route path="*" element={<NotFound />} />          
        </Routes>     

     )
};

export default AdminRoute