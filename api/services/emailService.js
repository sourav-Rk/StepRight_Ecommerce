import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth :{
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASS
    }
});

export const sendOTPEmail = async (email , otp, type = "registration") => {
    const subject = 
        type === "forgot-password"
            ? "Your OTP for password Reset"
            : "Your OTP for Registration" ;
    const mailOptions = {
        from : process.env.EMAIL_USER,
        to : email,
        subject : subject,
        text : `Your OTP is ${otp}. It will expires in 1 minutes.`,
    };

    await transporter.sendMail(mailOptions);
};
