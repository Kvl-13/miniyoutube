const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((err) => next(err));
    }
}

export { asyncHandler };

// const asyncHandler = (func) => {}

// const asyncHandler = (func) => { () => {} }  == const asyncHandler = (func) =>  () => {}
// const asyncHandler = async(func) => { () => {} }  == const asyncHandler = async(func) =>  () => {}

// const asyncHandler = (fun) => {
//     async (req, res, next) => {
//         try {
//             await fun(req, res, next);
//         } catch (error) {
//             res.status(err.code || 500).json({
//                 status: false,
//                 message: err.message
//             })
//         }
//     }
// };