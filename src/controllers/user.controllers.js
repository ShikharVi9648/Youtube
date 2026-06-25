import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadToCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { subscription } from "../models/subscription.model.js";


const generateAccessTokenAndRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId);
       if (!user) {
            throw new ApiError(404,"user not found while generating tokens")
        }
        const accessToken= user.generateAccessToken()
        const refreshToken= user.generateRefreshToken()
       user.refreshToken=refreshToken  //save in database
    //    await user.save({validateBeforeSave:false})
       return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"failed in generating the access token and refresh token")
    }
}

const registerUser = asyncHandler(async(req,res)=>{
    // res.status(200).json({
    //     message:"shikhar you have successfully created an api"
    // })

   // write algo for registering a user that what is requited for user registration 
    /*
        1 get user details from frontend 
        2 validatiom - not emplty
        3 check if user is already exist-username ,email
        4 check for image ,for avatar
        5 upload them to cloudinary,avator
        6 create user object - create entry in db
        7 remove password and refresh token field from response
        8 check for user creation 
        9 return res
    */
//1
    const {fullName,username,email,password} =  req.body
    // console.log("email",email);

    // if (fullName==="") {
    //     return new ApiError(400,"fullname will not be empty")
    // }

    //using better aproach for validation
//2
    if([fullName,email,password,username].some((field)=> field?.trim()==="")){
        throw new ApiError(400,"all fields are required")
    }

//3
    const existingUser = await User.findOne({
        $or: [
        {username},
        {email}
    ]
    })
    // console.log(existingUser);
    

    if (existingUser) {
        throw new ApiError(409,"username or email already exist")
    }
//4    //checking file upload / optional chaining 
    const avatarLocalPath = req.files?.avatar?.[0]?.path
    //const coverImageLocalPath = req.files?.coverImage?.[0]?.path // professionally we use this

// use another code for coverImageLocalPath for file uploading  
let coverImageLocalPath;
if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0) {
    coverImageLocalPath = req.files.coverImage[0].path;
}

//     console.log("FILES => ", req.files)
// console.log("BODY => ", req.body)

    if (!avatarLocalPath) {
        throw new ApiError(400,"avatar is required")
    }
//5
    const avatar = await uploadToCloudinary(avatarLocalPath)
    const coverImage = await uploadToCloudinary(coverImageLocalPath)

    //again check cloudinary
    if (!avatar) {
        throw new ApiError(400,"avatar is required")

    }

//6 create user object entry in db

   const user =await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase(),
    })

    //check karo user create hua hai ya nhi 
    
//7
    const createdUser = await User.findById(user._id).select(   //agar select hua hai to
        "-password -refreshToken" //jo jo mujhe data nhi chahiye uske liye minus sign
    ) 

//8

    if (!createdUser) {
        throw new ApiError(500,"something went wrong while registering the user ")
    }

//9 api res
   return res.status(201).json(
   new ApiResponse(
      200,
      createdUser,
      "user registered successfully"
   )
)
})

const loginUser= asyncHandler(async (req,res)=>{
    //req.body ->data
    //username se login or email
    //find the user
    //password check
    //send accesstoken and refresh token
    //cookies
    
    const {username,email,password}=req.body;

    if (!(username || email)) {
        throw new ApiError(400,"username or email is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404,"user not found")
    }
    
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(400,"incorrect password")
    }

   const{accessToken,refreshToken}= await generateAccessTokenAndRefreshToken(user._id)

   //refresh token empty because it has for user for refresh token use this 

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

   //for cookie dekh to skte but modify nhi kar skte
   const options = {
    httpOnly: true,
    secure: true
   }

   res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
    new ApiResponse(200,
        {
            user: loggedInUser,accessToken,refreshToken   //this is the data in apiresponse 
        },
        "user logged in successFully"
    )
   )
})

const logOutUser= asyncHandler(async(req,res)=>{
    //kyuki mere pass user ka access nhi hai to hm ek middleware bana rhe auth name ki 
    await User.findByIdAndUpdate(req.user._id,
        {
        $set: {accessToken:undefined}
        },
        {
            new: true
        })
        const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(new ApiResponse(200,{},"logged out user"))



})

const endpointRefreshAccessToken = asyncHandler( async(req,res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401,"unauthorized request")
    }

    try {
        const decodedToken = await jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401,"invalid refresh token ")
            
        }
    
        if (incomingRefreshToken!==user?._id) {
            throw new ApiError(401,"incorrect refrehs token")
        }
    
        const options={
            httpOnly:true,
            secure:true
        }
    
        const {accessToken,newrefreshToken} = await generateAccessTokenAndRefreshToken(user._id)
    
        return res
        .status(201)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newrefreshToken,options)
        .json(
            new ApiResponse(
                201,
                {accessToken,newrefreshToken},
                "access token regenrated succcessfully"
            )
        )
    } catch (error) {
        throw new ApiError(401,"invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async(req,res)=>{

    const {oldPassword,newPassword} = req.body
    const user = await User.findById(req.user._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(401,"old password is incorrect")
    }

    user.password = new password
    user.save({validateBeforeSave:false})

    return res.status(201)
    .json(
        new ApiResponse(201,{},"user created new password successfully")
    )
})

const getCurrentUser= asyncHandler(async(req,res)=>{
    return res
    .status(201)
    .json(
        new ApiResponse(201,req.user,"user fetched successfully")
    )
    
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {fullName,email} = req.body
    if (!(fullName || email)) {
        throw new ApiError(401,"unauthorized req")

    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{fullName,email}
        },
        {
            new: true
        }
    ).select("-password")

    return res
    .status(201)
    .json(
        new ApiResponse(201,user,"account updated successfully")
    )
})

const changeAvatarLocalpath = asyncHandler(async (req,res)=>{
    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        throw new ApiError(400,"avatar is required")

    }

    const avatar =await uploadToCloudinary(avatarLocalPath)
    if (!avatar.url) {
        throw new ApiError(400,"avatar is required")
    }
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {avatar:avatar.url}
        },
        {new:true}
    ).select("-password")


    return res
    .status(201)
    .json(201,"avatar updated successfully")
})

const changeCoverLocalpath = asyncHandler(async (req,res)=>{
    const coverImageLocalPath = req.file?.path
    if (!coverImageLocalPath) {
        throw new ApiError(400,"avatar is required")

    }

    const cover =await uploadToCloudinary(coverImageLocalPath)
    if (!cover.url) {
        throw new ApiError(400,"cover is required")
    }
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {cover:cover.url}
        },
        {new:true}
    ).select("-password")


    return res
    .status(201)
    .json(201,"cover updated successfully")
})

const getUserChannelProfile =asyncHandler(async(req,res)=>{
    const {username} = req.params
    if (!username.trim()) {
        throw new ApiError(400,"username required")
    }

    const channel = await User.aggregate([  //pipeline
        {
            $match:{
                username: username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from:"subscriptions",  //from subscription model it make small and flural
                localField:"_id",
                foreignField:"channel",  //how many subscriber have 
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from:"subscriptions",  //from subscription model it make small and flural
                localField:"_id",
                foreignField:"subscriber", //here from subscribed to
                as:"subscribedTo"
            }
        },
        {
            $addFields:{    //add in to one object 
                subscribersCount:{
                    $size:"$subscribers"
                },
                channelSubscribedTOCount:{
                    $size:"$subscribedTo"
                },
                isSubscribed:{  //subscriber count 
                    $cond:{
                        if:{$in:[req.user?._id,"$subscribers.subscriber"]},  //
                        then:true,
                        else:false
                    }
                }
            }
        },
        {
            $project:{
                fullName:1,
                username:1,
                email:1,
                subscribersCount:1,
                channelSubscribedTOCount:1,
                isSubscribed:1,
                coverImage:1,
                avatar:1
            }
        }
    ])
    //console.log(channel)

    if (!channel?.length) {
        throw new ApiError(400,"channel not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,channel[0],"channell fetched succcessfully")
    )
})

export {
    registerUser,
    loginUser,
    logOutUser,
    endpointRefreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    changeAvatarLocalpath,
    changeCoverLocalpath,
    getUserChannelProfile
}


 