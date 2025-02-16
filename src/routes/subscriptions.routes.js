import {toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannel} from "../controllers/subscription.controller.js"

import {verifyJWT} from "../middlewares/auth.middleware.js"
import {Router} from "express"

const router=Router()

router.use(verifyJWT)

router.route("/c/:channelId").post(toggleSubscription)

router.route("/u/:channelId").get(getUserChannelSubscribers)

router.route("/c/:subscribedId").get(getSubscribedChannel)


export default router
