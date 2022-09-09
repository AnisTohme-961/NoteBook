import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/dbconnect.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.listen(PORT, async () => {
    await databaseConnection();
    console.log(`Server is running on port ${PORT}`)
})








