import dotenv from 'dotenv';
import mongoose from 'mongoose'
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import UserRoute from './Routes/userRoute.js'
import AdminRoute from './Routes/adminRoute.js'
dotenv.config()

const app = express();

app.use(express.json());
app.use(cookieParser())

app.use(cors({
  origin: process.env.FRONT_END_URL,
  credentials: true,
}));

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("mongodb connected"))
.catch((error)=>console.log(error))

app.use('/api/users', UserRoute)
app.use('/api/admin', AdminRoute)

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
      success: false,
      message: message,
  });
});
    

const PORT = process.env.PORT

app.listen(PORT,console.log(`running on port ${PORT}`));