import mongoose from "mongoose";

const databaseConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL || 3000);
    }
    catch (error) {
        console.log (error);
    }
}

mongoose.connection.on("connected", () => {
    console.log("Database successfully connected");
})

export default databaseConnection;