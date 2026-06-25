
// const asynHandler = (handler)=>{
//     (req,res,next)=>{
//         Promise.resolve(handler(req,res,next)).catch((err) => next(err))
//     }
// }

const asyncHandler = (handler)=>async (req,res,next)=>{
    try {
        await handler(req,res,next);
    } catch (err) {
       res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
    })
}
}

export {asyncHandler}