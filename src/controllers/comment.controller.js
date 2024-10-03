import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const getAllComment = await Comment.find({
        video: new mongoose.Types.ObjectId(`${videoId}`)
    })

    if (!getAllComment) {
        throw new ApiError(500, "Error while fetching comment of the video");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, getAllComment, "Comments fetched successfully")
        )
})

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;

    const createComment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    })

    if (!createComment) {
        throw new ApiError(500, "Error while adding comment to the video");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, createComment, "Comment added successfully")
        )
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    const updateComm = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content
            }
        }, {
        new: true
    })

    if(!updateComm){
        throw new ApiError(500, "Error occur while updating comment");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updateComm, "Comment updated successfully")
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    
    const { commentId } = req.params;

    const deleteComm = await Comment.findByIdAndDelete(commentId);

    if(!deleteComm){
        throw new ApiError(500, "Error occur while deleting comment");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, deleteComm, "Comment deleted successfully")
    )
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}