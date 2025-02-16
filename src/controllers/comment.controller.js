import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import {Comment} from "../models/comment.model.js"
import mongoose,{isValidObjectId} from "mongoose"



const addComment=asyncHandler(async(req,res)=>{
    const {videoId}=req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError(402,"Invalid Video id for comment")
    }

    const {content}=req.body
    if(!content){
        throw new ApiError(400,"Content is required")

    }

    const comment=await Comment.create({
        content:content,
        video:videoId,
        owner:req.user?._id
    })

    if(!comment){
        throw new ApiError(400,"Cannot post comment")

    }

    return res.status(200)
    .json(
        new ApiResponse(200,comment,"Comment added successfully")
    )
})



const getComments=asyncHandler(async(req,res)=>{
     const {videoId}=req.params
     const {page=1,limit=10}=req.query

     if(!isValidObjectId(videoId)){
        throw new ApiError(404,"Video id is invalid")
     }


     const videoObjectId = new mongoose.Types.ObjectId(videoId)

     const comments=await Comment.aggregate([
        {
            $match:{
                video:videoObjectId
            }
        },
        {
            $lookup:{
                from: "videos", 
                localField:"video",
                foreignField:"_id",
                as:"CommentsOnVideo"
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"OwnerComments"
            }
        },
        {
            $project:{
                content:1,
                owner: {
                    id:{$arrayElemAt:["$OwnerComments._id", 0]},
                    username:{$arrayElemAt:["$OwnerComments.username", 0]}
                  },
                video:{
                    id:{$arrayElemAt:["$CommentsOnVideo._id", 0]}
                },
                createdAt:1

            }
        }

     ])


     if(comments.length===0){
        throw new ApiError(404,"Comments does not found")
     }

     return res.status(220)
     .json(
        new ApiResponse(200,{totalComments:comments.length,comments},"Comments fetch successfully")
     )
})

const deleteComment =asyncHandler(async(req,res)=>{
    const {commentId}=req.params

    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Comment Id is required")
    }

    const deleteComment=await Comment.findByIdAndDelete(commentId)

    if(!deleteComment){
        throw new ApiError(404,"Cannot delete this comment ")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,{},"Comment deleted successfully")
    )
})


const updateComment=asyncHandler(async(req,res)=>{
    const{commentId}=req.params
    const {content}=req.body

    if(!isValidObjectId(commentId)){
        throw new ApiError(404,"Invalid Comment Id")
    }
    if(!content){
        throw new ApiError(400,"Cannot add Empty comment")
    }

    const updateContent=await Comment.findByIdAndUpdate(commentId,{        
            $set:{
                content:content
            }
    },{new:true})

    if(!updateContent){
        throw new ApiError(400,"Cannot update this comment")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,updateContent,"Comment updated successfully")
    )

})

export{
    addComment,
    getComments,
    deleteComment,
    updateComment
}