    import express from "express";
    const router = express.Router();
    
    //Middlewares
    import {verifyAdmin} from "../Middleware/adminAuthMiddleware.js"
    
    //controllers
    import {blockUser, getUsers} from "../controllers/AdminController/customerController.js";
    import { logoutAdmin, verifyLogin } from "../controllers/AdminController/authController.js";
    import { addCategory, addOffer, blockCategory, editCategory, getCategory } from "../controllers/AdminController/categoryController.js";
    import { addBrand, blockBrand, editBrand, getBrand } from "../controllers/AdminController/brandController.js";
    import { addProduct, blockProduct, editProduct, getBrandDropDown, getCategoryDropDown, getProductEdit, getProducts } from "../controllers/AdminController/productController.js";
    import { uploadImages} from "../controllers/AdminController/imageUploadController.js"
    import { upload } from "../Cloudinary/cloudinary.js";
    import { addSize, blockSize, getSizes, getSizesForProduct } from "../controllers/AdminController/sizeController.js";
    import { getAllOrders, getOrderById, updateOrderStatus, updateRefundStatus, updateSingleOrderItemStatus } from "../controllers/AdminController/orderController.js";
    import { blockCoupon, createCoupon, getCoupons } from "../controllers/AdminController/couponController.js";
    import getSalesReport, { downloadSalesReportExcel, downloadSalesReportPDF, getSalesAnalytics } from "../controllers/AdminController/salesReportController.js";
    import { getAdminReviews } from "../controllers/AdminController/reviewController.js";
    import { updatePaymentCod } from "../controllers/UserController/orderController.js";

    //Login
    router.post("/login", verifyLogin);//verify login
    router.post('/logout',logoutAdmin); //logout

    //customers
    router.get('/users',verifyAdmin, getUsers); //to get the list of customers
    router.put('/users/:id',verifyAdmin, blockUser); // to block or umblock users

    //Category
    router.get('/category', verifyAdmin, getCategory); //to get the categories
    router.post('/add-category', verifyAdmin, addCategory); //to add the category
    router.put('/block-category/:id', verifyAdmin, blockCategory); //to block the category
    router.put('/add-offer/:id', verifyAdmin, addOffer); //to add category offer
    router.put('/edit-category/:id', verifyAdmin, editCategory); //to edit category

    //brand
    router.get('/brand', verifyAdmin, getBrand); //to get the brands
    router.post('/add-brand', verifyAdmin, addBrand); //to add a brand
    router.put('/block-brand/:id', verifyAdmin,blockBrand); //to block or unblock the brand
    router.put('/edit-brand/:id', verifyAdmin , editBrand); //to edit the brand

    //products
    router.get('/product', verifyAdmin, getProducts); //to get the products
    router.get('/product-edit/:id', verifyAdmin, getProductEdit); //to prepopulate the data before editing the product
    router.post('/add/product', verifyAdmin, addProduct); //to add a product
    router.put('/edit/product/:id', verifyAdmin, editProduct); //to edit a product
    router.get('/product/category', getCategoryDropDown); //to get the categories for dropdown
    router.get('/product/brand',getBrandDropDown); //to get brands for dropdown
    router.get('/product/size', verifyAdmin ,getSizesForProduct)  //to get sizes for product add
    router.put('/block-product/:id', verifyAdmin, blockProduct); //to block or unblock product

    //Size
    router.get('/size', verifyAdmin ,getSizes); //to get the sizes
    router.post('/add/size', verifyAdmin, addSize);//to add a size
    router.put('/block-size/:id', verifyAdmin, blockSize); //to block or unblock the size
    
    //orders
    router.get('/orders',verifyAdmin, getAllOrders);//to get all orders 
    router.get('/orders/:orderId',verifyAdmin , getOrderById); // to get a order by its id
    router.patch('/orders/:orderId/item/:itemId',verifyAdmin,updateSingleOrderItemStatus); //to update the status of a single item
    router.patch('/orders/:orderId/item/:itemId/refundStatus',verifyAdmin,updateRefundStatus); //to approve the refund request
    router.patch('/orders/updatePaymentCod',verifyAdmin,updatePaymentCod); //to approve the payment status to paid for code
    //router.patch('/orders/:orderId', verifyAdmin, updateOrderStatus);


    //coupon
    router.get('/coupon',verifyAdmin,getCoupons); // to get the coupons
    router.post('/coupon',verifyAdmin,createCoupon); // to add the coupon
    router.put('/coupon/:id', verifyAdmin, blockCoupon); //to block or unblock the coupon
    
    //sales report
    router.get('/sales-report',verifyAdmin,getSalesReport); //to get the salesreport
    router.get('/sales-report/download/pdf',verifyAdmin,downloadSalesReportPDF); //to download the salesreport- PDF
    router.get('/sales-report/download/excel',verifyAdmin,downloadSalesReportExcel); //to download the salesreport -EXCEL

    //dashboard
    router.get('/salesdashboard',verifyAdmin,getSalesAnalytics); //to get the salesanalytics for dashboard

    //review
    router.get('/reviews',verifyAdmin,getAdminReviews); //to get the reviews
    
    //upload images
    router.post('/upload', (req, res, next) => {
        upload.array("images")(req, res, (err) => {
          if (err) {
            return res.status(400).json({ message: err.message });
          }
          next();
        });
      }, uploadImages);
      

    export default router
    