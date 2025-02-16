import mongoose,{isValidObjectId} from "mongoose"
import {asyncHandler} from "../utils/asyncHandler"
import {ApiError} from "../utils/ApiError"
import {ApiResponse} from "../utils/ApiResponse"

const toggleVideoLike=asyncHandler(async(req,res)=>{

    const {videoId}=req.params

    if(!videoId){
        throw new ApiError(404,"Video does not Found ")
    }

    

})