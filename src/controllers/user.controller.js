import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { uploadFileOnCloudinary } from "../utils/cloudinary.js"

const registerUser = asyncHandler(async (req, res) => {

    const { username, email, password, fullname } = req.body;
    console.log("req.body: ", req.body);

    if ([username, email, password, fullname].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Allfields are required");
    }

    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username is already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    console.log("req.files: ", req.files);

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadFileOnCloudinary(avatarLocalPath);
    console.log("avatar from cloudinary: ", avatar);
    const coverImage = await uploadFileOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Problem occur in uploading avatar file at cloudinary");
    }

    const user = await User.create({
        fullname,
        username: username.toLowerCase(),
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage.url
    });

    const isUserCreated = User.findById(user._id).select("-password -refreshToken");

    if (!isUserCreated) {
        throw ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, isUserCreated, "User registered successfully")
    )

});

export { registerUser }