import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const checkAlreadyVideoLiked = await Like.find({
        video: new mongoose.Types.ObjectId(`${videoId}`)
    });

    console.log(checkAlreadyVideoLiked);

    const chechArray = checkAlreadyVideoLiked.filter(element => element.video == videoId);

    console.log(chechArray);

    // If not found data with video id and user id means to add like
    if (chechArray.length == 0) {
        const doVideoLike = await Like.create({
            likedBy: req.user._id,
            video: videoId
        })

        if (!doVideoLike) {
            throw new ApiError(500, "Some error occur while like the video");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, doVideoLike, "Video liked successfully")
            )
    }

    // If found data means already like so disliked it.
    const unLikeVideo = await Like.findOneAndDelete(
        {
            likedBy: req.user._id,
            video: videoId
        }
    );

    if (!unLikeVideo) {
        throw new ApiError(500, "Some error occur while unliking video");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, unLikeVideo, "Video unliked successfully")
        )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    const checkAlreadyCommentLiked = await Like.find({
        comment: new mongoose.Types.ObjectId(`${commentId}`)
    });

    console.log(checkAlreadyCommentLiked);

    const chechArray = checkAlreadyCommentLiked.filter(element => element.comment == commentId);

    console.log(chechArray);

    // If not found data with video id and user id means to add like
    if (chechArray.length == 0) {

        const doCommentLike = await Like.create({
            likedBy: req.user._id,
            comment: commentId
        })

        if (!doCommentLike) {
            throw new ApiError(500, "Some error occur while like the comment");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, doCommentLike, "Comment liked successfully")
            )
    }

    // If found data means already like so disliked it.
    const unLikeComment = await Like.findOneAndDelete(
        {
            likedBy: req.user._id,
            comment: commentId
        }
    );

    if (!unLikeComment) {
        throw new ApiError(500, "Some error occur while unliking comment");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, unLikeComment, "Comment unliked successfully")
        )
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    //TODO: toggle like on tweet

    const checkAlreadyTweetLiked = await Like.find({
        tweet: new mongoose.Types.ObjectId(`${tweetId}`)
    });

    console.log(checkAlreadyTweetLiked);

    const chechArray = checkAlreadyTweetLiked.filter(element => element.tweet == tweetId);

    console.log(chechArray);

    // If not found data with video id and user id means to add like
    if (chechArray.length == 0) {

        const doTweetLike = await Like.create({
            likedBy: req.user._id,
            tweet: tweetId
        })

        if (!doTweetLike) {
            throw new ApiError(500, "Some error occur while like the tweet");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, doTweetLike, "Tweet liked successfully")
            )
    }

    // If found data means already like so disliked it.
    const unLikeTweet = await Like.findOneAndDelete(
        {
            likedBy: req.user._id,
            tweet: tweetId
        }
    );

    if (!unLikeTweet) {
        throw new ApiError(500, "Some error occur while unliking tweet");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, unLikeTweet, "Tweet unliked successfully")
        )
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const getAllLikedVideo = await Like.find({
        likedBy: new mongoose.Types.ObjectId(`${req.user._id}`)
    }).select("video");

    if (!getAllLikedVideo) {
        throw new ApiError(500, "Some error occur while fetching all liked videos");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, getAllLikedVideo, "Liked video fetch successfully")
        )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}