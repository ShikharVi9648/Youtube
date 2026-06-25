import { v2 as cloudinary } from "cloudinary";
import {upload} from "../middlewares/multer.middleware.js"
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (uploadfilePath)=>{
    try {
        if (!uploadfilePath) return null
        //upload file to cloudinary
        const response = await cloudinary.uploader.upload(uploadfilePath,{
            resource_type: "auto",
        })
        // send message
        // console.log("file uploaded successfully",response.url);
        fs.unlinkSync(uploadfilePath);
        return response
    } catch (error) {
        fs.unlinkSync(uploadfilePath)// locally remove file stored in cloudernay or it makes empty temp
    }
    


}

export {uploadToCloudinary}

// const uploadToCloudinary = (filePath, folder = "uploads") =>
//     new Promise((resolve, reject) => {
//         cloudinary.uploader.upload(
//             filePath,
//             { folder },
//             (error, result) => {
//                 // remove local temp file if present
//                 fs.unlink(filePath, () => {});
//                 if (error) return reject(error);
//                 resolve(result);
//             }
//         );
//     });

// const deleteFromCloudinary = (publicId) =>
//     new Promise((resolve, reject) => {
//         cloudinary.uploader.destroy(publicId, (error, result) => {
//             if (error) return reject(error);
//             resolve(result);
//         });
//     });

// export { uploadToCloudinary, deleteFromCloudinary };