import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path: "./env"
})

connectDB();

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";
// import express from "express"

// const app = express();

// ; (async () => {
//     try {

//         const dbConnect = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

//         app.on("error", (error) => {
//             console.log(error);
//             throw (error);
//         });

//         app.listen(process.env.PORT, () => {
//             console.log(`App is listing at port ${process.env.PORT}`);

//         });

//     } catch (error) {
//         console.log(error);
//     }
// })()