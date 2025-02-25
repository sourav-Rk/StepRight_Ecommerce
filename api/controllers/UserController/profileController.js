import { response } from "express";
import usersDB from "../../Models/userSchema.js";
import { refreshTokenDecoder } from "../../utils/jwtToken/decodeRefreshToken.js";
import {  validateUserEdit } from "../../Validators/userValidator.js";

//get user details
export const getUserProfile = async (req, res) =>{
    try{

        const id = refreshTokenDecoder(req);
       
        const userDetails = await usersDB.findOne({_id : id});
        
        if(!userDetails) {
            return res.status(404).json({message : "User not found"});
        }
    
        return res.status(200).json({message : "user details fetched successfully", userDetails:{firstName : userDetails.firstName, lastName : userDetails.lastName,email : userDetails.email,phone : userDetails.phone}});

    }
    catch(error){
        return res.status(500).json({message : "Internal server error"})
    }
   
}

//Edit the profile
export const editProfile = async (req, res) => {
   

    try{
     
       const userId = req.userId;
      
       const {firstName, lastName, phone} = req.body;

    //     const { error } = validateUserEdit(req.body);

    //     if (error) {
    //         return res.status(400).json({ 
    //         message: "Validation failed", 
    //         errors: error.details.map(err => err.message) 
    //         });
    //    }
            
    
       //find user by id
       let  user = await usersDB.findById(userId)

       if(!user){
         return res.status(404).json({message : "User not found"});
       }

       const existingPhone = await usersDB.findOne({ phone, _id: { $ne: userId } });
       
       if(existingPhone){
        return res.status(401).json({message : "Mobile Number already exists"})
       }

       user.firstName = firstName || user.firstName;
       user.lastName =  lastName || user.lastName;
       user.phone   =   phone   || user.phone;

       await user.save();

       return res.status(200).json({message : "Profile updated succesfully"})
    }
    catch(error){
        return res.status(500).json({message : "Internal server error"})
    }
}
