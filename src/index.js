import app from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path: "./env"
})

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log("Some error in server: ", error);
            throw (error);
        });

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port : ${process.env.PORT || 8000}`)
        })
    })
    .catch((error) => {
        console.log("MongoDb connection error : ", error);
    })

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