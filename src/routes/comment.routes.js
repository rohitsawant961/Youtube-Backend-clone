import {Router} from "express"
import {addComment,getComments,deleteComment,updateComment} from "../controllers/comment.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"


const router=Router()

router.use(verifyJWT)

router.route("/addComment/:videoId").post(addComment)

router.route("/getAllComments/:videoId").get(getComments)

router.route("/deleteComment/:commentId").delete(deleteComment)

router.route("/updateComment/:commentId").patch(updateComment)



export default router