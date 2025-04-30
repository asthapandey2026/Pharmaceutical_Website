import mongoose from "mongoose";


const MONGO_URI = process.env.MONGO_URI;

const dbConnection = async () => {
    await mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((error) => {
        console.log("Error connecting to database", error);
    });
}


export default dbConnection;