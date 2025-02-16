import {verifyJWT} from "../middlewares/auth.middleware.js"
import {Router} from "express"
import {publishVideo,getAllVideos,deleteVideo} from "../controllers/video.controller.js"
import {upload} from "../middlewares/multer.middleware.js"

const router=Router()

router.use(verifyJWT)

router.post("/upload_video", upload.fields([
    { name: "videoFile", maxCount: 1 }, 
    { name: "thumbnail", maxCount: 1 }
]), publishVideo)


router.route("/getAllVideos").get(getAllVideos)

router.route("/c/:videoId").delete(deleteVideo)

export default router