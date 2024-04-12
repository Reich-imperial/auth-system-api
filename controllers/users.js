import User from "../models/User.js";
import bcrypt from "bcryptjs"
import Jwt from "jsonwebtoken";
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




