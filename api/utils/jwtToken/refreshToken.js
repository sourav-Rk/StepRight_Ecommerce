import jwt from "jsonwebtoken";


export const generateRefreshToken = (res,user) =>{
    const token = jwt.sign(
        {id : user._id, role:user.role},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn : "90d"}
    )

    res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ?true : false,
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      });
      
}
