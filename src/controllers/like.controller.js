import mongoose,{isValidObjectId} from "mongoose"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {Like} from "../models/like.model.js"

const toggleVideoLike=asyncHandler(async(req,res)=>{

    const {videoId}=req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError(404,"Video does not Found ")
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user?._id
      })
    
      if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)
    
        return res
          .status(200)
          .json(new ApiResponse(200, existingLike, "Video unliked successfully"));
      }
    
      const likeVideo = await Like.create({
        video: videoId,
        likedBy: req.user?._id,
      })

     
    
      return res.status(201)
        .json(new ApiResponse(201,{
            likeVideo
        } , "Video liked successfully"))

})


const toggleCommentLike=asyncHandler(async(req,res)=>{

    const{commentId}=req.params

    if(!isValidObjectId(commentId)){
        throw new ApiError(404,"Comment Not Found")
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id
      })
    
      if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)
    
        return res
          .status(200)
          .json(new ApiResponse(200, existingLike, "Comment unliked successfully"));
      }

    const likeComment=await Like.create({
        comment:commentId,
        likedBy: req.user?._id
    })

    return res.status(201)
        .json(new ApiResponse(201,likeComment, "Comment liked successfully"))



})


const toggleTweetLike=asyncHandler(async(req,res)=>{

    const{tweetId}=req.params

    if(!isValidObjectId(tweetId)){
        throw new ApiError (404,"Tweet Not Found")
    }

    const existingLike=await Like.findOne({
        tweet: tweetId,
        likedBy: req.user?._id
    })

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)
    
        return res
          .status(200)
          .json(new ApiResponse(200, existingLike, "Tweet unliked successfully"));
      }

      const likeTweet=await Like.create({
        tweet:tweetId,
        likedBy: req.user?._id
    })

    return res.status(201)
        .json(new ApiResponse(201,likeTweet, "Tweet liked successfully"))

    
})

const getLikedVideos=asyncHandler(async(req,res)=>{
    const likedVideos=await Like.find({
        likedBy: req.user?._id,
        video: { $exists: true },
  }).populate("video", "_id title url")

if(!likedVideos){
    throw new ApiError(404,"Cannot found Liked Videos")
}

return res.status(200)
.json(
    new ApiResponse(200,likedVideos,"Liked videos fetched successfully")
)


})




export{
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}