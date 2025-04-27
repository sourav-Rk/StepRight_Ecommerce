import {v2 as cloudinary} from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from "dotenv"
dotenv.config();


// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

// Configure Multer storage with Cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "secure-uploads", // Specify the folder in Cloudinary
      resource_type: "image", // Automatically detect file type
      allowed_formats: ["jpg", "png", "jpeg", "gif"], 
    },
});
  
// Create the Multer instance
const upload = multer({
   storage,
   fileFilter: (req, file, cb) => {
    if(file.mimetype.startsWith("image/")){
      cb(null, true);
    }else{
      cb(new Error("only image files are allowed"), false);
    }
   }
   });

export { cloudinary, upload };