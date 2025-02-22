import {createPlaylist,getPlaylists,addVideo,deletePlaylist,removeVideoFromPlaylist} from "../controllers/playlist.controller.js"
import {Router } from "express"
import {verifyJWT} from "../middlewares/auth.middleware.js"


const router=Router()

router.use(verifyJWT)

router.route("/createPlaylist").post(createPlaylist)

router.route("/getPlaylist/:playlistId").get(getPlaylists)

router.route("/addVideo/:playlistId/:videoId").post(addVideo)

router.route("/deletePlaylist/:playlistId").delete(deletePlaylist)

router.route("/deleteVideoFromPlaylist/:playlistId/:videoId").post(removeVideoFromPlaylist)

export default router
