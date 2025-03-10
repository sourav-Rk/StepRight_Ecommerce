    //Models
    import usersDB from "../../Models/userSchema.js";
    import { errorHandler } from "../../Middleware/error.js";

    //fetch user details
    export const getUsers = async(req,res, next) =>{
        try{
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;
            const skip = (page - 1) * limit;

            const totalUsers = await usersDB.countDocuments({ role: "user" });
            const users = await usersDB.find({ role: "user" }).sort({ createdAt: -1 }).skip(skip).limit(limit);


            return res.status(200).json({
                message :"customers fetched successfully",
                users,
                totalUsers,
                totalPages : Math.ceil(totalUsers / limit),
                currentPage : page,
                });
        }
        catch(error){
            return next(errorHandler(500,"something wenet wrong! please try again"))
        }
    }


    //block or unblock users
    export const blockUser = async(req,res, next) =>{
        
        try{
            const userId = req.params.id;

            const user = await usersDB.findById(userId);

            if(!user){
                return next(errorHandler(404,"User not found"));  
            }

            user.isBlocked = !user.isBlocked;

            await user.save();

            res.status(200).json({message : `User has been ${user.isBlocked ? "blocked" : "unblocked"}`});

        }
        catch(error){
            return next(errorHandler(500,"something went wron"))
            res.status(500).json({message : "Something went wrong", error : error.message});
        }
    }