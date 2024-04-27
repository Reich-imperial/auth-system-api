import User from "../models/User.js";
import bcrypt from "bcryptjs"
import Jwt from "jsonwebtoken";
import nodemailer from "nodemailer"
import crypto from "crypto"
import asyncHandler from "express-async-handler";

//register
//@desc http://localhost:5000/api/auth/register

export const registerUser = asyncHandler(async (req,res)=>{

    const{username,email,password,profile} = req.body;

    if (!username || !email || !password || !profile) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const userAvailable = await User.findOne({email});
    if (userAvailable) {
        res.status(400)
        throw new Error("User already registered");
    }
    const user = await User.create({
        username,
        email,
        password,
        profile
    });

    if (user) {
        res.status(201).json({_id: user.id, email:user.email});
        
    } else {
        res.status(400);
        throw new Error("User data is not valid");
    }


})

//login
//@desc http://localhost:5000/api/auth/login

export const loginUser = asyncHandler(async (req, res)=>{

    const {email, password} = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!")   
    }
    
    const user = await User.findOne({email});

    if (!user){
        return res.status(404).json({message:"User not found"});
    }

    //compare password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
        return res.status(401).json({message:"Invalid password"});
    }

    const token = user.generateAuthToken();
    res.status(200).json({token});

})

// forgot password 
// @desc http://localhost:5000/api/auth/forgot-password
export const forgotPassword =asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
  
    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
  
    // Send email with reset link
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  
    const mailOptions = {
      from: 'your@example.com',
      to: user.email,
      subject: 'Password Reset',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n`
        + `Please click on the following link, or paste this into your browser to complete the process:\n\n`
        + `http://${req.headers.host}/api/auth/reset-password/${resetToken}\n\n`
        + `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
  
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Password reset email sent' });
  });
  

// Reset Password
export const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    // Find user with reset token
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
  
    // Reset password
    user.password = password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  
    res.json({ message: 'Password reset successfully' });
  });


