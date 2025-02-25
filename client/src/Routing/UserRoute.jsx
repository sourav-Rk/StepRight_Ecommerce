import React from "react";
import { Routes ,Route, Navigate } from "react-router-dom";
import { useAuth } from "@/Redux/authSelector";

import Signup from "@/Pages/UserPages/Auth/Signup.jsx";
import OTPVerificationForm from "@/Pages/UserPages/Auth/OTPVerificationForm.jsx";
import LoginPage from "@/Pages/UserPages/Auth/LoginPage.jsx";
import ForgotPasswordPage from "@/Pages/UserPages/Auth/ForgotPassword/ForgotPasswordPage.jsx";
import PasswordReset from "@/Pages/UserPages/Auth/ForgotPassword/PasswordReset.jsx";
import LandingPage from "@/Pages/UserPages/LandingPage/LandingPage.jsx";
import UserLoginPrivate from "./ProtectedRouting/User/UserLoginPrivate";
import SneakerPage from "@/Pages/UserPages/CategoryPages/SneakerPage";
import HightTopPage from "@/Pages/UserPages/CategoryPages/HighTopPage";
import RunningShoePage from "@/Pages/UserPages/CategoryPages/RunningShoePage";
import ShoppingAllPage from "@/Pages/UserPages/CategoryPages/ShopAllPage";
import ProductDetailPage from "@/Pages/UserPages/CategoryPages/ProductDetailPage";
import NotFound from "@/components/Common/NotFound";
import AccountPage from "@/Pages/UserPages/AccountPage/AccountPage";
import UserPrivate from "./ProtectedRouting/User/UserPrivate";
import AddressPage from "@/Pages/UserPages/AddressPage/AddAddressPage";
import AddressList from "@/components/UserComponent/Address/AddressList";
import AddressListPage from "@/Pages/UserPages/AddressPage/AddressListPage";
import ShoppingCart from "@/components/UserComponent/Cart/Cart";
import CartPage from "@/Pages/UserPages/CartPage/CartPage";
import CheckOutPage from "@/Pages/UserPages/CheckOutPage/CheckOutPage";



const UserRoute = () => {


    return(
        <>
        <Routes>
            <Route path="/login" element={<UserLoginPrivate><LoginPage /></UserLoginPrivate>} />
            <Route path="/signup" element={<UserLoginPrivate><Signup/></UserLoginPrivate>} />
            <Route path="/otp" element={<OTPVerificationForm />} />
            <Route path="/forgot/verifyEmail" element={<ForgotPasswordPage />}/>
            <Route path="/reset-password" element={<PasswordReset />}/>

            <Route path="/" element={<LandingPage/>}/>
            <Route path="/sneakers" element={<SneakerPage/>}/>
            <Route path="/high-tops" element={<HightTopPage/>}/>
            <Route path="/category/:categoryId" element={<RunningShoePage/>}/>
            <Route path="/shop-all" element={<ShoppingAllPage/>}/>
            <Route path="/product-detail/:id" element={<ProductDetailPage/>}/>

            <Route path="/account" element={<UserPrivate><AccountPage/></UserPrivate>} />
            <Route path="/address" element={<UserPrivate><AddressListPage/></UserPrivate>} />
            <Route path="/address/add" element={<UserPrivate><AddressPage/></UserPrivate>}/>
            <Route path="/address/:id"element={<UserPrivate><AddressPage/></UserPrivate>}/>
           
            <Route path="/cart" element={<CartPage/>}/>
            <Route path="/checkout" element={<CheckOutPage/>} />
            
            <Route path="*" element={<NotFound />} />
            
        </Routes>
        </>
    )
}

export default UserRoute