import React from "react";
import { Routes ,Route } from "react-router-dom";

import Signup from "@/Pages/UserPages/Auth/Signup.jsx";
import OTPVerificationForm from "@/Pages/UserPages/Auth/OTPVerificationForm.jsx";
import LoginPage from "@/Pages/UserPages/Auth/LoginPage.jsx";
import ForgotPasswordPage from "@/Pages/UserPages/Auth/ForgotPassword/ForgotPasswordPage.jsx";
import PasswordReset from "@/Pages/UserPages/Auth/ForgotPassword/PasswordReset.jsx";
import LandingPage from "@/Pages/UserPages/LandingPage/LandingPage.jsx";
import UserLoginPrivate from "./ProtectedRouting/User/UserLoginPrivate";
import ProductDetailPage from "@/Pages/UserPages/CategoryPages/ProductDetailPage";
import NotFound from "@/components/Common/NotFound";
import AccountPage from "@/Pages/UserPages/AccountPage/AccountPage";
import UserPrivate from "./ProtectedRouting/User/UserPrivate";
import AddressPage from "@/Pages/UserPages/AddressPage/AddAddressPage";
import AddressListPage from "@/Pages/UserPages/AddressPage/AddressListPage";
import CartPage from "@/Pages/UserPages/CartPage/CartPage";
import CheckOutPage from "@/Pages/UserPages/CheckOutPage/CheckOutPage";
import UserOrdersPage from "@/Pages/UserPages/UserOrders/UserOrdersPage";
import OrderDetailPage from "@/Pages/UserPages/UserOrders/OrderDetail";
import CategoryProductPage from "@/Pages/UserPages/CategoryPages/CategoryProductPage";
import ItemOrderDetails from "@/components/UserComponent/Order/ItemOrderDetails";
import ItemDetailPage from "@/Pages/UserPages/UserOrders/ItemDetailPage";
import Wishlist from "@/components/UserComponent/WishList/WishList";
import WishlistPage from "@/Pages/UserPages/WishlistPage/WishlistPage";
import WalletComponent from "@/components/UserComponent/Wallet/Wallet";
import WalletPage from "@/Pages/UserPages/WalletPage/WalletPage";
import Invoice from "@/components/UserComponent/Order/Invoice";



const UserRoute = () => {


    return(
        <>
        <Routes>
            {/* aunthentication */}
            <Route path="/login" element={<UserLoginPrivate><LoginPage /></UserLoginPrivate>} />
            <Route path="/signup" element={<UserLoginPrivate><Signup/></UserLoginPrivate>} />
            <Route path="/otp" element={<OTPVerificationForm />} />
            <Route path="/forgot/verifyEmail" element={<ForgotPasswordPage />}/>
            <Route path="/reset-password" element={<PasswordReset />}/>
            
            {/* Product display */}
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/category/:categoryId" element={<CategoryProductPage/>}/>
            <Route path="/shop-all" element={<CategoryProductPage/>}/>
            <Route path="/product-detail/:id" element={<ProductDetailPage/>}/>
            <Route path="/wishlist" element={<UserPrivate><WishlistPage/></UserPrivate>}/>
            
            {/* account and address */}
            <Route path="/account" element={<UserPrivate><AccountPage/></UserPrivate>} />
            <Route path="/address" element={<UserPrivate><AddressListPage/></UserPrivate>} />
            <Route path="/address/add" element={<UserPrivate><AddressPage/></UserPrivate>}/>
            <Route path="/address/:id"element={<UserPrivate><AddressPage/></UserPrivate>}/>
            
            {/* orders and cart */}
            <Route path="/cart" element={<UserPrivate><CartPage/></UserPrivate>}/>
            <Route path="/checkout" element={<UserPrivate><CheckOutPage/></UserPrivate>} />
            <Route path="/orders" element={<UserPrivate><UserOrdersPage/></UserPrivate>}/>
            <Route path="/orders/:orderId" element={<UserPrivate><OrderDetailPage/></UserPrivate>} />
            <Route path="/orders/:orderId/item/:itemId" element={<UserPrivate><ItemDetailPage/></UserPrivate>} />
            <Route path="/orders/invoice/:orderId" element={<UserPrivate><Invoice/></UserPrivate>}/>
            
             {/* wallet */}
            <Route path="/wallet" element={<UserPrivate><WalletPage/></UserPrivate>}/>

            <Route path="*" element={<NotFound />} />
            
        </Routes>
        </>
    )
}

export default UserRoute