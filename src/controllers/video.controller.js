import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"
import { uploadFileOnCloudinary } from "../utils/cloudinary.js"
import mongoose from "mongoose"

const publishVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body

    if ([title, description].some((field) => field?.trim() === "")) {
        new ApiError(400, "All fields must required");
    }

    let videoLocalPath;
    let thumbnailLocalPath;


    // Save in local storage
    if (req.files && Array.isArray(req.files.videoFile) && req.files.videoFile.length > 0) {
        videoLocalPath = req.files.videoFile[0]?.path;
    }

    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is missiong")
    }

    if (req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
        thumbnailLocalPath = req.files.thumbnail[0]?.path;
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail file is missiong")
    }

    // Upload on cloudinary
    const video = await uploadFileOnCloudinary(videoLocalPath);
    if (!video) {
        throw new ApiError(501, "Problem occur on uploading video file")
    }


    const thumbnail = await uploadFileOnCloudinary(thumbnailLocalPath);
    if (!thumbnail) {
        throw new ApiError(501, "Problem occur on uploading thumbnail file")
    }

    const videoObj = await Video.create({
        title,
        description,
        videoFile: video.url,
        thumbnail: thumbnail.url,
        duration: video.duration,
        owner: req.user._id
    })

    res
        .status(200)
        .json(
            new ApiResponse(200, videoObj, "Video upload successfully")
        )

})

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

    if (
        [query, sortBy, sortType, userId].some((element) => element?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    console.log(query, sortBy, sortType, userId);

    const pipeline = [
        {
            $match: {
                owner: new mongoose.Types.ObjectId(`${userId}`)
            }
        },
        {
            $match: {
                title: query
            }
        },
        {
            $sort: {
                sortBy: sortType == "true" ? 1 : -1
            }
        }
    ];

    const options = {
        page: 1,
        limit: 10,
    };

    const filterdVideos = await Video.aggregatePaginate(Video.aggregate(pipeline), options);

    res
        .status(200)
        .json(
            new ApiResponse(200, filterdVideos, "Videos fetched successfully")
        )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "Video reference is missing");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(500, "Some error occure while fetching video");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Video data fetched successfully")
        )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    //TODO: update video details like title, description, thumbnail
    if (!videoId) {
        throw new ApiError(400, "Video reference is missing");
    }

    let thumbnailLocalPath;
    if (req.file) {
        thumbnailLocalPath = req.file.path;
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail file is missiong")
    }

    // Upload on cloudinary
    const updatedThumbnail = await uploadFileOnCloudinary(thumbnailLocalPath);

    if (!updatedThumbnail) {
        throw new ApiError(501, "Problem occur on uploading thumbnail file")
    }

    const DataToBeUpdate = {
        $set: {
            thumbnail: updatedThumbnail.url
        }
    };

    if (title !== "") {
        DataToBeUpdate.$set.title = title;
    }

    if (description !== "") {
        DataToBeUpdate.$set.description = description;
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        DataToBeUpdate,
        {
            new: true
        }
    )

    if (!updatedVideo) {
        throw new ApiError(501, "Problem occur on updating thumbnail file")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedVideo, "Thumbnail updated successfully")
        )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    const deletedVideo = await Video.findByIdAndDelete(videoId);

    if (!deletedVideo) {
        throw new ApiError(500, "Some error occur while deleting video");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, deletedVideo, "Video deleted successfully")
    )

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const videoDetails = await Video.findById(videoId);

    if(!videoDetails){
        throw new ApiError(501, "Video not found")
    }

    const updatedVideoPublishStatus = await Video.findByIdAndUpdate(
        videoId,
        {
            isPublish: !videoDetails.isPublish
        },
        {
            new: true
        }
    )

    if (!updatedVideoPublishStatus) {
        throw new ApiError(501, "Problem occur on updating publish status")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedVideoPublishStatus, "Publish updated successfully")
        )
})

export { publishVideo, getAllVideos, getVideoById, updateVideo, deleteVideo,togglePublishStatus }