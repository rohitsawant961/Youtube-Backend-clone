import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import subscriptionRouter from "./routes/subscriptions.routes.js"
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









export { app }