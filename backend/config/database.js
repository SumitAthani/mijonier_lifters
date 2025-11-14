import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGODB_URL = process.env.MONGODB_URL;
export const connect = () => {
    mongoose
        .connect(MONGODB_URL, {})
        .then(() => console.log("DB Connection Successfully"))
        .catch((err) => {
            console.error("DB Connection Failed");
            console.error(err);
            process.exit(1);
        });
};