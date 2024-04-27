import asyncHandler from "express-async-handler"
import { v2 as cloudinary } from "cloudinary";
import User from "../models/User.js";

export const uploadProfilePicture = asyncHandler(async(req, res)=>{
    try {
        const userId = req.params.user_id
        // console.log(userId)

          // Find the user in the database based on the ID
        const user = await User.findOne({ _id: userId });
        // console.log(user)

        // Check if req.user is defined
       if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if req.file is defined
        //console.log(req.file);
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        // Update user's profile picture URL
        user.profile = result.secure_url;
        await user.save();

        res.json({ message: 'Profile picture uploaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});