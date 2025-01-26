import mongoose,{Schema} from "mongoose"

const subscriptionSchema=new Schema({
    id:{
        type:String,
        required:true
    },
    subscriber:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    channel:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Subscription=Schema.model("Subscription",subscriptionSchema)