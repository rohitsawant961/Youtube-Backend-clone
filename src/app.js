import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import subscriptionRouter from "./routes/subscriptions.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import likeRouter  from "./routes/like.routes.js"


const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookieParser())



app.use("/api/v1/users", userRouter)

app.use("/api/v1/subscription", subscriptionRouter)

app.use("/api/v1/videos", videoRouter)

app.use("/api/v1/comment", commentRouter)

app.use("/api/v1/tweet", tweetRouter)

app.use("/api/v1/playlist",playlistRouter)

app.use("/api/v1/like",likeRouter)







export { app }