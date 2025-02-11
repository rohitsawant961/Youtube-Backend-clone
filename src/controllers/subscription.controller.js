import {asyncHandler} from "../utils/asyncHandler.js";
import {Subscription} from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import mongoose,{isValidObjectId} from "mongoose"
import {User} from "../models/users.model.js"


const toggleSubscription=asyncHandler(async(req,res)=>{
    const {channelId}=req.params

  

    const subscribeId=req.user._id
    
    if(!isValidObjectId(channelId)){
        throw new ApiError(404,"Channel does not found")
    }

    const existingSubscription= await Subscription.findOne({
        subscriber:subscribeId,
        channel:channelId
    })
    if(existingSubscription){
        await Subscription.findByIdAndDelete(existingSubscription._id)

        return res.status(206)
        .json(
            new ApiResponse(206,{},"Channel Unsubscribed Successfully")
        )
      }
      
      const user=await User.findById(subscribeId)

      const addSubscription=await Subscription.create({
        subscriber:subscribeId,
        channel:channelId,
        fullName:user.fullName
    })
   
    if(!addSubscription){
        throw new ApiError(403,"Cannot subscribe this channel")
    }
    return res.status(208)
    .json(
        new ApiResponse(206,addSubscription,"Subscribed Successfully")
    )

})




const getUserChannelSubscribers=asyncHandler(async(req,res)=>{
    const {channelId}=req.params 

    console.log("Subscribers channel id ",channelId)

    if(!isValidObjectId(channelId)){
        throw new ApiError(404,"Channel Id is invalid")
    }

    const subscribers = await Subscription.find({ channel: channelId })
        .populate("subscriber", "_id fullName email");


    if(!subscribers){
        throw new ApiError(408,"Subscribers does not found ")
    }

    return res.status(205)
    .json(
        new ApiResponse(209,subscribers,"Subscribers fetched successfully")
    )

})


const getSubscribedChannel=asyncHandler(async(req,res)=>{

    const{subscribedId}=req.params

    if(!isValidObjectId(subscribedId)){
        throw new ApiError(410,"User does not subscribed the Channels")
    }

    const subscribed=await Subscription.find({
        subscriber:subscribedId
    }).populate("channels","_id fullName email")

    if(!subscribed.length()===0){
        throw new ApiError(412,"Channels does not found ")

    }

    return res.status(203)
    .json(
        new ApiResponse(203,subscribed,"Subscribed Channels fetched successfully")
    )



})



export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannel
}