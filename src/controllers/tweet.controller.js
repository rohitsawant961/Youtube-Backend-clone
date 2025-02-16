import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import mongoose,{isValidObjectId} from "mongoose"
import {Tweet} from "../models/tweet.model.js"


const addTweet=asyncHandler(async(req,res)=>{

    const {content}=req.body

    if(!content){
        throw new ApiError(400,"Cannot post empty tweet")
    }

    const tweet=await Tweet.create({
        content:content,
        owner:req.user?._id
    })

    if(!tweet){
        throw new ApiError(404,"Cannot post tweet")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,tweet,"Tweet posted successfully")
    )
})


const deleteTweet=asyncHandler(async(req,res)=>{

    const {tweetId}=req.params

    if(!isValidObjectId(tweetId)){
        throw new  ApiError(404,"Tweet does not found")
    }

    const tweet=Tweet.findByIdAndDelete(tweetId)

    if(!tweet){
        throw new ApiError(404,"Cannot delete this tweet")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,{},"Tweet deleted successfully")
    )
})


const updateTweet=asyncHandler(async(req,res)=>{
    const {tweetId}=req.params
    const{content}=req.body

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Tweet Id is invalid ")

    }

    if(tweetId!==req.user?._id){
        throw new ApiError(400,"You cannot update this post")
    }
    if(!content){
        throw new ApiError(400,"cannot post Empty tweet ")
    }

    const tweet=await Tweet.findByIdAndUpdate(tweetId,{
        $set:{
            content:content
        }
    },{new:true})

    if(!tweet){
        throw new ApiError(404,"Cannot update the tweet")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,tweet,"Tweet updated successfully")
    )
})


const getAllTweets=asyncHandler(async(req,res)=>{
    
    const {userId}=req.params

    if(!isValidObjectId(userId)){
        throw new ApiError(404,"User Not Found")
    }

    const tweets=await Tweet.find({owner:userId}).sort({createdAt:-1})

    if(!tweets){
        throw new ApiError(404,"Tweets Not found")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,{totalTweets: tweets.length,tweets},"Tweets displayed successfully")
    )
})


export {
    addTweet,
    deleteTweet,
    updateTweet,
    getAllTweets
}