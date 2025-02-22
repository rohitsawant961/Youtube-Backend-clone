import mongoose,{isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist=asyncHandler(async(req,res)=>{
     const {name,description}=req.body

     if(!name || !description){
        throw new  ApiError(400,"Name and description required!!")
     }

     const playlist=await Playlist.create({
        name:name,
        description:description,
        owner:req.user?._id,
      
        
     })

     if(!playlist){
      throw new ApiError(404,"Cannot create rhis Playlist")
     }

     return res.status(200)
     .json(
      new ApiResponse(200,playlist,"Playlist created successfully")
     )


})


const getPlaylists=asyncHandler(async(req,res)=>{

   const {playlistId}=req.params

   if(!playlistId){
      throw new ApiError(404,"Playlist Id  is invalid  ")
   }
    const playlist= await Playlist.findById(playlistId).populate("videos")

    if(!playlist){
      throw new ApiError(404,"Playlist  Not Found ")
    }

    return res.status(200)
    .json(
      new ApiResponse(200,playlist,"Playlist fetched successfully")
    )
})


const addVideo = asyncHandler(async (req, res) => {
   const { playlistId, videoId } = req.params;
 
   if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
     throw new ApiError(400, "Invalid playlist or video ID");
   }
 
   const updatedPlaylist = await Playlist.aggregate([
     {
       $match: {
         _id: new mongoose.Types.ObjectId(playlistId),
       },
     },
     {
       $addFields: {
         videos: {
           $setUnion: ["$videos", [new mongoose.Types.ObjectId(videoId)]],
         }
       },
     },
     {
       $merge: {
         into: "playlists",
       },
     }

   ]);


 
   if (!updatedPlaylist) {
     throw new ApiError(404, "Playlist not found or video already added");
   }
 
   return res
     .status(200)
     .json(
       new ApiResponse(
         200,
         {updatedPlaylist},
         "Video added to playlist successfully"
       )
     );
 })

 const deletePlaylist = asyncHandler(async (req, res) => {
   const { playlistId } = req.params;
   
 
   if (!isValidObjectId(playlistId)) {
     throw new ApiError(400, "Invalid playlist ID");
   }
 
   const deletedPlaylistDoc = await Playlist.findByIdAndDelete(playlistId);
 
   if (!deletedPlaylistDoc) {
     throw new ApiError(404, "Playlist not found");
   }
 
   return res
     .status(200)
     .json(
       new ApiResponse(200, deletedPlaylistDoc, "Playlist deleted successfully")
     );
 })



 const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
   const { playlistId, videoId } = req.params
  
 
   if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
     throw new ApiError(400, "Invalid playlist or video ID");
   }
 
   const updatedPlaylist = await Playlist.findByIdAndUpdate(
     playlistId,
     {
       $pull: {
         videos: new mongoose.Types.ObjectId(videoId),
       },
     },
     {
       new: true,
     }
   );
 
   if (!updatedPlaylist) {
     throw new ApiError(404, "Playlist not found");
   }
 
   return res
     .status(200)
     .json(
       new ApiResponse(
         200,
         updatedPlaylist,
         "Video removed from playlist successfully"
       )
     )
 })


 

export {
   createPlaylist,
   getPlaylists,
   addVideo,
   deletePlaylist,
   removeVideoFromPlaylist
}