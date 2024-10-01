import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createPlaylist = asyncHandler(async (req, res) => {
    
    //TODO: create playlist
    const { name, description } = req.body;

    if (!name || !description) {
        throw new ApiError(400, "All fields required");
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id,
    })

    if (!playlist) {
        throw new ApiError(500, "Some error occur while creating playlist");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Playlist created successfully")
        )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params

    const getUserPlaylist = await Playlist.find({
        owner: new mongoose.Types.ObjectId(`${userId}`)
    });
    
    if (!getUserPlaylist) {
        throw new ApiError(500, "Some error occur while geting user playlist");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, getUserPlaylist, "User playlist fetched successfully")
        )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    //TODO: get playlist by id
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(500, "Some error occur while geting playlist");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Playlist fetched successfully")
        )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    console.log("hello from add video");

    console.log(playlistId, " " , videoId)

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $push: { videos: videoId } },
        { new: true }
    )

    if (!playlist) {
        throw new ApiError(500, "Some error occur while adding video playlist");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Video added to playlist successfully")
        )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    const playlist = await Playlist.findById(playlistId);

    const tempvideo = playlist.videos.filter(video => video != videoId);

    playlist.videos = tempvideo;

    const deletedVideo = await playlist.save();

    // const playlist = await Playlist.findByIdAndUpdate(
    //     playlistId,
    //     { $pull: { videos: videoId } },
    //     { new: true } // This returns the updated document
    // );

    if (!deletedVideo) {
        throw new ApiError(500, "Some error occur while removing video playlist");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, deletedVideo, "Video remove from playlist successfully")
        )

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

    if (!deletedPlaylist) {
        throw new ApiError(500, "Some error occur while deleting playlist");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, deletedPlaylist, "Playlist deleted successfully")
        )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body

    //TODO: update playlist

    console.log("inside update")
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            name,
            description
        },
        {
            new: true
        }
    );

    if (!updatedPlaylist) {
        throw new ApiError(500, "Some error occur while updating playlist");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedPlaylist, "Playlist updated successfully")
        )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}