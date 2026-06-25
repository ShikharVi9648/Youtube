import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const dbconnect = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MongoDB_URI}/${DB_NAME}`);
        console.log(`database connected successfully ${connectionInstance.connection.host}`);
        

    } catch (error) {
        console.log("database connection failed in db",error)
        process.exit(1);
    }
}

export { dbconnect}