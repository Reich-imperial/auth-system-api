import express from "express"
import connectDB from "./config/conn.js";
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js"
dotenv.config()

connectDB()
const app = express()

const port = 5000;

//middleware
app.use(express.json());
app.use("/api/auth", userRoutes)

app.listen(port, ()=>{
    console.log(`app listening at port ${port} ....`)
})