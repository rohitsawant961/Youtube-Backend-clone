import {Router} from "express"
import { addTweet,deleteTweet,updateTweet,getAllTweets} from "../controllers/tweet.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router=Router()

router.use(verifyJWT)

router.route("/addTweet").post(addTweet)

router.route("/deleteTweet/:tweetId").delete(deleteTweet)

router.route("/updateTweet/:tweetId").patch(updateTweet)

router.route("/getUserTweet/:userId").get(getAllTweets)

export default router