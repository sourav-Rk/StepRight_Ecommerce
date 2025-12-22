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
import AddCouponPage from "@/Pages/AdminPages/CouponPage/AddCouponPage";
import CouponListPage from "@/Pages/AdminPages/CouponPage/CouponListPage";
import SalesPage from "@/Pages/AdminPages/SalesPage/SalesPage";
import AdminReviewPanel from "@/components/AdminComponent/Reviews/ReviewList";
import ReviewPage from "@/Pages/AdminPages/ReviewPage/ReviewPage";


const AdminRoute = () => {

     return(

        <Routes>
            <Route path="/login" element={<AdminLoginPrivate><LoginPage /></AdminLoginPrivate>}/>
            <Route path="/dashboard" element={<AdminPrivate allowedRoles={["admin"]} children={<DashboardPage/>}/>}/>
            <Route path="/customers" element={<AdminPrivate allowedRoles={["admin"]} children={<CustomerPage/>}/>}/>
            <Route path="/category" element ={<AdminPrivate allowedRoles={["admin"]} children={<AddCategoryPage/>}/>} />
            <Route path="/brands" element={<AdminPrivate allowedRoles={["admin"]} children={<BrandPage/>}/>}/>
            <Route path="/add/products" element={<AdminPrivate allowedRoles={["admin"]} children={<ProductPage/>}/>} />
            <Route path="products" element={<AdminPrivate allowedRoles={["admin"]} children={<ProductListPage/>}/>} />
            <Route path="/size" element={<AdminPrivate allowedRoles={["admin"]} children={<SizePage/>}/>} />
            <Route path="/edit-product/:id" element={<AdminPrivate allowedRoles={["admin"]} children={<EditProductPage/>}/>}/>
            
            <Route path="/orders" element={<AdminPrivate allowedRoles={["admin"]} children={<OrderListPage/>}/>}/>
            <Route path="/orders/:orderId" element={<AdminPrivate allowedRoles={["admin"]} children={<OrderDetailsPage/>}/>}/>
            <Route path="/add/coupon" element={<AdminPrivate allowedRoles={["admin"]} children={<AddCouponPage/>}/>}/>
            <Route path="/coupon" element={<AdminPrivate allowedRoles={["admin"]} children={<CouponListPage/>}/>}/>
            <Route path="/sales-report" element={<AdminPrivate children={<SalesPage/>} />}/>
            <Route path="/dashboard" element={<AdminPrivate children={<DashboardPage/>}/>} />
            <Route path="/reviews" element={<AdminPrivate children={<ReviewPage/>}/>}/>

         
            <Route path="*" element={<NotFound />} />          
        </Routes>     

     )
};

export default AdminRoute