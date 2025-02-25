//User DB
import usersDB from "../../Models/userSchema.js";

import bcrypt from "bcrypt"

//access tokens and refresh token generators
import {generateAdminAccessToken} from "../../utils/jwtToken/accessToken.js"
import {generateAdminRefreshToken} from "../../utils/jwtToken/refreshToken.js"

export const verifyLogin = async(req, res) => {
    try{
        const {email, password} = req.body;

        const adminExist = await usersDB.findOne({email, role : "admin"});

        if(!adminExist){
            return res.status(404).json({message : "Email doesnt exist!!"})
        }

        const isPasswordCorrect = await bcrypt.compare(password,adminExist.password);

        if(!isPasswordCorrect){
            return res.status(401).json({message : "Invalid credentials!"});
        }

        generateAdminAccessToken(res, adminExist);
        generateAdminRefreshToken(res, adminExist);

        const adminName  = adminExist.firstName;

        return res.status(200).json({message : "Logged in successfully",adminName})
    }
    catch(error){
        return res.status(500).json({message : "something went wrong. Please try again!"})
    }
}

//logout function
export const logoutAdmin = (req, res) =>{
    res.clearCookie("adminAccessToken", { httpOnly : true ,secure : false ,sameSite : "Lax"});
    res.clearCookie("adminRefreshToken", { httpOnly : true ,secure : false ,sameSite : "Lax"});

    return res.status(200).json({message : "Logout successfully"})
}

