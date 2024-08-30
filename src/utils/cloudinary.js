import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadFileOnCloudinary = async (uploadfilePath) => {
    try {
        if (!uploadfilePath) return null;

        const response = await cloudinary.uploader
        .upload(
            uploadfilePath, {
                resource_type: 'auto'
            }
        )

        console.log("File upload successfully ", response.url);

        return response;
    } catch (error) {
        // If file not uploaded successfully then need to remove from local server, otherwise many corrupted file present locally
        fs.unlinkSync(uploadfilePath);  
    }
}

export {uploadFileOnCloudinary}