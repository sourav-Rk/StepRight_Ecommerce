import usersDB from "../Models/userSchema.js";

export const verifyUserBlocked = async(req, res, next) =>{
    try{
        const userId = req.userId;

        if(!userId){
            return next()
        }

        const validUser = await usersDB.findOne({_id : userId});

        if(!validUser || validUser.isBlocked){
            res
            .clearCookie('accessToken')
            .clearCookie('refreshToken')
            return res.status(403).json({message :"you are blocked ! please contact admin"})
        }
        next()
    }
    catch(error){
        return res.status(500).json({message :"something went wrong! please try again"});
    }
}

// import usersDB from "../Models/userSchema.js";


// export const verifyUserBlocked = async (req, res, next) => {
//   try {
//     // if verifyUser didn’t set userId → auth failed
//     if (!req.userId) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const validUser = await usersDB.findById(req.userId);

//     if (!validUser) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     if (validUser.isBlocked) {
//       res.clearCookie("accessToken").clearCookie("refreshToken");
//       return res.status(403).json({
//         code: "USER_BLOCKED",
//         message: "you are blocked ! please contact admin",
//       });
//     }

//     next();
//   } catch (error) {
//     next(error);
//   }
// };
