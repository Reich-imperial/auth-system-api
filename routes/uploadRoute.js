import express from "express"
import { upload } from "../middlewares/uploadMiddleware.js"
import { validateToken } from "../middlewares/validateToken.js";
import { uploadProfilePicture} from "../controllers/uploads.js";



const router = express.Router();

router.post('/profile-picture/:user_id', validateToken,  uploadProfilePicture, upload.single("profile") )

export default router
