import {asyncHandler} from "../utils/asyncHandler.js";
import {User} from "../models/users.model.js"
import {ApiError} from "../utils/ApiError.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {upload} from "../middlewares/multer.middleware.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const registerUser = asyncHandler(async(req, res)=>{

   const {fullName,email,username,password} = req.body
    
    if(
        [fullName,email,username,password].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(401,"All fields are Required!!");
    }

   const existedUser= await User.findOne({
        $or: [{username},{email}]
   })

   if(existedUser){
    throw new ApiError(409,"User Already exits ")
   }

   const avatarLocalPath=req.files?.avatar[0]?.path;
   

   let coverImageLocalPath;

   if(req.files && Array.isArray(req.files.coverImage)&&req.files.coverImage.length>0){
    coverImageLocalPath=req.files.coverImage[0].path;
   }
   
   if(!avatarLocalPath){
    throw new ApiError(400,"Avatar is required!!")
    
   }

   const avatar=await uploadOnCloudinary(avatarLocalPath);
   const coverImage=await uploadOnCloudinary(coverImageLocalPath);


    if(!avatar){
    throw new ApiError(400,"Avatar is required????")
   }

  const user= await User.create({
    fullName,
    avatar: avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password, 
    username:username.toLowerCase()

   })

   const createdUser= await User.findById(user._id).select("-password -refreshToken")

   if(!createdUser){
    throw new ApiError(500,"Registration of user is Failed")
   }
   
   return res.status(200).send(
    new ApiResponse(201,createdUser,"User register successfully")
   )

})


export { registerUser,}