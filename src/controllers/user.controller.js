import {asyncHandler} from "../utils/asyncHandler.js";
import {User} from "../models/users.model.js"
import {ApiError} from "../utils/ApiError.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {upload} from "../middlewares/multer.middleware.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";



const GenerateAccesshAndRefreshTokens=async(UserId)=>{
    try{
        const user=await User.findById(UserId)
        const accessToken=user.generateAccessToken()
        const RefreshToken=user.generateRefreshToken()

        user.refreshToken=RefreshToken
       await  user.save({validateBeforeSave:false})
        return {accessToken,RefreshToken}

    }catch(error){
        throw new ApiError(501,"Error in generating access tokens and refresh tokens")
    }
}




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
    throw new ApiError(400,"Avatar does not received from postman")
    
   }

   
   const avatar=await uploadOnCloudinary(avatarLocalPath);
   const coverImage=await uploadOnCloudinary(coverImageLocalPath);

   


    if(!avatar){
    throw new ApiError(400,"Avatar is required????")
   }

  const user= await User.create({
    fullName,
    avatar: avatar.url || "",
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



const loginUser=asyncHandler(async(req,res)=>{

    const {username,email,password}=req.body

    if(!username && !email){
        throw new ApiError(400,"Username or Email is required!!")
    }
    const user=await User.findOne({
        $or:[{username},{email}]
    })

    if(!user){
        throw new ApiError(404,"User Not Found")
    }

 const isPasswordValid=await user.isPasswordCorrect(password)
 if(!isPasswordValid){
    throw new ApiError(402,"Password in Incorrect")
 }

 const{accessToken,refreshToken}=await GenerateAccesshAndRefreshTokens(user._id)

 const loggedInUser=await User.findById(user._id).select("-password  -refreshToken")

const options={
    httpOnly:true,
    secure:true
}

return res.status(201)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(
    new ApiResponse(200,{
        user:loggedInUser,accessToken,refreshToken
    },
    "User Login Successfully"
)
)
})


const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1
            }

        },
        {
            new:true
        }
    )





    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(202)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(201,{},"User logout successfully")
    )
})





    const refreshAccessToken = asyncHandler(async(req,res)=>{

        try{
            const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken

            if(!incomingRefreshToken){
                throw new ApiError(401,"Unauthorized Request")

            }

            const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)

            const user=await User.findById(decodedToken?._id)

            if(!user){
                throw new ApiError(408,"Invalid Refresh Token")
            }

            if(incomingRefreshToken!==user?.refreshToken){
                throw new ApiError(408,"Refresh Token Expired")
            }
            const options={
                httpOnly:true,
                secure:true
            }
        const {accessToken,newrefreshToken} =await GenerateAccesshAndRefreshTokens(user._id)
        
        return res.status(202)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newrefreshToken,options)
        .json(
            new ApiResponse(
                200,{accessToken,refreshToken:newrefreshToken},
                "refresh Token Generarted Successfully"
            )
        )
       
}catch(error){
    throw new ApiError(401,"Error during generating new refresh token")
}
})




const changeCurrentPassword=asyncHandler(async(req,res)=>{

    const {oldPassword,newPassword}=req.body

    const user=await User.findById(req.user?._id)

      const isPasswordCorrect=await user.isPasswordCorrect(oldPassword)

      if(!isPasswordCorrect){
        throw new ApiError(407,"Password does not  Match")
      }
      user.password=newPassword
      await user.save({validateBeforeSave:false})

      return res.status(200)
      .json(
        new ApiResponse(200,{},"Password updated Successfully")
      )
})





const getCurrentUser=asyncHandler(async(req,res)=>{
    return res.status(200)
    .json(
        new ApiResponse(200,{},"Current User fetched Successfully")
    )
})





const updateAccountDetails=asyncHandler(async(req,res)=>{

    const{email,fullName}=req.body
    if(!email || !fullName){
        throw new ApiError(403,"Above Fields are required")
    }

    const user=await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                fullName:fullName,
                email:email
            }
        },
        {new:true}
    ).select("-password")
    return res.status(200)
    .json(
        new ApiResponse(200,user,"Details updated Successfully")
    )

})





const updateUserAvatar=asyncHandler(async(req,res)=>{
    const avatarLocalPath=req.file?.path

    if(!avatarLocalPath){
        throw new ApiError(402,"Avatar file not found")
    }

    const avatar=await uploadOnCloudinary(avatarLocalPath)
     
    if(!avatar.url){
        throw new ApiError(407,"Error  during uploading on cloudinary")
    }
    const user=await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                avatar:avatar.url
            }
        },
        {new:true}
    ).select("-password")
    return res.status(200)
    .json(
        new ApiResponse(200,user,"avatar updated Successfully")
    )

})




const updateUserCoverImage=asyncHandler(async(req,res)=>{
    const coverImageLocalPath=req.file?.path

    if(!coverImageLocalPath){
        throw new ApiError(402,"Cover Image file not found")
    }

    const coverImage=await uploadOnCloudinary(coverImageLocalPath)
     
    if(!coverImage.url){
        throw new ApiError(407,"Error  during uploading on cloudinary")
    }
    const user=await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                coverImage:coverImage.url
            }
        },
        {new:true}
    ).select("-password")
    return res.status(200)
    .json(
        new ApiResponse(200,user,"Cover Image updated Successfully")
    )

})




const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;
    console.log("Username of channel:", username);

    if (!username?.trim()) {
        throw new ApiError(410, "Username is required");
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: { $size: "$subscribers" },
                channelSubscribedToCount: { $size: "$subscribedTo" },
                isSubscribed: {
                    $cond: {
                        if: {
                            $in: [
                                new mongoose.Types.ObjectId(req.user?._id), 
                                { $map: { input: "$subscribers", as: "s", in: "$$s.subscriber" } } 
                            ]
                        },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ]);

    if (!channel?.length) {
        throw new ApiError(406, "Channel not found");
    }

    return res.status(200).json(
        new ApiResponse(202, channel[0], "User channel fetched successfully")
    );
});



const getWatchHistory=asyncHandler(async(req,res)=>{

    const user=await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(req.user._id)
            }
        },
          {  $lookup:{
                from:"videos",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[
                {
                    $lookup:{
                        from:"user",
                        localField:"owner",
                        foreignField:"_id",
                        as:"owner",
                        pipeline:[
                            {
                                $project:{
                                    fullName:1,
                                    username:1,
                                    avatar:1
                                }
                            }
                        ]
                    }
                    
                },
                {
                    $addFields:{
                        owner:{
                            $first:"$owner"
                        }
                    }
                }
            ]

            }
        }
            
        
    ])

    res.status(200)
    .json(
        new ApiResponse(205,user[0].watchHistory,"Watch History Stored successfully")
    )

})




export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
    }