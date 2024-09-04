import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "All fields must required");
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    })

    if (!tweet) {
        throw new ApiError(500, "Due to some error tweet to publish");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, tweet, "Tweet publish successfully")
        )
})

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const AllTweets = await Tweet.find({
        owner: userId
    });

    if (!AllTweets) {
        throw new ApiError(500, "Due to some error tweet does not fetch");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, AllTweets, "Tweet fetched successfully")
        )
})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    const { content } = req.body;

    if (!tweetId) {
        throw new ApiError(400, "Tweet referenece missing");
    }
    
    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            content
        }
    )
    
    if (!updatedTweet) {
        throw new ApiError(500, "Due to some error tweet does not updated");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedTweet, "Tweet updated successfully")
    )

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}