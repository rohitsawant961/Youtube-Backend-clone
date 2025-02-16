import {asyncHandler} from "../utils/asyncHandler.js"
import{ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import mongoose,{isValidObjectId} from "mongoose"

import {Video} from "../models/videos.model.js"
import {uploadOnCloudinary}   from "../utils/cloudinary.js"


const publishVideo = asyncHandler(async (req, res) => {
    
    
    const {title, description, duration } = req.body

    console.log("title",title)
    console.log("description",description)
    console.log("duration",duration)



    if (!title || !description) {
        throw new ApiError(409, "Title and Description are required")
    }

    const videoLocalPath = req.files?.videoFile?.[0]?.path
    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is required")
    }

    console.log("videoLocalPath",videoLocalPath)

    const videoFile = await uploadOnCloudinary(videoLocalPath)
    if (!videoFile) {
        throw new ApiError(404, "Error while uploading the video")
    }

    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path
    if (!thumbnailLocalPath) {
        throw new ApiError(402, "Thumbnail is required for the video")
    }
    console.log("thumbnailLocalPath",thumbnailLocalPath)

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    if (!thumbnail) {
        throw new ApiError(400, "Error during uploading Thumbnail")
    }

    const video = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        title,
        description,
        owner: req.user?._id,
        duration
    })

    console.log("video Id: ",video._id)
    if (!video) {
        throw new ApiError(410, "Error while storing the video data")
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Video and thumbnail uploaded successfully")
    )
})


const getAllVideos = asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 10,
      query = "",
      sortBy = "createdAt",
      sortType = "desc",
      userId,
    } = req.query;
   
    const videos = await Video.aggregate([
      {
        $match:  {
            ...(query ? { title: { $regex: query, $options: "i" } } : {}),
            ...(userId ? { owner: mongoose.Types.ObjectId(userId)} : {}),
          }
      },

      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "videosByOwner",
        },
      },

      {
        $project: {
          videoFile: 1,
          thumbnail: 1,
          title: 1,
          description: 1,
          duration: 1,
          views: 1,
          isPublished: 1,
          owner: {
            id:{$arrayElemAt:["$videosByOwner._id", 0]},
            username:{$arrayElemAt:["$videosByOwner.username", 0]}
          },
        },
      },

      {
        $sort: {
          [sortBy]: sortType === "desc" ? -1 : 1,
        },
      },

      {
        $skip: (page - 1) * parseInt(limit),
      },

      {
        $limit: parseInt(limit),
      },
    ])

    if (!videos?.length) {
      throw new ApiError(404, "Videos are not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, videos, "Videos fetched successfully"));
  })



  const deleteVideo = asyncHandler(async (req, res) => {
    
    const { videoId } = req.params 


    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findByIdAndDelete(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    return res.status(200).json(
        new ApiResponse(200, { videoId: video._id }, "Video deleted successfully")
    )
})





export {publishVideo,
    getAllVideos,
    deleteVideo
}