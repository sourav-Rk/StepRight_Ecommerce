import express from 'express';
const router = express.Router();

import { forgotChangePassword, forgotVerifyEmail, forgotVerifyOtp, generateAndSendOTP,googleAuth,logout,resendOTP,verifyLogin,verifyOTPAndCreateUser } from '../controllers/UserController/authController.js';
import { verifyUser } from '../Middleware/userAuthMiddleware.js';
import {verifyUserBlocked} from "../Middleware/userBlockMiddleware.js"
import { getCategoryToDisplay, getProductDetails, getProducts, getProductsByCategory, getRelatedProducts, getSneakerProducts } from '../controllers/UserController/productController.js';
import { editProfile, getUserProfile } from '../controllers/UserController/profileController.js';
import { addAddress, deleteAddress, editAddress, getAddress, getAddresses, setDefaultAddress } from '../controllers/UserController/addressController.js';
import { addToCart, getCartProducts, proceedToCheckout, removeCartItem, updateCartItemQuantity } from '../controllers/UserController/cartController.js';
import { validateProduct } from '../Middleware/productCheckMiddleware.js';
import { cancelOrder, getOrderById, getUserOrders, placeOrder } from '../controllers/UserController/orderController.js';
import { advancedSearchProducts } from '../controllers/UserController/advancedSearchController.js';


//Login and Signup Routes
router.post('/signup',generateAndSendOTP); // User signup
router.post('/signup/otp',verifyOTPAndCreateUser);  //verify the otp and create user
router.post('/login',verifyLogin); //Verify the login
router.post('/googleLogin', googleAuth); //user login with google
router.post('/signup/resend-otp',resendOTP);  //resend the OTP
router.post('/forgot/verify-email',forgotVerifyEmail); //verify the email 
router.post('/forgot/verify-otp',forgotVerifyOtp) //vrify the Otp
router.patch('/forgot/change-password',forgotChangePassword); //update the password
router.post('/logout',logout); //logout

//Product routes
router.get('/products/sneakers',getSneakerProducts); // get the sneaker products to display in the home page
router.get('/products/shopall', getProducts); //get all products
router.get('/categories',getCategoryToDisplay); //get the products based on the category
router.get('/category/:categoryId', getProductsByCategory); //get products by category 
router.get('/products/related',getRelatedProducts); //get related products
router.get('/products/:id',getProductDetails); // get the product detail 
router.get('/advancedSearch',advancedSearchProducts);

//profile routes
router.get('/profile',verifyUser,verifyUserBlocked,getUserProfile) //get user details
router.put('/profile',verifyUser,verifyUserBlocked,editProfile); //edit the profile

//address routes
router.get('/address', verifyUser, verifyUserBlocked, getAddresses); //to get all addresses
router.post('/address',verifyUser, verifyUser, addAddress);//to add a new address
router.get('/address/:id', verifyUser, verifyUserBlocked,getAddress); //to get a particular addresses
router.put('/address/:id', verifyUser, verifyUserBlocked, editAddress); //to edit the address
router.delete('/address/:id', verifyUser, verifyUserBlocked, deleteAddress); //to delete an address
router.patch('/address/:id', verifyUser,verifyUserBlocked,setDefaultAddress); //to set address as default

//cart routes
router.post('/cart',verifyUser, verifyUserBlocked, addToCart); //to add items to the cart
router.get('/cart',verifyUser,verifyUserBlocked,getCartProducts); //to get products in the cart
router.patch('/cart/:itemId', verifyUser,verifyUserBlocked,updateCartItemQuantity); //to increase or decrease the quantity
router.delete('/cart/:itemId', verifyUser, verifyUserBlocked, removeCartItem); // to remove the item from the cart
router.get('/proceedToCheckout',verifyUser, verifyUserBlocked, proceedToCheckout);  //proceed to checkout


//orders
router.post('/orders',verifyUser,verifyUserBlocked, validateProduct,placeOrder);
router.get('/orders',verifyUser, verifyUserBlocked, getUserOrders);
router.get('/orders/:orderId',verifyUser, verifyUserBlocked , getOrderById);
router.patch('/orders/:orderId/cancel', verifyUser, verifyUserBlocked,cancelOrder);

export default router;