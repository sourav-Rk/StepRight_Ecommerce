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
import getSalesReport, { downloadSalesReportExcel, downloadSalesReportPDF } from "../controllers/AdminController/salesReportController.js";

    //Login
    router.post("/login", verifyLogin);
    router.post('/logout',logoutAdmin);

    //customers
    router.get('/users',verifyAdmin, getUsers);
    router.put('/users/:id',verifyAdmin, blockUser);

    //Category
    router.get('/category', verifyAdmin, getCategory);
    router.post('/add-category', verifyAdmin, addCategory);
    router.put('/block-category/:id', verifyAdmin, blockCategory);
    router.put('/add-offer/:id', verifyAdmin, addOffer);
    router.put('/edit-category/:id', verifyAdmin, editCategory);   

    //brand
    router.get('/brand', verifyAdmin, getBrand);
    router.post('/add-brand', verifyAdmin, addBrand);
    router.put('/block-brand/:id', verifyAdmin,blockBrand);
    router.put('/edit-brand/:id', verifyAdmin , editBrand);

    //products
    router.get('/product', verifyAdmin, getProducts);
    router.get('/product-edit/:id', verifyAdmin, getProductEdit)
    router.post('/add/product', verifyAdmin, addProduct);
    router.put('/edit/product/:id', verifyAdmin, editProduct);
    router.get('/product/category', getCategoryDropDown);
    router.get('/product/brand',getBrandDropDown); 
    router.get('/product/size', verifyAdmin ,getSizesForProduct) 
    router.put('/block-product/:id', verifyAdmin, blockProduct);

    //Size
    router.get('/size', verifyAdmin ,getSizes)
    router.post('/add/size', verifyAdmin, addSize);
    router.put('/block-size/:id', verifyAdmin, blockSize);   
    
    //orders
    router.get('/orders',verifyAdmin, getAllOrders);
    router.get('/orders/:orderId',verifyAdmin , getOrderById); // to get a order by its id
    //router.patch('/orders/:orderId', verifyAdmin, updateOrderStatus);
    router.patch('/orders/:orderId/item/:itemId',verifyAdmin,updateSingleOrderItemStatus);
    router.patch('/orders/:orderId/item/:itemId/refundStatus',verifyAdmin,updateRefundStatus);


    //coupon
    router.get('/coupon',verifyAdmin,getCoupons); // to get the coupons
    router.post('/coupon',verifyAdmin,createCoupon); // to add the coupon
    router.put('/coupon/:id', verifyAdmin, blockCoupon); //to block or unblock the coupon
    
    //sales report
    router.get('/sales-report',verifyAdmin,getSalesReport);
    router.get('/sales-report/download/pdf',verifyAdmin,downloadSalesReportPDF);
    router.get('/sales-report/download/excel',verifyAdmin,downloadSalesReportExcel);
    
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
    