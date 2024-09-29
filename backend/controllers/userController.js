import mongoose from "mongoose";
import { User } from "../models/userSchema.js";
import bcrpt from "bcrptjs"
import jwt from "jsonwebtoken"
import isAuthenticated from '../middleware/isAuthenticated.js'
import getDataUri from "../utils/datauri.js";

export const register = async(req,res) =>{
    try{
    const {username,email,password} = req.body;
    if(!username || !email || !password){
        return res.status(401).json({
            message:"Please fill all the requirements",
            success:false
        })
    }
      const user = await User.find({email});
      if(user){
        return res.status(401).json({
            message:"Try with diffferent email",
            success:false
        })
      }
      const hashedPassword = await bcrpt.hash(password,10);
      await User.create({
        username,
        email,
        password:hashedPassword
      })

      return res.status(200).json({
        message:"Account created successfully",
        success:true,
      })
    }catch(error){
     console.log(error);
    }
}

export const login = async(req,res) =>{
    try{
      const {email,password} = req.body;
      if(!email || !password){
        return res.status(401).json({
            message:"Please share all the info...",
            success:false
        });
    }
    let user = await User.find({email});
    if(!user){
        return res.status(401).json({
            message:"User not found with this email",
            success:false
        });
    }
    const isPasswordMatch =  await bcrypt.compare(password,user.password);
    if(isPasswordMatch){
        return res.status(401).message({
           message:"Incorrect  password",
           success:false
        })
    }
      
    user = {
        _id:user._id,
        username:user.username,
        email:user.email,
        profilePicture :user.profilePicture,
        bio :user.bio,
        follower:user.follower,
        following:user.following,
        posts:user.posts
    }

    const token =  jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:'1d'});
    return res.cookie('token',token,{httpOnly:true,sameSite:'strict',maxAge:1*24*60*60*1000}).json({
        message:`Welcome back ${user.username}`,
        success:true,
        user
    })

    }catch(error){
      console.log(error)
    }
};

export const logout = async(req,res) =>{
    try{
      return res.cookie("token","",{maxAge:0}).json({
        message:"logged out successfully",
        success:true
      })
    }catch(error){
        console.log(error);
    }
};

export const getProfile = async(req,res) => {
  try{
    const userId = req.params.id;
    let user = await User.findById({userId});
    return res.status(200).json({
      user,
      success:true
    })

  }catch(errro){
    console.log(error);
  }
};

export const editProfile = async(req,res) => {
  try{
    const userId = req.id;
    const {bio,gender} = req.body;
    const profilePicture = req.file;

    if(profilePicture){
         const fileUri = getDataUri(profilePicture);
    }



  }catch(error){
    console.log(error);
  }
};

