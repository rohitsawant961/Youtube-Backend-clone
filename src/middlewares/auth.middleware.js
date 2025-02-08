import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import {User} from "../models/users.model.js"



export const verifyJWT=asyncHandler(async(req,res,next)=>{
    try{
            const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")


        if(!token){
            throw new ApiError(405,"Unauthorized Request")
        }

        const decodeToken=await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        const user=await User.findById(decodeToken?._id).select("-password -refreshToken")

        if(!user){
            throw new ApiError(403,"Invalid Access Token")
        }
        req.user=user;
        next()
    }
    catch(error){
        throw new ApiError("505","Error during Authorization")
    }

    

})