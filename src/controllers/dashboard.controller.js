import mongoose, { get } from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const allVideos = await Video.find({
        owner: new mongoose.Types.ObjectId(`${req.user._id}`)
    }).select("views");

    console.log(allVideos);

    if(!allVideos){
        throw new ApiError(500, "Some error occur while fetch details");
    }
    
    const totalViews = 0;

    allVideos.map(element => totalViews + element.views);

    const allSubscribers = await Subscription.find({
        channel: new mongoose.Types.ObjectId(`${req.user._id}`)
    });

    if(!allSubscribers){
        throw new ApiError(500, "Some error occur while fetch details");
    }
    
    const allLikes = await Like.find({
        video: {$in: allVideos.map(element => new mongoose.Types.ObjectId(`${element._id}`))}
    })
    
    if(!allLikes){
        throw new ApiError(500, "Some error occur while fetch details");
    }
    
    const data = {
        totalViews,
        totalVideos: allVideos.length,
        totalSubscribers: allSubscribers.length,
        totalLikes: allLikes.length
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, data, "All stats fetch successfully")
    )

})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const getAllVideos = await Video.find({
        owner: new mongoose.Types.ObjectId(`${req.user._id}`)
    });

    console.log(getAllVideos);

    if(!getAllVideos){
        throw new ApiError(500, "Some error occur while fetch details");
    }
   
    return res.status(200).json(
        new ApiResponse(200, getAllVideos, "All videos fetch successfully")
    )

})

export {
    getChannelStats,
    getChannelVideos
}