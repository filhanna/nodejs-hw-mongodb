import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { env } from "../utils/env.js";

// Cloudinary configuration
const cloudName = env("CLOUDINARY_CLOUD_NAME");
const apiKey = env("CLOUDINARY_API_KEY");
const apiSecret = env("CLOUDINARY_API_SECRET");

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

// Multer memory storage for handling file uploads in memory
const storage = multer.memoryStorage();

const upload = multer({ storage });

export const uploadPhoto = upload.single("photo");

// Function to upload to Cloudinary
export const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    // Create a readable stream from the buffer and pipe it to Cloudinary
    uploadStream.end(file.buffer);
  });
};
