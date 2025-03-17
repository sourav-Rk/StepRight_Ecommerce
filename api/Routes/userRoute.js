import express from 'express';
const router = express.Router();

import { forgotChangePassword, forgotVerifyEmail, forgotVerifyOtp, generateAndSendOTP,googleAuth,logout,resendOTP,verifyLogin,verifyOTPAndCreateUser } from '../controllers/UserController/authController.js';
import { verifyUser } from '../Middleware/userAuthMiddleware.js';
import {verifyUserBlocked} from "../Middleware/userBlockMiddleware.js"
import { getCategoryToDisplay, getProductDetails, getRelatedProducts, getSneakerProducts } from '../controllers/UserController/productController.js';
import { editProfile, getUserProfile } from '../controllers/UserController/profileController.js';
import { addAddress, deleteAddress, editAddress, getAddress, getAddresses, setDefaultAddress } from '../controllers/UserController/addressController.js';
import { addToCart, getCartProducts, proceedToCheckout, removeCartItem, updateCartItemQuantity } from '../controllers/UserController/cartController.js';
import { validateProduct } from '../Middleware/productCheckMiddleware.js';
import { cancelOrder, cancelSingleItem, getOrderById, getOrderByItemId, getUserOrders, placeOrder, returnItem, updatePaymentStatus } from '../controllers/UserController/orderController.js';
import { advancedSearchProducts } from '../controllers/UserController/advancedSearchController.js';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/UserController/wishListController.js';
import { makePayment, paymentVerification } from '../controllers/UserController/razorPayController.js';
import { getCoupons } from '../controllers/UserController/couponController.js';
import { addMoneyToWallet, deductWalletAmount, getWallet } from '../controllers/UserController/walletController.js';
import { addReview, getReviews } from '../controllers/UserController/reviewController.js';


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
router.get('/products/shopall', advancedSearchProducts); //get all products
router.get('/categories',getCategoryToDisplay); //get the products based on the category
router.get('/category/:categoryId', advancedSearchProducts); //get products by category 
router.get('/products/related',getRelatedProducts); //get related products
router.get('/products/:id',getProductDetails); // get the product detail 
router.get('/advancedSearch',advancedSearchProducts); //advanced search

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
router.post('/orders',verifyUser,verifyUserBlocked, validateProduct,placeOrder); //to place the order
router.get('/orders',verifyUser, verifyUserBlocked, getUserOrders); // to get orders made by the user
router.get('/orders/:orderId', verifyUser,verifyUserBlocked, getOrderById); // to get a order by its id
router.patch('/orders/:orderId/cancel', verifyUser, verifyUserBlocked,cancelOrder); //to cancel the whole order
router.get('/orders/:orderId/item/:itemId',verifyUser, verifyUserBlocked, getOrderByItemId); //to get the details of an item in the order
router.patch('/orders/:orderId/item/:itemId/cancel', verifyUser, verifyUserBlocked, cancelSingleItem); // to cancel a single item in the order
router.patch('/orders/:orderId/item/:itemId/return',verifyUser,verifyUserBlocked,returnItem); // to return a item 

//razorpay
router.post('/makePayment',verifyUser,verifyUserBlocked,makePayment) // to make the payment in the razorpay
router.post('/verifyPayment',verifyUser,verifyUserBlocked,paymentVerification) // to verify the payment
router.post('/orders/update-payment',verifyUser,verifyUserBlocked,updatePaymentStatus); // to update the payment status
//wishlist
router.get('/wishlist', verifyUser, verifyUserBlocked, getWishlist); //to get the wishlist of the user
router.post('/wishlist/add',verifyUser, verifyUserBlocked, addToWishlist); // to add items to the wishlist
router.post('/wishlist/remove',verifyUser, verifyUserBlocked, removeFromWishlist); // to remove item from the wishlist

//coupon
router.get('/coupons',verifyUser, verifyUserBlocked,getCoupons); //to get the coupons

//wallet
router.get('/wallet',verifyUser, verifyUserBlocked,getWallet); //to get the wallet
router.patch('/wallet',verifyUser, verifyUserBlocked,addMoneyToWallet); // to add money to the wallet
router.patch('/wallet/deduct',verifyUser,verifyUserBlocked,deductWalletAmount); // to deduct the money

//review
router.post('/review',verifyUser,verifyUserBlocked,addReview); // to add a review
router.get('/review/:productId',verifyUser,verifyUserBlocked,getReviews); //to get the reviews


export default router;