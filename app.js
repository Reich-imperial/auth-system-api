import express from "express"
import connectDB from "./config/conn.js";
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js"
import uploadRoute from "./routes/uploadRoute.js"
import errorHandler from "./middlewares/errorHandler.js";
dotenv.config()

connectDB()
const app = express()

const port = 5000;

//middleware
app.use(express.json());
app.use(errorHandler)
app.use("/api/auth", userRoutes)
app.use("/api/upload", uploadRoute)

app.listen(port, ()=>{
    console.log(`app listening at port ${port} ....`)
})