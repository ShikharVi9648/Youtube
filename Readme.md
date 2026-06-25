<!-- 
first npm init 
folder public/temp/.gitkeep
then src have index.js ,constant.js , app.js 
db/index.js

make package.json file type: "module"
and in script  dev :nodemon -r dotenv.config ./src/index.js

now add using touch method src/controllers,db,middlewares,models,routes,utils
extra thing do npm i -D nodemon ,prettier
in dependency install dotenv,express,mongoose

.env
.gitingnore
.prettierrc
.prettierignore

write const DB_NAME="shikhar yt"
now for connecting db go in db folder/index.js import mongoose and db name 
//db is another contenent so use async and await which is also is try catch 

afteer conection of db /

connection of backend 
npm i cookie-parser cors
npm i cors

after installing these use them using express in app.js file
then made file in utils like asynchandler, apierror,apiresponse where i did every thing which handle the api and server errors

/
today created a models user.model.js and video.model.js
where we write queries and call the Schema and mongoose
now we are installing a package called npm package as /npm i mongoose-aggregate-paginate-v2
video.model.js we inport this 
now installing from npm jsonwebtoken and bcrypt
import in user 
now use of bcrypt is to use in userschema.pre() for password secretly save karneke liye in incripted form
now comparision of pass using bcrypt /userSchema.method.isPasswordCorrect()
now .env file add access token and expiry and refresh token and expiry
and using userSchema.methods.generateAccessToken= fun(){jwt.sign({},{})}
    and also expiry
and using userSchema.methods.generateRefreshToken= and also expiry

/file upload
cloudinery sign up
install in terminal npm i cloudinary
multer install 
now make file in util as cloudinary.js
import v2 from cloudinary and fs from fs
make cloudinary.config({})
after that use cloudinary to upload file using async and awiat and try and.catch

// middleware
now make file in middleware name multer.middleware.js
and import multer from multer
copy paste the multer code from multer.npm web

// controllers
now create a file in controllers as user.controllers.js
and call aysncHandler from utils as import
register user using asyncHandler 

//
now in route make file name user.route.js
and import route from express as we wrote express ass it is write routte 

now go in app.js and import userrouter from router // import userRouter from "./router file and userroute.js"

and use app.use("/api/v1/users",userRouter) method 
after that go in routes/user and write the code for route as router.route("/register ").post(registerUser)
it will.make url as //- https://localhost:8000/api/v1/users/register or login etc

app.js call user=>router=>controller and message will be ok

now install postman in your device
open postman and send post req and got your user.controller response


//now register a user

for registering a user go to controllers and write code for registration 
and then test to postman in body raw json

now use of middleware in registration //jate huye milte jana 

go to route and in .post method add before registerUser upload from multer,as 
router.route("/register").post(
    upload.field([{},{}]),
    registerUser)

now go in user.controller and write validation code 
also import apiError from apiEroor
now for checking user alreaady existing import User from user model

import  user model from model
and use User.findOne({$or:[{},{}]}) here multiple object can be checked
check this using if condition and throw api error

now file upload use optional chaining 
req.files?.avatar[0]?.path
as it is for coverImage
 and check avatar path using if condition

 //create user object entry in db
 using User.create({fullName,email,etc,avatar:avatar.url,coverImage:coverImage?.url || ""}) use await because db is in another contenent

 now user create hua hai na nhi uske liye check aur agar hua hai to select karo as
 await User.findById(user).select("-password")

 now check this created user hai ya nhi 
 using if condition and throw server error

 now import api response in user.controllers   
 aur response ko syntax likho 
 in usercontroller we can use an extra method of uploading a file 
 
now go in cloudinary and write fs.unlinksync(uploadfile path ) to remove the file path 

//now create login

first write algo 
then exicute them 
like first body 
then email or pass 
check karo kisse ho rha login 
then pass check karo
for access and refresh token create a method in global variable name as generaateAceessTokenAndRefresh token in user.controller
in which save the refresh token in database
now add this in login  
abhi bhi refresh token empty hoga to use dikhane ke liye loggedinuser ka use hua hai 
uske bad response return kara do

//logOutUsser
for logout create a middleware naem auth.middleware

in middleware create a token 
then verify the token and accesstokensecret form env 
user find karo hai to thik vrna error

//go in route create new route for login
then for logout
for logout go in user.controller
access the user
//await User.findIdandupdate(user._id,{$set:{acceshToken:undefined},{new:true}})

ab option ko lao const options={
    secure: true
    httpOnly:true
}

return response
.stsatus(200)
.clearCookies("acceshToken",option) aise hi refreshToken
.json(200,{},"message")

// ab hm ek end point bana rhe agar access token expire ho jaye aur fornt end wale ko 401 request aaye to vo ek naya access token create kar sake using a refesh token 

endponitRefreshAccessToken=asyncHandler()
esme hm sbse pahle refresh token ko nikalenge
cosnt  inconmigrefreeshtoken = like req.cookies.refreshToken || nhi to body se req.body.refrehsToken

check karo 
 verify karao ki ye token aur jo secret token ke sath aur store karo decoded token 

 decoded token se useer._id nikal lo user me save kar lo

 check karo user

 ab check karo incoming refreshtoken aur user?.refreshtoken !== hai to error throw kara do

 const {acceshtoken,refreshtoken}= await generatee refresh token using generateacceshandrefeshtoken(user._id)

 eeske bad res send karo with cookie

 // ab ek naaya model bana rhe subscription name ki

 // ab user.controller me ek async handler banayenge name changeCurrentPassword jisme hm first body me se old and new password lenge 

 ab user ki id nikalenge const user = User.findByID(user._id)
 cosnt ispasswordcorrect = user.ispasswordcorrect(password)
 if condition for password correct 
 user.password = new password 

 res send kaar do

 //ab getcurrent user find karna ke liye

 fir se async handleer banayenge
 getCurrentUser

 aur res me data me req.user send kar denge jisse user find ho jayega 

 //updateAccountDetails

 same mail and full name change karenge set use kar ke 

 //changeAvatarLocalpath
 //changeCoverLocalpath 

 esme bhi set method ka user karenge aur upload kar denge 

// now for counting subscriber and channel

use pipeline 

in pipeline wee use [{$lookup:{
from:
localfield:
foreignfield:
as:
}}]

it gives an array 
for finding 1 element from this array use $addfields:{userdatils:{$arrayElement:[$userdetials]}}

//in user controllers make 
    getUserChannelProfile

    use req.params to get channel url from username
    and check user exist or not

//now user aggregation 
   


 -->
