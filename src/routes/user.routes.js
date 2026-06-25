import { Router } from "express";
import { loginUser, logOutUser, registerUser,endpointRefreshAccessToken,changeCurrentPassword,getCurrentUser,updateAccountDetails,changeAvatarLocalpath,
    changeCoverLocalpath,getUserChannelProfile
 } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";

const router= Router()

router.route("/register").post(
    upload.fields([ //fieled upload multiple file
        {
            name : 'avatar',
            maxCount: 1
        },
        {
            name: 'coverImage',
            maxCount:1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

//secured route

router.route("/logout").post(varifyJWT,logOutUser)

router.route("/Refresh-Token").post(endpointRefreshAccessToken)
router.route("/Change-Current-pass").post(varifyJWT,changeCurrentPassword)
router.route("/Get-Current-User").post(varifyJWT,getCurrentUser)
router.route("/Update-Account-Details").post(varifyJWT,updateAccountDetails)
router.route("/Change-Avatar-Localpath").post(varifyJWT,changeAvatarLocalpath)
router.route("/Change-Cover-Localpath").post(varifyJWT,changeCoverLocalpath)
router.route("/Get-UserChannel-Profile").post(varifyJWT,getUserChannelProfile)

export default router