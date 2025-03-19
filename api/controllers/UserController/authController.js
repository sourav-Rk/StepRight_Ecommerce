import dotenv from 'dotenv';
dotenv.config();

//Models
import usersDB from "../../Models/userSchema.js";
import otpDB from '../../Models/otpSchema.js';

//otp functions
import  {generateOtp} from '../../utils/generateOtp.js';
import  {sendOTPEmail} from '../../services/emailService.js'

//bcrypt for hashing password
import bcrypt from 'bcrypt';

//validation 
import { validateUser } from '../../Validators/userValidator.js';
import { generateUserAccessToken } from '../../utils/jwtToken/accessToken.js';
import { generateUserRefreshToken } from '../../utils/jwtToken/refreshToken.js';
import { errorHandler } from '../../Middleware/error.js';
import walletDB from '../../Models/walletSchema.js';
import generateReferralCode from '../../utils/generateReferralCode.js';

const salt = 10;



//Generate and send OTP
export const generateAndSendOTP = async (req,res, next) => {
    let {email,firstName, lastName, phone, password, confirmPassword } = req.body;
   
    if(!email){
        return res.status(400).json({message : "Email is required"})
    }

    const {error} = validateUser (req.body);

    if(error){
        return res.status(400).json({ message : error.details[0].message })
    }


    try{
        const userExist = await usersDB.findOne({email});
        if(userExist) return next(errorHandler(409,"Email already exist.Please use a different Email")) ;

        const phoneExist = await usersDB.findOne({phone});
        if(phoneExist) return next(errorHandler(409,"Phone Number already existed . Please use a different Phone Number"));


        await otpDB.deleteOne({email})    

        const otp = generateOtp();

        console.log(otp);
    
        const newOTP = new otpDB({email, otp, formData : req.body});
        await newOTP.save();

        await sendOTPEmail(email,otp);

        res.status(200).json({message : "OTP send successfully",email});
    }
    catch(error) {
        console.log(error);
        return next(errorHandler(500,"Failed to send the otp"));
    }

};

//verify otp and create user
export const verifyOTPAndCreateUser = async(req,res) => {
    const {email, otp} = req.body;

    try{
        const otpRecord = await otpDB.findOne({email});

        if(!otpRecord || otpRecord.otp !== otp.toString().trim()){
            return res.status(400).json({message :"Invalid OTP"});
        }

        
        //Extract form data from OTP recore and save the user

        const {formData} = otpRecord;

        const hashedPassword = await bcrypt.hash(formData.password,10);

        const referralCode = generateReferralCode(formData.firstName,formData.lastName);

        let referredBy = null;

        if(formData.referredBy) {
            const referrer = await usersDB.findOne({referralCode : formData.referredBy });

            if(referrer){
                referredBy = referrer._id;

                const referrerWallet = await walletDB.findOne({userId : referredBy._id});
                if(referrerWallet){
                    referrerWallet.balance+=100;
                    referrerWallet.transactions.push({
                        amount:100,
                        transactionDate: new Date(),
                        transactionType : "Credit",
                        transactionStatus : "Success",
                        description : `Referral bonus for referring ${formData.firstName}`,
                    });
                    await referrerWallet.save();
                }
            }
        }

        const newUser = new usersDB({
            firstName : formData.firstName,
            lastName : formData.lastName,
            email : email,
            phone : formData.phone,
            password : hashedPassword,
            referralCode,
            isActive : true,
            referredBy,
        });

        await newUser.save();

        //create the waller for the user
        await walletDB.create({ userId: newUser._id, balance: 0, transactions: [] });

        if(formData.referredBy){
            const refereeWallet = await walletDB.findOne({userId : newUser._id});
            if(refereeWallet){
                refereeWallet.balance+=50;
                refereeWallet.transactions.push({
                    amount: 50,
                    transactionDate: new Date(),
                    transactionType: "Credit",
                    transactionStatus: "Success",
                    description: "Signup bonus for using a referral code"
                });
                await refereeWallet.save();
            }
        }

        //delete otp record after successfull verification
        await otpDB.deleteOne({_id : otpRecord._id});

        res.status(201).json({message : "User created successfully"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message : "Failed to verify the OTP and create user"});
    }
};

//Resend otp
export const resendOTP = async (req, res) => {
    const { email, formData } = req.body;
  
    try {
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
  
    
      // Generate a new OTP
      const newOtp = generateOtp();
      console.log(newOtp)
  
      // Check if the OTP record is still there
      const otpRecord = await otpDB.findOne({ email });
  
      if (otpRecord) {
        await otpDB.updateOne({ email }, { $set: { otp: newOtp, formData } });
      } else {
        const newOTP = new otpDB({ email, otp: newOtp, formData });
        await newOTP.save();
      }
  
      await sendOTPEmail(email, newOtp);
      return res.status(200).json({ message: "OTP Resent successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to resend OTP" });
    }
  };


//verify login
export const verifyLogin = async (req,res) =>{
    const {email, password} = req.body;

    try{
        const userExist = await usersDB.findOne({email});

        if(!userExist) return res.status(404).json({message : `User doesnt exist!`});

        if(userExist.isBlocked) return res.status(403).json({message : "you are blocked . Please contact Admin"});

        const isPasswordCorrect = await bcrypt.compare(password,userExist.password);

        if(!isPasswordCorrect) return res.status(401).json({message :"Email or Password is wrong"});

        generateUserAccessToken(res,userExist);
        generateUserRefreshToken(res,userExist);

        const userName = userExist.firstName;

        return res.status(200).json({message : "Logged in successfully", userName});
      
    }
    catch(error){
        return res.status(500).json({message : "Something went wrong . please try again"});
    }
} 

//logout
export const logout = async (req,res) =>{
    try{
        res
        .clearCookie('userAccessToken')
        .clearCookie('userRefreshToken')
        .status(200).json({message : "User Logged out successfully"});
    }
    catch(error){
        return res.status(500).json({message :"Something went wrong! Please try again"});
    }
}
  
//Forgot verify email
export const forgotVerifyEmail = async (req,res) => {

    const {email} = req.body;
   
    if(!email) return res.status(400).json({message : "Email is required"});

    try{
        const user = await usersDB.findOne({email});

        if(!user){
            return res.status(400).json({message : "User not found.Please check your email"})
        }

        await otpDB.deleteOne({email});

        const otp = generateOtp();
        console.log(otp);

        const newOTP = new otpDB({
            email,
            otp
        });

        await newOTP.save();
        
        await sendOTPEmail(email,otp,"forgot-password");

        return res.status(200).json({message :"OTP sent successfull"})
        
    }
    catch(error){
        return res.status(500).json({message :"something went wrong . Try again later"})
    }
};

//verify the forgot otp
export const forgotVerifyOtp = async (req,res) =>{
    const {email, otp} = req.body;


    if(!email || !otp){
        return res.status(400).json({message :"Email and OTP are requird"});
    }

    try{
        const storedOTP = await otpDB.findOne({email});

        if(!storedOTP){
            return res.status(400).json({message :"No OTP found for this email"});
        }

        if (storedOTP.expiresAt < new Date()) {
            await otpDB.deleteOne({ email });
            return res.status(400).json({ message: "OTP has expired. Please request a new one." });
        }

        if(storedOTP.otp !== otp.join('')){
            return res.status(400).json({message : "Invalid OTP !"})
        }

        await otpDB.deleteOne({email});

        return res.status(200).json({message :"OTP verified successfully"})
    }
    catch(error){
        return res.status(500).json({message :"something went wrong ! please try again later"})
    }
}


//update the password
export const forgotChangePassword = async (req, res, next) => {
    const { email, newPassword, confirmPassword } = req.body; 
   

    if (!email || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "Email , new password and confirm password are required." });
    }
    
    if(confirmPassword !== newPassword){
        return next(errorHandler(400,"Passwords do not match"));
    }
    

    try {
        
        const otpRecord = await otpDB.findOne({ email });

        const hashedPassword = await bcrypt.hash(newPassword, 10);


        const updatedPassword = await usersDB.updateOne(
            { email },
            { $set: { password: hashedPassword } }
        );



        if (!updatedPassword.matchedCount) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!updatedPassword.modifiedCount) {
            return res.status(400).json({ message: "No changes made" });
        }

        if (otpRecord) {
            await otpDB.deleteOne({ _id: otpRecord._id });
        }

        return res.status(200).json({ message: "Password changed successfully" });

    } catch (error) {
      
        return res.status(500).json({ message: "Something went wrong. Please try again later" });
    }
};


//Google aunthentication
export const googleAuth = async(req,res, next)=>{
    const {name,email} = req.body
  
    try{
      const UserExists = await usersDB.findOne({email});
      if(UserExists)
      {

        generateUserAccessToken(res, UserExists);
        generateUserRefreshToken(res,UserExists)
        return res.status(200).json({success:true,message:"user logged in successfully"})

      }
      else
      {
        const [firstName, ...lastNameArray] = name.split(" ");
        const lastName = lastNameArray.join(" ") || "Doe"; 

        const referralCode = generateReferralCode(firstName,lastName);

        const newUser = new usersDB({
          firstName,
          lastName,
          email,
          phone:generateUniquePhoneNumber(),
          password :generateRandomPassword(),
          referralCode,
          role : "user",
          isBlocked : false,
        })
        const newUserDetail = await newUser.save();
        await walletDB.create({ userId: newUser._id, balance: 0, transactions: [] });

        generateUserAccessToken(res,newUserDetail)
        generateUserRefreshToken(res,newUserDetail)
        res.status(200).json({success:true,message:"account created and logged in successfully"})
      }
    }
    catch(error)
    {
      console.log("error during google aunthentication",error);
      return res.status(500).json({message : "Internal server error.Please try again"})
    }
  }

  // Function to generate a random password
const generateRandomPassword = () => {
return Math.random().toString(36).slice(-8);
};

//generate phone number
const generateUniquePhoneNumber = () => {
   return Math.floor(1000000000 + Math.random() * 9000000000); 
};
  
