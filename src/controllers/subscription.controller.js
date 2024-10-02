import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// TODO: toggle subscription
const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    console.log(req.user._id);

    const checkAlreadySubscriber = await Subscription.find({
        subscriber: new mongoose.Types.ObjectId(`${req.user._id}`)
    }).select("channel");

    console.log(checkAlreadySubscriber);

    const chechArray = checkAlreadySubscriber.filter(element => element.channel == channelId);

    console.log(chechArray);

    if (chechArray.length == 0) {
        const makeSubscribers = await Subscription.create({
            subscriber: req.user._id,
            channel: channelId
        })

        if (!makeSubscribers) {
            throw new ApiError(500, "Some error occur while subscribing channel");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, makeSubscribers, "Channel subscribed successfully")
            )
    }

    const unsubscribed = await Subscription.findOneAndDelete(
        {
            subscriber: req.user._id,
            channel: channelId
        }
    );

    if (!unsubscribed) {
        throw new ApiError(500, "Some error occur while unsubscribing channel");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, unsubscribed, "Channel unsubcribed successfully")
        )
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    const channelSubscribers = await Subscription.find(
        {
            channel: new mongoose.Types.ObjectId(`${subscriberId}`),
        }
    ).select("subscriber");

    console.log(channelSubscribers)

    if (!channelSubscribers) {
        throw new ApiError(500, "Some error occur while getting channels subscribers");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, channelSubscribers, "Subscribers fetch successfully")
        )
})

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    const subscribedChannel = await Subscription.find({
        subscriber: new mongoose.Types.ObjectId(`${channelId}`)
    })

    if (!subscribedChannel) {
        throw new ApiError(500, "Some error occur while getting subscribed channel");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, subscribedChannel, "Channel fetch successfully")
        )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}