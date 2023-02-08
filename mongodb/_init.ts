import dotenv from "dotenv";
import mongoose from "mongoose";

mongoose.set('strictQuery', true);
dotenv.config();
const MONGOSTORE_CONNECT = async (callback?: () => void) => {
    try {
        mongoose.connect(process.env.MONGODB_URI as string, {
            // useNewUrlParser: true,
        })
        console.log('DB CONNECTED')
        callback && callback();
    } catch (error) {
        console.log(error);
        throw new Error('Error connecting to database')
    }
}

export default MONGOSTORE_CONNECT;