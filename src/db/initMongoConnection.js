import { MongoClient } from "mongodb";
import mongoose from "mongoose";

const mongodbUser = process.env.MONGODB_USER;
const mongodbPassword = process.env.MONGODB_PASSWORD;
const mongodbUrl = process.env.MONGODB_URL;
const database = process.env.MONGODB_DB;
                                                                                                                                   
export async function initMongoConnection() {
    try {
        mongoose.connect(`mongodb+srv://${mongodbUser}:${mongodbPassword}@${mongodbUrl}/${database}`);
        console.log("Mongo connection successfully established!");
    } catch (err) {
        console.log(err.stack);
    }
}